const path = require('path');
const inquirer = require('inquirer');

const staticBC = {
  name: 'static-config',
  builds: [{ src: '*', use: '@now/static' }],
};

async function staticrn(config) {
  const answers = await inquirer.prompt([
    {
      type: 'text',
      name: 'publicDir',
      message: 'Enter the folder you would like to deploy?',
      default: '.',
    },
  ]);
  console.log(answers);
  staticBC.builds[0].src = path.join(answers.publicDir, '*');
  return {
    ...config,
    ...staticBC,
  };
}

module.exports = staticrn;
