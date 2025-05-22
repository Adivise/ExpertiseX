require("dotenv").config();

module.exports = {
    LEAVE_EMPTY: process.env.LEAVE_EMPTY || 12000,
	NODES: [
        {
            name: process.env.NODE_NAME || 'NanoSpace',
            url: process.env.NODE_URL || 'localhost:5555',
            auth: process.env.NODE_AUTH || 'nanospace',
            secure: false
        }
    ]
}