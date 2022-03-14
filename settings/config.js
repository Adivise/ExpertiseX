require("dotenv").config();

module.exports = {
    TOKEN: process.env.TOKEN || "YOUR_TOKEN",  // your bot token
    PREFIX: process.env.PREFIX || ".", //<= default is .  // bot prefix

    OWNER_ID: process.env.OWNER_ID || "YOUR_CLIENT_ID", //your owner discord id example: "515490955801919488" this is not id like *Stylish.#4078
    DEV_ID: process.env.DEV_ID || ["515490955801919488", "908006641155309619"], // if you want to use command bot only, you can put your id here  // example: ["515490955801919488", "543595284345782296"]

    NODES: [
      { 
        host: process.env.NODE_HOST || "localhost",
        port: parseInt(process.env.NODE_PORT || "5555"),
        password: process.env.NODE_PASSWORD || "123456",
      } 
    ],
}
