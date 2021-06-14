import React from 'react';

import ProduitsPageHome from './base/Base';

export default function AfficherMeilleursVentesHome(){
    
    return(
        <ProduitsPageHome
            adresseBack="/produit/meilleures-ventes"
            titre="Meilleures ventes:"
            messageSiRien="produits les plus vendus"
        />
    )
}