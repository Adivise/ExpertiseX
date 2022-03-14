const delay = require('delay');

module.exports = { 
    config: {
        name: "tremolo",
        description: "Turning on tremolo filter",
        category: "Filters",
        accessableby: "Member",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning on\`* **${client.commands.get('tremolo').config.name}** *\`This may take a few seconds...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

            const data = {
                op: 'filters',
                guildId: message.guild.id,
                tremolo: {
                    frequency: 4.0,
                    depth: 0.75
                },
            }

            await player.node.send(data);

        await delay(5000);
        return msg.edit(`\`🔩\` | *Turned on:* \`${client.commands.get('tremolo').config.name}\``).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
   }
};