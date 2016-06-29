import * as gulp from 'gulp';
import {PROD_DEST} from '../../config';
const packageInfo = require('../../../package.json');

export = () => {
  return gulp.src(PROD_DEST + '/**/*')
    .pipe(gulp.dest('target/META-INF/resources/webjars/' + packageInfo.name + '/' + packageInfo.version));
}
