var gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  rename = require('gulp-rename'),
  less = require('gulp-less'),
  minifycss = require('gulp-minify-css'),
  autoprefixer = require('gulp-autoprefixer'),
  jade = require('gulp-jade'),
  bower = require('gulp-bower'),
  gutil = require('gulp-util'),
  jshint = require('gulp-jshint'),
  jshintStylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  cache = require('gulp-cache'),
  path = require('path'),
  browserify = require('browserify'),
  ngAnnotate = require('browserify-ngannotate'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  sourcemaps = require('gulp-sourcemaps'),
  CacheBuster = require('gulp-cachebust'),
  imagemin = require('gulp-imagemin'),
  browserSync = require('browser-sync'),
  nodemon = require('gulp-nodemon'),
  karma = require('gulp-karma'),
  protractor = require('gulp-protractor').protractor,
  cachebust = new CacheBuster(),
  paths = {
    public: 'public/**',
    jade: ['!app/includes/*.jade', 'app/**/*.jade'],
    scripts: 'app/scripts/**/*.js',
    backendScripts: 'server/**/*.+(js|coffee)',
    images: 'app/images/**/*',
    staticFiles: [
      '!app/**/*.+(less|css|js|jade)',
      '!app/images/**/*',
      'app/**/*.*'
    ],
    unitTests: [
      'public/vendor/angular/angular.min.js',
      'public/vendor/angular-ui-router/release/angular-ui-router.min.js',
      'public/vendor/angular-resource/angular-resource.min.js',
      'public/vendor/angular-mocks/angular-mocks.js',
      'public/js/application.js',
      'tests/unit/*.spec.js'
    ],
    libTests: ['public/vendor/tests/**/*.js'],
    styles: ['app/styles/*.+(less|css)', 'app/styles/layouts/*.+(less|css)',  'app/styles/base/*.+(less|css)']
  };

gulp.task('test', function() {
  // Be sure to return the stream
  return gulp.src(paths.unitTests)
    .pipe(karma({
      configFile: __dirname + '/karma.conf.js',
      // autoWatch: false,
      singleRun: true,
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('e2e', function(done) {
  var args = ['--baseUrl', 'http://127.0.0.1:3000'];
  gulp.src(['./tests/e2e/*.js'])
    .pipe(protractor({
      configFile: 'protractor.conf.js',
      args: args
    }))
    .on('error', function(e) {
      throw e;
    });
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('public/vendor/'));
});

gulp.task('clean-styles', function() {
  return gulp.src('public/css/**/*.+(css|map)', {
      read: false
    })
    .pipe(require('gulp-clean')());
});

gulp.task('clean-scripts', function() {
  return gulp.src('public/js/*.+(js|map)', {
      read: false
    })
    .pipe(require('gulp-clean')());
});

gulp.task('images', function() {
  gulp.src(paths.images)
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./public/images/'));
});

gulp.task('static-files', function() {
  return gulp.src(paths.staticFiles)
    .pipe(gulp.dest('public/'));
});

gulp.task('jade', function() {
  gulp.src(paths.jade)
    .pipe(jade())
    .pipe(gulp.dest('./public/'));
});

gulp.task('less', function() {
  gulp.src(paths.styles)
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/css/'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(minifycss())
    .pipe(cachebust.resources())
    .pipe(sourcemaps.write('./maps'))
    .pipe(rename('application.css'))
    .pipe(gulp.dest('public/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('lint', function() {
  return gulp.src(['./app/**/*.js', './index.js', './server/**/*.js', './tests/**/*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(jshintStylish))
    .pipe(jshint.reporter('fail'))
    .pipe(plumber({
      errorHandler: function(error) {
        console.log(error.message);
        this.emit('end');
      }
    }));
});

gulp.task('browserify', function() {
  var b = browserify({
    entries: './app/scripts/application.js',
    debug: true,
    paths: ['./app/js/controllers', './app/js/factories', './app/js/services', './app/js/directives', './app/js/filters'],
    transform: [ngAnnotate]
  });

  return b.bundle()
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(cachebust.resources())
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./maps'))
    // vinyl-source-stream makes the bundle compatible with gulp
    .pipe(rename('application.js'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('browser-sync', function() {
  browserSync.init(null, {
    proxy: 'http://localhost:3333',
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 3000,
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload({
    stream: true
  });
});

gulp.task('nodemon', function() {
  var started = false;
  nodemon({
      script: 'index.js',
      ext: 'js',
      ignore: ['public/', 'node_modules/']
    })
    .on('change', ['lint'])
    .on('restart', function() {
      console.log('>> node restart');
    })
    .on('start', function(cb) {
      // to avoid nodemon being started multiple times
      // thanks @matthisk
      if (!started) {
        cb();
        started = true;
      }
    });;
});

gulp.task('watch', function() {
  gulp.watch(paths.jade, ['jade'], browserSync.reload);
  gulp.watch(paths.styles, ['less'], browserSync.reload);
  gulp.watch(paths.scripts, ['browserify'], browserSync.reload);
  gulp.watch(['./gulpfile.js'], ['build']);
});

// Default configs
gulp.task('build', ['clean', 'jade', 'less', 'static-files', 'images', 'browserify'], browserSync.reload);
gulp.task('default', ['nodemon', 'watch', 'build']);
gulp.task('production', ['nodemon', 'build']);

// Helpers
gulp.task('clean', ['clean-scripts', 'clean-styles']);
gulp.task('sync', ['default', 'browser-sync']);

// For continuous intergration tools
gulp.task('ci', ['nodemon', 'browser-sync']);

// For heroku
gulp.task('heroku:production', ['bower', 'build']);
gulp.task('heroku:staging', ['bower', 'build']);
