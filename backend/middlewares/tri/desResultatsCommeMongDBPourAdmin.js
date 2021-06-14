const SqlConnexion = require("../../SQL/connexion");

const onTrieLesResultatsCommeDansMongoDBPourAdmin = async function(trier){
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
                nombre_ventes: unProduit.nombre_ventes,
                nombre_panier: unProduit.nombre_panier,
                nombre_liste_envie: unProduit.nombre_liste_envie,
                date_creation: unProduit.date_creation,
                en_vente: unProduit.en_vente,
                nombre_vues: unProduit.nombre_vues,
                
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

module.exports = onTrieLesResultatsCommeDansMongoDBPourAdmin;