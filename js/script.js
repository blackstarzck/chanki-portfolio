window.onload = () => {
    
}

document.getElementById('switch').addEventListener("click", function(){
    const target = varifyLayout();
    const opposite = target === ".icon-wrap.default" ? ".icon-wrap.cstm" : ".icon-wrap.default";
    const txt = document.querySelector(".lt-cont .icon-bg + span");
    const opt = target === ".icon-wrap.default" ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 };

    console.log(`target: ${target} | opposite: ${opposite}`);
    
    fadeOut({ target })
        .then(function(){
            gsap.to(txt, {
                duration: 0.5, 
                opacity: opt.opacity, 
                y: opt.y,
                onComplete: function(){
                    fadeIn({ target: opposite });
                }, 
            });
        })
});

function varifyLayout(){
    const layouts = document.querySelectorAll(".lt-cont .icon-wrap");
    let target;

    layouts.forEach(function(item){
        if(!item.classList.contains("dspl-n") || getComputedStyle(item).display !== "none") target = item.classList;

        if(String(target).indexOf("default") > -1) target = ".icon-wrap.default";
        if(String(target).indexOf("default") === -1) target = ".icon-wrap.cstm";

    });

    return target;
}

function fadeIn(obj){
    const target = document.querySelector(obj.target);
    const display = obj.target === ".icon-wrap.cstm" ? "dspl-f" : "dspl-b";

    target.classList.remove("dspl-n");
    target.classList.add(display);

    gsap.fromTo(target.children, {
        opacity: 0, 
        y: -10
    }, {
        opacity: 1,
        y: 10,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.in"
    });
}

function fadeOut(obj){
    const target = document.querySelector(obj.target);

    return new Promise((resolve, rejsect) => {
        gsap.to(target.children, {
            duration: 0.5, 
            opacity: 0, 
            y: -10, 
            stagger: 0.1,
            ease: "back.in",
            onComplete: function(){
                target.classList.remove("dspl-b");
                target.classList.remove("dspl-f");
                target.classList.add("dspl-n");
                resolve("");
            },
        });
    });
}