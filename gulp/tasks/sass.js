import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import rename from 'gulp-rename';

import concat from 'gulp-concat';
import cleanCss from 'gulp-clean-css'; //Сжатие css файла
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer'; // Добавляем префиксы
import groupCssMediaQueries from 'gulp-group-css-media-queries'; // Групировка медия запросов

const gulpDartSass = gulpSass(dartSass);

export const sass = () => {
  return (
    app.gulp
      .src(app.path.src.sass, { sourcemaps: app.isDev })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'SASS',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      .pipe(sourcemaps.init())
      .pipe(
        gulpDartSass({
          outputStyle: 'expanded',
        })
      )
      .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))

      .pipe(
        autoprefixer({
          grid: true,
          overrideBrowserslist: ['last 3 versions'],
          cascade: true,
        })
      )

      // Закомментировать  если нужен не сжатый файл
      .pipe(app.plugins.if(app.isBuild, cleanCss()))
      .pipe(
        rename({
          extname: '.min.css',
        })
      )
      .pipe(sourcemaps.write())
      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream())
  );
};

export const css = () => {
  return (
    app.gulp
      .src(app.path.src.css, { sourcemaps: app.isDev })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'CSS Vendors',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      .pipe(
        autoprefixer({
          grid: true,
          overrideBrowserslist: ['last 3 versions'],
          cascade: true,
        })
      )

      // Закомментировать  если нужен не сжатый файл
      .pipe(app.plugins.if(app.isBuild, cleanCss()))

      // Закомментировать  если нужено объединять файлы
      .pipe(concat('vendors.css'))

      .pipe(app.gulp.dest(app.path.build.css))
      .pipe(app.plugins.browsersync.stream())
  );
};

export const csslibs = () => {
  return (
    app.gulp
      .src(app.path.src.csslibs, { sourcemaps: app.isDev })
      .pipe(
        app.plugins.plumber(
          app.plugins.notify.onError({
            title: 'CSS Vendors',
            message: 'Error: <%= error.message %>',
          })
        )
      )
      .pipe(
        autoprefixer({
          grid: true,
          overrideBrowserslist: ['last 3 versions'],
          cascade: true,
        })
      )

      // Закомментировать  если нужен не сжатый файл
      .pipe(app.plugins.if(app.isBuild, cleanCss()))

      // Закомментировать  если нужено объединять файлы
      // .pipe(concat("vendors.css"))

      .pipe(app.gulp.dest(app.path.build.csslibs))
      .pipe(app.plugins.browsersync.stream())
  );
};
