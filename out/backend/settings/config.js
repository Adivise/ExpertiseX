require("dotenv").config();

module.exports = {
    LEAVE_EMPTY: process.env.LEAVE_EMPTY,
	NODES: [
        {
            name: process.env.NODE_NAME,
            url: process.env.NODE_URL,
            auth: process.env.NODE_AUTH,
            secure: false
        }
    ]
}