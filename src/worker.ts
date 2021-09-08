import { Worker } from '@temporalio/worker';

async function run() {
  // Automatically locate and register Activities and Workflows relative to __dirname
  // (assuming package was bootstrapped with `npx @temporalio/create@latest`).
  // Worker connects to localhost by default and uses console error for logging.
  // Customize the Worker by passing more options to create().
  // create() tries to connect to the server and will throw if a connection could not be established.
  // You may create multiple Workers in a single process in order to poll on multiple task queues.
  // In order to configure the server connection parameters and other global options,
  // use the Core.install() method to configure the Rust Core SDK singleton.
  const worker = await Worker.create({ workDir: __dirname, taskQueue: 'ru-events' });
  // Start accepting tasks on the `ru-events` queue
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
