import * as gulp from 'gulp';
const webpack = require('webpack-stream');
const config = require('../../../webpack.config');

export = () => {
  return gulp.src('src/client/entries/*.js')
    .pipe(webpack(config))
    .pipe(gulp.dest('dist/dev'));
};
