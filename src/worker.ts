import { Worker, NativeConnection } from "@temporalio/worker";
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

  const connection = await NativeConnection.create({
    address: cfg.temporalAddress,
    tls,
  });

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("./workflows/index"),
    activities,
    namespace: cfg.namespace,
    taskQueue: "ru-events",
  });
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
