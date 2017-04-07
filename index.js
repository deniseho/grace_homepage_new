// ------------------------ SCROLL animations ------------------------

// ========== homepage video ==========
var vid = document.getElementById("bg-video");
var pauseButton = document.querySelector(".pause");

if (window.matchMedia('(prefers-reduced-motion)').matches) {
    vid.removeAttribute("autoplay");
    vid.pause();
    pauseButton.innerHTML = "繼續播放";
}

function vidFade() {
  vid.classList.add("stopfade");
}

vid.addEventListener('ended', function()
{
// only functional if "loop" is removed 
vid.pause();
// to capture IE10
vidFade();
}); 

pauseButton.addEventListener("click", function() {
  vid.classList.toggle("stopfade");
  if (vid.paused) {
    vid.play();
    pauseButton.innerHTML = "暫停播放";
  } else {
    vid.pause();
    pauseButton.innerHTML = "繼續播放";
  }
})

// init
var ctrl = new ScrollMagic.Controller({
    globalSceneOptions: {
        triggerHook: 'onLeave'
    }
});

var wh = window.innerHeight;

// homepage
new ScrollMagic.Scene({
    duration: '100%'
})
.addTo(ctrl)
.addIndicators({
    name: 'homepage'
});

// homepage menu
var homepageMenu = new TimelineMax();
homepageMenu                
  .fromTo($('.homepage-menu ul'), 1, { opacity: 1, yPercent: 0, ease: Power4.easeInOut }, 
  { opacity: 0, yPercent: 60, ease: Power4.easeInOut}, '0')

new ScrollMagic.Scene({
    triggerElement: $('.video'),
    duration: '50%'
})
.setTween(homepageMenu)
.addTo(ctrl)
.addIndicators({
    name: 'homepage menu' 
})


// homepage text
var homepageText = new TimelineMax();
homepageText                
  .fromTo($('.homepage-text h1'), 1, { opacity: 1, yPercent: 0, ease: Power4.easeInOut }, 
  { opacity: 0, yPercent: -30, ease: Power4.easeInOut}, '0')
  .fromTo($('.homepage-text div'), 1, { yPercent: 0, ease: Power4.easeInOut }, 
  { opacity: 0, yPercent: -50, ease: Power4.easeInOut}, '0.2')

new ScrollMagic.Scene({
    triggerElement: $('.video'),
    duration: '100%'
})
.setTween(homepageText)
.addTo(ctrl)
.addIndicators({
    name: 'homepage text' 
})


// ========== content pages ==========
$("article.content").each(function (index) {
    new ScrollMagic.Scene({
        triggerElement: this,
        duration: '100%'
    })
    .setPin(this, {pushFollowers: true})
    .addTo(ctrl)
    .addIndicators({
        name: 'content - ' + index
    });
});



var sections = ['.focus','.news', '.about', '.info', '.history', 'stores'];
sections.forEach(function(section, index){
    var contentTitle = new TimelineMax();
    contentTitle
        .fromTo($(section + ' .content-title'), 5, 
                { opacity: 0, yPercent: 50, xPercent: -150, scale: 0.7, ease: Power4.easeInOut }, 
                { opacity: 1, yPercent: 0, xPercent: 0, scale: 1 , ease: Power4.easeInOut }, '0')
                
        .from($(section + ' .content-title h1'), 5, 
                { opacity: 0 ,yPercent: 20, scale: 1, ease: Power4.easeInOut }, '0')

        .from($(section + ' .content-title .eng-title'), 10, 
                { opacity: 0, yPercent: -50, ease: Power4.easeInOut }, '0')
    
    new ScrollMagic.Scene({
        offset: -wh*0.6,
        triggerElement: $('.content')[index],
        duration: '100%'
    })
    .setTween(contentTitle)
    .addTo(ctrl)
    .addIndicators({
        name: '.contentTitle-' + index
    })

    var contentElements = new TimelineMax();
    contentElements
    .fromTo($(section + ' .content-block > *'), 1, 
            { opacity: 0, yPercent: 10, ease: Power4.easeInOut },
            { opacity: 1, yPercent: 0, ease: Power4.easeInOut }, '0')

    new ScrollMagic.Scene({
        triggerElement: $('.content')[index],
        duration: '30%'
    })
    .setTween(contentElements)
    .addTo(ctrl)
    .addIndicators({
        name: '.contentElements-' + index
    })
})
