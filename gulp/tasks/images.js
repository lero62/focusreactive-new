import imagemin from 'gulp-imagemin';
import changed from 'gulp-changed';

export const images = () => {
  return app.gulp
    .src(app.path.src.images)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'IMAGES',
          message: 'Error: <%= error.message %>',
        })
      )
    )
    .pipe(changed(app.path.build.images))

    .pipe(
      app.plugins.if(
        app.isBuild,
        imagemin({
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          interlaced: true,
          optimizationLevel: 3, // 0 to 7
        })
      )
    )
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.gulp.src(app.path.src.svg))
    .pipe(app.gulp.dest(app.path.build.images))
    .pipe(app.plugins.browsersync.stream());
};

export const video = () => {
  return app.gulp
    .src(app.path.src.video)
    .pipe(
      app.plugins.plumber(
        app.plugins.notify.onError({
          title: 'VIDEO',
          message: 'Error: <%= error.message %>',
        })
      )
    )

    .pipe(app.gulp.dest(app.path.build.video))
    .pipe(app.plugins.browsersync.stream());
};
