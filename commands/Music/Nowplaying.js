const formatDuration = require('../../structures/FormatDuration.js');

module.exports = { 
    config: {
        name: "nowplaying",
        aliases: ["np", "now"],
        description: "Displays what the current song every 5 seconds.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);

        const song = player.queue.current;

        return msg.edit(`\`⏹\` *\`Now playing... | ${song.title} [${formatDuration(song.duration)}] • ${song.requester.tag}\`*`).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
    }
}