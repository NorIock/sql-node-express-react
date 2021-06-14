const SqlConnexion = require("../../connexion");

const creerTableJunctionCategorieProduits = async function(){
    try {
    
        // On créé la table jucntion categorie produits si elle n'existe pas
        var creerTableJonctionProduitCategorie = "CREATE TABLE IF NOT EXISTS produit_categorie_junction (produit_id INT, FOREIGN KEY (produit_id) REFERENCES produit(produit_id), categorie_id INT, FOREIGN KEY (categorie_id) REFERENCES categorie(id))";
        await SqlConnexion.query(creerTableJonctionProduitCategorie);

    } catch (err) {
        console.log(err);
    }
};

module.exports = creerTableJunctionCategorieProduits;