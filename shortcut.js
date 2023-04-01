const fetch = require('node-fetch');

async function updateShortcutCardExternalLinks(cardId, externalLinks) {
    try {
        const headers = createHeaders();

        const shortcutStory = await fetchShortcutStory(cardId, headers);
        const updatedExternalLinks = createUpdatedExternalLinks(shortcutStory, externalLinks);

        return updateStoryExternalLinks(cardId, headers, updatedExternalLinks);
    } catch (error) {
        console.log('error', error);
    }
}

function createHeaders() {
    const headers = new fetch.Headers();
    headers.append("Shortcut-Token", process.env.SHORTCUT_TOKEN);
    headers.append("Content-Type", "application/json");
    return headers;
}

async function fetchShortcutStory(cardId, headers) {
    const response = await fetch(`https://api.app.shortcut.com/api/v3/stories/${cardId}`, {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    });

    return response.text().then(result => JSON.parse(result));
}

function createUpdatedExternalLinks(shortcutStory, externalLinks) {
    return JSON.stringify({
        "external_links": mergeLinks(shortcutStory, externalLinks),
    });
}

function mergeLinks(shortcutStory, externalLinks) {
    const existingLinks = shortcutStory.external_links || [];
    const newLinks = externalLinks || [];

    return existingLinks.concat(newLinks);
}

function updateStoryExternalLinks(cardId, headers, updatedExternalLinks) {
    return fetch(`https://api.app.shortcut.com/api/v3/stories/${cardId}`, {
        method: 'PUT',
        headers: headers,
        body: updatedExternalLinks,
        redirect: 'follow'
    });
}

module.exports = {
    updateShortcutCardExternalLinks
};
