const router = require("express").Router();
const SqlConnexion = require("../../../SQL/connexion");
const PasDeDoublon = require("../../../middlewares/RequetesSQL/PasDeDoublons");
const adminAuth = require("../../../middlewares/adminAuth");

const creerTableModeLivraison = require("../../../SQL/creation/tableModeLivraison/creerTableModeLivraison");

// Cette route permet d'enregistrer un nouveau mode de livraison
router.post("/ajouter", adminAuth, async function(req, res){
    try{

        // Validation
        if(!req.body.champs){
            return res
                .status(400)
                .send({ msg: "Veuillez indiquer un nouveau mode de livraison"})
        };

        var modeLivraisonDoublon = "SELECT * FROM mode_livraison WHERE champs = ?";
        const resultatDoublon = await SqlConnexion.query(modeLivraisonDoublon, [ req.body.champs ]);

        if(resultatDoublon.length > 0){
            return res
                .status(400)
                .send({ msg: "Ce mode de livraison existe déjà" })
        };

        var sqlNouveauModeLivraison = "INSERT INTO mode_livraison (champs) VALUES (?)";
        var values = [ req.body.champs ];

        const nouveauModeLivraison = await SqlConnexion.query(sqlNouveauModeLivraison, [values]);

        res.json(nouveauModeLivraison);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet d'afficher les modes de livraison
router.get("/afficher", async function(req, res){
    try{

        // On créé la table si elle n'existe pas
        await creerTableModeLivraison();

        var sqlRequete = "SELECT * FROM mode_livraison ORDER BY champs ASC";
        const tousLesModesLivraison = await SqlConnexion.query(sqlRequete);

        if(tousLesModesLivraison.length === 0){
            return res.json("Rien");
        }

        res.json(tousLesModesLivraison);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// cette route permet de récupérer un seul mode de livraison pour l'afficher avant sa modification ou suppression
router.get("/afficher-un/:id", async function(req, res){
    try{

        var sqlRequete = "SELECT * FROM mode_livraison WHERE id = ?";
        const UnModeLivraison = await SqlConnexion.query(sqlRequete, [ req.params.id ]);

        res.json(UnModeLivraison);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de modifier le mode de livraison
router.put("/modifier/:id", adminAuth, async function(req, res){
    try{

        // On vérifie que la modification ne crée pas un doublon
        var sqlRequeteDoublon = "SELECT * FROM mode_livraison WHERE champs = ?";
        const modeLivraisonDoublon = await SqlConnexion.query(sqlRequeteDoublon, [ req.body.champs ]);
        if(modeLivraisonDoublon.length > 0){
            return res
                .status(400)
                .send({ msg: "Ce mode de livraison existe déjà"})
        }

        var sqlRequete = "UPDATE mode_livraison SET champs = ? WHERE id = ?";
        const modeLivraisonModife = await SqlConnexion.query(sqlRequete, [ req.body.champs, req.params.id ]);

        res.json(modeLivraisonModife);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de supprimer un mode de livraison
router.delete("/supprimer/:id", adminAuth, async function(req, res){
    try{

        // Pour éviter de futurs problèmes, on ne laisse pas la possibilité de supprimer tous les modes de livraison
        var sql_ilDoitEnResterAuMoinsUn = "SELECT * FROM mode_livraison";
        const ilDoitEnResterAuMoinsUn = await SqlConnexion.query(sql_ilDoitEnResterAuMoinsUn);

        if(ilDoitEnResterAuMoinsUn.length === 1){
            return res
                .status(400)
                .send({ msg: "Vous ne pouvez pas supprimer tous les modes de paiement"})
        }

        var sqlRequete = "DELETE FROM mode_livraison WHERE id = ?";
        const supprimerModeLivraison = await SqlConnexion.query(sqlRequete, [ req.params.id ]);

        res.json(supprimerModeLivraison);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

module.exports = router;