import * as config_default from './config.default';
import * as config_dev from './config.dev';

let config = Object.assign({}, config_default, config_dev);

export {config};
