const {
  MessageEmbed
} = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");
const websiteSettings = require("../../dashboard/settings.json");
module.exports = {
  name: "help", //the command name for execution & for helpcmd [OPTIONAL]
  cooldown: 1, //the command cooldown for execution & for helpcmd [OPTIONAL]
  description: "Retorna todos os comandos, para um comando específico", //the command description for helpcmd [OPTIONAL]
  memberpermissions: [], //Only allow members with specific Permissions to execute a Commmand [OPTIONAL]
  requiredroles: [], //Only allow specific Users with a Role to execute a Command [OPTIONAL]
  alloweduserids: [], //Only allow specific Users to execute a Command [OPTIONAL]
  options: [ //OPTIONAL OPTIONS, make the array empty / dont add this option if you don't need options!	
    //INFORMATIONS! You can add Options, but mind that the NAME MUST BE LOWERCASED! AND NO SPACES!!!, for the CHOCIES you need to add a array of arrays; [ ["",""] , ["",""] ] 
    //{"Integer": { name: "ping_amount", description: "How many times do you want to ping?", required: true }}, //to use in the code: interacton.getInteger("ping_amount")
    {
      "String": {
        name: "specific_cmd",
        description: "Quer detalhes de um comando específico?",
        required: false
      }
    }, //to use in the code: interacton.getString("ping_amount")
    //{"User": { name: "ping_a_user", description: "To Ping a user lol", required: false }}, //to use in the code: interacton.getUser("ping_a_user")
    //{"Channel": { name: "what_channel", description: "To Ping a Channel lol", required: false }}, //to use in the code: interacton.getChannel("what_channel")
    //{"Role": { name: "what_role", description: "To Ping a Role lol", required: false }}, //to use in the code: interacton.getRole("what_role")
    //{"IntChoices": { name: "what_ping", description: "What Ping do you want to get?", required: true, choices: [["Bot", 1], ["Discord Api", 2]] }, //here the second array input MUST BE A NUMBER // TO USE IN THE CODE: interacton.getInteger("what_ping")
    //{"StringChoices": { name: "what_ping", description: "What Ping do you want to get?", required: false, choices: [["Bot", "botping"], ["Discord Api", "api"]] }}, //here the second array input MUST BE A STRING // TO USE IN THE CODE: interacton.getString("what_ping")
  ],
  run: async (client, interaction) => {
    try {
      //things u can directly access in an interaction!
      const {
        member,
        channelId,
        guildId,
        applicationId,
        commandName,
        deferred,
        replied,
        ephemeral,
        options,
        id,
        createdTimestamp
      } = interaction;
      const {
        guild
      } = member;
      let prefix = client.settings.get(guild.id, "prefix")
      let args = options.getString("specific_cmd");
      if (args && args.length > 0) {
        const embed = new MessageEmbed();
        const cmd = client.commands.get(args.toLowerCase()) || client.commands.get(client.aliases.get(args.toLowerCase()));
        if (!cmd) {
          return interaction.reply({
            ephemeral: true,
            embeds: [embed.setColor(ee.wrongcolor).setDescription(`Nenhuma informação encontrada para o comando **${args.toLowerCase()}**`)]
          });
        }
        if (cmd.name) embed.addField("**Nome do comando**", `\`${cmd.name}\``);
        if (cmd.name) embed.setTitle(`Informações detalhadas sobre:\`${cmd.name}\``);
        if (cmd.description) embed.addField("**Descrição**", `\`${cmd.description}\``);
        if (cmd.aliases) embed.addField("**Apelidos**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
        if (cmd.cooldown) embed.addField("**Tempo de Recarga**", `\`${cmd.cooldown} Seconds\``);
        else embed.addField("**Tempo de Recarga**", `\`${settings.default_cooldown_in_sec} Second\``);
        if (cmd.usage) {
          embed.addField("**Usage**", `\`${prefix}${cmd.usage}\``);
          embed.setFooter("Syntax: <> = required, [] = optional");
        }
        return interaction.reply({
          ephemeral: true,
          embeds: [embed.setColor(ee.color)]
        });
      } else {
        const embed = new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setTitle("HELP MENU 🔰 Comandos")
          .setDescription(`**[Convide-me com __permissões de comandos de barra__](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands), porque todos os meus comandos estão disponíveis como comandos de barra também!**\n\n> Confira o [**Painel**](${websiteSettings.website.domain}/dashboard/${guild.id}) ou o [**Fila de música ao vivo**](${websiteSettings.website.domain}/queue/${guild.id})`)
          .setFooter(`Para ver as descrições e informações dos comandos, Tipo: ${prefix}help [Nome do CMD]`, client.user.displayAvatarURL());
        const commands = (category) => {
          return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
        };
        try {
          for (let i = 0; i < client.categories.length; i += 1) {
            const current = client.categories[i];
            const items = commands(current);
            embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${items.join(", ")}`);
          }
        } catch (e) {
          console.log(String(e.stack).red);
        }
        interaction.reply({
          ephemeral: true,
          embeds: [embed]
        });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed)
      return interaction.reply({
        ephemeral: true,
        embeds: [new MessageEmbed()
          .setColor(ee.wrongcolor)
          .setFooter(ee.footertext, ee.footericon)
          .setTitle(`${client.allEmojis.x} ERROR | Um erro ocorreu`)
          .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
        ]
      });
    }
  }
}
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
