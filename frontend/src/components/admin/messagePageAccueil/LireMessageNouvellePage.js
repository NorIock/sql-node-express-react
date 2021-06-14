import React from 'react';
import { useHistory } from 'react-router-dom';

import ContenuMessageAccueil from './ContenuMessage';

export default function MessageAccueilDansNouvellePage(){

    const history = useHistory();

    return(
        <div className="container" style={{marginTop: "80px"}}>
            <ContenuMessageAccueil />
            <h4 className="lien-useHistory" onClick={()=>{history.push("/admin")}} style={{textAlign: "center"}}>
                Retour
            </h4>
        </div>
    )
}