module.exports = { 
    config: {
        name: "twentyfourseven",
        description: "make bot stay in voice channel.",
        accessableby: "Member",
        category: "Music",
        aliases: ["247"],
    },
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        if (player.data.get("stay")) { // get undefined = turn on + set data
            await player.data.set("stay", false);

            return message.reply({ content: "*24/7 is now:** `Off`" });
        } else {
            await player.data.set("stay", true);

            return message.reply({ content: "*24/7 is now:** `On`" });
        }
    }
};