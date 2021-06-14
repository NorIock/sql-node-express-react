const { cloudinary } = require('../../APIexterne/cloudinary');
const router = require("express").Router();
const SqlConnexion = require("../../SQL/connexion");
const adminAuth = require("../../middlewares/adminAuth");
require('dotenv').config();

const creerTablesProduitsEtPhoto = require('../../SQL/creation/tableProduitsPhotos/CreerTablesProduitEtTablePhoto');
const creerTableJunctionCategorieProduits = require("../../SQL/creation/tableCategorie/creerJunctionCategorieProduits");
const onTrieLesResultatsCommeDansMongoDBPourAdmin = require("../../middlewares/tri/desResultatsCommeMongDBPourAdmin");
const onTrieLesResultatsCommeDansMongoDBPourUtilisateur = require("../../middlewares/tri/desResultatsCommeMongDBPourUtilisateur");

router.post("/ajouter", adminAuth, async function(req, res){

    try {
        if(!req.body.nom){return res.status(400).send({msg: "Veuillez indiquer le nom du produit"})};
        if(req.body.photo.length === 0){return res.status(400).send({msg: "Veuillez ajouter au moins une photo du produit: " + req.body.nom })};
        if(!req.body.prix){return res.status(400).send({msg: "Veuillez indiquer le prix du produit"})};
        if(!req.body.quantite){return res.status(400).send({msg: "Veuillez indiquer la quantité disponible du produit"})};
        if(!req.body.description){return res.status(400).send({msg: "Veuillez indiquer la description du produit"})};
        if(!req.body.categorie){return res.status(400).send({msg: "Veuillez indiquer la catégorie du produit. Si aucune catégorie n'apparait, veuillez les créer via la page administrateur"})};

        // On créé la table de junction entre produits et catégorie si elle n'existe pas
        await creerTableJunctionCategorieProduits();

        // On vérifie qu'il n'existe pas un produit portant le même nom
        var doublon = "SELECT * FROM produit WHERE nom = ?";
        const resultatDoublon = await SqlConnexion.query(doublon, [ req.body.nom ]);
        if(resultatDoublon.length > 0){
            // await db.close();
            return res
                .status(400)
                .json({ msg: "Il existe déjà un produit " + req.body.nom})
        }
        
        // On enregistre le nouveau produit dans la DB
        var sql_nouveauProduit = "INSERT INTO produit (nom, prix, quantite, description, date_creation) VALUES (?)";
        let valuesProduit = [ req.body.nom, req.body.prix, req.body.quantite, req.body.description, Date.now() ]
        const nouveauProduit = await SqlConnexion.query(sql_nouveauProduit, [valuesProduit]);

        // On fait la lisaison entre le produit et sa catégorie
        var sql_categorieProduit = "INSERT INTO produit_categorie_junction (produit_id, categorie_id) VALUES (?)";
        let valuesCategorieProduit = [ nouveauProduit.insertId, req.body.categorie ]
        await SqlConnexion.query(sql_categorieProduit, [valuesCategorieProduit]);

        // On s'occupe des photos

        var ordreImage = 0; // Permet de donner l'ordre d'apparition des images

        for(let unePhoto of req.body.photo){

            ordreImage+=1;
            // On l'upload dans cloudinary
            const cloudinaryReponse = await cloudinary.uploader.upload(
                unePhoto, {
                    upload_preset: process.env.CLOUDINARY_FILE,
                });

            // On insère le public_id de cloudinary dans la db
            // var sqlNouvellePhoto = "INSERT INTO photo (public_id, ordre, produit_id) VALUES (?)";
            var sqlNouvellePhoto = "INSERT INTO photo (public_id, ordre, largeur, hauteur, produit_id) VALUES (?)";
            let valuesPhoto = [ cloudinaryReponse.public_id, ordreImage, cloudinaryReponse.width, cloudinaryReponse.height, nouveauProduit.insertId ];

            const nouvelleImage = await SqlConnexion.query(sqlNouvellePhoto, [valuesPhoto]);
        }

        res.json(nouveauProduit);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.get("/afficher-un/:id", async function(req, res){
    try {

        // // INNER JOIN photo ON produit.produit_id = photo.produit_id
        // // var sql_trouverUnProduit = "SELECT * FROM produit INNER JOIN photo ON produit.produit_id = photo.produit_id WHERE produit.produit_id = ?";
        // var sql_trouverUnProduit = "SELECT * FROM produit LEFT OUTER JOIN photo ON produit.produit_id = photo.produit_id AND produit.produit_id = ?";
        // const trouverUnProduit = await SqlConnexion.query(sql_trouverUnProduit, [req.params.id ]);
        // console.log("trouverUnProduit: ", trouverUnProduit);

        // Je n'arrive pas à faire comme le populate de mongoose afin d'avoir un objet (le produit) avec dedans l'array qui contient
        // les photos. Je laisse quelques essais en commentaire. Je vais essayer de faire différement

        // Je récupère d'abord le produit
        var sql_trouverLeProduit = "SELECT * FROM produit WHERE produit_id = ?";
        const trouverUnProduit = await SqlConnexion.query(sql_trouverLeProduit, [req.params.id ]);

        // Je récupère ensuite les images qui correspondent au produit
        var sql_imagesCorrespondantes = "SELECT * FROM photo WHERE produit_id = ? ORDER BY ordre ASC";
        const trouverLesPhotos = await SqlConnexion.query(sql_imagesCorrespondantes, [req.params.id ]);

        // On regroupe mes résutats dans un objet
        const resultat = {
            produit_id: trouverUnProduit[0].produit_id,
            nom: trouverUnProduit[0].nom,
            prix: trouverUnProduit[0].prix,
            quantite: trouverUnProduit[0].quantite,
            description: trouverUnProduit[0].description,
            nombre_ventes: trouverUnProduit[0].nombre_ventes,
            nombre_panier: trouverUnProduit[0].nombre_panier,
            nombre_liste_envie: trouverUnProduit[0].nombre_liste_envie,
            date_creation: trouverUnProduit[0].date_creation,
            en_vente: trouverUnProduit[0].en_vente,
            nombre_vues: trouverUnProduit[0].nombre_vues,
            photos: []
        }

        for(let unePhoto of trouverLesPhotos){
            resultat.photos.push(unePhoto)
        }

        res.json(resultat);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.put("/modifier/:id", async function(req, res){
    try {

        // On vérifie que la modification ne crée pas un doublon
        var sqlRequeteDoublon = "SELECT * FROM produit WHERE nom = ?";
        const produitDoublon = await SqlConnexion.query(sqlRequeteDoublon, [req.body.nom]);
        if(produitDoublon.length > 0){
            return res
                .status(400)
                .send({ msg: "Un produit existe déjà avec ce nom"})
        }

        // On récupère le produit pour faciliter sa modification au cas où l'administrateur ne modifie pas tous les champs
        var sqlProduitAvantModification = "SELECT * FROM produit WHERE produit_id = ?"
        const produitAvantModification = await SqlConnexion.query(sqlProduitAvantModification, [req.params.id]);

        if(!req.body.nom){req.body.nom = produitAvantModification[0].nom}
        if(!req.body.prix){req.body.prix = produitAvantModification[0].prix}
        if(!req.body.quantite){req.body.quantite = produitAvantModification[0].quantite}
        if(!req.body.description){req.body.description = produitAvantModification[0].description}

        // On enregistre les modifications
        var sqlModifierProduit = "UPDATE produit SET ? WHERE produit_id = ?"
        var valuesProduit = [{ nom: req.body.nom, prix: req.body.prix, quantite: req.body.quantite, description: req.body.description }, req.params.id ];
        const produitModifie = await SqlConnexion.query(sqlModifierProduit, valuesProduit);

        // On s'occupe des photos que l'on rajoute
        if(req.body.photo.length > 0){
            // On récupère les photos du produit pour connaître le dernier numéro correspondant à l'ordre d'apparition
            var sql_photosExistantes = "SELECT ordre FROM photo WHERE produit_id = ? ORDER BY ordre DESC";
            const photosExistantes = await SqlConnexion.query(sql_photosExistantes, [req.params.id ]);

            let ordrePhotos = photosExistantes[0].ordre;

            for(let unePhoto of req.body.photo){

                ordrePhotos+=1;
                // On l'upload dans cloudinary
                const cloudinaryReponse = await cloudinary.uploader.upload(
                    unePhoto, {
                        upload_preset: process.env.CLOUDINARY_FILE,
                    });
    
                // On insère le public_id de cloudinary dans la db
                var sqlNouvellePhoto = "INSERT INTO photo (public_id, ordre, largeur, hauteur, produit_id) VALUES (?)";
                let valuesPhoto = [ cloudinaryReponse.public_id, ordrePhotos, cloudinaryReponse.width, cloudinaryReponse.height, req.params.id ];
    
                await SqlConnexion.query(sqlNouvellePhoto, [valuesPhoto]);
            }
        }

        // On s'occupe des photos que l'on supprime
        if(req.body.photoSupprimer.length > 0){

            for(supprimerUnePhoto of req.body.photoSupprimer){
                // On la supprime de la base de donnée
                var sql_supprimerUnePhoto = "DELETE FROM photo WHERE public_id = ?";
                const supprimerPhoto = SqlConnexion.query(sql_supprimerUnePhoto, [ supprimerUnePhoto ]);

                // On la supprime de cloudinary
                await cloudinary.uploader.destroy(
                    supprimerUnePhoto, {
                        upload_preset: process.env.CLOUDINARY_FILE,
                    }
                )
            }
        }
        res.json(produitModifie);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.get("/afficher-tous/:classement/:croissantOuDecroissant/:enVente/:recherche", adminAuth, async function(req, res){
    try {

        // On va modifier les valeurs de quelques req.params pour faciliter les requêtes mysql
        switch(req.params.croissantOuDecroissant){
            case "Croissant":
                var croissantOuDecroissant = "ASC";
                break;
            case "Décroissant":
                var croissantOuDecroissant = "DESC";
                break;
        }

        switch(req.params.classement){
            case "Nom":
                var classement = "nom";
                break;
            case "Prix":
                var classement = "prix";
                break;
            case "Quantité":
                var classement = "quantite";
                break;
            case "Date création":
                var classement = "date_creation";
                break;
            case "Nombre vues":
                var classement = "nombre_vues";
                break;
            case "Nombre ventes":
                var classement = "nombre_ventes";
                break;
        }

        switch(req.params.enVente){
            case "Tous":
                var produitEnVente = undefined;
                break;
            case "Oui":
                var produitEnVente = 1;
                break;
            case "Non":
                var produitEnVente = 0;
                break;
        }

        var sql_afficherTousLesProduits;

        if(req.params.recherche === 'undefined'){
            if(produitEnVente === undefined){
                sql_afficherTousLesProduits = "SELECT * FROM produit ORDER by " + classement + " " + croissantOuDecroissant;
                const trouverTousLesProduits = await SqlConnexion.query(sql_afficherTousLesProduits);
                if(trouverTousLesProduits.length === 0){
                    return res.json("Rien");
                }
                let data = await onTrieLesResultatsCommeDansMongoDBPourAdmin(trouverTousLesProduits);

                res.json(data);

            } else {
                sql_afficherTousLesProduitsEnVenteOuNon = "SELECT * FROM produit WHERE en_vente = ? ORDER by " + classement + " " + croissantOuDecroissant;
                const trouverTousLesProduits = await SqlConnexion.query(sql_afficherTousLesProduitsEnVenteOuNon, produitEnVente);
                if(trouverTousLesProduits.length === 0){
                    return res.json("Rien");
                }
                let data = await onTrieLesResultatsCommeDansMongoDBPourAdmin(trouverTousLesProduits);

                res.json(data);
            }
        }
        if(req.params.recherche !== 'undefined'){
            if(produitEnVente === undefined){
                sql_afficherTousLesProduits = "SELECT * FROM produit WHERE nom LIKE ? ORDER by " + classement + " " + croissantOuDecroissant;
                const trouverTousLesProduits = await SqlConnexion.query(sql_afficherTousLesProduits, ['%' + req.params.recherche + '%']);
                if(trouverTousLesProduits.length === 0){
                    return res.json("Rien");
                }
                let data = await onTrieLesResultatsCommeDansMongoDBPourAdmin(trouverTousLesProduits);
                res.json(data);
            } else {
                sql_afficherTousLesProduits = "SELECT * FROM produit WHERE nom LIKE ? AND en_vente = ? ORDER by " + classement + " " + croissantOuDecroissant;
                const trouverTousLesProduits = await SqlConnexion.query(sql_afficherTousLesProduits, ['%' + req.params.recherche + '%', produitEnVente]);
                if(trouverTousLesProduits.length === 0){
                    return res.json("Rien");
                }
                let data = await onTrieLesResultatsCommeDansMongoDBPourAdmin(trouverTousLesProduits);
                res.json(data);
            }
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet de remettre ou retirer un produit de la vente
router.post("/retirer-ou-remettre-en-vente/:id", async function(req, res){
    try {

        // On enregistre les modifications
        var sqlModifierMiseEnVenteProduit = "UPDATE produit SET ? WHERE produit_id = ?"
        var valuesProduit = [{ en_vente: req.body.modifierEn_vente }, req.params.id ];
        const disponibiliteVenteModifie = await SqlConnexion.query(sqlModifierMiseEnVenteProduit, valuesProduit);

        res.json(disponibiliteVenteModifie);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet d'afficher les derniers produits ajoutés
router.get("/derniers-ajouts", async function(req, res){
    try {

        // Comme sur la page d'accueil du site il y aura directement la requête pour afficher les nouveautés, et que ce sera la 
        // première page d'affichée, on créer ici la table produit et la table photo
        await creerTablesProduitsEtPhoto();

        var sqlDerniersProduitsAjoutes = "SELECT * FROM produit WHERE en_vente = 1 ORDER BY date_creation DESC LIMIT 4";
        const derniersProduitsAjoutes = await SqlConnexion.query(sqlDerniersProduitsAjoutes);

        if(derniersProduitsAjoutes.length === 0){
            return res.json("Rien");
        }

        let data = await onTrieLesResultatsCommeDansMongoDBPourUtilisateur(derniersProduitsAjoutes);

        res.json(data);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet d'afficher les produits les plus consultés
router.get("/les-plus-consultes", async function(req, res){
    try {

        // Comme sur la page d'accueil du site il y aura directement la requête pour afficher les nouveautés, et que ce sera la 
        // première page d'affichée, on créer ici la table produit et la table photo
        await creerTablesProduitsEtPhoto();

        var sql_lesPlusConsultes = "SELECT * FROM produit WHERE en_vente = 1 ORDER by nombre_vues DESC LIMIT 4";
        const produitsLesPlusConsultes = await SqlConnexion.query(sql_lesPlusConsultes);

        if(produitsLesPlusConsultes.length === 0){
            return res.json("Rien");
        }

        let data = await onTrieLesResultatsCommeDansMongoDBPourUtilisateur(produitsLesPlusConsultes);

        res.json(data);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet d'afficher les meilleurs ventes
router.get("/meilleures-ventes", async function(req, res){
    try {
        console.log("Dans la route pour afficher les meilleurs ventes");

        // Comme sur la page d'accueil du site il y aura directement la requête pour afficher les nouveautés, et que ce sera la 
        // première page d'affichée, on créer ici la table produit et la table photo
        await creerTablesProduitsEtPhoto();

        var sql_meilleuresVentes = "SELECT * FROM produit WHERE en_vente = 1 ORDER BY nombre_ventes DESC LIMIT 4";
        const meilleuresVentes = await SqlConnexion.query(sql_meilleuresVentes);

        if(meilleuresVentes.length === 0){
            return res.json("Rien");
        }

        let data = await onTrieLesResultatsCommeDansMongoDBPourUtilisateur(meilleuresVentes);

        res.json(data);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet d'afficher les résultats d'une recherche effectuée par un utilisateur
router.get("/recherche-utilisateur/:recherche", async function(req, res){
    try {

        sql_afficherResultatRecherche = "SELECT * FROM produit WHERE nom LIKE ? AND en_vente = 1 ORDER by nom ASC";
        const resultatRecherche = await SqlConnexion.query(sql_afficherResultatRecherche, ['%' + req.params.recherche + '%']);
        if(resultatRecherche.length === 0){
            return res.json("Rien");
        }
        let data = await onTrieLesResultatsCommeDansMongoDBPourUtilisateur(resultatRecherche);
        res.json(data);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

// Cette route permet d'afficher un produit pour un utilisateur
router.get("/recherche/afficherUn/:id", async function(req, res){
    try {

        // Je récupère d'abord le produit
        var sql_trouverLeProduit = "SELECT * FROM produit WHERE produit_id = ?";
        const trouverUnProduit = await SqlConnexion.query(sql_trouverLeProduit, [req.params.id ]);

        // Je récupère ensuite les images qui correspondent au produit
        var sql_imagesCorrespondantes = "SELECT * FROM photo WHERE produit_id = ? ORDER BY ordre ASC";
        const trouverLesPhotos = await SqlConnexion.query(sql_imagesCorrespondantes, [req.params.id ]);

        // On regroupe mes résutats dans un objet
        const resultat = {
            produit_id: trouverUnProduit[0].produit_id,
            nom: trouverUnProduit[0].nom,
            prix: trouverUnProduit[0].prix,
            quantite: trouverUnProduit[0].quantite,
            description: trouverUnProduit[0].description,
            en_vente: trouverUnProduit[0].en_vente,
            photos: [],
        }

        for(let unePhoto of trouverLesPhotos){
            resultat.photos.push(unePhoto)
        }

        // J'incrémente le nombre de vues du produit
        var sql_incrementerNombreVues = "UPDATE produit SET nombre_vues = nombre_vues + 1 WHERE produit_id = ?";
        await SqlConnexion.query(sql_incrementerNombreVues, [req.params.id]);

        res.json(resultat);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

module.exports = router;