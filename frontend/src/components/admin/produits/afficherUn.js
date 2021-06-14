import React, { useState, useEffect } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import ImageProduit from './imageProduit';

import Requete from "../../../middlewares/Requete";

export default function AfficherUnProduit(){

    const [ data, setData ] = useState([]);
    const { id } = useParams();
    const history = useHistory();

    useEffect(()=>{
        async function fetchData(){
            const result = await Requete.get(
                "/produit/afficher-un/" + id
            );
            setData(result.data);
        }
        fetchData();
    },[id]);

    return(
        <div style={{marginTop: "80px"}}>
            {data.length === 0 ?
            <h3>Chargement....</h3>    
        :
        <div className="container" style={{display: "inline-flex", marginLeft: "20%"}}>
            <div>
                <ImageProduit
                    photos={data.photos}
                    photoPrincipale={data.photos[0].photo_id}
                    />
            </div>
            <div style={{marginLeft: "5%"}}>
                <h4 style={{fontWeight: "bold"}}>{data.nom}</h4>
                <h6 style={{fontWeight: "bold"}}>Prix: {data.prix} €</h6>
                <h6 style={{fontWeight: "bold"}}>Quantité disponible: {data.quantite}</h6>
                {data.quantite < 10 && data.quantite > 1 &&
                    <h6 style={{color: "red"}}>Attention, plus que quelques exemplaires disponibles</h6>
                }
                {data.quantite === 1 &&
                    <h6 style={{color: "red"}}>Attention, dernier exemplaire disponible</h6>
                }
                {data.quantite === 0 &&
                    <h6 style={{color: "red"}}>Produit temporaitement indisponible</h6>
                }
                <h6 style={{fontWeight: "bold"}}>Description:</h6>
                <h6 style={{whiteSpace: "pre-wrap", textAlign: "justify", textJustify: "inter-word"}}>{data.description}</h6>
            </div>

        </div>
        }
        <div style={{textAlign: "center"}}>
            <h5>Ventes totales: {data.nombre_ventes}. Inclu dans {data.nombre_panier} paniers, {data.nombre_liste_envie} listes d'envies et consulté {data.nombre_vues} fois</h5>
            {data.en_vente ?
                <h5 style={{color: "green"}}>Est proposé à la vente</h5>
            :
            !data.en_vente &&
                <h5 style={{color: "red"}}>N'est plus proposé à la vente</h5>
            }
            
        </div>
        <h5 style={{display: "flex", textAlign: "center", justifyContent: "space-evenly", marginInline: "20%", marginTop: "2%"}}>
            
            <Link to={"/admin/produit/modifier-un/" + data.produit_id}>Modifier</Link>
            <Link to={"/admin/produit/retirer-ou-remettre/" + data.produit_id}>{data.en_vente ? <span>Retirer de la vente </span> : !data.en_vente && <span>Remettre en vente</span>}</Link>
        </h5>
        <h5 
            style={{textAlign: "center", marginTop:"2%", textDecoration: "underline", color: "0f584c", cursor: "pointer"}}
            onClick={()=>history.push("/admin/produit/afficherTous")}
            >
                Retour
        </h5>
        </div>
    )
}