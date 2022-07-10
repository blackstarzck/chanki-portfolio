    $(function(){
    console.log('video');

    var $play = $('.audio'),
        $video = $('video'),
        n = 0;
    
    $play.click(function(){
        if(n==0){
            $play.addClass('active');
            $video.prop('muted', false);
            n = 1;
        }else{
            $play.removeClass('active');
            $video.prop('muted', true);
            n = 0;
        }
    })
})