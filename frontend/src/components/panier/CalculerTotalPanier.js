import React, { useState, useEffect } from 'react';

import Requete from '../../middlewares/Requete';

export default function CalculerTotalPanier(props){

    const [total, setTotal] = useState("");

    useEffect(()=>{
        async function fetchTotalPanierData(){
            const totalResult = await Requete.get(
                "/panier/total",
                { headers: { "x-auth-token": props.token } }
            )
            setTotal(totalResult.data);
        };
        fetchTotalPanierData();
    }, [props.token, props.refresh])

    return(
        <>
            {total.length === 0 ?
                <h3>...</h3>
            :  
                total
            }
        </>
    )


}