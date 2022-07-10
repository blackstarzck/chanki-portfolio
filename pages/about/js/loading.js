$(function(){
    console.log('hi');
    const $container = $("#progress"), //body가 될 수도 있음.
          $progressBar = $container.find('.progress-bar'),
          $progressText = $container.find('.progress-text'),
          imgLoad = imagesLoaded('body'),
          imgTotal = imgLoad.images.length;
    console.log(imgTotal);
})