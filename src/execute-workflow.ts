import { Connection, WorkflowClient } from "@temporalio/client";
import { ruEventsWorkflow } from "./workflows";

async function run() {
  const connection = new Connection();
  const client = new WorkflowClient(connection.service);
  return client.start(ruEventsWorkflow, { taskQueue: "ru-events" });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
