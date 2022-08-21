const fs = require('fs');
const config = require('../config')
const db = require("../utils/connectMYSQL");
const date = require('date-and-time');
const Logger = require("../utils/Logger");

module.exports = {
    name: "runtupper",
    description: "Insère dans la BDD toutes les données dans tupper.json",
    dmPermission: false,
    hidden: false,
    helpType: "fun",
    async runInteraction(client, interaction) {
        try { eval('config.guild_' + interaction.guild.id + ".perms['mecano']") } catch (err) { return Logger.debug('fatal error occured:' + err) }
        if (!interaction.member.roles.cache.some(r => eval('config.guild_' + interaction.guild.id + ".perms['mecano']").includes(r.id))) { return interaction.reply({ content: `Vous n'avez pas les permissions nécessaires !`, ephemeral: true }) }
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

                req = req + `INSERT INTO webhook SET nom = ${db.escape(name)}, prefix = ${db.escape(prefix)}, iconURL = ${db.escape(avatar_url)}, date=${db.escape(date.format(new Date(created_at), 'YYYY-MM-DD HH:mm:ss'))}, discordid=${db.escape(user_id)};`
            }
        }
        // await db.query(req)
        console.log(req)
    },
}
