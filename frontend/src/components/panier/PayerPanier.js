import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Requete from '../../middlewares/Requete';
import GetToken from '../../middlewares/GetToken';
import ErrorNotice from '../../middlewares/ErrorNotice';
import UserContext from '../../context/UserContext';

import MenuDeroulantModeLivraison from '../menuDeroulant/modeLivraison';
import MenuDeroulantModePaiement from '../menuDeroulant/modePaiement';
import CalculerTotalPanier from './CalculerTotalPanier';
import ModifierAdresseDepuisPageAchat from '../achat/ModifierAdresseEcranAchat';

export default function FinaliserPaiementPanier(){

    const [panierData, setPanierData] = useState([]);
    const [error, setError] = useState();
    const history = useHistory();
    const [achatPanier, setAchatPanier] = useState(false);
    
    // Seront utilisés par le component ModifierAdresseDepuisPageAchat. Ils sont déclarés ici pour récupérer les valeurs
    const [modifierAdresse, setModifierAdresse] = useState(false);
    const [adresse, setAdresse] = useState();
    const [codePostal, setCodePostal] = useState();
    const [ville, setVille] = useState();

    // Seront utilisés par le component MenuDeroulantModeLivraison. Ils sont déclarés ici pour récupérer les valeurs
    const [livraison, setLivraison] = useState();

    // Seront utilisés par le component MenuDeroulantModePaiement. Ils sont déclarés ici pour récupérer les valeurs
    const [paiement, setPaiement] = useState();

    let token = GetToken();

    useEffect(()=>{
        async function fetchPanierSimplifie(){
            const panierSimplifieResult = await Requete.get(
                "panier/simplifie",
                { headers: { "x-auth-token": token } }
            );
            setPanierData(panierSimplifieResult.data);
        };
        fetchPanierSimplifie();

    }, [token]);

    const validerPaiement = async () => {
        try {
            const payerPanier = { panierData, adresse, codePostal, ville, paiement, livraison};

            // Comme on ne sait pas le temps passé entre le moment où l'utilisateur a affiché cette page et le moment où il la
            // valide, on revérifie une dernière fois si les stock au moment de la validation correspondent à sa demande
            await Requete.get(
                "/panier/verifier-quantite",
                { headers: { "x-auth-token": token } }
            );

            // Si c'est validé, on passe au paiement
            await Requete.post(
                "/panier/payer",
                payerPanier,
                { headers: { "x-auth-token": token } }
            );

            setAchatPanier(true);
            
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    }

    return(
        <UserContext.Provider
            value={{modifierAdresse, setModifierAdresse, adresse, setAdresse, codePostal, setCodePostal, ville, setVille, token,
                    setLivraison, setPaiement}}
        >
            <div className="container" style={{marginTop: "80px"}}>
                {panierData.length === 0 ?
                    <h3 style={{textAlign: "center"}}>Chargement...</h3>
                : achatPanier ?
                <div style={{textAlign: "center", marginTop: "30%"}}>
                    <h3 style={{color: "#0f584c"}}>Merci pour votre achat !!!</h3>
                    <h4 className="lien-useHistory" onClick={()=>history.push("/")}>Retour à l'accueil</h4>
                </div>
                :
                <div>
                    <table style={{width: "100%"}}>
                        <thead>
                            <tr>
                                <th>Article</th>
                                <th>Quantitée</th>
                                <th>Prix unité</th>
                                <th>Prix</th>
                            </tr>
                        </thead>
                        <tbody>
                            {panierData.map(produit => (
                                <tr key={produit.panier_id}>
                                    <td>{produit.nom}</td>
                                    <td>{produit.nombre_produit}</td>
                                    <td>{produit.prix} €</td>
                                    <td>{produit.prix*1 * produit.nombre_produit*1} €</td>
                                </tr>
                            ))}
                            <tr style={{fontWeight: "bold"}}>
                                <td></td>
                                <td></td>
                                <td>Montant total:</td>
                                <td><CalculerTotalPanier token={token}/> €</td>
                            </tr>
                        </tbody>
                    </table>
                    <div style={{display: "inline-flex", width: "100%", marginTop: "5%", marginLeft: "25%"}}>
                        <MenuDeroulantModePaiement />
                        <MenuDeroulantModeLivraison />
                    </div>
                    <br />
                    <ModifierAdresseDepuisPageAchat token = {token} />
                    <br />
                    {!modifierAdresse &&
                        <div>
                            {error && (
                                <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                            )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
                            <div style={{width: "100%", display: "inline-flex", justifyContent: "space-between"}}>
                                <input
                                    type="submit"
                                    className="btn btn-info float-left"
                                    value="Retour"
                                    onClick={()=>history.goBack()}
                                    style={{width: "400px"}}
                                />
                                <input
                                    type="submit"
                                    className="btn btn-primary float-right"
                                    value="Payer"
                                    onClick={validerPaiement}
                                    style={{width: "400px"}}
                                />
                            </div>
                        </div>
                    }
                </div>
                }
            </div>
        </UserContext.Provider>
    )

}