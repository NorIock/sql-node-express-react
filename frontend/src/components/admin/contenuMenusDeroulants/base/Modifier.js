import React, { useState, useEffect } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom'; // Permet de remplacer le this.props.match.params.id que j'utilisais avec les classes

import Requete from "../../../../middlewares/Requete";
import ErrorNotice from "../../../../middlewares/ErrorNotice";
import GetToken from '../../../../middlewares/GetToken';

export default function ModifierChamps(props){

    const [data, setData] = useState([]);
    const [champs, setChamps] = useState();
    const [error, setError] = useState();
    const { id } = useParams();
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

    const submit = async function(e){
        e.preventDefault();

        try{
            const majModePaiement = { champs };
            await Requete.put(
                props.adresseBackModifier + id,
                majModePaiement,
                { headers: { "x-auth-token": token } }, // Doit être en dernier pour éviter tout problème de token lors de la validation
            )
            history.push(props.lienRetour);

        } catch(err) {
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    }

    return(
        <div className="container" style={{marginTop: "80px"}}>
            <form onSubmit={submit}>
                <div className='form-group'>
                    <label><h3>Modification à effectuer:</h3></label>
                    <input
                        type='text'
                        className='form-control'
                        placeholder={data.champs}
                        defaultValue={data.champs}
                        onChange={(e)=> setChamps(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <input 
                        type='submit'
                        value='Modifier'
                        className='btn btn-primary'
                    />
                </div>
                {error && (
                    <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                )} {/*S'il y a une erreur, affiche le message d'erreur, la fonction anonyme supprime quand on clique */}
            </form>
            <div>
                <Link to={props.lienRetour}>Retour</Link>
            </div>
        </div>
    )
}