/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
document.addEventListener('DOMContentLoaded', () => {
    initImageSlider()
    initVideoModal()
    initBurgerMenu()
    initScrollAnchors()
    initSwipers()
    initReviewSliderVideos()
    initHowAccordion()
    initFaqAccordion()
    initWhyVideo()
    closeModal()
})

/* -------------------------------
 *  Автослайдер карточек
 * ------------------------------- */
function initImageSlider() {
    const cards = Array.from(document.querySelectorAll('.first__images-wrap'))
    if (cards.length === 0) return

    let current = 0
    cards.forEach((c, i) => c.classList.add(i === 0 ? 'active' : 'inactive'))

    setInterval(() => {
        cards[current].classList.replace('active', 'inactive')
        current = (current + 1) % cards.length
        cards[current].classList.replace('inactive', 'active')
    }, 3000)
}

/* -------------------------------
 * Мобильная модалка с видео
 * ------------------------------- */
function initVideoModal() {
    const isMobile = window.innerWidth <= 768
    if (!isMobile) return

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

/******/ })()
;