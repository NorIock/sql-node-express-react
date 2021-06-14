import React from 'react';

import AjouterChamps from '../base/Ajouter';

export default function AjouterModeLivraison(){

    let rien = "La création de moyens de livraison est indispensable pour l'achat d'un article. Veuillez en enregister au moins ";
    let rien2 = "un, afin de ne pas créer d'erreur quand un membre souhaitera effectuer une transaction"

    return(
        <AjouterChamps
            adresseBackAjouter="/modeLivraison/ajouter"
            adresseBackAfficher="/modeLivraison/afficher"
            lienModifier="/admin/menusDeroulants/modeLivraison/modifier/"
            lienSupprimer="/admin/menusDeroulants/modeLivraison/supprimer/"
            label="Ajouter un mode de livraison"
            placeholder="Indiquer le nouveau mode de livraison"
            libelle="Liste des modes de livraison"
            messageSiRien = {rien + rien2}
        />
    );
}