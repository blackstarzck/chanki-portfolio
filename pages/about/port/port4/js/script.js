// 로딩
window.addEventListener('load', function(){
    document.querySelector('.preloader').classList.add('opacity-0');
    setTimeout(function(){
        document.querySelector('.preloader').style.display='none';
    }, 1000);
})

// 포트폴리오 아이템 필터
const filterContainer = document.querySelector('.portfolio-filter');
const filterBtns = filterContainer.children;
const totalFilterBtn = filterBtns.length;
const portfolioItems = document.querySelectorAll('.portfolio-item');
const totalPortfolioItem = portfolioItems.length;


for(let i = 0; i < totalFilterBtn; i++ ){ // 필터 클릭 시 색이 변함.
    filterBtns[i].addEventListener('click', function(){
        filterContainer.querySelector('.active').classList.remove('active');
        this.classList.add('active');
        
        const filterValue = this.getAttribute('data-filter');
        
        for(let k = 0; k < totalPortfolioItem; k++){
            if(filterValue === portfolioItems[k].getAttribute('data-category')){
                portfolioItems[k].classList.remove('hide');
                portfolioItems[k].classList.add('show');
            }else{
                portfolioItems[k].classList.remove('show');
                portfolioItems[k].classList.add('hide');
            }
            if(filterValue == 'all'){
                portfolioItems[k].classList.remove('hide');
                portfolioItems[k].classList.add('show');
            }
            console.log(portfolioItems[k]);
        }
    })
}

// 포트폴리오 lightbox
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-image');
const lightboxClose = lightbox.querySelector('.lightbox-close');
const lightboxText = lightbox.querySelector('.caption-text');
const lightboxCounter = lightbox.querySelector('.caption-counter');
let itemIndex = 0;

for(let i = 0; i < totalPortfolioItem; i++){
    portfolioItems[i].addEventListener('click', function(){
        itemIndex = i;
        changeItem();
        toggleLightbox();
    })
}
// 포트폴리오 funciton 모음 //
function changeItem(){
    imgSrc = portfolioItems[itemIndex].querySelector('.portfolio-img>img').getAttribute('src');
    // 여기서(portfolioItems[i]) i를 넣게 되면 작동하지 않는다. itemIndex를 넣어야함.
    lightboxImg.src = imgSrc;
    console.log(imgSrc);
    lightboxText.innerHTML = portfolioItems[itemIndex].querySelector('h4').innerHTML;
    lightboxCounter.innerHTML = (itemIndex+1) + ' of ' + totalPortfolioItem;
}
function toggleLightbox(){
    lightbox.classList.toggle('open');
}
function nextItem(){
    if(itemIndex == totalPortfolioItem-1){
        itemIndex = 0;
    }else{
        itemIndex++;
    }
    console.log(itemIndex);
    changeItem();
}
function prevItem(){
    if(itemIndex == 0){
        itemIndex = totalPortfolioItem-1;
    }else{
        itemIndex--;
    }
    console.log(itemIndex);
    changeItem();
}


// lightbox 닫기
lightbox.addEventListener('click', function(event){
    console.log(event.target);
    if(event.target === lightboxClose || event.target === lightbox){
        toggleLightbox();
    }
})

// 사이드 네비바
const nav = document.querySelector('.nav'),
      navList = nav.querySelectorAll('li'),
      totalNavList = navList.length,
      allSection = document.querySelectorAll('.section'),
      totalSection = allSection.length;

for(let i = 0; i < totalNavList; i++){
    const a = navList[i].querySelector('a');
    a.addEventListener('click', function(){
        // remove back section class
        removeBackSectionClass();
        
        for(let j = 0; j < totalNavList; j++){
            if(navList[j].querySelector('a').classList.contains('active')){
                // add back section
                addBackSectionClass(j);
            }
            navList[j].querySelector('a').classList.remove('active');
        }
        this.classList.add('active');
        showSection(this);
        if(window.innerWidth < 1200){
            asideSectionTogglerBtn();
        }
    })
}

document.querySelector('.hire-me').addEventListener('click', function(){
    const sectionIndex = this.getAttribute("data-section-index");
//    console.log(sectionIndex);
    showSection(this);
    updateNav(this);
    removeBackSectionClass();
    addBackSectionClass(sectionIndex);
})

// 사이드 네비바 function 모음 //
function showSection(element){
//    const href = element.getAttribute('href').split('#'),
//          target = href[1];
// id="#idName" split('#') 메소드 사용 시 선택요소에서 #부분만 나뉘어 지게 되고, href[0]은 #을 나타냄. href[1]은 지정된 요소의 # 다음을 지정하는 것이다. 
    const target = element.getAttribute('href').split('#')[1];
    
    for(let i = 0; i < totalSection; i++){
        allSection[i].classList.remove('active');
    }
    document.querySelector('#' + target).classList.add('active');
}

function removeBackSectionClass(){
    for(let i = 0; i < totalSection; i++){
        allSection[i].classList.remove('back-section');
    }
}
function addBackSectionClass(num){
    allSection[num].classList.add('back-section');
}

function updateNav(element){
//    about섹션에서 hire me를 클릭했을때 contact섹션으로 이동, 네비 리스트 중 contact 또한 활성화가 된다. 
    for(let i = 0; i < totalNavList; i++){
        navList[i].querySelector('a').classList.remove('active');
        const target = element.getAttribute('href').split('#')[1];
        
        if(target === navList[i].querySelector('a').getAttribute('href').split('#')[1]){
            navList[i].querySelector('a').classList.add('active');
        }
    }
}

const navTogglerBtn = document.querySelector('.nav-toggler'),
      aside = document.querySelector('.aside');

navTogglerBtn.addEventListener('click', asideSectionTogglerBtn);

function asideSectionTogglerBtn(){
    aside.classList.toggle('open');
    navTogglerBtn.classList.toggle('open');
    for(let i = 0; i < totalSection; i++){
        allSection[i].classList.toggle('open');
    }
}

//추천 슬라이드
const sliderContainer = document.querySelector('.testi-slider');
const slides = sliderContainer.children;
const containerWidth = sliderContainer.offsetWidth;
const margin = 15;
console.log(containerWidth); //1140
let itemPerSlide = 0;
let slideDots;

// 추천 반응형 
const responsive = [
    {breakPoint: {width: 0, item: 1}}, // if window width > 0 then 1 item show in slide
    {breakPoint: {width: 991, item: 2}} // if window width > 991 then 2 item show in slide
]
function load(){
    for(let i = 0; i < responsive.length; i++){
        if(window.innerWidth > responsive[i].breakPoint.width){
            itemPerSlide = responsive[i].breakPoint.item;
        }
    }
    console.log('item: ' + itemPerSlide);
    start();
}

// 추천 function 모음 //
function start(){
    totalWidth = 0;
    //set width of containerWidth and slides
    for(let i = 0; i < slides.length; i++){
        console.log(slides[i]);
        slides[i].style.width = (containerWidth/itemPerSlide) - margin + 'px';
        slides[i].style.margin = margin/2 + 'px';
        totalWidth+=containerWidth/itemPerSlide;
    }
    sliderContainer.style.width = totalWidth + 'px';
    
    slideDots = Math.ceil(slides.length/itemPerSlide);
    for(let i = 0; i < slideDots; i++){
        const div = document.createElement('div');
        div.id = i;
        div.setAttribute('onclick', 'controlSlide(this)');
        if(i == 0){
            div.classList.add('active');
        }
        document.querySelector('.slide-controls').appendChild(div);
    }
}

let currentSlide = 0;
let    autoSlide = 0;

function controlSlide(element){
//    console.log(element.id);
    clearInterval(timer)
    timer=setInterval(autoPlay, 5000);
    
    autoSlide=element.id 
    currentSlide = element.id;
    
    changeSlide(currentSlide);
    
}
function changeSlide(currentSlide){
    controlButtons = document.querySelector('.slide-controls').children;
    
    for(let i = 0; i < controlButtons.length; i++){
        controlButtons[i].classList.remove('active');
    }
    controlButtons[currentSlide].classList.add('active');
    sliderContainer.style.marginLeft=-(containerWidth*currentSlide) + 'px';
}

function autoPlay(){
    if(autoSlide == slideDots-1){
        autoSlide = 0;
    }else{
        autoSlide++;
    }
    changeSlide(autoSlide);
}
let timer=setInterval(autoPlay, 5000);

window.onload = load();






























