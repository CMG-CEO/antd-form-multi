const gulp = require('gulp');
const babel = require('gulp-babel');
const merge = require('merge2');

// 文件目录地址
const jsSrc = 'src/components/**/*.js';
const lessSrc = 'src/components/**/*.less';
const libPath = 'lib';
const esPath = 'es';
const stylePath = 'style';

// bebel配置
const babelConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { ie: 11, edge: 12, chrome: 62, firefox: 56 },
        debug: false,
        modules: false,
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
    '@babel/preset-flow',
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
  ],
};

// babel es配置
const babelEsConfig = {
  presets: ['@babel/preset-react', '@babel/preset-flow'],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
      },
    ],
  ],
};

/* babel */
function babelProject() {
  return merge([
    gulp.src(jsSrc).pipe(babel(babelConfig)).pipe(gulp.dest(libPath)),
    gulp.src(lessSrc).pipe(gulp.dest(libPath)),
  ]);
}

/* babel es */
function babelEsProject() {
  return merge([
    gulp.src(jsSrc).pipe(babel(babelEsConfig)).pipe(gulp.dest(esPath)),
    gulp.src(lessSrc).pipe(gulp.dest(esPath)),
  ]);
}

/* less */
function lessProject() {
  return gulp.src(lessSrc).pipe(gulp.dest(stylePath));
}

exports.default = gulp.parallel(babelProject, babelEsProject);
