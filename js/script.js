
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
                        const images = document.querySelectorAll(".test-zone #img");
                        const temp = [];
                        const results = [];

                        images.forEach((img) => {
                            classifyImg({ img, target: data.target })
                            .then(function(result){
                                temp.push({ width: img.width, img, result, total: result.length });
                                result.forEach((item) => {
                                    results.push(item);
                                });
                                setLoadingAnimation({ target: data.target, state: "finish" });
                                return getMaxData(temp, results, { target: data.target });
                            })
                            .then(function(results){
                                if(results){
                                    createDot({ target: data.target, result: results.result });
                                    
                                }
                            });
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
                const callBackFunc = function(data){
                    if(detected.length !== 0) handleNotice({ stage: "init", purpose: "text-only", text: "감지된 물체로 아이콘을 확인하시겠습니까?" });
                }
                animation_state = "processing";
                fadeIn({ target: "#switch", stagger: false });
                fadeIn({
                    target: ".icon-wrap.cstm", 
                    stagger: true,
                    func: callBackFunc,
                    param: ""
                });
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
                    try{
                        if(obj.func !== undefined) obj.func(obj.param);
                    }catch{
                        alert("콜백함수를 실행할 수 없습니다. fadeIn");
                    }
                    
                    setTimeout(() => { 
                        animation_stack--;
                        animation_state = "waiting";
                    }, 300);
                    resolve("");
                }
            });
        }else{
            gsap.fromTo(target, { opacity: 0, y: -10 }, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "back.in",
                onStart: function(){ animation_stack++; },
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    try{
                        if(obj.func !== undefined) obj.func(obj.param);
                    }catch(error){
                        alert(`error: ${error} \n콜백함수를 실행할 수 없습니다. fadeIn`);
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
                    try{
                        if(obj.func !== undefined) obj.func(obj.param);
                    }catch{
                        alert("콜백함수를 실행할 수 없습니다. fadeIn");
                    }
                    gsap.set(target.children, { y: 0 }); // 초기화

                    target.classList.remove("dspl-b");
                    target.classList.remove("dspl-f");
                    target.classList.remove("show");
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
                    try{
                        if(obj.func !== undefined) obj.func(obj.param);
                    }catch{
                        alert("콜백함수를 실행할 수 없습니다. fadeIn");
                    }
                    gsap.set(target.children, { y: 0 }); // 초기화

                    target.classList.remove("dspl-b");
                    target.classList.remove("dspl-f");
                    target.classList.remove("show");
                    target.classList.add("dspl-n");
    
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

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ IMAGE UPLOAD, DRAG ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
let detected = []; // getMaxData함수로 필터링된 물체들에 대한 위치값을 전역변수로 저장한다.

function getMaxData(data1, data2, obj){
    const images = document.querySelectorAll(".test-zone #img");

    /*
        1. 물체감지된 7개의 이미지 중 결과값이 제일 많은 것 도출
        2. 6개의 이미지에서 감지된 물체의 위치값을 비율에 맞게 수정
        3. 6개의 이미지 중 step1에 없는 물체를 감별 후 step1 결과값에 추가
    */
    if(images.length == data1.length){
        data1.sort((a, b) => {
            return (a.total > b.total) ? 
                -1 : ((a.total  < b.total) ? 
                1 : 0
            );
        });

        const temp_array = [];
        const width = document.querySelector(obj.target + " #selected-img").width;
        let ratio, centerX, centerY;
        
        data2.forEach((item, idx) => {
            temp_array.push(item);

            ratio = Number((width / item.img_width).toFixed(2));
            centerX = Math.round(((item.width / 2) + item.x) * ratio);
            centerY = Math.round(((item.height / 2) + item.y) * ratio);

            temp_array[idx].centerX = centerX;
            temp_array[idx].centerY = centerY;
            temp_array[idx].x1 = centerX - 7.5;
            temp_array[idx].y1 = centerY - 7.5;
            temp_array[idx].x2 = centerX + 7.5;
            temp_array[idx].y2 = centerY + 7.5;
        });

        for(let i = 0; i < temp_array.length; i++){
            for(let n = 0; n < data1[0].result.length; n++){
                let width = 15 - Math.abs(temp_array[i].x1 - data1[0].result[n].x1);
                let height = 15 - Math.abs(temp_array[i].y1 - data1[0].result[n].y1);
                let area = 15 * 15;
                let accuracy = Math.round(((width * height) / area) * 100);

                if(
                    (temp_array[i].centerX == data1[0].result[n].centerX && temp_array[i].centerY == data1[0].result[n].centerY) ||
                    (temp_array[i].img_width === data1[0].result[n].img_width) ||
                    (
                        (temp_array[i].centerX >= (data1[0].result[n].centerX - 3) && temp_array[i].centerX <= (data1[0].result[n].centerX + 3)) ||
                        (temp_array[i].centerY >= (data1[0].result[n].centerY - 3) && temp_array[i].centerY <= (data1[0].result[n].centerY + 3))
                    ) ||
                    (
                        (data1[0].result[n].centerX >= (temp_array[i].centerX - 3) && data1[0].result[n].centerX <= (temp_array[i].centerX + 3)) ||
                        (data1[0].result[n].centerY >= (temp_array[i].centerY - 3) && data1[0].result[n].centerY <= (temp_array[i].centerY + 3))
                    ) ||

                    ((width > -1 && height > -1) && (70 <= accuracy && accuracy <= 100))
                ){
                    temp_array[i].delete = true;
                }
            }
            if(temp_array[i].delete === true){
                temp_array.splice(i, 1);
                i--;
            }
        }

        const unique_array = removeDuplicates(temp_array, "name");

        data1[0].result = data1[0].result.concat(unique_array);
        detected = data1[0].result;
        console.log(detected)

        return  data1[0];
    }
}

function removeDuplicates(originalArray, prop) {
    const newArray = [];
    const lookupObject  = {};

    for(const i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}
const notice = document.querySelector(".notice-popup");
const drag_zone = document.querySelector(".drop-zone");
const input = document.getElementById("file");

// 디렉토리에서 업로드하는 경우
input.addEventListener("change", function(){
    const notice = document.querySelector(".notice-popup");
    const files = input.files;
    let delay = 0;

    detected = [];
    if(notice.classList.contains("show")){
        delay = 700;
        handleNotice({ stage: "finished" });
    }

    setTimeout(() => {
        handleImgUpload({ select_type: "cstm" }, files)
        .then(function(result){
            verifyLength(result);
            handleState({ stage: "init", layout: "cstm", option: result });
        });
    }, delay);
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
    const notice = document.querySelector(".notice-popup");
    const files = event.dataTransfer.files;
    let delay = 0;

    detected = [];
    if(notice.classList.contains("show")){
        delay = 700;
        handleNotice({ stage: "finished" });
    }

    drag_zone.classList.remove("drag-over");

    setTimeout(() => {
        handleImgUpload({ select_type: "cstm" }, files)
        .then(function(result){
            handleState({ stage: "init", layout: "cstm", option: result });
        });
    }, delay);


});

/*
    이미지 선택방식은 두가지입니다.
    1. 기본 개발자가 설정한 이미지
    2. 사용자가 직접 업로드
*/

let flag = true;
function handleImgUpload(type, file){
    const images = document.querySelectorAll(".test-zone #img");
    const getDetailedData = function(data){
        images.forEach((img) => {
            img.src = data.source;
        });
    }

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

        if(type.select_type === "default"){ // 1. 기본 개발자가 설정한 이미지
            src = file.src;

            getDetailedData({ source: src });
            preview.setAttribute("src", src);
            document.querySelector("#container #selected-img").src = src;
            resolve({ source: src, target:  visible });
        }
        if(type.select_type === "cstm"){ // 2. 사용자가 직접 업로드
            const reader = new FileReader();
    
            reader.readAsDataURL(file[0]);
            reader.onload = function(event){
                src = event.target.result;
                preview.src = "";
                preview.src = src;

                getDetailedData({ source: src });
                document.querySelector("#container #selected-img").src = src;
                document.querySelector(visible + " #selected-img").src = src;
                resolve({ source: src, target:  visible });
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
            item.classList.remove("dspl-n");
            item.classList.add("dspl-b");
            fadeIn({ target: fade_in + " .loading-box", stagger_state: false });
        }

        if(obj.state === "finish" && item.classList.contains("finish")){
            item.classList.remove("dspl-n");
            item.classList.add("dspl-b");
            document.querySelector(fade_in + " .info").innerText = "Finished";
        }

        if(obj.state === "retry" && item.classList.contains("retry")){
            item.classList.remove("dspl-n");
            item.classList.add("dspl-b");

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
    let width, height, align;

    img.src = obj.source;
    img.onload = function(){
        width = img.width;
        height = img.height;
    
        align = (width > height) ? "hrz" : "vrt";

        imges.forEach(function(item){
            if(item.classList.contains(target.replace(".", ""))){
                document.querySelector(target).classList.add(align);
            }else{
                setTimeout(() => {
                    item.classList.remove("vrt");
                    item.classList.remove("hrz");
                }, 500);
            }
        });
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

function classifyImg(obj){
    // const img = document.querySelector(obj.target + " #selected-img");
    const img_width = obj.img.width;
    let detect_result = []; // 초기화
    // console.log(`□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□ obj.target: ${obj.target} □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□`);

    return new Promise(function(resolve){
        cocoSsd.load().then(model => {
            model.detect(obj.img).then(predictions => {
                // console.log("predictions:", predictions);

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

                            // console.log(`□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□ COUNT: ${i+1} □□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□□`);
                            console.log(className)

                            detect_result.push({ 
                                img_width, 
                                name, 
                                className: className.main,
                                sub: className.sub,
                                x, y, 
                                width, height, 
                                idx: i+1 
                            });
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
    constructor(x, y, width, height, name, idx, ratio){
        this.x = Math.round(((width / 2) + x) * ratio);
        this.y = Math.round(((height / 2) + y) * ratio);
        this.width = 15;
        this.height = 15;
        this.color = "#3AB8FF";
        this.name = name;
        this.idx = idx;

        // console.log(`ratio: ${ratio}\nwidth: ${width} | height: ${height}\nx: ${x} | y: ${y}\ncenterX: ${(width / 2) + x} | centerY: ${(height / 2) + y}\nnew centerX: ${this.x} | new centerY: ${this.y}`)
    }

    create(location){
        const dot = document.createElement("div");
        const imgBox = document.querySelector(location);

        dot.setAttribute("class", "dot dot"+this.idx);
        dot.style.left = this.x + "px";
        dot.style.top = this.y + "px";
        dot.setAttribute("data-idx", this.idx);
        dot.setAttribute("name", this.name);

        imgBox.appendChild(dot);
    }
}

function createDot(obj){
    const width = document.querySelector(obj.target + " #selected-img").width;
    let ratio;

    obj.result.forEach(function(item, idx){
        ratio = Number((width / item.img_width).toFixed(2));
        let dot = new Dot(
            item.x, 
            item.y, 
            item.width, 
            item.height, 
            item.name, 
            idx+1,
            ratio
        );
        dot.create(obj.target);
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
            onStart: function(){ animation_stack++; },
            onUpdate: function() { animation_state = "processing" },
            onComplete: function(){
                animation_stack--;
                animation_state = "waiting";

                if(obj.target !== "#container"){
                    setTimeout(() => {
                        createList(obj);
                    }, 850);
                }
                if(obj.func !== undefined) obj.func();
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

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ NOTICE ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

document.querySelectorAll(".notice-popup button").forEach((button) => {
    const ctrl_wrapper = document.querySelector(".cont-wrapper");

    button.addEventListener("click", function(e){
        const id = e.target.getAttribute("id");

        if(id === "btn-yes"){
            setTimeout(() => {
                gsap.to(".cont-wrapper", {
                    opacity: 0,
                    y: -10,
                    duration: 0.5,
                    ease: "back.in",
                    onStart: function(){ animation_stack++; },
                    onUpdate: function(){ animation_state = "processing" },
                    onComplete: function(){
                        ctrl_wrapper.classList.remove("show");
                        initMainAction();
                    }
                });
            }, 600);
        }

        handleNotice({ stage: "finished" });
    });
});

function initMainAction(){
    const canvas = document.getElementById("canvas");
    const container = document.getElementById("container");
    const img =  document.querySelector("#container #selected-img");
    container.classList.add("show");
    container.style.height = img.height+"px";

    canvas.classList.add("active");

    gsap.fromTo("#container", { opacity: 0, y: -10 }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.in",
        onUpdate: function(){ animation_state = "processing" },
        onComplete: function(){
            /*  순서
                1. 점 생성(애니메이션)
                2. 카드생성
                3. 아이콘 노출
            */
            container.style.transform = "";

            createDot({ 
                target: "#container", 
                result: detected,
                func: getPos
            });
        }
    });
}
let flag_c = false;
$(function(){
    $(document).on("mousemove", ".card", function(e){
        let prc = animationProcessCheck();
        if(prc === true) return;
        magnetize($(this)[0], e, e.target);
    });

    $(document).on("mouseleave", ".card", function(e){
        flag_c = false;
        $(this)[0].style.zIndex = 4;
        gsap.to($(this)[0], 0.6, { 
            y: 0, 
            x: 0, 
            onUpdate: function(){ drawLine({ stage: "init" }); }
        });
    });
});

function getPos(){
    const dot = document.querySelectorAll("#container .dot");
    const img = document.querySelector("#container img");
    let data, card;
    let dot_data;
    let speed;
    let cards = [];

    resize();

    dot.forEach((item, idx) => {
        item.setAttribute("data-idx", idx+1);
        data = item.getBoundingClientRect();
        card = new Card({ 
            data, 
            target: item, 
            numb: idx+1,
            detected: detected[idx]
        });
        card.createCard();
        cards.push(card);
    });

    gsap.fromTo(".card", { opacity: 0, y: -10 }, {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: "back.in",
        onStart: function(){ animation_stack++; },
        onUpdate: function(){ animation_state = "processing" },
        onComplete: function(){
            animation_stack = 0;
            animation_state = "waiting"
        }
    });

    cards.forEach((item, idx) => {
        dot_data = item.dot.getBoundingClientRect();
        startX = (dot_data.width) / 2 + dot_data.x;
        startY = (dot_data.height) / 2 + dot_data.y;
        speed = 1;

        card.drawLineA(startX, startY, item.cornerX, item.cornerY, speed);
    });
}

class Card {
    constructor(obj){
        this.dots = document.querySelectorAll(".dot");
        this.dot = obj.target;
        this.dot_width = obj.data.width;
        this.dot_height = obj.data.height;
        this.dot_data = obj.target.getBoundingClientRect();
        this.corner_pos = [];
        this.centerX = Math.round((this.dot_data.width) / 2 + this.dot_data.x);
        this.centerY = Math.round((this.dot_data.height) / 2 + this.dot_data.y);
        this.cornerX;
        this.cornerY;
        this.container = document.getElementById("container");
        this.stage_width = container.clientWidth;
        this.stage_height = container.clientHeight;
        this.numb = obj.numb;
        this.radius = 120;
        this.points = 30;
        this.cnt1 = 0;
        this.cnt2 = 0;
        this.initNumb = 1;
        this.test_numb2 = 1;
        this.complete = false;
        this.created = [];
        this.icons = obj.detected.sub;
    }

    createCard(){
        const dots = document.querySelectorAll(".dot");
        const cards = document.querySelectorAll(".card");
        const PI2 = Math.PI * 2;
        const angle = PI2 / this.points;
        const width = 150;
        const height = 150;
        const random = Math.floor(Math.random() * this.points) + 1;
        let centerX, centerY, left, top;
        let elem = "";
        let icons;

        for(let i = 0; i < this.points; i++){
            centerX = this.radius * Math.cos(angle * i) + (this.centerX - this.container.offsetLeft);
            centerY = this.radius * Math.sin(angle * i) + (this.centerY - this.container.offsetTop);
            left = Math.round(centerX + (this.dot_width / 2) - (width / 2));
            top = Math.round(centerY + (this.dot_height / 2) - (height / 2));

            const card = document.createElement("div");
            card.setAttribute("class", `card card-${i+1}`);
            card.setAttribute("center-target", `dot${this.numb}`);
            card.style.left = `${left}px`;
            card.style.top = `${top}px`;
            card.style.width = `${width}px`;
            card.style.height = `${height}px`;
            // card.innerText = `${i+1}`;

            elem = '<div class="main swiper-'+this.numb+'">';
            elem +=     '<ul class="inner swiper-wrapper">';
            for(let n = 0; n < this.icons.length; n++){
                if(n < 10){
                    icons = `fa-light ${this.icons[n]}`;
                    elem += `<li class="swiper-slide" style="${width}px;height:"><i class="${icons} icon m-icon"></i></li>`;
                }
            }
            elem +=     '</ul>';
            elem +=     '<button class="btn-direct swiper-button-prev btn-prev"><i class="fa-regular fa-chevron-left"></i></button>';
            elem +=     '<button class="btn-direct swiper-button-next btn-next"><i class="fa-regular fa-chevron-right"></i></button>';
            elem += '</div>';

            if(this.initNumb === (i+1) && this.complete === false){
                // console.log(`%c◀◀◀◀◀◀◀◀◀◀◀◀ [step1-추가] dot-numb: ${this.numb} | initNumb: ${this.initNumb} | complete: ${this.complete} ▶▶▶▶▶▶▶▶▶▶`, "background: black;color: aqua");
                this.container.appendChild(card);
                card.innerHTML = elem;
                const swiper = new Swiper(`.swiper-${this.numb}`, {
                    slidesPerView: 1,
                    loop: false,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                });

                this.checkCollision(card);
                this.createCorner(card);
                return;
            }
        }
    }

    checkCollision(card_target){
        // const cont_data = this.container.getBoundingClientRect();
        const { offsetLeft, offsetTop } = document.getElementById("container");
        const window_w = window.outerWidth;
        const window_h = window.outerHeight;
        let cards = document.querySelectorAll(".card");
        const target_data = card_target.getBoundingClientRect();

        const x1 = Math.round(target_data.x);
        const y1 =  Math.round(target_data.y);
        const x2 = x1 + target_data.width;
        const y2 = y1 + target_data.height;

        const stage_x1 = 0;
        const stage_y1 = 0;
        const stage_x2 = window_w;
        const stage_y2 = window_h;
        let x1_compare, y1_compare, x2_compare, y2_compare;

        // console.log(`${x1}, ${y1}\n${x2}, ${y1}\n${x1}, ${y2}\n${x2}, ${y2}`)
        // console.log(`%c◀◀◀◀◀◀◀◀◀◀◀◀ [step2-충돌체크] 실행 횟수: ${this.test_numb2} | dot: ${this.numb} ▶▶▶▶▶▶▶▶▶▶`, "color: aqua")
        // console.log(cards)

        cards.forEach((card, idx) => {
            const card_data = card.getBoundingClientRect();
            const dot = document.querySelector(`.dot${this.numb}`);
            const dot_data = dot.getBoundingClientRect();
            x1_compare =  Math.round(card_data.x);
            y1_compare =  Math.round(card_data.y);
            x2_compare = x1_compare + card_data.width;
            y2_compare = y1_compare + card_data.height;
            
            // console.log(`◀◀◀◀◀◀◀◀◀◀◀◀ [step3-반복문] ${cards.length} 번 돌려라~! ▶▶▶▶▶▶▶▶▶▶`);                    
            // console.log(`중심점: dot${this.numb} | idx: ${idx} | 이미 생선된 것: ${card.className} | 비교대상: ${card_target.className}`)
            if(
                (stage_x1 > x1_compare || stage_x2 < x2_compare) ||
                (stage_y1 > y1_compare || stage_y2 < y2_compare)
            ){
                this.initNumb++;
                if( this.cnt1 > 100 ){
                    this.initNumb = 1;
                    this.radius = 120;
                }
                // console.log(`%c[1] ${dot.className} | ${card.className} | ${this.initNumb}, ${this.radius}`, "color: green")
                // console.log(`제거대상: ${card_target.className}`);
                card.remove();
                this.createCard({ data: dot_data , target: card, numb: this.numb });
                return false;
            }

            if(
                (x1 < x1_compare && x1_compare < x2) && (y1 < y1_compare && y1_compare < y2) ||
                (x1 < x1_compare && x1_compare < x2) && (y1 < y2_compare && y1_compare < y2) ||
                (x1 < x2_compare && x2_compare < x2) && (y1 < y2_compare && y1_compare < y2) ||
                (x1 < x2_compare && x2_compare < x2) && (y1 < y1_compare && y1_compare < y2) ||
                (x1_compare <= x1 || x2_compare <= x2) && (y1_compare < y1 && y1 < y2_compare)
            ){
                // console.log(`%c[2] ${dot.className} | ${card_target.className} | ${this.initNumb}, ${this.radius}`, "color: red")
                // console.log(`이미 생성된 것: ${card.className}\nleft-top ${x1_compare}, ${y1_compare}\nright-top ${x2_compare}, ${y1_compare}\nleft-bottom ${x1_compare}, ${y2_compare}\nright-bottom ${x2_compare}, ${y2_compare}`)
                // console.log(`비교대상: ${card_target.className}\nleft-top ${x1}, ${y1}\nright-top${x2}, ${y1}\nleft-bottom ${x1}, ${y2}\nright-bottom ${x2}, ${y2}`)
                // console.log(`제거대상: ${card_target.className}`);

                card_target.remove();

                if( this.initNumb === this.points){
                    // console.log(`%c${this.initNumb}, ${this.points}`, "color: yellow")
                    this.radius = this.radius + 30;
                    this.initNumb = 1;
                }else{
                    this.initNumb++;
                }

                this.createCard({ 
                    data: dot_data, 
                    target: document.querySelector(`.${card_target.getAttribute("center-target")}`),
                    numb: this.numb
                });
                return false;
            }
        });

        // console.log(`%c◀◀◀◀◀◀◀◀◀◀◀◀ [ste4-마지막] 성공~! | 실행횟수: ${this.test_numb2} | ${cards[cards.length-1].className} | complete: ${this.complete}  ▶▶▶▶▶▶▶▶▶▶`, "background: black;color: hotpink")
        try {
            const a_class = cards[cards.length-1].className.replace("card ", "");
            const a = document.querySelector("."+a_class).getBoundingClientRect();
            const a_x1 = a.x;
            const a_y1 = a.y;
            const a_x2 = a_x1 + a.width;
            const a_y2 = a_x1 + a.height;
            // console.log(`%c성공한 것: ${cards[cards.length-1].className}\nleft-top ${a_x1}, ${a_y1}\nright-top ${a_x2}, ${a_y1}\nleft-bottom ${a_x1}, ${a_y2}\nright-bottom ${a_x2}, ${a_y2}`, "color: lightblue")
        } catch(error) {

        }

        this.complete = true;
        this.test_numb2++;
        // cards = document.querySelectorAll(".card");

        const corners = [
            { width: this.centerX - x1_compare, height: this.centerY - y1_compare, x: x1_compare, y: y1_compare, pos: "left-top" },
            { width: this.centerX - x1_compare, height: this.centerY - y2_compare, x: x1_compare, y: y2_compare, pos: "left-bottom" },
            { width: this.centerX - x2_compare, height: this.centerY - y2_compare, x: x2_compare, y: y2_compare, pos: "right-bottom" },
            { width: this.centerX - x2_compare, height: this.centerY - y1_compare, x: x2_compare, y: y1_compare, pos: "right-top" }
        ]
        this.corner_pos = corners;
    }

    createCorner(card){
        const corner = document.createElement("div");

        this.corner_pos.forEach((item, idx) => {
            const length = Math.round(Math.sqrt((item.width) * (item.width) + (item.height) * (item.height)));
            this.corner_pos[idx].length = length;
        });
        this.corner_pos.sort(function(a, b) {
            return a.length < b.length  ? -1 : a.length  > b.length  ? 1 : 0;
        });

        corner.classList.add("corner");
        corner.style.position = "absolute";

        if(this.corner_pos[0].pos === "left-top"){
            corner.style.left = "2px";
            corner.style.top = "2px";
        }
        if(this.corner_pos[0].pos === "right-top"){
            corner.style.right = "2px";
            corner.style.top = "2px";
        }
        if(this.corner_pos[0].pos === "left-bottom"){
            corner.style.left = "2px";
            corner.style.bottom = "2px";
        }
        if(this.corner_pos[0].pos === "right-bottom"){
            corner.style.right = "2px";
            corner.style.bottom = "2px";
        }

        card.appendChild(corner);
        const corner_data = corner.getBoundingClientRect();

        if(corner_data.x !== 0) this.cornerX = Math.round(corner_data.x);
        if(corner_data.y !== 0) this.cornerY = Math.round(corner_data.y);
    }

    drawLineA(startX, startY, endX, endY){
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const waypoints=[];
        let dx = endX - startX; // 끝x - 시작x = 거리(distance)
        let dy = endY - startY; // 끝y - 시작y = 거리(distance)
        let t = 1;

        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;

        for(let n = 0; n <= 100; n++){
            let x = startX + dx * n / 100; // x = 시작x + 거리x * n / 100
            let y = startY + dy * n / 100; // y = 시작y + 거리y * n / 100

            waypoints.push({ x, y });
        }

        animate();
        function animate(){
            if(t < waypoints.length -1){
                ctx.beginPath();
                requestAnimationFrame(animate);
            }else{
                ctx.closePath();
                return;
            };

            ctx.moveTo(waypoints[t - 1].x, waypoints[t - 1].y);
            ctx.lineTo(waypoints[t].x, waypoints[t].y);
            ctx.strokeStyle = '#3AB8FF';
            ctx.stroke();
            t++;
        }
    }
}

window.addEventListener("resize", function(e){
    resize();
    drawLine({ stage: "init" });
});

function resize(obj){
    const canvas = document.getElementById("canvas");
    const stage_width = document.body.clientWidth;
    const stage_height = document.body.clientHeight;

    canvas.width = stage_width;
    canvas.height = stage_height;
}

function drawLine(obj){
    const dots = document.querySelectorAll("#container .dot");
    const corners = document.querySelectorAll(".corner");
    const container = document.getElementById("container");
    const stage_width = document.body.clientWidth;
    const stage_height = document.body.clientHeight;
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d"); 
    const pos = [];
    let x, y, x1, y1;

    dots.forEach((item, idx) => {
        const data = item.getBoundingClientRect();
        // const x = (item.clientWidth / 2) + item.offsetLeft;
        // const y = (item.clientHeight / 2) + item.offsetTop;
        x = (item.clientWidth / 2) + (container.offsetLeft + item.offsetLeft);
        y = (item.clientHeight / 2) + (container.offsetTop + item.offsetTop);

        pos.push({ centerX: x, centerY: y });
    }); 

    corners.forEach((item, idx) => {
        const data = item.getBoundingClientRect();
        x1 = data.x;
        y1 = data.y;

        pos[idx]["cornerX"] = x1;
        pos[idx]["cornerY"] = y1;
    });

    ctx.clearRect(0, 0, stage_width, stage_height);

    if(obj.stage === "init"){
        pos.forEach((item) => {
            // console.log("===============================================")
            // console.log(item.centerX, item.centerY, item.cornerX, item.cornerY)
            // console.log("===============================================")
            ctx.beginPath();
            ctx.moveTo(item.centerX, item.centerY);
            ctx.lineTo(item.cornerX, item.cornerY);
            ctx.strokeStyle = '#3AB8FF';
            ctx.stroke();
        });
    }
}
/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 자석효과 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

function magnetize(el, e){
    const { offsetLeft, offsetTop } = document.getElementById("container");
    const mX = e.pageX,
        mY = e.pageY;
    const customDist = 120;
    const centerX = el.offsetLeft + (el.offsetWidth / 2) + offsetLeft;
    const centerY = el.offsetTop + (el.offsetHeight / 2) + offsetTop;
    const deltaX = Math.floor((centerX - mX)) * -0.45;
    const deltaY = Math.floor((centerY - mY)) * -0.45;
    const distance = calculateDistance(el, mX, mY);
    const cards = document.querySelectorAll(".card");

    if(flag_c === false && distance < customDist){
        // 자석효과에 의한 이동
        el.style.zIndex = 5;
        gsap.to(el, 0.5, { 
            y: deltaY, 
            x: deltaX, 
            onUpdate: function(){  drawLine({ stage: "init" }); }
        });
    }

    if(
        e.target.classList.contains("btn-prev") || 
        e.target.classList.contains("btn-next") || 
        e.target.classList.contains("main") ||
        e.target.classList.contains("m-icon")
    ){ flag_c = true; drawLine({ stage: "init" }) }
}

function calculateDistance(elem, mouseX, mouseY) {
    const { offsetLeft, offsetTop } = document.getElementById("container");

    return Math.floor(Math.sqrt(Math.pow(mouseX - (elem.offsetLeft + offsetLeft + (elem.offsetWidth / 2)), 2) + Math.pow(
        mouseY - (elem.offsetTop + offsetTop + (elem.offsetHeight / 2)), 2)));
}

function handleNotice(data){
    const popup = document.querySelector(".notice-popup");
    const text = document.querySelector(".notice-popup .text");

    if(data.stage === "init"){
        popup.classList.add("show");
        text.innerText = data.text;

        fadeIn({ target: ".notice-popup", stagger_state: false });
    }
    if(data.stage === "finished"){
        fadeOut({ target: ".notice-popup", stagger_state: false });
    }
}

function setCookie(data){
    var todayDate = new Date();

    todayDate = new Date(parseInt(todayDate.getTime() / 86400000) * 86400000 + 54000000);

    if ( todayDate > new Date() ){
        data.expiredays = data.expiredays - 1;
    }

    todayDate.setDate( todayDate.getDate() + data.expiredays );
    document.cookie = data.name + "=" + escape( data.value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}