module.exports = (client) => {
    client.app.post('/golive', async (req, res) => {
        const { voiceId, linkUrl } = req.body;

        if (client.stated != "none") return res.status(400).send('The bot is already playing/streaming in a voice channel.');

        const channel = client.channels.cache.get(voiceId);
        if (!channel || channel.type !== "GUILD_VOICE") return res.status(400).send('Please provide a valid voice channel ID.');

        if (!linkUrl) return res.status(400).send('Please provide a link video.');
        if (!linkUrl.startsWith('http')) return res.status(400).send('Please provide a valid link video.');
        if (!linkUrl.endsWith('.mp4')) return res.status(400).send('Please provide a valid link video.');

        try {
            const connection = await client.voice.joinChannel(channel, {
                selfMute: false,
                selfDeaf: false,
                selfVideo: false,
                videoCodec: 'H264',
            });
            const stream = await connection.createStreamConnection();
            const dispatcher = stream.playVideo(linkUrl, {
                fps: 60,
                bitrate: 4000,
            });
            const dispatcher2 = stream.playAudio(linkUrl);
            dispatcher.on('start', () => {
                client.stated = "streaming";
                res.send({ content: `**Started streaming:** \`${linkUrl}\`` });
            });
        
            dispatcher.on('finish', () => {
                client.voice.connection.disconnect();
                client.stated = "none";
            });
            dispatcher.on('error', console.error);
        
            dispatcher2.on('start', () => {
                //console.log('audio is now playing!');
            });
        
            dispatcher2.on('finish', () => {
                //console.log('audio has finished playing!');
            });
            dispatcher2.on('error', console.error);

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};