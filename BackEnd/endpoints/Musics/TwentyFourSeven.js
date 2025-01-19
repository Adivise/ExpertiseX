module.exports = (client) => {
    client.app.post('/twentyfourseven', async (req, res) => {
        const { guildId, twentyfourseven } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            if (!twentyfourseven) { // get undefined = turn on + set data
                await player.data.set("stay", false);
    
                return res.send({ content: "*24/7 is now:** `Off`" });
            } else {
                await player.data.set("stay", true);
    
                return res.send({ content: "*24/7 is now:** `On`" });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};