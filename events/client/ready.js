const chalk = require('chalk');

module.exports = async (client) => {
    client.manager.init(client.user.id);
    process.title = `[ExpertiseX] - Connected ${client.user.tag}`;
    console.log(chalk.green(`[INFORMATION] ${client.user.tag} is ready!`));
    console.log(chalk.red("[WARNING] Do not break the Discord TOS or guidelines while using this selfbot."))
    console.log(chalk.red("[WARNING] I am not responsible if you get banned from Discord or any guilds."))
    console.log(chalk.red("[WARNING] If you do not agree with the above, close the console windown down now."))
};
