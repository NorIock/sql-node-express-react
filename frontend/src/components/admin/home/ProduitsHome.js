import React from 'react';
import { useHistory } from 'react-router-dom';

export default function DetailIconeProduits(){

    const history = useHistory()

    const ProduitAjouter = function(){history.push("/admin/produit/ajouter")};
    // const ProduitAfficherUn = function(){history.push("/admin/produit/afficherUn")};
    const ProduitAfficherTous = function(){history.push("/admin/produit/afficherTous")};
    // const ProduitModifier = function(){history.push("/admin/produit/modifier")};
    // const ProduitSupprimer = function(){history.push("/admin/produit/supprimer")};

    return(
        <table className="table">
            <tbody>
                <tr onClick={ProduitAjouter}>
                    <td>Ajouter un nouveau produit</td>
                </tr>
                <tr onClick={ProduitAfficherTous}>
                    <td>Afficher et rechercher les produits</td>
                </tr>
            </tbody>
        </table>
    )
}