import { Command } from 'commander';

// COMMAND
const command = new Command();

command
  .option('-p, --persistance', 'model persistance')

command.parse();

const persistanceModel = command.persistance;

export default persistanceModel;
