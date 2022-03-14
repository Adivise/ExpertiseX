const delay = require('delay');

module.exports = { 
    config: {
        name: "equalizer",
        description: "Sets the equalizer of the current playing song.",
        category: "Filters",
        accessableby: "Member",
        usage: "<2 3 0 8 0 5 0 -5 0 0>",
        aliases: ["eq"]
    },
	run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning on\`* **${client.commands.get('equalizer').config.name}** *\`This may take a few seconds...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);
				
			if (!args[0]) {
				return msg.edit(`\`🚫\` | *Please provide a list (14 Bands)\`*`).then(msg => {
					setTimeout(() => msg.delete(), 5000)
				});
			} else 
			if (args[0] == 'off' || args[0] == 'reset') {
				const data = {
					op: 'filters',
					guildId: message.guild.id,
				}

			await player.node.send(data);
			return msg.edit(`\`🔩\` | *Turned off:* \`${client.commands.get('equalizer').config.name}\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
		}

			const bands = args.join(' ').split(/[ ]+/);
			let bandsStr = '';
			for (let i = 0; i < bands.length; i++) {
				if (i > 13) break;
				if (isNaN(bands[i])) return msg.edit(`\`*Band #${i + 1} is not a valid number.*\``).then(msg => {
					setTimeout(() => msg.delete(), 5000)
				});
				if (bands[i] > 10) return msg.edit(`\`*Band #${i + 1} must be less than 10.*\``).then(msg => {
					setTimeout(() => msg.delete(), 5000)
				});
			}

			for (let i = 0; i < bands.length; i++) {
				if (i > 13) break;
				const data = {
					op: 'filters',
					guildId: message.guild.id,
					equalizer: [
						{ band: i, gain: (bands[i]) / 10 },
					]
				}
				player.node.send(data);
				bandsStr += `${bands[i]} `;
			}

		await delay(5000);
        return msg.edit(`\`🔩\` | *Equalizer set to:* \`${bandsStr}\``).then(msg => {
			setTimeout(() => msg.delete(), 5000)
		});
	}
};