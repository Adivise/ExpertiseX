module.exports = (client) => {
    client.app.post('/seek', async (req, res) => {
        const { guildId, seconds } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            if (seconds * 1000 >= player.queue.current.length || seconds < 0) {
                return res.status(400).send("You can't seek more than the duration of the song!");
            }

            await player.seek(seconds * 1000);
            const Duration = formatDuration(player.position);
            res.send({ content: `\`⏮\` | *Seek to:* \`${Duration}\`` });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
}; 