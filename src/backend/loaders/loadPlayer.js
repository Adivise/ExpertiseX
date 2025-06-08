const { readdirSync, existsSync, mkdirSync } = require("fs");
const path = require("path");

let count = 0; // ✅ Initialize count for loaded endpoints

module.exports = async (client) => {
    const dirPath = path.join(__dirname, "../listeners/player");

    // ✅ Ensure the directory exists before scanning
    if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true }); // ✅ Create directory if missing
        //console.log(`📁 Created missing directory: ${dirPath}`);
        return; // ✅ Prevent execution if directory was just created
    }

    try {
        const eventFiles = readdirSync(dirPath).filter((file) => file.endsWith(".js"));

        eventFiles.forEach((file) => {
            const event = require(path.join(dirPath, file));
            const eventName = file.split(".")[0];
            client.manager.shoukaku.on(eventName, event.bind(null, client));
            count++; // ✅ Increment count for each loaded event
        });
    } catch (e) {
        console.error(`❌ Error loading player events:`, e);
    }
    console.log(`Loaded player events: ${count} total`); // ✅ Debugging player event loading
};