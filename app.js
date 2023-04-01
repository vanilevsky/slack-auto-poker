const { createSlackApp, createWorkflowStep } = require('./slack');
const { createWebhookServer } = require('./webhook');
const dotenv = require('dotenv');

dotenv.config();

const app = createSlackApp();
const server = createWebhookServer();

server.listen(process.env.WEBHOOK_PORT || 8000, () => {
  console.log(`⚡️ Webhook listener is running on port ${process.env.WEBHOOK_PORT || 8000}`);
});

app.step(createWorkflowStep());

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Bolt app is running!');
})();
