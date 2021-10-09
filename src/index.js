#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

// Types (!)

const nodeExpress = require('./types/nodeExpress');
const reactvsb = require('./types/reactvsb');
const staticrn = require('./types/staticrn');

// Types (!)

const np = path.join(process.cwd(), 'now.json');
const alreadyConfiguration = fs.existsSync(np);

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
      choices: ['node-express', 'react', 'static', 'static-build', 'vue'],
    },
  ]);
  config.name = answers.name;
  switch (answers.projType) {
    case 'node-express':
      config = await nodeExpress(config);
      break;
    case 'static':
      config = await staticrn(config);
      break;
    case 'react':
      config = await reactvsb(config, 'build');
      break;
    case 'vue':
      config = await reactvsb(config);
      break;
    case 'static-build':
      config = await reactvsb(config);
      break;
    default:
      break;
  }
  const maz = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'specAlias',
      message: 'Would you like me to set any aliases?',
      default: false,
    },
    {
      type: 'text',
      name: 'alias',
      message: 'What is the alias you would like me to add? (example: alias1, alias2)',
      default: answers.name,
      when: a => a.specAlias,
    },
    {
      type: 'confirm',
      name: 'depNow',
      message: 'Would you like me to deploy? (Currently not working ⛔)',
      default: false,
    },
  ]);
  config.alias = maz.alias ? maz.alias.split(',').map(a => a.trim()) : undefined;
  fs.writeFileSync(np, JSON.stringify(config, null, 2), 'utf8');
  console.log(chalk.greenBright('NSH CLI: Finished. I have generated your files! 🚀'));
  process.exit(0);
  if (maz.depNow) {
    console.log(chalk.greenBright('NSH CLI: Deploying....'));
  }
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
