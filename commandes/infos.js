exports.run = (client, message ) => {
    const Discord = require("discord.js")
    const pronote = require('pronote-api');
    const Enmap = require("enmap");
    const user = new Enmap({name: "user"}); 
    const args = message.content.slice(client.config.prefix.length).split(/ +/);

    if(user.get(message.author.id, "id") === "none") return message.channel.send("Vous n'etes pas enregistré dans la base donnés, faites `;login` en privé pour vous enregistrer.")
        message.channel.send("<a:load:794250007707648061>Veuillez patienter, cela peu prendre un moment...").then( data => {
            function getFetchDate(session){
                let from = new Date();
                if (from < session.params.firstDay) {
                    from = session.params.firstDay;
                }

                const to = new Date(from.getTime());

                return { from, to };
            }

            async function main(){
                let username = user.get(message.author.id, "id")
                let password = user.get(message.author.id, "mdp")
                let url = user.get(message.author.id, "url")
                let cas = user.get(message.author.id, "cas")

                const session = await pronote.login(url, username, password, cas);
                session.setKeepAlive(false);

                const { from, to } = getFetchDate(session)

                const timetable = await session.timetable(from, to);
                const alltimetable = await session.timetable(session.params.firstDay, session.params.lastDay)
                
                const evaluations = await session.evaluations();
                const absences = await session.absences();
                const nombreAbsences = absences.absences.length;
                const nombreRetards = absences.delays.length;
                const infos = await session.infos();
                const contents = await session.contents(from, to);
                const allhomeworks = await session.homeworks(session.params.firstDay, session.params.lastDay)
                const homeworks = await session.homeworks(session.params.firstDay, session.params.lastDay);
                const menu = await session.menu(from, to);
                const files = await session.files();
                const name = session.user.name;
                const classe = session.user.studentClass.name;  
                console.log(homeworks)
                
                const marks = await session.marks(session.params.firstDay, session.params.lastDay);
                const count = marks.subjects.filter(e => e !== "Abs").length
                const moyenne = Math.floor(marks.subjects.map((value) => value.averages.student).reduce((a, b) => a + b) / count *100) / 100
                console.log(marks.subjects)

                
                const embedinfos = new Discord.MessageEmbed()
                    .setAuthor(message.author.username)
                    .setThumbnail(session.user.avatar)
                    .setDescription("Nom : "+name+"\nClasse : "+classe+"\nCours aujourd'hui/Année : "+timetable.length+" | "+alltimetable.length+"\nControles : "+evaluations.length+"\nAbsences/Retards : "+nombreAbsences+"/"+nombreRetards+"\nDevoirs : "+allhomeworks.length+"\nMoyenne : "+moyenne)
                message.channel.send(embedinfos)
                data.delete()
            }
            main().catch(err => {
                    console.error(err); 
                    data.delete()
                    message.channel.send("Une erreur s'est produite.")   
            })
        
        })
}