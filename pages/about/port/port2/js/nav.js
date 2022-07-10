$(function(){
    console.log('nav');

    var $bar = $('nav>.bar'),
        $nav = $('nav'),
        $menu = $('nav>.menu>li'),
        $und = $('nav>.menu>li>div');
    

    
    $bar.click(function(){
        $nav.toggleClass('active');
        $bar.toggleClass('toggle');
    });
    
    $menu.click(function(){
        $menu.find('div').removeClass('active');
        $(this).find('div').addClass('active').stop().animate({width: '130'}, 200);
    })
})