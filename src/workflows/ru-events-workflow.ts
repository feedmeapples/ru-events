import { createActivityHandle  } from "@temporalio/workflow";
import { RuEventsWorkflow } from "../interfaces/workflows";
import * as activities from "../activities";

const { fetchEvents } = createActivityHandle<typeof activities>({
  startToCloseTimeout: "30 minutes",
});

export const ruEventsWorkflow: RuEventsWorkflow = () => {
  return {
    async execute(): Promise<string[]>{
      const events = await fetchEvents();
      return events.map(e => e.url);
    }
  }
}
