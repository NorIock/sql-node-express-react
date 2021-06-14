import React, { useState } from 'react';

import AfficherChamps from './Afficher';
import Requete from '../../../../middlewares/Requete';
import ErrorNotice from '../../../../middlewares/ErrorNotice';
import GetToken from '../../../../middlewares/GetToken';

export default function AjouterChamps(props){

    const [champs, setChamps]= useState("");
    const [error, setError] = useState();
    // toChild sera modifiée à chaque fois que l'on clique sur submit (ligne 25) et envoyé au child component Afficher.js (ligne67)
    // Permet d'actualiser useEffect à chaque fois que l'on ajoute une donnée et pas en continu
    var [toChild, setToChild] = useState(0);
  
    let token = GetToken();

    const submit = async function(e){
        e.preventDefault();
        
        try {
            const newData = { champs };
            await Requete.post(
                props.adresseBackAjouter,
                newData,
                { headers: { "x-auth-token": token } }
            );
            setChamps("");
            setToChild(toChild*1 + 1);

        } catch(err) {
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    };

    return(
        <div className="container" style={{marginTop: "80px"}}>
            <form onSubmit={submit}>
                <div className='form-group'>
                    <label><h3>{props.label}:</h3></label>
                    <input
                        type='text'
                        className='form-control'
                        placeholder={props.placeholder}
                        value={champs}
                        onChange={(e)=> setChamps(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <input 
                        type='submit'
                        value='Ajouter'
                        className='btn btn-primary'
                    />
                </div>
                {error && (
                    <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                )} {/*S'il y a une erreur, affiche le message d'erreur, la fonction anonyme supprime quand on clique */}
            </form>
            <div>
                <AfficherChamps 
                    toChild={toChild}
                    adresseBackAfficher={props.adresseBackAfficher}
                    lienModifier={props.lienModifier}
                    lienSupprimer={props.lienSupprimer}
                    libelle={props.libelle}
                    messageSiRien={props.messageSiRien}
                />
            </div>
        </div>
    )
}