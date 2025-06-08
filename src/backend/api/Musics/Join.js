module.exports = (client) => {
    client.app.post('/join', async (req, res) => {
        const { guildId, voiceId } = req.body;

        if (client.stated == "streaming") return res.status(400).send("The bot is already streaming in voice channel.");

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");
        const channel = guild.channels.cache.get(voiceId);
        if (!channel || channel.type !== "GUILD_VOICE") return res.status(400).send("Please provide a valid voice channel ID.");

        try {
            client.manager.createPlayer({
                guildId: guildId,
                voiceId: voiceId,
                volume: 100,
                deaf: false
            });
            client.stated = "playing";

            res.send({ content: `**Joined:** \`${voiceId}\`` });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};