$(function(){
    var slides = $('.slider').children();
    var indicatorImages = $('.slider-indicator').children();
    
//    console.log(slides);
//    console.log(indicatorImages);
    
    for(i=0; i<indicatorImages.length; i++){
//        console.log(indicatorImages.eq(i))
        indicatorImages.eq(i).click(function(idx){
            for(j=0; j<indicatorImages.length; j++){
                indicatorImages.eq(j).removeClass('active')
            }
            $(this).addClass('active');
            
//            var id = this.getAttribute('data-id');
            var id = $(this).index();
//            console.log(id);
            for(j=0; j<indicatorImages.length; j++){
                slides.eq(j).removeClass('active')
            }
            slides.eq(id).addClass('active');
        })
    }
})