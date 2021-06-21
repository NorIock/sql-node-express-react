import React, { useState , useEffect, useContext } from 'react';

import Requete from '../../middlewares/Requete';
import DropdownMenuValueChamps from "../../middlewares/DropDownMenuValueChamps";

import UserContext from '../../context/UserContext';

export default function MenuDeroulantModeLivraison(){

    const [modeLivraisonData, SetModeLivraisonData] = useState([]);

    const { setLivraison } = useContext(UserContext);

    useEffect(()=>{
        async function fetchModeLivraisonData(){
            const modeLivraisonResult = await Requete.get(
                "/modeLivraison/afficher",
            );
            SetModeLivraisonData(modeLivraisonResult.data);
        };
        fetchModeLivraisonData();
    }, []);

    return(
        <>
            {modeLivraisonData.length === 0 ?
                <h3>...</h3>
            :
            <div style={{display: "inline-flex", marginLeft: "3%", width: "21%"}}>
                <label syle={{marginLeft: "3%"}}>Livraison: </label>
                <DropdownMenuValueChamps
                    onChange={(e)=>{setLivraison(e.target.value)}}
                    donneesMap = {modeLivraisonData}
                    largeur = "100%"
                    margeGauche = "2%"
                />
            </div>
            }
        </>
    )
}