import React from 'react';
import { useHistory } from 'react-router-dom';

export default function DetailIconeMenusDeroulants(){

    const history = useHistory()

    const MenusDeroulantsModePaiement = function(){history.push("/admin/menusDeroulants/modePaiement/ajouter")};
    const MenusDeroulantsModeLivraison = function(){history.push("/admin/menusDeroulants/modeLivraison/ajouter")};
    const MenusDeroulantsCategoriesProduits = function(){history.push("/admin/menusDeroulants/categorieProduits/ajouter")};

    return(
        <table className="table">
            <tbody>
                <tr onClick={MenusDeroulantsModePaiement}>
                    <td>Modes de paiement</td>
                </tr>
                <tr onClick={MenusDeroulantsModeLivraison}>
                    <td>Modes de livraison</td>
                </tr>
                <tr onClick={MenusDeroulantsCategoriesProduits}>
                    <td>Catégories des produits</td>
                </tr>
            </tbody>
        </table>
    )
}