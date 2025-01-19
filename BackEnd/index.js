const { Client } = require('discord.js-selfbot-v13');
const { Connectors } = require("shoukaku");
const { Kazagumo } = require("kazagumo");
const express = require('express');
const cors = require('cors');

const port = 3000;

const client = new Client();

client.config = require("./settings/config.js");
client.app = express();
client.app.use(cors());
client.stated = "none";
if(!client.token) client.token = client.config.TOKEN;

client.app.use(express.json());

client.manager = new Kazagumo({
    defaultSearchEngine: client.config.SEARCH_ENGINE, // 'youtube' | 'soundcloud' | 'youtube_music'
    plugins: [],
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), client.config.NODES);

["loadEvent", "loadPlayer", "loadTrack", "loadEndpoint"].forEach(x => require(`./handlers/${x}`)(client));

client.app.listen(port, () => {
    console.log(`Dashboard is running on http://localhost:${port}`);
});
client.login(client.token);