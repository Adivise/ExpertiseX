module.exports = { 
    config: {
        name: "join",
        aliases: ["summon"],
        description: "Make the bot join the voice channel.",
        accessableby: "Member",
        category: "Music",
    },
    run: async (client, message, args) => {
        const { channel } = message.member.voice;
        if (!channel) return message.reply(`You are not in a voice channel`);

        client.manager.createPlayer({
            guildId: message.guild.id,
            textId: message.channel.id,
            voiceId: channel.id,
            volume: 100,
            deaf: true
        });

        return message.reply({ content: `**Joined:** \`${channel.name}\`` })
    }
}
