# Slack Auto-Poker

Slack Auto-Poker is a Node.js application that connects your Shortcut (formerly Clubhouse) stories with your Slack workspace. It listens for story updates with specific labels and then posts a message to Slack containing the story's name, ID, and a link to the published poker session.

## Prerequisites

- Node.js
- A Shortcut account with API access
- A Slack App with Socket Mode enabled

## Creating a Slack App

1. Visit the [Slack API website](https://api.slack.com/apps) and sign in with your Slack account.

2. Click on the "Create New App" button and choose "From scratch." Give your app a name and select the desired workspace for development.

3. Navigate to the "OAuth & Permissions" page under the "Features" section in the sidebar. Scroll down to the "Scopes" section and add the following bot token scopes: `workflow.steps:execute`, `commands`, and `chat:write`. Save your changes.

4. Click "Install App" in the sidebar and then click "Install App to Workspace." Authorize the app and copy the "Bot User OAuth Token" that appears on the "OAuth & Permissions" page. You'll need this token as the `SLACK_BOT_TOKEN` environment variable.

5. Navigate to the "Socket Mode" page under the "Settings" section in the sidebar. Enable Socket Mode and generate an "App-Level Token" with the `connections:write` scope. Save this token as the `SLACK_APP_TOKEN` environment variable.

6. In the `webhook.js` file, replace the placeholder value for the `SLACK_WEBHOOK_URL` environment variable with your own webhook URL obtained from your Slack workspace.

7. Now that the Slack app is set up, you can create a new Workflow in your Slack workspace using the Workflow Builder.

8. In your Slack workspace, click the "Shortcuts" button (lightning bolt icon) next to the message input field. Select "Create a workflow" and give your workflow a name.

9. In the Workflow Builder, click the "+" button to add a new step. Choose "Add a step from an app" and search for the StoryPlan app. Select the custom step from the StoryPlan app, which should be named "connect_with_poker."

10. Configure the custom step with the required inputs and outputs, as well as any additional steps you'd like to include in your workflow.

11. Save and publish your workflow. Your Slack app is now ready to use!

Once the Slack app and the custom step are integrated into your workflow, the app will be able to automatically update Shortcut cards with poker information when the workflow is executed.

Don't forget to update your `.env` file with the `SLACK_BOT_TOKEN`, `SLACK_APP_TOKEN`, and `SLACK_WEBHOOK_URL` environment variables.

## Setup

1. Clone this repository to your local machine.

   > git clone https://github.com/yourusername/slack-auto-poker.git
   > cd slack-auto-poker

2. Install the dependencies.

   > npm install

3. Copy the `.env-sample` file to a new file named `.env` and fill in the required environment variables.

   > cp .env-sample .env

- `SLACK_BOT_TOKEN`: Your Slack bot token (starts with `xoxb-`)
- `SLACK_APP_TOKEN`: Your Slack app token (starts with `xapp-`)
- `SHORTCUT_TOKEN`: Your Shortcut API token
- `SLACK_WEBHOOK_URL`: Your Slack Incoming Webhook URL

4. Run the application.
   
   > npm start

   The application will start and listen for updates from Shortcut.

## Webhook Setup

1. Deploy the application to a server or hosting provider that supports Node.js, and take note of the webhook URL.

2. In the Shortcut Integrations settings, add a new Webhook Integration and set the webhook URL to the one provided by your deployed application.

3. Configure the webhook to listen for specific events related to stories, particularly when a label is added to a story. Ensure the webhook triggers when one of the desired labels (e.g., "poker" or "poker-2") is added.

4. Save the webhook settings in Shortcut.

Now, when a story is updated with the specified label(s) in Shortcut, the webhook will send the story information to the Slack Auto-Poker app, which will post a message to your Slack workspace with the relevant details.
