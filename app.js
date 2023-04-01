const { createSlackApp, createWorkflowStep } = require('./slack');
const { createWebhookServer } = require('./webhook');
const dotenv = require('dotenv');

dotenv.config();

const app = createSlackApp();
console.log(`ℹ️️ Slack app is created`);

const server = createWebhookServer();
console.log(`ℹ️️ Webhook server is created`);

const port = process.env.WEBHOOK_PORT;
server.listen(port, () => {
  console.log(`⚡️ Webhook listener is running on port ${port}`);
});

app.step(createWorkflowStep());

(async () => {
  await app.start();
  console.log('⚡️ Bolt app is running!');
})();
