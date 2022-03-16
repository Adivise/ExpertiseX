const formatDuration = require('../../structures/FormatDuration.js');

module.exports = { 
    config: {
        name: "queue",
        aliases: ["q",],
        description: "Displays what the current queue is.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

		const song = player.queue.current;

		let pagesNum = Math.ceil(player.queue.length / 10);
		if(pagesNum === 0) pagesNum = 1;

		const songStrings = [];
		for (let i = 0; i < player.queue.length; i++) {
			const song = player.queue[i];
			songStrings.push(`*\`${i + 1}. ${song.title} [${formatDuration(song.duration)}]\`* • ${song.requester.tag}`);
		}

		const pages = [];
		for (let i = 0; i < pagesNum; i++) {
			const str = songStrings.slice(i * 10, i * 10 + 10).join('');

			const String = `*Currently Playing:*\n*\`${song.title}** [${formatDuration(song.duration)}]\`* • ${song.requester.tag}\n\n*Rest of queue*:${str == '' ? '  Nothing' : '\n' + str}`;

			pages.push(String);
		}

		return msg.edit([pages[0]]).then(msg => {
			setTimeout(() => msg.delete(), 10000)
		});
	}
};