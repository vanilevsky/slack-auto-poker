const { createSlackApp } = require('./slack');
const { createWorkflowStep } = require('./slack');
const dotenv = require('dotenv');

dotenv.config();

const { app, expressApp } = createSlackApp(); // Destructure both app and expressApp
console.log(`ℹ️️ Slack app is created`);

app.step(createWorkflowStep());
console.log(`ℹ️️ Workflow created`);

// Start the Slack app
(async () => {
    console.log('ℹ️ Bolt app is starting...');
    await app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
})();

module.exports = expressApp; // Export the Express app
