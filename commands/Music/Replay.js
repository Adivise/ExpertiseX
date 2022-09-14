module.exports = { 
    config: {
        name: "replay",
        description: "Replay current song!",
        accessableby: "Member",
        category: "Music"
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        await player.seek(0);

        return msg.edit("`⏮` | *Song has been:* `Replay`");
    }
}