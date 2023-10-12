import { Command } from 'commander';

// COMMAND
const command = new Command();

command
  .option('-p, --persistance <persistance>', 'model persistance')
  .option('-e, --environment <environment>', 'environment')
  .option('-t, --test <test>', 'test mode');

command.parse();

export const environment = command.opts().environment || 'production';
export const testMode = command.opts().test || false;
const persistanceModel = command.opts().persistance || 'mongo';

export default persistanceModel;
