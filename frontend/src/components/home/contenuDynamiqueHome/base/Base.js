import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import Requete from '../../../../middlewares/Requete';
import { Image } from 'cloudinary-react';

export default function ProduitsPageHome(props){

    const [data, setData] = useState([]);
    const history = useHistory();
    const {REACT_APP_CLOUDINARY_NAME} = process.env;

    useEffect(()=>{
        async function fetchData(){
            const result = await Requete.get(
                props.adresseBack
            )
            setData(result.data);
        }
        fetchData();
    }, [props.adresseBack]);

    return(
        <div className="container">
            {data.length === 0 ?
                <h3 style={{textAlign: "center", marginTop: "80px"}}>Chargement...</h3>
            :
            data !== "Rien" ?
            <div style={{marginBottom: "2%", marginTop: "2%"}}>
                <h4 style={{textAlign: "left"}}>{props.titre}</h4>
                <div className="card-group">
                    {data.map(produit => (
                        <div key={produit.produit_id}
                            className="card afficher-plusieurs-produits"
                            onClick={()=>history.push("/recherche/afficherUn/" + produit.produit_id + "/" + undefined)}
                        >
                            <div className="card-img-top" style={{height: "50%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                {produit.photo.hauteur >= produit.photo.largeur ?
                                <div>
                                   <Image 
                                   cloudName={REACT_APP_CLOUDINARY_NAME} 
                                   publicId={produit.photo.public_id} 
                                   height='150' 
                                   crop='scale' /> 
                                </div>
                                :
                                produit.photo.hauteur < produit.photo.largeur ?
                                    <Image 
                                        cloudName={REACT_APP_CLOUDINARY_NAME} 
                                        publicId={produit.photo.public_id} 
                                        width='150' 
                                        crop='scale' />
                                : null
                                }
                            </div>
                            <div className="card-body">
                                <h6 className="card-title"><strong>{produit.nom.substring(0, 70)}...</strong></h6>
                                <p className="card-text"><strong>{produit.prix} €</strong></p>
                                {(produit.quantite > 1 && produit.quantite < 10) &&
                                    <p className="card-text" style={{color: "red"}}>Plus que quelques exemplaires disponibles</p>
                                }
                                {produit.quantite === 1 &&
                                    <p className="card-text" style={{color: "red"}}>Dernier exemplaire disponible</p>
                                }
                                {produit.quantite === 0 &&
                                    <p className="card-text" style={{color: "red"}}>Produit temporairement indisponible</p>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            :
            data === "Rien" ?
                <div>
                    <h4>Ici , apparaîteront les 4 {props.messageSiRien} quand au moins un produit aura été créé</h4>
                </div>
            :
            null
            }
        </div>
    )
}