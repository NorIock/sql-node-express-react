const router = require("express").Router();
const SqlConnexion = require("../SQL/connexion");
const auth = require("../middlewares/auth");
const creerTablePanier = require("../SQL/creation/tablePanier/CreerTablePanier");
const creerTableHistoriqueAchats = require('../SQL/creation/tableHistoriqueAchats/CreerTableHistoriqueAchats');

// Cette route permet au membre d'ajouter un article au panier
router.get("/ajouter/:produit_id", auth, async function(req, res){
    try {

        // Si elle n'existe pas, on créé la table panier et sa jonction avec le produit
        await creerTablePanier();
        
        // Pour éviter que le membre ajoute plusieurs le même article, on va rechercher ses paniers:
        var sql_panierMembres= "SELECT * FROM panier WHERE membre_id = ?";
        const lesPaniersDuMembre = await SqlConnexion.query(sql_panierMembres, req.membre);

        // S'il a déjà un panier, on vérifie que le produit n'est pas dedans
        if(lesPaniersDuMembre.length >0){
            for(unPanier of lesPaniersDuMembre){
                let sql_dejaDansPanier = "SELECT * FROM produit_panier_junction WHERE panier_id = ? AND produit_id= ?";
                let dejaDansPanier = [unPanier.panier_id, req.params.produit_id];
                let resultatDoublon = await SqlConnexion.query(sql_dejaDansPanier, dejaDansPanier);

                if(resultatDoublon.length > 0){
                    return res
                        .status(400)
                        .send({ msg: "Cet article est déjà dans votre panier"});
                }
            }
        }

        // On enregistre l'article dans le panier
        var sql_ajouterPanier = "INSERT INTO panier (nombre_produit, membre_id) VALUES (?)";
        var panierValues = [ 1, req.membre ];
        const nouvelArticlePanier = await SqlConnexion.query(sql_ajouterPanier, [panierValues]);

        // On fait le lien entre le panier et le produit
        var sql_produitPanierJunction = "INSERT INTO produit_panier_junction (produit_id, panier_id) VALUES (?)";
        var produitPanierJunctionValues = [req.params.produit_id, nouvelArticlePanier.insertId];
        await SqlConnexion.query(sql_produitPanierJunction, [produitPanierJunctionValues]);

        res.json("OK");
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet d'avoir le nombre d'articles dans le panier
router.get("/nombre-articles", auth, async function(req, res){
    try {

        var sql_nombreArticlePanier = "SELECT * FROM panier WHERE membre_id = ?";
        var nombreArticlesPanierValue = req.membre;
        const nombreArticlesPanier = await SqlConnexion.query(sql_nombreArticlePanier, nombreArticlesPanierValue);

        res.json(nombreArticlesPanier.length);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

// Cette route nous permet de consulter le panier
router.get("/consulter", auth, async function(req, res){
    try {

        // Si elle n'existe pas, on créé la table panier et sa jonction avec le produit
        await creerTablePanier();

        var sql_monPanier = "SELECT panier.*, produit.nom, produit.prix, produit.quantite, produit.produit_id, photo.* FROM panier INNER JOIN produit_panier_junction ON panier.panier_id = produit_panier_junction.panier_id INNER JOIN produit ON produit_panier_junction.produit_id = produit.produit_id INNER JOIN photo ON produit.produit_id = photo.produit_id WHERE membre_id = ?";
        var monPanierValues = req.membre;
        const monPanier = await SqlConnexion.query(sql_monPanier, monPanierValues);

        if(monPanier.length === 0){
            return res.json("Rien");
        }
        
        res.json(monPanier);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route nous permet de retirer un ou plusieurs articles du panier
router.post("/modifier", auth, async function(req, res){
    try {

        var sql_modifierQuantite = "UPDATE panier SET nombre_produit = ? WHERE panier_id = ?";
        var sql_supprimerCarQuantiteVautZero = "DELETE FROM panier WHERE panier_id = ?";
        var sql_supprimerDansProduit_panier_junction = "DELETE FROM produit_panier_junction WHERE panier_id = ?";

        for(unArticle of req.body.nouvelleQuantite){

            if(unArticle.quantite < 1){
                // On la supprime dans la table produit_panier_junction 
                let supprimerJunctionValue = unArticle.panierId;
                await SqlConnexion.query(sql_supprimerDansProduit_panier_junction, supprimerJunctionValue);
                // On supprime aussi la donnée dans la table panier
                let supprimerValue = unArticle.panierId;
                await SqlConnexion.query(sql_supprimerCarQuantiteVautZero, supprimerValue);
            }

            if(unArticle.quantite > 0){
                let modifierQuantiteValue = [ unArticle.quantite, unArticle.panierId ];
                await SqlConnexion.query(sql_modifierQuantite, modifierQuantiteValue);
            }
        }
        res.json("OK");
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de claculer le total du panier
router.get("/total", auth, async function(req, res){
    try {

        var sql_connaitreTotal = "SELECT panier.nombre_produit, produit.prix FROM panier INNER JOIN produit_panier_junction ON panier.panier_id = produit_panier_junction.panier_id INNER JOIN produit ON produit_panier_junction.produit_id = produit.produit_id WHERE membre_id = ?";
        var connaitreTotalValue = req.membre;
        const connaitreTotalPanier = await SqlConnexion.query(sql_connaitreTotal, connaitreTotalValue);

        var total = 0;

        for(totalParProduit of connaitreTotalPanier){
            
            total = total*1 + (totalParProduit.nombre_produit*1 * totalParProduit.prix*1);

        }

        res.json(total);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de vérifier que le stock demandé est toujours disponible entre le moment où l'article a été ajouté au panier
// et le paiement
router.get("/verifier-quantite", auth, async function(req, res){
    try {

        var sql_verifierQuantite = "SELECT panier.nombre_produit, produit.quantite, produit.nom, produit.en_vente FROM panier INNER JOIN produit_panier_junction ON panier.panier_id = produit_panier_junction.panier_id INNER JOIN produit ON produit_panier_junction.produit_id = produit.produit_id WHERE membre_id = ?";
        var verifierQuantiteValue = req.membre;
        const verifierQuantite = await SqlConnexion.query(sql_verifierQuantite, verifierQuantiteValue);

        var messageErreur = "";

        for(unProduit of verifierQuantite){
            if(unProduit.nombre_produit > unProduit.quantite){
                messageErreur = messageErreur + unProduit.quantite + " article(s) maximum pour " + unProduit.nom + "\n";
            }
            if(!unProduit.en_vente){
                messageErreur = messageErreur + unProduit.nom + " n'est plus proposé à la vente\n";
            }
        }

        if(messageErreur.length > 0){
            return res
                .status(400)
                .send({ msg: messageErreur });
        } else {
            res.json("OK");
        }
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route renvoi le contenu du panier sans les photos
router.get("/simplifie", auth, async function(req, res){
    try {

        var sql_paniersimplifie = "SELECT panier.nombre_produit, panier.panier_id, produit.prix, produit.nom, produit.produit_id, produit.quantite FROM panier INNER JOIN produit_panier_junction ON panier.panier_id = produit_panier_junction.panier_id INNER JOIN produit ON produit_panier_junction.produit_id = produit.produit_id WHERE membre_id = ?";
        var panierSimplifieValues = req.membre;
        const panierSimplifie = await SqlConnexion.query(sql_paniersimplifie, panierSimplifieValues);

        res.json(panierSimplifie);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de procéder au paiement du panier
router.post("/payer", auth, async function(req, res){
    try {

        // Validation:
        var erreurValidation ="";
        if(!req.body.paiement || req.body.paiement === "Choisir"){
            erreurValidation = erreurValidation + "Veuillez sélecionner un mode de paiement\n";
        }
        if(!req.body.livraison || req.body.livraison === "Choisir"){
            erreurValidation = erreurValidation + "Veuillez sélecionner un mode de livraison\n";
        }
        if(erreurValidation.length > 0){
            return res
                .status(400)
                .send({ msg: erreurValidation})
        }

        // Cette fonction va créer la table historique_achat si cela n'a pas déjà été fait fait ainsi que celle des produits et 
        // images si cela n'a pas été aussi fait pour éviter tout bug.
        await creerTableHistoriqueAchats();

        // On regroupe l'adresse en une seule variable
        var adresseComplete = req.body.adresse + " " + req.body.codePostal + " " + req.body.ville;

        // On arrête une date pour ques tous les articles du panier aient la même date d'achat
        var date = Date.now();

        // Les requêtes:
        var sql_achatDansHistorique = "INSERT INTO historique_achats (prix, quantite, date_achat, adresse_envoi, mode_paiement, mode_envoi, membre_id) VALUES (?)";
        var sql_produitHistoriqueJunction = "INSERT INTO produit_historique_junction (produit_id, historique_id) VALUES (?)";
        var sql_diminuerQuantiteProduit = "UPDATE produit SET quantite = quantite - ?, nombre_ventes = nombre_ventes + ? WHERE produit_id = ?";
        var sql_supprimerDansProduit_panier_junction = "DELETE FROM produit_panier_junction WHERE panier_id = ?";
        var sql_supprimerPanier = "DELETE FROM panier WHERE panier_id = ?";


        for(unProduit of req.body.panierData){
            // On enregistre l'achat dans l'historique
            let values = [ unProduit.prix, unProduit.nombre_produit, date, adresseComplete, req.body.paiement, req.body.livraison, req.membre ];
            const nouvelHistorique = await SqlConnexion.query(sql_achatDansHistorique, [values]);

            // On insère les données dans produit_historique_junction
            let valuesJunction = [unProduit.produit_id, nouvelHistorique.insertId];
            await SqlConnexion.query(sql_produitHistoriqueJunction, [valuesJunction]);

            // On diminue le nombre d'article restant pour le produit acheté en fonction de la quantité vendue et on augmente le champs
            // ventes totales pour les stats et la section meilleures vente de la page d'accueil
            let valuesProduit = [ unProduit.nombre_produit, unProduit.nombre_produit, unProduit.produit_id ];
            await SqlConnexion.query(sql_diminuerQuantiteProduit, valuesProduit);

            // Enfin, on supprime l'article du panier
            // On la supprime dans la table produit_panier_junction 
            let supprimerJunctionValue = unProduit.panier_id;
            await SqlConnexion.query(sql_supprimerDansProduit_panier_junction, supprimerJunctionValue);
            // On supprime aussi la donnée dans la table panier
            let supprimerValue = unProduit.panier_id;
            await SqlConnexion.query(sql_supprimerPanier, supprimerValue);
        }

        res.json("OK");

        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de transférer un article du panier à la liste d'envie
router.get("/transferer-liste-envie", auth, async function(req, res){
    try {
        console.log("Dans la route pour transférer un artcile du panier à la liste d'envie");
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

module.exports = router;