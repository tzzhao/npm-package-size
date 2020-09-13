import {exec, ExecOptions} from 'child_process';

export async function executeCommand(command: string, options: ExecOptions = {}): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error !== null) {
        console.error(`***************** ${command} *************************`);
        console.error(JSON.stringify(error));
        console.error(stderr);
        reject({error, stderr});
      } else {
        console.log(`***************** ${command} *************************`);
        console.log(stdout);
        resolve(stdout);
      }
    });
  });
}
