module.exports = (client) => {
    client.app.post('/logout', async (req, res) => {
        try {
            await client.destroy(); // Cleanly stop bot session
            console.log("Bot has been logged out.");

            // Give a success response before exiting
            res.status(200).json({ content: 'Bot is shutting down...' });

            // Exit process after a delay to ensure cleanup
            setTimeout(() => process.exit(0), 1000);
        } catch (error) {
            console.error(`Logout error: ${error.message}`);
            res.status(500).json({ content: `Failed to logout bot.` });
        }
    });
};