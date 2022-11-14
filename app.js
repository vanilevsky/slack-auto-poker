const { App, WorkflowStep } = require('@slack/bolt');
const fetch = require("node-fetch");

/*
This sample slack application uses SocketMode
For the companion getting started setup guide,
see: https://slack.dev/bolt-js/tutorial/getting-started
*/

// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
  // say() sends a message to the channel where the event was triggered
  await say({
    blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hey there <@${message.user}>!`
        },
        "accessory": {
          "type": "button",
          "text": {
            "type": "plain_text",
            "text": "Click Me"
          },
          "action_id": "button_click"
        }
      }
    ],
    text: `Hey there <@${message.user}>!`
  });
});

app.action('button_click', async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);

  // const shortcutCardId = 20312;
  // const cardExternalLinks = [
  //   "https://qonversion.slack.com/archives/C02RCC54C8K/p1668399131269969?poker"
  // ];
  //
  // updateShortcutCardExternalLinks(shortcutCardId, cardExternalLinks)
  //     .then(response => response.text())
  //     .then(result => {
  //       console.log(result);
  //       say(`The card ${shortcutCardId} was updated`);
  //     })
  //     .catch(error => console.log('error', error));
});

const ws = new WorkflowStep('connect_with_poker', {
  edit: async ({ ack, step, configure }) => {
    await ack();

    const blocks = [
      {
        type: 'input',
        block_id: 'task_name_input',
        element: {
          type: 'plain_text_input',
          action_id: 'name',
          placeholder: {
            type: 'plain_text',
            text: 'Add a task name',
          },
        },
        label: {
          type: 'plain_text',
          text: 'Task name',
        },
      },
      {
        type: 'input',
        block_id: 'task_description_input',
        element: {
          type: 'plain_text_input',
          action_id: 'description',
          placeholder: {
            type: 'plain_text',
            text: 'Add a task description',
          },
        },
        label: {
          type: 'plain_text',
          text: 'Task description',
        },
      },
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
  },
  save: async ({ ack, step, view, update }) => {
    await ack();

    const { values } = view.state;
    const taskName = values.task_name_input.name;
    const taskDescription = values.task_description_input.description;
    const storyId = values.shortcut_story_id_input.description;
    const pokerLink = values.slack_published_poker_link_input.description;

    const inputs = {
      taskName: { value: taskName.value },
      taskDescription: { value: taskDescription.value },
      storyId: { value: storyId.value },
      pokerLink: { value: pokerLink.value },
    };

    const outputs = [
      {
        type: 'text',
        name: 'taskName',
        label: 'Task name',
      },
      {
        type: 'text',
        name: 'taskDescription',
        label: 'Task description',
      },
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

    await update({ inputs, outputs });
  },
  execute: async ({ step, complete, fail }) => {

    const { inputs } = step;

    const outputs = {
      taskName: inputs.taskName.value,
      taskDescription: inputs.taskDescription.value,
      shortcutCardId: inputs.storyId.value,
      cardExternalLinks: [
          inputs.pokerLink.value + '?poker',
      ]
    };

    updateShortcutCardExternalLinks(outputs.shortcutCardId, outputs.cardExternalLinks)
        .then(response => response.text())
        .then(result => {
          console.log(result);
          say(`The card ${shortcutCardId} was updated`);
        })
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
  },
});

app.step(ws);

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();

async function updateShortcutCardExternalLinks (cardId, externalLinks) {

  const myHeaders = new fetch.Headers();
  myHeaders.append("Shortcut-Token", process.env.SHORTCUT_TOKEN);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "external_links": externalLinks
  });

  const requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  return fetch(`https://api.app.shortcut.com/api/v3/stories/${cardId}`, requestOptions);
}
