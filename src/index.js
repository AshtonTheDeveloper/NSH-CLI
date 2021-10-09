const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Types (!)

const nodeExpress = require('./types/nodeExpress');

// Types (!)

const alreadyConfiguration = fs.existsSync('now.json');

// Functions (!)

async function newConfigTrue() {
  let config = {
    version: 2,
  };

  const answers = await inquirer.prompt([
    {
      type: 'text',
      name: 'projName',
      message: 'Enter your project name',
      default: path.basename(process.cwd()),
    },
    {
      type: 'list',
      name: 'projType',
      message: 'What type of project are you creating?',
      choices: ['node-express', 'react', 'static', 'vue'],
    },
  ]);
  config.name = answers.name;
  switch (answers.projType) {
    case 'node-express':
      config = await nodeExpress(config);
      break;
  }
  console.log(config);
}

function newConfigFalse() {
  console.log(
    chalk.redBright(
      'I will now exit since I am unable to overwrite the current now.json file... (Quiting)',
    ),
  );
}

// Functions (!)

if (alreadyConfiguration) {
  inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'configAlready',
        message: 'It looks like you have a now.json already, should I override it?',
        default: false,
      },
    ])
    .then(answers => {
      if (answers.configAlready) {
        newConfigTrue();
      } else {
        newConfigFalse();
      }
    });
} else {
  newConfigTrue();
}
