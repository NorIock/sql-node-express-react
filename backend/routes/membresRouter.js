const router = require("express").Router();
const bcrypt = require('bcryptjs'); // Permet d'utiliser bcrypt pour hasher et comparer les mots de passe
const jwt = require('jsonwebtoken'); // Permet d'utiliser les JWT pour les sessions
const SqlConnexion = require("../SQL/connexion");
const auth = require('../middlewares/auth'); // Permet d'utiliser le middleware auth
const creerTableMembre = require("../SQL/creation/tableMembre/creerSqlTableMembre");
const adminAuth = require("../middlewares/adminAuth");


// Cette route permet d'enregistrer un nouveau membre
router.post("/inscription", async function(req, res){
    try{

        // On créé la table membre si elle n'existe pas
        await creerTableMembre();

        // Validations
        if(!req.body.nom ||
            !req.body.prenom ||
            !req.body.email ||
            !req.body.motDePasse ||
            !req.body.motDePasseConfirmation ||
            !req.body.adresse ||
            !req.body.codePostal ||
            !req.body.ville){
                return res
                    .status(400)
                    .send({ msg: "Tous les champs munis d'une étoile doivent être remplis" })
        }
        if(req.body.nom.length < 3){
            return res
                .status(400)
                .send({ msg: "Le nom doit comporter au minimum 3 caractères"})
        }
        if(req.body.prenom.length < 3){
            return res
                .status(400)
                .send({ msg: "Le prénom doit comporter au minimum 3 caractères"})
        }
        if(!RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$').test(req.body.email)){
            return res
                .status(400)
                .send({ msg: "Le format de l'email doit être valide" });
        }
        if(req.body.codePostal.length !== 5){
            return res
                .status(400)
                .send({ msg: "Le code postal doit comporter 5 chiffres" })
        }
        if(req.body.motDePasse !== req.body.motDePasseConfirmation){
            return res
                .status(400)
                .send({ msg: "Le mot de passe et sa confirmation doivent correspondre" })
        }

        var emailDoublon = "SELECT * FROM membres WHERE email = ?";
        const resultatDoublon = await SqlConnexion.query(emailDoublon, [ req.body.email ]);
        if(resultatDoublon.length > 0){
            // await db.close();
            return res
                .status(400)
                .json({ msg: "Un compte existe déjà avec cet email"})
        }

        // On hash le mot de passe avant de l'insérer dans la base de données
        const salt = await bcrypt.genSalt(12); // Génère le sel pour le hashage du mot de passe. 12 est le minimum recommandé
        const mot_de_passe_hash = await bcrypt.hash(req.body.motDePasse, salt);

        // On vérifie s'il s'agit du premier membre créé
        var sql_premierMembre = "SELECT * FROM membres";
        const premierMembre = await SqlConnexion.query(sql_premierMembre);

        // S'il s'agit du premier membre créé, il aura le statut d'administrateur
        if(premierMembre.length === 0){
            var sql_nouveauMembre = "INSERT INTO membres (nom, prenom, email, mot_de_passe, adresse, code_postal, ville, admin) VALUES (?)";
            var values = [ req.body.nom, req.body.prenom, req.body.email, mot_de_passe_hash, req.body.adresse, req.body.codePostal, req.body.ville, true ];
        }

        // S'il ne s'agit pas du permier membre, il sera simple utilisateur
        if(premierMembre.length > 0){
            var sql_nouveauMembre = "INSERT INTO membres (nom, prenom, email, mot_de_passe, adresse, code_postal, ville) VALUES (?)";
            var values = [ req.body.nom, req.body.prenom, req.body.email, mot_de_passe_hash, req.body.adresse, req.body.codePostal, req.body.ville ];
        }
        
        // Commenter les lignes 70 et 71 et décommenter les 66 et 67 pour pouvoir créer un non administrateur
        // var sql_nouveauMembre = "INSERT INTO membres (nom, prenom, email, mot_de_passe, adresse, code_postal, ville) VALUES (?)";
        // var values = [ req.body.nom, req.body.prenom, req.body.email, mot_de_passe_hash, req.body.adresse, req.body.codePostal, req.body.ville ];

        // Décommenter les lignes 70 et 71 et commenter les 66 et 67 pour pouvoir créer un administrateur
        // var sql_nouveauMembre = "INSERT INTO membres (nom, prenom, email, mot_de_passe, adresse, code_postal, ville, admin) VALUES (?)";
        // var values = [ req.body.nom, req.body.prenom, req.body.email, mot_de_passe_hash, req.body.adresse, req.body.codePostal, req.body.ville, true ];

        const nouveauMembre = await SqlConnexion.query(sql_nouveauMembre, [values]);

        res.json(nouveauMembre);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("err: ", err);
    }
});

// Cette route permet à un membre de se connecter
router.post("/connexion", async function(req, res){
    try{

        // Validations
        if(!req.body.email || !req.body.motDePasse){
            return res
                .status(400)
                .send({ msg: "Tous les champs doivent être remplis"});
        }

        var trouverMembre = "SELECT * FROM membres WHERE email = ?";
        const membre = await SqlConnexion.query(trouverMembre, [ req.body.email ]);

        // On vérifie que l'on a bien un résultat
        if(membre.length === 0){
            return res
                .status(400)
                .send({ msg: "Aucun membre trouvé"});
        }

        // On vérifie que le mot de passe indiqué correspond à celui de la base de données
        const motsSePasseCorrespondent = await bcrypt.compare(req.body.motDePasse, membre[0].mot_de_passe);
        if(!motsSePasseCorrespondent){
            return res
                .status(400)
                .send({ msg: "L'email et le mot de mot de passe ne correspondent pas"});
        }
        
        const token = jwt.sign({ membre_id: membre[0].membre_id, test: membre[0].admin}, process.env.JWT_SECRET);
        res.json({
            token, 
            membre: {
                nom: membre[0].nom,
                prenom: membre[0].prenom,
                email: membre[0].email,
                date_naissance: membre[0].date_naissance,
                adresse: membre[0].adresse,
                code_postal: membre[0].code_postal,
                ville: membre[0].ville,
                test: membre[0].admin,
            }
        });        

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("err: ", err);
    }
});

// Cette route permet d'afficher les données du membre connecté
router.get("/afficher-connecte", auth, async function(req, res){
    try{

        var rechercheMembre = "SELECT * FROM membres WHERE membre_id = ?";
        var values = req.membre;

        const membre = await SqlConnexion.query(rechercheMembre, values);

        res.json(membre);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("err: ", err);
    }
});

// Cette route permet de modifier l'adresse à partir de l'écran d'achat
router.post("/modifier-adresse-depuis-ecran-achat", auth, async function(req, res){
    try {

        var sql_modifierAdresse = "UPDATE membres SET ? WHERE membre_id = ?";
        var values = [{adresse: req.body.adresse, code_postal: req.body.codePostal, ville: req.body.ville}, req.membre];
        const nouvelleAdresse = SqlConnexion.query(sql_modifierAdresse, values);

        res.json(nouvelleAdresse);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de vérifier le mot de passe avant de faire une modification du profil du membre
router.post("/verification-mdp", auth, async function(req, res){
    try{

        // Validations
        if(!req.body.motDePasse){
            return res
                .status(400)
                .send({ msg: "Veuillez indiquer votre mot de passe."})
        }

        var sql_donneesMembre = "SELECT mot_de_passe FROM membres WHERE membre_id = ?";
        const membre = await SqlConnexion.query(sql_donneesMembre, [ req.membre ]);
        
        if(membre.length === 0){
            return res
                .status(400)
                .send({ msg: "Aucun membre trouvé"});
        }

        const motsDePasseCorrespondent = await bcrypt.compare(req.body.motDePasse, membre[0].mot_de_passe);
        if(!motsDePasseCorrespondent){
            return res
            .status(400)
            .send({ msg: "Mauvais mot de passe"});
        } else {
            return res.json(true);
        }
    } catch(err){
        res.status(500).json({ error: err.message })
    };
});

// cette route permet de modifier le profil du membre connecté
router.post("/modifier-profil", auth, async function(req, res){
    try {

        // On vérifie qu'au moins un champ est modifié
        if(!req.body.email 
            && !req.body.motDePasse
            && !req.body.motDePasseConfirmation
            && !req.body.adresse
            && !req.body.codePostal
            && !req.body.ville){
            return res
                .status(400)
                .send({ msg: "Veuillez remplir au moins un champ pour faire une modification de votre profil"})
        }

        // On verifie, s'il y a un nouveau mail demandé, qu'il n'existe pas pour un autre membre
        if(req.body.email){
            var sql_mailExisteDeja = "SELECT * FROM membres WHERE email = ?";
            const emailExisteDeja = await SqlConnexion.query(sql_mailExisteDeja, [ req.body.email ]);
            if(emailExisteDeja.length > 0){
                return res
                    .status(400)
                    .send({ msg: "Cet email est déjà utilisé "});
            }
        }

        // On vérifie, en cas de modification du mot de passe que les 2 champs sont complétés
        if((req.body.motDePasse && !req.body.motDePasseConfirmation) || (!req.body.motDePasse && req.body.motDePasseConfirmation)){
            return res
                .status(400)
                .send({ msg: "Si vous souhaitez modifier votre mot de passe, veuillez remplir les 2 champs correspondant"});
        }

        // On vérifie que le mot de passe et sa confirmation sont égaux
        if(req.body.motDePasse && req.body.motDePasseConfirmation && req.body.motDePasse !== req.body.motDePasseConfirmation){
            return res
                .status(400)
                .send({ msg: "Le mot de passe et sa confirmation doivent correspondre"});
        }

        // On récupère le profil pour faciliter sa modification au cas où le membre ne modifie pas tous les champs
        var sql_profilAvantModification = "SELECT * FROM membres WHERE membre_id = ?"
        const profilAvantModification = await SqlConnexion.query(sql_profilAvantModification, [req.membre]);

        if(!req.body.email){req.body.email = profilAvantModification[0].email}
        if(!req.body.adresse){req.body.adresse = profilAvantModification[0].adresse}
        if(!req.body.codePostal){req.body.codePostal = profilAvantModification[0].code_postal}
        if(!req.body.ville){req.body.ville = profilAvantModification[0].ville}

        // // On enregistre les modifications
        var sql_modifierProfil = "UPDATE membres SET ? WHERE membre_id = ?"

        // Comme on ne peut associer le mot de passe avec ce qui est fait si dessus (à cause du crypatage) on va faire 2 cas de
        // figure pour les valeurs à insérer dans les valeurs transmises dans la requête sql
        if(req.body.motDePasse){
            // On hash le mot de passe avant de l'insérer dans la base de données
            const salt = await bcrypt.genSalt(12); // Génère le sel pour le hashage du mot de passe. 12 est le minimum recommandé
            const mot_de_passe_hash = await bcrypt.hash(req.body.motDePasse, salt);
            var values = [{ email: req.body.email, mot_de_passe: mot_de_passe_hash, adresse: req.body.adresse, code_postal: req.body.codePostal, ville: req.body.ville }, req.membre ];
        }
        if(!req.body.motDePasse){
            var values = [{ email: req.body.email, adresse: req.body.adresse, code_postal: req.body.codePostal, ville: req.body.ville }, req.membre ];
        }

        const profilModifie = await SqlConnexion.query(sql_modifierProfil, values);

        res.json(profilModifie);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
})

// Cette route permet de vérifier si le json web token est valide. La requête est dans app.js
router.post("/tokenValide", async function(req, res){
    try{

        // S'il n'y a pas de token, on renvoie false
        const token = req.header("x-auth-token");
        if(!token){
            return res.json(false);
        }
        // Si la vérification du token échoue, on envoie false
        const verifierToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!verifierToken){
            return res.json(false);
        }

        // Comme cette route est directement appelée en lançant npm start pour la première fois, c'est ici que l'on créé le table
        // membres si elle n'existe pas
        await creerTableMembre();

        // On vérifie que le membre existe toujours (compte supprimé par exemple)
        var trouverMembre = "SELECT * FROM membres WHERE membre_id = ?";
        const membre = await SqlConnexion.query(trouverMembre, [ verifierToken.id ]);
        if(!membre){
            return res.json(false);
        }
        // Si toutes les vérifications (les if) passent, on renvoie true
        return res.json(true);

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("err: ", err);
    }
});

// Cette route permet de récupérer les informations du membre connecté. La requête est dans app.js
router.get("/", auth, async function(req, res){
    try{

        // Comme cette route est directement appelée en lançant npm start pour la première fois, c'est ici que l'on créé le table
        // membres si elle n'existe pas
        await creerTableMembre();

        var donnesMembreConnecte = "SELECT * FROM membres WHERE membre_id = ?";
        const membre = await SqlConnexion.query(donnesMembreConnecte, [ req.membre ]);

        // Le premier if sert à éviter une erreur s'il n'y a pas de membre connecté
        if(membre.length > 0){
            if(membre[0].admin){
                res.json({
                    prenom: membre[0].prenom,
                    id: membre[0].membre_id,
                    test: membre[0].admin
                })
            } else{
                res.json({
                    prenom: membre[0].prenom,
                    id: membre[0].membre_id
                })
            }
        }

    } catch(err){
        res.status(500).json({ error: err.message });
        console.log("err: ", err);
    }
});

// Cette route permet à un administrateur d'en créer un autre
router.post("/creation-admin", adminAuth, async function(req, res){

    try {

        // Validations
        if(!req.body.nom ||
            !req.body.prenom ||
            !req.body.email ||
            !req.body.motDePasse ||
            !req.body.motDePasseConfirmation ||
            !req.body.adresse ||
            !req.body.codePostal ||
            !req.body.ville){
                return res
                    .status(400)
                    .send({ msg: "Tous les champs munis d'une étoile doivent être remplis" })
        }
        if(req.body.nom.length < 3){
            return res
                .status(400)
                .send({ msg: "Le nom doit comporter au minimum 3 caractères"})
        }
        if(req.body.prenom.length < 3){
            return res
                .status(400)
                .send({ msg: "Le prénom doit comporter au minimum 3 caractères"})
        }
        if(!RegExp('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,}$').test(req.body.email)){
            return res
                .status(400)
                .send({ msg: "Le format de l'email doit être valide" });
        }
        if(req.body.codePostal.length !== 5){
            return res
                .status(400)
                .send({ msg: "Le code postal doit comporter 5 chiffres" })
        }
        if(req.body.motDePasse !== req.body.motDePasseConfirmation){
            return res
                .status(400)
                .send({ msg: "Le mot de passe et sa confirmation doivent correspondre" })
        }

        var emailDoublon = "SELECT * FROM membres WHERE email = ?";
        const resultatDoublon = await SqlConnexion.query(emailDoublon, [ req.body.email ]);
        if(resultatDoublon.length > 0){
            // await db.close();
            return res
                .status(400)
                .json({ msg: "Un compte existe déjà avec cet email"})
        }

        // On hash le mot de passe avant de l'insérer dans la base de données
        const salt = await bcrypt.genSalt(12); // Génère le sel pour le hashage du mot de passe. 12 est le minimum recommandé
        const mot_de_passe_hash = await bcrypt.hash(req.body.motDePasse, salt);

        var sql_nouvelAdmin = "INSERT INTO membres (nom, prenom, email, mot_de_passe, adresse, code_postal, ville, admin) VALUES (?)";
        var values = [ req.body.nom, req.body.prenom, req.body.email, mot_de_passe_hash, req.body.adresse, req.body.codePostal, req.body.ville, true ];

        const nouvelAdmin = await SqlConnexion.query(sql_nouvelAdmin, [values]);

        res.json(nouvelAdmin);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("err: ", err);
    }

});

module.exports = router;