import { PublishTourWorkflow } from "../interfaces/workflows";
import { createActivityHandle  } from "@temporalio/workflow";
import * as activities from "../activities";

/** A workflow that simply calls an activity */
export const publishTourWorkflow: PublishTourWorkflow = (keywords: string[]) => {
  return {
    async execute(): Promise<void> {
      return 
    },
  };
};
