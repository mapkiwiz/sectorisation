import * as gulp from 'gulp';
import * as vfs from 'vinyl-fs';
import {TMP_DIR} from '../../config';

export = () => {
  return gulp.src('node_modules')
  .pipe(vfs.symlink(TMP_DIR));
}