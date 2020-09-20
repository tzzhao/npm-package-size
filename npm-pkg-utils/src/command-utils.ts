import {exec, ExecOptions} from 'child_process';
import {logInfo, Timer} from './utils';
import {logDebug, logError} from './utils';

/**
 * Utils function to wrap command line operations into promises
 * @param command
 * @param options
 */
export async function executeCommand(command: string, options: ExecOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    const timer: Timer = new Timer(command);
    logDebug(`Launching command: ${command}`);
    exec(command, options, (error, stdout, stderr) => {
      timer.logEndTime();
      if (error !== null) {
        logError(`***************** ${command} *************************`);
        logError(JSON.stringify(error));
        logError(stderr);
        reject({error, stderr});
      } else {
        logInfo(`***************** ${command} *************************`);
        logInfo(stdout);
        resolve(stdout);
      }
    });
  });
}
