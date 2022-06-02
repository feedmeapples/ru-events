import { Sinks } from '@temporalio/workflow';

export interface LoggerSinks extends Sinks {
  logger: {
    info(message: any): void;
    error(message: any): void;
  };
}