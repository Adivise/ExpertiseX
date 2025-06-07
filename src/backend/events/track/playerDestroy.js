// playerDestroy event
module.exports = async (client, player) => {
    client.currentSong = {
        // infomation event
        eventId: Date.now(),
        eventType: 'playerDestroy',
        timestamp: new Date().toISOString(),
        // infomation bot
        botId: client.user.id,
        botUsername: client.user.username,
        botAvatar: client.user.displayAvatarURL({ dynamic: true })
    };

    if (client.broadcastSongUpdate) {
        client.broadcastSongUpdate(client.currentSong);
    } else {
        console.error("[EVENT] broadcastSongUpdate function not found");
    }
}