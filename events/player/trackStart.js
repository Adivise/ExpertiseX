const formatduration = require('../../structures/FormatDuration.js');
    
module.exports = async (client, player, track, payload) => {
    if(client.config.BOT_MSG) return;

    const channel = client.channels.cache.get(player.textChannel);
    await channel.send(`\`⏺\` *\`Starting playing... | ${track.title} [${formatduration(player.queue.duration)}]\`* • ${track.requester.tag}`);
}