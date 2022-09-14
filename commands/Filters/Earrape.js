module.exports = { 
    config: {
        name: "earrape",
        description: "Destroy your ear!",
        category: "Filters",
        accessableby: "Member",
        aliases: ["ear"]
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning on\`* **Earrape** *\`This may take a few seconds...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        await player.setVolume(500);
        const data = {
            op: 'filters',
            guildId: message.guild.id,
        }

        await player.node.send(data);

        await delay(3000);
        return msg.edit("`🔩` | *Turned on:* `Earrape`");
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }