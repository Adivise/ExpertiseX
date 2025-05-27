const { readdirSync, existsSync, mkdirSync } = require("fs");
const path = require("path");

module.exports = async (client) => {
    let count = 0; // ✅ Initialize count for loaded events

    const loadcommand = (dirs) => {
        const dirPath = path.join(__dirname, `../events/${dirs}`);

        // ✅ Ensure the directory exists before scanning
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true }); // ✅ Create directory if missing
            return; // ✅ Prevent further execution if directory was just created
        }

        const events = readdirSync(dirPath).filter((d) => d.endsWith(".js"));
        count += events.length; // ✅ Add all loaded files to count

        // ✅ Load each file
        events.forEach((file) => {
            const evt = require(path.join(dirPath, file));
            const eName = file.split(".")[0];
            client.on(eName, evt.bind(null, client));
        });
    };

    // ✅ Load all directories first
    ["client", "guild"].forEach(loadcommand);

    // ✅ Log only the final result after all directories are processed
    console.log(`Loaded events: ${count} total`);
};