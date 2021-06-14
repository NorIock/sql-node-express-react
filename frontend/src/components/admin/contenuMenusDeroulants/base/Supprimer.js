import React, { useState, useEffect} from 'react';
import { useParams, useHistory, Link} from 'react-router-dom';

import Requete from '../../../../middlewares/Requete';
import ErrorNotice from "../../../../middlewares/ErrorNotice";
import GetToken from '../../../../middlewares/GetToken';

export default function SupprimerChamps(props){

    const [data, setData] = useState([]);
    const [error, setError] = useState();
    const { id }= useParams();
    const history = useHistory();

    let token = GetToken();

    useEffect(function(){

        async function fetchData(){
            const result = await Requete.get(
                props.adresseBackAfficherUn + id
            );
            setData(result.data[0]);
        };
        fetchData();
    }, [id, props.adresseBackAfficherUn]);

    const supprimer = async function(){

        try{
            await Requete.delete(
                props.adresseBackSupprimer + id,
                { headers: { "x-auth-token": token } }, // Doit être en dernier pour éviter tout problème de token lors de la validation
            )
            history.push(props.lienRetour);
        } catch(err){
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    }

    return(
        <div className="container" style={{marginTop: "80px"}}>
        {data === undefined ? (
            history.push(props.lienRetour)
        ) : (
            <div>
                <h4>Souhaitez-vous supprimer : <strong>{data.champs}</strong> ?</h4>
                <button onClick={() => supprimer()} className="btn btn-danger">Supprimer</button>
                {error && (
                    <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                )} {/*S'il y a une erreur, affiche le message d'erreur, la fonction anonyme supprime quand on clique */}
                <p><Link to={props.lienRetour}>Retour</Link></p>
            </div>
        )}
        </div>
    )
}