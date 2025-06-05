// trackStart event
module.exports = async (client, player, track) => {
    client.currentSong = {
        // infomation event
        eventId: Date.now(), // Unique event ID
        eventType: 'playerStart',
        timestamp: new Date().toISOString(),
        // infomation track
        name: track.title,
        url: track.uri,
        duration: track.length,
        thumbnail: track.thumbnail,
        author: track.author,
        // infomation bot
        botId: client.user.id,
        botUsername: client.user.username,
        botAvatar: client.user.displayAvatarURL({ dynamic: true })
    };
    
    // Broadcast the song update to all connected clients
    if (client.broadcastSongUpdate) {
        client.broadcastSongUpdate(client.currentSong);
    } else {
        console.error("[EVENT] broadcastSongUpdate function not found on client");
    }
};