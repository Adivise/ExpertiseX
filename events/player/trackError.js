module.exports = async (client, player, track, payload) => {
    if(client.config.BOT_MSG) {
        const channel = client.channels.cache.get(player.textChannel);
        await channel.send("\`❌\` | Song has error, auto leaving...`");
    }

    console.log(`[ERROR] Error when loading song! Track is error in [${player.guild}]`);
    if (!player.voiceChannel) player.destroy();
}