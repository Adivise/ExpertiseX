module.exports = async (client, player) => {
    const channel = client.channels.cache.get(player.textId);
    if (!channel) return;
    
    if (player.data.get("stay")) return;

    channel.send({ content: "**Queue is Empty!**" });
    return player.destroy();
}