import {logDebug} from './logger';

export class Timer {
  private start: Date = new Date();

  constructor(private name: string) {
    this.reset(name);
  }

  public reset(name?: string) {
    this.name = name || this.name;
    this.start = new Date();
    this.logStartTime();
  }

  public getElapsedTime(): number {
    return new Date().getTime() - this.start.getTime();
  };

  public logStartTime(): void {
    logDebug(`[TIMER START] ${this.name}`);
  }

  public logEndTime(): void {
    logDebug(`[TIMER END] ${this.name} was processed in ${this.getElapsedTime()/1000}s`);
  }
}
