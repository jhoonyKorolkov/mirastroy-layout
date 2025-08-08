// ===== Общие функции =====

// Ставит на паузу все видео на сайте, кроме указанного
function pauseAllVideos(exceptVideo = null) {
    document.querySelectorAll('video').forEach((v) => {
        if (v !== exceptVideo) v.pause()
    })
}

// Ставит на паузу все видео внутри конкретного слайдера
function pauseSliderVideos(sliderEl, exceptVideo = null) {
    sliderEl.querySelectorAll('video').forEach((v) => {
        if (v !== exceptVideo) v.pause()
    })
}

// ===== Глобальная логика для всех видео =====
document.querySelectorAll('video').forEach((video) => {
    video.addEventListener('play', () => pauseAllVideos(video))
})

// ===== Логика для блока WHY =====
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

// ===== Логика для outer-swiper =====
document
    .querySelectorAll('.outer-swiper .works__slide-video')
    .forEach((video) => {
        const slideEl = video.closest('.works__slide')
        const playBtn = slideEl.querySelector('.works__slide-play')
        const sliderEl = video.closest('.outer-swiper')

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
    innerEl.querySelectorAll('.swiper-slide').forEach((slide) => {
        slide.addEventListener('click', () => swiperInstance.slideNext())
    })
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

// Логика для воспроизведения видео
document.querySelectorAll('.reviews__slide-video').forEach((video) => {
    const playBtn = video
        .closest('.reviews__slide')
        .querySelector('.reviews__slide-play')

    const videoFooter = video
        .closest('.reviews__slide')
        .querySelector('.reviews__slide-footer')

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
        videoFooter.style.display = 'none'
    })

    video.addEventListener('pause', () => {
        playBtn.style.display = 'block'
        videoFooter.style.display = 'block'
    })
})

document.querySelectorAll('.how__item-hdr').forEach((btn) => {
    btn.addEventListener('click', () => {
        const currentItem = btn.closest('.how__item')

        if (currentItem.classList.contains('active')) {
            currentItem.classList.remove('active')
            return
        }
        currentItem.classList.add('active')
    })
})

document.querySelectorAll('.faq__item-hdr').forEach((btn) => {
    btn.addEventListener('click', () => {
        const currentItem = btn.closest('.faq__item')

        if (currentItem.classList.contains('active')) {
            currentItem.classList.remove('active')
            return
        }

        currentItem.classList.add('active')
    })
})

document.addEventListener('DOMContentLoaded', function () {
    const burger = document.querySelector('.header__burger')
    const dropdown = document.querySelector('.header__dropdown')
    const body = document.querySelector('body')

    function isMobile() {
        return window.innerWidth <= 768
    }

    // Открытие/закрытие по кнопке
    burger.addEventListener('click', function (e) {
        e.stopPropagation() // Не даём всплыть до body

        const isOpen = burger.classList.toggle('open')
        dropdown.classList.toggle('active')

        if (isMobile()) {
            body.classList.toggle('locked', isOpen)
        }
    })

    // Закрытие при клике вне меню и кнопки
    document.addEventListener('click', function (e) {
        const isClickInsideDropdown = dropdown.contains(e.target)
        const isClickOnBurger = burger.contains(e.target)

        if (!isClickInsideDropdown && !isClickOnBurger) {
            burger.classList.remove('open')
            dropdown.classList.remove('active')

            if (isMobile()) {
                body.classList.remove('locked')
            }
        }
    })

    window.addEventListener('resize', function () {
        if (!isMobile()) {
            body.classList.remove('locked')
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

document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.first__images-wrap'))
    let current = 0

    // Инициализируем все карточки: первая — active, остальные — inactive
    cards.forEach((c, i) => c.classList.add(i === 0 ? 'active' : 'inactive'))

    setInterval(() => {
        // текущую делаем inactive
        cards[current].classList.replace('active', 'inactive')

        // переключаем индекс
        current = (current + 1) % cards.length

        // новую делаем active
        cards[current].classList.replace('inactive', 'active')
    }, 3000)
})
