import React from 'react';

import ProduitsPageHome from './base/Base';

export default function AfficherProduitsPopulaireHome(){

    return(
        <ProduitsPageHome
            adresseBack="/produit/les-plus-consultes"
            titre="Les plus consultés:"
            messageSiRien="produits les plus consultés"
        />
    )
}