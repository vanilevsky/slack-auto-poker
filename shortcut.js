const fetch = require('node-fetch');

async function updateShortcutCardExternalLinks(cardId, externalLinks) {
    const headers = new fetch.Headers();
    headers.append("Shortcut-Token", process.env.SHORTCUT_TOKEN);
    headers.append("Content-Type", "application/json");

    const shortcutStory = await fetch(`https://api.app.shortcut.com/api/v3/stories/${cardId}`, {
        method: 'GET',
        headers: headers,
        redirect: 'follow'
    })
        .then(response => response.text())
        .then(result => JSON.parse(result))
        .catch(error => console.log('error', error));

    const putRaw = JSON.stringify({
        "external_links": collectLinks(shortcutStory, externalLinks),
    });

    return fetch(`https://api.app.shortcut.com/api/v3/stories/${cardId}`, {
        method: 'PUT',
        headers: headers,
        body: putRaw,
        redirect: 'follow'
    });
}

function collectLinks(shortcutStory, externalLinks) {
    let existingLinks = shortcutStory.external_links || [];
    let newLinks = externalLinks || [];

    return existingLinks.concat(newLinks);
}

module.exports = {
    updateShortcutCardExternalLinks
};
