import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { Image } from 'cloudinary-react';
import Requete from '../../../middlewares/Requete';
import GetToken from '../../../middlewares/GetToken';

export default function AfficherTousLesProduitsPourAdmin(){

    const [data, setData] = useState([]);
    const [classement, setClassement] = useState('Nom');
    const [croissantOuDecroissant, setCroissantOuDecroissant] = useState("Croissant");
    const [enVente, setEnVente] = useState("Tous");
    const [recherche, setRecherche] = useState("");

    const history = useHistory();

    const {REACT_APP_CLOUDINARY_NAME} = process.env;

    let token = GetToken();

    useEffect(()=>{
        async function fetchData(){
            if(recherche === undefined || recherche.length > 0){
                var rechercheBack = recherche;
            }
            if(recherche === ""){
                rechercheBack = undefined
            }

            const result = await Requete.get(
                // "/produit/afficher-tous/" + classement,
                "/produit/afficher-tous/" + classement + "/" + croissantOuDecroissant + "/" + enVente + "/"+ rechercheBack,
                { headers: { "x-auth-token": token } }
            )
            setData(result.data);
        }
        fetchData();
    }, [token, classement, croissantOuDecroissant, recherche, enVente])

    const date = (timeStamp)=>{
        let afficherDate = new Date(timeStamp*1);
        return new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: 'numeric',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(afficherDate);
    };

    return(
        <div className="container">
            <div style={{marginTop: "80px"}}>
                <div style={{display: "inline-flex", width: "90%"}}>
                    <form>
                        <div style= {{width: "200%"}}>
                            <input
                                type= 'text'
                                className='form-control'
                                placeholder="Rechercher un produit"
                                onChange={(e)=>setRecherche(e.target.value)}
                                value={recherche}
                            />
                        </div>
                    </form>
                    <div  style={{display: "inline-flex", marginLeft: "20%", width: "100%"}}>
                        <label style={{width: "50%", marginTop: "1%"}}>Classer par: </label>
                        <select 
                            className="form-control"
                            onChange={(e)=> setClassement(e.target.value)}
                            style={{width: '75%', marginLeft: "3%"}}
                        >
                            <option>Nom</option>
                            <option>Prix</option>
                            <option>Quantité</option>
                            <option>Date création</option>
                            <option>Nombre vues</option>
                            <option>Nombre ventes</option>
                        </select>
                        <select 
                            className="form-control"
                            onChange={(e)=> setCroissantOuDecroissant(e.target.value)}
                            style={{width: '65%', marginLeft: "3%"}}
                        >
                            <option>Croissant</option>
                            <option>Décroissant</option>                  
                        </select>
                        <label style={{marginLeft: "5%", marginTop: "1%", width: "45%"}}>En vente ? </label>
                        <select 
                            className="form-control"
                            onChange={(e)=> setEnVente(e.target.value)}
                            style={{width: '40%', marginLeft: "3%"}}
                        >
                            <option>Tous</option>
                            <option>Oui</option>
                            <option>Non</option>                   
                        </select>
                    </div>
                </div>
            </div>
            <h4
                style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer", textAlign: "center", marginTop: "2%", marginBottom: "0%"}}
                onClick={()=>history.push("/admin")}
            >
                Retour
            </h4>
            <div>
                {data.length === 0 ?
                    <h3 style={{textAlign: "center"}}>Chargement...</h3>
                :
                <div>
                    {data === "Rien" &&
                        <h3 style={{textAlign: "center"}}>Aucun résultats pour {recherche}</h3>
                    }
                    {data !== "Rien" && data.length !== 0 &&
                    <>
                    {data.map((produit) => (
                        <div key={produit.produit_id}
                            className="afficher-plusieurs-produits"
                            onClick={()=>history.push("/admin/produit/afficherUn/" + produit.produit_id)}>
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
                                <h6 style={{fontWeight: "bold"}}>Ajouté le {date(produit.date_creation)}</h6>
                                {produit.en_vente ?
                                    <h5 style={{color: "green"}}>Est proposé à la vente</h5>
                                :
                                !produit.en_vente ?
                                    <h5 style={{color: "red"}}>N'est plus proposé à la vente</h5>
                                : null
                                }
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
                    </>
                    }
                </div>
                }
            </div>
        </div>
    )
}