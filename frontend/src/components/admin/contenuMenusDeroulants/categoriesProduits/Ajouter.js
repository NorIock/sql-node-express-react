import React from 'react';

import AjouterChamps from '../base/Ajouter';

export default function AjouterCategorieProduits(){

    let rien = "La création de catégorie est indispensable pour la création d'un produit. Veuillez en enregister au moins un, ";
    let rien2 = "afin de ne pas créer d'erreur quand vous ajouterez un nouveau produit"

    return(
        <AjouterChamps
            adresseBackAjouter="/categorieProduits/ajouter"
            adresseBackAfficher="/categorieProduits/afficher"
            lienModifier="/admin/menusDeroulants/categorieProduits/modifier/"
            lienSupprimer="/admin/menusDeroulants/categorieProduits/supprimer/"
            label="Ajouter une nouvelle catégorie"
            placeholder="Indiquer la nouvelle catégorie"
            libelle="Liste des catégories de produits"
            id="categorie_id"
            messageSiRien = {rien + rien2}
        />
    );
}