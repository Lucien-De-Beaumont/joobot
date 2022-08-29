const Logger = require("../utils/Logger");
const Discord = require('discord.js');
const config = require('../config');
const cron = require('cron');
const date = require('date-and-time');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        Logger.client('Je suis ON!')
        // console.log(client.slashCommands.map(cmd => cmd))

        // client.guilds.cache.get('1002135735241023548').commands.set([]);
        // client.guilds.cache.get('1002135735241023548').commands.set(client.slashCommands.map(cmd => cmd));

        // client.application.commands.set([]);
        client.application.commands.set(client.slashCommands.map(cmd => cmd));

        let janvier = []
        let fevrier = []
        let mars = []
        let avril = []
        let mai = []
        let juin = []
        let juillet = []
        let aout = []
        let septembre = []
        let octobre = []
        let novembre = []
        let decembre = []
        
        let updateClock = new cron.CronJob('*/3 * * * * *', async () => {
            const embed = new Discord.MessageEmbed()
                .setTitle(`Météo - Horloge`)
            client.channels.cache.get('1013810288241430528').messages.fetch({ limit: 1 }).then(async messages => {
                let lastMessage = messages.first();
                let nowRP = (await client.channels.cache.get('1013810288241430528').messages.fetch(`${lastMessage.id}`))
                embed.setDescription(date.format(new Date(new Date(nowRP.embeds[0].description).setSeconds(new Date(nowRP.embeds[0].description).getSeconds() + 1)), 'YYYY-MM-DD HH:mm:ss'))
                client.channels.cache.get('1013810288241430528').messages.fetch(`${lastMessage.id}`).then(message => message.edit({ embeds: [embed] }))
            });
        })

        updateClock.start();

    },
};
