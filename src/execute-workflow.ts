import { Connection, WorkflowClient } from "@temporalio/client";
import { randString } from "./features/randString";
import { ruEventsWorkflow } from "./workflows";
import { getConfig } from "./features/config";

async function run() {
  const cfg = getConfig();

  let tls;
  if (cfg.cert && cfg.key) {
    tls = {
      clientCertPair: {
        crt: cfg.cert,
        key: cfg.key,
      },
    };
  }

  const connection = new Connection({
    address: cfg.temporalAddress,
    tls,
  });
  const client = new WorkflowClient(connection.service, {
    namespace: cfg.namespace,
  });

  console.log(`Starting workflow on namespace ${cfg.namespace}`);
  return client.start(ruEventsWorkflow, {
    workflowId: `RU-EVENTS-${randString(4)}`,
    taskQueue: "ru-events",
  });
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
