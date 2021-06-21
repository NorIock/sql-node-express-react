import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Image } from 'cloudinary-react';

import Requete from '../../middlewares/Requete';
import GetToken from '../../middlewares/GetToken';
import ErrorNotice from '../../middlewares/ErrorNotice';
import UserContext from '../../context/UserContext';

import MenuDeroulantModeLivraison from '../menuDeroulant/modeLivraison';
import MenuDeroulantModePaiement from '../menuDeroulant/modePaiement';
import ModifierAdresseDepuisPageAchat from './ModifierAdresseEcranAchat';

export default function AchatImmediat(){

    const [achatValide, setAchatValide] = useState(false);

    const [produitData, setProduitData] = useState([]);
    const [modeLivraisonData, setModeLivraisonData] = useState([]);
    const [modePaiementData, setModePaiementData] = useState([]);
    const [error, setError] = useState();

    const [prix, setPrix] = useState();
    const [quantite, setQuantite] = useState();

    // Seront utilisés par le component ModifierAdresseDepuisPageAchat. Ils sont déclarés ici pour récupérer les valeurs
    const [modifierAdresse, setModifierAdresse] = useState(false);
    const [adresse, setAdresse] = useState();
    const [codePostal, setCodePostal] = useState();
    const [ville, setVille] = useState();

    // Seront utilisés par le component MenuDeroulantModeLivraison. Ils sont déclarés ici pour récupérer les valeurs
    const [livraison, setLivraison] = useState();

    // Seront utilisés par le component MenuDeroulantModePaiement. Ils sont déclarés ici pour récupérer les valeurs
    const [paiement, setPaiement] = useState();
    
    const {REACT_APP_CLOUDINARY_NAME} = process.env;
    const { produitId } = useParams();
    const history = useHistory();

    let token = GetToken();

    useEffect(()=>{
        async function fetchProduitData(){
            const resultProduit = await Requete.get(
                "/produit/recherche/afficherUn/" + produitId,
            )
            if(resultProduit.data.quantite > 0){setQuantite(1)}
            setPrix(resultProduit.data.prix);
            setProduitData(resultProduit.data);
        }
        fetchProduitData();

        async function fetchModePaiementData(){
            const resultModePaiement = await Requete.get(
                "/modePaiement/afficher"
            );
            setModePaiementData(resultModePaiement.data);
        };
        fetchModePaiementData();

        async function fetchModeLivraisonData(){
            const resultModeLivraison = await Requete.get(
                "/modeLivraison/afficher"
            );
            setModeLivraisonData(resultModeLivraison.data);
        };
        fetchModeLivraisonData();

    }, [produitId, token]);

    const submit = async (e)=>{
        e.preventDefault();

        try {
    
            const nouvelAchat = { produitId, prix, quantite, paiement, livraison, adresse, codePostal, ville };
    
            await Requete.post(
                "/historiqueAchats/enregistrer-achat/" + produitId,
                nouvelAchat,
                { headers: { "x-auth-token": token } }
            )
            // history.goBack();
            setAchatValide(true);
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
                {(produitData.length === 0 || modePaiementData.length === 0 || modeLivraisonData.length === 0) ?
                    <h3>Chargement....</h3>
                :
                <div>
                    {token === "" &&
                        <div>
                            <h3>Vous devez avoir un compte afin de faire un achat,</h3>
                            <h3>
                                Vous avez un compte ?
                                <span> </span><span onClick={()=>history.push("/connexion")} style={{cursor: "pointer", textDecoration: "underline"}}>Connectez-vous</span><span>, </span>
                                pas de compte ? <span onClick={()=>history.push("/inscription")} style={{cursor: "pointer", textDecoration: "underline"}}>Inscrivez vous</span>
                            </h3>
                        </div>
                    }
                    {token !== "" &&
                        <div>
                            <div className="afficher-plusieurs-produits">
                                <div>
                                    <Image
                                        cloudName={REACT_APP_CLOUDINARY_NAME}
                                        publicId={produitData.photos[0].public_id}
                                        width='200'
                                        crop="scale"
                                    />
                                </div>
                                <div style={{marginLeft: "5%"}}>
                                    <h4 style={{fontWeight: "bold"}}>{produitData.nom}</h4>
                                    <h6 style={{fontWeight: "bold"}}>Prix: {produitData.prix} €</h6>
                                    {produitData.quantite < 10 && produitData.quantite > 1 &&
                                        <h6 style={{color: "red"}}>Attention, plus que quelques exemplaires disponibles</h6>
                                    }
                                    {produitData.quantite === 1 &&
                                        <h6 style={{color: "red"}}>Attention, dernier exemplaire disponible</h6>
                                    }
                                    {produitData.quantite === 0 &&
                                        <h6 style={{color: "red"}}>Produit temporairement indisponible</h6>
                                    }
                                    <h6 style={{whiteSpace: "pre-wrap", textAlign: "justify", textJustify: "inter-word"}}>
                                        <span style={{fontWeight: "bold"}}>Description: </span>
                                        {produitData.description.substring(0, 150)}...</h6>
                                </div>
                            </div>
                            <form onSubmit={submit}>
                                <div className="control" style={{display: "inline-flex", width: "100%", marginTop: "3%"}}>
                                    <div style={{display: "inline-flex", marginLeft: "3%"}}>
                                    <label>Quantité: </label>
                                        <input
                                            type='number'
                                            step='1'
                                            min={1}
                                            max={produitData.quantite}
                                            defaultValue={1}
                                            className='form-control'
                                            style={{width:"90%", marginLeft: "1%"}}
                                            onChange={(e)=>setQuantite(e.target.value)}
                                        />
                                    </div>
                                <MenuDeroulantModePaiement />
                                <MenuDeroulantModeLivraison />
                                </div>
                                <div>
                                    <h4 style={{textAlign: 'right'}}>Total: {produitData.prix*1 * quantite} €</h4>
                                </div>                                    
                                <ModifierAdresseDepuisPageAchat
                                    token = {token}
                                />
                                {error && (
                                    <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                                )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
                                {(produitData.quantite > 0 && !achatValide)  &&
                                    <input type='submit' value="Acheter" className="btn btn-primary float-right"/>
                                }
                                {achatValide &&
                                    <>
                                        <h4 style={{color: "green", textAlign: "center"}}>
                                            Votre achat a été validé !
                                            
                                        </h4>     
                                    </>
                                }
                                <h5
                                    style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer", textAlign: "center", marginTop: "100px"}}
                                    onClick={()=>history.goBack()}
                                >
                                    Retour
                                </h5>  
                            </form>
                        </div>
                    }
                </div>
                }
            </div>
        </UserContext.Provider>
    )
}