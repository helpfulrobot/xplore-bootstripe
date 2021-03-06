var _               =   require('lodash'),
    path            =   require('path'),
    del             =   require('del'),
    run             =   require('run-sequence'),
    sync            =   require('browser-sync'),
    gulp            =   require('gulp'),
    sass            =   require('gulp-sass'),
    sourcemaps      =   require('gulp-sourcemaps'),
    autoprefixer    =   require('gulp-autoprefixer'),
    minify          =   require('gulp-minify-css'),
    uglify          =   require('gulp-uglify'),
    include         =   require('gulp-include'),
    concat          =   require('gulp-concat'),
    imagemin        =   require('gulp-imagemin'),
    watch           =   require('gulp-watch'),
    bower           =   require('gulp-bower'),
    svgtopng        =   require('gulp-svg2png');



var config = {
    // Source Config
    src_images          :    './src/images/',                       // Source Images Directory
    src_javascripts     :    './src/javascript/',                   // Source Javascripts Directory
    src_stylesheets     :    './src/sass/',                         // Source Styles Sheets Directory
    // Vendors
    vend_main_css       :    'vendor.css',
    vend_main_js        :    'vendor.js',
    // Destination Config
    dist_fonts          :    './fonts/',                            // Destination Fonts Directory
    dist_images         :    './images/',                           // Destination Images Directory
    dist_javascripts    :    './javascript/',                       // Destination Javascripts Directory
    dist_stylesheets    :    './css/',                              // Destination Styles Sheets Directory
    // Bower Config
    bower               :    './bower_components/',                 // Bower Components
    // Auto Prefixer
    autoprefix          :    'last 3 version',                      // Number of version Auto Prefixer to use
    // Server
    host                :    'localhost',                           // Webserverhost
    port                :    8888                                   // Webserver port
};

var files = {
    src_fonts       : [
        './src/fonts/**/*',
        config.bower + '/font-awesome/fonts/**/*'
    ],
    vend_stylesheets: [
        config.bower + '/font-awesome/css/font-awesome.css'
    ],
    vend_javascripts: [
        config.bower + '/jquery/dist/jquery.js',
        config.bower + '/bootstrap-sass-official/assets/javascripts/bootstrap.js',
        config.bower + '/gmaps/gmaps.js'
    ]
};

// Bower
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bower)); // Possibly rework this to install to './src/bower/' would need to update sass includePaths and add '.bowerrc' for gulp-bower
});

// Vendor Styles

gulp.task('vendor-styles', function () {
    return gulp.src(files.vend_stylesheets)
        .pipe(concat(config.vend_main_css))
        .pipe(minify())
        .pipe(gulp.dest(config.dist_stylesheets))
});

// Styles
gulp.task('styles', function () {
    return gulp.src(path.join(config.src_stylesheets, '/**/*.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: [config.bower],
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefix))
        .pipe(minify({rebase: false}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(config.dist_stylesheets))
        .pipe(sync.reload({stream:true}))
});

// Vendor Scripts

gulp.task('vendor-scripts', function () {
    return gulp.src(files.vend_javascripts)
        .pipe(concat(config.vend_main_js))
        .pipe(uglify())
        .pipe(gulp.dest(config.dist_javascripts))
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(path.join(config.src_javascripts, '/[^_]*.js'))
        .pipe(include())
        .pipe(uglify())
        .pipe(gulp.dest(config.dist_javascripts))
        .pipe(sync.reload({stream:true}))
});

// SVG to PNG
gulp.task('svgtopng', function () {
    gulp.src(path.join(config.src_images, '/**/*.svg'))
        .pipe(svgtopng())
        .pipe(gulp.dest(config.src_images));
});

// Image Optimization
gulp.task('images', ['svgtopng'], function() { // Always call 'svgtopng' before executing
    return gulp.src(path.join(config.src_images, '/**/*'))
        .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
        .pipe(gulp.dest(config.dist_images))
});

// Fonts
gulp.task('fonts', function () {
    return gulp.src(files.src_fonts)
        .pipe(gulp.dest(config.dist_fonts));
});

// Clean
gulp.task('clean', function() {
    del([config.dist_fonts, config.dist_images, config.dist_javascripts, config.dist_stylesheets])
});

// Watch
gulp.task('watch', function() {
    sync({
        proxy: config.host + ':' + config.port
    });
    gulp.watch(path.join(config.src_stylesheets, '/**/*.scss'), ['styles']);
    gulp.watch(path.join(config.src_javascripts, '/**/*.js'), ['scripts']);
});

// Prep
gulp.task('build', function (cb) {
    run('clean', 'bower', 'vendor-scripts', 'vendor-styles', 'styles', 'scripts', 'fonts', 'images', cb);
});

// Default
gulp.task('default', function(cb) {
    run('build', ['watch'], cb);
});