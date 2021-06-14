import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Requete from '../../../middlewares/Requete';

export default function AfficherProfilConnecte(){

    const [data, setData] = useState([]);

    let token;
    token = localStorage.getItem('auth-token', token);
    if(token === null){
        localStorage.setItem('auth-token', "");
        token = "";
    }

    useEffect(function(){
        
        async function fetchData(){
            const resultat = await Requete.get(
                "/membres/afficher-connecte",
                { headers: { "x-auth-token": token } },
            );
            setData(resultat.data[0]);
        };
        fetchData();
    }, [token]);

    return(
        <div>
            {data.length === 0 ? (
                <h3 style={{ marginTop: "100px", textAlign: "center"}}>Chargement...</h3>
            ) : (
                <div className="container">
                    <table className="table affichage-profil">
                        <tbody>
                            <tr>
                                <td>
                                    <h5>{data.nom} {data.prenom}</h5>
                                    <h5><strong>Email: </strong>{data.email}</h5>
                                    <h5><strong>Adresse: </strong>{data.adresse} {data.code_postal} {data.ville}</h5>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th style={{textAlign: "center"}}>
                                    <Link to={"/membres/verifier-mdp"}>Modifier</Link>
                                </th>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
        </div>
    )
}