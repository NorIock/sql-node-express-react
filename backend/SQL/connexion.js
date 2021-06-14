const util = require("util");
const mysql = require("mysql");
require("dotenv").config(); // Permet d'enregister des variables d'environnements (dans le fichier .env)

function SqlConnexion(){

    const connexion = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    });

    return {
        query(sql, args){
            return util.promisify(connexion.query).call( connexion, sql, args);
        },
        close(){
            return util.promisify(connexion.end).call(connexion)
        }
    }
}

module.exports = SqlConnexion();