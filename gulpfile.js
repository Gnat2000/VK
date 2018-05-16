"use strict";

const gulp = require("gulp"),
    fs = require("fs"),
    gulpif = require("gulp-if"),
    del = require("del"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    browserSync = require("browser-sync").create(),
    reload = browserSync.reload,
    uglify = require("gulp-uglify"),
    cleanCSS = require("gulp-clean-css"),
    csscomb = require("gulp-csscomb"),
    useref = require("gulp-useref"),
    lazypipe = require('lazypipe'),
    wiredep = require("wiredep").stream,
    sourcemaps = require("gulp-sourcemaps"),
    stylus = require("gulp-stylus"),
    nib = require("nib"),
    sftp = require("gulp-sftp"),
    pug = require("gulp-pug"),
    size = require("gulp-size"),
    changed = require("gulp-changed"),
    browserify = require('browserify'),
    babelify   = require('babelify'),
    imagemin = require("gulp-imagemin"),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    prettify = require("gulp-prettify");

// Запуск BROWSERSYNC
gulp.task("server", ["pug", "stylus"], function () {
    browserSync.init({
        server: "app",
    });
});

//Добавляет библиотеки BOWER в Pug(Jade)
gulp.task("bower_components", function () {
    return gulp.src("app/templates/common/*.pug")
        .pipe(wiredep({
            ignorePath: /^(\.\.\/)*\.\./
        }))
        .pipe(gulp.dest("app/templates/common"));
});

// Компиляция Pug(Jade) файлов в HTML
gulp.task("pug", function () {
    // const YOUR_LOCALS = 'app/content.json';

    return gulp.src("app/templates/pages/*.pug")
        // .pipe(data(function(file) {
        //     return JSON.parse(fs.readFileSync(YOUR_LOCALS));
        // }))
        .pipe(changed("app/"))
        // Не прерывает поток, выводит ошибку
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(pug())
        .pipe(prettify({indent_size: 4}))
        .pipe(gulp.dest("app/"))
        .pipe(browserSync.stream(({once: true})));
});

// Компиляция stylus файлов в CSS
gulp.task("stylus", function () {
    return gulp.src("app/stylus/**/main.styl")
        .pipe(changed("app/css"))
        // Не прерывает поток, выводит ошибку
        .pipe(plumber({
            errorHandler: notify.onError("Error: <%= error.message %>")
        }))
        .pipe(sourcemaps.init())
        .pipe(stylus({use: nib(), import: ["nib"]}))
        // Приводит к единообразному виду CSS
        .pipe(csscomb())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream(({once: true})));
});

gulp.task('js', function(){
    const b = browserify({
        entries: 'app/js/common/entry.js',
        debug: true,
        transform: [babelify.configure({
            presets: ['es2015']
        })]
    });
        b.bundle()
        .pipe(fs.createWriteStream("app/js/index.js"))
        // .pipe(gulp.dest("app/js"))
        // .pipe(browserSync.stream(({once: true})));
});

// Слежка за файлами
gulp.task("watch", function () {
    gulp.watch("app/templates/**/*.*", ["pug"]);
    gulp.watch("app/js/**/*.*", ["js"]);
    gulp.watch("app/stylus/**/*.*", ["stylus"]);
    gulp.watch("bower_components.json", ["bower_components"]);
    gulp.watch(["app/js/index.js", "app/css/**/*.css", "app/**/*.html", "app/content.json"]).on("change", reload);
});

gulp.task("default", ["server", "watch"]);

// Очищает папку "public"
gulp.task("clean", function () {
    return del("public/**/*");
});

// Собирает в папку "public" картинки
// Images optimization and copy
gulp.task("copy:img", function() {
    return gulp.src("app/img/**/*")
        .pipe(cache(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imageminJpegRecompress({
                loops: 5,
                min: 65,
                max: 70,
                quality:'medium'
            }),
            // imagemin.svgo({removeViewBox: false, cleanupAttrs: false, removeElementsByAttr: false, removeAttrs: false}),
            imagemin.optipng({optimizationLevel: 3}),
        ],{
            use: pngquant({quality: '65-70', speed: 5}),
            verbose: true
        })))
        .pipe(gulp.dest("public/img"));
});

// Clearing the cache
gulp.task('clear', ["copy:img"], function (done) {
    return cache.clearAll(done);
});


// Собирает в папку "public" шрифты
gulp.task("copy:fonts", function () {
    gulp.src("app/fonts/*.*")
        .pipe(gulp.dest("public/fonts/"));
});

// Собирает в папку "public" остальные файлы(например favicon.ico)
gulp.task("extras", function () {
    return gulp.src(["app/*.*", "!app/*.html"])
        .pipe(gulp.dest("public"));
});

// Сборка и минификация всех js, css в папку public
gulp.task("useref", function () {
    return gulp.src("app/*.html")
    //Собирает все js и css в файлы main and vendor
        .pipe(useref({}, lazypipe().pipe(sourcemaps.init, { loadMaps: true })))
        //Минифицирует js
        .pipe(gulpif("*.js", uglify()))
        //Минифицирует css
        .pipe(gulpif("*.css", cleanCSS({compatibility: "ie8"})))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest("public"));
});

// Сборка папки public и вывод размера этой папки
gulp.task("public", ["useref", "copy:img", "clear", "copy:fonts", "extras"], function () {
    return gulp.src("public/**/*")
        .pipe(size({title: "build"}));
});

// Сборка папки public только после ее очистки и компиляции Pug(Jade) Stylus файлов
gulp.task("build", ["clean", "pug", "stylus"], function () {
    gulp.start("public");
});

// Отправка папки public на сервер
gulp.task("sftp", function () {
    return gulp.src("public/**/*")
        .pipe(sftp({
            host: "website.com",
            user: "johndoe",
            pass: "1234",
            remotePath: "httn/hhh/"
        }));
});
