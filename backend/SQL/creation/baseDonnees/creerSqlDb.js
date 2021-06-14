const mysql = require('mysql');


const CreerDatabase = function(){

    // Connexion à la base de données
    var myConnectionSQL = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
    });
    
    myConnectionSQL.connect(function(err){
        if(err) throw(err);
        // console.log("Connecté à la base de donnée mysql, youhou !!!!");
        // myConnectionSQL.query("CREATE DATABASE IF NOT EXISTS node_sql", function(err, result){
        myConnectionSQL.query("CREATE DATABASE IF NOT EXISTS " + process.env.DATABASE, function(err, result){
            if(err) throw(err);
            // console.log("Nouvelle base de donnée " + process.env.DATABASE + " créée");
        })
    });
};

module.exports = CreerDatabase;