module.exports = async (client, message) => { 
    if(message.author.bot || message.channel.type === 1) return;

	if (!client.listen.includes(message.author.id) && client.listen.length > 0) return;
	
    const prefix = client.prefix;

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if(message.content.match(mention)) {
      message.channel.send({ content: `My prefix is: \`${prefix}\`` })
    };
    
    const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
    if (!prefixRegex.test(message.content)) return;
    const [ matchedPrefix ] = message.content.match(prefixRegex);
    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if(!command) return;

    console.log(`[COMMAND] - ${command.config.name} executed by ${message.author.tag} | ${client.user.username} in ${message.guild.name} (${message.guild.id})`);

    try {
      if (command.ownerOnly) {
        if (message.author.id !== client.owner) {
            return message.channel.send(`${message.author}, You are not the owner!`);
        }
    }
      command.run(client, message, args);
    } catch (error) {
      console.log(error)
      await message.channel.send(`${message.author}, an error occured!`);
    }
}