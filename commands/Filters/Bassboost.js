const delay = require('delay');

module.exports = { 
    config: {
        name: "bassboost",
        description: "Turning on bassboost filter",
        category: "Filters",
        usage: "<-10 - 10>",
        accessableby: "Member",
        aliases: ["bb"]
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Turning on\`* **${client.commands.get('bassboost').config.name}** *\`This may take a few seconds...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

            if(!args[0]) {
                const data = {
                    op: 'filters',
                    guildId: message.guild.id,
                    equalizer: [
                        { band: 0, gain: 0.10 },
                        { band: 1, gain: 0.10 },
                        { band: 2, gain: 0.05 },
                        { band: 3, gain: 0.05 },
                        { band: 4, gain: -0.05 },
                        { band: 5, gain: -0.05 },
                        { band: 6, gain: 0 },
                        { band: 7, gain: -0.05 },
                        { band: 8, gain: -0.05 },
                        { band: 9, gain: 0 },
                        { band: 10, gain: 0.05 },
                        { band: 11, gain: 0.05 },
                        { band: 12, gain: 0.10 },
                        { band: 13, gain: 0.10 },
                    ]
                }

                await player.node.send(data);
                    
            await delay(5000);
            return msg.edit(`\`🔩\` | *Turned on:* \`${client.commands.get('bassboost').config.name}\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
        } 

            if(isNaN(args[0])) return msg.edit(`\`*Please enter a number.*\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
            if(args[0] > 10 || args[0] < -10) return msg.edit(`\`*Please enter a number between [-10 - 10]*\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
                const data = {
                    op: 'filters',
                    guildId: message.guild.id,
                    equalizer: [
                        { band: 0, gain: args[0] / 10 },
                        { band: 1, gain: args[0] / 10 },
                        { band: 2, gain: args[0] / 10 },
                        { band: 3, gain: args[0] / 10 },
                        { band: 4, gain: args[0] / 10 },
                        { band: 5, gain: args[0] / 10 },
                        { band: 6, gain: args[0] / 10 },
                        { band: 7, gain: 0 },
                        { band: 8, gain: 0 },
                        { band: 9, gain: 0 },
                        { band: 10, gain: 0 },
                        { band: 11, gain: 0 },
                        { band: 12, gain: 0 },
                        { band: 13, gain: 0 },
                    ]
                }
                await player.node.send(data);
            
		    await delay(5000);
            return msg.edit(`\`🔩\` | *Bassboost set to:* \`${args[0]}\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
    }
};