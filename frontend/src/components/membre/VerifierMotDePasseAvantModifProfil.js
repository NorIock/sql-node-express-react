import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'

import Requete from '../../middlewares/Requete';
import ErrorNotice from '../../middlewares/ErrorNotice';
import GetToken from '../../middlewares/GetToken';

export default function VerifierMotDePasse(){

    const [motDePasse, setMotDePasse] = useState();
    const [error, setError] = useState();

    const history = useHistory();

    let token = GetToken();

    const submit = async function(e){
        e.preventDefault();

        try{
            const verifierMotDePasseMembre = { motDePasse };

            const verificationResult = await Requete.post(
                "/membres/verification-mdp/",
                verifierMotDePasseMembre,
                { headers: { "x-auth-token": token } }
            );
            if(verificationResult.data === true){
                history.push("/membres/modifier");
            }
        } catch(err){
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    }

    return(
        <div className='col-md-12'>
            <div className="card card-container">
                <form onSubmit={submit}>
                    {error && (
                        <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                    )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
                    <label>Veuillez indiquer à nouveau votre mot de passe avant de pouvoir modifier votre profil</label>
                    <div className="form-group">
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Mot de passe"
                            onChange={(e) => setMotDePasse(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Envoyer" className="btn btn-primary" />
                    </div>
                </form>
                <h5 style={{textAlign: "center", textDecoration: "underline", cursor: "pointer"}}
                    onClick={()=>history.goBack()}
                >
                    Retour
                </h5>
            </div>
        </div>
    )
}