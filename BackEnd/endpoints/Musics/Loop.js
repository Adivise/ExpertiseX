module.exports = (client) => {
    client.app.post('/loop', async (req, res) => {
        const { guildId, loop } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send("No playing in this guild!");

            if (loop == 'track') { // loop current track
                if (player.loop === "none") {
                    player.setLoop("track");

                    return res.send({ content: `**Song is:** \`Loop\`` });
                } else {
                    player.setLoop("none")

                    return res.send({ content: `**Song is:** \`UnLoop\`` });
                }
            } else if (loop == 'queue') { // loop all
                if (player.loop === "queue") {
                    player.setLoop("none")

                    return res.send({ content: `**Queue is:** \`UnLoop\`` });
                } else {
                    player.setLoop("queue")

                    return res.send({ content: `**Queue is:** \`Loop\`` });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
}