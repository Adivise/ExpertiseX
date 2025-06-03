module.exports = (client) => {
    client.app.post('/logout', async (req, res) => {
        try {
            await client.destroy(); // Cleanly stop bot session
            process.exit(0);
        } catch (error) {
            console.log(`Logout error: ${error.message}`);
        }
    });
};