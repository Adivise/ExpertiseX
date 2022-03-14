module.exports = { 
    config: {
        name: "247",
        description: "Make bot 24/7 in voice channel!",
        accessableby: "Member",
        category: "Music"
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

            const player = client.manager.get(message.guild.id);
            if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
            const { channel } = message.member.voice;
            if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        if (player.twentyFourSeven) {
            player.twentyFourSeven = false;
            return msg.edit(`\`🌙\` | *Mode 24/7 has been:* \`Deactivated\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
        } else {
            player.twentyFourSeven = true;
            return msg.edit(`\`🌕\` | *Mode 24/7 has been:* \`Activated\``).then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
        }
    }
};