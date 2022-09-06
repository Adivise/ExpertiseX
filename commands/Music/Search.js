const { convertTime } = require("../../structures/Covert.js");

module.exports = { 
    config: {
        name: "search",
        description: "Play a song/playlist or search for a song from youtube",
        usage: "<results>",
        category: "Music",
        accessableby: "Member",
    },
    run: async (client, message, args, prefix) => {
        const msg = await message.channel.send(`*\`Loading please wait...\`*`);

        console.log("Hey seach command is error have right? nah give a shit don't care this error this error not effect this bot!")

        const { channel } = message.member.voice;
        if(!channel) return msg.edit("*`You need to be in a voice channel.`*");

        if (!args[0]) return msg.edit("*`Please provide a song name or link to search.`*").then(msg => {
            setTimeout(() => msg.delete(), 5000)
        });

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

                    msg.edit(`*\`Queued • ${res.tracks[0].title} ${convertTime(res.tracks[0].duration, true)}\`* • ${res.tracks[0].requester.tag}`).then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    });
                    if (!player.playing) player.play()
            }
                else if(res.loadType == "SEARCH_RESULT") {
                    let index = 1;
                    const tracks = res.tracks.slice(0, 5);

                    const results = res.tracks
                        .slice(0, 5)
                        .map(video => `*\`(${index++}.) ${video.title} ${convertTime(video.duration)} Author: ${video.author}\`*`)
                        .join("\n");

                    await msg.edit(results);

                    const collector = message.channel.createMessageCollector(m => {
                        return m.author.id === message.author.id && new RegExp(`^([1-5]|cancel)$`, "i").test(m.content)
                    }, { time: 30000, max: 1 });

                    collector.on("collect", async (m) => {
                        if (/cancel/i.test(m.cleanContent)) return;

                        const resulted = Number(m.cleanContent) - 1;

                        /// i give a shit error // RangeError: Provided argument must be present.
                        let track = await tracks[resulted];
                        await player.queue.add(track);

                        msg.edit(`*\`Queued • ${track.title} ${convertTime(track.duration)} \`* • ${track.requester.tag}`).then(msg => {
                            setTimeout(() => msg.delete(), 5000)
                        });

                        if(!player.playing) player.play();
                    });

                    collector.on("end", async (collected, reason) => {
                        if(reason === "time") {
                            await player.destroy();
                            return msg.edit("`*No Track Selected.*`").then(msg => {
                                setTimeout(() => msg.delete(), 5000)
                            });
                        }
                    });
            }
                else if(res.loadType == "PLAYLIST_LOADED") {
                    let search = await player.search(args.join(" "), message.author);
                    player.queue.add(search.tracks)

                    msg.edit(`*\`Queued • ${search.playlist.name} ${convertTime(search.playlist.duration)} (${search.tracks.length} tracks) \`* • ${search.tracks[0].requester.tag}`).then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    });
                    if(!player.playing) player.play()
            }
                else if(res.loadType == "LOAD_FAILED") {
                    await player.destroy();
                    return msg.edit("*`Error Loading Failed.*`").then(msg => {
                        setTimeout(() => msg.delete(), 5000)
                    });
                }
            }
            else {
                await player.destroy();
                return msg.edit("*`Error No Matches.`*").then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                });
            }
        }
    }