import * as nodePath from 'path';

const rootFolder = nodePath.basename(nodePath.resolve());
const buildFolder = `./dist`;
const srcFolder = `./src`;

export const path = {
  build: {
    js: `${buildFolder}/js/`,
    css: `${buildFolder}/css/`,
    csslibs: `${buildFolder}/css/libs/`,
    html: `${buildFolder}/`,
    images: `${buildFolder}/assets/img/`,
    video: `${buildFolder}/assets/video/`,
    fonts: `${buildFolder}/assets/fonts/`,
  },
  src: {
    js: [`${srcFolder}/js/libs/*.js`, `!${srcFolder}/js/main.js`],
    images: `${srcFolder}/assets/img/**/*.{jpg,jpeg,png,gif,webp,cur,ico}`,
    video: `${srcFolder}/assets/video/**/*`,
    svg: `${srcFolder}/assets/img/**/*.svg`,
    sass: `${srcFolder}/sass/style.sass`,
    css: `${srcFolder}/css/*.css`,
    csslibs: `${srcFolder}/css/libs/*.css`,
    html: `${srcFolder}/*.html`,
    sprite: `${srcFolder}/assets/img/sprite/**/*.svg`,
  },
  watch: {
    js: `${srcFolder}/js/**/*.js`,
    sass: `${srcFolder}/sass/**/*.sass`,
    css: `${srcFolder}/css/*.css`,
    csslibs: `${srcFolder}/css/libs/*.css`,
    html: `${srcFolder}/**/*.html`,
    images: `${srcFolder}/assets/img/**/*.{jpg,jpeg,png,svg,gif,ico,webp,cur,ico}`,
    video: `${srcFolder}/assets/video/**/*`,
    svg: `${srcFolder}/assets/img/sprite/**/*.svg`,
  },
  clean: buildFolder,
  buildFolder: buildFolder,
  srcFolder: srcFolder,
  rootFolder: rootFolder,
  ftp: ``,
};
