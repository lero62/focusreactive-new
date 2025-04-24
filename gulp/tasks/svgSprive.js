import svgmin from 'gulp-svgmin';
import replace from 'gulp-replace';
import cheerio from 'gulp-cheerio';
import svgSprite from 'gulp-svg-sprite';

export const svgSprive = () => {
  return app.gulp
    .src(app.path.src.sprite)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'SvgSptire',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]').removeAttr('fill');
          $('[stroke]').removeAttr('stroke');
          $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(replace('&gt;', '>'))
    .pipe(
      svgSprite({
        shape: {
          transform: [],
        },
        mode: {
          symbol: {
            sprite: '../sprite.svg',
          },
        },
      })
    )
    .pipe(app.gulp.dest(`src/assets/img`));
};
