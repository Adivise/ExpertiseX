module.exports = async (client) => {
    console.log(`[INFO] - ${client.user.username} (${client.user.id}) is Ready!`);
    client.user.setSamsungActivity('com.YostarJP.BlueArchive', 'START');
};
