const SqlConnexion = require("../../SQL/connexion");

const onTrieLesResultatsCommeDansMongoDBPourUtilisateur = async function(trier){
    try {
        // On va stocker les résultats dans une array pour y intégrer les photos
        const afficherTousLesProduits = [];
    
        // On va intégrer chaque produit dans l'array
        for(unProduit of trier){
            let produit = {
                produit_id: unProduit.produit_id,
                nom: unProduit.nom,
                prix: unProduit.prix,
                quantite: unProduit.quantite,
                description: unProduit.description,
                date_creation: unProduit.date_creation,                
            }
            // On récupère les photos de chaque produit
            let sql_photosDuProduit = "SELECT * FROM photo WHERE produit_id = ? ORDER BY ordre ASC";
            const trouverLesPhotos = await SqlConnexion.query(sql_photosDuProduit, [ unProduit.produit_id ]);
    
            // Que l'on incorpore au produit
            produit.photo = trouverLesPhotos[0];
            
            afficherTousLesProduits.push(produit);
        }
        return afficherTousLesProduits;
        
    } catch (err) {
        console.log(err);
    }
}

module.exports = onTrieLesResultatsCommeDansMongoDBPourUtilisateur;