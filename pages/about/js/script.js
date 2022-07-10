//console.log(window.innerHeight); // 969px. 사용자의 크롬의 기준치이다.
(() => {
    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
    let enterNewScene = false; // scene에서 scene으로 이동 시 간혹 스크롤 값이 마이너스가 나온다. 이부분을 보완하기 위함. 새로운 scene이 시작된 순간 true [function scrollLoop에서 사용된다.]
    let acc = 0.1; // requestAnimationFrame 사용 시 감속의 속도를 담당. (가속도)
    let delayedYOffset = 0;
    let rafId; // requestAnimationFrame(loop); 를 담은 변수.
    let rafState; // requestAnimationFrame의 상태 (멈춤/시작)을 담은 변수.
    const contactPop = document.querySelector('.global-nav a');
    const contactSec = document.querySelector('.contact');
    
    const closePop = document.querySelector('.contact  .close i');
    const sceneInfo = [ 
        {
        //section 0
        type: 'sticky',
        heightNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅 (5배)
        scrollHeight: 0, // 기기마다 스크린에 보여지는 사이즈가 다르기 때문에 기기가 가지고 있는 높이를 가지고 와서 사용할거임.
        objs: { //HTML section
            colorChange: document.querySelector('.local-nav .change-00'),
            container: document.querySelector('#scroll-section-0'),
            messageA: document.querySelector('#scroll-section-0 .main-message.a .context h2'),
            messageB: document.querySelector('#scroll-section-0 .main-message.b .context h2'),
            messageC: document.querySelector('#scroll-section-0 .main-message.c .context h2'),
            messageD: document.querySelector('#scroll-section-0 .main-message.d .context h2'),
            messageAa: document.querySelector('#scroll-section-0 .main-message.a .context p'),
            messageBb: document.querySelector('#scroll-section-0 .main-message.b .context p'),
            messageCc: document.querySelector('#scroll-section-0 .main-message.c .context p'),
            messageDd: document.querySelector('#scroll-section-0 .main-message.d .context p'),
            canvas: document.querySelector('#video-canvas-0'),
            context: document.querySelector('#video-canvas-0').getContext('2d'),
            videoImages: [] // 이미지 수백장을 넣을 것임.
        },
        values: {
            videoImageCount: 629, // 이미지 개수
            imageSequence: [0, 628], // 이미지 순서, 이미지의 인덱스
            canvas_opacity: [1, 0, {start: 0.9, end: 1}],
            messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}], // 투명도의 시작/끝 값(구간/범위), 전체 스크롤 값을 1로 하였을 때 10% - 20% (비율) ← 애니메이션 구간 설정
            // 아래 값 입력은 반드시 소수점으로 해야한다. 센션의 전체(스크롤)구간을 1로 하였을때, 비율로
            messageAa_opacity_in: [0, 1, {start: 0.15, end: 0.2}],
            messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
            messageBb_opacity_in: [0, 1, { start: 0.35, end: 0.4 }],
            messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
            messageCc_opacity_in: [0, 1, { start: 0.55, end: 0.6 }],
            messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
            messageDd_opacity_in: [0, 1, { start: 0.75, end: 0.8 }],
            messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
            messageAa_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
            messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
            messageBb_translateY_in: [20, 0, { start: 0.35, end: 0.4 }],
            messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
            messageCc_translateY_in: [20, 0, { start: 0.55, end: 0.6 }],
            messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
            messageDd_translateY_in: [20, 0, { start: 0.75, end: 0.8 }],
            messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
            messageAa_opacity_out: [1, 0, { start: 0.27, end: 0.3 }],
            messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
            messageBb_opacity_out: [1, 0, { start: 0.47, end: 0.5 }],
            messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
            messageCc_opacity_out: [1, 0, { start: 0.67, end: 0.7 }],
            messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
            messageDd_opacity_out: [1, 0, { start: 0.87, end: 0.9 }],
            messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
            messageAa_translateY_out: [0, -20, { start: 0.27, end: 0.3 }],
            messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
            messageBb_translateY_out: [0, -20, { start: 0.47, end: 0.5 }],
            messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
            messageCc_translateY_out: [0, -20, { start: 0.67, end: 0.7 }],
            messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
            messageDd_translateY_out: [0, -20, { start: 0.87, end: 0.9 }]
        }
    },
        { 
        // section 1
        type: 'normal',
        heightNum: 5, 
        scrollHeight: 0,
        objs: {
            colorChange: document.querySelector('.local-nav .change-01'),
            container: document.querySelector('#scroll-section-1'),
            counters: document.querySelectorAll('#scroll-section-1 .counters'),
            countersNumb: document.querySelectorAll('#scroll-section-1 .counters ul .numbers')
        }
    },
        { 
        // section 2
        type: 'sticky',
        heightNum: 5, 
        scrollHeight: 0,
        objs: {
            colorChange: document.querySelector('.local-nav .change-02'),
            container: document.querySelector('#scroll-section-2'),
            messageA: document.querySelector('#scroll-section-2 .a p'),
            messageB: document.querySelector('#scroll-section-2 .b'),
            messageC: document.querySelector('#scroll-section-2 .c'),
            canvas: document.querySelector('#video-canvas-1'),
            context: document.querySelector('#video-canvas-1').getContext('2d'),
            videoImages: []
        },
        values: {
            videoImageCount: 462,
            imageSequence: [0, 461],
            canvas_opacity_in: [0, 1, {start: 0, end: 0.1}],
            canvas_opacity_out: [1, 0, {start: 0.95, end: 1}],
            messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
            messageB_translateY_in: [30, 0, { start: 0.4, end: 0.45 }],
            messageC_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
            messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
            messageB_opacity_in: [0, 1, { start: 0.4, end: 0.45 }],
            messageC_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
            messageA_translateY_out: [0, -20, { start: 0.33, end: 0.38 }],
            messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
            messageC_translateY_out: [0, -20, { start: 0.8, end: 0.85 }],
            messageA_opacity_out: [1, 0, { start: 0.33, end: 0.38 }],
            messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
            messageC_opacity_out: [1, 0, { start: 0.8, end: 0.85 }]
        }
    },
        { 
        // section 3
        type: 'sticky',
        heightNum: 6, 
        scrollHeight: 0,
        objs: {
            colorChange: document.querySelector('.local-nav .change-03'),
            container: document.querySelector('#scroll-section-3'),
            canvas: document.querySelector('.image-blend-canvas'),
            context: document.querySelector('.image-blend-canvas').getContext('2d'),
            imagesPath: [
                './images/chanki1.jpg',
                './images/chanki.jpg'
            ],
            images: []
        },
        values: {
            rect1X: [0, 0, {start: 0, end:0}], // 사각형의 위치 조정
            rect2X: [0, 0, {start: 0, end:0}],
            blendHeight: [0, 0, {start: 0, end: 0}],
            canvas_scale: [0, 0, {start: 0, end: 0}],
            rectStartY: 0
        }
    },
        {
        // section 4
        type: 'sticky',
        heightNum: 4, // 브라우저 높이의 5배로 scrollHeight 세팅 (5배)
        scrollHeight: 0, // 기기마다 스크린에 보여지는 사이즈가 다르기 때문에 기기가 가지고 있는 높이를 가지고 와서 사용할거임.
        objs: { //HTML section
            colorChange: document.querySelector('.local-nav .change-04'),
            container: document.querySelector('#scroll-section-4'),
            messageA: document.querySelector('#scroll-section-4 .main-message.a .context h2'),
            image: document.querySelector('#scroll-section-4 img'),
            banner: document.querySelector('#scroll-section-4 .banner'),
            banner_bg: document.querySelector('#scroll-section-4 .banner .bg'),
            canvas: document.querySelector('#scroll-section-4 .background'),
            context: document.querySelector('#scroll-section-4 .background').getContext('2d'),
            imagesPath: [
                './images/resize.jpg'
            ],
            images: []
        },
        values: {
            background_size: [100, 15000, {start: 0.1, end: 1 }]
        }
    },
        { 
        // section 5
        type: 'sticky',
        heightNum: 5, 
        scrollHeight: 0,
        objs: {
            colorChange: document.querySelector('.local-nav .change-05'),
            container: document.querySelector('#scroll-section-5'),
            imgA: document.querySelector('#scroll-section-5 .black'),
            imgB: document.querySelector('#scroll-section-5 .white'),
            imgC: document.querySelector('#scroll-section-5 .red')
        },
        values: {
            imgB_clip_up: [100, 1, {start: 0.1, end: 0.3}],
            imgC_clip_up: [100, 1, {start: 0.4, end: 0.5}],
        }
    }
    ];
    //contact
    contactPop.addEventListener('click', ()=>{
        toggle();
    })
    contactSec.addEventListener('click', (event)=>{
        if(event.target === closePop || event.target === contactSec){
            toggle();
        }
    })
    function toggle(){
        contactSec.classList.toggle('active');
    }
    
    //lightbox
    const closeLightbox = document.querySelector('.close-lightbox');
    const lightbox =  document.querySelector('.lightbox');
    const lightboxImage = lightbox.querySelector('.main_img');
    const gallery = document.querySelector('.box');
    const galleryItem = gallery.querySelectorAll('.item');

    galleryItem.forEach(function(element){
        element.querySelector('.fa-plus').addEventListener('click', function(){
            lightbox.classList.remove('hide');
            lightbox.classList.add('show');
            lightboxImage.src = element.querySelector('.img').getAttribute('src');
        })
    })
    closeLightbox.addEventListener('click', function(){
        lightbox.classList.remove('show');
        lightbox.classList.add('hide');
    })
    lightbox.addEventListener('click', function(){
        if(Event.target != lightboxImage){
            lightbox.classList.remove('show');
            lightbox.classList.add('hide');
        }
    })
    
    const AA = sceneInfo[0].objs.container.scrollHeight + 
    sceneInfo[1].objs.container.scrollHeight + 
    sceneInfo[2].objs.container.scrollHeight + 
    sceneInfo[3].objs.container.scrollHeight;
    sceneInfo[4].objs.container.scrollHeight;
    
    

    function checkMenu(){
        if(yOffset > 45){
            document.body.classList.add('local-nav-sticky');
        }else{
            document.body.classList.remove('local-nav-sticky');
        }
    }
    function setCanvasImages(){ // sceneInfo(섹션 1 & 2) 배열에 이미지를 넣는다.
        let total = sceneInfo[0].values.videoImageCount + sceneInfo[2].values.videoImageCount + sceneInfo[3].objs.imagesPath.length + sceneInfo[4].objs.imagesPath.length;
        let cnt = 0;
        let imgElem;
        const txt = document.querySelector(".loading .count");
        const bar = document.querySelector(".loading .bar .inner");
        window.addEventListener("DOMContentLoaded", () => {
            for(let i = 0; i < sceneInfo[0].values.videoImageCount; i++){
                //imgElem = document.createElement('img');
                imgElem = new Image(); // 위와 같음. image객체가 생성되어 속성들을 추가할수 있음
                imgElem.src = `./video/IMG/IMG_${0001 + i}.jpg`;
                sceneInfo[0].objs.videoImages.push(imgElem);
    
                imgElem.onload = () => {
                    cnt++;
                    console.log(Math.round((cnt / total) * 100));
                    txt.innerText = Math.round((cnt / total) * 100) + "%";
                    bar.style.width = Math.round((cnt / total) * 100) + "%";
                }
    
            }
            let imgElem2;
            for(let i = 0; i < sceneInfo[2].values.videoImageCount; i++){
                //imgElem = document.createElement('img');
                imgElem2 = new Image(); // 위와 같음. image객체가 생성되어 속성들을 추가할수 있음
                imgElem2.src = `./video/video3/IMG_${001 + i}.jpg`;
                sceneInfo[2].objs.videoImages.push(imgElem2);
    
                imgElem2.onload = () => {
                    cnt++;
                    console.log(Math.round((cnt / total) * 100));
                    txt.innerText = Math.round((cnt / total) * 100) + "%";
                    bar.style.width = Math.round((cnt / total) * 100) + "%";
                }
            }
            let imgElem3;
            for(let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++){
                imgElem3 = new Image(); // 위와 같음. image객체가 생성되어 속성들을 추가할수 있음
                imgElem3.src = sceneInfo[3].objs.imagesPath[i];
                sceneInfo[3].objs.images.push(imgElem3);
    
                imgElem3.onload = () => {
                    cnt++;
                    console.log(Math.round((cnt / total) * 100));
                    txt.innerText = Math.round((cnt / total) * 100) + "%";
                    bar.style.width = Math.round((cnt / total) * 100) + "%";
                }
            }
            let imgElem4;
            for(let i = 0; i < sceneInfo[4].objs.imagesPath.length; i++){
                imgElem4 = new Image(); // 위와 같음. image객체가 생성되어 속성들을 추가할수 있음
                imgElem4.src = sceneInfo[4].objs.imagesPath[i];
                sceneInfo[4].objs.images.push(imgElem4);
    
                imgElem4.onload = () => {
                    cnt++;
                    console.log(Math.round((cnt / total) * 100));
                    txt.innerText = Math.round((cnt / total) * 100) + "%";
                    bar.style.width = Math.round((cnt / total) * 100) + "%";


                    window.onload = () => {
                        if(cnt === total) setTimeout(() => { document.body.classList.remove('before-load'); }, 1000);  // 투명도만 0이 되었음. 뒤에 바탕이 아무것도 안눌러짐.
                    }
                }
            }            
        });
    }
    
    function setLayout(){
        for(let i = 0; i < sceneInfo.length; i++){ //[스크롤 높이 세팅]
            if(sceneInfo[i].type === 'sticky'){
               sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight; //각 섹션의 높이 세팅. 사용자의 브라우저의 높이에 따른(scrollHeight값 구하기 → 969 * 5(heightNum))
            }else if(sceneInfo[i].type === 'normal'){
               sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight; // 해당 컨텐츠의 알맹이. 컨텐츠 자체 높이
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`; // 각 section(=컨테이너)의 높이를 scrollHeight값으로 넣기. 결과로는, 브라우저에 출력되어지는 윈도우의 크기가 커졌다!! scrollHeight(4845px) * 4만큼)
        }
        
        yOffset = window.pageYOffset;
        let totlaScrollHeight = 0;
        for(let i = 0; i < sceneInfo.length; i++){ // 페이지 리프레쉬(F5) 후 body에 show-scene-currentScene이 적용되지 않아 sticky-elem이 적용되지 않는다. 그것을 보완하기 위한 코드. [현재 활성 씬 반영하기]
            totlaScrollHeight += sceneInfo[i].scrollHeight; // 4845[0] 9690[1] 14,535[2] 19,380[3] 페이지 load 시 현재 스크롤양(yOffset)에 따라 섹션
            if(totlaScrollHeight >= yOffset){ // totlaScrollHeight: 섹션별 스크롤값 합의 크기(totlaScrollHeight)가 현재 스크롤 값의 크기(yOffset) 보다 크거나 같으면 currentScene은 (0 ~ 3)이다. 
                currentScene = i; // sceneInfo[0 ~ 3]
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
        
        const heightRatio = window.innerHeight / 1080; // (이미지의 높이1080 대비)브라우저 윈도우의 크기가 변하면 캔버스 크기도 따라서 변한다.
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`; // 캔버스의 위치조정, 브라우저 윈도우의 유동적 크기변화
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }
    function calcValues(values, currentYOffset){ // 현재 씬(섹션)에서의 스크롤된 범위를 비율로 구하기 sceneInfo 배열 안에 values값을 매개변수로 사용하겠다라는 의미.
        let rv;
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; //소수점으로 0 ~ 1 까지 표시됨.
        
        if(values.length === 3){
           // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart; // 애니메이션 구간
            
            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
               rv = (currentYOffset - partScrollStart)/ partScrollHeight * (values[1] - values[0]) + values[0]; // 
            }else if(currentYOffset < partScrollStart){
               rv = values[0];
            }else if(currentYOffset > partScrollEnd){
               rv = values[1];
            }
        }else{
            rv = scrollRatio * (values[1] - values[0]) + values[0]; // 범위 설정 ()
        }
        return rv;
    }
    
    function pageIndicator(){
        const tt = document.querySelectorAll('.local-nav li a');
        for(let i = 0; i < tt.length; i++){
            tt[i].classList.remove('change');
        }
    }
    
    function playAnimation(){
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values; // sceneinfo 배열안에 있는 messageA_opacity
        const currentYOffset = yOffset - prevScrollHeight; // 현재 씬에서의 스크롤 위치 값
        const scrollHeight = sceneInfo[currentScene].scrollHeight;
        const scrollRatio = currentYOffset / scrollHeight; // (현재 씬에서) 애니메이션 구간을 기준으로 비율
        pageIndicator();
        switch (currentScene){
            case 0:
                objs.colorChange.classList.add('change');
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);
                if(scrollRatio <= 0.22){
                    //in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
                    objs.messageAa.style.opacity = calcValues(values.messageAa_opacity_in, currentYOffset);
                    objs.messageAa.style.transform = `translateY(${calcValues(values.messageAa_translateY_in, currentYOffset)}%)`;
                }else{
                    //out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
                    objs.messageAa.style.opacity = calcValues(values.messageAa_opacity_out, currentYOffset);
                    objs.messageAa.style.transform = `translateY(${calcValues(values.messageAa_translateY_out, currentYOffset)}%)`;
                }
                if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageBb.style.opacity = calcValues(values.messageBb_opacity_in, currentYOffset);
					objs.messageBb.style.transform = `translate3d(0, ${calcValues(values.messageBb_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageBb.style.opacity = calcValues(values.messageBb_opacity_out, currentYOffset);
					objs.messageBb.style.transform = `translate3d(0, ${calcValues(values.messageBb_translateY_out, currentYOffset)}%, 0)`;
				}
	
				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageCc.style.opacity = calcValues(values.messageCc_opacity_in, currentYOffset);
					objs.messageCc.style.transform = `translate3d(0, ${calcValues(values.messageCc_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageCc.style.opacity = calcValues(values.messageCc_opacity_out, currentYOffset);
					objs.messageCc.style.transform = `translate3d(0, ${calcValues(values.messageCc_translateY_out, currentYOffset)}%, 0)`;
				}
	
				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageDd.style.opacity = calcValues(values.messageDd_opacity_in, currentYOffset);
					objs.messageDd.style.transform = `translate3d(0, ${calcValues(values.messageDd_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageDd.style.opacity = calcValues(values.messageDd_opacity_out, currentYOffset);
					objs.messageDd.style.transform = `translate3d(0, ${calcValues(values.messageDd_translateY_out, currentYOffset)}%, 0)`;
				}
                break;
            case 1:
                objs.colorChange.classList.add('change');
                const speed = 1000;
                if(scrollRatio > 0.3){
                    objs.countersNumb.forEach(counter => {
                        const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const inc = target / speed;
                    
                        if(count < target){ // 계산 중지
//                            counter.innerText = count + inc;
                            counter.innerText = Math.ceil(count + inc);
                            setTimeout(updateCount, 100);
                        }else{
                            count.innerText = target;
                        }
                    }
                    updateCount();
                });
                }
                break;
            case 2:
                objs.colorChange.classList.add('change');
                if (scrollRatio <= 0.5){
                    // in
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                } else {
                    // out
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                }
				if (scrollRatio <= 0.32) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
				if (scrollRatio <= 0.55) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
				}
				if (scrollRatio <= 0.75) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
				}
                
                // currentScene 3에서 쓰는 캔버스를 미리 그려주기 시작
                if(scrollRatio > 0.9){
                    const objs = sceneInfo[3].objs; // scene2와 scene3의 함수 충동을 막기 위해 if구문을 만들어 scene3에서 그린 캔버스를 넣어준다.
                    const values = sceneInfo[3].values;
                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height;
                    let canvasScaleRatio; // 캔버스 scale값을 결정한다.
                    
                    if(widthRatio <= heightRatio){
                        // 캔버스 보다 브라우저 창이 홀쭉한 경우
                        canvasScaleRatio = heightRatio;
                    }else{
                        // 캔버스 보다 브라우저 창이 납작한 경우
                        canvasScaleRatio = widthRatio;
                    }
                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                    objs.context.fillStyle = 'white'; // 캔버스 박스 색 넣기.
                    objs.context.drawImage(objs.images[0], 0, 0);
                    
                    // 캔버스 사이즈에 맞춰 가정한 innnerWidth와 innerHeight
                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
                    
                    // 사각형의 위치 지정
                    const whiteRectWidth = recalculatedInnerWidth * 0.15 // 15% 너비의 사각형
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2; // [0] 출발 값
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth; // [1] 끝 값
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth; // [0] 출발 값
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth; // [1] 끝 값
                    
                    //좌우 흰색 박스 그리기
                    objs.context.fillRect( // scene3과 다르게 초기 값만 입력해주면 된다. scene3과 다름.
                        parseInt(values.rect1X[0]), 
                        0,
                        parseInt(whiteRectWidth),
                        objs.canvas.height
                        ); // x, y, width, height // x값을 조정해서 애니메이션이 작동(스크롤에 따라).
                    objs.context.fillRect(
                        parseInt(values.rect2X[0]), 
                        0,
                        parseInt(whiteRectWidth),
                        objs.canvas.height
                        ); // x, y, width, height // x값을 조정해서 애니메이션이 작동(스크롤에 따라).
                    }
                break;
            case 3:
                objs.colorChange.classList.add('change');
//                console.log('3 play');
//                가로/세로 모두 꽉 차게 하기 위해 여기서 세팅(계산 필요)
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;
                let steps = 0;
                
                if(widthRatio <= heightRatio){
                    // 캔버스 보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio = heightRatio;
                }else{
                    // 캔버스 보다 브라우저 창이 납작한 경우
                    canvasScaleRatio = widthRatio;
                }
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white'; // 캔버스 박스 색 넣기.
                objs.context.drawImage(objs.images[0], 0, 0);
                
                // 캔버스 사이즈에 맞춰 가정한 innnerWidth와 innerHeight
                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio; // window.innerWidth는 브라우저 우측 스크롤바의 크기가 반영된 값이다. 그렇기 때문에 body 기준으로 사용해야 정확한 디자인이 가능하다.
                const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;
                
                // 애니메이션 관련 부분
                if(!values.rectStartY){ // 현재 rectStartY 값이 0이기 때문에 false가 나온다. 그래서 !느낌표를 붙힌다.
                    //values.rectStartY = objs.canvas.getBoundingClientRect().top; 화면상에 있는 오브잭트의 크기와 위치를 가져올 수 있다. 이경우 섹션3의 시작지점(top)의 값을 알 수 있다. 하지만 스크롤 속도에 영향을 받아 값이 항상 다르기 때문에 부정확하다. (오차가 남)
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;
                    
                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight; // 섹션3 진입 후 애니메이션 시작 구간을 설정. 중간정도 진입했을때
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight; // 애니메이션 끝나는 지점
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }
                
                // 사각형의 위치 지정
                const whiteRectWidth = recalculatedInnerWidth * 0.15 // 15% 너비의 사각형
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2; // [0] 출발 값
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth; // [1] 끝 값
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth; // [0] 출발 값
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth; // [1] 끝 값
                
                //좌우 흰색 박스 그리기
                objs.context.fillRect(
                    parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height
                ); // x, y, width, height // x값을 조정해서 애니메이션이 작동(스크롤에 따라).
                objs.context.fillRect(
                    parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height
                );
                
                if(scrollRatio < values.rect1X[2].end){
                    step = 1; // 캔버스가 상단에 닿기 전
                    objs.canvas.classList.remove('sticky'); // 붙었던 sticky-elem을 제거
                }else{
                    step = 2; // 캔버스가 상단에 닿은 후
                    // 이미지 블렌드
                    // blendHeight: [0, 0, {start: 0, end: 0}]
                    values.blendHeight[0] = 0; // 시작(고정) 값
                    values.blendHeight[1] = objs.canvas.height; // 끝 값
                    values.blendHeight[2].start = values.rect1X[2].end; // image1번이 윈도우 제일 상단에 위치했을때 image2(블렌드 이미지)이 시작
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.2; // start시점으로 부터 20% 속도/구간로 끝 값이 설정된다. (끝 값은 속도를 결정한다.)
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);
                    
                    objs.context.drawImage(objs.images[1], 
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
                    );
                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`; // 캔버스를 포지션 sticky로 적용시키면서 발생하는 문제: 캔버스가 브라우저 창 상단에 정확하게 붙지 않는다. (여백이 생겨진 상태). 이것을 해결하기 위한 스크롤 여백 값 계산.
                    if(scrollRatio > values.blendHeight[2].end){ // 2번째 이미지가 다 나온 뒤
                        values.canvas_scale[0] = canvasScaleRatio; // 시작 값 (구간 결정)
                        values.canvas_scale[1] = document.body.offsetWidth / (2 * objs.canvas.width); // 끝 값 (구간 결정)
                        values.canvas_scale[2].start = values.blendHeight[2].end;
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.2; // start시점으로 부터 20% 속도/구간로 끝 값이 설정된다. 
                        
                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
                        objs.canvas.style.marginTop = 0; // 포지션 fixt 해재, 블렌드 이미지의 시작부분을 아래에서 해결했으나, 아래에서 다시 위로 올라갈때 정상적으로 작동하지 않는다.
                    }
                    if(scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0){
                        objs.canvas.classList.remove('sticky');
                        objs.canvas.style.marginTop = `${scrollHeight * 0.4}px`; // 상단에 start + 0.2가 두개가 있다. 총 0.4
                    }
                }
                break;
            case 4:
                objs.colorChange.classList.add('change');
                const widthRatio2 = window.innerWidth / objs.canvas.width;
                const heightRatio2 = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio2;
                
                if(widthRatio2 <= heightRatio2){
                    // 캔버스 보다 브라우저 창이 홀쭉한 경우
                    canvasScaleRatio2 = heightRatio2;
                }else{
                    // 캔버스 보다 브라우저 창이 납작한 경우
                    canvasScaleRatio2 = widthRatio2;
                }
                objs.canvas.style.transform = `scale(${canvasScaleRatio2})`;
                objs.context.drawImage(objs.images[0], 0, 0);
                
                if(scrollRatio => 0){
                    objs.banner_bg.style.backgroundSize = `${calcValues(values.background_size, currentYOffset)}px`;
                }
                break;
            case 5:
                objs.colorChange.classList.add('change');
                if(scrollRatio <= 0.33){
                    objs.imgB.style.webkitClipPath = `inset(${calcValues(values.imgB_clip_up, currentYOffset)}% 0px 0px)`
                }
                if(scrollRatio <= 0.66){
                    objs.imgC.style.webkitClipPath = `inset(${calcValues(values.imgC_clip_up, currentYOffset)}% 0px 0px)`
                } 
                break;
        }
    }
    function scrollLoop(){ // 스크롤에 따른 섹션의 위치 파악 = 현재 활성시킬 씬 결정하기
        enterNewScene = false;
        prevScrollHeight = 0;
        for(let i = 0; i < currentScene; i++){
//            prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
            prevScrollHeight += sceneInfo[i].scrollHeight; // 
        }
        if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){ // yOffset을 사용해도 나는 되는데??
            enterNewScene = true; // 섹션간 이동 시 간혹 마이너스 값이 나오는데 이를 막기 위함. enterNewScene이 true일 때는 playAnimation을 실행하기 전에 return으로 함수 실행을 강제로 종료시켜서 playAnimation이 실행되지 않게 한 것입니다.
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if(delayedYOffset < prevScrollHeight){ // yOffset을 사용해도 나는 되는데??
            if(currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if(enterNewScene) return;
        playAnimation();
    }
    function loop(){ // 부드러운 감속 비디오
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
        
        if(!enterNewScene){ // enterNewScene는 false로 지정되었기 때문에 !enterNewScene는 "false가 아닌" 의미. 스크롤 아래로 내릴때는 정상작동하지만 아래서 위로 올라갈때는 콘솔창에 에러메시지가 뜬다. 이를 수정하기위함. (이미지가 점핑? 스킵스킵되어 보여지는 현상)
            if(currentScene === 0 || currentScene === 2){ // currentScene이 첫번째일때만 실행되게 함.
                const currentYOffset = delayedYOffset - prevScrollHeight; // 왼쪽은 playAnimation에 먼저 지정된 변수이다. loop함수에 단순히 이해력을 돕기위해 가지고 옴. 그리고 값은 기존에 yOffset이 아닌 delayedYOffset로 바꾸었다.
                const objs = sceneInfo[currentScene].objs; // loop함수 안에서 따로 지정을 해줘야한다. 그렇지 않으면 sceneInfo배열에 있는 변수를 인식하지 못한다.
                const values = sceneInfo[currentScene].values; // loop함수 안에서 따로 지정을 해줘야한다. 그렇지 않으면 sceneInfo배열에 있는 변수를 인식하지 못한다.
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset)); // playAnimation에 같은 내용
                if(objs.videoImages[sequence]){ //스크롤 아래로 내릴때는 정상작동하지만 아래서 위로 올라갈때는 콘솔창에 에러메시지가 뜬다. 이를 수정하기위함.
                    objs.context.drawImage(objs.videoImages[sequence], 0, 0); // playAnimation에 같은 내용
                }
            }
        }
        rafId = requestAnimationFrame(loop);
        
        if(Math.abs(yOffset - delayedYOffset) < 1){
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }
    
    // 모든 이벤트 리스너들은 로드 후에 사용할 수 있어야 한다.
    window.addEventListener('load', () => {  // 페이지 리프레쉬(F5) 시 현재 머물러 있는 씬을 확인/ body에 바로 적용
        setLayout();
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
        window.addEventListener('resize', () => {
            if(window.innerWidth > 900){ // 스마트폰 대응(랜드스케이프 기준)
                setLayout();
                sceneInfo[3].values.rectStartY = 0; // 윈도우 리사이즈 시 튕김현상이 있다(2번째 캔버스 이미지에서 3번째 캔버스 블렌드 이미지로 넘어가는 중). 이유: 값이 갱신되지 않았기 때문. 그리고 rectStartY는 다른 애니메이션 시작의 기점(기준)이 되기도 하기 때문에. 그렇기 때문에 리사이즈 시 rectX1, 2의 초기값을 넣어줌.
            }
        }); //윈도우 창의 높이가 줄어들면 그것에 맞게 section의 높이값도 변한다.
        window.addEventListener('scroll', () => { // 스크롤 이벤트가 복잡/다양하기 때문에 이렇게 쓰자.
            yOffset = window.pageYOffset; // 전체 문서에서 현재 스크롤 위치
            checkMenu();
            scrollLoop();
            blendingImgChange();
            scene4Stick();
        if(!rafState){
            rafId = requestAnimationFrame(loop);
            rafState = true;
        }
        function blendingImgChange(){
            const AA = sceneInfo[0].objs.container.scrollHeight + 
                sceneInfo[1].objs.container.scrollHeight + 
                sceneInfo[2].objs.container.scrollHeight + 
                sceneInfo[3].objs.container.scrollHeight +
                sceneInfo[4].objs.container.scrollHeight;
            const colorStick = document.querySelector('.stickyy');
            if(yOffset > AA){
                colorStick.classList.add('stickyyY');
            }else{
                colorStick.classList.remove('stickyyY');
            }
        }
        function scene4Stick(){
            const BB = sceneInfo[0].objs.container.scrollHeight + 
                sceneInfo[1].objs.container.scrollHeight + 
                sceneInfo[2].objs.container.scrollHeight + 
                sceneInfo[3].objs.container.scrollHeight;
            const imgStick = document.querySelector('.banner');
            
            if(yOffset > BB){
                imgStick.classList.add('stickyyY');
            }else{
                imgStick.classList.remove('stickyyY');
            }
        }
        })
        window.addEventListener('orientationchange', ()=>{ // orientationchange: 스마트폰을 포트레잇 -> 랜드스케이프 또는 반대로 바꿀때. 스마트폰에서 캔버스 이미지가 제대로 작동하지 않았다. 그래서 setTimeout으로 0.5초 뒤 작동할 수 있게함
            setTimeout(setLayout, 500);
        }); // orientationchange: 스마트폰을 포트레잇 -> 랜드스케이프 또는 반대로 바꿀때. 스마트폰에서 캔버스 이미지가 제대로 작동하지 않았다.
    });

    document.querySelector('.loading').addEventListener('transitionend', (e) => { // (transition end)매개변수=이벤트 객체, e.currentTarget은 위에 loading을 가르킨다. !!트렌지션이 끝나고 loading요소가 사라져서 메인 페이지가 비로소 보이고 클릭할 수 있다.
        // console.log(e.target)
        // console.log(e.currentTarget)
        console.log("트랜지션 끝")
        // document.querySelector('.loading').style.opacity = "1";
        // document.body.removeChild(e.currentTarget);
    });
    setCanvasImages();
})();


