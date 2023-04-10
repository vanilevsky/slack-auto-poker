const express = require('express');
const fetch = require('node-fetch');
const http = require('http');

function createWebhookServer() {
    const app = express();

    app.use(express.json());
    app.get('/', rootHandler);
    app.post('/webhook', webhookHandler);

    return http.createServer(app);
}

async function rootHandler(req, res) {
    res.status(200).send('OK');
}

async function webhookHandler(req, res) {
    const data = req.body;
    const action = extractAction(data);
    const estimateLabelIds = [15989, 24385];

    if (isActionValid(action, estimateLabelIds)) {
        const webhookData = createWebhookData(action, estimateLabelIds);
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

/**
 * @param action
 * @param estimateLabelIds
 * @returns Object {"shortcut_story_name": String, "shortcut_story_url": String, "shortcut_story_id": String, "shortcut_label_id": String}
 */
function createWebhookData(action, estimateLabelIds) {
    let labelId = action.changes.label_ids.adds.find(item => estimateLabelIds.includes(item));

    return {
        shortcut_story_name: action.name,
        shortcut_story_url: action.app_url,
        shortcut_story_id: String(action.id),
        shortcut_label_id: String(labelId),
    };
}

async function sendWebhookRequest(webhookData) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify(webhookData),
        headers: { 'Content-Type': 'application/json' },
    });
}

module.exports = {
    createWebhookServer,
};
