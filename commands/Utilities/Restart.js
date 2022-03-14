const chalk = require('chalk');

module.exports = {
    config: {
        name: "restart",
        description: "shuts down the client!",
        usage: "shutdown",
        category: "Utilities",
        accessableby: "Owner",
        aliases: ["stopbot"]
    },
    run: async (client, message, args, prefix) => {
    if(message.author.id != client.owner) return message.channel.send("You're not the client owner!").then(msg => {
        setTimeout(() => msg.delete(), 5000)
    });

        await console.log(chalk.red(`[CLIENT] Restarting...`));

        process.exit();
    }
};