exports.run = (client, message ) => {
    const Discord = require("discord.js")
    const pronote = require('pronote-api');
    const Enmap = require("enmap");
    const user = new Enmap({name: "user"}); 
    const args = message.content.slice(client.config.prefix.length).split(/ +/);

    if(message.guild){
        message.delete()
        return message.channel.send("Ne faites pas cette commande ici ! Venez en privé")
    } 
    let mdp = args.slice(2).join(" ");
    if(!args[1]) return message.channel.send("Veuillez préciser votre identifiant")
    if(!mdp) return message.channel.send("Veuillez préciser votre mot de passe")
    message.channel.send("<a:load:794250007707648061>Veuillez patienter, cela peu prendre un moment...").then( data => {
        async function test(){
            let url = user.get(message.author.id, "url")
            let cas = user.get(message.author.id, "cas")
            const session = await pronote.login(url, args[1], mdp, cas);
            message.delete()
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