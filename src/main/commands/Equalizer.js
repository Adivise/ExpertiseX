const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: ["equalizer"],
    description: 'Custom Equalizer!',
    category: "Filter",
    run: async (client, message, args) => {
        const player = client.manager.players.get(message.guild.id);
        if (!player) return message.reply(`No playing in this guild!`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.members.me.voice.channel) return message.reply(`I'm not in the same voice channel as you!`);

        const value = args.join(' ');

        if (!value) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Custom Equalizer`, iconURL: client.user.displayAvatarURL() })
                .setColor(client.color)
                .setDescription(`There are 14 bands that can be set from -10 to 10. Not all bands have to be filled out.`)
                .addFields({ name: `Example:`, value: `${client.prefix}eq 2 3 0 8 0 5 0 -5 0 0`, inline: false })
                .setFooter({ text: `Reset equalizer type: ${client.prefix}eq reset` });

            return message.reply({ embeds: [embed] });
        }

        if (value === 'off' || value === 'reset') {
            const data = {};
            await player.shoukaku.setFilters(data);
            return message.reply(`\`🔩\` | *Equalizer has been reset.*`);
        }

        const bands = value.split(/[ ]+/);
        let bandsStr = '';

        // Validate bands
        for (let i = 0; i < bands.length; i++) {
            if (i > 13) break;
            if (isNaN(bands[i])) return message.reply(`Band #${i + 1} is not a valid number.`);
            if (bands[i] > 10) return message.reply(`Band #${i + 1} must be less than 10.`);
        }

        // Apply bands
        for (let i = 0; i < bands.length; i++) {
            if (i > 13) break;
            const data = {
                equalizer: [
                    { band: i, gain: (bands[i]) / 10 },
                ]
            };
            await player.shoukaku.setFilters(data);
            bandsStr += `${bands[i]} `;
        }

        await message.reply(`Setting **Equalizer** to... \`${bandsStr}\` This may take a few seconds...`);

        const embed = new EmbedBuilder()
            .setDescription(`\`🔩\` | *Equalizer set to:* \`${bandsStr}\``)
            .setColor(client.color);

        await delay(5000);
        return message.editReply({ content: " ", embeds: [embed] });
    }
};

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 