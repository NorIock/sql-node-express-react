import React from 'react';

import ModifierChamps from '../base/Modifier';

export default function ModifierCategorieProduits(){
    return(
        <ModifierChamps
            adresseBackAfficherUn = "/categorieProduits/afficher-un/"
            adresseBackModifier = "/categorieProduits/modifier/"
            lienRetour = "/admin/menusDeroulants/categorieProduits/ajouter"
        />
    )
}