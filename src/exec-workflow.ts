import { Connection, WorkflowClient } from '@temporalio/client';
import { RuEventsWorkflow } from './interfaces/workflows';

async function run() {
  // Connect to localhost with default ConnectionOptions,
  // pass options to the Connection constructor to configure TLS and other settings.
  const connection = new Connection();
  // Workflows will be started in the "default" namespace unless specified otherwise
  // via options passed the WorkflowClient constructor.
  const client = new WorkflowClient(connection.service);
  // Create a typed client using the Example Workflow interface,
  const ruEventsWorkflow = client.stub<RuEventsWorkflow>('ru-events-workflow', { taskQueue: 'ru-events' });
  const result = await ruEventsWorkflow.execute();
  console.log(result);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
