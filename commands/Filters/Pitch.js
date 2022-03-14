const delay = require('delay');

module.exports = { 
    config: {
        name: "pitch",
        description: "Sets the pitch of the song.",
        category: "Filters",
		accessableby: "Member",
		usage: '<pitch>',
	},
	run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning on\`* **${client.commands.get('pitch').config.name}** *\`This may take a few seconds...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

			if (isNaN(args[0])) return msg.edit(`\`*Please enter a number.*\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
			if (args[0] < 0) return msg.edit(`\`*Number must be greater than 0.*\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
			if (args[0] > 10) return msg.edit(`\`*Number must be less than 10.*\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });

			const data = {
				op: 'filters',
				guildId: message.guild.id,
				timescale: { pitch: args[0] },
			}

			await player.node.send(data);

        await delay(5000);
        return msg.edit(`\`🔩\` | *Pitch set to:* \`${args[0]}\``).then(msg => {
			setTimeout(() => msg.delete(), 5000)
		});
	}
};