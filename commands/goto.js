const Discord = require("discord.js");
const { guild } = require("../config");
const config = require("../config");

module.exports = {
    name: "goto",
    description: "Changer de zone RP",
    role: [config["guild"]],
    hidden: false,
    options: [{
        name: "zone",
        description: "Où souhaitez vous vous rendre ?",
        required: true,
        type: "STRING",
        choices: [
            { name: 'Heroic Academy', value: 'academy' },
            { name: 'Dortoirs des garçons', value: 'boys' },
            { name: 'Dortoirs des filles', value: 'girls' },
            { name: 'Bâtiment principal', value: 'bat' },
            { name: 'Forêt', value: 'foret' },
            { name: 'Ville', value: 'ville' },
            { name: 'Futur Apocalyptique', value: 'futur' },
        ]
    }],
    helpType: "moderation",

    runInteraction(client, interaction) {
        let member = interaction.guild.members.cache.find(member => member.id === interaction.member.id)
        let chosenChannelFullName
        let toBeAddedRole = config.zones.roles[`${interaction.options.getString("zone")}`]

        switch (interaction.options.getString("zone")) {
            case 'academy':
                chosenChannelFullName = "l'Heroic Academy"
                break;
            case 'boys':
                chosenChannelFullName = "le dortoir des garçons"
                break;
            case 'girls':
                chosenChannelFullName = "le dortoir des filles"
                break;
            case 'bat':
                chosenChannelFullName = "le bâtiment principal"
                break;
            case 'foret':
                chosenChannelFullName = "la forêt"
                break;
            case 'ville':
                chosenChannelFullName = "la ville"
                break;
            case 'futur':
                chosenChannelFullName = "le futur apocalyptique"
                break;

        }
        for (role in config.zones.roles) {
            member.roles.remove(config.zones.roles[role])
        }

        member.roles.add(toBeAddedRole)
        member.roles.add(config.zones.roles['Catégorie'])

        const embedLogger = new Discord.MessageEmbed()
            .setTitle(`Changement de zone`)
            .setAuthor({ name: member.displayName, iconURL: member.displayAvatarURL() })
            .addField(`Nouvelle zone`, `${member.displayName} est parti vers ${chosenChannelFullName}`)
            .setTimestamp()
            .setThumbnail(`${interaction.guild.iconURL()}`)

        client.channels.cache.get(`1006227089265008750`).send({ embeds: [embedLogger] })
        return interaction.reply({ content: `C'est parti ! Tu te diriges maintenant vers ${chosenChannelFullName} !`, ephemeral: true })
    },
}
