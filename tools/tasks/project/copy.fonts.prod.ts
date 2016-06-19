import * as gulp from 'gulp';
import {join} from 'path';
import {APP_SRC, PROD_DEST} from '../../config';

export = () => {
  return gulp.src([
      'node_modules/bootstrap/dist/fonts/**/*'
    ])
    .pipe(gulp.dest(join(PROD_DEST, 'fonts')));
};
