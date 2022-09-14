const { convertTime } = require("../../structures/Covert.js");
const { Message } = require("discord.js-selfbot-v13");

module.exports = { 
    config: {
        name: "search",
        description: "Play a song/playlist or search for a song from youtube",
        usage: "<results>",
        category: "Music",
        accessableby: "Member",
    },
    /**
     * 
     * @param {Message} message 
     * @returns 
     */
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

        const { channel } = message.member.voice;
        if(!channel) return msg.edit("*`You need to be in a voice channel.`*");
        const BotVC = message.guild.me.voice.channel;
        if (BotVC && BotVC !== channel) return msg.edit("*`I'm not in the same voice channel as you!`*");

        if (!args[0]) return msg.edit("*`Please provide a song name or link to search.`*");

        const player = client.manager.create({
            guild: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            selfDeafen: false,
        });

        const search = args.join(" ");

        const state = player.state;
        if (state != "CONNECTED") await player.connect();
        const res = await client.manager.search(search, message.author);

        if(res.loadType != "NO_MATCHES") {
            if(res.loadType == "TRACK_LOADED") {
                player.queue.add(res.tracks[0]);

                msg.edit(`*\`Queued • ${res.tracks[0].title} ${convertTime(res.tracks[0].duration, true)}\`* • ${res.tracks[0].requester.tag}`);

                if (!player.playing) player.play()
            }
            else if(res.loadType == "SEARCH_RESULT") {
                const results = res.tracks.slice(0, 5).map((video, index) => `*\`(${++index}.) ${video.title} ${convertTime(video.duration)} Author: ${video.author}\`*`).join("\n");
                await msg.edit(results);

                const filter = (m) => m.author.id === message.author.id && /^(\d+|cancel)$/i.test(m.content);
                    /// Use *let* to force! require!
                let collected;
                try {
                    collected = await message.channel.awaitMessages({ filter: filter, time: 30000, max: 1, errors: ["time"] });
                } catch (e) {
                    await player.destroy();
                    return message.channel.send("`*No Track Selected.*`");
                }

                // Get message content from user!
                const content = collected.first().content;

                // content == cancel
                if (content.toLowerCase() == "cancel") {
                    await player.destroy();
                    return message.channel.send("`*Selection Cancelled.*`");
                }

                // content == 1 - 5!
                const index = Number(content) - 1;
                if (index < 0 || index > 5 - 1) return message.channel.send("*`Please Select Track 1-5*`");

                const track = res.tracks[index];
                await player.queue.add(track);

                message.channel.send(`*\`Queued • ${track.title} ${convertTime(track.duration)} \`* • ${track.requester.tag}`);

                if(!player.playing) player.play();
            }
            else if(res.loadType == "PLAYLIST_LOADED") {
                player.queue.add(res.tracks)

                msg.edit(`*\`Queued • ${res.playlist.name} [${convertTime(res.playlist.duration)}] (${res.tracks.length} tracks)\`* • ${res.tracks[0].requester.tag}`);

                if(!player.playing) player.play();
            }
            else if(res.loadType == "LOAD_FAILED") {
                await player.destroy();
                return msg.edit("*`Error Loading Failed.*`");
            }
        }
        else {
            await player.destroy();
            return msg.edit("*`Error No Matches.`*");
        }
    }
}