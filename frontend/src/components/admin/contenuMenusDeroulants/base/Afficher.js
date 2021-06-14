import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Requete from '../../../../middlewares/Requete';

export default function AfficherChamps(props) { // Props permet de récupérer la variable du parent

    const [data, setData] = useState([]);

    const history = useHistory();
 
    useEffect(function(){
        
        async function fetchData(){
            const result = await Requete.get(
                props.adresseBackAfficher,
            );
            setData(result.data);
        };
        fetchData();
    }, [props.toChild, props.adresseBackAfficher]);

    return(
        <div>
            <h3>{props.libelle}</h3>
            {data.length === 0 ?
                <h3 style={{textAlign: "center"}}>Chargement...</h3>
            : data === "Rien" ?
                <h4 style={{color: "red", textAlign: "justify"}}>{props.messageSiRien}</h4>
            : data !== "Rien" ?
                <table className="table table-striped">
                    <tbody>
                    {data.map((champs) =>
                        <tr key={champs.id}>
                            <td key={champs.id} style={{width:"90%"}}>{champs.champs}</td>
                            <td><Link to={props.lienModifier + champs.id}>modifier</Link></td>
                            <td><Link to={props.lienSupprimer + champs.id}>supprimer</Link></td>
                        </tr>
                    )}
                    </tbody>
                </table>  
            : null
            }
            <h4
                style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer", textAlign: "center"}}
                onClick={()=>history.goBack()}
            >
                Retour
            </h4>
        </div>
    )
}