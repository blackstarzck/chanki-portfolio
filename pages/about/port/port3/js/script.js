const filterButtons = document.querySelector('#filter-btns').children;
const items = document.querySelector('.portfolio-gallery').children;


for(let i = 0; i < filterButtons.length; i++)
filterButtons[i].addEventListener('click', function(){
    for(let j = 0; j < filterButtons.length; j++){
        filterButtons[j].classList.remove('active');
    }
    this.classList.add('active');
    const target = this.getAttribute('data-target');
    
    for(let k = 0; k < items.length; k++){
        items[k].style.display='none';
        if(target == items[k].getAttribute('data-id')){
            items[k].style.display='block';
        }
        if(target == 'all'){
            items[k].style.display='block';
        }
    }
})

//lightbox

const closeLightbox = document.querySelector('.close-lightbox');
const lightbox =  document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');

const gallery = document.querySelector('.portfolio-gallery');
const galleryItem = gallery.querySelectorAll('.item');

galleryItem.forEach(function(element){
    element.querySelector('.fa-plus').addEventListener('click', function(){
        lightbox.classList.remove('hide');
        lightbox.classList.add('show');
        lightboxImage.src = element.querySelector('img').getAttribute('src');
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

//testimonial slider

const sliderContainer = document.querySelector('.testi-slider');
const slides = sliderContainer.children;
const containerWidth = sliderContainer.offsetWidth;
const margin = 15;
console.log(containerWidth); //1140
let itemPerSlide = 0;
let slideDots;

// responsive 

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
    console.log(currentSlide);
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


// header fixed

window.onscroll = function(){
//    console.log(document.documentElement.scrollTop);
    const docScrollTop = document.documentElement.scrollTop;
    
    if(window.innerWidth > 991){
        if(docScrollTop > 100){
            document.querySelector('header').classList.add('fixed');
        }else{
            document.querySelector('header').classList.remove('fixed');
        }
    }
}

// navbar links

const navbar = document.querySelector('.navbar');
a = navbar.querySelectorAll('a');
console.log(a);

a.forEach(function(element){
    element.addEventListener('click', function(){
    console.log(this.getAttribute('href'));
        for(let i = 0; i  < a.length; i++){
            a[i].classList.remove('active');
        }
        this.classList.add('active');
        document.querySelector('.navbar').classList.toggle('show'); // 링크 클릭 후 닫힘.
    })
})

// ham-burger

const hamBurger = document.querySelector('.ham-burger');

hamBurger.addEventListener('click', function(){
    document.querySelector('.navbar').classList.toggle('show');
})