import { isMainThread, threadId } from 'worker_threads';
export let isDebug = process.env.LOG_LEVEL === 'DEBUG' || typeof global.v8debug === 'object' || /--dev|--debug|--inspect/.test(process.argv.join(' '));
let isVerbose =  process.env.LOG_LEVEL === 'VERBOSE';

function addLogParams(params: any[]) {
  if (!isMainThread) {
    return [`[tid:${threadId}] ` + JSON.stringify(params[0]), ...params.slice(1)];
  }
  return params;
}

export function logDebug(...params: any[]) {
  if (isDebug || isVerbose) console.debug(...addLogParams(params));
}

export function logError(...params: any[]) {
  console.error(...addLogParams(params));
}

export function logInfo(...params: any[]) {
  if (isVerbose) console.log(...addLogParams(params));
}
