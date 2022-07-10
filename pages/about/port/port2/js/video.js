$(function(){
    var thmbWrap = $('.video>.thmb>.wrapper'),
        thmb = $('.video>.thmb>.wrapper>.movie'),
        Lbtn = $('.video>.thmb>.Lbtn'),
        Rbtn = $('.video>.thmb>.Rbtn'),
        i = 0;
    
    $('nav>.menu>li:nth-child(4)>div').addClass('active').css({width: '130'}, 200);
    $('nav>.audio').css({background: 'none', cursor: 'default'});
    
    
    $('.video>.thmb>.wrapper>.m1>.imgB>.icn').addClass('active');
    $('.video>.thmb>.wrapper>.m1>p').addClass('on');
    
    thmb.click(function(){
        var idx = $(this).index();
        console.log(idx);
        
        thmb.find('.icn').removeClass('active');
        $(this).find('.icn').addClass('active');
        thmb.find('p').removeClass('on');
        $(this).find('p').addClass('on');
        
        $('.video>.main>.container>.wrapper>.movie').removeClass('active');
        $('.video>.main>.container>.wrapper>.movie').eq(idx).addClass('active');
    })
    
    Lbtn.click(function(){
        thmbWrap.animate({marginLeft: '0'});
    })
    Rbtn.click(function(){
        thmbWrap.animate({marginLeft: '-360'});
    })
    
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    function onPlayerReady(event) {
    	event.target.mute();
        event.target.playVideo();
    }
    function onPlayerStateChange(event) {
    	if (event.data == '0')
			{				
				event.target.seekTo(0);
				event.target.stopVideo();
			}
    }
    
	var movieThumbCnt = $('.video>.thmb>.wrapper>.movie').length;
	$('.video>.thmb>.wrapper>.movie').each(function(index) {
		$(this).on('click', function() {
            console.log('hi');
            
			divNumber = $(this).attr('number');
            console.log($(this).attr('number'));

			for (i = 1; i <= movieThumbCnt; i++)
			{
				if (i == divNumber)
				{
					$('#vio'+ i)[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
				} else {
					$('#vio'+ i)[0].contentWindow.postMessage('{"event":"command","func":"' + 'stopVideo' + '","args":""}', '*');
				}
			}
		});
	});
})

