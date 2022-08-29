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

        let weather = ['☀️', '🌤️', '⛅', '🌥️', '🌦️', '🌧️', '☁️', '🌩️', '⛈️', '🌨️', '💨', '🌪️', '🌫️']

        let janvier = [5, 5, 5, 10, 15, 20, 5, 5, 5, 15, 5, 0, 5]
        let fevrier = [5, 5, 5, 10, 20, 15, 5, 0, 5, 15, 10, 0, 5]
        let mars = [5, 5, 5, 10, 20, 15, 5, 0, 5, 15, 10, 0, 5]
        let avril = [10, 5, 10, 10, 10, 15, 5, 0, 5, 15, 10, 0, 5]
        let mai = [10, 15, 10, 5, 10, 15, 10, 0, 5, 5, 10, 0, 5]
        let juin = [20, 15, 10, 5, 5, 10, 10, 5, 5, 0, 10, 0, 5]
        let juillet = [30, 20, 10, 10, 5, 5, 5, 5, 5, 0, 2, 0, 3]
        let aout = [30, 20, 5, 10, 5, 5, 5, 10, 5, 0, 2, 0, 3]
        let septembre = [20, 30, 5, 10, 5, 5, 10, 5, 5, 0, 2, 0, 3]
        let octobre = [20, 20, 5, 20, 5, 5, 5, 10, 5, 0, 2, 0, 3]
        let novembre = [10, 10, 5, 10, 20, 20, 10, 10, 5, 0, 2, 0, 3]
        let decembre = [5, 5, 5, 10, 20, 20, 5, 5, 5, 10, 5, 0, 5]

        function random(month) {
            switch (month) {
                case '00':
                    month = janvier
                    break;
                case '01':
                    month = fevrier
                    break;
                case '02':
                    month = mars
                    break;
                case '03':
                    month = avril
                    break;
                case '04':
                    month = mai
                    break;
                case '05':
                    month = juin
                    break;
                case '06':
                    month = juillet
                    break;
                case '07':
                    month = aout
                    break;
                case '08':
                    month = septembre
                    break;
                case '09':
                    month = octobre
                    break;
                case '10':
                    month = novembre
                    break;
                case '11':
                    month = decembre
                    break;

            }
            let text = ''
            for (index in month) {
                for (var i = 0; i < month[index]; i++) {
                    text = text + '"' + (weather[index]) + '",'
                }
            }
            let array = eval('[' + text + ']')
            return array[Math.floor(Math.random() * 101)]
        }

        let updateClock = new cron.CronJob('*/6 * * * * *', async () => {

            const embed = new Discord.MessageEmbed()
                .setTitle(`Météo - Horloge`)
            client.channels.cache.get('1013810288241430528').messages.fetch({ limit: 1 }).then(async messages => {
                let lastMessage = messages.first();
                let nowRP = (await client.channels.cache.get('1013810288241430528').messages.fetch(`${lastMessage.id}`))
                if (new Date(nowRP.embeds[0].description.slice(0, 19)).getDate() != new Date(new Date(nowRP.embeds[0].description.slice(0, 19)).setSeconds(new Date(nowRP.embeds[0].description.slice(0, 19)).getSeconds() + 2)).getDate()) {
                    embed.setDescription(date.format(new Date(new Date(nowRP.embeds[0].description.slice(0, 19)).setSeconds(new Date(nowRP.embeds[0].description.slice(0, 19)).getSeconds() + 2)), 'YYYY-MM-DD HH:mm:ss') + '\n' + random(nowRP.embeds[0].description.slice(5, 7)))
                } else {
                    embed.setDescription(date.format(new Date(new Date(nowRP.embeds[0].description.slice(0, 19)).setSeconds(new Date(nowRP.embeds[0].description.slice(0, 19)).getSeconds() + 2)), 'YYYY-MM-DD HH:mm:ss') + '\n'+ nowRP.embeds[0].description.slice(nowRP.embeds[0].description.length-2))
                }
                // embed.setDescription(date.format(new Date(1661983200000), 'YYYY-MM-DD HH:mm:ss') + '\n☀️')
                client.channels.cache.get('1013810288241430528').messages.fetch(`${lastMessage.id}`).then(message => message.edit({ embeds: [embed] }))
            });
        })

        updateClock.start();

    },
};
