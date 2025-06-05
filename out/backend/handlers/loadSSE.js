const sse = new Set();

module.exports = (client) => {
    // Add SSE endpoint
    client.app.get('/song-events', (req, res) => {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write('event: connected\ndata: connected\n\n');
        sse.add(res);
        req.on('close', () => {
            sse.delete(res);
        });
        console.log('[SSE] New client connected', sse.size);
    });
    // Add broadcast function to client
    client.broadcastSongUpdate = (songData) => {
        if (sse.size === 0) return;
        sse.forEach(client => {
            try {
                const message = `event: ${songData.eventType}\ndata: ${JSON.stringify(songData)}\n\n`;
                client.write(message);
            } catch (error) {
                sse.delete(client);
            }
        });
        console.log('[SSE] Broadcasting song update', sse.size);
    };
};