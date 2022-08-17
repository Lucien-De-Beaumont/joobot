const fs = require('fs');
const config = require('../config')
const db = require("../utils/connectMYSQL");
const date = require('date-and-time');

module.exports = {
    name: "runtupper",
    description: "Insère dans la BDD toutes les données dans tupper.json",
    role: [config.dev['Mécano']],
    hidden: false,
    helpType: "fun",
    underConstruction: true,
    async run(client, message) {
        let rawdata = fs.readFileSync('tupper.json');
        let student = JSON.parse(rawdata);
        let req = ''
        let prefix
        setTimeout(() => {
            for (st in student) {
                for (element in student[st]) {
                    let name = student[st][element].name.replace("'", "\\'").trim()
                    prefix = student[st][element].brackets[0].trim()
                    if (prefix.length = 0) {
                        prefix = student[st][element].brackets[1].trim()
                    }
                    let avatar_url = student[st][element].avatar_url.trim()
                    let created_at = student[st][element].created_at.trim()
                    let user_id = student[st][element].user_id.trim()

                    req = req + `INSERT INTO webhook SET nom = '${db.escape(name)}', prefix = '${db.escape(prefix)}', iconURL = '${db.escape(avatar_url)}', date='${db.escape(date.format(new Date(created_at), 'YYYY-MM-DD HH:mm:ss'))}', discordid='${db.escape(user_id)}';`
                    // db.query(`INSERT INTO webhook SET nom = '${name}', prefix = '${prefix}', iconURL = '${avatar_url}', date='${date.format(new Date(created_at), 'YYYY-MM-DD HH:mm:ss')}', discordid='${user_id}'`, function (err, results) {
                    //     if (err) { return console.log(err) }
                    // })
                }
            }
            console.log(req)
        }, 100)
    },
}
