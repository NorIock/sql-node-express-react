const router = require("express").Router();
const SqlConnexion = require("../SQL/connexion");
const auth = require('../middlewares/auth'); // Permet d'utiliser le middleware auth
const creerTableHistoriqueAchats = require('../SQL/creation/tableHistoriqueAchats/CreerTableHistoriqueAchats');


// Cette route permet d'ajouter le produit acheté à l'historique d'achats
router.post("/enregistrer-achat/:produitId", auth, async function(req, res){
    try {

        if(!req.body.paiement && !req.body.livraison){
            return res
                .status(400)
                .send({ msg: "Veuillez indiquer un moyen de paiement et un mode de livraison"})
        }

        if(!req.body.paiement){
            return res
                .status(400)
                .send({ msg: "Veuillez indiquer un moyen de paiement" })
        }

        if(!req.body.livraison){
            return res
                .status(400)
                .send({ msg: "Veuillez indiquer un mode de livraison "})
        }

        // Cette fonction va créer la table historique_achat si cela n'a pas déjà été fait fait ainsi que celle des produits et 
        // images si cela n'a pas été aussi fait pour éviter tout bug.
        await creerTableHistoriqueAchats();

        // On regroupe l'adresse en une seule variable
        var adresseComplete = req.body.adresse + " " + req.body.codePostal + " " + req.body.ville;

        // On enregistre l'achat dans l'historique
        var sql_achatDansHistorique = "INSERT INTO historique_achats (prix, quantite, date_achat, adresse_envoi, mode_paiement, mode_envoi, membre_id) VALUES (?)";
        var values = [ req.body.prix, req.body.quantite, Date.now(), adresseComplete, req.body.paiement, req.body.livraison, req.membre ];
        const nouvelHistorique = await SqlConnexion.query(sql_achatDansHistorique, [values]);

        // On insère les données dans produit_historique_junction
        var sql_produitHistoriqueJunction = "INSERT INTO produit_historique_junction (produit_id, historique_id) VALUES (?)";
        var valuesJunction = [req.body.produitId, nouvelHistorique.insertId];
        await SqlConnexion.query(sql_produitHistoriqueJunction, [valuesJunction]);

        // On diminue le nombre d'article restant pour le produit acheté en fonction de la quantité vendue et on augmente le champs
        // ventes totales pour les stats et la section meilleures ventre de la page d'accueil
        // var sql_diminuerQuantiteProduit = "UPDATE produit SET quantite = quantite - ? WHERE produit_id = ?";
        var sql_diminuerQuantiteProduit = "UPDATE produit SET quantite = quantite - ?, nombre_ventes = nombre_ventes + ? WHERE produit_id = ?";
        var valuesProduit = [ req.body.quantite, req.body.quantite, req.body.produitId ];
        await SqlConnexion.query(sql_diminuerQuantiteProduit, valuesProduit);

        res.json("OK");
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
})
// Cette route permet d'afficher l'historique des achats
router.get("/afficher", auth, async function(req, res){
    try {

        // Cette fonction va créer la table historique_achat si cela n'a pas déjà été fait fait ainsi que celle des produits et 
        // images si cela n'a pas été aussi fait pour éviter tout bug.
        await creerTableHistoriqueAchats();

        // var sql_mesAchats = "SELECT historique_achats.*, produit.nom, produit.produit_id, photo.public_id, photo.ordre FROM historique_achats INNER JOIN produit_historique_junction ON historique_achats.historique_id = produit_historique_junction.historique_id INNER JOIN produit ON produit_historique_junction.produit_id = produit.produit_id INNER JOIN photo ON produit.produit_id = photo.produit_id WHERE membre_id = ? ORDER BY date_achat DESC, ordre ASC";
        var sql_mesAchats = "SELECT historique_achats.*, produit.nom, produit.produit_id, photo.* FROM historique_achats INNER JOIN produit_historique_junction ON historique_achats.historique_id = produit_historique_junction.historique_id INNER JOIN produit ON produit_historique_junction.produit_id = produit.produit_id INNER JOIN photo ON produit.produit_id = photo.produit_id WHERE membre_id = ? ORDER BY date_achat DESC, ordre ASC";

        var values = req.membre;

        const mesAchats = await SqlConnexion.query(sql_mesAchats, values);

        if(mesAchats.length === 0){
            return res.json("Rien");
        }

        res.json(mesAchats);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

module.exports = router;