const router = require("express").Router();
const SqlConnexion = require("../../../SQL/connexion");
const PasDeDoublon = require("../../../middlewares/RequetesSQL/PasDeDoublons");
const adminAuth = require("../../../middlewares/adminAuth");

const creerTableCategorie = require("../../../SQL/creation/tableCategorie/creerTableCategorie");

// Cette route permet d'enregistrer une nouvelle catégorie pour les produits
router.post("/ajouter", adminAuth, async function(req, res){
    try{

        // Validation
        if(!req.body.champs){
            return res
                .status(400)
                .send({ msg: "Veuillez indiquer une nouvelle catégorie"})
        };

        var categorieDoublon = "SELECT * FROM categorie WHERE champs = ?";
        const resultatDoublon = await SqlConnexion.query(categorieDoublon, [ req.body.champs ]);

        if(resultatDoublon.length > 0){
            return res
                .status(400)
                .send({ msg: "Cette catégorie existe déjà" })
        };

        var sqlNouvelleCategorie = "INSERT INTO categorie (champs) VALUES (?)";
        var values = [ req.body.champs ];

        const nouvelleCategorie = await SqlConnexion.query(sqlNouvelleCategorie, [values]);

        res.json(nouvelleCategorie);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet d'afficher les catégories de produits
router.get("/afficher", async function(req, res){
    try{

        // On créé la table si elle n'existe pas
        await creerTableCategorie();

        var sqlRequete = "SELECT * FROM categorie ORDER BY champs ASC";
        const toutesLesCategories = await SqlConnexion.query(sqlRequete);

        if(toutesLesCategories.length === 0){
            return res.json("Rien");
        }

        res.json(toutesLesCategories);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// cette route permet de récupérer une seule catégorie pour l'afficher avant sa modification ou suppression
router.get("/afficher-un/:id", async function(req, res){
    try{

        var sqlRequete = "SELECT * FROM categorie WHERE id = ?";
        const UneCategorie = await SqlConnexion.query(sqlRequete, [ req.params.id ]);

        res.json(UneCategorie);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de modifier la catégorie
router.put("/modifier/:id", adminAuth, async function(req, res){
    try{

        // On vérifie que la modification ne crée pas un doublon
        var sqlRequeteDoublon = "SELECT * FROM categorie WHERE champs = ?";
        const categorieDoublon = await SqlConnexion.query(sqlRequeteDoublon, [ req.body.champs ]);
        if(categorieDoublon.length > 0){
            return res
                .status(400)
                .send({ msg: "Cette catégorie existe déjà"})
        }

        var sqlRequete = "UPDATE categorie SET champs = ? WHERE id = ?";
        const categorieModifee = await SqlConnexion.query(sqlRequete, [ req.body.champs, req.params.id ]);

        res.json(categorieModifee);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de supprimer un mode de livraison
router.delete("/supprimer/:id", adminAuth, async function(req, res){
    try{

        // Pour éviter de futurs problèmes, on ne laisse pas la possibilité de supprimer toutes les catégories
        var sql_ilDoitEnResterAuMoinsUn = "SELECT * FROM categorie";
        const ilDoitEnResterAuMoinsUn = await SqlConnexion.query(sql_ilDoitEnResterAuMoinsUn);

        if(ilDoitEnResterAuMoinsUn.length === 1){
            return res
                .status(400)
                .send({ msg: "Vous ne pouvez pas supprimer tous les modes de paiement"})
        }

        var sqlRequete = "DELETE FROM categorie WHERE id = ?";
        const supprimerCategorie = await SqlConnexion.query(sqlRequete, [ req.params.id ]);

        res.json(supprimerCategorie);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

module.exports = router;