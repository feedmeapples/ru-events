import { Connection, WorkflowClient } from "@temporalio/client";
import { randString } from "./features/randString";
import { ruEventsWorkflow } from "./workflows";

async function run() {
  const connection = new Connection();
  const client = new WorkflowClient(connection.service);
  
  return client.start(ruEventsWorkflow, {workflowId: `RU-EVENTS-${randString(4)}`,  taskQueue: "ru-events" });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
