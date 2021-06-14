import React, { useState, useEffect } from 'react';

import Requete from '../../../middlewares/Requete';
import ContenuMessageAccueil from '../../admin/messagePageAccueil/ContenuMessage';

export default function AfficherMessageLancementSiteAccueil(){

    const [afficherMessageLancement, setAfficherMessageLancement] = useState("");
    var [refresh, setRefresh] = useState(0);

    useEffect(()=>{
        async function fetchMessageData(){
            const messageResult = await Requete.get(
                "/message-accueil/afficher",
            )
            setAfficherMessageLancement(messageResult.data);
        }
        fetchMessageData();
    },[refresh]);

    const nePLusMontrer = async ()=>{

        let nouveauStatut = '0';

        await Requete.get(
            "/message-accueil/modifier-visibilite/" + nouveauStatut
        )
        setRefresh(refresh+=1);
    }

    return(
        console.log("afficherMessageLancement: ", afficherMessageLancement),
        <div className="container">
            {afficherMessageLancement.length === 0 ?
                <h3 style={{textAlign: "center"}}>Chargement...</h3> 
            :
            afficherMessageLancement === 1 ? 
                <div>
                    <h5>Bonjour, </h5>
                    <h5>
                        Ce message apparait car vous lancez le site pour la première fois. Pour le faire disparaître,
                        <span className="lien-useHistory" onClick={nePLusMontrer}>cliquez ici</span>
                    </h5>
                    <h5>
                        Vous pourrez consulter ce message ou décider de le faire apparaître à nouveau dans la partie admin.
                    </h5>
                    <br />
                    <ContenuMessageAccueil />
                </div>
            : null
            }
        </div>
    )
}