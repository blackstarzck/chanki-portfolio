$(function(){
    
    var Fbtn = $('.story>section>.artwrap>.art1>.seg1>.info'),
        Sbtn = $('.story>section>.artwrap>.art2>.seg1>.info'),
        art = $('.story>section>.artwrap>article'),
        art1 = $('.story>section>.artwrap>.art1'),
        art2 = $('.story>section>.artwrap>.art2');
        
    
    
    $('nav>.menu>li:nth-child(2)>div').addClass('active').css({width: '130'}, 200);
    $('nav>.audio').css({background: 'none', cursor: 'default'});
    
    Fbtn.click(function(){
        art.removeClass('active');
        art2.addClass('active');
    })
    Sbtn.click(function(){
        art.removeClass('active');
        art1.addClass('active').animate({});
    })
})