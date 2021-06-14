const SqlConnexion = require("../../connexion");

const creerTableModeLivraison = async function(){
    try {
    
        // On créé la table mode_livraison si elle n'existe pas
        var creerTableModeLivraison = "CREATE TABLE IF NOT EXISTS mode_livraison (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, champs VARCHAR(100))";
        await SqlConnexion.query(creerTableModeLivraison);

    } catch (err) {
        console.log(err);
    }
};

module.exports = creerTableModeLivraison;