const { Client } = require('discord.js-selfbot-v13');
const { Connectors } = require("shoukaku");
const { Kazagumo } = require("kazagumo");
const express = require('express');
const cors = require('cors');

const client = new Client();

client.config = require("./settings/config.js");
client.app = express();
client.app.use(cors());
client.stated = "none";

const token = process.argv[2];
const port = process.argv[3];

if(!token) {
    console.log("Please provide a token");
    process.exit(1);
} else if (!port) {
    console.log("Plrease provide a port");
    process.exit(1);
}

client.app.use(express.json());

client.manager = new Kazagumo({
    defaultSearchEngine: "youtube", // 'youtube' | 'soundcloud' | 'youtube_music'
    plugins: [],
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), client.config.NODES);

["loadEvent", "loadPlayer", "loadTrack", "loadEndpoint"].forEach(x => require(`./handlers/${x}`)(client));

client.app.listen(port);
client.login(token).then(() => {
    console.log(`${client.user.username} is running on: http://localhost:${port}`);
});