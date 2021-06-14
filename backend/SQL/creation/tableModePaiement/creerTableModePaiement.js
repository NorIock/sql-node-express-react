const SqlConnexion = require("../../connexion");

const creerTableModePaiement = async function(){
    try {
    
        // On créé la table mode_paiement si elle n'existe pas
        var creerTableModePaiement = "CREATE TABLE IF NOT EXISTS mode_paiement (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, champs VARCHAR(100))";
        await SqlConnexion.query(creerTableModePaiement);

    } catch (err) {
        console.log(err);
    }
};

module.exports = creerTableModePaiement;