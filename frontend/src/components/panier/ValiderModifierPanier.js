import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Requete from '../../middlewares/Requete';
import GetToken from '../../middlewares/GetToken';
import ErrorNotice from '../../middlewares/ErrorNotice';
import CalculerTotalPanier from './CalculerTotalPanier';
import { Image } from 'cloudinary-react';

export default function ValiderModifierPanier(){

    const [panierData, setPanierData] = useState([]);
    const [nouvelleQuantite, setNouvelleQuantite] = useState([]);
    const [error, setError] = useState("");
    const {REACT_APP_CLOUDINARY_NAME} = process.env;
    const [modifier, setModifier] = useState(false);
    let [refresh, setRefresh] = useState(0);
    const history = useHistory();

    let token = GetToken();

    useEffect(()=>{
        async function fetchPanierData(){
            const panierResult = await Requete.get(
                "/panier/consulter",
                { headers: { "x-auth-token": token } }
            );
            setPanierData(panierResult.data);
        };
        fetchPanierData();
    }, [token, refresh]);

    const montrerCacherModif = () => {
        if(modifier){
            setModifier(false);
        }
        if(!modifier){
            setModifier(true);
            setNouvelleQuantite([]);
        }
    }

    const modificationQuantitees = (panierIdProduit, quantiteProduit) => {

        // On recherche dans l'array nouvelleQuantite si une modification a déjà été faite pour un article donné     
        let resultat = nouvelleQuantite.find( article => article.panierId === panierIdProduit);
        
        // S'il n'y a pas encore de donnée pour le produit on l'ajoute à l'array:
        if(resultat === undefined){
            let ajouterDansNouvelleQuantite = { panierId: panierIdProduit, quantite: quantiteProduit };
            setNouvelleQuantite([...nouvelleQuantite, ajouterDansNouvelleQuantite]);
        } else {
            // Si la donnée existe, on modifie l'objet
            setNouvelleQuantite(
                nouvelleQuantite.map(article => 
                    article.panierId === panierIdProduit ? 
                    { panierId: panierIdProduit, quantite: quantiteProduit }
                    :
                    article
                )
            );
        }
    };

    const validerModificationPanier = async (e) => {
        e.preventDefault();

        try {

            const modificationPanier = { nouvelleQuantite };

            await Requete.post(
                "/panier/modifier",
                modificationPanier,
                { headers: { "x-auth-token": token } }
            );
            setRefresh(refresh+=1);
            setModifier(false);
            setError(undefined);
            
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    }

    const validerPanier = async () => {
        // Dans cette fonction, on va vérifier qu'entre le moment où le membre a ajouté les articles au panier et le moment où
        // il les valide que les quantités demandées sont toujours disponibles.

        try {
            await Requete.get(
                "/panier/verifier-quantite",
                { headers: { "x-auth-token": token } }
            );
        // Si c'est bon, on redirige vers la page pour valider mode paiement, transport et adresse.
        history.push("/panier/finaliser-paiement");
            
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }

    }

    return(
        <div className="container" style={{marginTop: "80px", marginBottom: "100px"}}>
            <h3 style={{textAlign: "center"}}>Panier</h3>
            {panierData.length === 0 ?
                <h3 style={{textAlign: "center"}}>Chargement...</h3>
            :
            panierData === "Rien" ?
                <h3 style={{textAlign: "center"}}>Aucun article</h3>
            :
            panierData.map((produit, i)=>(
                <div key={i}>
                    {i === 0 ?
                        <div style={{width: "100%", display: "inline-flex", marginTop: "3%", borderTop: "solid 2px #0f584c", padding: "1%"}}>
                            <div style={{width: "17%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                {produit.hauteur >= produit.largeur ?
                                    <Image
                                        cloudName={REACT_APP_CLOUDINARY_NAME}
                                        publicId={produit.public_id}
                                        height='100'
                                        crop="scale"
                                    />
                                :
                                produit.hauteur < produit.largeur ?
                                    <Image
                                        cloudName={REACT_APP_CLOUDINARY_NAME}
                                        publicId={produit.public_id}
                                        width='100'
                                        crop="scale"
                                    />
                                : null
                                }
                            </div>
                            <div style={{marginLeft: "20px"}}>
                                <h5 style={{fontWeight: "bold"}}>{produit.nom}</h5>
                                <div style={{display: "inline-flex", alignItems: "center", width: "100%"}}>
                                    <h6>Quantitée:
                                        {!modifier &&
                                            <strong> {produit.nombre_produit}</strong>
                                        }
                                    </h6>
                                    {modifier &&
                                        <input
                                            type="number"
                                            min={0} 
                                            max={produit.quantite}
                                            onChange={(e)=>modificationQuantitees(produit.panier_id, e.target.value)}
                                            defaultValue={produit.nombre_produit}
                                            style={{marginLeft: "3%", width: "50px"}}
                                        />
                                    }
                                </div>
                                <h6>Prix: <strong>{(produit.prix*1) * (produit.nombre_produit*1)} €</strong></h6>
                            </div>
                    </div>
                    :
                    (i > 0 && panierData[i].panier_id !== panierData[i-1].panier_id) ?
                    <div  style={{width: "100%", display: "inline-flex", borderTop: "solid 2px #0f584c", padding: "1%"}}>
                        <div style={{width: "17%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        {produit.hauteur >= produit.largeur ?
                            <Image
                                cloudName={REACT_APP_CLOUDINARY_NAME}
                                publicId={produit.public_id}
                                height='100'
                                crop="scale"
                            />
                        :
                        produit.hauteur < produit.largeur ?
                            <Image
                                cloudName={REACT_APP_CLOUDINARY_NAME}
                                publicId={produit.public_id}
                                width='100'
                                crop="scale"
                            />
                        : null
                        }
                        </div>
                        <div style={{marginLeft: "20px"}}>
                            <h5 style={{fontWeight: "bold"}}>{produit.nom}</h5>
                            <div style={{display: "inline-flex", alignItems: "center", width: "100%"}}>
                                <h6>Quantitée:
                                    {!modifier &&
                                     <strong> {produit.nombre_produit}</strong>
                                    }
                                </h6>
                                {modifier &&
                                    <input
                                        type="number"
                                        min={0}
                                        max={produit.quantite}
                                        onChange={(e)=>modificationQuantitees(produit.panier_id, e.target.value)}
                                        defaultValue={produit.nombre_produit}
                                        style={{marginLeft: "3%", width: "50px"}}
                                    />
                                }
                            </div> 
                            <h6>Prix: <strong>{(produit.prix*1) * (produit.nombre_produit*1)} €</strong></h6>                       
                        </div>
                    </div>
                    : null
                    }
                </div>
            ))}
            <div style={{width: "100%", borderTop: "solid 2px #0f584c"}}>
                <h4 style={{textAlign: "right", marginTop: "10px"}}>
                    Total: <strong><CalculerTotalPanier token={token} refresh={refresh}/> €</strong>
                    </h4>
            </div>
            <div style={{width: "100%", borderTop: "solid 2px #0f584c", display: "inline-flex", justifyContent: "space-between", marginTop: "0px"}}>
                {(!modifier && panierData !== "Rien") &&
                    <>
                        <input
                            type="button"
                            className="btn btn-info"
                            value="Modifier le panier"
                            onClick={montrerCacherModif}
                            style={{marginTop: "10px", width: "400px"}}
                        />
                        <input
                            type="button"
                            className="btn btn-primary"
                            value="Valider le panier"
                            onClick={validerPanier}
                            style={{marginTop: "10px", width: "400px"}}
                        />
                    </>
                }
                {(modifier && panierData !== "Rien") &&
                    <div>
                        <input
                            type="button"
                            className="btn btn-danger"
                            value="Annuler les changements"
                            onClick={montrerCacherModif}
                            style={{marginTop: "10px"}}
                        />
                        <input
                            type="button"
                            className="btn btn-primary"
                            value="Valider les changements"
                            onClick={validerModificationPanier}
                            style={{marginTop: "10px", marginLeft: "30px"}}
                        />
                    </div>
                }
            </div>
            {error && (
                <ErrorNotice message={error} clearError={()=> setError(undefined)} />
            )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
        </div>
    )
}