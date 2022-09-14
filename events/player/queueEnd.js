module.exports = async (client, player) => {
	if(client.config.BOT_MSG) {
		const channel = client.channels.cache.get(player.textChannel);
		await channel.send(`\`📛\` | *Song has been:* \`Ended\``);
	}

	if (player.twentyFourSeven) return;
	return player.destroy();
}	