module.exports = (client) => {
    client.app.post('/remove', async (req, res) => {
        const { guildId, position } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            if (position > player.queue.size) {
                return res.status(400).send("Song not found.");
            }

            const song = player.queue[position - 1];
            await player.queue.splice(position - 1, 1);

            res.send({ 
                content: `**Removed • [${song.title}](${song.uri})** \`${convertTime(song.length, true)}\` • ${song.requester}`
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
}; 