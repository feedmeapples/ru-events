import { Context } from "@temporalio/workflow";
import { RuEventsWorkflow } from "../interfaces/workflows";
import * as activities from "../activities";

const { fetchEvents } = Context.configureActivities<typeof activities>({
  type: "remote",
  startToCloseTimeout: "30 minutes",
});

async function main(): Promise<string[]> {
  const events = await fetchEvents();
  return events.map(e => e.url);
}

export const workflow = { main };
