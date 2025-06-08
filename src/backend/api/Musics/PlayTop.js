const formatDuration = require('../../models/FormatDuration.js');

module.exports = (client) => {
    client.app.post('/playtop', async (req, res) => {
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
    
                res.send({ content: `**Shifted • [${result.playlistName}](${songName})** \`${formatDuration(player.queue.durationLength)}\` (${result.tracks.length} tracks)` })
            } else {
                player.queue.add(result.tracks[0]);
    
                Normal(player);
    
                res.send({ content: `**Shifted • [${result.tracks[0].title}](${result.tracks[0].uri})** \`${formatDuration(result.tracks[0].length)}\`` })
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};

function Normal(player) {
    const song = player.queue[player.queue.size - 1];
    player.queue.splice(player.queue.size - 1, 1);
    player.queue.splice(0, 0, song);
}

function Playlist(player, queues) {
    let num = 0;
    for (let i = queues; i < player.queue.size; i++) {
        const song = player.queue[i];
        player.queue.splice(i, 1);
        player.queue.splice(num++, 0, song);
    }
}