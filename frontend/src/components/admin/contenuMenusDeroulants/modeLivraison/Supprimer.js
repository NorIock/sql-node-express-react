import React from 'react';

import SupprimerChamps from '../base/Supprimer';

export default function SupprimerModeLivraison(){
    
    return(
        <SupprimerChamps
            adresseBackAfficherUn = "/modeLivraison/afficher-un/"
            adresseBackSupprimer = "/modeLivraison/supprimer/"
            lienRetour = "/admin/menusDeroulants/modeLivraison/ajouter"
        />
    )
}