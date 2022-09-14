module.exports = {
    config: {
        name: "loopall",
        aliases: ["repeatall", 'lq', 'loopqueue'],
        description: "loop the song in queue playing.",
        accessableby: "Member",
        category: "Music"
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

		if (player.queueRepeat === true) {
            await player.setQueueRepeat(false)
            return msg.edit(`\`🔁\` | *Song is unloop:* \`All\``);
		} else {
            await player.setQueueRepeat(true);
            return msg.edit(`\`🔁\` | *Song is loop:* \`All\``);
		}
	}
};