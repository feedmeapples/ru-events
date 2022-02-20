import { Worker, Core } from "@temporalio/worker";
import { getConfig } from "./features/config";
import * as activities from "./activities";

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

  await Core.install({
    serverOptions: {
      address: cfg.temporalAddress,
      namespace: cfg.namespace,
      tls,
    },
  });

  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows/index"),
    activities,
    taskQueue: "ru-events",
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
