const { convertTime } = require("../../structures/Covert.js")

module.exports = { 
    config: {
        name: "play",
        description: "Play a song/playlist or search for a song from youtube",
        usage: "<results>",
        category: "Music",
        accessableby: "Member",
        aliases: ["p", "pplay"]
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

            const { channel } = message.member.voice;
            if(!channel) return msg.edit("*`You need to be in a voice channel.`*");

        if (!args[0]) return msg.edit("*`Please provide a song name or link to search.`*").then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });

        const player = await client.manager.create({
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

                msg.edit(`*\`Queued • ${res.tracks[0].title} [${convertTime(res.tracks[0].duration, true)}]\`* • ${res.tracks[0].requester.tag}`).then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });

                if(!player.playing) player.play();
            }
            else if(res.loadType == "PLAYLIST_LOADED") {
                player.queue.add(res.tracks)

                msg.edit(`*\`Queued • ${res.playlist.name} [${convertTime(res.playlist.duration)}] (${res.tracks.length} tracks)\`* • ${res.tracks[0].requester.tag}`).then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });

                if(!player.playing) player.play();
            }
            else if(res.loadType == "SEARCH_RESULT") {
                player.queue.add(res.tracks[0]);

                msg.edit(`*\`Queued • ${res.tracks[0].title} [${convertTime(res.tracks[0].duration, true)}]\`* • ${res.tracks[0].requester.tag}`).then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });

                if(!player.playing) player.play();
            }
            else if(res.loadType == "LOAD_FAILED") {
                return msg.edit("*`Error Loading Failed.`*").then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
            }
        }
        else {
            return msg.edit("*`Error No Matches.`*").then(msg => {
                setTimeout(() => msg.delete(), 5000)
            });
        }
    }
}