import React from 'react';

import SupprimerChamps from '../base/Supprimer';

export default function SupprimerCategorieProduits(){
    
    return(
        <SupprimerChamps
            adresseBackAfficherUn = "/categorieProduits/afficher-un/"
            adresseBackSupprimer = "/categorieProduits/supprimer/"
            lienRetour = "/admin/menusDeroulants/categorieProduits/ajouter"
        />
    )
}