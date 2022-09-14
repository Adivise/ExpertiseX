module.exports = { 
    config: {
        name: "skipto",
        aliases: ["jump", "st"],
        description: "Skips to a certain song in the queue.",
        accessableby: "Member",
        category: "Music",
        usage: "<positions>"
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        if (isNaN(args[0])) return msg.edit('*\`Invalid number\`*');
		if (args[0] === 0) return msg.edit(`*\`Cannot skip to a song that is already playing.\`*\nTo skip the current playing song type: \`${prefix}skip\``);
		if ((args[0] > player.queue.length) || (args[0] && !player.queue[args[0] - 1])) return msg.edit('*\`Song not found\`*');
		if (args[0] == 1) return player.stop();

		await player.queue.splice(0, args[0] - 1);
        await player.stop();

        return msg.edit("`⏭` | *Song has been:* `Skipto`");
    }
}