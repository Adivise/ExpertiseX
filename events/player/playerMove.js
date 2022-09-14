module.exports = async (client, player, oldChannel, newChannel) => {
  const guild = client.guilds.cache.get(player.guild)
    if(!guild) return;
    if(oldChannel === newChannel) return;
    
  if(newChannel === null || !newChannel) {
    if(!player) return;
    return player.destroy();
  } else {
    player.voiceChannel = newChannel;
    return player.destroy();
  }
}