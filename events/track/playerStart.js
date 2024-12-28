const formatduration = require("../../structures/FormatDuration.js");

module.exports = async (client, player, track) => {
    client.channels.cache.get(player.textId)?.send({ content: `**Playing • [${track.title}](<${track.uri}>)** \`${formatduration(track.length, true)}\` • ${track.requester}` });
}