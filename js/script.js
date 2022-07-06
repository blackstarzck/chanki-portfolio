
verifyLength({ source: "./img/def-img.jpg", target:  ".img-01"});
const device = detectDevice();
let dev_size;

if(matchMedia("screen and (max-width: 767px)").matches){ 
    dev_size = "MOBILE";
    if(!document.body.classList.contains("mobile")) document.body.classList.add("mobile");
}else if(matchMedia("screen and (max-width: 1023px)").matches){
    dev_size = "TABLET";
    if(document.body.classList.contains("mobile")) document.body.classList.remove("mobile");
}else if(matchMedia("screen and (min-width: 1024px)").matches){
    dev_size = "PC";
    if(document.body.classList.contains("mobile")) document.body.classList.remove("mobile");
}
window.onresize = () => {
    if(matchMedia("screen and (max-width: 767px)").matches){ 
        dev_size = "MOBILE";
        if(!document.body.classList.contains("mobile")) document.body.classList.add("mobile");
    }else if(matchMedia("screen and (max-width: 1023px)").matches){
        dev_size = "TABLET";
        if(document.body.classList.contains("mobile")) document.body.classList.remove("mobile");
    }else if(matchMedia("screen and (min-width: 1024px)").matches){
        dev_size = "PC";
        if(document.body.classList.contains("mobile")) document.body.classList.remove("mobile");
    }
}


/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ LEFT ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

// 애니매이션 중 클릭 방지
let animation_state = "waiting";

// 사용자 설정 레이아아웃 변경
document.getElementById("switch").addEventListener("click", function(){
    const prc = animationProcessCheck();
    if(prc === true) return;

    const layout = varifyLayout();
    const other_layout = layout === "default" ? "cstm" : "default";
    const icon = document.querySelector(".lt-cont .icon-bg > svg");

    if(icon.style.transform == ""){
        icon.style.transform = "rotate(180deg)";
    }else{
        icon.style.transform = "";
    }

    handleState({ stage: "standby", layout: other_layout });
});

// 기본 레이아웃으로 진행 시
document.getElementById("setDefImg").addEventListener("click", function(){
    const def_img = { src: "./img/def-img.jpg", location: document.querySelector(".img-01 #selected-img") };
    const prc = animationProcessCheck();
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

                        images.forEach((img, idx) => {
                            classifyImg({ img, target: data.target })
                            .then(function(result){
                                temp.push({ width: img.width, img, result, total: result.length });
                                result.forEach((item) => { results.push(item) });

                                if(images.length === idx+1) setLoadingAnimation({ target: data.target, state: "finish" });

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
            dots.forEach(function(item){ item.remove(); });

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
                    if(detected.length !== 0) 
                        handleNotice({ 
                            stage: "init", 
                            descr: "감지된 물체로 아이콘을 확인하시겠습니까?", 
                            className: "show-result-popup" 
                        });
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
    if(animation_state === "processing") prc = true;
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
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    try{
                        if(obj.func !== undefined) obj.func(obj.param);
                    }catch{
                        alert("콜백함수를 실행할 수 없습니다. fadeIn");
                    }
                    
                    setTimeout(() => { 
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
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    try{
                        if(obj.func !== undefined) obj.func(obj.param);
                    }catch(error){
                        alert(`error: ${error} \n콜백함수를 실행할 수 없습니다. fadeIn`);
                    }

                    setTimeout(() => { 
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
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    try{
                        if(obj.func !== undefined) obj.func(obj.param);
                    }catch{
                        alert("콜백함수를 실행할 수 없습니다. fadeOut");
                    }
                    gsap.set(target.children, { y: 0 }); // 초기화

                    target.classList.remove("dspl-b");
                    target.classList.remove("dspl-f");
                    target.classList.remove("show");
                    target.classList.add("dspl-n");
    
                    setTimeout(() => { 
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
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    try{
                        if(obj.func) obj.func(obj.param);
                    }catch{
                        alert("콜백함수를 실행할 수 없습니다. fadeOut");
                    }
                    gsap.set(target.children, { y: 0 }); // 초기화

                    target.classList.remove("dspl-b");
                    target.classList.remove("dspl-f");
                    target.classList.remove("show");
                    target.classList.add("dspl-n");
    
                    setTimeout(() => { 
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
        // console.log("=======================================================")
        // console.log(detected)

        return  data1[0];
    }else{
        
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

    document.querySelector(fade_in + " .info").innerText = "Detecting";

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
            setTimeout(() => {
                item.classList.remove("dspl-n");
                item.classList.add("dspl-b");
                document.querySelector(fade_in + " .info").innerText = "Please Retry";
            }, 300);
        }
    });
}

function verifyLength(obj){
    const target = obj.target;
    const imges = document.querySelectorAll(".img-box");
    // const container_img = document.querySelector(".container #selected-img");
    const container = document.querySelector(".container");
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
                // container_img.classList.remove("hrz");
                // container_img.classList.remove("vrt");
                // container_img.classList.add(align);

                container.classList.remove("hrz");
                container.classList.remove("vrt");
                container.classList.add(align);
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
        item.classList.remove("hover");
        if(current_idx == (other_idx + 1)){

            if(obj.state === "active") item.classList.add("hover");
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
                            // console.log(className)

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
    const cont_img = document.querySelector("#container #selected-img");
    const width = document.querySelector(obj.target + " #selected-img").width;
    const offsetLeft = (obj.target === "#container") ? cont_img.offsetLeft : 0;
    const offsetTop = (obj.target === "#container") ? cont_img.offsetTop : 0;
    const dotsArray = [];
    let ratio;

    if(document.querySelectorAll(".container .dot").length > 0 || document.querySelectorAll(".container .card").length > 0){
        document.querySelectorAll(".container .dot").forEach((dot, i) => { dot.remove() });
        document.querySelectorAll(".container .card").forEach((card, i) => { card.remove() });
    }

    console.log(obj.result)

    obj.result.forEach(function(item, idx){
        ratio = Number((width / item.img_width).toFixed(2));
        let dot = new Dot(
            item.x + offsetLeft, 
            item.y + offsetTop, 
            item.width, 
            item.height, 
            item.name, 
            idx+1,
            ratio
        );
        dot.create(obj.target);
        dotsArray.push(dot);
    });

    console.log(dotsArray);
    
    window.onresize = () => {
        const new_width = document.querySelector(obj.target + " #selected-img").width;
        const resizeState = (width / new_width) !== 1 ? true : false;
        const ratio = (resizeState === true) ? Number((new_width / width).toFixed(2)) : 0;
        const dots = document.querySelectorAll(obj.target + " .dot");
        const cont_img = document.querySelector("#container #selected-img");
        const offsetLeft = (obj.target === "#container") ? cont_img.offsetLeft : 0;
        const offsetTop = (obj.target === "#container") ? cont_img.offsetTop : 0;
        let x, y;
        
        if(resizeState === true){
            dots.forEach((dot, i) => {
                x = (dotsArray[i].x * ratio) + offsetLeft;
                y = (dotsArray[i].y * ratio) + offsetTop;
    
                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;
                console.log("ratio: ", ratio)
                console.log(x, y)
            });
        }
    }

    const dots = document.querySelectorAll(obj.target + " .dot");

    setTimeout(() => {
        dots.forEach(function(item){ item.style.visibility = "visible" });

        gsap.from(obj.target +" .dot", {
            duration: 1,
            scale: 0.5, 
            opacity: 0, 
            delay: 0.5, 
            stagger: 0.2,
            ease: "elastic", 
            force3D: true,
            onUpdate: function() { animation_state = "processing" },
            onComplete: function(){
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
            document.body.classList.remove("step1-img-detect");
            document.body.classList.add("step2-detect-result");

            setTimeout(() => {
                gsap.to(".cont-wrapper", {
                    opacity: 0,
                    y: -10,
                    duration: 0.5,
                    ease: "back.in",
                    onUpdate: function(){ animation_state = "processing" },
                    onComplete: function(){
                        ctrl_wrapper.classList.remove("show");
                        handleMainAction({ state: "init" });
                    }
                });
            }, 600);
        }

        handleNotice({ stage: "finished" });
    });
});

function handleMainAction(obj){
    const { state, show } = obj;
    const canvas = document.getElementById("canvas");
    const container = document.getElementById("container");
    const img =  document.querySelector("#container #selected-img");
    let setting;

    if(state === "init"){
        container.classList.remove("dspl-n");
        container.classList.add("show");

        if(device === "PC" && dev_size !== "MOBILE"){
            canvas.classList.add("active");

        }
        container.style.height = img.height+"px";
        

        gsap.fromTo("#container", { opacity: 0, y: -10 }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "back.in",
            onUpdate: function(){ animation_state = "processing" },
            onComplete: function(){
                container.style.transform = "";
                handleNotice({ 
                    stage: "init", 
                    descr: "감지된 결과를 바탕으로 카드를 구성중입니다.", 
                    className: "card-proc-popup" 
                });
                createDot({ 
                    target: "#container", 
                    result: detected,
                    func: getPos
                });
            }
        });
        setMainElements();
    }

    if(state === "finished"){
        canvas.classList.remove("active");
        gsap.fromTo(container.children, { opacity: 1, y: 0 }, {
            opacity: 0,
            y: -10,
            duration: 0.6,
            stagger: -0.1,
            ease: "back.in",
            onUpdate: function(){
                animation_state = "processing";
                drawLine({ stage: "init" });
            },
            onComplete: function(){
                animation_state = "waiting";
                showAllUI({ state: "init", show });
                addAnimationSVG();

                canvas.width = "";
                canvas.height = "";
                container.classList.add("dspl-n");
                container.classList.remove("show");
                container.style.height = "";
                container.children.forEach((item) => { item.style.opacity = ""; item.style.transform = "" });
                Kakao?.init('7ad18fb056d47268f2c567afa7f80620');
            }
        });
    }
}

function setMainElements(){
    const ico_container  = document.querySelector(".icons-container");
    const slides_contianer = document.querySelector(".rotation-box .main-slides");
    const name_container = document.querySelector(".lt-ctrller .swiper-wrapper");
    let elem_a = "", elem_b = "", elem_c = "";
    let ico, active;

    for(let i = 0; i < detected.length; i++){
        elem_a += `<ul class="slide-wrap ${(i+1)}" object-name="${detected[i].name}">`;
        elem_c += `<li class="swiper-slide" object-name="${detected[i].name}"><span class="m-item-name">${detected[i].name}</span></li>`;
        
        elem_b +=   `<div class="menu-cont swiper-list swiperPallete-${(i+1)}" object-name="${detected[i].name}">`;
        elem_b +=       `<ul class="list-wrap swiper-wrapper">`;
        for(let n = 0; n < detected[i].sub.length; n++){
            active = (n === 0) ? "active" : "";
            ico = detected[i].sub[n];

            elem_a +=     `<li class="slide slide-${(n+1)}" title="${ico}"><i class="fa-thin ${ico}"></i></li>`;
            elem_b +=     `<li class="swiper-slide slide-${(n+1)} ${active}" index="${(n+1)}" title="${ico}"><i class="fa-thin ${ico}"></i></li>`;
        }
        elem_a += `</ul>`;

        elem_b +=   `</ul>`;
        elem_b += `</div>`;
    }
    slides_contianer.innerHTML = "";
    ico_container.innerHTML = "";
    name_container.innerHTML = "";
    slides_contianer.innerHTML = elem_a;
    ico_container.innerHTML = elem_b;
    name_container.innerHTML = elem_c;

    bindEventsC();
}

function handleMainSlide(obj){
    const { state, current, prev } = obj;
    const setting = state === "prev" ? { y1: 150, y2: -150 } : { y1: -150, y2: 150 };
    const slides = document.querySelectorAll(".rotation-box .slide-wrap.show li.slide");
    
    current.classList.add("show");
    current.children[0].classList.add("show");

    // fade out
    gsap.fromTo(prev, { opacity: 1, y: 0 }, {
        opacity: 0,
        y: setting.y1,
        duration: 0.3,
        ease: "ease.in",
        onUpdate: function(){ animation_state = "processing"; },
        onComplete: function(){
            animation_state = "waiting";
            prev.classList.remove("show");
            prev.children.forEach((item) => {
                item.classList.remove("show");
                item.style.transform = "";
                item.style.opacity = "";
            });
        }
    });

    // fade in
    gsap.fromTo(current, { opacity: 0, y: setting.y2 } ,{
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "ease.in",
        onStart: function(){ current.classList.add("show"); },
        onUpdate: function(){ animation_state = "processing" },
        onComplete: function(){
            animation_state = "waiting";
            beginSVGanimation();
        }
    });
}

function beginSVGanimation(obj){
    const delay = obj?.delay || 0;
    const elem_animate = document.querySelector(".rotation-box .slide-wrap.show li.show animate");

    setTimeout(() => {
        elem_animate.beginElement();
        elem_animate.onbegin = () => { /* console.log("SVG animate begin~"); */ }
        elem_animate.onend = () => { /* console.log("SVG animateend~"); */ }
    }, delay);

}

function handlePalleteSlide(obj){
    const { state, current, prev } = obj;
    const setting = state === "prev" ? { y1: -45, y2: 45 } : { y1: 45, y2: -45 };
    
    current.classList.add("show");
    current.children[0].children[0].classList.add("active");

    // fade out
    gsap.fromTo(prev, { opacity: 1, y: 0 }, {
        opacity: 0,
        y: setting.y2,
        duration: 0.3,
        ease: "ease.in",
        onUpdate: function(){ animation_state = "processing"; },
        onComplete: function(){
            animation_state = "waiting";
            prev.classList.remove("show");
            prev.children[0].children.forEach((item) => { item.classList.remove("active") });
        }
    });

    // fade in
    gsap.fromTo(current, { opacity: 0, y: setting.y1 }, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "ease.in",
        onStart: function(){ },
        onUpdate: function(){ animation_state = "processing" },
        onComplete: function(){ animation_state = "waiting"; }
    });
}

function addAnimationSVG(){
    // const paths = document.querySelectorAll("#icon path");
    const svgs = document.querySelectorAll(".rotation-box li svg");
    const paths = document.querySelectorAll(".rotation-box li svg path");
    let i = 0;

    paths.forEach((path) => {
        const pathLength = path.getTotalLength();
        const speed = 750;

        i++;
        path.setAttribute("stroke-dasharray", pathLength);
        path.setAttribute("stroke-dashoffset", pathLength);
        path.setAttribute("fill", "");
        path.innerHTML = "<animate id='animate"+i+"' attributeName='stroke-dashoffset' begin='indefinite' dur='"+Math.round(pathLength/speed)+"s' to='0' fill='freeze'/>";
    });
}

function showAllUI(obj){
    const { state, show } = obj;
    const ctrl = document.querySelectorAll(".ctrl-cont");
    const ctrl_items = document.querySelectorAll(".ctrl-cont .ctrl-item");
    const code_box = document.querySelector(".rotation-box .svg-codes");
    const slide_wraps = document.querySelectorAll(".rotation-box .main-slides .slide-wrap");
    const swiper_lists = document.querySelectorAll(".icons-container .swiper-list");
    
    ctrl.forEach((item) => { item.classList.remove("dspl-n") });
    bindEventsA();

    const mSwiper = new Swiper(".swiperIntro", {
        direction: "vertical",
        slidesPerView: 1,
        speed: 500,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        on: {
            slidePrevTransitionStart: function(){
                const idx = this.realIndex;
                const data_a = { state: "prev", current: slide_wraps[idx], prev: slide_wraps[idx+1]};
                const data_b = { state: "prev", current: swiper_lists[idx], prev: swiper_lists[idx+1]};
                
                if(code_box.classList.contains("show")) fadeOut({ target: ".rotation-box .svg-codes", stagger: false });
                console.log("prev-idx: ", idx );
                handleMainSlide(data_a);
                handlePalleteSlide(data_b);
            },
            slideNextTransitionStart: function(){
                let idx = this.realIndex;
                const data_a = { state: "next", current: slide_wraps[idx], prev: slide_wraps[idx-1]};
                const data_b = { state: "next", current: swiper_lists[idx], prev: swiper_lists[idx-1]};
                
                if(code_box.classList.contains("show")) fadeOut({ target: ".rotation-box .svg-codes", stagger: false });
                console.log("next-idx: ", idx );
                handleMainSlide(data_a);
                handlePalleteSlide(data_b);
            }
        }
    });

    ctrl_items.forEach((item) => { item.classList.remove("hide"); });

    gsap.fromTo(".ctrl-item", { opacity: 0, y: -10 }, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.in",
        onComplete: function(){
            slide_wraps.forEach((item, idx) => {
                let obj_nm = item.getAttribute("object-name");
                if(obj_nm === show){
                    mSwiper.slideTo(idx, 500);
                    item.classList.add("show");
                    item.children[0].classList.add("show");
                }
            });
            ctrl_items.forEach((item) => { item.style.zIndex = 10 });

            beginSVGanimation({ delay: 500 });
            initPalletteSwiper({ state, show });
        }
    });
    initColorPicker();
}
function hideMainUIs(){
    const ctrl = document.querySelectorAll(".ctrl-cont");
    const canvas = document.getElementById("canvas");
    const ctrl_items = document.querySelectorAll(".ctrl-item");
    const dots = document.querySelectorAll(".dot");
    const cards = document.querySelectorAll(".card");
    const test_imgs = document.querySelectorAll(".test-zone img");
    const lists = document.getElementById("results-wrap");
    const fst_cont = document.querySelector(".cont-wrapper");
    const seq = gsap.timeline();

    fst_cont.classList.add("show");
    animation_state = "processing";


    // reset
    // dots.forEach((item) => { item.remove(); });
    // cards.forEach((item) => { item.remove(); });
    // test_imgs.forEach((item) => { item.src = ""; });
    // lists.innerHTML = "";

    seq.fromTo(".ctrl-item", { opacity: 1, y: 0 }, {
        opacity: 0, y: -10,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.in",
        onComplete: function(){
            ctrl_items.forEach((item) => { 
                item.style.zIndex = "";
                item.classList.remove("hide");
            });
            
        }
    });
    seq.fromTo(".cont-wrapper", { opacity: 0, y: -10, delay: 1 }, {
        opacity: 1, y: 0,
        onComplete: function(){
            animation_state = "waiting";
            canvas.classList.remove("active");
            ctrl.forEach((item) => { item.classList.add("dspl-n") });
        }
    })
}

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ BIND EVENTS ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

function bindEventsA(){
    const btns_lt = document.querySelectorAll(".pallette .lt-btn-wrap li");
    const btns_rt = document.querySelectorAll(".pallette .rt-btn-wrap li");
    const indicator_lt = document.querySelector(".lt-btn-wrap .indicator");
    const indicator_rt = document.querySelector(".rt-btn-wrap .indicator");
    const btns_menu = document.querySelectorAll(".pallette .menu-item button");
    const btn_copy = document.getElementById("btn-copy");
    const btn_dwn = document.getElementById("btn-dwn");
    
    // EVENT
    btns_lt.forEach((btn) => {
        let x = btn.offsetLeft;
        if(btn.classList.contains("active")){
            console.log(2, btn)
            indicator_lt.style.transform = `transLateX(${x}px)`;
        }
        btn.addEventListener("click", (e) => {
            const swiper = document.querySelector(".icons-container");
            const color = document.querySelector(".menu-cont.color-pick");
            const svg = document.querySelector(".rotation-box li.show");
            const code = document.querySelector(".svg-codes");
            const btn_code = btn.children[0].classList.contains("btn-show-code") ?  btn.children[0] : "";
            const btn_list = btn.children[0].classList.contains("btn-list") ?  btn.children[0] : "";
            const btn_color = btn.children[0].classList.contains("btn-color-pick") ?  btn.children[0] : "";
            const callBackFunc = () => { code.classList.remove("show"); }
            const prc = animationProcessCheck();
            if(prc === true) return;
    
            btns_lt.forEach((btn) => { btn.classList.remove("active") });
    
            btn.classList.add("active");
            indicator_lt.style.transform = `transLateX(${x}px)`;
    
            if(btn_code && !code.classList.contains("show")){
                code.children[0].innerText = svg.innerHTML; // svg코드 삽입
                code.classList.add("show");
    
                fadeIn({ target: ".svg-codes", stagger: false });
            }else{
                fadeOut({ target: ".svg-codes", stagger: false, func: callBackFunc, param: "" });
            }
    
            if((btn_list || btn_color) && code.classList.contains("show")) fadeOut({ target: ".svg-codes", stagger: false, func: callBackFunc, param: "" });
    
            if(btn_list && !swiper.classList.contains("show")){
                swiper.classList.add("show");
                gsap.fromTo(swiper, { opacity: 0, y: -15 }, {
                    opacity: 1, y: 0,
                    duration: 0.5,
                    ease: "back.in",
                    onUpdate: function(){ animation_state = "processing" },
                    onComplete: function(){
                        animation_state = "waiting";
                        color.classList.remove("show");
                    }
                });
                gsap.to(color, {
                    opacity: 0, y: 15,
                    duration: 0.5,
                    ease: "back.in",
                    onUpdate: function(){ animation_state = "processing"; },
                    onComplete: function(){ animation_state = "waiting"; }
                });
            }
    
            if(btn_color && !color.classList.contains("show")){
                color.classList.add("show");
                gsap.fromTo(color, { opacity: 0, y: -15 }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "back.in",
                    onUpdate: function(){ animation_state = "processing"; },
                    onComplete: function(){
                        animation_state = "waiting";
                        swiper.classList.remove("show");
                    }
                });
                gsap.to(swiper, {
                    opacity: 0,
                    y: 15,
                    duration: 0.5,
                    ease: "back.in",
                    onUpdate: function(){ animation_state = "processing"; },
                    onComplete: function(){ animation_state = "waiting"; }
                });
            }
        });
    });
    
    btns_rt.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            btns_rt.forEach((btn) => {
                btn.classList.remove("active");
            });
    
            btn.classList.add("active");
    
            if(btn.children[0].classList.contains("btn-dark")){
                document.body.classList.add("dk-mode");
            }
            if(btn.children[0].classList.contains("btn-light")){
                document.body.classList.remove("dk-mode");
            }
        });
    });
    
    btn_dwn.addEventListener("click", () => {
        const svg = document.querySelector(".rotation-box li.show svg");
        const file_nm = svg.getAttribute("data-icon");
        
        saveSvg(svg, file_nm+".svg");
        handleNotice({ 
            stage: "init", 
            descr: `"${file_nm}"를(을) 다운로드했습니다.`, 
            className: "dwn-popup"
        });
        setTimeout(() => {
            handleNotice({ stage: "finished" });
            setTimeout(() => { notice.classList.remove("dwn-popup"); }, 800 );
        }, 1800);
    });
    
    btn_copy.addEventListener("click", () => {
        const svg = document.querySelector(".rotation-box li.show svg");
        const file_nm = svg.getAttribute("data-icon");
        const prc = animationProcessCheck();
        let code = document.querySelector(".rotation-box .svg-codes p.inner").innerText;
        if(prc === true) return;
    
        navigator.clipboard.writeText(code);
    
        handleNotice({ 
            stage: "init", 
            descr: `"${file_nm}"를(을) 립보드에 복사했습니다.`, 
            className: "copied-popup" 
        });
        setTimeout(() => {
            handleNotice({ stage: "finished" });
            setTimeout(() => { notice.classList.remove("copied-popup"); }, 800 );
        }, 1800);
    });
}
function bindEventsB(){
    const cards = document.querySelectorAll(".container .card");

    cards.forEach((card) => {
        card.addEventListener("click", (e) => {
            const className = e.target.className.baseVal;
            const object_nm = card.getAttribute("object-name");
            const prc = animationProcessCheck();
            if(prc === true) return;

            if(className?.indexOf("chevron") === -1) handleMainAction({ state: "finished", show: object_nm });
        });
    });
}
function bindEventsC(){
    const icons = document.querySelectorAll(".pallette .swiper-list li");

    icons.forEach((icon, idx_a) => {
        icon.addEventListener("click", (e) => {
            const active_wrap = document.querySelectorAll(".pallette .swiper-list.show li");
            const main_lists = document.querySelectorAll(".main-slides .slide-wrap.show li");
            const code_box = document.querySelector(".rotation-box .svg-codes");
            let prev_idx, curr_idx;
            const prc = animationProcessCheck();
            if(prc === true) return;

            if(code_box.classList.contains("show")) fadeOut({ target: ".rotation-box .svg-codes", stagger: false });

            active_wrap.forEach((icon, idx_a) => {
                if(icon.classList.contains("active")) prev_idx = idx_a;
                icon.classList.remove("active");
            });

            icon.classList.add("active");

            active_wrap.forEach((icon, idx_b) => { if(icon.classList.contains("active")) curr_idx = idx_b; });
            
            // console.log("prev-idx: ", prev_idx);
            // console.log("curr-idx: ", curr_idx);
            // console.log(curr_idx, "main_lists: ", main_lists)

            if(curr_idx > prev_idx){
                // console.log("1. 왼쪽에서 오른쪽");
                main_lists[curr_idx].classList.add("show");
                gsap.fromTo(main_lists[curr_idx], { opacity: 0, x: -270 }, {
                    opacity: 1,
                    x: 0,
                    duration: .5,
                    ease: "ease.in",
                    onUpdate: function(){ animation_state = "processing" },
                    onComplete: function(){
                        animation_state = "waiting";
                        main_lists[prev_idx].classList.remove("show");

                        beginSVGanimation({ delay: 0 });
                    }
                });
                gsap.fromTo(main_lists[prev_idx],{ opacity: 1, x: 0 }, {
                    opacity: 0,
                    x: 270,
                    duration: .5,
                    ease: "ease.in",
                    onUpdate: function(){ animation_state = "processing" },
                    onComplete: function(){
                        animation_state = "waiting";
                        main_lists[prev_idx].classList.remove("show");
                    }
                });
            }
            if(curr_idx < prev_idx){
                // console.log("2. 오른쪽에서 왼쪽");
                main_lists[curr_idx].classList.add("show");
                gsap.fromTo(main_lists[curr_idx], { opacity: 0, x: 270 }, {
                    opacity: 1,
                    x: 0,
                    duration: .5,
                    ease: "ease.in",
                    onUpdate: function(){ animation_state = "processing" },
                    onComplete: function(){
                        animation_state = "waiting";
                        main_lists[prev_idx].classList.remove("show");

                        beginSVGanimation({ delay: 0 });
                    }
                });
                gsap.fromTo(main_lists[prev_idx], { opacity: 1, x: 0 }, {
                    opacity: 0,
                    x: -270,
                    duration: .5,
                    ease: "ease.in",
                    onUpdate: function(){ animation_state = "processing" },
                    onComplete: function(){
                        animation_state = "waiting";
                        main_lists[prev_idx].classList.remove("show");
                    }
                });
            }
        });
    });
}
function bindEventsD(){
    const dots = document.querySelectorAll("#container .dot");
    const cards = document.querySelectorAll(".card");
    // if(device === "PC") return false;

    dots.forEach((item) => {
        item.addEventListener("click", (e) => {
            const prc = animationProcessCheck();
            if(prc === true) return;

            const container = document.getElementById("container");
            const { oiffsetLeft, offsetTop, clientWidth, clientHeight } = container;
            const centerX = oiffsetLeft + (clientWidth  / 2);
            const centerY = offsetTop + (clientHeight  / 2);
            const dotA = `dot${e.target.getAttribute("data-idx")}`;
            cards.forEach((card) => {
                const dotB = card.getAttribute("center-target");
                const x = centerX - card.clientWidth;
                const y = centerX - card.clientHeight;

                if(card.classList.contains("selected")){
                    gsap.to(card, {
                        opacity: 0, y: -10,
                        duration: 1,
                        stagger: 0.3,
                        ease: "back.in",
                        onStart: function(){ handleNotice({ stage: "finished" }) },
                        onUpdate: function(){ animation_state = "processing" },
                        onComplete: function(){ 
                            animation_state = "waiting";
                            card.classList.remove("selected");
                            card.classList.add("dspl-n");
                        }
                    });
                }else{
                    if(dotA === dotB){
                        card.classList.remove("dspl-n");
                        card.classList.add("selected");
                        gsap.fromTo(card, { opacity: 0, y: -10}, {
                            opacity: 1, y: 0,
                            duration: 1,
                            stagger: 0.3,
                            ease: "back.in",
                            onStart: function(){ handleNotice({ stage: "finished" }) },
                            onUpdate: function(){ animation_state = "processing" },
                            onComplete: function(){ animation_state = "waiting"; }
                        });
                    }
                }
            })
        });
    });
    document.getElementById("container").addEventListener("click", (e) => {
        if(e.target.getAttribute("id") === "selected-img"){
            fadeOut({ 
                target: ".card.selected", 
                stagger: false,
                func: () => { document.querySelector(".card.selected").classList.remove("selected") }
            });
        }
    });
}
/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ PALETTE ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

function saveSvg(svgEl, name) {
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// color picker
function initColorPicker(){
    if(document.querySelector(".IroColorPicker")) return false;

    const handle = document.getElementById("handle");
    const colorPicker  = new iro.ColorPicker("#sliderPicker", {
        width: document.querySelector("#sliderPicker").clientWidth,
        // boxHeight: "",
        color: "rgb(255, 0, 0)",
        // borderWidth: 1,
        borderColor: "black",
        handleRadius: 8,
        // activeHandleRadius: "",
        handleSvg: '#handle',
        handleProps: { x: 0, y: -9 },
        layout: [{
            component: iro.ui.Slider,
            options: {
                sliderType: 'hue'
            }
        }]
    });

    handle.children[0].style.fill = colorPicker.color.hexString;

    //EVENTS
    colorPicker.on('color:change', function(color) {
        const icons = document.querySelectorAll(".rotation-box .slide path");
        const icon_show = document.querySelector(".rotation-box .slide.show path");

        // icons.forEach((icon) => { icon.style.stroke = "" });

        icon_show.style.stroke = color.hexString;
        handle.children[0].style.fill = color.hexString;
    });
}

function initPalletteSwiper(obj){
    const { state, show } = obj;
    const swipers = document.querySelectorAll(".icons-container .swiper-list");
    let sSwiper;

    if(state === "init"){
        swipers.forEach((swiper, idx) => {
            let obj_nm = swiper.getAttribute("object-name");
            sSwiper = new Swiper(".swiperPallete-"+(idx+1), {
                slidesPerView: 4,
                spaceBetween: 30,
                speed: 500,
                freeMode: true
            });
            if(obj_nm === show){ swiper.classList.add("show"); }
        });
    }else{
        swipers[0].classList.add("show");
    }
}


let flag_c = false;
$(function(){
    if(device === "PC" && dev_size !== "MOBILE"){
        $(document).on("mousemove", ".card", function(e){
            const prc = animationProcessCheck();
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
    }
});

function getPos(){
    const dot = document.querySelectorAll("#container .dot");
    const dot_ttl = dot.length;
    const loadingBar = document.querySelector(".loading-bar .bar");
    let data, card;
    let dot_data;
    let proc;
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
        proc = Math.round( (cards.length / dot_ttl) * 100);

        loadingBar.style.width = `${proc}%`;
        if(proc === 100) handleNotice({ stage: "finished" });
    });
    console.log(0)
    bindEventsD();

    if(device === "PC" && dev_size !== "MOBILE"){
        gsap.fromTo(".card", { opacity: 0, y: -10 }, {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.3,
            ease: "back.in",
            onStart: function(){ handleNotice({ stage: "finished" }) },
            onUpdate: function(){ animation_state = "processing" },
            onComplete: function(){ 
                animation_state = "waiting"; 
                bindEventsB();  
            }
        });
    
        cards.forEach((item, idx) => {
            dot_data = item.dot.getBoundingClientRect();
            startX = (dot_data.width) / 2 + dot_data.x;
            startY = (dot_data.height) / 2 + dot_data.y;
    
            card.drawLineA(startX, startY, item.cornerX, item.cornerY);
        });
    }
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
        this.complete = false;
        this.created = [];
        this.icons = obj.detected.sub;
        this.name = obj.detected.name;
    }

    createCard(){
        const PI2 = Math.PI * 2;
        const angle = PI2 / this.points;
        const width = 150;
        const height = 150;
        let centerX, centerY, left, top;
        let elem = "";
        let icon;

        if(dev_size === "MOBILE"){
            const card = document.createElement("div");
            card.setAttribute("class", `card card-${this.numb}`);
            card.setAttribute("center-target", `dot${this.numb}`);

            card.style.width = `${width}px`;
            card.style.height = `${height}px`;

            elem = '<div class="main swiper-'+this.numb+'">';
            elem +=     '<ul class="inner swiper-wrapper">';
            for(let n = 0; n < this.icons.length; n++){
                if(n < 10){
                    icon = `fa-light ${this.icons[n]}`;
                    elem += `<li class="swiper-slide"><div class="svg-box"><i class="${icon} icon m-icon"></i></div></li>`;
                }
            }
            elem +=     '</ul>';
            elem +=     '<button class="btn-direct swiper-button-prev btn-prev"><div class="svg-box"><i class="fa-regular fa-chevron-left"></i></div></button>';
            elem +=     '<button class="btn-direct swiper-button-next btn-next"><div class="svg-box"><i class="fa-regular fa-chevron-right"></i></div></button>';
            elem +=     '<div class="swiper-pagination"></div>';
            elem += '</div>';

            card.setAttribute("object-name", `${this.name}`);
            this.container.appendChild(card);
            card.innerHTML = elem;

            const swiper = new Swiper(`.swiper-${this.numb}`, {
                slidesPerView: 1,
                pagination: {
                    el: ".swiper-pagination",
                    type: "fraction",
                },
                loop: false,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        }

        if(device === "PC" && dev_size !== "MOBILE"){
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
                        icon = `fa-light ${this.icons[n]}`;
                        elem += `<li class="swiper-slide"><div class="svg-box"><i class="${icon} icon m-icon"></i></div></li>`;
                    }
                }
                elem +=     '</ul>';
                elem +=     '<button class="btn-direct swiper-button-prev btn-prev"><div class="svg-box"><i class="fa-regular fa-chevron-left"></i></div></button>';
                elem +=     '<button class="btn-direct swiper-button-next btn-next"><div class="svg-box"><i class="fa-regular fa-chevron-right"></i></div></button>';
                elem +=     '<div class="swiper-pagination"></div>';
                elem += '</div>';

                card.setAttribute("object-name", `${this.name}`);

                if(this.initNumb === (i+1) && this.complete === false){
                    // console.log(`%c◀◀◀◀◀◀◀◀◀◀◀◀ [step1-추가] dot-numb: ${this.numb} | initNumb: ${this.initNumb} | complete: ${this.complete} ▶▶▶▶▶▶▶▶▶▶`, "background: black;color: aqua");
                    this.container.appendChild(card);
                    card.innerHTML = elem;
                    const swiper = new Swiper(`.swiper-${this.numb}`, {
                        slidesPerView: 1,
                        pagination: {
                            el: ".swiper-pagination",
                            type: "fraction",
                        },
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
    }

    checkCollision(card_target){
        // const cont_data = this.container.getBoundingClientRect();
        const { offsetLeft, offsetTop } = document.getElementById("container");
        const window_w = window.innerWidth;
        const window_h = window.innerHeight;
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

        cards.forEach((card, idx) => {
            const card_data = card.getBoundingClientRect();
            const dot = document.querySelector(`.dot${this.numb}`);
            const dot_data = dot.getBoundingClientRect();
            x1_compare =  Math.round(card_data.x);
            y1_compare =  Math.round(card_data.y);
            x2_compare = x1_compare + card_data.width;
            y2_compare = y1_compare + card_data.height;
            
            if(
                (stage_x1 > x1_compare || stage_x2 < x2_compare) ||
                (stage_y1 > y1_compare || stage_y2 < y2_compare)
            ){
                this.initNumb++;
                if( this.cnt1 > 100 ){
                    this.initNumb = 1;
                    this.radius = 120;
                }
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

                card_target.remove();

                if( this.initNumb === this.points){
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

        // console.log("길이: ", document.querySelectorAll(".card").length)
        this.complete = true;

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

    if(device === "PC"){
        dots.forEach((item, idx) => {
            const data = item.getBoundingClientRect();
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
                ctx.beginPath();
                ctx.moveTo(item.centerX, item.centerY);
                ctx.lineTo(item.cornerX, item.cornerY);
                ctx.strokeStyle = '#3AB8FF';
                ctx.stroke();
            });
        }
    }
}

function detectDevice(){
    let userAgent = navigator.userAgent.toLowerCase();
    let detectWV = userAgent.indexOf("wv");
    let detectAndroid = userAgent.indexOf("android");
    let detectIPhone = userAgent.indexOf("iphone");
    let detectIPad = userAgent.indexOf("ipad");
    let filter = "win16|win32|win64|mac|macintel";
    let device = "";

    if ( navigator.platform ) {
        if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0) {
            if(detectAndroid > -1){
                if(navigator.userAgent.indexOf("CriOS") > -1 || navigator.userAgent.indexOf("DaumApps") > -1 || navigator.userAgent.indexOf("NAVER") > -1 || navigator.userAgent.indexOf("EdgiOS") > -1 || navigator.userAgent.indexOf("KAKAOTALK") > -1 || navigator.userAgent.indexOf("SamsungBrowser") > -1 || (detectWV == -1 && navigator.userAgent.indexOf("Chrome"))){
                    // alert('[안드로이드] 웹 입니다');
                    device = "AND-WEB";
                }else{
                    // alert('[안드로이드] 앱 입니다');
                    device = "AND-APP";
                }
            }else if(detectIPhone > -1 || detectIPad > -1){
                if(navigator.userAgent.indexOf("Safari") > -1 || navigator.userAgent.indexOf("CriOS") > -1 || navigator.userAgent.indexOf("DaumApps") > -1 || navigator.userAgent.indexOf("NAVER") > -1 || navigator.userAgent.indexOf("EdgiOS") > -1 || navigator.userAgent.indexOf("KAKAOTALK") > -1){
                    // alert('[IOS] 웹 입니다');
                    device = "iOS-WEB";
                }else{
                    // alert('[IOS] 앱 입니다');
                    device = "iOS-APP";
                }
            }
        }else{
            device = "PC";
        }
        return device;
    }
};

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
    const loadingBar = document.querySelector(".loading-bar .bar");
    const { stage, descr, className } = data;
    const popup = document.querySelector(".notice-popup");
    const text = document.querySelector(".notice-popup .text");
    const classArray = [ "show-result-popup", "card-proc-popup", "dwn-popup", "copied-popup" ];
    const callBackFunc = () => {
        classArray.forEach((item) => {
            if(popup.classList.contains(item)) popup.classList.remove(item);
        });
    };

    if(stage === "init"){
        popup.classList.add("show");
        popup.classList.add(className);
        text.innerText = descr;

        if(className === "card-proc-popup") loadingBar.style.width = "1%";

        fadeIn({ target: ".notice-popup", stagger_state: false });
    }
    if(stage === "finished"){
        fadeOut({ 
            target: ".notice-popup", 
            stagger_state: false,
            func: callBackFunc
        });
    }
}

function setCookie(data){
    const todayDate = new Date();

    todayDate = new Date(parseInt(todayDate.getTime() / 86400000) * 86400000 + 54000000);

    if ( todayDate > new Date() ){
        data.expiredays = data.expiredays - 1;
    }

    todayDate.setDate( todayDate.getDate() + data.expiredays );
    document.cookie = data.name + "=" + escape( data.value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ MAIN EVENTS ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
const btn_goBack = document.querySelector(".goback .btn-back");
const btn_share = document.querySelector(".btn-share");

btn_goBack.addEventListener("click", () => {
    const prc = animationProcessCheck();
    if(prc === true) return;

    hideMainUIs();
});
btn_share.addEventListener("click", () => {
    kakaoInit();
});

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ KAKAO ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */
function kakaoInit(){
    Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
        title: '팀플레이어 김찬기 포트폴리오',
        description: '2022.07.05 ~ ing',
        imageUrl: 'https://img1.daumcdn.net/thumb/C428x428/?scode=mtistory2&fname=https%3A%2F%2Ftistory4.daumcdn.net%2Ftistory%2F4007905%2Fattach%2F7d95921c781e48beb4e0a1dcf829487b',
        link: {
            mobileWebUrl: 'https://blackstarzck.github.io/chanki-portfolio/',
            webUrl: 'https://blackstarzck.github.io/chanki-portfolio/',
        },
        },
        buttons: [
        {
            title: '방문하기',
            link: {
                mobileWebUrl: 'https://blackstarzck.github.io/chanki-portfolio/',
                webUrl: 'https://blackstarzck.github.io/chanki-portfolio/',
            },
        },
        ],
        installTalk: true,
    })
}