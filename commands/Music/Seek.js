const formatDuration = require('../../structures/FormatDuration.js')

module.exports = { 
    config: {
        name: "seek",
        description: "Seek timestamp in the song!",
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

        if(isNaN(args[0])) return msg.edit(`*\`Invalid number. Please provide a number in seconds.\`*\nCorrect Usage: \`${prefix}seek <seconds>\``);
		if(args[0] * 1000 >= player.playing.length || args[0] < 0) return msg.edit('*\`Cannot seek beyond length of song\`*');
		await player.seek(args[0] * 1000);

        const Duration = formatDuration(player.position);

        return msg.edit("`⏭` | *Seeked to:* "+ `\`${Duration}\``);
    }
}