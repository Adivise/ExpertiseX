module.exports = (client) => {
    client.app.post('/replay', async (req, res) => {
        const { guildId } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');
            if (!player.queue.current) return res.status(400).send('No songs are playing within this guild.');
            
            await player.seek(0);

            return res.send({ content: "**Song is now:** `Replay`" });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};