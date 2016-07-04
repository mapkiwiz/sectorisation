import {join} from 'path';

class Config {
  DIST_DIR = "dist";
  DEV_DEST = "dist/dev";
  PROD_DEST = "dist/prod";
  TMP_DIR = "dist/tmp";
  TOOLS_DIR = "tools";
  SEED_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'seed');
  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');
};

var config = new Config();

export = config;
