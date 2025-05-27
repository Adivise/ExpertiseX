module.exports = (client) => {
    client.app.post('/pause', async (req, res) => {
        const { guildId, pause } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            await player.pause(pause);
            const uni = player.paused ? `Paused` : `Resumed`;
    
            return res.send({ content: `**Song is now:** \`${uni}\`` });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};