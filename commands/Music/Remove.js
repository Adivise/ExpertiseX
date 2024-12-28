const { convertTime } = require("../../structures/ConvertTime.js");

module.exports = { 
    config: {
        name: "remove",
        description: "Remove song from queue!",
        usage: "<number>",
        category: "Music",
        accessableby: "Member",
        aliases: ["rt", "rs"],
    },
    run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        const tracks = args[0];

        if (isNaN(tracks)) return message.reply(`Please enter a valid number in the queue! ${client.prefix}remove <number>`);

        if (tracks == 0) return message.reply(`Cannot remove a song that is already playing.`);
        if (tracks > player.queue.size) return message.reply(`Song not found.`);

        const song = player.queue[tracks - 1];
        await player.queue.splice(tracks - 1, 1);

        return message.reply({ content: `**Removed • [${song.title}](<${song.uri}>)** \`${convertTime(song.length, true)}\`` });
    }
}