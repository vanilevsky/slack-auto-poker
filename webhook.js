const express = require('express');
const fetch = require('node-fetch');

function createWebhookServer() {
    const server = express();
    server.use(express.json());
    server.get('/', rootHandler);
    server.post('/webhook', webhookHandler);
    return server;
}

async function rootHandler(req, res) {
    res.status(200).send('Slack Auto-Poker app is running!');
}

async function webhookHandler(req, res) {
    const data = req.body;
    const action = extractAction(data);
    const estimateLabelIds = [15989, 24385];

    if (isActionValid(action, estimateLabelIds)) {
        const webhookData = createWebhookData(action);
        await sendWebhookRequest(webhookData);
    }

    res.sendStatus(200);
}

function extractAction(data) {
    return data.actions && data.actions[0] ? data.actions[0] : null;
}

function isActionValid(action, estimateLabelIds) {
    return (
        action &&
        action.id &&
        action.name &&
        action.app_url &&
        action.entity_type === 'story' &&
        action.action === 'update' &&
        action.changes &&
        action.changes.label_ids &&
        action.changes.label_ids.adds &&
        action.changes.label_ids.adds.some(item => estimateLabelIds.includes(item))
    );
}

function createWebhookData(action) {
    return {
        shortcut_story_name: action.name,
        shortcut_story_url: action.app_url,
        shortcut_story_id: String(action.id),
    };
}

async function sendWebhookRequest(webhookData) {
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;
    const response = await fetch(slackWebhook, {
        method: 'POST',
        body: JSON.stringify(webhookData),
        headers: { 'Content-Type': 'application/json' },
    });

    const result = await response.text();
    console.log(result);
}

module.exports = {
    createWebhookServer,
};
