const { Client, Collection } = require("discord.js-selfbot-v13");
const { Manager } = require("erela.js");

/// All Plugins!!
const Spotify = require("better-erela.js-spotify").default;
const Apple = require("better-erela.js-apple").default;
const Deezer = require("erela.js-deezer");
const Tidal = require("erela.js-tidal");
const Facebook = require("erela.js-facebook");

class MainClient extends Client {
    constructor() {
        super({
          checkUpdate: false
        });

    this.config = require("./settings/config.js");
    this.prefix = this.config.PREFIX;
    this.listen = this.config.LISTENING;
    if(!this.token) this.token = this.config.TOKEN;

    process.on('unhandledRejection', error => console.log(error));
    process.on('uncaughtException', error => console.log(error));

	  const client = this;

    this.manager = new Manager({
      nodes: this.config.NODES,
      autoPlay: true,
      plugins: [
        new Spotify(),
        new Facebook(),
        new Deezer(),
        new Apple(),
        new Tidal()
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    });

    ["aliases", "commands"].forEach(x => client[x] = new Collection());
    ["loadCommand", "loadEvent", "loadPlayer"].forEach(x => require(`./handlers/${x}`)(client));

	  }
		connect() {
        return super.login(this.token);
    };
};
module.exports = MainClient;