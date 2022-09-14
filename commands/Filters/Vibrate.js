module.exports = { 
    config: {
        name: "vibrate",
        description: "Turning on vibrate filter",
        category: "Filters",
        accessableby: "Member",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning on\`* **Vibrate** *\`This may take a few seconds...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        const data = {
            op: 'filters',
            guildId: message.guild.id,
            vibrato: {
                frequency: 4.0,
                depth: 0.75
            },
            tremolo: {
                frequency: 4.0,
                depth: 0.75
            },
        }

        await player.node.send(data);

        await delay(1000);
        return msg.edit("`🔩` | *Turned on:* `Vibrate`");
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }