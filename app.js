const { createSlackApp, createWorkflowStep } = require('./slack');
const { createWebhookServer } = require('./webhook');
const dotenv = require('dotenv');

dotenv.config();

const app = createSlackApp();
const server = createWebhookServer();

const port = process.env.WEBHOOK_PORT;
server.listen(port, () => {
  console.log(`⚡️ Webhook listener is running on port ${port}`);
});

app.step(createWorkflowStep());

(async () => {
  await app.start(process.env.PORT);
  console.log('⚡️ Bolt app is running!');
})();
