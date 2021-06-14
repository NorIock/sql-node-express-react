const SqlConnexion = require("../../connexion");

const creerTableCategorie = async function(){
    try {
    
        // On créé la table categorie si elle n'existe pas
        var creerTableCategorie = "CREATE TABLE IF NOT EXISTS categorie (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, champs VARCHAR(100))";
        await SqlConnexion.query(creerTableCategorie);

    } catch (err) {
        console.log(err);
    }
};

module.exports = creerTableCategorie;