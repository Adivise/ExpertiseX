module.exports = (client) => {
    client.app.post('/earrape', async (req, res) => {
        const { guildId } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            const data = {}

            await player.shoukaku.setFilters(data);
            await player.setVolume(500);
            return res.send({ content: "**Turned on filter:** `Bass`" });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};