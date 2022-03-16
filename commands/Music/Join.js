module.exports = { 
    config: {
        name: "join",
        aliases: ["summon"],
        description: "Makes the bot join the voice channel.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

            const { channel } = message.member.voice;
            if(!channel) return msg.edit("*\`You need to be in a voice channel.\`*");

        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: false,
        });

        await player.connect();

        return msg.edit(`\`🔊\` | *Joined:* \`${channel.name}\``).then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });
    }
}
