import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Image } from 'cloudinary-react';
import Requete from '../../../middlewares/Requete';
import GetToken from '../../../middlewares/GetToken';

export default function PanierMembre(){

    const [data, setdata] = useState([]);
    const history = useHistory();
    const {REACT_APP_CLOUDINARY_NAME} = process.env;

    let token = GetToken();

    useEffect(()=>{
        async function fetchData(){
            const result = await Requete.get(
                "/panier/consulter",
                { headers: { "x-auth-token": token } }
            );
            setdata(result.data);
        }
        fetchData();
    },[token])

    return(
        <div className="container">
            {data.length === 0 ?
                <h3 style={{textAlign: "center"}}>Chargement...</h3>
            :
            data === "Rien" ?
                <h3 style={{textAlign: "center"}}>Aucun article dans votre panier</h3>
            :
                <>
                <h5
                    style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer", textAlign: "center"}}
                    onClick={()=>history.push("/panier/valider-modifier")}
                >
                    Modifier ou valider le panier
                </h5>
                {data.map((produit, i)=>(
                    <div key={i}>
                        {i === 0 ?
                            <div style={{width: "100%", display: "inline-flex", marginTop: "3%", borderBottom: "solid 1px #0f584c", borderTop: "solid 1px #0f584c", padding: "1%"}}>
                                <div style={{width: "17%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                    {produit.hauteur >= produit.largeur ?
                                        <Image
                                            cloudName={REACT_APP_CLOUDINARY_NAME}
                                            publicId={produit.public_id}
                                            height='200'
                                            crop="scale"
                                        />
                                    :
                                    produit.hauteur < produit.largeur ?
                                        <Image
                                            cloudName={REACT_APP_CLOUDINARY_NAME}
                                            publicId={produit.public_id}
                                            width='200'
                                            crop="scale"
                                        />
                                    : null
                                    }
                                </div>
                                <div style={{marginLeft: "2%"}}>
                                    <h5 style={{fontWeight: "bold"}}>{produit.nom}</h5>
                                    <h6>Quantitée: <strong>{produit.nombre_produit}</strong></h6>
                                    <h6>Prix: <strong>{(produit.prix*1) * (produit.nombre_produit*1)} €</strong></h6>
                                </div>
                        </div>
                        :
                        (i > 0 && data[i].panier_id !== data[i-1].panier_id) ?
                        <div  style={{width: "100%", display: "inline-flex", marginTop: "3%", borderBottom: "solid 1px #0f584c", borderTop: "solid 1px #0f584c", padding: "1%"}}>
                            <div style={{width: "17%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            {produit.hauteur >= produit.largeur ?
                                <Image
                                    cloudName={REACT_APP_CLOUDINARY_NAME}
                                    publicId={produit.public_id}
                                    height='200'
                                    crop="scale"
                                />
                            :
                            produit.hauteur < produit.largeur ?
                                <Image
                                    cloudName={REACT_APP_CLOUDINARY_NAME}
                                    publicId={produit.public_id}
                                    width='200'
                                    crop="scale"
                                />
                            : null
                            }
                            </div>
                            <div style={{marginLeft: "2%"}}>
                                <h5 style={{fontWeight: "bold"}}>{produit.nom}</h5>
                                <h6>Quantitée: <strong>{produit.nombre_produit}</strong></h6>
                                <h6>Prix: <strong>{(produit.prix*1) * (produit.nombre_produit*1)} €</strong></h6>                         
                            </div>
                        </div>
                        : null
                        }
                    </div>
                ))}
                </>
            }
        </div>
    )
}