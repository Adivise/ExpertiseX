module.exports = (client) => {
    client.app.post('/eightd', async (req, res) => {
        const { guildId } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            const data = {
                rotation: { rotationHz: 0.2 }
            };
    
            await player.shoukaku.setFilters(data);
            return res.send({ content: "**Turned on filter:** `8D`" });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};