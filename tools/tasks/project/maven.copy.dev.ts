import * as gulp from 'gulp';
import {DEV_DEST} from '../../config';
const packageInfo = require('../../../package.json');

export = () => {
  return gulp.src(DEV_DEST + '/**/*')
    .pipe(gulp.dest('target/META-INF/resources/webjars/' + packageInfo.name + '/' + packageInfo.version));
}
