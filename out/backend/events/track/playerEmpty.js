module.exports = async (client, player) => {
    if (player.data.get("stay")) return;
    player.destroy();
    client.stated = "none";
}