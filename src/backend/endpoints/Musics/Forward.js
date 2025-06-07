module.exports = (client) => {
    client.app.post('/forward', async (req, res) => {
        const { guildId, seconds } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            const newPosition = player.position + (seconds * 1000);
            if (newPosition < player.queue.current.length) {
                await player.seek(newPosition);
                const currentDuration = formatDuration(player.position);
                res.send({ content: `\`⏭\` | *Forwarded to:* \`${currentDuration}\`` });
            } else {
                res.status(400).send("Can't forward more than the duration of the song!");
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
}; 