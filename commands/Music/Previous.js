module.exports = { 
    config: {
        name: "previous",
        description: "Previous a song!",
        accessableby: "Member",
        category: "Music"
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        if (!player.queue.previous) return msg.edit("*\`No previous song/s found.\`*");

        await player.queue.unshift(player.queue.previous);
        await player.stop();

        return msg.edit("`⏮` | *Song has been:* `Previous`");
    }
}