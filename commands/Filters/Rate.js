module.exports = { 
    config: {
        name: "rate",
        description: "Sets the rate of the song.",
        category: "Filters",
		    accessableby: "Member",
		    usage: '<pitch>',
	  },
  	run: async (client, message, args) => {
  		const msg = await message.reply(`Loading please wait....`);
  
  		const player = client.manager.players.get(message.guild.id);
  		if(!player) return msg.edit(`No playing in this guild!`);
  		const { channel } = message.member.voice;
  		if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return msg.edit(`I'm not in the same voice channel as you!`);
  
  		if (isNaN(args[0])) return msg.edit(`Please enter a number!`);
  		if(args[0] > 10 || args[0] < 0) return msg.edit(`Please enter a number between 0 - 10!`);
  
  		const data = {
  			timescale: { rate: args[0] },
  		}
  
  		await player.shoukaku.setFilters(data);
  		
  		await delay(5000);
  		return msg.edit({ content: `**Rate set to:** \`${args[0]}\`` });
	  }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}