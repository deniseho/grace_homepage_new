
(function ($) {
// ==================== News Modal ====================

var modal = document.getElementById('myModal');
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function () {
	modal.style.display = "block";
}
span.onclick = function () {
	modal.style.display = "none";
}
window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
}


// ==================== homepage video ====================
var vid = document.getElementById("bg-video");
var pauseButton = document.querySelector(".pause");

if (window.matchMedia('(prefers-reduced-motion)').matches) {
    vid.removeAttribute("autoplay");
    vid.pause();
    pauseButton.innerHTML = "<i class='fa fa-play fa-2x' aria-hidden='true'></i>";
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
    pauseButton.innerHTML = "<i class='fa fa-pause fa-2x' aria-hidden='true'></i>";
  } else {
    vid.pause();
    pauseButton.innerHTML = "<i class='fa fa-play fa-2x' aria-hidden='true'></i>";
  }
})


// ==================== nav dots ====================
$('nav').hide();
$(window).on("scroll", function() {
    var scrollPosition = pageYOffset;
    if (scrollPosition > $(window).height()) {
        $('nav').show();
    }else{
        $('nav').hide();
    }
});

//  bind scroll to anchor links
$(document).on("click", "a[href^='#']", function (e) {
	var id = $(this).attr("href");
	if ($(id).length > 0) {
		e.preventDefault();

		// trigger scroll
		controller.scrollTo(id);

			// if supported by the browser we can even update the URL.
		if (window.history && window.history.pushState) {
			history.pushState("", document.title, id);
		}
	}
});

// ==================== ScrollMagic ====================

	// Init ScrollMagic
    var controller = new ScrollMagic.Controller();

    // get all slides
	var slides = ["#slide01", "#slide02", "#slide03"];

	// get all headers in slides that trigger animation
	var headers = ["#slide01 header", "#slide02 header", "#slide03 header"];

	// get all break up sections
	var breakSections = ["#cb01", "#cb02", "#cb03"];

	// number of loaded images for preloader progress 
	var loadedCount = 0; //current number of images loaded
	var imagesToLoad = $('.bcg').length; //number of slides with .bcg container
	var loadingProgress = 0; //timeline progress - starts at 0

	$('.bcg').imagesLoaded({
	    background: true
	  }
	).progress( function( instance, image ) {
		loadProgress();
	});

	function loadProgress(imgLoad, image)
	{
	 	//one more image has been loaded
		loadedCount++;

		loadingProgress = (loadedCount/imagesToLoad);

		//console.log(loadingProgress);

		// GSAP timeline for our progress bar
		TweenLite.to(progressTl, 0.7, {progress:loadingProgress, ease:Linear.easeNone});

	}

	//progress animation instance. the instance's time is irrelevant, can be anything but 0 to void  immediate render
	var progressTl = new TimelineMax({paused:true,onUpdate:progressUpdate,onComplete:loadComplete});

	progressTl
		//tween the progress bar width
		.to($('.progress span'), 1, {width:100, ease:Linear.easeNone});

	//as the progress bar witdh updates and grows we put the precentage loaded in the screen
	function progressUpdate()
	{
		//the percentage loaded based on the tween's progress
		loadingProgress = Math.round(progressTl.progress() * 100);
		//we put the percentage in the screen
		$(".txt-perc").text(loadingProgress + '%');

	}

	function loadComplete() {

		// preloader out
		var preloaderOutTl = new TimelineMax();

		preloaderOutTl
			.to($('.progress'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn})
			.to($('.txt-perc'), 0.3, {y: 100, autoAlpha: 0, ease:Back.easeIn}, 0.1)
			.set($('body'), {className: '-=is-loading'})
			.set($('#intro'), {className: '+=is-loaded'})
			.to($('#preloader'), 0.7, {yPercent: 100, ease:Power4.easeInOut})
			.set($('#preloader'), {className: '+=is-hidden'})
			// .from($('#intro .title'), 1, {autoAlpha: 0, ease:Power1.easeOut}, '-=0.2')
			// .from($('#intro p'), 0.7, {autoAlpha: 0, ease:Power1.easeOut}, '+=0.2')
			// .from($('.scroll-hint'), 0.3, {y: -20, autoAlpha: 0, ease:Power1.easeOut}, '+=0.1');

		return preloaderOutTl;
	}

	// Enable ScrollMagic only for desktop, disable on touch and mobile devices
	if (!Modernizr.touch) {

		// SCENE 1
		// create scenes for each of the headers
		headers.forEach(function (header, index) {
		    
		    // number for highlighting scenes
			var num = index+1;

		    // make scene
		    var headerScene = new ScrollMagic.Scene({
		        triggerElement: header, // trigger CSS animation when header is in the middle of the viewport 
		        offset: -95 // offset triggers the animation 95 earlier then middle of the viewport, adjust to your liking
		    })
		    .setClassToggle('#slide0'+num, 'is-active') // set class to active slide
		    //.addIndicators() // add indicators (requires plugin), use for debugging
		    .addTo(controller);
		});

	    // SCENE 2
	    // change color of the nav for dark content blocks
	    breakSections.forEach(function (breakSection, index) {
		    
		    // number for highlighting scenes
			var breakID = $(breakSection).attr('id');
		    // make scene
		    var breakScene = new ScrollMagic.Scene({
		        triggerElement: breakSection, // trigger CSS animation when header is in the middle of the viewport 
		        triggerHook: 0.75
		    })
		    .setClassToggle('#'+breakID, 'is-active') // set class to active slide
		    .on("enter", function (event) {
			    $('nav').attr('class','is-light');
			})
		    .addTo(controller);
		});

	    // SCENE 3
	    // change color of the nav back to dark
		slides.forEach(function (slide, index) {
			var slideScene = new ScrollMagic.Scene({
		        triggerElement: slide // trigger CSS animation when header is in the middle of the viewport
		    })
		    .on("enter", function (event) {
			    $('nav').removeAttr('class');
			})
		    .addTo(controller);
	    });

	    // SCENE 4 - parallax effect on each of the slides with bcg
	    // move bcg container when slide gets into the view
		slides.forEach(function (slide, index) {

			var $bcg = $(slide).find('.bcg');

			var slideParallaxScene = new ScrollMagic.Scene({
		        triggerElement: slide, 
		        triggerHook: 1,
		        duration: "100%"
		    })
		    .setTween(TweenMax.from($bcg, 1, {y: '-40%', autoAlpha: 0.3, ease:Power0.easeNone}))
		    .addTo(controller);
	    });




/* ==================== 主打商品 ==================== */
	    var pinScene01Tl = new TimelineMax();

	    pinScene01Tl
	    	.to($('#slide01 h1'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
	    	.to($('#slide01 section'), 0.2, {autoAlpha: 0, ease:Power1.easeNone}, 1.5)
	    	.set($('#slide01 h1'), {text: '更多商品'})
	    	.set($('#slide01 p'), {text: 
                `<button>鏡框</button><button>太陽眼鏡</button><button>其他周邊</button>`
            })
	    	.to($('#slide01 .bcg'), 0.6, {scale: 1.2, transformOrigin: '0% 0%', ease:Power0.easeNone})            
	    	.fromTo($('#slide01 h1'), 0.7, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '+=0.4')
	    	.fromTo($('#slide01 section'), 0.6, {y: '+=20'}, {y: 0, autoAlpha: 1, ease:Power1.easeOut}, '-=0.6')
	    	.set($('#slide01 h1'), {autoAlpha: 1}, '+=2');

	    var pinScene01 = new ScrollMagic.Scene({
	        triggerElement: '#slide01', 
	        triggerHook: 0,
	        duration: "250%"
	    })
	    .setPin("#slide01")
	    .setTween(pinScene01Tl)
	    .addTo(controller)
	

/* ==================== 最新消息 ==================== */
	    var pinScene02 = new ScrollMagic.Scene({
	        triggerElement: '#slide02', 
	        triggerHook: 0,
	        duration: "250%"
	    })
	    .setPin("#slide02")
	    .setTween(new TimelineMax())
	    .addTo(controller);
	}

}(jQuery));