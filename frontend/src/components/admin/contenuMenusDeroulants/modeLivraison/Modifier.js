import React from 'react';

import ModifierChamps from '../base/Modifier';

export default function ModifierModeLivraison(){
    return(
        <ModifierChamps
            adresseBackAfficherUn = "/modeLivraison/afficher-un/"
            adresseBackModifier = "/modeLivraison/modifier/"
            lienRetour = "/admin/menusDeroulants/modeLivraison/ajouter"
        />
    )
}