const Logger = require("../utils/Logger");
const Discord = require('discord.js');
const config = require('../config');
const cron = require('cron');
const date = require('date-and-time');
const { createCanvas, loadImage } = require('canvas')
const canvas = createCanvas(600, 611)
const ctx = canvas.getContext('2d')

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        Logger.client('Je suis ON!')
        client.application.commands.set(client.slashCommands.map(cmd => cmd));

        const buttons = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId(`validate-reglement`)
                .setStyle(`SUCCESS`)
                .setLabel(`Accepter le règlement`),
        )
        const embed = new Discord.MessageEmbed()
            .setTitle(`Règlement`)
            .setDescription(`★━━━━━━━━━━━━━━━━━━━━★

            I/ Le respect
           
           Respectez-vous et respectez les autres. Cela s'illustre en ne divulguant pas ses informations privées à tout va et en ne prononçant pas de propos discriminatoires ou explicites ... 
           Dire "merci", "bonjour" et saluer les nouveaux membres est aussi une forme de respect.
           Vous devez également respecter le staff. Leurs décisions ne sont pas prises à tout va.
           De plus, il est bon de ne pas OUBLIER que l'arrogance, le mépris, (etc...) Ne sont pas les bienvenues sur le serveur.
           Il est également à noter que nous vous demandons un minimum en orthographe, ce n’est pas très compliqué si on y met du sien !
           
           ★━━━━━━━━━━━━━━━━━━━━★
           
           II/ Pseudo et photos de profil
           
           Vos pseudo et photos de profil doivent respecter la règle I/ et doivent pouvoir être ping (donc pas de caractère spéciaux, il faut des lettres latines et lisibles).
           
           ★━━━━━━━━━━━━━━━━━━━━★
           
           III/ Le role play
           
           Veuillez respecter les codes suivants :
           
           - Ne pas "fast" RP (Rp en un mot, voir une ligne, sans sujet ou sans complément.) 
           - Pas de "méta" RP (faire connaître des choses à notre personnage qu'il ne connait pas lui-même.)
           - Respecter le consentement du rôle playeur !
           - Les smileys sont interdits dans le RP.
           
           Exemple format de RP :
           
           Narration ou Narration ou Narration
           {Pensée} ou {Pensée}
           - Paroles ou paroles chuchoté
           
           Ce RP étant un RP semi RPG avec quêtes et récompenses, un MJ est mis en place, ce dernier sera le seul habilité sauf dérogation de sa part à lancer vos quêtes. Si vous deviez être amené à faire un RPC (Rôle Play Combat) Le MJ guidera le combat de façon équilibré et complètement aléatoire grâce à un système de dé (Voir dans les infos HRP) 
           
           ★━━━━━━━━━━━━━━━━━━━━★`)
            .setTimestamp()
            .setFooter({text: `Toute validation du règlement autorise le staff à vous expulser en cas de non respect des règles`})
            .setThumbnail('https://cdn.discordapp.com/icons/1017860185454297088/88e4c406d4d2e9736be3f33afca81df1.webp')

        // client.channels.cache.get('1017874637528518727').send({ embeds: [embed], components: [buttons] })
    },
};
