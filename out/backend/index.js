const { Client } = require('discord.js-selfbot-v13');
const { Connectors } = require("shoukaku");
const { Kazagumo } = require("kazagumo");
const express = require('express');
const cors = require('cors');

const client = new Client();

process.on("exit", () => console.log("⚠️ Bot is shutting down."));
process.on("uncaughtException", (err) => console.error("❌ Bot Error:", err));
process.on("unhandledRejection", (reason) => console.error("❌ Promise Rejection:", reason));

client.config = require("./settings/config.js");
client.app = express();
client.app.use(cors());
client.stated = "none";

const token = process.argv[2];
const port = process.argv[3];

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
client.login(token);