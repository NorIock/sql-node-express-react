import React, { useState , useEffect, useContext } from 'react';

import Requete from '../../middlewares/Requete';
import DropdownMenuValueChamps from "../../middlewares/DropDownMenuValueChamps";

import UserContext from '../../context/UserContext';

export default function MenuDeroulantModePaiement(props){

    const [modePaiementData, SetModePaiementData] = useState([]);

    const { setPaiement } = useContext(UserContext);

    useEffect(()=>{
        async function fetchModePaiementData(){
            const modePaiementResult = await Requete.get(
                "/modePaiement/afficher",
            );
            SetModePaiementData(modePaiementResult.data);
        };
        fetchModePaiementData();
    }, []);

    return(
        <>
            {modePaiementData.length === 0 ?
                <h3>...</h3>
            :
            <div style={{display: "inline-flex", marginLeft: "3%", width: "21%"}}>
                <label syle={{marginLeft: "3%"}}>Paiement: </label>
                <DropdownMenuValueChamps
                    onChange={(e)=>{setPaiement(e.target.value)}}
                    donneesMap = {modePaiementData}
                    largeur = "100%"
                    margeGauche = "2%"
                />
            </div>
            }
        </>
    )
}