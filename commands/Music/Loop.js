module.exports = {
    config: {
        name: "loop",
        aliases: ["repeat"],
        description: "Loop song in queue!",
        accessableby: "Member",
        category: "Music",
        usage: "<current, all>"
    },
    run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

		if (!args[0] || args[0].toLowerCase() == 'current') {
			if (player.loop === "none") {
				player.setLoop("track");

				message.reply({ content: `**Song is:** \`Loop\`` });
			} else {
				player.setLoop("none")

				message.reply({ content: `**Song is:** \`UnLoop\`` });
			}
		} else if (args[0] == 'all') {
			if (player.loop === "queue") {
				player.setLoop("none")

				message.reply({ content: `**Queue is:** \`UnLoop\`` });
			} else {
				player.setLoop("queue")

				message.reply({ content: `**Queue is:** \`Loop\`` });
			}
		}
	}
};