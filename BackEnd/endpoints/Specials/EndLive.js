module.exports = (client) => {
    client.app.post('/endlive', async (req, res) => {
        const { guildId } = req.body;

        // check if stated is streaming = run command
        if (client.stated != "streaming") return res.status(400).send('The bot is not streaming in a voice channel.');
        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");
        if (guild.me.voice.streaming != true) return res.status(400).send('The bot is not in a voice channel.');

        try {

            client.voice.connection.disconnect()
            client.stated = "none";

            res.send({ content: `**Successfully ended the live stream in the voice channel.**` });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};