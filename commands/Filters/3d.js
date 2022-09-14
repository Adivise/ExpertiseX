module.exports = { 
    config: {
        name: "3d",
        description: "Turning on 3d filter",
        category: "Filters",
        accessableby: "Member",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning on\`* **3d** *\`This may take a few seconds...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        const data = {
            op: 'filters',
            guildId: message.guild.id,
            rotation: { rotationHz: 0.2 }
        }

        await player.node.send(data);

        await delay(1000);
        return msg.edit("`🔩` | *Turned on:* `3d`");
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }