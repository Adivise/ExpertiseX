require("dotenv").config();

module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN",  // your bot token
    PREFIX: process.env.PREFIX || ".", //<= default is .  // bot prefix

    AUTO_DELETE: parseBoolean(process.env.AUTO_DELETE || "true"), // Auto delete bot message!
    BOT_MSG: parseBoolean(process.env.BOT_MSG || "true"), // Playing, Ended, Faild, Error // message set to "false" to enabled message! "true" to disabled message!!

    OWNER_ID: process.env.OWNER_ID || "YOUR_CLIENT_ID", //your owner discord id example: "515490955801919488" this is not id like *Stylish.#4078
    LISTENING: process.env.LISTENING || ["515490955801919488", "1010450680852516864"], // if you want bot listening you commands only, you can put your id here  // example: ["515490955801919488", "543595284345782296"]

    NODES: [
      { 
        host: process.env.NODE_HOST || "localhost",
        port: parseInt(process.env.NODE_PORT || "5555"),
        password: process.env.NODE_PASSWORD || "123456",
      } 
    ],
}

function parseBoolean(value) {
  if (typeof (value) === 'string') {
      value = value.trim().toLowerCase();
  }
  switch (value) {
      case true:
      case "true":
          return true;
      default:
          return false;
  }
}