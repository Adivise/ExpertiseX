const { readdirSync } = require("fs");

module.exports = (client) => {
    const load = (dirs) => {
        const endpoints = readdirSync(`./endpoints/${dirs}/`).filter(file => file.endsWith('.js'));
        for (let file of endpoints) {
            require(`../endpoints/${dirs}/${file}`)(client);
        }
    };
    ["Musics", "Specials", "Filters", "Utils"].forEach(x => load(x));
};