const express = require('express');
const fetch = require("node-fetch");

function createWebhookServer() {
    const server = express();
    server.use(express.json());
    server.post('/webhook', webhookHandler);
    return server;
}

async function webhookHandler(req, res) {
    const data = req.body;
    const action = data.actions && data.actions[0] ? data.actions[0] : null;
    const estimateLabelIds = [
        15989, // "poker"
        24385, // "poker-2"
    ];
    const slackWebhook = process.env.SLACK_WEBHOOK_URL;

    if (action &&
        action.id &&
        action.name &&
        action.app_url &&
        action.entity_type === 'story' &&
        action.action === 'update' &&
        action.changes &&
        action.changes.label_ids &&
        action.changes.label_ids.adds &&
        action.changes.label_ids.adds.some(item => estimateLabelIds.includes(item))
    ) {

        const webhookData = {
            "shortcut_story_name": action.name,
            "shortcut_story_url": action.app_url,
            "shortcut_story_id": String(action.id)
        };

        const response = await fetch(slackWebhook, {
            method: 'POST',
            body: JSON.stringify(webhookData),
            headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.text();
        console.log(result);
    }

    res.sendStatus(200);
}

module.exports = {
    createWebhookServer
};
