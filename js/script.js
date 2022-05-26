
verifyLength({ source: "./img/def-img.jpg", target:  ".img-01"});

$(function(){
    console.log("제이쿼리 작동됨");
})


/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ LEFT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

// 애니매이션 중 클릭 방지
let animation_state = "waiting";
let animation_stack = 0; 

// 사용자 설정 레이아아웃 변경
document.getElementById("switch").addEventListener("click", function(){
    let prc = animationProcessCheck();
    if(prc === true) return;

    const layout = varifyLayout();
    const other_layout = layout === "default" ? "cstm" : "default";
    const icon = document.querySelector(".lt-cont .icon-bg > i");

    if(icon.style.transform == ""){
        icon.style.transform = "rotate(360deg)";
    }else{
        icon.style.transform = "";
    }

    handleState({ stage: "standby", layout: other_layout });
});

// 기본 레이아웃으로 진행 시
document.getElementById("setDefImg").addEventListener("click", function(){
    const def_img = { src: "./img/def-img.jpg", location: document.querySelector(".img-01 #selected-img") };
    let prc = animationProcessCheck();
    if(prc === true) return;

    handleImgUpload({ select_type: "default" }, { src: def_img.src })
    .then(function(result){
        handleState({ stage: "init", layout: "default", option: result });
    });
});

/* 
    stage: stnadby → init → pending → finished
    layout: 1. default | 2. cstm | 3. wait
*/
let state = { stage: "standby", layout: "default" };

function handleState(data){
    const stage = data.stage || state.stage;
    const layout = data.layout || state.layout;
    const option = data.option;

    state.stage = stage;
    state.layout = layout;

    return new Promise (function(resolve){
        if(state.stage === "standby" && state.layout === "default"){
            fadeIn({ target: ".lt-cont .icon-bg + span", stagger: false });
            fadeOut({ target: ".icon-wrap.cstm", stagger: true })
            .then(function(){
                animation_state = "processing";
                fadeIn({ target: ".icon-wrap.default", stagger: true });
            });
        }
        if(state.stage === "standby" && state.layout === "cstm"){ 
            fadeOut({ target: ".lt-cont .icon-bg + span", stagger: false });
            fadeOut({ target: ".icon-wrap.default", stagger: true })
            .then(function(){
                animation_state = "processing";
                fadeIn({ target: ".icon-wrap.cstm", stagger: true });
            });
        }
        if(state.stage === "init"){
            const prc_wait = document.querySelector(".prc-wrap.wait");
            const lt_layouts = document.querySelectorAll(".lt-cont .icon-wrap");
            const results = document.querySelectorAll("#results-wrap li");
            let hide, fade_out, fade_in;
            let src = data.option;
            let img_target;
            const callBackFunc = function(data){
                lt_layouts.forEach(function(item){
                    if(!item.classList.contains("dspl-n")){
                        if(item.classList.contains("default")) hide = ".default";
                        if(item.classList.contains("cstm")) hide = ".cstm";
                    }
                });

                fadeOut({ target: "#switch", stagger: false });
                fadeOut({ target: hide, stagger: true })
                .then(function(){
                    const callBackFunc = function(data){
                        classifyImg({ target: data.target })
                        .then(function(result){
                            setLoadingAnimation({ target: data.target, state: "finish" });
                            createDot({ target: data.target, result });
                            // createIcon(result);
                        });
                    }
                    animation_state = "processing";
                    fadeIn({ 
                        target: ".icon-wrap.wait", 
                        stagger: true,
                        func: callBackFunc,
                        param: { target: data.target }
                    });
                });
            }

            verifyLength(option);

            const dots = document.querySelectorAll(".dot");
            dots.forEach(function(item){
                item.remove();
            });

            if(results.length !== 0){
                document.getElementById("results-wrap").innerHTML = "";
                document.getElementById("results-wrap").style.height = 0;
            }

            if(!prc_wait.classList.contains("dspl-n")){
                fade_out = ".prc-wrap.wait";
                fade_in = ".prc-wrap.show-img";
                stagger_state = true;
                img_target = ".img-01";
            }else{
                fade_out = option.target === ".img-01" ? ".img-02" : ".img-01";
                fade_in = option.target;
                stagger_state = false;
                img_target = fade_in;
            }

            // alert(`fade_out: ${fade_out}\nfade_in: ${fade_in}\nstagger_state: ${stagger_state}`);
            
            fadeOut({ target: fade_out })
            .then(function(){
                animation_state = "processing";
                fadeIn({ 
                    target: fade_in,
                    stagger: stagger_state,
                    func: callBackFunc,
                    param: { target: img_target, source: src }
                });

                setLoadingAnimation({ target: fade_in, state: "pending" }); // 로딩 시작
            });
        }
        if(state.stage === "finished"){ 
            fadeOut({ target: ".icon-wrap.wait", stagger: true })
            .then(function(){
                animation_state = "processing";
                fadeIn({ target: "#switch", stagger: false });
                fadeIn({ target: ".icon-wrap.cstm", stagger: true });
            });
        }
        resolve("");
    });
}

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ANIMATION ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

function varifyLayout(){
    const layouts = document.querySelectorAll(".lt-cont .icon-wrap");
    let target;

    layouts.forEach(function(item){
        if(!item.classList.contains("dspl-n") || getComputedStyle(item).display !== "none") target = item.classList; 
        if(String(target).indexOf("default") > -1) target = "default";
        if(String(target).indexOf("default") === -1) target = "cstm";
    });

    return target;
}

function animationProcessCheck(){
    let prc;
    if(animation_state === "processing" && animation_stack !== 0) prc = true;
    else prc = false;
    
    return prc;
}

function fadeIn(obj){
    const target = document.querySelector(obj.target);

    target.classList.remove("dspl-n");
    if(target.getAttribute("id") == "switch"){
        target.classList.add("dspl-f");
    }else{
        target.classList.add("dspl-b");
    }

    return new Promise((resolve) => {

        if(obj.stagger === true){
            // alert(`[1] fadeIn target: ${obj.target}`);
            gsap.fromTo(target.children, { opacity: 0, y: -10 }, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.in",
                onStart: function(){ animation_stack++; },
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    // console.log("===================== 1. fadeIn target: "+target.className+" =====================");
                    // alert(`[2] fadeIn target: ${obj.target}`);
                    try{
                        if(obj.func !== undefined) obj.func(obj.param);
                    }catch{
                        alert("콜백함수를 실행할 수 없습니다.");
                    }
                    
                    setTimeout(() => { 
                        animation_stack--;
                        animation_state = "waiting";
                    }, 300);
                    resolve("");
                }
            });
        }else{
            // alert(`[2] fadeIn target: ${obj.target}`);
            // if(obj.func !== undefined) obj.func(obj.param);

            gsap.fromTo(target, { opacity: 0, y: -10 }, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "back.in",
                onStart: function(){ animation_stack++; },
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    // console.log("===================== 2. fadeIn target: "+target.className+" =====================");                   
                    // alert(1)

                    try{
                        if(obj.func !== undefined) obj.func(obj.param);
                    }catch(error){
                        alert(`error: ${error} \n콜백함수를 실행할 수 없습니다.`);
                    }

                    setTimeout(() => { 
                        animation_stack--;
                        animation_state = "waiting";
                    }, 300);
                    resolve("");
                }
            });
        }
    });
}

function fadeOut(obj){
    const target = document.querySelector(obj.target);

    return new Promise((resolve) => {
        if(obj.stagger === true){
            // 애니이션이 여러개일 경우
            // console.log(`[1] fadeOut target: ${obj.target}`);
            // alert(`[1] fadeOut target: ${obj.target}`)
            gsap.to(target.children, {
                duration: 0.5, 
                opacity: 0, 
                y: -10, 
                stagger: 0.1,
                ease: "back.in",
                onStart: function(){ animation_stack++; },
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    // console.log("===================== 1. fadeOut target: "+target.className+" =====================");
                    // alert(`[1] fadeOut target: ${obj.target}`)
                    gsap.set(target.children, { y: 0 }); // 초기화

                    target.classList.remove("dspl-b");
                    target.classList.remove("dspl-f");
                    target.classList.add("dspl-n");
    
                    setTimeout(() => { 
                        animation_stack--;
                        animation_state = "waiting";
                    }, 300);
                    resolve("");
                },
            });
        }else{
            // 애니메이션이 하나일 경우
            // console.log(`[2] fadeOut target: ${obj.target}`);
            // alert(`[2] fadeOut target: ${target.className}`);
            gsap.to(target, {
                duration: .5, 
                opacity: 0, 
                y: -10, 
                ease: "back.in",
                onStart: function(){ animation_stack++; },
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    // console.log("fade out~!!");
                    // console.log(target.children);
                    // console.log("===================== 2. fadeOut target: "+target.className+" =====================");
    
                    gsap.set(target.children, { y: 0 }); // 초기화

                    target.classList.remove("dspl-b");
                    target.classList.remove("dspl-f");
                    target.classList.add("dspl-n");
    
                    setTimeout(() => { 
                        animation_stack--;
                        animation_state = "waiting";
                    }, 300);
                    resolve("");
                },
            });
        }

    });
}

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ IMAGE UPLOAD, DRAG ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

const drag_zone = document.querySelector(".drop-zone");
const input = document.getElementById("file");

// 디렉토리에서 업로드하는 경우
input.addEventListener("change", function(){
    const files = input.files;

    handleImgUpload({ select_type: "cstm" }, files)
    .then(function(result){
        verifyLength(result);
        handleState({ stage: "init", layout: "cstm", option: result });
    });
});

drag_zone.addEventListener("dragover", function(event){
    event.preventDefault();
    drag_zone.classList.add("drag-over");;
});

drag_zone.addEventListener("dragleave", function(event){
    event.preventDefault();
    drag_zone.classList.remove("drag-over");
});

// 드래그로 업로드하는 경우
drag_zone.addEventListener("drop", function(event){
    event.preventDefault();
    const files = event.dataTransfer.files;

    drag_zone.classList.remove("drag-over");

    handleImgUpload({ select_type: "cstm" }, files)
    .then(function(result){
        handleState({ stage: "init", layout: "cstm", option: result });
    });
});

let flag = true;
function handleImgUpload(type, file){
    return new Promise((resolve) => {
        const img_boxes = document.querySelectorAll(".prc-wrap.show-img .img-box");
        let preview, visible, src;

        if(flag === true){
            visible = ".img-01";
            flag = false;
        }else{
            img_boxes.forEach(function(item){
                if(item.classList.contains("dspl-n")){
                    visible = item.classList.contains("img-01") ? ".img-01" : ".img-02";
                }
            });
        }

        preview = document.querySelector(visible + " #selected-img");

        if(type.select_type === "default"){
            // console.log(file.src);
            src = file.src;

            preview.setAttribute("src", src);
            resolve({ source: src, target:  visible});
        }
        if(type.select_type === "cstm"){
            const reader = new FileReader();
            // console.log(file);
    
            reader.readAsDataURL(file[0]);
            reader.onload = function(event){
                src = event.target.result;
                preview.src = "";
                preview.src = src;

                resolve({ source: src, target:  visible});
            }
        }
    });
}

function setLoadingAnimation(obj){
    const verify = obj.target === ".prc-wrap.show-img" ? "fst" : "sec";
    let fade_out;
    let fade_in;

    if(verify === "fst"){
        fade_out = verify === "fst" ? ".img-02" : ".img-01";
        fade_in = verify === "fst" ? ".img-01" : ".img-02";
    }
    if(verify === "sec"){
        fade_out = obj.target === ".img-01" ? ".img-02" : ".img-01";
        fade_in = obj.target;
    }

    // alert(`fade_out: ${fade_out} | fade_in: ${fade_in} | 숨길녀석: ${fade_out + " .loading-box"}`);

    const svg = document.querySelectorAll(fade_in + " svg");
    svg.forEach((item) => {
        item.classList.remove("dspl-b");
        item.classList.add("dspl-n");

        if(obj.state === "pending" && item.classList.contains("pending")){
            fadeIn({ target: fade_in + " .loading-box", stagger_state: false });
            item.classList.add("dspl-b");
        }

        if(obj.state === "finish" && item.classList.contains("finish")){
            item.classList.add("dspl-b");
            document.querySelector(fade_in + " .info").innerText = "Finished";
        }

        if(obj.state === "retry" && item.classList.contains("retry")){
            setTimeout(() => {
                item.classList.add("dspl-b");
                document.querySelector(fade_in + " .info").innerText = "Please Retry";
            }, 300);
        }
    });
}

function verifyLength(obj){
    const target = obj.target;
    const imges = document.querySelectorAll(".img-box");
    let img = new Image();
    let width, height, alg;

    img.src = obj.source;
    img.onload = function(){
        width = img.width;
        height = img.height;
    
        alg = (width > height) ? "hrz" : "vrt";

        imges.forEach(function(item){
            if(item.classList.contains(target.replace(".", ""))){
                document.querySelector(target).classList.add(alg);
            }else{
                setTimeout(() => {
                    item.classList.remove("vrt");
                    item.classList.remove("hrz");
                }, 500);
            }
        });
    
        // alert(obj.source);
        // alert(`[2] 길이계산 대상: ${obj.target} | width: ${width} | height: ${height} | alg: ${alg}`);
        // console.log(`[함수] verifyLength`);
        return;
    }
}

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ DETECT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

const list_area = document.getElementById("results-wrap");
const dot_area = document.querySelectorAll(".img-box");

// 리스트 hover on
list_area.addEventListener("mouseover", function(e){
    if(e.target.classList.contains("list")){
        handleHoverAnimation({
            target: e.target,
            state: "active"
        });
    }
});

// 리스트 hover off
list_area.addEventListener("mouseleave", function(e){
    handleHoverAnimation({
        target: e.target,
        state: "inactive"
    });
});

// 점 hover on
dot_area.forEach(function(item){
    item.addEventListener("mouseover", function(e){
        let str = e.target.classList.contains("dot") ? "active" : "inactive";

        handleHoverAnimation({
            target: e.target,
            state: str
        });
    });
});

function handleHoverAnimation(obj){
    const verify = obj.target.classList.contains("dot") || obj.target.getAttribute("id") == "selected-img" ? "list" : "dot";
    const target = document.querySelectorAll("."+verify);
    const current_idx = obj.target.getAttribute("data-idx");

    target.forEach((item, other_idx) => {
        item.classList.remove("show");
        if(current_idx == (other_idx + 1)){

            if(obj.state === "active") item.classList.add("show");
            if(verify === "dot"){
                // dot animation
                gsap.from(item, {
                    duration: 1,
                    scale: 0.5, 
                    opacity: 0, 
                    stagger: 0.2,
                    ease: "elastic", 
                    force3D: true,
                    onComplete: function(){
                        gsap.set(item, { scale: 1, opacity: 1 });
                    }
                });
            }
        }else{
            if(obj.state === "inactive") item.classList.remove("show");
        }
    });
}

let detect_result = [];
function classifyImg(obj){
    const img = document.querySelector(obj.target + " #selected-img");
    detect_result = []; // 초기화
    console.log(`□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□ obj.target: ${obj.target} □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□`);
    
    return new Promise(function(resolve){
        cocoSsd.load().then(model => {
            model.detect(img).then(predictions => {
                console.log("predictions:", predictions);

                if(predictions.length !== 0){
                    for (let i = 0; i < predictions.length; i++) {
                        // 감지한 물체에 대한 정보
                        let name = predictions[i].class;
                        let className = getIconClassName(name);
                        if(className !== undefined){
                            let x = Math.ceil(predictions[i].bbox[0]);
                            let y = Math.ceil(predictions[i].bbox[1]);
                            let width = Math.ceil(predictions[i].bbox[2]);
                            let height = Math.ceil(predictions[i].bbox[3]);

                            detect_result.push({ name, className, x, y, width, height, idx: i+1 });
                            // console.log(`name: ${name}\nclassName: ${className}\nx: ${x}\ny: ${y}\nwidth: ${width}\nheight: ${height}`);
                        }
                    }
                    resolve(detect_result);
                }else{
                    setLoadingAnimation({ target: obj.target, state: "retry" });
                    handleState({ stage: "finished" });
                }
            });
        });
    });
}

class Dot {
    constructor(x, y, width, height, name, idx){
        this.x = (width / 2) + x; 
        this.y = (height / 2) + y;
        this.width = 15;
        this.height = 15;
        this.color = "#3AB8FF";
        this.name = name;
        this.idx = idx;
    }

    create(location){
        const dot = document.createElement("div");
        const imgBox = document.querySelector(location);

        dot.classList.add("dot");
        dot.style.position = "absolute";
        dot.style.left = this.x + "px";
        dot.style.top = this.y + "px";
        dot.style.visibility = "hidden";
        dot.setAttribute("data-idx", this.idx);
        dot.setAttribute("name", this.name);

        imgBox.appendChild(dot);
    }
}

function createDot(obj){
    
    obj.result.forEach(function(item){
        let dot = new Dot(
            item.x, 
            item.y, 
            item.width, 
            item.height, 
            item.name, 
            item.idx
        );
        dot.create(".img-box"+obj.target);
    });

    const dots = document.querySelectorAll(obj.target + " .dot");

    setTimeout(() => {
        dots.forEach(function(item){
            item.style.visibility = "visible";
        })
        gsap.from(obj.target +" .dot", {
            duration: 1,
            scale: 0.5, 
            opacity: 0, 
            delay: 0.5, 
            stagger: 0.2,
            ease: "elastic", 
            force3D: true,
            onComplete: function(){
                createList(obj);
            }
        });
    }, 300);
}

function createList(obj){
    const place = document.getElementById('results-wrap');

    obj.result.forEach(function(item, idx){
        let elem = document.createElement("li");
        elem.classList.add("list");
        elem.innerText = item.name;
        elem.setAttribute("data-idx", idx+1);
        elem.setAttribute("data-text", item.name);

        place.appendChild(elem);
    });

    const list = document.querySelectorAll("#results-wrap li");
    // place.style.height = 0;
    if(list.length >= 4){
        place.style.height = "118px";
    }else{
        place.style.height = "88px";
    }

    gsap.fromTo("#results-wrap li", { opacity: 0, y: -5 }, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "back.in",
        onComplete: function(){
            handleState({ stage: "finished" });
        }
    });
}

function createIcon(data){
    data.forEach(function(item){
        let icon = document.createElement("i");
        icon.style.fontSize = "48px";

        icon.setAttribute("class", item.className);
        // document.body.appendChild(icon);
    });   
}