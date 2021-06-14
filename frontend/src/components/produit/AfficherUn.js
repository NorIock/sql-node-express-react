import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom'

import ImageProduit from '../admin/produits/imageProduit';
import Requete from '../../middlewares/Requete';

export default function AfficherUnPourUtilisateur(){

    const [data, setData] = useState([]);

    const history = useHistory();
    const { id } = useParams();

    useEffect(()=>{
        async function fetchData(){
            const result = await Requete.get(
                "/produit/recherche/afficherUn/" + id,
            )
            setData(result.data);
        }
        fetchData();
    }, [id]);

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
                {data.quantite < 10 && data.quantite > 1 &&
                    <h6 style={{color: "red"}}>Attention, plus que quelques exemplaires disponibles</h6>
                }
                {data.quantite === 1 &&
                    <h6 style={{color: "red"}}>Attention, dernier exemplaire disponible</h6>
                }
                {data.quantite === 0 &&
                    <h6 style={{color: "red"}}>Produit temporairement indisponible</h6>
                }
                <div className="form-group" style={{display: "flex"}}>
                    {(data.quantite > 0 && data.en_vente) ?
                        <>
                            <input
                            type="submit"
                            value="Acheter cet article"
                            className="btn btn-primary"
                            onClick={()=>history.push("/achat-direct/" + data.produit_id)}
                            style={{marginRight: "2%"}}
                            />
                            <input
                            type="submit"
                            value="Ajouter au panier"
                            className="btn btn-info"
                            onClick={()=>history.push("/panier")}
                            style={{marginRight: "2%"}}
                            />
                            <input
                            type="submit"
                            value="Ajouter à la liste d'envie"
                            className="btn btn-secondary"
                            onClick={()=>history.push("/liste-envie")}
                        />
                        </>
                    :
                    (data.quantite === 0 && data.en_vente) ?
                    <>
                        <input
                            type="submit"
                            value="Ajouter à la liste d'envie"
                            className="btn btn-secondary"
                            onClick={()=>history.push("/liste-envie")}
                        />
                    </>
                    :
                    !data.en_vente ?
                    <>
                        <h6 style={{color: "red"}}>Cet article n'est plus disponible à la vente</h6>
                    </> 
                    :
                    null
                    }
                    
                    
                </div>
                <h6 style={{whiteSpace: "pre-wrap", textAlign: "justify", textJustify: "inter-word"}}>{data.description}</h6>
            </div>
        </div>
        }
        <div style={{textAlign: "center", marginTop: "2%"}}>
            {/* <h5><Link to={"/produit/" + recherche}>Retour</Link></h5> */}
            <h4 style={{cursor: "pointer"}} onClick={()=>history.goBack()}>Retour</h4>
        </div>
    </div>
    )
}