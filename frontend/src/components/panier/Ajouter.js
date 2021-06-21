import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import Requete from '../../middlewares/Requete';
import GetToken from '../../middlewares/GetToken';
import ErrorNotice from '../../middlewares/ErrorNotice';

export default function AjouterPanier(props){

    const [messageAjoutpanier, setMessageAjoutpanier] = useState(false);
    const [error, setError] = useState();
    const history = useHistory();

    let token = GetToken()
    
    const ajouter = async () => {
        
        if(token === ""){

            history.push("/connexion");
            
        } else {
            try {
                // Permet d'effacer le message d'ajout au panier si le membre reclique directement sur ajouter au panier
                setMessageAjoutpanier(false);
                
                await Requete.get(
                    "/panier/ajouter/" + props.produit_id,
                    { headers: { "x-auth-token": token } }
                );
                setMessageAjoutpanier(true);
            } catch (err) {
                err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
            }
        } 
    }

    return(
        <div style={{marginRight: "2%", height: "100px"}}>
            <input
                type="submit"
                value="Ajouter au panier"
                className="btn btn-info"
                onClick={ajouter}
                style={{height: "50px"}}
            />
            <div style={{width: "350%", marginTop: "10%", marginLeft: "-170px"}}>
                {error && (
                    <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                    )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
            </div>
            {messageAjoutpanier &&
            <h5 style={{color: "#0f584c", width: "200%", marginTop: "10%", marginLeft: "-110%"}}>
                Ajouté au <span className="lien-useHistory" onClick={()=>history.push("/panier/valider-modifier")}>panier</span> !
            </h5>
            }
        </div>
    )
}