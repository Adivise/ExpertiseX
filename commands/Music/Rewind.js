const formatDuration = require('../../structures/FormatDuration.js')
const rewindNum = 10;

module.exports = { 
    config: {
        name: "rewind",
        aliases: [],
        description: "Rewind timestamp in the song!",
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

        const CurrentDuration = formatDuration(player.position);

        if(args[0] && !isNaN(args[0])) {
			if((player.position - args[0] * 1000) > 0) {
                await player.seek(player.position - args[0] * 1000);
                return msg.edit("`⏮` | *Rewind to:* "+ `\`${CurrentDuration}\``);
			} else {
				return msg.edit('*\`Cannot rewind beyond 00:00\`*');
			}
		} else if(args[0] && isNaN(args[0])) {
			return msg.edit(`*\`Invalid argument, must be a number.\`*\nCorrect Usage: \`${prefix}rewind <seconds>\``);
		}

		if(!args[0]) {
			if((player.position - rewindNum * 1000) > 0) {
                await player.seek(player.position - rewindNum * 1000);
                return msg.edit("`⏮` | *Rewind to:* "+ `\`${CurrentDuration}\``);
			} else {
				return msg.edit('*\`Cannot rewind beyond 00:00\`*');
			}
		}
	}
};