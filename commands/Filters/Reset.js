module.exports = { 
    config: {
        name: "reset",
        description: "turn on normal filter",
        category: "Filters",
        accessableby: "Member",
        alieses: ["normal"]
    },
    run: async (client, message, args) => {
        const msg = await message.reply(`Loading please wait....`);

    		const player = client.manager.players.get(message.guild.id);
    		if(!player) return msg.edit(`No playing in this guild!`);
    		const { channel } = message.member.voice;
    		if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);
    
    		const data = {}

        await player.shoukaku.setFilters(data);
        await player.setVolume(100);
        
        await delay(5000);
        return msg.edit({ content: "**Turned on filter:** `Normal`" });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}