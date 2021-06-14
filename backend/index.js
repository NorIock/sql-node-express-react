const express = require('express');
const cors = require('cors');

// const myConnectionSQL = require('./connexionSQL');

require("dotenv").config(); // Permet d'enregister des variables d'environnements (dans le fichier .env)
const bodyParser = require('body-parser'); // Permet de découper les informations envoyées depuis le front pour être traitées par le back

// Configuration d'express:
const app = express(); // Permet d'utiliser express

// La limite de 50mb que je met en ligne 13, 16 et 18 permet d'éviter les erreurs lors de l'ajout de plusieurs images en même
// temps (Error: request entity too large)
app.use(express.json({limit: '50mb'})); // Permet de lire les objets json des requêtes
app.use(cors()); // Permet d'utiliser cors

app.use( bodyParser.json({ limit: '50mb'}) ); // Pour le support des JSON-encoded bodie
app.use(bodyParser.urlencoded({     // Pour le support des URL-encoded bodies
    limit: '50mb',
    extended: true
}));

const PORT = process.env.PORT || 5000 // Permettra, quand le site sera déployé, de mettre dans le fichier .env le PORT fourni par l'hébergeur. Sinon, le port 5000 pour le développement

// myConnectionSQL;

app.listen(PORT, function(){
    console.log(`Le serveur s'est lancé sur le port: ${PORT}`);
});

// const CreerDatabase = require("./SQL/creation/tableModePaiment/creerSqlTableModePaiement");
const CreerDatabase = require("./SQL/creation/baseDonnees/creerSqlDb");
CreerDatabase();

// Configuration des routes:
app.use("/membres", require("./routes/membresRouter")); // A chaque fois que l'on enverra une requête au back commançant par /membres, cela lancera le middlewarre membreRouter

// Routes pour l'administrateur;
app.use("/modePaiement", require("./routes/admin/menusDeroulants/modePaiementRouter"));
app.use("/modeLivraison", require("./routes/admin/menusDeroulants/modeLivraisonRouter"));
app.use("/categorieProduits", require("./routes/admin/menusDeroulants/categorieProduitsRouter"));
app.use("/image", require("./routes/admin/testCloudinaryRouter"));
app.use("/produit", require("./routes/admin/produitRouter"));
app.use("/historiqueAchats", require("./routes/historiqueAchatRouter"));
app.use("/message-accueil", require("./routes/admin/messageAccueilRouter"));