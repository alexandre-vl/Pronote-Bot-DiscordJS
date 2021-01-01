const Discord = require("discord.js")
const client = new Discord.Client()
const pronote = require('pronote-api');
const Enmap = require("enmap");
const user = new Enmap({name: "user"}); 
const prefix = "!"

client.on('ready', () => {
    console.log("Ready")
})

client.on('message', (message) => {
    if (message.author.bot) return;
    
    const args = message.content.slice(prefix.length).split(/ +/);
    const url = 'https://0061642c.index-education.net/pronote/';
    const cas = 'atrium-sud'

    user.ensure(message.author.id, {
        user: message.author.id,
        id: "none",
        mdp: "none"
    });

    if(message.content.startsWith(prefix+"help")){
        const help = new Discord.MessageEmbed()
            .setAuthor("Menu aide")
            .setDescription("`!login` -> permet de vous enregistrer dans notre base de donnés.\n`!logout` -> permet de supprimer vos donnés de notre base.\n`!infos` -> permet d'obtenir quelques informations sur votre session.\n\nNous précisons tout de meme que les identifiants ne sont pas visibles par les créateurs du bot.")
        message.channel.send(help)
            
    }

    if(message.content.startsWith(prefix+"login")){
        if(message.guild){
            message.delete()
            return message.channel.send("Ne faites pas cette commande ici ! Venez en privé")
        } 
        let mdp = args.slice(2).join(" ");
        if(!args[1]) return message.channel.send("Veuillez préciser votre identifiant")
        if(!mdp) return message.channel.send("Veuillez préciser votre mot de passe")
        message.channel.send("<a:load:794250007707648061>Veuillez patienter, cela peu prendre un moment...").then( data => {
            async function test(){
                const session = await pronote.login(url, args[1], mdp, cas);
                message.channel.send("Vos identifiants ont étaient enregistrés avec succès "+session.user.name+ " ! (Les identifiants ne sont en aucun cas utilisé par d'autre personne que vous)")
                data.delete()
            }
            test().catch(err => {
                data.delete()
                message.channel.send("Le mot de passe ou l'identifiant précisé n'existe pas");    
                
            });
            user.set(message.author.id, args[1], "id")
            user.set(message.author.id, mdp, "mdp")
        })
        
    }

    if(message.content.startsWith(prefix+"logout")){
        message.channel.send("Vos identifiants ont été supprimé de notre base de donnés")
        user.set(message.author.id, "none", "id")
        user.set(message.author.id, "none", "mdp") 
    }

    if(message.content.startsWith(prefix+"devoirs")){
        if(!args[1]) return message.channel.send("Veuillez préciser le nombre de jour maximum")
        if(isNaN(args[1]+args[1])) return message.channel.send("Veuillez préciser un nombre correct")
        if(args[1] >= 14) return message.channel.send("Veuillez préciser un nombre inférieur à deux semaines")
        function getFetchDate(session){
            let from = new Date();
            if (from < session.params.firstDay) {
                from = session.params.firstDay;
            }
            to = new Date(from.getTime());
            to.setDate(to.getDate() + parseInt(args[1]));
            return { from, to };
        }

        async function main(){
            let username = user.get(message.author.id, "id")
            let password = user.get(message.author.id, "mdp")

            const session = await pronote.login(url, username, password, cas);
            const { from, to } = getFetchDate(session)
            const homeworks = await session.homeworks(from, to);
            
            const all = homeworks.map((value) => value.subject+" -> "+ value.description)
            console.log(all) 

        }
        main().catch(err => {
            console.error(err); 
            message.channel.send("Une erreur s'est produite.")   
        })

    }

    
    if(message.content.startsWith(prefix+"infos")){
        if(user.get(message.author.id, "id") === "none") return message.channel.send("Vous n'etes pas enregistré dans la base donnés, faites `!login` en privé pour vous enregistrer.")
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
                const count = marks.subjects.length;
                const moyenne = Math.floor(marks.subjects.map((value) => value.averages.student).reduce((a, b) => a + b) / count *100) / 100
                console.log(marks.subjects[0].averages.student)

                
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
})

client.login("NjUwOTg5NDM5ODA3Mzg5Njk4.XeTXKQ.WleD3kLU2XfKUXwm1uLJk-R6D2w")