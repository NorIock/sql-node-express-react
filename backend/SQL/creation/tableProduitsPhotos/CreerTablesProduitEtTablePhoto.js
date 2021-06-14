const SqlConnexion = require("../../connexion");

const creerTablesProduitsEtPhoto = async function(){
    try {
        // On créé la table produit et photo si cela n'a pas déjà été fait (au cas où l'utilisateur va directement à l'historique alors qu'aucun produit n'a été créé)
        var creerTableProduits = "CREATE TABLE IF NOT EXISTS produit (produit_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, nom VARCHAR(255) NOT NULL, prix INT NOT NULL, quantite INT NOT NULL, description VARCHAR(10000), nombre_ventes INT DEFAULT '0', nombre_panier INT DEFAULT '0', nombre_liste_envie INT DEFAULT '0', nombre_vues INT DEFAULT '0', date_creation VARCHAR(255), en_vente BOOLEAN DEFAULT '1')";
        await SqlConnexion.query(creerTableProduits);
        
        // var creerTablePhoto = "CREATE TABLE IF NOT EXISTS photo (photo_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, public_id VARCHAR(255), ordre TINYINT(2), produit_id INT, FOREIGN KEY (produit_id) REFERENCES produit(produit_id))";
        var creerTablePhoto = "CREATE TABLE IF NOT EXISTS photo (photo_id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, public_id VARCHAR(255), ordre TINYINT(2), produit_id INT, largeur INT, hauteur INT, FOREIGN KEY (produit_id) REFERENCES produit(produit_id))";

        await SqlConnexion.query(creerTablePhoto);
    } catch (err) {
        console.log(err);
    }
};

module.exports = creerTablesProduitsEtPhoto;