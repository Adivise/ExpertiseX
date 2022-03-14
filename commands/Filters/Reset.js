const delay = require('delay');

module.exports = { 
    config: {
        name: "reset",
        description: "reseting all filters",
        category: "Filters",
        accessableby: "Member",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning off\`* **filter** *\`This may take a few seconds...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

            const data = {
                op: 'filters',
                guildId: message.guild.id,
            }

            await player.node.send(data);
            await player.setVolume(100);
        
        await delay(3000);
        return msg.edit(`\`🔩\` | *Turned off:* \`filter\``).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
   }
};