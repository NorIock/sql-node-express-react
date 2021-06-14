import React from 'react';

import ProduitsPageHome from './base/Base';

export default function DerniersProduitsAjoutes(){

    return(
        <ProduitsPageHome
            adresseBack="/produit/derniers-ajouts"
            titre="Nouveau:"
            messageSiRien="derniers nouveaux produits ajoutés"
        />
    )
}