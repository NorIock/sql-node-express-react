const SqlConnexion = require('../../connexion');

const creerTableMessageAccueil = async function(){

    try {

        // On créé la table membres si elle n'existe pas
        var creerTableMessageAccueil = "CREATE TABLE IF NOT EXISTS message_accueil (message_acceuil_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, intitule VARCHAR(100), afficher BOOLEAN DEFAULT '1')";
        await SqlConnexion.query(creerTableMessageAccueil);
        
    } catch (err) {
        console.log(err);
    }
}

module.exports = creerTableMessageAccueil;