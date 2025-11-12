{
	// From https://davidwalsh.name/javascript-debounce-function.
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};

	let winsize = {width: window.innerWidth, height: window.innerHeight};

	const DOM = {
		intro: document.querySelector('.intro'),
		slideshowImagesWrappers: document.querySelectorAll('.slideshow__item-img'),
		slideshowImages: document.querySelectorAll('.slideshow__item-img-inner')
	};
	
	class Panel {
		constructor(el) {
			this.DOM = {el: el};

			this.DOM.logo = DOM.intro.querySelector('.intro__logo');
			this.DOM.logoImg = this.DOM.logo.querySelector('.icon--arrowup');
			this.DOM.enter = DOM.intro.querySelector('.intro__enter');
			
			this.animatableElems = Array.from(DOM.intro.querySelectorAll('.animatable')).sort(() => 0.5 - Math.random());
			
			// set layout
			this.boxRect = this.DOM.el.getBoundingClientRect();
			this.layout();

			this.isOpen = true;
			this.initEvents();
		}
		layout() {
			this.DOM.el.style.transform = `scaleX(${winsize.width/this.boxRect.width}) scaleY(${winsize.height/this.boxRect.height})`;
			document.body.classList.remove('loading');
		}
		initEvents() {
			this.DOM.enter.addEventListener('click', (ev) => {
				ev.preventDefault();
				this.close();
			});
		
			this.DOM.logo.addEventListener('click', (ev) => {
				ev.preventDefault();
				this.open();
			});

			// Window resize
			this.onResize = () => {
				winsize = {width: window.innerWidth, height: window.innerHeight};
				if ( this.isOpen ) {
					this.layout();
				}
			};
			window.addEventListener('resize', debounce(() => this.onResize(), 10));
		}
		open() {
			if ( this.isOpen || this.isAnimating ) return;
			this.isOpen = true;
			this.isAnimating = true;

			DOM.intro.style.pointerEvents = 'auto';

			anime.remove(this.DOM.logoImg);
			anime({
				targets: this.DOM.logoImg,
				translateY: [{value: '-400%', duration: 200, easing: 'easeOutQuad'}, {value: ['200%', '0%'], duration: 700, easing: 'easeOutExpo'}]
			});

			anime.remove(this.animatableElems);
			anime({
				targets: this.animatableElems,
				duration: 1200,
				delay: (t,i) => 350 + i*30,
				easing: 'easeOutExpo',
				translateX: '0%',
				opacity: {
					value: 1,
					easing: 'linear',
					duration: 400
				}
			});

			const boxRect = this.DOM.el.getBoundingClientRect();
			anime.remove(this.DOM.el);
			anime({
				targets: this.DOM.el,
				scaleX: {value: winsize.width/boxRect.width, duration: 700, delay: 300, easing: 'easeOutExpo'},
				scaleY: {value: winsize.height/boxRect.height, duration: 300, easing: 'easeOutQuad'},
				complete: () => this.isAnimating = false
			});
		}
		close() {
			if ( !this.isOpen || this.isAnimating ) return;
			this.isOpen = false;
			this.isAnimating = true;

			DOM.intro.style.pointerEvents = 'none';

			anime.remove(this.DOM.logoImg);
			anime({
				targets: this.DOM.logoImg,
				translateY: [{value: '-400%', duration: 300, easing: 'easeOutQuad'}, {value: ['200%', '0%'], duration: 700, easing: 'easeOutExpo'}],
				rotate: [{value: 0, duration: 300}, {value: [90,0], duration: 1300, easing: 'easeOutElastic'}]
			});

			anime.remove(this.animatableElems);
			anime({
				targets: this.animatableElems,
				duration: 150,
				easing: 'easeOutQuad',
				translateX: '-30%',
				opacity: 0
			});

			anime.remove(this.DOM.el);
			anime({
				targets: this.DOM.el,
				duration: 1000,
				scaleX: {value: 1, duration: 300, easing: 'easeOutQuad'},
				scaleY: {value: 1, duration: 700, delay: 300, easing: 'easeOutExpo'},
				complete: () => this.isAnimating = false
			});

			anime.remove(DOM.slideshowImages);
			anime({
				targets: DOM.slideshowImages,
				duration: 1000,
				delay: (t,i) => i*60,
				easing: 'easeOutCubic',
				scale: [1.5,1]
			});
			anime.remove(DOM.slideshowImagesWrappers);
			anime({
				targets: DOM.slideshowImagesWrappers,
				duration: 1000,
				delay: (t,i) => i*60,
				easing: 'easeOutCubic',
				translateY: ['10%','0%']
			});
		}
	}

	const panel = new Panel(DOM.intro.querySelector('.intro__box'));



	// JQuery scripts, checks if doc ready
	$( document ).ready(function() {
		// Ascii art
		console.log("                  /|         ,\n                ,///        /|\n               // //     ,///\n              // //     // //\n             // //     || ||\n             || ||    // //\n             || ||   // //\n             || ||  // //\n             || || || ||\n             \\\\,\\|,|\\_//\n              \\\\)\\)\\\\|/\n              )-.\"\" .-(\n             //^\\` `/^\\\\\n            //  |   |  \\\\\n          ,/_| 0| _ | 0|_\\,\n        /`    `\"=.v.=\"`    `\\\n       /`    _.\"{_,_}\"._    `\\\n       `/`  ` \\  |||  / `  `\\`\n       `\\\",_  \\\\=^~^=//  _,\"`\n            \"=,\\'-=-'/,=\"\n                '---'\n");
		console.log( "quit it" );

		// handle modals

		$('#aboutBtn').on('click', () => {
			$('#aboutModal').css("display","block");

		})
		
		$('#contactBtn').on('click', () => {
			$('#contactModal').css("display","block");

		})

		$('#seedBaseInfoBtn').on('click', () => {
			$('#seedBaseInfo').css("display","block");

		})

		$('#ucnInfoBtn').on('click', () => {
			$('#ucnInfo').css("display","block");

		})

		$('.close').on('click', () => {
			$('#aboutModal').css("display","none");
			$('#contactModal').css("display","none");
			$('#seedBaseInfo').css("display","none");
			$('#ucnInfo').css("display","none");

		})
		
		// if clicked off modal close
		$(document).click(function(event) {
			var target = $(event.target);
			if (target.is("#ucnInfo") 
				|| target.is("#aboutModal") 
				|| target.is("#contactModal") 
				|| target.is("#seedBaseInfo") 
			) {
				$('#aboutModal').css("display","none");
				$('#contactModal').css("display","none");
				$('#seedBaseInfo').css("display","none");
				$('#ucnInfo').css("display","none");
			}
		});

		//Link Styles
		$("#ProjectPage").scroll(function() {
			let scrollTop = $(this).scrollTop();

			//1st tab
			if (scrollTop < 400) {
			//   $("#firstTab").focus();
			$("#firstTab").addClass("slideshow__nav-item--current");
			}
			else {
			$("#firstTab").removeClass("slideshow__nav-item--current");
			//   $("#firstTab").blur();
			}
			//2st tab
			if (scrollTop < 650 && scrollTop > 400) {
				$("#secondTab").addClass("slideshow__nav-item--current");
			}
			else {
				$("#secondTab").removeClass("slideshow__nav-item--current");
			}
			//3rd tab
			if (scrollTop < 900 && scrollTop > 650) {
			$("#thirdTab").addClass("slideshow__nav-item--current");
			}
			else {
			$("#thirdTab").removeClass("slideshow__nav-item--current");
			}
			//4th tab
			if (scrollTop < 1250 && scrollTop > 900) {
			$("#fourthTab").addClass("slideshow__nav-item--current");
			}
			else {
			$("#fourthTab").removeClass("slideshow__nav-item--current");
			}
			//5th tab
			if (scrollTop < 1600 && scrollTop > 1250) {
			$("#fifthTab").addClass("slideshow__nav-item--current");
			}
			else {
			$("#fifthTab").removeClass("slideshow__nav-item--current");
			}
			//6th tab
			if (scrollTop > 1600) {
				$("#sixthTab").addClass("slideshow__nav-item--current");
			}
			else {
				$("#sixthTab").removeClass("slideshow__nav-item--current");
			}
		});



		//   form submit
		
		$('#submitBtn').on('click', (e) => {
			e.preventDefault();


			var name = $("#name").val()
			var email = $("#email").val()
			var msg = $("#msg").val()

			var data = {
				name: name,
				email: email,
				message: msg
			};
			// console.log(data)
			var valid = verifyName(name) &&
				verifyEmail(email) &&
				verifyMsg(msg);
			// var valid = true;
			
			if (valid) {
				submitForm(data)
			} 



		})

		function submitForm(data) {
			$.ajax({
				type: "POST",
				url: "https://formspree.io/mnqgyogq", 
				data: data,
				dataType: "json",
				timeout: 1500,
				success: () => {
					console.log("success");
					handleSuccess();
				},
				error: (err) => {
					$('#form-status').css("color", 'red')
					$('#form-status').text("Error sending message")
				}
			})
		}

		function verifyName(name) {
			// const re = /^[a-zA-Z]{2,20}$/;
			const re = /^[a-zA-Z ,.'-]+$/;
			if(!re.test(name)) {
			//   name.classList.add('is-invalid');
			$('#form-status').css("color", 'red')
			$('#form-status').text("Please enter a real name")
			return false;
			} else {
				return true;
			}
		}
		
		function verifyEmail(email) {
			const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
			if(!re.test(email)) {
				$('#form-status').css("color", 'red')
				$('#form-status').text("invalid email")
			} else {
				return true;
			}
		}

		function verifyMsg(msg) {
			if (msg.length <= 0) {
				$('#form-status').css("color", 'red')
				$('#form-status').text("please enter a message")
				return false;
			} else {
				return true;
			}
		}

		function handleSuccess() {
			$('#name').prop("disabled", true);
			$('#email').prop("disabled", true);
			$('#msg').prop("disabled", true);
			$('#submitBtn').prop("disabled", true);
			$('#contactForm').trigger("reset")
			$('#form-status').css("color", 'black')
			$('#form-status').text("Thank you")
		}

		//handle routes
		if ($(location).attr('href').split('?')[1] == 'project=seedbase') {
			panel.close()
			setTimeout(() => {  $('#seedBaseInfo').css("display","block"); }, 500);	
		}

		//handle routes
		if ($(location).attr('href').split('?')[1] == 'project=ucn') {
			panel.close()
			setTimeout(() => {  $('#ucnInfo').css("display","block"); }, 500);	
		}

		
		if ($(location).attr('href').split('?')[1] == 'page=about') {
			panel.close()
			setTimeout(() => {  $('#aboutModal').css("display","block"); }, 500);
		}

		if ($(location).attr('href').split('?')[1] == 'page=contact') {
			panel.close()
			setTimeout(() => {  $('#contactModal').css("display","block"); }, 500);
		}
		

		// Open site if enter pressed
		$(document).on('keyup', function(event) {
			if(!$(event.target).is(':input')){
			   if(event.keyCode== 13 || event.keyCode== 32) {
				if (panel.isOpen) {
					panel.close()
				}
				else {
					panel.open()
				}
			   }
			}
			if (event.key == "Escape") {
				$('#aboutModal').css("display","none");
				$('#contactModal').css("display","none");
				$('#seedBaseInfo').css("display","none");
				$('#ucnInfo').css("display","none");
			}
		});
		// panel.close()

	});
}