import { Workflow } from '@temporalio/workflow';

export interface RuEventsWorkflow extends Workflow {
  main(): Promise<void>;
}
