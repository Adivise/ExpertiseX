module.exports = { 
    config: {
        name: "earrape",
        description: "Destroy your ear!",
        category: "Filters",
        accessableby: "Member",
        aliases: ["ear"]
    },
    run: async (client, message, args) => {
        const msg = await message.reply(`Loading please wait....`);

        const player = client.manager.players.get(message.guild.id);
        if(!player) return msg.edit(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);

		    await player.setVolume(500);
        const data = {}
        await player.shoukaku.setFilters(data);

        await delay(3000);
        return msg.edit({ content: "**Turned on filter:** `Earrape`" });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}