import gulp from 'gulp'
import plumber from 'gulp-plumber'
import browserSync from 'browser-sync'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import dependents from 'gulp-dependents'
import rename from 'gulp-rename'
import fileInclude from 'gulp-file-include'
import webpackStream from 'webpack-stream'
import svgmin from 'gulp-svgmin'
import svgSprite from 'gulp-svg-sprite'
import webp from 'gulp-webp'
import debug from 'gulp-debug'
import { deleteAsync } from 'del'
import notify from 'gulp-notify'

const sass = gulpSass(dartSass)
const bs = browserSync.create()

// ————————————————————————————————————————————————————————
//  Ошибка компиляции Sass
// ————————————————————————————————————————————————————————
export function onError(err) {
    notify.onError({
        title: 'Sass compilation failed',
        message: '<%= error.message %>',
        sound: 'Basso',
    })(err)
    this.emit('end')
}

// ————————————————————————————————————————————————————————
//  Сборка стилей (только изменившийся файл + его dependents)
// ————————————————————————————————————————————————————————
export function styles(changedFile) {
    return gulp
        .src(changedFile, { base: './src/styles' })
        .pipe(plumber({ errorHandler: onError }))
        .pipe(dependents()) // находим все entry, которые используют этот файл
        .pipe(sass({ outputStyle: 'expanded' }, sass.logError))
        .pipe(rename({ dirname: '' }))
        .pipe(gulp.dest('./dist/css'))
        .on('end', () => {
            bs.reload('*.css') // один вызов
        })
}

export function cssLibs() {
    return gulp
        .src('./src/styles/libs/*.css')
        .pipe(debug({ title: 'Переноси стили библиотеки:' }))
        .pipe(gulp.dest('./dist/css'))
        .on('end', () => {
            bs.reload('*.css') // один вызов
        })
}

export function videos() {
    return gulp
        .src('./src/videos/**/*.{mp4,webm,ogg}')
        .pipe(debug({ title: 'Копируем видео:' }))
        .pipe(gulp.dest('./dist/videos'))
}

// ————————————————————————————————————————————————————————
//  HTML, JS, шрифты, картинки и спрайт оставляем как у вас
// ————————————————————————————————————————————————————————
export function html() {
    return gulp
        .src('./src/**/*.html')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(fileInclude({ prefix: '@@', basepath: './templates' }))
        .pipe(gulp.dest('./dist'))
        .pipe(bs.stream())
}

export async function scripts() {
    const webpackConfig = (await import('./webpack.config.js')).default
    return gulp
        .src('./src/js/main.js')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(webpackStream(webpackConfig))
        .pipe(gulp.dest('./dist/js'))
        .pipe(bs.stream())
}

export function jsLibs() {
    return gulp
        .src('./src/js/libs/*.js')
        .pipe(debug({ title: 'Переноси скрипты библиотеки:' }))
        .pipe(gulp.dest('./dist/js'))
}

export function fonts() {
    return gulp.src('./src/fonts/**/*').pipe(gulp.dest('./dist/fonts'))
}

function convertWebp() {
    return gulp
        .src('src/images/**/*.{jpg,jpeg,png}')
        .pipe(debug({ title: 'Конвертируем в WebP:' }))
        .pipe(webp())
        .pipe(rename({ extname: '.webp' }))
        .pipe(gulp.dest('./dist/images'))
}

function copyImages() {
    return gulp
        .src('src/images/**/*.{jpg,jpeg,png,svg,gif,ico}')
        .pipe(debug({ title: 'Копируем изображения:' }))
        .pipe(gulp.dest('./dist/images'))
}

export const images = gulp.parallel(convertWebp, copyImages)

export function sprite() {
    return gulp
        .src('./src/icons/*.svg')
        .pipe(
            svgmin({
                plugins: [
                    { name: 'preset-default' },
                    { name: 'removeDimensions' },
                ],
            }),
        )
        .pipe(svgSprite({ mode: { symbol: { sprite: '../sprite.svg' } } }))
        .pipe(gulp.dest('./dist/images'))
        .pipe(bs.stream())
}

// ————————————————————————————————————————————————————————
//  Очистка
// ————————————————————————————————————————————————————————
export async function clean() {
    return deleteAsync(['dist'])
}

// ————————————————————————————————————————————————————————
//  Сервер + слежка
// ————————————————————————————————————————————————————————
export function serve() {
    bs.init({
        server: { baseDir: './dist' },
        port: 3000,
        notify: false,
    })

    const watchOpts = {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 200 },
    }

    // SCSS — одно наблюдение с условием
    gulp.watch('./src/styles/**/*.scss', watchOpts).on('change', (filepath) => {
        if (filepath.includes('_mixins') || filepath.includes('_variables')) {
            // Пересобираем все точки входа
            styles('./src/styles/*.scss')
        } else {
            // Пересобираем только затронутые entry
            styles(filepath)
        }
    })

    // HTML
    gulp.watch(
        './src/**/*.html',
        watchOpts,
        gulp.series(html, (done) => {
            bs.reload()
            done()
        }),
    )

    gulp.watch(
        './templates/**/*.html',
        watchOpts,
        gulp.series(html, (done) => {
            bs.reload()
            done()
        }),
    )

    // Остальные ассеты
    gulp.watch('./src/js/**/*.js', watchOpts, scripts)
    gulp.watch('./src/fonts/**/*', watchOpts, fonts)
    gulp.watch('./src/images/**/*', watchOpts, images)
    gulp.watch('./src/icons/**/*.svg', watchOpts, sprite)
    gulp.watch('./src/videos/**/*.{mp4,webm,ogg}', watchOpts, videos)
} // ———————————————————————————————————————————————————————— //  Сборка
// ————————————————————————————————————————————————————————
export const build = gulp.series(
    clean,
    gulp.parallel(
        html,
        scripts,
        jsLibs,
        cssLibs,
        fonts,
        images,
        videos,
        sprite,
        (cb) => styles('./src/styles/**/*.scss'),
    ),
)

export default gulp.series(build, serve)
