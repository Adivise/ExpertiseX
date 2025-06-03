module.exports = (client) => {
    client.app.post('/directmessage', async (req, res) => {
        const { userId, message } = req.body;

        if (!userId) return res.status(400).send("Please provide a valid user ID.");
        if (!message) return res.status(400).send("Please provide a message.");
        if (message.length > 2000) return res.status(400).send("Message cannot be longer than 2000 characters.");

        const user = await client.users.fetch(userId);
        try {
            user.send(message);
            res.send({ content: `**Successfully sent a direct message to ${user.username}.**` });
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};