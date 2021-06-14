import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Image } from 'cloudinary-react';

import Requete from '../../middlewares/Requete';
import BarreRecherche from './BarreRecherche';

export default function ResultatRecherche(){

    const [data, setData] = useState([]);

    const history = useHistory();
    const { recherche } = useParams();
    const {REACT_APP_CLOUDINARY_NAME} = process.env;

    useEffect(()=>{
        async function fetchData(){
            const result = await Requete.get(
                "/produit/recherche-utilisateur/" + recherche
            )
            setData(result.data);
        }
        fetchData();
    }, [recherche]);

    return(
        <div style={{marginTop: "80px"}} className="container">
            <BarreRecherche 
                recherche={recherche}
            />
            {data.length === 0 ?
                <h3 style={{textAlign: "center"}}>Chargement...</h3>
            :
            <div>
            {data === "Rien" &&
                <div>
                    <h3>Aucun article ne correspond à la recherche: {recherche}</h3>
                    <h4 
                        style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer", textAlign: "center"}}
                        onClick={()=>history.goBack()}
                    >
                        Retour
                    </h4>
                </div>
            }
            {data !== "Rien" && data.length > 0 &&
            <div>
                {data.map((produit) => (
                    <div key={produit.produit_id}
                        className="afficher-plusieurs-produits"
                        onClick={()=>history.push("/recherche/afficherUn/" + produit.produit_id + "/" + recherche)}>
                        <div style={{width: "17%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                            {produit.photo.hauteur >= produit.photo.largeur ?
                                <Image
                                cloudName={REACT_APP_CLOUDINARY_NAME}
                                publicId={produit.photo.public_id}
                                height='200'
                                crop="scale"
                            />
                            :
                            produit.photo.hauteur < produit.photo.largeur ?
                                <Image
                                cloudName={REACT_APP_CLOUDINARY_NAME}
                                publicId={produit.photo.public_id}
                                width='200'
                                crop="scale"
                                />
                            : null
                            }
                        </div>
                        <div style={{marginLeft: "5%"}}>
                            <h4 style={{fontWeight: "bold"}}>{produit.nom}</h4>
                            <h6 style={{fontWeight: "bold"}}>Prix: {produit.prix} €</h6>
                            {produit.quantite < 10 && produit.quantite > 1 &&
                                <h6 style={{color: "red"}}>Attention, plus que quelques exemplaires disponibles</h6>
                            }
                            {produit.quantite === 1 &&
                                <h6 style={{color: "red"}}>Attention, dernier exemplaire disponible</h6>
                            }
                            {produit.quantite === 0 &&
                                <h6 style={{color: "red"}}>Produit temporairement indisponible</h6>
                            }
                            <h6 style={{whiteSpace: "pre-wrap", textAlign: "justify", textJustify: "inter-word"}}>
                                <span style={{fontWeight: "bold"}}>Description: </span>
                                {produit.description.substring(0, 150)}...</h6>
                        </div>
                    </div>
                ))}
            </div>
            }
            </div>
            }
        </div>
    )
}