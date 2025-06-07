const { readdirSync, existsSync, mkdirSync } = require("fs");
const path = require("path");

module.exports = (client) => {
    let count = 0; // ✅ Initialize count for loaded endpoints

    const load = (dirs) => {
        const dirPath = path.join(__dirname, `../endpoints/${dirs}`);

        // ✅ Ensure the directory exists before scanning
        if (!existsSync(dirPath)) {
            mkdirSync(dirPath, { recursive: true }); // ✅ Create directory if missing
            return; // ✅ Prevent further execution if directory was just created
        }

        const endpoints = readdirSync(dirPath).filter((file) => file.endsWith(".js"));
        count += endpoints.length; // ✅ Add all loaded files to count

        // ✅ Load each file
        endpoints.forEach((file) => {
            require(path.join(dirPath, file))(client);
        });
    };

    // ✅ Load all directories first
    ["Musics", "Specials", "Filters", "Utils"].forEach(load);

    // ✅ Log only the final result after all directories are processed
    console.log(`Loaded endpoints: ${count} total`);
};