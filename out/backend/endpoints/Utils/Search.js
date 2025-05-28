module.exports = (client) => {
    client.app.get('/search', async (req, res) => {
        const { q } = req.query;
        if (!q) return;
        try {
            let result = await client.manager.search(q, { requester: req.user });
            if (!result.tracks.length) return;

            const songs = result.tracks.map(track => ({
                name: track.title,
                url: track.uri,
                duration: track.length
            }));

            res.send({ songs });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};
