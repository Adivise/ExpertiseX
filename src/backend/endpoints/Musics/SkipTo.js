module.exports = (client) => {
    client.app.post('/skipto', async (req, res) => {
        const { guildId, position } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send('No player found for this guild!');

            if ((position > player.queue.size) || (position && !player.queue[position - 1])) {
                return res.status(400).send("You can't skip to a song that doesn't exist!");
            }

            if (position == 1) {
                player.skip();
            } else {
                await player.queue.splice(0, position - 1);
                await player.skip();
            }

            res.send({ content: `\`⏭\` | *Skip to:* \`${position}\`` });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
}; 