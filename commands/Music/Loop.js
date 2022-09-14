module.exports = {
    config: {
        name: "loop",
        aliases: ["repeat"],
        description: "loop the song currently playing.",
        accessableby: "Member",
        category: "Music",
        usage: "<current, all>"
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

		const player = client.manager.get(message.guild.id);
		if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
		const { channel } = message.member.voice;
		if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

		if (!args[0] || args[0].toLowerCase() == 'current') {
			if (player.trackRepeat === false) {
				await player.setTrackRepeat(true);
				return msg.edit(`\`🔁\` | *Song is loop:* \`Current\``);
			} else {
				await player.setTrackRepeat(false);
				return msg.edit(`\`🔁\` | *Song is unloop:* \`Current\``);
			}
		} else if (args[0] == 'all') {
			if (player.queueRepeat === true) {
				await player.setQueueRepeat(false);
				return msg.edit(`\`🔁\` | *Song is unloop:* \`All\``);
			} else {
				await player.setQueueRepeat(true);
				return msg.edit(`\`🔁\` | *Song is loop:* \`All\``);
			}
		}
	}
};