const formatduration = require('../../structures/FormatDuration.js');
    
module.exports = async (client, player, track, payload) => {
    const channel = client.channels.cache.get(player.textChannel);

    await channel.send(`\`⏺\` *\`Starting playing... | ${track.title} [${formatduration(player.queue.duration)}]\`* • ${track.requester.tag}`).then(msg => {
        setTimeout(() => msg.delete(), 5000)
    });
}
