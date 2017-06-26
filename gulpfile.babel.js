import gulp from 'gulp';
import fs from 'fs';
import path from 'path';
import eslint from 'gulp-eslint';
import babel from 'gulp-babel';
import rimraf from 'gulp-rimraf';
import depcheck from 'gulp-depcheck';

const getSrcFolders = srcpath =>
  fs.readdirSync(srcpath)
    .filter(file =>
      fs.lstatSync(path.join(srcpath, file)).isDirectory());

const allFiles = [
  '*.js',
  'src/*.js',
  ...getSrcFolders('src').map(folder => `src/${folder}/*.js`),
  'test/*.js',
  ...getSrcFolders('test').map(folder => `test/${folder}/*.js`)
];

gulp.task('lint', () => gulp.src(allFiles)
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
  .pipe(eslint())
  // eslint.format() outputs the lint results to the console.
  // Alternatively use eslint.formatEach() (see Docs).
  .pipe(eslint.format())
  // To have the process exit with an error code (1) on
  // lint error, return the stream and pipe to failAfterError last.
  .pipe(eslint.failAfterError()));

// clean folder task
gulp.task('clean', () => gulp.src(['dist'], { read: false })
  .pipe(rimraf({
    force: true
  })));

// copy package.json to dist folder
gulp.task('copy', ['clean'], () => {
  gulp.src(['package.json']).pipe(gulp.dest('dist'));
  // gulp.src(['src/templates/*.jst']).pipe(gulp.dest('dist/templates'));
});

// check unused dependencies
gulp.task('depcheck', depcheck());

// clean and build
gulp.task('build', ['copy', 'depcheck'], () => {
  const presets = { presets: ['es2015'] };
  gulp.src(['src/*.js']).pipe(babel(presets)).pipe(gulp.dest('dist'));
  getSrcFolders('src').forEach((folder) => {
    gulp.src([`src/${folder}/*.js`]).pipe(babel(presets)).pipe(gulp.dest(`dist/${folder}`));
  });
});

// watch files changes
gulp.task('watch', () => {
  gulp.watch(allFiles, ['lint']);
});
