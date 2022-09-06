module.exports = async (client, oldState, newState) => {
	const player = client.manager?.players.get(newState.guild.id);

	// When bot got disconnect will destroy!
	if (!player) return;
	if (!newState.guild.members.cache.get(client.user.id).voice.channelId) player.destroy();
};