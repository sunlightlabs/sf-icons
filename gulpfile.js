var gulp = require('gulp'),
    help = require('gulp-task-listing'),
    clean = require('gulp-clean'),
    srcreplace = require('gulp-replace'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    gzip = require('gulp-gzip'),
    imagemin = require('gulp-imagemin'),
    shell = require('gulp-shell'),
    git = require('gulp-git'),
    s3 = require('gulp-s3'),
    fs = require('fs'),
    connect = require('gulp-connect'),
    version = require('./package.json').version,
    aws = JSON.parse(fs.readFileSync('./aws.json')),
    paths = {
      js: 'src/js/*.js',
      css: 'src/css/*.scss',
      img: 'src/img/**/*',
      fonts: 'src/fonts/*.svg',
      build: {
        all: 'build/**/*',
        css: 'build/css/**/*.scss',
        cssgz: 'build/css/**/*.gz',
        js: 'build/js/**/*.js',
        jsgz: 'build/js/**/*.gz',
        img: 'build/img/**/*',
        fonts: 'build/fonts/**/*',
        styleguide: 'build/styleguide/**/*'
      },
      dist: {
        all: 'dist/**/*',
        css: 'dist/css/**/*.css',
        cssgz: 'dist/css/**/*.gz',
        js: 'dist/js/**/*.js',
        jsgz: 'dist/js/**/*.gz',
        img: 'dist/img/**/*',
        fonts: 'dist/fonts/**/*'
      }
    };

gulp.task('update-bower-version', function(){
  var bowerpkg = require('./bower.json');
  bowerpkg.version = version;
  fs.writeSync(fs.openSync('./bower.json', 'w+'), JSON.stringify(bowerpkg, null, '  '));
});

gulp.task('build-clean', function(){
  return gulp.src(['dist', 'build', '.fontcustom-manifest.json'])
    .pipe(clean());
});

gulp.task('build-js', function(){
  return gulp.src(paths.js)
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
      .pipe(gulp.dest('dist/js'))
    .pipe(gzip())
      .pipe(gulp.dest('dist/js'));
});

gulp.task('build-css', ['compile-fonts'], function(){
  return gulp.src(paths.build.css)
    .pipe(rename({basename: 'sf-icons'}))
    .pipe(sass())
    .pipe(prefix("last 2 version", "> 1%", "ie 8", "ie 7"))
      .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(sass({outputStyle: 'compressed'}))
      .pipe(gulp.dest('dist/css'))
    .pipe(gzip())
      .pipe(gulp.dest('dist/css'));
});

gulp.task('build-img', function(){
  return gulp.src(paths.img)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('compile-fonts', function(){
    return gulp.src(paths.fonts)
    .pipe(shell([
      'fontcustom compile'
    ]));
});

gulp.task('build-fonts', ['compile-fonts'], function(){
  return gulp.src(paths.build.fonts)
    .pipe(rename({basename: 'sf-icons'}))
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build-styleguide', ['build-fonts', 'build-css'], function(){
  return gulp.src(paths.build.styleguide)
    .pipe(srcreplace(/fontcustom_[0-9a-f]*/g, 'sf-icons'))
      .pipe(gulp.dest('dist/styleguide'))
    .pipe(srcreplace(/\.\.\/fonts/g, 'fonts'))
    .pipe(rename({basename: 'index'}))
      .pipe(gulp.dest('example'));
});

gulp.task('tag', function(){
  git.tag('v' + version, 'Release v' + version);
});

gulp.task('publish', function(){
  var s3Version = parseFloat(version).toString();
  gulp.src(paths.dist.img, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'sf-icons/' + s3Version + '/img/',
      delay: 1000,
    }));
  gulp.src(paths.dist.css, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'sf-icons/' + s3Version + '/css/',
      delay: 1000,
    }));
  gulp.src(paths.dist.cssgz, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'sf-icons/' + s3Version + '/css/',
      delay: 1000,
      headers: {
        "Content-Disposition": "inline",
        "Content-Encoding": "gzip",
        "Content-Type": "text/css"
      }
    }));
  gulp.src(paths.dist.js, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'sf-icons/' + s3Version + '/js/',
      delay: 1000,
    }));
  gulp.src(paths.dist.jsgz, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'sf-icons/' + s3Version + '/js/',
      delay: 1000,
      headers: {
        "Content-Disposition": "inline",
        "Content-Encoding": "gzip",
        "Content-Type": "text/javascript"
      }
    }));
  gulp.src(paths.dist.fonts, {read: false})
    .pipe(s3(aws, {
      uploadPath: 'sf-icons/' + s3Version + '/fonts/',
      delay: 1000,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    }));
});

gulp.task('connect', connect.server({
  root: ['example'],
  port: 4000
}));

gulp.task('watch', ['connect'], function(){
  gulp.watch(paths.js, ['build-fonts']).on('change', function(){
    gulp.run('build-fonts');
  });
  gulp.watch(paths.js, ['build-js']).on('change', function(){
    gulp.run('build-js');
  });
  gulp.watch(paths.css, ['build-css']).on('change', function(){
    gulp.run('build-css');
  });
  gulp.watch(paths.img, ['build-img']).on('change', function(){
    gulp.run('build-img');
  });
});

gulp.task('help', help);
gulp.task('setup', ['update-bower-version', 'build-clean']);
gulp.task('build', ['build-fonts', 'build-js', 'build-css', 'build-img', 'build-styleguide']);
gulp.task('default', ['setup'], function(){
  gulp.run('build');
});
