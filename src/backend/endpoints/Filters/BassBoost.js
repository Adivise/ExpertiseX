module.exports = (client) => {
    client.app.post('/bassboost', async (req, res) => {
        const { guildId, bassboost } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');
            if(bassboost > 10 || bassboost < -10) res.status(404).send(`Please enter a number between -10 - 10!`);

            const data = {
                equalizer: [
                    { band: 0, gain: bassboost / 10 },
                    { band: 1, gain: bassboost / 10 },
                    { band: 2, gain: bassboost / 10 },
                    { band: 3, gain: bassboost / 10 },
                    { band: 4, gain: bassboost / 10 },
                    { band: 5, gain: bassboost / 10 },
                    { band: 6, gain: bassboost / 10 },
                    { band: 7, gain: 0 },
                    { band: 8, gain: 0 },
                    { band: 9, gain: 0 },
                    { band: 10, gain: 0 },
                    { band: 11, gain: 0 },
                    { band: 12, gain: 0 },
                    { band: 13, gain: 0 },
                ]
            }
    
            await player.shoukaku.setFilters(data);
            return res.send({ content: "**Turned on filter:** `BassBoost` " + bassboost });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};