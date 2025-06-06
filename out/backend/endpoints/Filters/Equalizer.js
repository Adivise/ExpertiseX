module.exports = (client) => {
    client.app.post('/equalizer', async (req, res) => {
        try {
            const { guildId, bands } = req.body;
            if (!guildId) {
                return res.status(400).json({ content: 'Please provide a guild ID.' });
            }

            const player = client.manager.players.get(guildId);
            if (!player) {
                return res.status(400).json({ content: 'No music is playing in this guild.' });
            }

            if (bands === 'reset') {
                await player.shoukaku.setFilters({});
                return res.json({ content: '`🔩` | *Equalizer has been reset.*' });
            }

            const bandValues = bands.split(/[ ]+/);
            let bandsStr = '';

            // Validate bands
            for (let i = 0; i < bandValues.length; i++) {
                if (i > 13) break;
                if (isNaN(bandValues[i])) {
                    return res.status(400).json({ content: `Band #${i + 1} is not a valid number.` });
                }
                if (bandValues[i] > 10) {
                    return res.status(400).json({ content: `Band #${i + 1} must be less than 10.` });
                }
                bandsStr += `${bandValues[i]} `;
            }

            // Apply all bands at once
            const equalizerBands = bandValues.slice(0, 14).map((value, index) => ({
                band: index,
                gain: value / 10
            }));

            await player.shoukaku.setFilters({
                equalizer: equalizerBands
            });

            res.json({ content: `\`🔩\` | *Equalizer set to:* \`${bandsStr.trim()}\`` });
        } catch (error) {
            console.error('Error in /equalizer endpoint:', error);
            res.status(500).json({ content: `Error: ${error.message}` });
        }
    });
};