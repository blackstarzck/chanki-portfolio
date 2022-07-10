    var Poster = $('.main>.poster');
    var Still = $('.main>.still');
    var pThumb = $('.main>.poster>.small>.wrapper>div');
    var sThumb = $('.main>.still>.small>.wrapper>div');
    var pWrap = $('.main>.poster>.small>.wrapper');
    var sWrap = $('.main>.still>.small>.wrapper');;
    var pBtn = $('.main>section>.switch>.poster');
    var sBtn = $('.main>section>.switch>.still');
    var pPrev = $('.main>.poster>.small>.prev');
    var pNext = $('.main>.poster>.small>.next');
    var pbPrev = $('.main>.poster>.big>.prev');
    var pbNext = $('.main>.poster>.big>.next');
    var sbPrev = $('.main>.still>.big>.prev');
    var sbNext = $('.main>.still>.big>.next');
    var sPrev = $('.main>.still>.small>.prev');
    var sNext = $('.main>.still>.small>.next');
    var pB = $('.main>.poster>.big>.container>.wrapper');
    var sB = $('.main>.still>.big>.container>.wrapper');
    var n = 0;
    let index;


$('nav>.menu>li:nth-child(5)>div').addClass('active').css({width: '130'}, 200);
$('nav>.audio').css({background: 'none', cursor: 'default'});


//if($('.main>.poster>.small>.wrapper>div:first').hasClass('active')){
//    pbNext.click(function(){
//        console.log('working???????');
//        n = (n+1)%20;
//        pThumb.removeClass('active');
//        pWrap.find('.b' + (n+1)).addClass('active');
//        ppSlide();
//    })
//    function ppSlide(){pB.stop().animate({marginLeft: -400 * n});}
//}


//    pbPrev.click(function(){ // ← 페이지 로딩후 b에서 버튼을 누를 경우
//        console.log('working?');
//        n = (n+19)%20;
//        pThumb.removeClass('active');
//        pWrap.find('.b' + (n+1)).addClass('active');
//        ppSlide();
//        
//    })
//    pbNext.click(function(){
//        
//        console.log('working?');
//        n = (n+1)%20;
//        pThumb.removeClass('active');
//        pWrap.find('.b' + (n+1)).addClass('active');
//        ppSlide();
//        function ppSlide(){pB.stop().animate({marginLeft: -400 * n});}
//    })
$('.main>.still>.image>.container>.wrapper>.photo>img').click(function(){ //← [스틸컷] 팝업 시 이미지
    imgSrc = $(this).attr('src');
    $('.main>.imgBox>.contents').css({width: '1200'});
    popImg();
})

$('.main>.poster>.image>.container>.wrapper>.photo>img').click(function(){ //← [포스터] 팝업 시 이미지
    imgSrc = $(this).attr('src');
    $('.main>.imgBox>.contents').css({width: '600'});
    popImg();
})
function popImg(){ //← 팝업 기능
    $('.main>.imgBox').css({display: 'flex'});
    $('.main>.imgBox>.contents>img').attr('src', imgSrc);
}

$('.main>.imgBox>.contents>.close').click(function(){close();}) //← 팝업 후 닫기 버튼
function close(){$('.main>.imgBox').css({display: 'none'});}


    for(let x = 0; x < pThumb.length; x++){ // ← [포스터] 썸네일 클릭 후 작동되는 기능들 모음
        pThumb[x].querySelector('img').addEventListener('click', function(){
            console.log('썸네일 인덱스 번호 : ' + x)
            index = x;
            
            pbPrev.css({display: 'block'}) // ← 페이지 로딩 후 제일 첫 페이지. (버튼들 나타남)
            pbNext.css({display: 'block'})
            
            pbSlide();
        })
    function prev() {
        if(index == 0){
            index = pThumb.length-1;
            pThumb.removeClass('active');
            pThumb.eq(index).addClass('active');
        }else{
            index--;
            pThumb.removeClass('active');
            pThumb.eq(index).addClass('active');
        }
        pbSlide();
    }

    function next() {
        if (index == pThumb.length-1) {
            index = 0;
            pThumb.removeClass('active');
            pThumb.eq(index).addClass('active');

        } else {
            index++;
            pThumb.removeClass('active');
            pThumb.eq(index).addClass('active');
        }
        pbSlide();
    }
    function pbSlide() {
        pThumb.removeClass('active');
        pThumb.eq(index).addClass('active');
        pB.stop().animate({marginLeft: -400 * index});
    }
    }

    pBtn.click(function (){active();})
    function active(){ // ← 페이지 바뀜 버튼
        $('.main>section>.switch>div').removeClass('active');
        $('.main>section>.switch>div:first').addClass('active');
        $('.main>section').removeClass('on');
        Poster.addClass('on');
    }
    
    
    sBtn.click(function (){ // ← 페이지 바뀜 버튼
        $('.main>section>.switch>div').removeClass('active');
        $('.main>section>.switch>div:last').addClass('active');
        $('.main>section').removeClass('on');
        Still.addClass('on');
    })
    

    for(let x = 0; x < sThumb.length; x++){ // ← 스틸컷 페이지
        sThumb[x].querySelector('img').addEventListener('click', function(){
            console.log('썸네일 인덱스 번호 : ' + x)
            index = x;
            
            sbPrev.css({display: 'block'}) // ← 페이지 로딩 후 제일 첫 페이지. (버튼들 나타남)
            sbNext.css({display: 'block'})
            
            sbSlide();
        })
    function prev1() {
        if(index == 0){
            index = sThumb.length-1;
            sThumb.removeClass('active');
            sThumb.eq(index).addClass('active');
        }else{
            index--;
            sThumb.removeClass('active');
            sThumb.eq(index).addClass('active');
        }
        sbSlide();
        console.log(index);
    }

    function next1() {
        if (index == sThumb.length-1) {
            index = 0;
            sThumb.removeClass('active');
            sThumb.eq(index).addClass('active');

        } else {
            index++;
            sThumb.removeClass('active');
            sThumb.eq(index).addClass('active');
        }
        sbSlide();
        console.log(index);
    }
    function sbSlide() {
        sThumb.removeClass('active');
        sThumb.eq(index).addClass('active');
        sB.stop().animate({marginLeft: -800 * index});
    }
    }
    
    
    sThumb.click(function(){ // ← 썸네일 부분 클릭 시 빅이미지 나옴
        var i = $(this).index();
        
        sThumb.removeClass('active');
        $(this).addClass('active');
        sB.stop().animate({marginLeft: -800 * i});
        
    })

    pPrev.click(function(){ // ← 썸네일 부분 왼/오 이동 버튼 기능
        n = (n+6)%7;
        pSlide();
    })
    pNext.click(function(){
        pPrev.addClass('on');
        n = (n+1)%7;
        pSlide();
    })
    sPrev.click(function(){
        n = (n+12)%13;
        sSlide();
    })
    sNext.click(function(){
        sPrev.addClass('on');
        n = (n+1)%13;
        sSlide();
    })
    
    function pSlide(){pWrap.stop().animate({left: -135 * n});}
    function sSlide(){sWrap.stop().animate({left: -350 * n});}
    
    function pbSlide(){pB.stop().animate({marginLeft: -400 * n});}
    function psSlide(){sB.stop().animate({marginLeft: -800 * n});}
    
