import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import DetailIconeMenusDeroulants from './MenusDeroulantsHome';
import DetailIconeProduits from './ProduitsHome';
import PageAccueilStatistiques from './Statistiques';
import MessagePageAcceuil from './MessageAccueil';

export default function AdminHomePage(){

    const history = useHistory();

    const [montrerCacherMenusDeroulantsDetail, setMontrerCacherMenusDeroulantsDetail] = useState(false);
    const [montrerCacherProduitsDetail, setMontrerCacherProduitsDetail] = useState(false);
    const [montrerCacherStatistiques, setMontrerCacherStatistiques] = useState(false);
    const [montrerCacherMessageAccueil, setMontrerCacherMessageAccueil] = useState(false);

    const onClickMenusDeroulants = () => {
        if(montrerCacherMenusDeroulantsDetail){setMontrerCacherMenusDeroulantsDetail(false)};
        if(!montrerCacherMenusDeroulantsDetail){setMontrerCacherMenusDeroulantsDetail(true)};
    }

    const onClickProduits = () => {
        if(montrerCacherProduitsDetail){setMontrerCacherProduitsDetail(false)};
        if(!montrerCacherProduitsDetail){setMontrerCacherProduitsDetail(true)};
    }

    const onClickStatistiques = () => {
        if(montrerCacherStatistiques){setMontrerCacherStatistiques(false)}
        if(!montrerCacherStatistiques){setMontrerCacherStatistiques(true)}
    }

    const onClickMessageAccueil = () => {
        if(montrerCacherMessageAccueil){setMontrerCacherMessageAccueil(false)}
        if(!montrerCacherMessageAccueil){setMontrerCacherMessageAccueil(true)}
    }

    return(
        <div style={{marginTop: "80px"}} className="container">
            <div
                className="montrer-cacher page-accueil-admin"
                onClick={onClickMenusDeroulants}
            >
                <h5>Contenu des menus déroulants</h5>
                {montrerCacherMenusDeroulantsDetail ? 
                <DetailIconeMenusDeroulants />
                : null
                }
            </div>
            <div
                className="montrer-cacher page-accueil-admin"
                onClick={onClickProduits}
            >
            <h5>Produits</h5>
                {montrerCacherProduitsDetail ? 
                <DetailIconeProduits />
                : null
                }
            </div>
            <div
                className="montrer-cacher page-accueil-admin"
                onClick={onClickStatistiques}
            >
                <h5>Statistiques</h5>
                {montrerCacherStatistiques ? 
                <PageAccueilStatistiques />
                : null
                }
            </div>
            <div
                className="montrer-cacher page-accueil-admin"
                onClick={onClickStatistiques}
            >
                <h5 onClick={()=>history.push("/admin/creer-administrateur")}>Créer un administrateur</h5>
            </div>
            <div
                className="montrer-cacher page-accueil-admin"
                onClick={onClickMessageAccueil}
            >
                <h5>Message d'accueil</h5>
                {montrerCacherMessageAccueil ? 
                <MessagePageAcceuil />
                : null
                }
            </div>
        </div>
    )
}