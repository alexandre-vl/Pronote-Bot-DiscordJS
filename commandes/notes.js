exports.run = (client, message ) => {
    const Discord = require("discord.js")
    const pronote = require('pronote-api');
    const Enmap = require("enmap");
    const user = new Enmap({name: "user"}); 
    const args = message.content.slice(client.config.prefix.length).split(/ +/);
    const moment = require("moment");
    moment.locale("fr");

    if(user.get(message.author.id, "id") === "none") return message.channel.send("Vous n'etes pas enregistré dans la base donnés, faites `;login` en privé pour vous enregistrer.")
    message.channel.send("<a:load:794250007707648061>Veuillez patienter, cela peu prendre un moment...").then( data => {
        function getFetchDate(session){
            let from = new Date();
            if (from < session.params.firstDay) {
                from = session.params.firstDay;
            }
            to = new Date(from.getTime());
            to.setDate(to.getDate() - 14);
            return { from, to };
        }

        async function main(){
            let username = user.get(message.author.id, "id")
            let password = user.get(message.author.id, "mdp")
            let url = user.get(message.author.id, "url")
            let cas = user.get(message.author.id, "cas")

            const session = await pronote.login(url, username, password, cas);
            const { from, to } = getFetchDate(session)
            const marks = await session.marks(from, to);
            console.log(marks.find((a) => a.name == 'EPS'))
            /*const matieres = [];

            homeworks.forEach((value) => {
                matieres.push(value.id)
            });

            const embed = new Discord.MessageEmbed()
            .setTitle('`DEVOIRS PRONOTE`')

            matieres.sort().forEach((value) => {
                const matiere = homeworks.filter((res) => res.id === value)
                embed.addField(matiere.map((devoir) => devoir.subject)+` (Pour ${matiere.map((date) => moment(date.for).format("dddd Do MMMM"))})`, "`"+matiere.map((devoir) => devoir.description).join('\n')+"`")
            });
            message.channel.send(embed)*/
            data.delete()
            

        }
        main().catch(err => {
            console.error(err); 
            data.delete()
            message.channel.send("Une erreur s'est produite.")   

        })
    })

}