import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Requete from '../../../middlewares/Requete';

export default function MessagePageAcceuil(){

    const history = useHistory();

    const [afficherOuNonMessageLancement, setAfficherOuNonMessageLancement] = useState("");

    // Permet d'afficher les message correspondant au statut du message d'accueil (affichage ou non)
    useEffect(()=>{
        async function fetchMessageData(){
            const messageResult = await Requete.get(
                "/message-accueil/afficher",
            )
            setAfficherOuNonMessageLancement(messageResult.data);
        }
        fetchMessageData();
    },[]);

    const consulterMessage = () => {history.push("/admin/message-accueil")};
    const modifierAffichage = async () => {
        
        let nouveauStatut;
        if(afficherOuNonMessageLancement){nouveauStatut = '0'}
        if(!afficherOuNonMessageLancement){nouveauStatut = '1'}

        await Requete.get(
            "/message-accueil/modifier-visibilite/" + nouveauStatut
        )
        history.push("/");
    }

    return(
        <table className="table">
            <tbody>
                <tr onClick={consulterMessage}>
                    <td>Voir le message</td>
                </tr>
                <tr onClick={modifierAffichage}>
                    {afficherOuNonMessageLancement === 1 ?
                        <td>Ne plus afficher le message d'accueil dans la page Home</td>
                    : 
                    afficherOuNonMessageLancement === 0 ?
                        <td>Afficher le message d'accueil dans la page Home</td>
                    : null
                    }
                </tr>
            </tbody>
        </table>
    )
}