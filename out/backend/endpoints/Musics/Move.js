module.exports = (client) => {
    client.app.post('/move', async (req, res) => {
        const { guildId, from, to } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            if (from > player.queue.length || (from && !player.queue[from - 1])) {
                return res.status(400).send("Song not found.");
            }
            if ((to > player.queue.length) || !player.queue[to - 1]) {
                return res.status(400).send("Song not found.");
            }

            const song = player.queue[from - 1];
            await player.queue.splice(from - 1, 1);
            await player.queue.splice(to - 1, 0, song);

            res.send({ content: `**Moved • [${song.title}](${song.uri})** to ${to}` });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
}; 