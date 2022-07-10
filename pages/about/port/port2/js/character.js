var thmb = $('.character>section>.container>.art1>ul>li');
var prevBtn = $('.character>section>.container>.art2>.btn>.lt');
var nextBtn = $('.character>section>.container>.art2>.btn>.rt');
var mimg = $('.character>section>.container>.art2>.mb_wrap>li');
var btnWrap = $('.character>section>.container>.art2>.btn');
var popUp = $('.character>.img_box');
var seg1 = $('.character>.img_box>.content>.items>.n1>.img');
var seg2 = $('.character>.img_box>.content>.items>.n2>.img');
var seg3 = $('.character>.img_box>.content>.items>.n3>.img');
var segWrap = $('.character>.img_box>.content>.items>.seg');
var item1 = $('.character>.img_box>.content>.items>.n1');
var item2 = $('.character>.img_box>.content>.items>.n2');
var item3 = $('.character>.img_box>.content>.items>.n3');
var closeBtn = $('.character>.img_box>.content>.close');
var trailer = $('.character>.img_box>.content>.trailer>video');
var iframe = $('.character>.img_box>.content>.trailer>iframe');
var video = document.getElementsByTagName('video')[0];
let index;
var flag = 0;


$('nav>.menu>li:nth-child(3)>div').addClass('active').css({width: '130'}, 200);
$('nav>.audio').css({background: 'none', cursor: 'default'});



btnWrap.css({display: 'none'}); //첫 페이지에서 버튼 사라짐.
thmb.find('.hv').addClass('active');
thmb.first().find('.hv').removeClass('active');



//첫페이지 클릭 시 첫 썸네일만 적용됨.//
closeBtn.click(function () {
    close();
    function close(){
        popUp.css({display: 'none'});
        segWrap.removeClass('active');
        video.currentTime=0;
        video.pause();
    }
})





for (let i = 0; i < thmb.length; i++) {
    thmb[i].querySelector('.pic').addEventListener('click', function () {
        btnWrap.css({
            display: 'flex'
        });
        console.log('썸네일 인덱스 번호:' + i);
        index = i

        appeal();
        hv();
        color();
        style();
    })


    function appeal() {
        mimg.css({
            display: 'none'
        });
        mimg.eq(index).css({
            display: 'block'
        });
    }

    function prev() {
        console.log('prev');
        console.log('썸네일 인덱스 번호:' + index);
        if (index == 0) {
            index = thmb.length - 1;
            thmb.find('.hv').addClass('active');
            thmb.eq(index).find('.hv').removeClass('active');
        } else {
            index--;
            thmb.find('.hv').addClass('active');
            thmb.eq(index).find('.hv').removeClass('active');
        }
        appeal();
        color()
    }

    function next() {
        console.log('next');
        console.log('썸네일 인덱스 번호:' + index);
        if (index == thmb.length - 1) {
            index = 0;
            thmb.find('.hv').addClass('active');
            thmb.eq(index).find('.hv').removeClass('active');

        } else {
            index++
            thmb.find('.hv').addClass('active');
            thmb.eq(index).find('.hv').removeClass('active');
        }
        appeal();
        color()
    }

    function hv() {
        thmb.find('.hv').addClass('active');
        thmb.eq(index).find('.hv').removeClass('active');
    }
    function style() {
    $('.character>.img_box>.content>.items>.seg>.img').css({
        backgroundSize: 'contain',
        'background-repeat': 'no-repeat',
        'background-position': 'center'
    });
}

    function color() {
        switch (index) {
            case 0:
                prevBtn.css({color: '#6600ff'});
                nextBtn.css({color: '#6600ff'});
                break;
            case 1:
                prevBtn.css({color: '#336666'});
                nextBtn.css({color: '#336666'});
                break;
            case 2:
                prevBtn.css({color: '#3366ff'});
                nextBtn.css({color: '#3366ff'});
                break;
            case 3:
                prevBtn.css({color: '#009966'});
                nextBtn.css({color: '#009966'});
                break;
            case 4:
                prevBtn.css({color: '#cc0000'});
                nextBtn.css({color: '#cc0000'});
                break;
            case 5:
                prevBtn.css({color: '#cc3399'});
                nextBtn.css({color: '#cc3399'});
                break;
            case 6:
                prevBtn.css({color: '#cc99ff'});
                nextBtn.css({color: '#cc99ff'});
                break;
            case 7:
                prevBtn.css({color: '#ff0066'});
                nextBtn.css({color: '#ff0066'});
                break;
            case 8:
                prevBtn.css({color: '#ffcc33'});
                nextBtn.css({color: '#ffcc33'});
                break;
            case 9:
                prevBtn.css({color: '#ff6633'});
                nextBtn.css({color: '#ff6633'});
                break;
            case 10:
                prevBtn.css({color: '#333333'});
                nextBtn.css({color: '#333333'});
                break;
            case 11:
                prevBtn.css({color: '#ffcccc'});
                nextBtn.css({color: '#ffcccc'});
                break;
            case 12:
                prevBtn.css({color: '#33cccc'});
                nextBtn.css({color: '#33cccc'});
                break;
        }
    }
}

function pop(){popUp.css({display: 'flex'});}

closeBtn.click(function () {
    close();
    function close(){
        popUp.css({display: 'none'});
        segWrap.removeClass('active');
        $('.character>.img_box>li').removeClass('active');
    }
})

$('.character>section>.container>.art2>.mb_wrap>.mb1>.pg>.ib>.txt').on({click: function(){Vfirst();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb2>.pg>.ib>.txt').on({click: function(){sec();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb3>.pg>.ib>.txt').on({click: function(){three();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb4>.pg>.ib>.txt').on({click: function(){four();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb5>.pg>.ib>.txt').on({click: function(){five();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb6>.pg>.ib>.txt').on({click: function(){six();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb7>.pg>.ib>.txt').on({click: function(){seven();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb8>.pg>.ib>.txt').on({click: function(){eight();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb9>.pg>.ib>.txt').on({click: function(){nine();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb10>.pg>.ib>.txt').on({click: function(){ten();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb11>.pg>.ib>.txt').on({click: function(){eleven();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb12>.pg>.ib>.txt').on({click: function(){twelve();pop();}});
$('.character>section>.container>.art2>.mb_wrap>.mb13>.pg>.ib>.txt').on({click: function(){thirteen();pop();}});






    function Vfirst(){
        console.log('work');
        $('.character>.img_box>.pop1').addClass('active');
        item1.addClass('active'); // seg첫 아이탬에 css효과
        trailer.attr({src: 'video/IronMan.mp4'});
        video.muted=false;
        video.currentTime=0;
        video.play();
        $('.character>.img_box>.pop1>.items>.n1>.img').css({"background-image" : "url(img/poster/ironman.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                item1.addClass('active');
                trailer.attr({src: 'video/IronMan.mp4'});
                video.currentTime=0;
                video.play();
            }
        });
        $('.character>.img_box>.pop1>.items>.n2>.img').css({"background-image" : "url(img/poster/Avengers.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                trailer.attr({src: 'video/Avengers1.mp4'});
                video.currentTime=0;
                video.play();
            }
        });
        $('.character>.img_box>.pop1>.items>.n3>.img').css({"background-image" : "url(img/poster/SherlockHolmes.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                trailer.attr({src: 'video/SherlockHolmes.mp4'});
                video.currentTime=0;
                video.play();
            }
        });
    }
    function sec(){
        console.log('work');
        $('.character>.img_box>.pop2').addClass('active');
        item1.addClass('active');
        iframe.attr({src: 'https://www.youtube.com/embed/XTZko22Ze3o?autoplay=1&mute=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        
        
        $('.character>.img_box>.pop2>.items>.n1>.img').css({"background-image" : "url(img/posters/Rami/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/XTZko22Ze3o?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop2>.items>.n2>.img').css({"background-image" : "url(img/posters/Rami/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/xqj7XOv9mC8?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop2>.items>.n3>.img').css({"background-image" : "url(img/posters/Rami/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/frKDkRYsVLA?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop2>.close').click(function(){
            $('#vio2')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
    }
    function three(){
        item1.addClass('active');
        $('.character>.img_box>.pop3').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/AQyTULQhhF4?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        
        
        $('.character>.img_box>.pop3>.items>.n1>.img').css({"background-image" : "url(img/posters/Mario/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/AQyTULQhhF4?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop3>.items>.n2>.img').css({"background-image" : "url(img/posters/Mario/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/CUJU3_n8al0?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop3>.items>.n3>.img').css({"background-image" : "url(img/posters/Mario/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/gXU0eB47YlY?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop3>.close').click(function(){
            $('#vio3')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
            iframe.attr({src: 'none'})
        });
    }
    function four(){
        item1.addClass('active');
        $('.character>.img_box>.pop4').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/aNtqlkVJRzw?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop4>.items>.n1>.img').css({"background-image" : "url(img/posters/Emma/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/aNtqlkVJRzw?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop4>.items>.n2>.img').css({"background-image" : "url(img/posters/Emma/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/YMc6oiIWqIg?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop4>.items>.n3>.img').css({"background-image" : "url(img/posters/Emma/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/q88puxM5PmI?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop4>.close').click(function(){
            $('#vio4')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
            iframe.attr({src: 'none'})
        });
    }
    function five(){
        item1.addClass('active');
        $('.character>.img_box>.pop5').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/WflP7wDOIms?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop5>.items>.n1>.img').css({"background-image" : "url(img/posters/John/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/WflP7wDOIms?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop5>.items>.n2>.img').css({"background-image" : "url(img/posters/John/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/9MNHV5A7YLA?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop5>.items>.n3>.img').css({"background-image" : "url(img/posters/John/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/2NvznP_gp_A?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop5>.close').click(function(){
            $('#vio5')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
            iframe.attr({src: 'none'})
        });
    }
    function six(){
        item1.addClass('active');
        $('.character>.img_box>.pop6').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/XB8HgiB5Ehk?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop6>.items>.n1>.img').css({"background-image" : "url(img/posters/Octavia/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/XB8HgiB5Ehk?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop6>.items>.n2>.img').css({"background-image" : "url(img/posters/Octavia/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/m43lgdvyqZg?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop6>.items>.n3>.img').css({"background-image" : "url(img/posters/Octavia/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/ItSUOpH4A5w?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop6>.close').click(function(){
            $('#vio6')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
    }
    function seven(){
        item1.addClass('active');
        $('.character>.img_box>.pop7').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/2d_omPcDcg0?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop7>.items>.n1>.img').css({"background-image" : "url(img/posters/Selena/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/2d_omPcDcg0?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop7>.items>.n2>.img').css({"background-image" : "url(img/posters/Selena/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/dbLFgWpYWVk?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop7>.items>.n3>.img').css({"background-image" : "url(img/posters/Selena/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/qVJ6o0hNFeU?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop7>.close').click(function(){
            $('#vio7')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
    }
    function eight(){
        item1.addClass('active');
        $('.character>.img_box>.pop8').addClass('active'); // ← 바꿔야함
        iframe.attr({src: ''}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop8>.items>.n1>.img').css({"background-image" : "url(img/posters/Kumali/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: ''});
            }
        });
        $('.character>.img_box>.pop8>.items>.n2>.img').css({"background-image" : "url(img/posters/Kumali/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/q88puxM5PmI?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop8>.items>.n3>.img').css({"background-image" : "url(img/posters/Kumali/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/O_oSOYxm964'});
            }
        });
        $('.character>.img_box>.pop8>.close').click(function(){
            $('#vio8')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
    }
    function nine(){
        item1.addClass('active');
         $('.character>.img_box>.pop9').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/OihMMEHPUG0?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop9>.items>.n1>.img').css({"background-image" : "url(img/posters/Tohm/lostworldZ.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/OihMMEHPUG0?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop9>.items>.n2>.img').css({"background-image" : "url(img/posters/Tohm/spiderman.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/cWr9a7RfG6c?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop9>.items>.n3>.img').css({"background-image" : "url(img/posters/Tohm/TheImpossible.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/cn8mLZOq6ZQ?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop9>.close').click(function(){
            $('#vio9')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
    }
    function ten(){
        item1.addClass('active');
        $('.character>.img_box>.pop10').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/NQWEaO-R1PI?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop10>.items>.n1>.img').css({"background-image" : "url(img/posters/Craig/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/NQWEaO-R1PI?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop10>.items>.n2>.img').css({"background-image" : "url(img/posters/Craig/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/7SFubap8oiU?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop10>.items>.n3>.img').css({"background-image" : "url(img/posters/Craig/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/pjgV2hkAaVE?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop10>.close').click(function(){
            $('#vio10')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
    }
    function eleven(){
        item1.addClass('active');
        $('.character>.img_box>.pop11').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/Rk4RGpqmk0s?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop11>.items>.n1>.img').css({"background-image" : "url(img/posters/Antonio/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/Rk4RGpqmk0s?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop11>.items>.n2>.img').css({"background-image" : "url(img/posters/Antonio/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/CwXOrWvPBPk?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop11>.items>.n3>.img').css({"background-image" : "url(img/posters/Antonio/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/XIyj6rvLBxo?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop11>.close').click(function(){
            $('#vio11')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
    }
    function twelve(){
        item1.addClass('active');
        $('.character>.img_box>.pop12').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/ujmoYyEyDP8?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop12>.items>.n1>.img').css({"background-image" : "url(img/posters/Ralph/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/ujmoYyEyDP8?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop12>.items>.n2>.img').css({"background-image" : "url(img/posters/Ralph/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/1Fg5iWmQjwk?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop12>.items>.n3>.img').css({"background-image" : "url(img/posters/Ralph/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/BRnl6Xj9wc0?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop12>.close').click(function(){
            $('#vio12')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
    }
    function thirteen(){
        item1.addClass('active');
        $('.character>.img_box>.pop12').addClass('active'); // ← 바꿔야함
        iframe.attr({src: 'https://www.youtube.com/embed/7BWWWQzTpNU?autoplay=1&mute=1&=1&enablejsapi=1'}); //자세히 보기 클릭 후 바로 재생
        $('.character>.img_box>.pop13>.items>.n1>.img').css({"background-image" : "url(img/posters/Michael/movie_image1.jpg"}).click(function () {
            console.log('썸네일1');
            if (flag != 0) {
                flag = 0;
                segWrap.removeClass('active');
                segWrap.removeClass('active');
                item1.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/7BWWWQzTpNU?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop13>.items>.n2>.img').css({"background-image" : "url(img/posters/Michael/movie_image2.jpg"}).click(function () {
            console.log('썸네일2');
            if (flag != 1) {
                flag = 1;
                segWrap.removeClass('active');
                item2.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/PQNLfo-SOR4?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop13>.items>.n3>.img').css({"background-image" : "url(img/posters/Michael/movie_image3.jpg"}).click(function () {
            console.log('썸네일3');
            if (flag != 2) {
                flag = 2;
                segWrap.removeClass('active');
                item3.addClass('active');
                iframe.attr({src: 'https://www.youtube.com/embed/ZFnIZeg3MT4?autoplay=1&mute=1&=1&enablejsapi=1'});
            }
        });
        $('.character>.img_box>.pop13>.close').click(function(){
            $('#vio13')[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
        });
    }

