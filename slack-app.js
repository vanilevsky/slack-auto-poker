const {createSlackApp, createWorkflowStep} = require('./slack');
const dotenv = require('dotenv');
const {WorkflowStep, ExpressReceiver, App} = require("@slack/bolt");
const {updateShortcutCardExternalLinks} = require("./shortcut");
const {LogLevel} = require("@slack/web-api");

    dotenv.config();

    const receiver = new ExpressReceiver({
        signingSecret: process.env.SLACK_SIGNING_SECRET,
    });

    const app = new App({
        token: process.env.SLACK_BOT_TOKEN,
        receiver: receiver,
        // signingSecret: process.env.SLACK_SIGNING_SECRET,

        // LogLevel can be imported and used to make debugging simpler
        logLevel: LogLevel.DEBUG
    });
    // const {app} = createSlackApp();

    console.log(`ℹ️️ Slack app is created`);

    // Add this global middleware to log incoming events
    app.use(async ({payload, context, next}) => {
        console.log('Received event:', JSON.stringify(payload, null, 2));
        console.log('Context:', JSON.stringify(context, null, 2));
        await next();
    });

    const ws = new WorkflowStep('connect_with_poker', {
        edit: async ({ack, step, configure}) => {
            await ack(res);

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

            await configure({blocks});
        },
        save: async ({ack, step, view, update}) => {
            await ack(res);

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
        },
        execute: async ({step, complete, fail}) => {

            const {inputs} = step;

            const outputs = {
                shortcutCardId: inputs.storyId.value,
                cardExternalLinks: [inputs.pokerLink.value + '?poker'],
            };
            const outputsString = JSON.stringify(outputs);

            updateShortcutCardExternalLinks(outputs.shortcutCardId, outputs.cardExternalLinks)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));

            complete({outputs: outputsString}).then(() => {
                console.log('workflow step execution successful');
            }).catch((error) => {
                console.log('workflow step execution failure', error);
                fail({error: 'An error occurred while completing the step.'});
            });

            // let Slack know if something went wrong
            // await fail({ error: { message: "Just testing step failure!" } });
            // NOTE: If you run your app with processBeforeResponse: true, use this instead:
            fail({error: {message: "Just testing step failure!"}}).then(() => {
                console.log('workflow step execution failure registered');
            });
        },
    });

    app.step(ws);
    console.log(`ℹ️️ Workflow created`);

    module.exports = async (req, res) => {
        await receiver.requestHandler(req, res);
    };

    // Start the Slack app
    (async () => {
        console.log('ℹ️ Bolt app is starting...');
        const port = process.env.PORT || 3000;
        await app.start(port);
        console.log(`⚡️ Bolt app is running on port ${port}!`);
    })();


    // const commandArray = tokenizeString(req.body.text)
    // const action = commandArray[0]
    //
    // switch (action) {
    //     case "set": setKey(res, commandArray); break
    //     case "get": getKey(res, commandArray); break
    //     case "list-set": addToList(res, commandArray); break
    //     case "list-all": listAll(res, commandArray); break
    //     case "list-remove": removeFromList(res, commandArray); break
    //     default:
    //         res.send({
    //             "response_type": "ephemeral",
    //             "text": "Wrong usage of the command!"
    //         })
    // }
