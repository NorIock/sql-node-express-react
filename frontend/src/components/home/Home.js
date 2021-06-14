import React from 'react';

import BarreRecherche from '../produit/BarreRecherche';
import DerniersProduitsAjoutes from './contenuDynamiqueHome/AjoutsRecents';
import AfficherProduitsPopulaireHome from './contenuDynamiqueHome/PlusConsultes';
import AfficherMeilleursVentesHome from './contenuDynamiqueHome/MeilleursVentes';
import AfficherMessageLancementSiteAccueil from './messageDansHome/AfficherMessage';

export default function Home(){

    return(
        <div>
            <div style={{marginTop: "80px", textAlign:"center", position: "sticky", top: "80px", zIndex: "1"}}>
                <BarreRecherche />
            </div>
            <div>
                <AfficherMessageLancementSiteAccueil />
            </div>
            <div>
                <DerniersProduitsAjoutes />
                <AfficherMeilleursVentesHome />
                <AfficherProduitsPopulaireHome />
            </div>
        </div>
    )
}