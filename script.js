// sticky header

$(document).ready(function() {
    let lastScrollTop = 0;
    const delta = 5; // Sensitivity to detect small scrolls
    const headerHeight = $('#header').outerHeight();

    $(window).on('scroll', function() {
        let st = $(this).scrollTop();

        // Ensure the user has scrolled more than delta
        if (Math.abs(lastScrollTop - st) <= delta) {
            return;
        }

        if (st > lastScrollTop && st > headerHeight) {
            // Scroll Down
            $('#header').css('transform', 'translateY(-100%)');
        } else if (st + $(window).height() < $(document).height()) {
            // Scroll Up
            $('#header').css('transform', 'translateY(0)');
        }

        lastScrollTop = st;
    });
});


// tabs change

function activeTab(evt, id) {
           
    // Get all elements with class="tablinks" and remove the class "active"
     let tabactive = document.getElementsByClassName("TabButtonSelected");
     tabactive[0].className = tabactive[0].className.replace(" TabButtonSelected", "");

     document.getElementById(id).style.display = "block";
     evt.currentTarget.className += " TabButtonSelected";

     displaySection(evt,id)
 }
 
function displaySection(evt, id) {

     let tabactive = document.getElementsByClassName("tab-section");
     tabactive[0].className = tabactive[0].className.replace(" d-chart-show", "d-chart-n");
     // add below line of codes
     [...document.querySelectorAll('div.tab-section')].forEach(item => item.style.display='none')
     document.getElementById("Section" + id).style.display = "block";
     evt.currentTarget.className += " d-chart-show";

}


// mobile menu

$( document ).ready(function() {

    $( ".cross" ).hide();
    $( ".menu" ).hide();
    $( ".canva_expander" ).click(function() {
    $( ".menu" ).slideToggle( "slow", function() {
    $( ".canva_expander" ).hide();
    $( ".cross" ).show();
    });
    });
    
    $( ".cross" ).click(function() {
    $( ".menu" ).slideToggle( "slow", function() {
    $( ".cross" ).hide();
    $( ".canva_expander" ).show();
    });
    });
    
    });
  
   // Close out sub menu
   $('.sub__close').click(function(e) {
    e.preventDefault();
    $( ".sub__close" ).hide();
    // $(this).parent().parent().removeClass('is-active');
  });
  
  // Trigger sub menu
  $('.menu ul .nav__submenu').click(function(e) {
    e.preventDefault();
    
    $(this).siblings().addClass('is-active');
  });

// photo gallery


class Lightbox {
    
    constructor({
        lazyload = true,
        counter = true,
        arrows = true,
        slideSpeed = 400,
        ...options
    }) {
        if(!options.selector) {
            console.error('Please add a valid css selector with the option "selector:"');
        } else if (typeof options.selector !== 'string') { 
            console.error(options.selector, `is not a string but a(n) ${typeof options.selector}`)   
        } else {
            this.selector = options.selector;
            this.lazyload = lazyload;
            this.counter = counter;
            this.arrows = arrows;
            this.slideSpeed = slideSpeed;
            
            this.links = Array.from(document.querySelectorAll(`a${options.selector}`));
            this.offsets = [];
            this.nodes = {};        
            this.imageIndex = null;
            if (this.links.length > 0) {
                this.createLightbox();
                this.createNodes();
                this.eventListeners(this.links);  
            } else {
                console.error(`The selector '${this.selector}' did not yield results. Please make sure the selector is applied on an 'a' element.`)
            }
        }
    };
    
    goTo = (num, event) => {
        const { items, counter, lightboxNode } = this.nodes;
        if(this.counter) {
            counter.innerHTML = `${num + 1}/${this.links.length}`;
        }
        const spinner = `<div class="spinner"></div>`;
        const img = items[num].querySelector('img');
        if(this.lazyload) {
            const src = img.getAttribute('data-src');
            items[num].insertAdjacentHTML('beforeend', spinner);
            // Set image attribute
            img.setAttribute('src', src);
            
            // Add class to slide item when image is completely loaded. Must be in this order. 
            const imgLoad = new Image();        
            imgLoad.onload = () => { 
                items[num].classList.add('is-active');
                items[num].classList.add('is-loaded');
            }
            imgLoad.src = src; 
        } else {
            items[num].classList.add('is-active');
            items[num].classList.add('is-loaded');
        }
        
        // Change the offset for each slide based on its index and the current index.
        for (let i = 0; i < this.offsets.length; i++) {
            const offset = this.offsets[i] - (num * 100);
            
            items[i].style.transform = `translateX(${offset}vw)`;
            
            // Add transition type based on which event was triggered
            if(event) {
                if(event.target.className === 'gallery__itemThumb') {
                    items[i].style.transition = `opacity 0.4s ease`;
                } else {
                    items[i].style.transition = `transform ${this.slideSpeed}ms ease-out`;
                }
            }
        }
    };

    createNodes = (links) => {
        // Find all the lightbox nodes and add them to an object
        Object.assign(this.nodes, {
            lightboxNode: document.querySelector('.m-lightbox'),
            items: Array.from(document.querySelectorAll('.m-lightbox__slide')),
            next: document.querySelector('.m-lightbox__nextPrev--next'),
            prev: document.querySelector('.m-lightbox__nextPrev--prev'),
            close: document.querySelector('.m-lightbox__close'),
            
        });
        
        Object.assign(this.nodes, { 
            counter: document.querySelector('.m-lightbox__counter'),
        });
    };

    eventListeners = (links) => {
        const { lightboxNode, items, next, prev, close } = this.nodes;
        links.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                lightboxNode.classList.add('is-active');
                document.body.style.overflow = 'hidden';
                this.imageIndex = index;
                this.goTo(index, e);
                this.setNav(index);
            });
        });
        
        next.addEventListener('click', (e) => {
            this.goToNext(e);
        });
        
        prev.addEventListener('click', (e) => {
            this.goToPrev(e);
        });
        
        close.addEventListener('click', () => {
            this.closeBox();
        });
        
        document.onkeydown = (e) => {
            switch (e.keyCode) {
                case 37:
                    this.goToPrev(e);
                    break;
                case 39:
                    this.goToNext(e);
                    break;
                case 27:
                    this.closeBox();
                    break;
            };
        };
        
        items.forEach((item) => {
            // https://gist.github.com/Tam/d44c87b3daeb07b15984ddc6127d4e34
            new Swipe(item.querySelector('img'), (e, direction) => {
                e.preventDefault();
                switch (direction) {
                    case "up":
                        // Handle Swipe Up
                        break;
                    case "down":
                        // Handle Swipe Down
                        break;
                    case "left":
                        this.goToNext(e);
                        break;
                    case "right":
                        this.goToPrev(e);
                        break;
                }
            });
        })
    };

    setNav = (index) => {
        if(this.arrows) {
            const { next, prev } = this.nodes;
            if (index < (this.links.length - 1)) {                    
                next.classList.add('is-active');
            }        
            if (index >= (this.links.length - 1)) {                    
                next.classList.remove('is-active');
            } 
            if (index > 0) {
                prev.classList.add('is-active');
            }
            if(index <= 0) {
                prev.classList.remove('is-active');
            }
        }
    };

    goToNext = (e) => {
        const { items } = this.nodes;
        if (this.imageIndex < items.length - 1) {
            this.goTo((this.imageIndex + 1), e);
            setTimeout(() => {
                items[this.imageIndex - 1].classList.remove('is-active');
            }, this.slideSpeed)
            this.imageIndex += 1;
            this.setNav(this.imageIndex);
        }
    };

    goToPrev = (e) => {
        const { items } = this.nodes;
        if (this.imageIndex > 0) {
            this.goTo((this.imageIndex - 1), e);
            setTimeout(() => {
                items[this.imageIndex + 1].classList.remove('is-active');
            }, this.slideSpeed)
            this.imageIndex -= 1;
            this.setNav(this.imageIndex);
        }
    };

    closeBox = () => {
        const { lightboxNode, items } = this.nodes;
        lightboxNode.classList.remove('is-active');
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            items.forEach(item => item.classList.remove('is-active'));
        }, this.slideSpeed);
    };
    
    renderImages = (images) => {
        const imagesLinks = images.map((item, index) => {
            const offset = index * 100;
            this.offsets.push(offset);
            const imageSrc = item.getAttribute('href');
            return `
                <li class='m-lightbox__slide' style='transform: translateX(${offset}vw)'>
                    ${this.lazyload ? `
                        <img data-src='${imageSrc}'/>
                    ` : `
                        <img src='${imageSrc}'/>
                    `}
                </li>
            `;
        });
        return imagesLinks;
    };
    
    createLightbox = () => {
        const lightbox = `
            <div class='m-lightbox'>
                <div class='m-lightbox__controls'>
                    <button class='m-lightbox__close'>
                        <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                            <path d="M0 0h24v24H0z" fill="none"/>
                        </svg>
                    </button>
                    <button class='m-lightbox__nextPrev m-lightbox__nextPrev--prev'>
                        <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                        </svg>
                    </button>
                    <button class='m-lightbox__nextPrev m-lightbox__nextPrev--next'>
                        <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                        </svg>
                    </button>
                </div>
                <ul class='m-lightBox__slider'>
                    ${this.renderImages(this.links).join('')}
                </ul>
                <div class='m-lightbox__counter'>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', lightbox);
    };    
}

const lb = new Lightbox({
    selector: '[data-rel="aiLightbox"]', // string
    lazyload: true, // boolean
    arrows: true, // boolean    
    counter: true, // boolean
    slideSpeed: 500, //number(ms)
});


