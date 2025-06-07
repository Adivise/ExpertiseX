// trackEnd event
module.exports = async (client, player) => {
    client.currentSong = {
        // infomation event
        eventId: Date.now(),
        eventType: 'playerEnd',
        timestamp: new Date().toISOString(),
        // infomation bot
        botId: client.user.id,
        botUsername: client.user.username,
        botAvatar: client.user.displayAvatarURL({ dynamic: true })
    }

    if (client.broadcastSongUpdate) {
        client.broadcastSongUpdate(client.currentSong);
    } else {
        console.error("[EVENT] broadcastSongUpdate function not found");
    }

    if (player.data.get("autoplay")) {
        const requester = player.data.get("requester");
        const identifier = player.data.get("identifier");
        const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
        const res = await player.search(search, { requester: requester });
        if (!res.tracks.length) return;
        await player.queue.add(res.tracks[2]);
    }
}