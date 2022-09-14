module.exports = async (client, message) => { 
    /// Delete bot message! after 8 seconds!
    if (client.config.AUTO_DELETE) {
      if (message.author.id === client.user.id) {
          await delay(5000);
          message.delete()
      }
    }

    if(message.author.bot || message.channel.type === "DM") return;

    let prefix = client.prefix;
	
    if (!client.listen.includes(message.author.id) && client.listen.length > 0) return; // console.log(`[INFORMATION] ${message.author.tag} Trying request the command!`); 

    const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(mention)) {
        message.channel.send(`*\`My prefix is\`* \`${prefix}\``);
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
      message.channel.send({ content: '*`Something went wrong.`*' });
    }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}