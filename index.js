const { Client, Collection } = require('discord.js-selfbot-v13');
const { Connectors } = require("shoukaku");
const { Kazagumo, Plugins } = require("kazagumo");

const client = new Client();

client.config = require("./settings/config.js");
client.prefix = client.config.PREFIX;
client.owner = client.config.OWNER_ID;
client.color = client.config.EMBED_COLOR;
client.listen = client.config.LISTENING;
if(!client.token) client.token = client.config.TOKEN;

client.manager = new Kazagumo({
    defaultSearchEngine: client.config.SEARCH_ENGINE, // 'youtube' | 'soundcloud' | 'youtube_music'
    plugins: [new Plugins.PlayerMoved(client)],
    send: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
    }
}, new Connectors.DiscordJS(client), client.config.NODES);

["aliases", "commands"].forEach(x => client[x] = new Collection());
["loadCommand", "loadEvent", "loadPlayer", "loadTrack"].forEach(x => require(`./handlers/${x}`)(client));

client.login(client.token);