module.exports = { 
    config: {
        name: "autoplay",
        description: "Auto play music in voice channel!",
        accessableby: "Member",
        category: "Music"
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

        const player = client.manager.get(message.guild.id);
        if(!player) return msg.edit(`*\`No song/s currently playing within this guild.\`*`);
        const { channel } = message.member.voice;
        if (!channel || message.member.voice.channel !== message.guild.me.voice.channel) return msg.edit(`*\`You need to be in a same/voice channel.\`*`);

        const autoplay = player.get("autoplay");

        if (autoplay === true) {
            await player.set("autoplay", false);
            await player.queue.clear();

            return msg.edit("\`📻\` | *Autoplay has been:* `Deactivated`");
        } else {
            const identifier = player.queue.current.identifier;
            const search = `https://www.youtube.com/watch?v=${identifier}&list=RD${identifier}`;
            const res = await player.search(search, message.author);

            await player.set("autoplay", true);
            await player.set("requester", message.author);
            await player.set("identifier", identifier);
            await player.queue.add(res.tracks[1]);

            return msg.edit("\`📻\` | *Autoplay has been:* `Activated`");
        }
    }
};