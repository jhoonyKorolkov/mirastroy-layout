/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
document.addEventListener('DOMContentLoaded', () => {
    initVideoModal()
    initBurgerMenu()
    initScrollAnchors()
    initSwipers()
    initReviewSliderVideos()
    initHowAccordion()
    initFaqAccordion()
    initWhyVideo()
    initProjectVideo()
    initBeforAfter()
    closeModal()
})

/* -------------------------------
 * Мобильная модалка с видео
 * ------------------------------- */
function initVideoModal() {
    // const isMobile = window.innerWidth <= 768

    // if (!isMobile) return

    const modal = document.querySelector('.video-modal')
    if (!modal) return

    const modalVideo = modal.querySelector('.video-modal__video')
    const modalContent = modal.querySelector('.video-modal__content')
    const closeBtn = modal.querySelector('.video-modal__close')
    const playBtns = document.querySelectorAll('.video-play-btn')
    const body = document.body

    if (!modalVideo || !modalContent || !closeBtn) return

    playBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const src = btn.dataset.videoSrc
            if (!src) return
            initGlobalVideoPause()
            modal.hidden = false
            modalVideo.src = src
            modalVideo.currentTime = 0
            modalVideo.play()
            body.classList.add('locked')
        })
    })

    function closeModal() {
        modalVideo.pause()
        modalVideo.removeAttribute('src')
        modalVideo.load()
        modal.hidden = true
        body.classList.remove('locked')
    }

    closeBtn.addEventListener('click', closeModal)

    modal.addEventListener('click', (e) => {
        if (!modalContent.contains(e.target)) {
            closeModal()
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) {
            closeModal()
        }
    })
}

/* -------------------------------
 *  Бургер-меню
 * ------------------------------- */
function initBurgerMenu() {
    const burger = document.querySelector('.header__burger')
    const dropdown = document.querySelector('.header__dropdown')
    const body = document.body

    if (!burger || !dropdown) return

    const isMobile = () => window.innerWidth <= 768

    burger.addEventListener('click', function (e) {
        e.stopPropagation()
        const isOpen = burger.classList.toggle('open')
        dropdown.classList.toggle('active')
        if (isMobile()) body.classList.toggle('locked', isOpen)
    })

    document.addEventListener('click', function (e) {
        const isClickInsideDropdown = dropdown.contains(e.target)
        const isClickOnBurger = burger.contains(e.target)

        if (!isClickInsideDropdown && !isClickOnBurger) {
            burger.classList.remove('open')
            dropdown.classList.remove('active')
            if (isMobile()) body.classList.remove('locked')
        }
    })

    window.addEventListener('resize', function () {
        if (!isMobile()) {
            body.classList.remove('locked')
        }
    })
}

/* -------------------------------
 * Якорные ссылки
 * ------------------------------- */
function initScrollAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href')
            const targetElement = document.querySelector(targetId)

            if (targetElement) {
                e.preventDefault()
                scrollToElement(targetId, 1000)
            }
        })
    })

    function scrollToElement(targetSelector, duration = 800) {
        const target = document.querySelector(targetSelector)
        if (!target) return

        const startY = window.scrollY
        const targetY = target.getBoundingClientRect().top + startY

        const offset = window.innerWidth <= 767 ? 60 : 0
        const finalY = targetY - offset

        const distance = finalY - startY
        const startTime = performance.now()

        function scroll(currentTime) {
            const timeElapsed = currentTime - startTime
            const progress = Math.min(timeElapsed / duration, 1)
            const ease = easeInOutQuad(progress)

            window.scrollTo(0, startY + distance * ease)

            if (timeElapsed < duration) {
                requestAnimationFrame(scroll)
            }
        }

        requestAnimationFrame(scroll)
    }

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    }
}

function initSwipers() {
    // Ставит на паузу все видео внутри конкретного слайдера
    function pauseSliderVideos(sliderEl, exceptVideo = null) {
        sliderEl.querySelectorAll('video').forEach((v) => {
            if (v !== exceptVideo) v.pause()
        })
    }

    // ===== Логика для outer-swiper =====

    document
        .querySelectorAll('.outer-swiper .works__slide-video')
        .forEach((video) => {
            const slideEl = video.closest('.works__slide')
            const playBtn = slideEl.querySelector('.works__slide-play')
            const sliderEl = video.closest('.outer-swiper')
            const isMobile = window.innerWidth <= 768
            if (isMobile) return
            const togglePlayBtn = (show) => {
                playBtn.style.display = show ? 'block' : 'none'
            }

            playBtn.addEventListener('click', () => {
                initGlobalVideoPause()
                pauseSliderVideos(sliderEl, video)
                video.controls = true
                video.play()
            })

            video.addEventListener('pause', () => togglePlayBtn(true))
            video.addEventListener('play', () => togglePlayBtn(false))
        })

    // ===== Инициализация Swiper =====
    const outerSwiper = new Swiper('.outer-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 16,

        navigation: {
            nextEl: '.works__controls-next',
            prevEl: '.works__controls-prev',
        },
        breakpoints: {
            768: {
                spaceBetween: 24,
            },
        },
        on: {
            slideChangeTransitionStart(swiper) {
                pauseSliderVideos(swiper.el)
            },
        },
    })

    document.querySelectorAll('.inner-swiper').forEach((innerEl) => {
        const swiperInstance = new Swiper(innerEl, {
            nested: true,
            loop: true,
            pagination: {
                el: innerEl
                    .closest('.works__item')
                    .querySelector('.inner-pagination'),
                clickable: true,
            },
        })

        // По клику на слайд листаем внутренний
        // innerEl.querySelectorAll('.swiper-slide').forEach((slide) => {
        //     slide.addEventListener('click', () => swiperInstance.slideNext())
        // })
    })

    const comandSwiper = new Swiper('.comand__slider', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        navigation: {
            nextEl: '.comand__controls-next',
            prevEl: '.comand__controls-prev',
        },
        breakpoints: {
            768: {
                loop: true,
                slidesPerView: '3',
                spaceBetween: 24,
            },
        },
    })

    // Инициализация слайдера отзывов
    const reviewsSwiper = new Swiper('.reviews__slider', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        navigation: {
            nextEl: '.reviews__controls-next',
            prevEl: '.reviews__controls-prev',
        },
        on: {
            slideChangeTransitionStart(swiper) {
                swiper.el.querySelectorAll('video').forEach((video) => {
                    video.pause()
                })
            },
        },
        breakpoints: {
            768: {
                loop: true,
                slidesPerView: '3',
                spaceBetween: 24,
            },
        },
    })
    // Инициализация слайдера отзывов
    const projectSwiper = new Swiper('.project__slider', {
        slidesPerView: 'auto',
        spaceBetween: 16,
        navigation: {
            nextEl: '.project__controls-next',
            prevEl: '.project__controls-prev',
        },
        on: {
            slideChangeTransitionStart(swiper) {
                swiper.el.querySelectorAll('video').forEach((video) => {
                    video.pause()
                })
            },
        },
        // breakpoints: {
        //     768: {
        //         loop: true,
        //         slidesPerView: '3',
        //         spaceBetween: 24,
        //     },
        // },
    })

    document
        .querySelectorAll('.project__slider .project__slide-video')
        .forEach((video) => {
            const slideEl = video.closest('.project__slide')
            const playBtn = slideEl.querySelector('.project__slide-play')
            const sliderEl = video.closest('.project__slider')
            const isMobile = window.innerWidth <= 768
            if (isMobile) return
            const togglePlayBtn = (show) => {
                playBtn.style.display = show ? 'block' : 'none'
            }

            playBtn.addEventListener('click', () => {
                initGlobalVideoPause()
                pauseSliderVideos(sliderEl, video)
                video.controls = true
                video.play()
            })

            video.addEventListener('pause', () => togglePlayBtn(true))
            video.addEventListener('play', () => togglePlayBtn(false))
        })
}

function initGlobalVideoPause() {
    document.querySelectorAll('video').forEach((video) => {
        video.addEventListener('play', () => pauseAllVideos(video))
    })

    // Ставит на паузу все видео на сайте, кроме указанного
    function pauseAllVideos(exceptVideo = null) {
        document.querySelectorAll('video').forEach((v) => {
            if (v !== exceptVideo) v.pause()
        })
    }
}

function initReviewSliderVideos() {
    const isMobile = window.innerWidth <= 768
    if (isMobile) return
    document.querySelectorAll('.reviews__slide-video').forEach((video) => {
        const slide = video.closest('.reviews__slide')
        const playBtn = slide.querySelector('.reviews__slide-play')
        const footer = slide.querySelector('.reviews__slide-footer')

        playBtn.addEventListener('click', () => {
            video
                .closest('.reviews__slider')
                .querySelectorAll('video')
                .forEach((v) => {
                    if (v !== video) v.pause()
                })

            initGlobalVideoPause()
            video.controls = true
            video.play()
        })

        video.addEventListener('play', () => {
            playBtn.style.display = 'none'
            footer.style.display = 'none'
        })

        video.addEventListener('pause', () => {
            playBtn.style.display = 'block'
            footer.style.display = 'block'
        })
    })
}

function initHowAccordion() {
    document.querySelectorAll('.how__item-hdr').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.how__item')
            item.classList.toggle('active')
        })
    })
}

function initFaqAccordion() {
    document.querySelectorAll('.faq__item-hdr').forEach((btn) => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq__item')
            item.classList.toggle('active')
        })
    })
}

function initWhyVideo() {
    const isMobile = window.innerWidth <= 768
    if (isMobile) return

    const why = document.querySelector('.why__blog')
    if (why) {
        const video = why.querySelector('video')
        const playBtn = why.querySelector('.why__blog-play')

        const togglePlayBtn = (show) => {
            playBtn.style.display = show ? 'block' : 'none'
        }

        playBtn.addEventListener('click', () => {
            initGlobalVideoPause()
            video.controls = true
            video.play()
        })

        video.addEventListener('pause', () => togglePlayBtn(true))
        video.addEventListener('play', () => togglePlayBtn(false))
    }
}

function initProjectVideo() {
    const isMobile = window.innerWidth <= 768
    if (isMobile) return

    const project = document.querySelector('.project__blog')
    if (project) {
        const video = project.querySelector('video')
        const playBtn = project.querySelector('.video-play-btn')

        const togglePlayBtn = (show) => {
            playBtn.style.display = show ? 'block' : 'none'
        }

        playBtn.addEventListener('click', () => {
            initGlobalVideoPause()
            video.controls = true
            video.play()
        })

        video.addEventListener('pause', () => togglePlayBtn(true))
        video.addEventListener('play', () => togglePlayBtn(false))
    }
}

function closeModal() {
    const modal = document.querySelector('.modal')
    const closeBtn = modal.querySelector('.modal__close')

    if (!modal) return

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show')
    })
}

// ymaps.ready(init)

// function init() {
//     const map = new ymaps.Map('map', {
//         center: [54.710426, 20.510398],
//         zoom: 12,
//     })

//     const points = [
//         {
//             coords: [54.710426, 20.510398],
//             images: [
//                 '/images/first-screen-1.png',
//                 '/images/first-screen-2.png',
//                 '/images/first-screen-3.png',
//             ],
//             description: 'Центр Калининграда',
//         },
//         {
//             coords: [54.718894, 20.499084],
//             images: [
//                 '/images/first-screen-1.png',
//                 '/images/first-screen-2.png',
//                 '/images/first-screen-3.png',
//             ],
//             description: 'Кафедральный собор (остров Канта)',
//         },
//         {
//             coords: [54.705517, 20.5115],
//             images: [
//                 '/images/first-screen-1.png',
//                 '/images/first-screen-2.png',
//                 '/images/first-screen-3.png',
//             ],
//             description: 'Музей янтаря',
//         },
//         {
//             coords: [54.71, 20.537],
//             images: [
//                 '/images/first-screen-1.png',
//                 '/images/first-screen-2.png',
//                 '/images/first-screen-3.png',
//             ],
//             description: 'Калининградский зоопарк',
//         },
//         {
//             coords: [54.6972, 20.5088],
//             images: [
//                 '/images/first-screen-1.png',
//                 '/images/first-screen-2.png',
//                 '/images/first-screen-3.png',
//             ],
//             description: 'Фридландские ворота (музей)',
//         },
//     ]

//     const BalloonLayout = ymaps.templateLayoutFactory.createClass(
//         `<div class="balloon-content">
//       <div class="swiper">
//         <div class="swiper-wrapper">
//           $[properties.images]
//         </div>
//         <div class="swiper-pagination"></div>
//       </div>
//       <div>$[properties.description]</div>
//     </div>`,
//         {
//             build: function () {
//                 BalloonLayout.superclass.build.call(this)
//                 setTimeout(() => {
//                     new Swiper('.swiper', {
//                         pagination: {
//                             el: '.swiper-pagination',
//                             clickable: true,
//                         },
//                     })
//                 }, 0)
//             },
//         },
//     )

//     points.forEach((point) => {
//         const imagesHtml = point.images
//             .map(
//                 (img) => `<div class="swiper-slide"><img src="${img}" /></div>`,
//             )
//             .join('')

//         const placemark = new ymaps.Placemark(
//             point.coords,
//             {
//                 description: point.description,
//                 images: imagesHtml,
//             },
//             {
//                 balloonContentLayout: BalloonLayout,
//                 balloonPanelMaxMapArea: 0,
//                 hideIconOnBalloonOpen: false,
//             },
//         )

//         map.geoObjects.add(placemark)
//     })
// }

// 1) Проставляем уникальную группу каждому контейнеру слайдов
document.querySelectorAll('[data-gallery-root]').forEach((root, i) => {
    const group = `gallery-${i + 1}`

    root.querySelectorAll('a[href]').forEach((a) => {
        a.setAttribute('data-fancybox', group)
    })
})

Fancybox.getDefaults().zoomEffect = false

Fancybox.bind('[data-fancybox]', {
    animated: true,
    showClass: 'f-fadeIn',
    hideClass: 'f-fadeOut',
    Images: {
        zoom: false,
    },
})
function initBeforAfter() {
    const container = document.querySelector('.before-after')

    if (!container) return
    const afterWrap = container.querySelector('.after-wrap')
    const divider = container.querySelector('.divider')

    let isDragging = false

    function updateSlider(x) {
        const rect = container.getBoundingClientRect()
        let offset = x - rect.left
        offset = Math.max(0, Math.min(offset, rect.width))
        const percent = (offset / rect.width) * 100
        afterWrap.style.width = `${percent}%`
        divider.style.left = `${percent}%`
    }

    // ПК
    divider.addEventListener('mousedown', (e) => {
        isDragging = true
        updateSlider(e.clientX)
    })

    document.addEventListener('mousemove', (e) => {
        if (isDragging) updateSlider(e.clientX)
    })

    document.addEventListener('mouseup', () => {
        isDragging = false
    })

    // Тач-устройства
    divider.addEventListener(
        'touchstart',
        (e) => {
            isDragging = true
            updateSlider(e.touches[0].clientX)
        },
        { passive: true },
    )

    document.addEventListener(
        'touchmove',
        (e) => {
            if (isDragging) updateSlider(e.touches[0].clientX)
        },
        { passive: true },
    )

    document.addEventListener('touchend', () => {
        isDragging = false
    })
}

/******/ })()
;