import * as gulp from 'gulp';
import {join} from 'path';
import * as gulpLoadPlugins from 'gulp-load-plugins';
const plugins = <any>gulpLoadPlugins();
import {APP_SRC, PROD_DEST} from '../../config';

export = () => {
  return gulp.src([
      join(APP_SRC, 'app/shared/img/**/*')
    ])
  	.pipe(plugins.imagemin({
  		progressive: true
  	}))
    .pipe(gulp.dest(join(PROD_DEST, 'app/shared/img')));
};
