const formatDuration = require("../../structures/FormatDuration.js");

module.exports = { 
    config: {
        name: "nowplaying",
        aliases: ["np", "now"],
        description: "Display the song currently playing.",
        accessableby: "Member",
        category: "Music",
    },

    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply(`No playing in this guild!`);

        const song = player.queue.current;
      
        return message.reply({ content: `**Nowplaying • [${song.title}](<${song.uri}>)** \`${formatDuration(song.length, true)}\` • ${song.requester}` });
    }
}