module.exports = async (client, player, track, payload) => {
    const channel = client.channels.cache.get(player.textChannel);

    channel.send("\`❌\` | Song has stuck, auto leaving...`").then(msg => {
        setTimeout(() => msg.delete(), 5000)
    });
    
    console.log(`[ERROR] Error when loading song! Track is stuck in [${player.guild}]`);
    if (!player.voiceChannel) player.destroy();

}