const formatDuration = require('../../structures/FormatDuration.js')
const fastForwardNum = 10;

module.exports = { 
    config: {
        name: "forward",
        description: "Forward timestamp in the song!",
        accessableby: "Member",
        category: "Music",
        usage: "<seconds>"
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        const song = player.queue.current;
        const CurrentDuration = formatDuration(player.position);

		if (args[0] && !isNaN(args[0])) {
			if((player.position + args[0] * 1000) < song.duration) {
                player.seek(player.position + args[0] * 1000);

                return msg.edit("`⏭` | *Forward to:* "+ `\`${CurrentDuration}\``).then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
			} else { 
                return msg.edit("*\`Cannot forward beyond the song's duration.\`*").then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
            }
		}
		else if (args[0] && isNaN(args[0])) { 
            return message.reply(`*\`Invalid argument, must be a number.\`*\nCorrect Usage: \`${prefix}forward <seconds>\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
        }

		if (!args[0]) {
			if((player.position + fastForwardNum * 1000) < song.duration) {
                player.seek(player.position + fastForwardNum * 1000);

                return msg.edit("`⏭` | *Forward to:* "+ `\`${CurrentDuration}\``).then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
			} else {
				return msg.edit("*\`Cannot forward beyond the song's duration.\`*").then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
			}
		}
	}
};