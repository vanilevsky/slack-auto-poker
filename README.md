# AutoPokerBot

1. Setup environment variables
    
    ```zsh
    # Copy the `.env.example` file to `.env` and fill in the values.
    SLACK_BOT_TOKEN=<your-bot-token> # from the OAuth section
    SLACK_APP_TOKEN=<your-app-level-token> # from the Basic Info App Token Section
    SHORTCUT_TOKEN=<your-signing-secret> # from the Shortcut API tokens section https://app.shortcut.com/qonversion/settings/account/api-tokens
    ```

1. Setup your local project

    ```zsh
    # Install the dependencies
    npm install
    ```

1. Start servers

    ```zsh
    npm run start
    ```
