import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Image } from 'cloudinary-react';
import Requete from '../../../middlewares/Requete';
import GetToken from '../../../middlewares/GetToken';

export default function HistoriqueAchatsMembre(props){

    const [data, setData] = useState([]);

    const history = useHistory();
    const {REACT_APP_CLOUDINARY_NAME} = process.env;

    let token = GetToken();

    useEffect(function(){
        
        async function fetchData(){
            const resultat = await Requete.get(
                "/historiqueAchats/afficher",
                { headers: { "x-auth-token": token } },
            );
            setData(resultat.data);
        };
        fetchData();

    }, [token]);

    const date = (timeStamp)=>{
        let afficherDate = new Date(timeStamp*1);
        return new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: 'numeric',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(afficherDate);
    };

    return(
        <div className="container">
            {data.length === 0 ?
                <div>
                    <h3 style={{textAlign: "center"}}>Chargement....</h3>
                </div>
            :
                <div>
                    {data === "Rien" &&
                        <h4 style={{textAlign: "center"}}>Aucun achat effectué</h4>
                    }
                    {data !== "Rien" &&
                        <>
                        {props.lienVoirPlusViaPageProfilMembre === "true" &&
                            <h5
                                style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer", textAlign: "center"}}
                                onClick={()=>history.push("/historique-achats")}
                            >
                                Voir plus
                            </h5>
                        }
                        {props.lienRetour === "true" &&
                            <h5
                                style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer", textAlign: "center"}}
                                onClick={()=>history.goBack()}
                            >
                                Retour
                            </h5>
                        }
                        {data.map((achat, i) =>(
                            <div key={i}>
                                {i === 0 ?
                                    <div style={{width: "100%", display: "inline-flex", marginTop: "3%", borderBottom: "solid 1px #0f584c", borderTop: "solid 1px #0f584c", padding: "1%"}}>
                                        <div style={{width: "17%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                            {achat.hauteur >= achat.largeur ?
                                                <Image
                                                    cloudName={REACT_APP_CLOUDINARY_NAME}
                                                    publicId={achat.public_id}
                                                    height='200'
                                                    crop="scale"
                                                />
                                            :
                                            achat.hauteur < achat.largeur ?
                                                <Image
                                                    cloudName={REACT_APP_CLOUDINARY_NAME}
                                                    publicId={achat.public_id}
                                                    width='200'
                                                    crop="scale"
                                                />
                                            : null
                                            }
                                        </div>
                                        <div style={{marginLeft: "2%"}}>
                                            <h5 style={{fontWeight: "bold"}}>{achat.nom}</h5>
                                            <h6>Prix: <strong>{achat.prix}</strong></h6>
                                            <h6>Quantitée: <strong>{achat.quantite}</strong></h6>
                                            <h6>Payé par <strong>{achat.mode_paiement}</strong> le <strong>{date(achat.date_achat)}</strong></h6>
                                            <h6>Expédié par <strong>{achat.mode_envoi}</strong> à <strong>{achat.adresse_envoi}</strong></h6>
                                            <input
                                                type='submit' 
                                                onClick={()=>history.push("/recherche/afficherUn/" + achat.produit_id + "/" + undefined)}
                                                className="btn btn-primary" 
                                                value="Acheter à nouveau"
                                            />
                                        </div>
                                    </div>
                                :
                                (i > 0 && data[i].historique_id !== data[i-1].historique_id) ?
                                    <div  style={{width: "100%", display: "inline-flex", marginTop: "3%", borderBottom: "solid 1px #0f584c", borderTop: "solid 1px #0f584c", padding: "1%"}}>
                                        <div style={{width: "17%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                            {achat.hauteur >= achat.largeur ?
                                                <Image
                                                    cloudName={REACT_APP_CLOUDINARY_NAME}
                                                    publicId={achat.public_id}
                                                    height='200'
                                                    crop="scale"
                                                />
                                            :
                                            achat.hauteur < achat.largeur ?
                                                <Image
                                                    cloudName={REACT_APP_CLOUDINARY_NAME}
                                                    publicId={achat.public_id}
                                                    width='200'
                                                    crop="scale"
                                                />
                                            : null
                                            }
                                        </div>
                                        <div style={{marginLeft: "2%"}}>
                                            <h5 style={{fontWeight: "bold"}}>{achat.nom}</h5>
                                            <h6>Prix: <strong>{achat.prix}</strong></h6>
                                            <h6>Quantitée: <strong>{achat.quantite}</strong></h6>
                                            <h6>Payé par <strong>{achat.mode_paiement}</strong> le <strong>{date(achat.date_achat)}</strong></h6>
                                            <h6>Expédié par <strong>{achat.mode_envoi}</strong> à <strong>{achat.adresse_envoi}</strong></h6>
                                            <input
                                                type='submit' 
                                                onClick={()=>history.push("/recherche/afficherUn/" + achat.produit_id + "/" + undefined)}
                                                className="btn btn-primary" 
                                                value="Acheter à nouveau"
                                            />
                                        </div>
                                    </div>
                                :
                                null
                                }
                            </div>
                        ))}
                        {props.lienRetour === "true" &&
                            <h5
                                style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer", textAlign: "center"}}
                                onClick={()=>history.goBack()}
                            >
                                Retour
                            </h5>
                        }
                        </>
                    }
                </div>
            }
        </div>
    )
}