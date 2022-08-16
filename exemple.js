const db = require('../SQL');

db.query(`SELECT * FROM webhook WHERE discordid='${message.author.id}'`, function (err, results) {
    let prefix = results[0].nom
})

console.log(prefix)