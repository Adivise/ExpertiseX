module.exports = (client) => {
    client.app.post('/logout', async (req, res) => {
        try {
            await client.destroy(); // Cleanly stop bot session
            // Give a small delay to ensure response is sent before exiting
            setTimeout(() => process.exit(0), 100);
        } catch (error) {
            console.log(`Logout error: ${error.message}`);
            res.status(500).json({ content: 'Error during logout' });
        }
    });
};