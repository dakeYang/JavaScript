const program = require("commander");
const chalk = require("chalk");

program
    .command('create')
    .alias('c')
    .action(() => {
        console.log('打印一点东西' + chalk.green('3000'));
    })
    .description("a command")

program
  .option('-c, --copy', 'copy something')
  .option('-p,--port <val>','set port')
  .parse(process.argv)

console.log(program);