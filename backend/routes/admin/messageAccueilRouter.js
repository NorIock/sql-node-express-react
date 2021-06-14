const router = require("express").Router();
const SqlConnexion = require("../../SQL/connexion");
const creerTableMessageAccueil = require("../../SQL/creation/tableMessageAccueil/creerSqlTableMessageAccueil");

router.get("/afficher", async function(req, res){
    try {

        // On créer la table si elle n'existe pas
        await creerTableMessageAccueil();

        // Avant de créer l'entrée dans la db, on vérifie qu'elle n'existe pas
        var sql_messageExisteDansDB = "SELECT * FROM message_accueil WHERE intitule = 'message accueil'";
        const messageExisteDansDB = await SqlConnexion.query(sql_messageExisteDansDB);

        // S'il n'existe pas, on le créé
        if(messageExisteDansDB.length === 0){
            var sql_creerAffichageMessage = "INSERT INTO message_accueil (intitule) VALUES ('message accueil')"
            await SqlConnexion.query(sql_creerAffichageMessage);
            return res.json(1);
        }

        // S'il existe on va envoyer le statut d'affichage
        if(messageExisteDansDB.length > 0){
            res.json(messageExisteDansDB[0].afficher);
        }
        
    } catch (err) {
        res.status(500).send({ error: err.message });
        console.log(err);
    }
});

router.get("/modifier-visibilite/:statutActuel", async function(req, res){
    try {

        var sql_modifierVisibilite = "UPDATE message_accueil SET ? WHERE intitule = 'message accueil'";
        var values = [{ afficher: req.params.statutActuel }];
        await SqlConnexion.query(sql_modifierVisibilite, values);

        res.json("OK");
        
    } catch (err) {
        res.status(500).send({ error: err.message });
        console.log(err);
    }
})

module.exports = router;