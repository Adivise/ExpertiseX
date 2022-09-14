module.exports = { 
    config: {
        name: "dance",
        description: "Turning on dance filter",
        category: "Filters",
        accessableby: "Member",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning on\`* **Dance** *\`This may take a few seconds...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        const data = {
            op: 'filters',
            guildId: message.guild.id,
            timescale: {
                speed: 1.25,
                pitch: 1.25,
                rate: 1.25
            },
        }

        await player.node.send(data);

        await delay(1000);
        return msg.edit("`🔩` | *Turned on:* `Dance`");
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }