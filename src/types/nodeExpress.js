const path = require('path');
const inquirer = require('inquirer');

const nodeExpressBC = {
  name: 'node-express-config',
  builds: [
    {
      src: 'src/index.js',
      use: '@now/node-server',
    },
  ],
  routes: [{ src: '/.*', dest: 'src/index.js' }],
};

async function nodeExpress(config) {
  let mainFP = 'src/index.js';
  try {
    // eslint-disable-next-line
    const packageJSON = require(path.join(process.cwd(), 'package.json'));
    mainFP = packageJSON.main;
    // eslint-disable-next-line
  } catch (error) {}

  const answers = await inquirer.prompt([
    {
      type: 'text',
      name: 'mainPath',
      message: 'Enter your main entry point!',
      default: mainFP,
    },
  ]);
  console.log(answers);
  nodeExpressBC.builds[0].src = answers.mainPath;
  nodeExpressBC.routes[0].dest = answers.mainPath;
  return {
    ...config,
    ...nodeExpressBC,
  };
}

module.exports = nodeExpress;
