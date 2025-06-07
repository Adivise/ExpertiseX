module.exports = (client) => {
    client.app.post('/volume', async (req, res) => {
        const { guildId, volume } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            if (!volume) return res.status(404).send(`**Current volume:** \`${player.volume}%\``);
            if (volume <= 0 || volume > 100) return res.status(404).send(`Please provide a volume between 1 and 100.`);
    
            await player.setVolume(volume);
    
            return res.send({ content: `**Volume set to:** \`${volume}%\`` });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};