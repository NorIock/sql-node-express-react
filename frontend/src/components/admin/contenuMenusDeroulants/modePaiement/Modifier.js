import React from 'react';

import ModifierChamps from '../base/Modifier';

export default function ModifierModePaiement(){

    return(
        <ModifierChamps
            adresseBackAfficherUn = "/modePaiement/afficher-un/"
            adresseBackModifier = "/modePaiement/modifier/"
            lienRetour = "/admin/menusDeroulants/modePaiement/ajouter"
        />
    )
}