import chalk from 'chalk'

export function handleErrors (error) {
  if (error.response) {
    console.log(chalk.bgRed('Error,', error.response.msg))
    return
  }

  console.log(chalk.bgRed('Error, something went wrong!'))
}