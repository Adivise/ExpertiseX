const formatDuration = require('../../structures/FormatDuration.js');

module.exports = (client) => {
    client.app.post('/queue', async (req, res) => {
        const { guildId } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");
        
        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send("No playing in this guild!");

            const songStrings = [];
            for (let i = 0; i < Math.min(player.queue.length, 10); i++) { // Adjusted to only show top 10 songs
                const song = player.queue[i];
                songStrings.push(`- **[${song.title}](${song.uri})** \`[${formatDuration(song.length)}]\``);
            }
            
            const str = songStrings.join('\n');
            const song = player.queue.current;

            return res.send({ content: `**Current Playing • [${song.title}](${song.uri})** \`[${formatDuration(song.length)}]\`\n\n**Rest of Queue:**\n${str || "Queue is Empty"}` });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};