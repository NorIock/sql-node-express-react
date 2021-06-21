const SqlConnexion = require('../../connexion');

const creerTablePanier = async function(){

    try {
        // On créé la table panier si elle n'existe pas
        var sql_creerTablePanier = "CREATE TABLE IF NOT EXISTS panier (panier_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, nombre_produit INT NOT NULL, membre_id INT, FOREIGN KEY (membre_id) REFERENCES membres(membre_id))";
        await SqlConnexion.query(sql_creerTablePanier);

        // On créé la jonction entre le panier et les produits (relation many to many)
        var sql_creerTableJonctionPanierProduits = "CREATE TABLE IF NOT EXISTS produit_panier_junction (produit_id INT, FOREIGN KEY (produit_id) REFERENCES produit(produit_id), panier_id INT, FOREIGN KEY (panier_id) REFERENCES panier(panier_id))";
        await SqlConnexion.query(sql_creerTableJonctionPanierProduits);

    } catch (err) {
        console.log(err);
    }
}

module.exports = creerTablePanier;