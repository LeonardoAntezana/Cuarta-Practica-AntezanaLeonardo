import { Command } from 'commander';

// COMMAND
const command = new Command();

command
  .option('-p, --persistance <persistance>', 'model persistance')
  .option('-e, --environment <environment>', 'environment')

command.parse();

export const environment = command.opts().environment || 'production';
const persistanceModel = command.opts().persistance || 'mongo';

export default persistanceModel;
