const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

const reactBC = {
  name: 'react-v-sb-config',
  builds: [
    {
      src: 'package.json',
      use: '@now/static-build',
      config: { distDir: 'build' },
    },
  ],
  routes: [{ handle: 'filesystem' }, { src: '/.*', dest: 'index.html' }],
};

async function reactvsb(config, defaultBuild = 'dist') {
  let packageJSON;
  let packageJSONP;
  let scriptBuilder = '';
  try {
    packageJSONP = path.join(process.cwd(), 'package.json');
    // eslint-disable-next-line
    packageJSON = require(packageJSONP);
    scriptBuilder = (packageJSON.scripts || {})['now-build'] || 'npm run build';
  } catch (error) {
    console.error(chalk.redBright('ERROR: I could not find a package.json file (!)'));
    process.exit(1);
  }
  const answers = await inquirer.prompt([
    {
      type: 'text',
      name: 'buildDir',
      message: 'Enter the folder you would like to build to?',
      default: defaultBuild,
    },
    {
      type: 'confirm',
      name: 'nowBuildSCCon',
      message: 'Should I add/overwrite a now-build script in your package.json file?',
      default: true,
    },
    {
      type: 'text',
      name: 'scriptBuilder',
      message: 'What is the build command?',
      default: scriptBuilder,
      when: a => a.nowBuildSCCon,
    },
  ]);

  if (answers.nowBuildSCCon) {
    packageJSON.scripts = packageJSON.scripts || {};
    packageJSON.scripts['now-build'] = answers.scriptBuilder;
    fs.writeFileSync(packageJSONP, JSON.stringify(packageJSON, null, 2), 'utf8');
  }

  reactBC.builds[0].config.distDir = answers.buildDir;
  return {
    ...config,
    ...reactBC,
  };
}

module.exports = reactvsb;
