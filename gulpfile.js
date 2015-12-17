require('./environment');

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
  mocha = require('gulp-mocha'),
  protractor = require('gulp-protractor').protractor,
  cachebust = new CacheBuster(),
  coveralls = require('gulp-coveralls'),
  paths = {
    public: 'public/**',
    images: 'app/images/**/*',
    jade: ['!app/includes/*.jade', 'app/**/*.jade'],
    styles: ['app/styles/*.+(less|css)', 'app/styles/layouts/*.+(less|css)', 'app/styles/base/*.+(less|css)'],
    staticFiles: [
      '!app/**/*.+(less|css|js|jade)',
      '!app/images/**/*',
      'app/**/*.*'
    ],
    scripts: 'app/scripts/**/*.js',
    backendScripts: 'server/**/*.+(js|coffee)',
    unitTests: [],
    serverTests: ['tests/resources/**/*.spec.js'],
    libTests: ['public/lib/tests/**/*.js']
  };

gulp.task('cover', function() {
  return gulp.src('coverage/lcov/lcov.info')
    .pipe(coveralls());
});

gulp.task('test:fend', function() {
  // Be sure to return the stream
  return gulp.src(paths.unitTests)
    .pipe(karma({
      configFile: __dirname + '/karma.conf.js',
      action: 'run'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    });
});

gulp.task('test:bend', function() {
  return gulp.src(paths.serverTests)
    .pipe(mocha({
      reporter: 'spec'
    }))
    .once('error', function() {
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
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
  return gulp.src('public/js/**/*.+(js|map)', {
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
    .pipe(less())
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('public/css/'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.init())
    .pipe(minifycss())
    .pipe(cachebust.resources())
    .pipe(rename('application.min.css'))
    .pipe(gulp.dest('public/css/'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('lint', function() {
  return gulp.src(['./app/scripts/**/*.js', './index.js', './server/**/*.js', './tests/**/*.js'])
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
    paths: [
      './app/scripts/controllers/*.js',
      './app/scripts/decorators/*.js',
      './app/scripts/services/*.js',
      './app/scripts/directives/*.js',
      './app/scripts/filters/*.js',
      './app/scripts/routes/*.js',
      './app/scripts/*.js'
    ],
    transform: [ngAnnotate]
  });

  return b.bundle()
    .pipe(source('application.js'))
    .pipe(buffer())
    .pipe(cachebust.resources())
    .pipe(uglify())
    .on('error', gutil.log)
    // vinyl-source-stream makes the bundle compatible with gulp
    .pipe(rename('application.js'))
    .pipe(sourcemaps.init({
      loadMaps: true
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./public/js/'));
});

gulp.task('browser-sync', function() {
  browserSync.init(null, {
    proxy: 'http://localhost:3000',
    files: ['public/**/*.*'],
    browser: 'google chrome',
    port: 3550,
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
      console.log('-->> application restart!');
    })
    .on('start', function(cb) {
      // to avoid nodemon being started multiple times
      // thanks @matthisk
      if (!started) {
        cb();
        started = true;
      }
    });
});

gulp.task('watch', function() {
  gulp.watch(paths.jade, ['jade'], browserSync.reload);
  gulp.watch(paths.styles, ['less'], browserSync.reload);
  gulp.watch(paths.scripts, ['browserify'], browserSync.reload);
  gulp.watch(['./gulpfile.js'], ['build', 'watch'], browserSync.reload);
});

// Helpers
gulp.task('clean', ['clean-scripts', 'clean-styles']);
// Default configs
gulp.task('build', ['jade', 'less', 'static-files', 'images', 'browserify', 'bower']);
gulp.task('sync', ['clean', 'default', 'browser-sync']);
// For heroku
gulp.task('heroku:production', ['build']);
gulp.task('heroku:staging', ['build']);
gulp.task('default', ['nodemon', 'watch', 'build']);
gulp.task('production', ['nodemon', 'build']);
// Tests
gulp.task('test', ['test:fend', 'test:bend' /*, 'e2e' */ ]);
