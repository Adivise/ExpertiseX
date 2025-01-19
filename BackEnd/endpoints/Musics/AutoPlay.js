module.exports = (client) => {
    client.app.post('/autoplay', async (req, res) => {
        const { guildId, autoplay } = req.body;

        const guild = client.guilds.cache.get(guildId);
        if (!guild) return res.status(400).send("Please provide a valid guild ID.");

        try {
            const player = client.manager.players.get(guildId);
            if (!player) return res.status(404).send("No playing in this guild!");

            if (!autoplay) { // get undifined = turn on + set data
                await player.data.set("autoplay", false);
                await player.queue.clear();
                
                res.send({ content: "**Autoplay is now:** `Off`" });
            } else {
                if (player.queue.size < 1) return res.status(400).send("No songs are playing within this guild.");
                const identifier = player.queue.current.identifier;
                const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
                const result = await player.search(search, { requester: req.body.requester });
                if (!result.tracks.length) return res.status(404).send(`Engine \`${player.queue.current.sourceName}\` not support!`);
    
                await player.data.set("autoplay", true);
                await player.data.set("requester", req.body.requester);
                await player.data.set("identifier", identifier);
                await player.queue.add(result.tracks[1]);
    
                res.send({ content: "**Autoplay is now:** `On`" });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};