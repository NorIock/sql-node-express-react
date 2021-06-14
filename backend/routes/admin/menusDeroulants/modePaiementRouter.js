const router = require("express").Router();
const SqlConnexion = require("../../../SQL/connexion");
const PasDeDoublon = require("../../../middlewares/RequetesSQL/PasDeDoublons");
const adminAuth = require("../../../middlewares/adminAuth");

const creerTableModePaiement = require("../../../SQL/creation/tableModePaiement/creerTableModePaiement");

// Cette route permet d'enregistrer un nouveau mode de paiement
router.post("/ajouter", adminAuth, async function(req, res){
    try{

        // Validation
        if(!req.body.champs){
            return res
                .status(400)
                .send({ msg: "Veuillez indiquer un nouveau mode de paiement"})
        };

        var modePaiementDoublon = "SELECT * FROM mode_paiement WHERE champs = ?";
        const resultatDoublon = await SqlConnexion.query(modePaiementDoublon, [ req.body.champs ]);

        if(resultatDoublon.length > 0){
            return res
                .status(400)
                .send({ msg: "Ce mode de paiement existe déjà" })
        };

        var sqlNouveauModePaiement = "INSERT INTO mode_paiement (champs) VALUES (?)";
        var values = [ req.body.champs ];

        const nouveauModePaiement = await SqlConnexion.query(sqlNouveauModePaiement, [values]);

        res.json(nouveauModePaiement);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet d'afficher les modes de paiements
router.get("/afficher", async function(req, res){
    try{

        // On créé la table si elle n'existe pas
        await creerTableModePaiement();

        var sqlRequete = "SELECT * FROM mode_paiement ORDER BY champs ASC";
        const tousLesModesPaiement = await SqlConnexion.query(sqlRequete);

        if(tousLesModesPaiement.length === 0){
            return res.json("Rien");
        }

        res.json(tousLesModesPaiement);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// cette route permet de récupérer un seul mode de paiement pour l'afficher avant sa modification ou suppression
router.get("/afficher-un/:id", async function(req, res){
    try{

        var sqlRequete = "SELECT * FROM mode_paiement WHERE id = ?";
        const UnModePaiement = await SqlConnexion.query(sqlRequete, [ req.params.id ]);

        res.json(UnModePaiement);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de modifier le mode de paiement
router.put("/modifier/:id", adminAuth, async function(req, res){
    try{

        // On vérifie que la modification ne crée pas un doublon
        var sqlRequeteDoublon = "SELECT * FROM mode_paiement WHERE champs = ?";
        const modePaiementDoublon = await SqlConnexion.query(sqlRequeteDoublon, [ req.body.champs ]);
        if(modePaiementDoublon.length > 0){
            return res
                .status(400)
                .send({ msg: "Ce mode de paiement existe déjà"})
        }

        var sqlRequete = "UPDATE mode_paiement SET champs = ? WHERE id = ?";
        const modePaiementModife = await SqlConnexion.query(sqlRequete, [ req.body.champs, req.params.id ]);

        res.json(modePaiementModife);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de supprimer un mode de paiement
router.delete("/supprimer/:id", adminAuth, async function(req, res){
    try{

        // Pour éviter de futurs problèmes, on ne laisse pas la possibilité de supprimer tous les modes de paiements
        var sql_ilDoitEnResterAuMoinsUn = "SELECT * FROM mode_paiement";
        const ilDoitEnResterAuMoinsUn = await SqlConnexion.query(sql_ilDoitEnResterAuMoinsUn);

        if(ilDoitEnResterAuMoinsUn.length === 1){
            return res
                .status(400)
                .send({ msg: "Vous ne pouvez pas supprimer tous les modes de paiement"})
        }

        var sqlRequete = "DELETE FROM mode_paiement WHERE id = ?";
        const supprimerModePaiement = await SqlConnexion.query(sqlRequete, [ req.params.id ]);

        res.json(supprimerModePaiement);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

module.exports = router;