const SqlConnexion = require('../../connexion');

const creerTableMembre = async function(){

    try {

        // On créé la table membres si elle n'existe pas
        var creerTableMembres = "CREATE TABLE IF NOT EXISTS membres (membre_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, nom VARCHAR(100), prenom VARCHAR(100), email VARCHAR(255), mot_de_passe VARCHAR(255), adresse VARCHAR(150), code_postal VARCHAR(10), ville VARCHAR(100), admin BOOLEAN)";
        await SqlConnexion.query(creerTableMembres);
        
    } catch (err) {
        console.log(err);
    }
}

module.exports = creerTableMembre;