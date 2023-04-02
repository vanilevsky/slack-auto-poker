const { createWebhookServer } = require('./webhook');
const dotenv = require('dotenv');

dotenv.config();

const server = createWebhookServer();
console.log(`ℹ️️ Webhook server is created`);

module.exports = server;
