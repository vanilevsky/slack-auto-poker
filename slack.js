const { App, WorkflowStep } = require('@slack/bolt');
const { updateShortcutCardExternalLinks } = require('./shortcut');

function createSlackApp() {
    return new App({
        token: process.env.SLACK_BOT_TOKEN,
        socketMode: true,
        appToken: process.env.SLACK_APP_TOKEN
    });
}

function createWorkflowStep() {
    return new WorkflowStep('connect_with_poker', {
        edit,
        save,
        execute
    });
}

async function edit({ ack, step, configure }) {
    await ack();

    const blocks = [
        {
            type: 'input',
            block_id: 'shortcut_story_id_input',
            element: {
                type: 'plain_text_input',
                action_id: 'story_id',
                placeholder: {
                    type: 'plain_text',
                    text: 'Add a Shortcut story ID',
                },
            },
            label: {
                type: 'plain_text',
                text: 'Story ID',
            },
        },
        {
            type: 'input',
            block_id: 'slack_published_poker_link_input',
            element: {
                type: 'plain_text_input',
                action_id: 'poker_link',
                placeholder: {
                    type: 'plain_text',
                    text: 'Add a Slack link to published poker',
                },
            },
            label: {
                type: 'plain_text',
                text: 'Poker link',
            },
        },
    ];

    await configure({ blocks });
}

async function save({ ack, step, view, update }) {
    await ack();

    const {values} = view.state;
    const storyId = values.shortcut_story_id_input.story_id.value;
    const pokerLink = values.slack_published_poker_link_input.poker_link.value;

    const inputs = {
        storyId: {value: storyId},
        pokerLink: {value: pokerLink},
    };

    const outputs = [
        {
            type: 'text',
            name: 'storyId',
            label: 'Story ID',
        },
        {
            type: 'text',
            name: 'pokerLink',
            label: 'Poker link',
        }
    ];

    await update({inputs, outputs});
}

async function execute({ step, complete, fail }) {

    const { inputs } = step;

    const outputs = {
        shortcutCardId: inputs.storyId.value,
        cardExternalLinks: [
            inputs.pokerLink.value + '?poker',
        ]
    };

    updateShortcutCardExternalLinks(outputs.shortcutCardId, outputs.cardExternalLinks)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));






    // signal back to Slack that everything was successful
    // await complete({ outputs });
    // NOTE: If you run your app with processBeforeResponse: true option,
    // `await complete()` is not recommended because of the slow response of the API endpoint
    // which could result in not responding to the Slack Events API within the required 3 seconds
    // instead, use:
    complete({outputs}).then(() => {
        console.log('workflow step execution complete registered');
    });

    // let Slack know if something went wrong
    // await fail({ error: { message: "Just testing step failure!" } });
    // NOTE: If you run your app with processBeforeResponse: true, use this instead:
    fail({error: {message: "Just testing step failure!"}}).then(() => {
        console.log('workflow step execution failure registered');
    });
}

module.exports = {
    createSlackApp,
    createWorkflowStep
};
