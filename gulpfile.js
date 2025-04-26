// основной модуль
import gulp from 'gulp';

// иморт путей
import { path } from './gulp/config/path.js';
import { plugins } from './gulp/config/plugins.js';
import 'dotenv/config';

if (!process.env.REQUIRED_SECRET) {
  console.error(
    '❌ REQUIRED_SECRET is not set in .env. Build or dev server stopped.'
  );
  process.exit(1);
}

// передаем значения в глобальную переменную
global.app = {
  isBuild: process.argv.includes('--build'),
  isDev: !process.argv.includes('--build'),
  path: path,
  gulp: gulp,
  plugins: plugins,
};

// импорт задач
import { reset } from './gulp/tasks/reset.js';
import { html } from './gulp/tasks/html.js';
import { server } from './gulp/tasks/server.js';
import { sass, css } from './gulp/tasks/sass.js';
import { js } from './gulp/tasks/js.js';
import { images } from './gulp/tasks/images.js';
import {
  woffWoff2,
  otfToTtf,
  ttfToWoff,
  fontsStyle,
} from './gulp/tasks/fonts.js';
import { svgSprive } from './gulp/tasks/svgSprive.js';

// Наблюдатель за изменениями в файлах
function watcher() {
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.sass, sass);
  gulp.watch(path.watch.css, css);
  gulp.watch(path.watch.js, js);
  gulp.watch(path.watch.images, images);
  gulp.watch(path.watch.svg, svgSprive);
}

// Последвательная обработка шрифтов
const fonts = gulp.series(woffWoff2, otfToTtf, ttfToWoff, fontsStyle);

// Css и sass файлы
const style = gulp.parallel(sass, css);

// Основные задачи
const mainTasks = gulp.series(
  fonts,
  svgSprive,
  gulp.parallel(html, style, js, images)
);

// Построение сценариев выполнения задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);

// Экспорт сценариев
export { dev };
export { build };

// Выполнение сценария по умолчанию
gulp.task('default', dev);
