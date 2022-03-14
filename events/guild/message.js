const chalk = require('chalk');

module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === "dm") return;

    let prefix = client.prefix;
	
	if (!client.dev.includes(message.author.id) && client.dev.length > 0) { 
		console.log(chalk.red(`[INFORMATION] ${message.author.tag} Trying request the command!`)); 
		return;
    }

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
	if (message.content.match(mention)) {
		message.channel.send(`**My prefix is \`${prefix}\`**`).then(msg => {
			setTimeout(() => msg.delete(), 5000)
		});
	};

    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [ matchedPrefix ] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if(!command) return;

    try {
			command.run(client, message, args, prefix)
      } catch (error) {
        console.log(error)
        message.channel.send({ content: 'Something went wrong.' }).then(msg => {
			setTimeout(() => msg.delete(), 5000)
		});
    }
}