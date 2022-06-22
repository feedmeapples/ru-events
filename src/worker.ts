import { Worker, NativeConnection, InjectedSinks } from "@temporalio/worker";
import { getConfig } from "./features/config";
import * as activities from "./activities";
import { LoggerSinks } from './workflows';


async function main() {
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

  const sinks: InjectedSinks<LoggerSinks> = {
    logger: {
      info: {
        fn(workflowInfo, message) {
          console.log('workflow: ', workflowInfo.runId, 'message: ', message);
        },
        callDuringReplay: false,
      },
      error: {
        fn(workflowInfo, message) {
          console.error('workflow: ', workflowInfo.runId, 'message: ', message);
        },
        callDuringReplay: false,
      },
    },
  };

  const worker = await Worker.create({
    connection,
    workflowsPath: require.resolve("./workflows/index"),
    activities,
    namespace: cfg.namespace,
    taskQueue: "ru-events",
    sinks
  });
  await worker.run();
}

main().then(
  () => void process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
