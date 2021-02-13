exports.run = (client, message ) => {
    const Discord = require("discord.js")
    const pronote = require('pronote-api');
    const Enmap = require("enmap");
    const user = new Enmap({name: "user"}); 
    const args = message.content.slice(client.config.prefix.length).split(/ +/);
    const moment = require("moment");
    moment.locale("fr");

    if(user.get(message.author.id, "id") === "none") return message.channel.send("Vous n'etes pas enregistré dans la base donnés, faites `;login` en privé pour vous enregistrer.")
    if(!args[1]) return message.channel.send("Veuillez préciser le nombre de jour maximum")
        if(isNaN(args[1]+args[1])) return message.channel.send("Veuillez préciser un nombre correct")
        if(args[1] >= 14) return message.channel.send("Veuillez préciser un nombre inférieur à deux semaines")
        message.channel.send("<a:load:794250007707648061>Veuillez patienter, cela peu prendre un moment...").then( data => {
            function getFetchDate(session){
                let from = new Date();
                if (from < session.params.firstDay) {
                    from = session.params.firstDay;
                }
                to = new Date(from.getTime());
                to.setDate(to.getDate() + parseInt(args[1]));
                return { from, to };
            }

            async function main() {
                const username = user.get(message.author.id, "id"),
                password = user.get(message.author.id, "mdp"),
                url = user.get(message.author.id, "url"),
                cas = user.get(message.author.id, "cas");
            
                const session = await pronote.login(url, username, password, cas);
                const { from, to } = getFetchDate(session);
                const homeworks = await session.homeworks(from, to);
            
                message.channel.send({
                    embed: {
                        title: "`DEVOIRS PRONOTE`",
                        fields: homeworks.slice(0, 25).map(e => {
                            return {
                                name: `${e.subject} (Pour ${moment(e.for).format("dddd Do MMMM")})`,
                                value: `${e.description.length < 100 ? e.description : "Description trop longue"}`
                            };
                        })
                    }
                });
                data.delete()
            }
            main().catch(err => {
                console.error(err); 
                data.delete()
                message.channel.send("Une erreur s'est produite.")   

            })
        })
}