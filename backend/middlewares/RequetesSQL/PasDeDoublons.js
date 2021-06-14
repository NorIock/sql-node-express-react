// const SqlConnexion = require("../../SQL/connexion");

// async function PasDeDoublon(nomTable, champsTable, donneeRecherchee, message){

//     var VerifierDoublon = "SELECT * FROM " + nomTable + " WHERE " + champsTable + " = ?";
//     const resultatDoublon = await SqlConnexion.query(VerifierDoublon, [ donneeRecherchee ]);

//     if(resultatDoublon.length > 0){
//         return res
//             .status(400)
//             .send({ msg: message })
//     };
// };

// module.exports = PasDeDoublon();