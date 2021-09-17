import { ChildWorkflowHandle } from '@temporalio/workflow'
import { PublishTourWorkflow } from "../interfaces/workflows";
import { Event } from "./event";

export interface Tour {
  keywords: string[]
  events: Event[]
  workflow: ChildWorkflowHandle<PublishTourWorkflow>
}
