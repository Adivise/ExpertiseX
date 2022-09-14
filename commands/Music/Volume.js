module.exports = { 
    config: {
        name: "volume",
        aliases: ["vol", "v"],
        description: "Adjusts the volume of the bot.",
        accessableby: "Member",
        category: "Music",
        usage: "<input>"
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        if (!args[0]) return msg.edit(`\`🔊\` | *\`Current Volume:\`* \`${player.volume}\``);
        if (Number(args[0]) <= 0 || Number(args[0]) > 100) return msg.edit("*\`You may only set the volume to 1-100\`*");

        await player.setVolume(Number(args[0]));
        
        return msg.edit(`\`🔊\` | *Change volume to:* \`${args[0]}\``);
    }
}