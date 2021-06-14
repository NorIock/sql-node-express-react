const SqlConnexion = require('../../connexion');

const creerTableHistoriqueAchats = async function(){

    try {
        // On créé la table historiques_achats si elle n'existe pas
        var sql_creerTableHistoriqueAchats = "CREATE TABLE IF NOT EXISTS historique_achats (historique_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, prix INT NOT NULL, quantite INT NOT NULL, date_achat VARCHAR(255) NOT NULL, adresse_envoi VARCHAR(255) NOT NULL, mode_paiement VARCHAR(255) NOT NULL, mode_envoi VARCHAR(255) NOT NULL, membre_id INT, FOREIGN KEY (membre_id) REFERENCES membres(membre_id))";
        await SqlConnexion.query(sql_creerTableHistoriqueAchats);

        // // On créé la table produit et photo si cela n'a pas déjà été fait (au cas où l'utilisateur va directement à l'historique alors qu'aucun produit n'a été créé)
        // var creerTableProduits = "CREATE TABLE IF NOT EXISTS produit (produit_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, nom VARCHAR(255) NOT NULL, prix INT NOT NULL, quantite INT NOT NULL, description VARCHAR(10000), nombre_ventes INT DEFAULT '0', nombre_panier INT DEFAULT '0', nombre_liste_envie INT DEFAULT '0', nombre_vues INT DEFAULT '0', date_creation VARCHAR(255), en_vente BOOLEAN DEFAULT '1')";
        // await SqlConnexion.query(creerTableProduits);

        // var creerTablePhoto = "CREATE TABLE IF NOT EXISTS photo (photo_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, public_id VARCHAR(255), ordre TINYINT(2), produit_id INT, FOREIGN KEY (produit_id) REFERENCES produit(produit_id))";
        // await SqlConnexion.query(creerTablePhoto);

        // On créé la jonction entre l'historique et les produits (relation many to many)
        var sql_creerTableJonctionHistoriqueAchatsProduits = "CREATE TABLE IF NOT EXISTS produit_historique_junction (produit_id INT, FOREIGN KEY (produit_id) REFERENCES produit(produit_id), historique_id INT, FOREIGN KEY (historique_id) REFERENCES historique_achats(historique_id))";
        await SqlConnexion.query(sql_creerTableJonctionHistoriqueAchatsProduits);

    } catch (err) {
        console.log(err);
    }
}

module.exports = creerTableHistoriqueAchats;