const formatDuration = require('../../models/FormatDuration.js');
const { KazagumoTrack } = require("kazagumo");

module.exports = (client) => {
    client.app.post('/playskip', async (req, res) => {
        const { guildId, songName } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");
        if (!songName) return res.status(400).send("Please provide a song name.");
        
        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            const result = await player.search(songName, { requester: req.body.requester });
            if (!result.tracks.length) return res.status(404).send("No results found!");
    
            if (result.type === "PLAYLIST") {
                const queues = player.queue.size;
                for (let track of result.tracks) player.queue.add(track);
                
                Playlist(player, queues);
    
                res.send({ content: `**Skipped • [${result.playlistName}](${songName})** \`${formatDuration(player.queue.durationLength)}\` (${result.tracks.length} tracks)` })
            } else {
                player.play(new KazagumoTrack(result.tracks[0].getRaw(), req.body.requester));
    
                res.send({ content: `**Skipped • [${result.tracks[0].title}](${result.tracks[0].uri})** \`${formatDuration(result.tracks[0].length)}\`` })
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};

function Playlist(player, queues) {
    let num = 0;
    for (let i = queues + 1; i < player.queue.size + 1; i++) {
        const song = player.queue[i - 1];
        player.queue.splice(i - 1, 1);
        player.queue.splice(num++, 0, song);
    }
    player.skip();
}