import React from 'react';

import AjouterChamps from '../base/Ajouter';

export default function AjouterModePaiement(){

    let rien = "La création de modes de paiement est indispensable pour l'achat d'un article. Veuillez en enregister au moins un, ";
    let rien2 = "afin de ne pas créer d'erreur quand un membre souhaitera effectuer une transaction"

    return(
        <div>
            <AjouterChamps
                adresseBackAjouter="/modePaiement/ajouter"
                adresseBackAfficher="/modePaiement/afficher"
                lienModifier="/admin/menusDeroulants/modePaiement/modifier/"
                lienSupprimer="/admin/menusDeroulants/modePaiement/supprimer/"
                label="Ajouter un mode de paiement" 
                placeholder="Indiquer le nouveau mode de paiement"
                libelle="Liste des modes de paiements"
                messageSiRien = {rien + rien2}
            />
        </div>
    )
}