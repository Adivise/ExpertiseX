require("dotenv").config();

module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN_BOT",
    PREFIX: process.env.PREFIX || "#",
    OWNER_ID: process.env.OWNER_ID || "YOUR_DISCORD_OWNER_ID",
    EMBED_COLOR: process.env.EMBED_COLOR || "#000001",
    SEARCH_ENGINE: process.env.SEARCH_ENGINE || "youtube", // default -- 'youtube' | 'soundcloud' | 'youtube_music'
    LISTENING: process.env.LISTENING || ["515490955801919488", "1010450680852516864"],
    LEAVE_EMPTY: process.env.LISTENING || 12000,
	NODES: [
        {
            name: process.env.NODE_NAME || 'NanoSpace',
            url: process.env.NODE_URL || 'localhost:5555',
            auth: process.env.NODE_AUTH || 'nanospace',
            secure: false
        }
    ]
}