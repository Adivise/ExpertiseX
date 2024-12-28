const formatDuration = require('../../structures/FormatDuration.js');

module.exports = { 
    config: {
        name: "queue",
        aliases: ["q"],
        description: "Displays what the current queue is.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        const songStrings = [];
        for (let i = 0; i < Math.min(player.queue.length, 5); i++) { // Adjusted to only show top 10 songs
            const song = player.queue[i];
            songStrings.push(`- -# **${song.title}** \`[${formatDuration(song.length)}]\``);
        }
        
        const str = songStrings.join('\n');
        const song = player.queue.current;
    
        return message.reply({ content: `**Current Playing • [${song.title}](<${song.uri}>)** \`[${formatDuration(song.length)}]\` • ${song.requester}\n\n-# **Rest of Queues:**\n${str || "Queue is Empty"}` });
    }
};