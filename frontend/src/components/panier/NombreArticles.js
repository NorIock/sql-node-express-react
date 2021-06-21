import React, { useState, useEffect } from 'react';

import Requete from '../../middlewares/Requete';
import GetToken from '../../middlewares/GetToken';

export default function NombreArticlesPanier(){

    const [data, setData] = useState("");

    let token = GetToken();

    useEffect(()=>{
        async function fetchData(){
            const result = await Requete.get(
                "/panier/nombre-articles",
                { headers: { "x-auth-token": token } }
            )
            setData(result.data);
        };
        fetchData();
    }, [token]);

    return(
        <>
            {data.lenght === 0 ?
                <h6>Chargement...</h6>
            :
            data > 0 ?
            <strong>({data})</strong>
            : null
            }
        </>
    )
}