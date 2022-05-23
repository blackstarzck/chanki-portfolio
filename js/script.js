
verifyLength({ source: "./img/def-img.jpg", target:  ".img-01"});

$(function(){
    console.log("제이쿼리 작동됨");
})


/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ EVENTS START ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

// 애니매이션 중 클릭 방지
let animation_state = "waiting";
let animation_stack = 0; 

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

document.getElementById("setDefImg").addEventListener("click", function(){
    const def_img = { src: "./img/def-img.jpg", location: document.querySelector(".img-01 #selected-img") };
    let prc = animationProcessCheck();
    if(prc === true) return;

    handleImgUpload({ select_type: "default" }, { src: def_img.src })
    .then(function(result){
        handleState({ stage: "init", layout: "default", option: result });
    });

    // handleImgUpload({ select_type: "default" }, { src: def_img.src })
    // .then(function(result){
    //     handleState({ stage: "init", layout: "default", option: result });
    // });
});

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ EVENTS END ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

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

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ ANIMATION FUNCTIONS START ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

function animationProcessCheck(){
    let prc;
    if(animation_state === "processing" && animation_stack !== 0) prc = true;
    else prc = false;
    
    return prc;
}
function fadeIn(obj){
    const target = document.querySelector(obj.target);
    target.classList.remove("dspl-n");
    target.classList.add("dspl-b");

    return new Promise((resolve) => {

        if(obj.stagger === true){
            gsap.fromTo(target.children, { opacity: 0, y: -10 }, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.1,
                ease: "back.in",
                onStart: function(){ animation_stack++; },
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    console.log("===================== 1. fadeIn target: "+target.className+" =====================");

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
            // alert(`[2] fadeIn target: ${target.className}`);
            // if(obj.func !== undefined) obj.func(obj.param);

            gsap.fromTo(target, { opacity: 0, y: -10 }, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "back.in",
                onStart: function(){ animation_stack++; },
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    console.log("===================== 2. fadeIn target: "+target.className+" =====================");                   
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
            gsap.to(target.children, {
                duration: 0.5, 
                opacity: 0, 
                y: -10, 
                stagger: 0.1,
                ease: "back.in",
                onStart: function(){ animation_stack++; },
                onUpdate: function(){ animation_state = "processing" },
                onComplete: function(){
                    console.log("===================== 1. fadeOut target: "+target.className+" =====================");
    
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
                    console.log("===================== 2. fadeOut target: "+target.className+" =====================");
    
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

/* ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ IMAGE UPLOAD FUNCTIONS START ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ */

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
                    console.log("visible: " + visible);
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

                // console.log(preview);
                // console.log(src);
                console.log("[함수] handleImgUpload");
                resolve({ source: src, target:  visible});
            }
        }
    });
}

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
            console.log("[[1]] handleState");

            fadeIn({ target: ".lt-cont .icon-bg + span", stagger: false });
            fadeOut({ target: ".icon-wrap.cstm", stagger: true })
            .then(function(){
                animation_state = "processing";
                fadeIn({ target: ".icon-wrap.default", stagger: true });
            });
        }
        if(state.stage === "standby" && state.layout === "cstm"){ 
            console.log("[[2]] handleState");

            fadeOut({ target: ".lt-cont .icon-bg + span", stagger: false });
            fadeOut({ target: ".icon-wrap.default", stagger: true })
            .then(function(){
                animation_state = "processing";
                fadeIn({ target: ".icon-wrap.cstm", stagger: true });
            });
        }
        if(state.stage === "init"){
            const prc_wait = document.querySelector(".prc-wrap.wait");
            let fade_out, fade_in;
            let src = data.option;
            const callBackFunc = function(src){
                if(state.layout === "default"){
                    fadeOut({ target: ".lt-cont .icon-bg + span", stagger: false });
                    fadeOut({ target: ".icon-wrap.default", stagger: true })
                    .then(function(){
                        animation_state = "processing";
                        fadeIn({ target: ".icon-wrap.cstm", stagger: true });
                    });
                }
            }
            
            verifyLength(option);

            if(!prc_wait.classList.contains("dspl-n")){
                fade_out = ".prc-wrap.wait";
                fade_in = ".prc-wrap.show-img";
                stagger_state = true;
            }else{
                console.log(data);
                fade_out = option.target === ".img-01" ? ".img-02" : ".img-01";
                fade_in = option.target;
                stagger_state = false;
            }

            console.log("[[2]] handleState");
            // alert(`fade_out: ${fade_out}\nfade_in: ${fade_in}\nstagger_state: ${stagger_state}`);
            
            fadeOut({ target: fade_out })
            .then(function(){
                animation_state = "processing";
                fadeIn({ 
                    target: fade_in,
                    stagger: stagger_state,
                    func: callBackFunc,
                    param: src
                });
            });
        }
        if(state.stage === "pending"){ 
            
        }
        console.log("[함수] handleState");
        resolve("");
    });
}

function verifyLength(obj){
    const target = obj.target;
    let img = new Image();
    let width, height, alg;

    img.src = obj.source;
    img.onload = function(){
        width = img.width;
        height = img.height;
    
        alg = (width > height) ? "hrz" : "vrt";
    
        document.querySelector(target).classList.remove("vrt");
        document.querySelector(target).classList.remove("hrz");
        document.querySelector(target).classList.add(alg);
    
        // alert(obj.source);
        // alert(`[2] 길이계산 대상: ${obj.target} | width: ${width} | height: ${height} | alg: ${alg}`);
        // console.log(`[함수] verifyLength`);
        return;
    }
}

function showImg(){

}

function detectObject(){

}