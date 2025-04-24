import fileInclude from 'gulp-file-include';
import htmlbeautify from 'gulp-html-beautify';
import nunjucksRender from 'gulp-nunjucks-render';

export const html = () => {
  return app.gulp
    .src(app.path.src.html)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'HTML',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(fileInclude())
    .pipe(
      nunjucksRender({
        path: ['src'], // String or Array
      })
    )
    .pipe(
      htmlbeautify({
        indentSize: 3,
        indent_with_tabs: true,
        preserve_newlines: true,
        max_preserve_newlines: 1,
      })
    )

    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browsersync.stream());
};
