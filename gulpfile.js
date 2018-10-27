// gulp-rev для добавления версии к файлу
// gulp-if - для добавления условий
// rev-replace - для добавления хешированного css в html через manifest

const gulp = require('gulp'),
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    htmlmin = require('gulp-htmlmin'),
    babel  = require('gulp-babel')

// Генерация less файлов в css
gulp.task('less', function(){
    return gulp.src(['src/less/*.less', '!src/less/vars.less'])
    .pipe(less())
    .pipe(gulp.dest('src/css'));
});

// Минификация index.html
gulp.task('minifyIndex', function(){
    return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'));
});

// Минификация шаблонов
gulp.task('minifyTemplates', function(){
    return gulp.src('src/templates/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/templates'));
});

// Минификация директив
gulp.task('minifyDirectives', function(){
    return gulp.src('src/templates/directives/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build/templates/directives'));
});

// Минификация СSS
gulp.task('minifyCSS', function(){
    return gulp.src('src/css/*.css')
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/css'));
});

// Минификация JS
 gulp.task('minifyScripts', function(){
    return gulp.src('src/js/scripts/*.js')
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('build/js/scripts'));
 });

 // Минификация контроллеров
 gulp.task('minifyControllers', function(){
    return gulp.src('src/js/controllers/*.js')
    .pipe(babel({presets: ['es2015']}))
    .pipe(uglify({ mangle: false }))
    .pipe(gulp.dest('build/js/controllers'));
 });

// Вотчеры измений файлов
// gulp.watch('src/less/*.less', ['less', 'minifyCSS']);
// gulp.watch('src/less/*.less', ['minifyScripts']);

gulp.task('default', ['less','minifyCSS','minifyIndex','minifyTemplates','minifyDirectives','minifyScripts','minifyControllers']);