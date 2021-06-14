import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Image } from 'cloudinary-react';

import Requete from '../../middlewares/Requete';
import GetToken from '../../middlewares/GetToken';
import DropdownMenuValueChamps from '../../middlewares/DropDownMenuValueChamps';
import ErrorNotice from '../../middlewares/ErrorNotice';
import ModifierAdresseDepuisPageAchat from './ModifierAdresseEcranAchat';

import UserContext from '../../context/UserContext';

export default function AchatImmediat(){

    const [achatValide, setAchatValide] = useState(false);

    const [produitData, setProduitData] = useState([]);
    const [membreData, setMembreData] = useState([]);
    const [modeLivraisonData, setModeLivraisonData] = useState([]);
    const [modePaiementData, setModePaiementData] = useState([]);

    const [prix, setPrix] = useState();
    const [quantite, setQuantite] = useState();
    const [paiement, setPaiement] = useState();
    const [livraison, setLivraison] = useState();
    const [error, setError] = useState();

    const [modifierAdresse, setModifierAdresse] = useState(false);
    const [rafraichir, setRafraichir] = useState(0);
    
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

        // Si le membre n'est pas connecté, on ne fait pas cette requête pour éviter un chargement infini
        if(token !==""){
            async function fetchMembreData(){
                const resultMembre = await Requete.get(
                    "/membres/afficher-connecte",
                    { headers: { "x-auth-token": token } },
                );
                setMembreData(resultMembre.data[0]);
            };
            fetchMembreData();
        } else{
            setMembreData("Non connecté");
        }


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

    }, [produitId, rafraichir, token]);

    const champsModifierAdresse = () => {
        if(modifierAdresse === false){setModifierAdresse(true)}
        if(modifierAdresse === true){setModifierAdresse(false)}
    }

    const submit = async (e)=>{
        e.preventDefault();

        try {
            let adresse = membreData.adresse;
            let codePostal = membreData.code_postal;
            let ville = membreData.ville
    
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
        <UserContext.Provider value={{rafraichir, setRafraichir, setModifierAdresse}}>
            <div className="container" style={{marginTop: "80px"}}>
                {(produitData.length === 0 || membreData.length === 0 || modePaiementData.length === 0 || modeLivraisonData.length === 0) ?
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
                                <div className="control" style={{display: "inline-flex", width: "90%", marginTop: "3%"}}>
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
                                    <div style={{display: "inline-flex", marginLeft: "3%", width: "21%"}}>
                                        <label syle={{marginLeft: "3%"}}>Paiement: </label>
                                        <DropdownMenuValueChamps
                                            onChange={(e)=>{setPaiement(e.target.value)}}
                                            donneesMap = {modePaiementData}
                                            largeur = "100%"
                                            margeGauche = "2%"
                                        />
                                    </div>
                                    <div style={{display: "inline-flex", marginLeft: "3%", width: "25%"}}>
                                        <label syle={{marginLeft: "3%"}}>Livraison: </label>
                                        <DropdownMenuValueChamps
                                            onChange={(e)=>{setLivraison(e.target.value)}}
                                            donneesMap = {modeLivraisonData}
                                            largeur = "120%"
                                            margeGauche = "2%"
                                        />
                                    </div>
                                </div>
                                <div style={{textAlign: "center", marginTop: "5%"}}>
                                    {(modifierAdresse === false && !achatValide) &&
                                        <>
                                            <h5>Adresse de livraison:</h5>
                                            <h5>{membreData.prenom} {membreData.nom}</h5>
                                            <h5>{membreData.adresse} {membreData.code_postal} {membreData.ville}</h5>
                                            <h6 onClick={champsModifierAdresse} style={{textDecoration: "underline", cursor: "pointer"}}>modifier</h6>
                                        </>
                                    }
                                    {modifierAdresse === true &&
                                        <>
                                            <ModifierAdresseDepuisPageAchat
                                                token = {token}
                                                adresse = {membreData.adresse}
                                                codePostal = {membreData.code_postal}
                                                ville = {membreData.ville}
                                            />
                                            <h6 onClick={champsModifierAdresse} style={{textDecoration: "underline", cursor: "pointer"}}>Ne pas modifier</h6>
                                        </>
                                    }
                                </div>
                                {error && (
                                    <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                                )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
                                {(produitData.quantite > 0 && !achatValide)  &&
                                    <input type='submit' value="Payer" className="btn btn-primary float-right"/>
                                }
                                {achatValide &&
                                    <>
                                        <h4 style={{color: "green", textAlign: "center"}}>
                                            Votre achat a été validé !
                                            
                                        </h4>
                                        <h5
                                            style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer", textAlign: "center"}}
                                            onClick={()=>history.goBack()}
                                        >
                                            Retour
                                        </h5>       
                                    </>
                                }
                            </form>
                        </div>
                    }
                </div>
                }
            </div>
        </UserContext.Provider>
    )
}