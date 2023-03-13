const { src, dest, watch, series, parallel } = require('gulp');

//CSS Y SASS
const sass = require('gulp-sass')(require('sass'));//gulp-sass solamente compila la hoja de estilos
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

//imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif  =  require('gulp-avif');
const cssnano = require('cssnano');

function css (done) {
    //compilar sass
    //pasos: 1 - identificar archivo 2 - compilarla con pipe, 3 guardar el .css

    src('src/scss/app.scss') //identifico codigo principal
        .pipe( sourcemaps.init() ) //inicio sourcemaps 
        .pipe( sass() ) //compilo 
        .pipe( postcss([ autoprefixer(), cssnano() ])) //hacemos que nuestros CSS sean compatibles con otros navegadores, postcss toma diferetes plugins por eso se pueden poner en un arreglo y pasarles varias galerias
        .pipe( sourcemaps.write('.')) //donde grabo el sourcemap, con . se guarda junto al build
        .pipe( dest('build/css') ) //guardo en mi disco

    done();
}

function imagenes () {
    return src('src/img/**/*')
    .pipe( imagemin({ optimizationLevel: 3 }) )
    .pipe( dest ('build/img') );

}

function versionWebp() {
    return src('src/img/**/*.{png,jpg}', imagenes)
    .pipe(webp() )
    .pipe(dest ('build/img') )
}

function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}', imagenes)
    .pipe(avif( opciones ) )
    .pipe(dest ('build/img') )
}

//watch revisa todo el tiempo el archivo, entonces si ve cambios vuelve a llamar la funcion
function dev() {
    watch('src/scss/**/*.scss', css);
    //watch('src/scss/app.scss', css) uno es el archivo que revisa y el otro es la funcion que debe llamar
    watch('src/img/**/*', imagenes);
}

exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp, versionAvif, css, dev);

//series - se inicia una tarea, y hasta que finaliza inicia la siguiente
// parallel - todas inician al mismo tiempo





// const { src, dest, watch, series } = require('gulp');

// //CSS Y SASS
// const sass = require('gulp-sass')(require('sass'));
// const postcss = require('gulp-postcss');
// const autoprefixer = require('autoprefixer');

// function css (done) {
//     //compilar sass
//     //pasos: 1 - identificar archivo 2 - compilarla con pipe, 3 guardar el .css

//     src('src/scss/app.scss') //identifico
//         .pipe( sass() ) //compilo
//         .pipe( postcss([ autoprefixer()])) //hacemos que nuestros CSS sean compatibles con otros navegadores
//         .pipe( dest('build/css') ); //guardo en mi disco

//     done();
// }



// //watch revisa todo el tiempo el archivo, entonces si ve cambios vuelve a llamar la funcion
// function dev() {
//     watch('src/scss/**/*.scss', css);
// }

// exports.css = css;
// exports.dev = dev;
// exports.default = series(css, dev);

// //series - se inicia una tarea, y hasta que finaliza inicia la siguiente
// // parallel - todas inician al mismo tiempo