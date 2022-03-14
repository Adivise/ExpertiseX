module.exports = async (client, player) => {
	const channel = client.channels.cache.get(player.textChannel);

	await channel.send(`\`📛\` | *Song has been:* \`Ended\``).then(msg => {
		setTimeout(() => msg.delete(), 5000)
	});

	if (player.twentyFourSeven) return;
	return player.destroy(false);
}