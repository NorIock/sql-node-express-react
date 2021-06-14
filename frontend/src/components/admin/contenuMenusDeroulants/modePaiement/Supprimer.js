import React from 'react';

import SupprimerChamps from '../base/Supprimer';

export default function SupprimerModePaiement(){

    return(
        <SupprimerChamps
            adresseBackAfficherUn = "/modePaiement/afficher-un/"
            adresseBackSupprimer = "/modePaiement/supprimer/"
            lienRetour = "/admin/menusDeroulants/modePaiement/ajouter"
        />
    )
}