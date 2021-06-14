import React from 'react';
import HistoriqueAchatsMembre from '../membre/donnees/HistoriqueAchat'

export default function DetailHistoriqueAchats(){
    return(
        <div className="container" style={{marginTop: "80px"}}>
            <HistoriqueAchatsMembre
                lienVoirPlusViaPageProfilMembre = "false"
                lienRetour="true"
            />
        </div>
    )
}