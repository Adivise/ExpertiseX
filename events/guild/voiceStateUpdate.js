module.exports = async (client, oldState, newState) => {
	const player = client.manager.players.get(newState.guild.id);
	if (!player) return;
	
	if (!newState.guild.members.cache.get(client.user.id).voice.channelId) { 
		player.destroy();
	}

	if (oldState.id === client.user.id) return;
	if (!oldState.guild.members.cache.get(client.user.id).voice.channelId) return;

	if (player.data.get("stay")) return;

	if (oldState.guild.members.cache.get(client.user.id).voice.channelId === oldState.channelId) {
		if (oldState.guild.members.me.voice?.channel && oldState.guild.members.me.voice.channel.members.filter((m) => !m.user.bot).size === 0) {

			await delay(client.config.LEAVE_EMPTY); // 2 minutes

			const vcMembers = oldState.guild.members.me.voice.channel?.members.size;
			if (!vcMembers || vcMembers === 1) {
				if(!player) return;
				await player.destroy();
			}
		}
	}
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}