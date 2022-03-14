const delay = require('delay');

module.exports = { 
    config: {
        name: "television",
        description: "Turning on television filter",
        category: "Filters",
        accessableby: "Member",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning on\`* **${client.commands.get('television').config.name}** *\`This may take a few seconds...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);
    
            const data = {
                op: 'filters',
                guildId: message.guild.id,
                equalizer: [
                    { band: 0, gain: 0 },
                    { band: 1, gain: 0 },
                    { band: 2, gain: 0 },
                    { band: 3, gain: 0 },
                    { band: 4, gain: 0 },
                    { band: 5, gain: 0 },
                    { band: 6, gain: 0 },
                    { band: 7, gain: 0.65 },
                    { band: 8, gain: 0.65 },
                    { band: 9, gain: 0.65 },
                    { band: 10, gain: 0.65 },
                    { band: 11, gain: 0.65 },
                    { band: 12, gain: 0.65 },
                    { band: 13, gain: 0.65 },
                ]
            }

            await player.node.send(data);

        await delay(5000);
        return msg.edit(`\`🔩\` | *Turned on:* \`${client.commands.get('television').config.name}\``).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
   }
};