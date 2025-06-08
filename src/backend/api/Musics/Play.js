const formatDuration = require('../../models/FormatDuration.js');

module.exports = (client) => {
    client.app.post('/play', async (req, res) => {
        const { guildId, voiceId, songName } = req.body;

        if (client.stated == "streaming") return res.status(400).send("The bot is already streaming in voice channel.");

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");
        const channel = guild.channels.cache.get(voiceId);
        if (!channel || channel.type !== "GUILD_VOICE") return res.status(400).send("Please provide a valid voice channel ID.");

        if (!songName) return res.status(400).send("Please provide a song name.");
        
        try {
            const player = await client.manager.createPlayer({
                guildId: guildId,
                voiceId: voiceId,
                volume: 100,
                deaf: false
            });
            client.stated = "playing";

            let result = await player.search(songName, { requester: req.user });

            if (!result.tracks.length) return res.status(404).send("No results found!");

            if (result.type === "PLAYLIST") {
                result.tracks.forEach(track => player.queue.add(track));
                if (!player.playing && !player.paused) player.play();
                res.send({ content: `**Queued • [${result.playlistName}](${songName})** \`${formatDuration(result.tracks[0].length + player.queue.durationLength)}\` (${result.tracks.length} tracks)` });
            } else {
                player.queue.add(result.tracks[0]);
                if (!player.playing && !player.paused) player.play();
                res.send({ content: `**Queued • [${result.tracks[0].title}](${result.tracks[0].uri})** \`${formatDuration(result.tracks[0].length)}\`` });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};