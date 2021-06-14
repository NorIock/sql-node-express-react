const { cloudinary } = require('../../APIexterne/cloudinary');
const router = require("express").Router();
const SqlConnexion = require("../../SQL/connexion");
const adminAuth = require("../../middlewares/adminAuth");
require('dotenv').config();

router.post("/ajouter", adminAuth, async function(req, res){
    try {
        console.log("Dans la route pour tester cloudinary");

        console.log("req.body: ", req.body);
        console.log("req.body.imagePrecedente.length: ", req.body.imagePrecedente.length);
        // console.log("req.body.imagePrecedente: ", req.body.imagePrecedente);
        // console.log("process.env.CLOUDINARY_FILE: ", process.env.CLOUDINARY_FILE);

        if(req.body.imagePrecedente.length === 0){
            return res
                .status(400).send({ msg: "Veuillez insérer une image" });
        }

        if(req.body.imagePrecedente.length > 6){
            return res
                .status(400).send({ msg: "Veuillez ajouter 6 images maximum"});
        }

        // On créé la table image si elle n'existe pas
        var creerTableImageTest = "CREATE TABLE IF NOT EXISTS image_test (id INT PRIMARY KEY NOT NULL AUTO_INCREMENT, public_id VARCHAR(255), ordre TINYINT(2))";
        await SqlConnexion.query(creerTableImageTest);

        // Permettra de donner un ordre d'apparition des images pour un même produit
        var ordreImage = 0;

        for(let uneImage of req.body.imagePrecedente){
            console.log("Une seule image: ", uneImage);

            ordreImage+=1;
            const cloudinaryReponse = await cloudinary.uploader.upload(
                uneImage, {
                    upload_preset: process.env.CLOUDINARY_FILE,
                });
            
            console.log(cloudinaryReponse);
            console.log("public_id: ", cloudinaryReponse.public_id, );

            var sqlNouvelleImage = "INSERT INTO image_test (public_id, ordre) VALUES (?)";
            var values = [ cloudinaryReponse.public_id, ordreImage ];

            const nouvelleImage = await SqlConnexion.query(sqlNouvelleImage, [values]);
        }
        // const cloudinaryReponse = await cloudinary.uploader.upload(
        //     req.body.imagePrecedente, {
        //         upload_preset: process.env.CLOUDINARY_FILE,
        //     });
        
        // console.log(cloudinaryReponse);
        // console.log("public_id: ", cloudinaryReponse.public_id, );

        // var sqlNouvelleImage = "INSERT INTO image_test (public_id, ordre) VALUES (?)";
        // var ordre = 1;
        // var values = [ cloudinaryReponse.public_id, ordre ];

        // const nouvelleImage = await SqlConnexion.query(sqlNouvelleImage, [values]);


        // res.json(nouvelleImage);
        res.json('OK');
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log(err);
    }
});

router.get("/afficher", async function(req, res){
    try {
        console.log("Dans la route pour afficher les images");

        var sqlAfficherImages = "SELECT * FROM image_test";

        const afficherImages = await SqlConnexion.query(sqlAfficherImages);

        console.log("afficherImages: ", afficherImages);

        res.json(afficherImages);
        // const { ressources } = await cloudinary.search
        //     .expression('folder:process.env.CLOUDINARY_FILE')
        //     .sort_by('public_id', 'desc')
        //     .max_results(30)
        //     .execute();

        // console.log("ressources: ", ressources);
        // const publicIds = ressources.map((file) => file.public_id);

        // res.json(publicIds);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Erreur dans afficher image: ", err);
    }
})

module.exports = router;