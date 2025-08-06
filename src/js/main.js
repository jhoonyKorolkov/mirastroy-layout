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
            pauseSliderVideos(sliderEl, video) // стопаем только внутри этого слайдера
            video.controls = true
            video.play()
        })

        video.addEventListener('pause', () => togglePlayBtn(true))
        video.addEventListener('play', () => togglePlayBtn(false))
    })

// ===== Инициализация Swiper =====
const outerSwiper = new Swiper('.outer-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 24,
    navigation: {
        nextEl: '.works__controls-next',
        prevEl: '.works__controls-prev',
    },
    on: {
        slideChangeTransitionStart(swiper) {
            pauseSliderVideos(swiper.el) // стопаем только в этом слайдере
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
    slidesPerView: 3,
    spaceBetween: 24,
    // loop: true,
    navigation: {
        nextEl: '.comand__controls-next',
        prevEl: '.comand__controls-prev',
    },
})

// Инициализация слайдера отзывов
const reviewsSwiper = new Swiper('.reviews__slider', {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: true,
    navigation: {
        nextEl: '.reviews__controls-next',
        prevEl: '.reviews__controls-prev',
    },
    on: {
        slideChangeTransitionStart(swiper) {
            // При смене слайда останавливаем видео в слайдере
            swiper.el.querySelectorAll('video').forEach((video) => {
                video.pause()
            })
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
        // Останавливаем другие видео внутри этого слайдера
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

        // Если клик по уже активному — просто убрать active
        if (currentItem.classList.contains('active')) {
            currentItem.classList.remove('active')
            return
        }

        // Убираем active у всех
        document.querySelectorAll('.how__item').forEach((item) => {
            item.classList.remove('active')
        })

        // Добавляем active только текущему
        currentItem.classList.add('active')
    })
})

document.querySelectorAll('.faq__item-hdr').forEach((btn) => {
    btn.addEventListener('click', () => {
        const currentItem = btn.closest('.faq__item')

        // Если клик по уже активному — просто убрать active
        if (currentItem.classList.contains('active')) {
            currentItem.classList.remove('active')
            return
        }

        // Убираем active у всех
        document.querySelectorAll('.faq__item').forEach((item) => {
            item.classList.remove('active')
        })

        // Добавляем active только текущему
        currentItem.classList.add('active')
    })
})
