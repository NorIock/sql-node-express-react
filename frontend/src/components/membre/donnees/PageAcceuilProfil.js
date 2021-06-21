import React, { useState } from 'react';

import AfficherProfilConnecte from './AfficherProfilConnecte';
import PanierMembre from './Panier';
import ListeEnviesMembre from './ListeEnvies';
import HistoriqueAchatsMembre from './HistoriqueAchat';
import NombreArticlesPanier from '../../panier/NombreArticles';

export default function PageAccueilProfil(){

    const [montrerCacherProfil, setMontrerCacherProfil] = useState(false);
    const [montrerCacherHistoriqueAchats, setMontrerCacherHistoriqueAchats] = useState(false);
    const [montrerCacherPanier, setMontrerCacherPanier] = useState(false);
    const [montrerCacherListeEnvies, setMontrerCacherListeEnvies] = useState(false);

    const onClickMenusProfil = () => {
        if(montrerCacherProfil){setMontrerCacherProfil(false)};
        if(!montrerCacherProfil){setMontrerCacherProfil(true)};
    }

    const onClickPanier = () => {
        if(montrerCacherPanier){setMontrerCacherPanier(false)};
        if(!montrerCacherPanier){setMontrerCacherPanier(true)};
    }

    const onClickListeEnvies = () => {
        if(montrerCacherListeEnvies){setMontrerCacherListeEnvies(false)};
        if(!montrerCacherListeEnvies){setMontrerCacherListeEnvies(true)};
    }

    const onClickHistoriqueAchats = () => {
        if(montrerCacherHistoriqueAchats){setMontrerCacherHistoriqueAchats(false)};
        if(!montrerCacherHistoriqueAchats){setMontrerCacherHistoriqueAchats(true)};
    }

    return(
        <div className="container" style={{marginTop: "80px"}}>
            <h5 className="montrer-cacher page-accueil-profil" onClick={onClickMenusProfil}>Profil</h5>
                {montrerCacherProfil &&
                    <AfficherProfilConnecte />
                }
            <h5 className="montrer-cacher page-accueil-profil" onClick={onClickPanier}>Panier <NombreArticlesPanier /></h5>
                {montrerCacherPanier &&
                    <PanierMembre />
                }
            <h5 className="montrer-cacher page-accueil-profil" onClick={onClickListeEnvies}>Liste d'envies</h5>
                {montrerCacherListeEnvies &&
                    <ListeEnviesMembre />
                }
            <h5 className="montrer-cacher page-accueil-profil" onClick={onClickHistoriqueAchats}>Historique de mes achats</h5>
                {montrerCacherHistoriqueAchats &&
                    <HistoriqueAchatsMembre 
                        lienVoirPlusViaPageProfilMembre = "true"
                        lienRetour="false"
                    />
                }
        </div>
    )

}