const fs = require('fs');
const config = require('../config')
const db = require("../utils/connectMYSQL");
const date = require('date-and-time');
const Logger = require("../utils/Logger");

module.exports = {
    name: "runtupper",
    roles: [config.perms['mecano']],
    description: "Insère dans la BDD toutes les données dans tupper.json",
    dmPermission: false,
    hidden: false,
    helpType: "fun",
    async runInteraction(client, interaction) {
        let rawdata = fs.readFileSync('tupper.json');
        let student = JSON.parse(rawdata);
        let req = ''
        for (st in student) {
            for (element in student[st]) {
                    let name = student[st][element].name.replace(/'/, /\'/).trim()
                    let prefix = student[st][element].brackets[0].trim()
                    if (prefix.length == 0) {
                        prefix = student[st][element].brackets[1].trim()
                    }
                    let avatar_url = student[st][element].avatar_url.trim()
                    let created_at = student[st][element].created_at
                    let user_id = student[st][element].user_id

                    req = (`INSERT INTO webhook SET nom = ${db.escape(name)}, prefix = ${db.escape(prefix)}, iconURL = ${db.escape(avatar_url).trim()}, date=${db.escape(date.format(new Date(created_at), 'YYYY-MM-DD HH:mm:ss'))}, discordid=${db.escape(user_id)};`)

                    await interaction.channel.send(req)
            }
        }
    },

}
