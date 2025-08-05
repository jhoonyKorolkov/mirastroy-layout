const why = document.querySelector('.why__blog')

if (why) {
    const video = why.querySelector('video')
    const playBtn = why.querySelector('.why__blog-play')

    playBtn.addEventListener('click', () => {
        playBtn.style.display = 'none'
        video.controls = true
        video.play()
    })

    video.addEventListener('pause', () => {
        playBtn.style.display = 'block'
    })

    video.addEventListener('play', () => {
        playBtn.style.display = 'none'
    })
}

new Swiper('.works__item-images', {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 30,
    grabCursor: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
})
new Swiper('.works__slider', {
    slidesPerView: 4,
    centeredSlides: true,
    spaceBetween: 30,
    grabCursor: false,
    breakpoints: {
        navigation: {
            nextEl: '.psycard__slider-next',
            prevEl: '.psycard__slider-prev',
        },
    },
})
