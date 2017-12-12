'use strict'

const debug = require('debug')('platziverse:db:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')

const prompt = inquirer.createPromptModule()

async function setup () {
  let ask = true
  let anwser = null

  console.log(process.argv[2])

  if (process.argv[2] === '--yes' || process.argv[2] === '-y') ask = false

  if (ask) {
    anwser = await prompt([
      {
        type: 'confirm',
        name: 'setup',
        message: 'This will destroy the database, are you sure?'
      }
    ])
  }

  if (anwser && !anwser.setup) return console.log('Nothing happens :)')

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'platzi',
    password: process.env.DB_PASS || 'platzi',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[Fatal error]')} ${err.message}`)
  console.error(err.stack)

  process.exit(1)
}

setup()
