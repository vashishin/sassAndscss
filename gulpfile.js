var gulp        = require('gulp'); // главная переменная пректа. Инициальзация Gulp
var sass        = require('gulp-sass'); //Подключаем Sass пакет
var browserSync = require('browser-sync'); // Подключаем Browser Sync
var concat      = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
var uglify      = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS)
var cssnano     = require('gulp-cssnano'); // Подключаем пакет для минификации CSS
var rename      = require('gulp-rename'); // Подключаем библиотеку для переименования файлов
var del         = require('del'); // Подключаем библиотеку для удаления файлов и папок
var imagemin    = require('gulp-imagemin'); // Подключаем библиотеку для работы с изображениями
var pngquant    = require('imagemin-pngquant'); // Подключаем библиотеку для работы с png
var autoprefixer = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов

gulp.task('myfirstask', function() {
    // я просто комментарий
    var name = "Dmitriy";
    console.log("Привет меня зовут "+ name);
    console.log('Это Ваша первая инструкция (Task)');
});




gulp.task('sass', function(){ // Создаем таск Sass
    return gulp.src(['app/sass/**/*.sass','app/sass/**/*.scss']) // Берем источник
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('app/css')) // Выгружаем результата в папку app/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});






gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'app' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});
gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
            'app/libs/jquery/dist/jquery.min.js', // Берем jQuery
            'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js', // Берем Magnific Popup
            'app/libs/bootstrap/dist/js/bootstrap.min.js', // Берем bootstrap
            'app/libs/jquery-ui/ui/**/*.js' // Берем jquery ui
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('app/js')); // Выгружаем в папку app/js
});



gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('app/css')); // Выгружаем в папку app/css
});


gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/sass/**/*', ['sass']); // Наблюдение за файлами в папке sass
    gulp.watch('app/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('app/js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});









gulp.task('clear', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});



gulp.task('img', function() {
    return gulp.src('app/img/**/*') // Берем все изображения из app
        .pipe(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img')); // Выгружаем на продакшен
});


gulp.task('buildup', ['clear','img', 'sass', 'scripts'], function() {

    var buildCss = gulp.src([ // Переносим библиотеки в продакшен
            'app/css/main.css',
            'app/css/libs.min.css'
        ])
        .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*') // Переносим шрифты в продакшен
        .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*') // Переносим скрипты в продакшен
        .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html') // Переносим HTML в продакшен
        .pipe(gulp.dest('dist'));

});

