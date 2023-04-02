const express = require('express');
const { createSlackApp, createWorkflowStep } = require('./slack');
const dotenv = require('dotenv');

dotenv.config();

const app = createSlackApp();
console.log(`ℹ️️ Slack app is created`);

app.step(createWorkflowStep());
console.log(`ℹ️️ Workflow created`);

const server = express();
const port = process.env.PORT || 3000;

server.use(app.receiver.router); // Attach the Slack app's built-in receiver

server.listen(port, () => {
    console.log(`⚡️ Server is running on port ${port}`);
});

module.exports = server;
