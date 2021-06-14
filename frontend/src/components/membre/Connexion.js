import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import UserContext from '../../context/UserContext';
import ErrorNotice from '../../middlewares/ErrorNotice';
import Requete from '../../middlewares/Requete';

export default function Connexion(){

    const [email, setEmail]= useState();
    const [motDePasse, setMotDePasse]= useState();

    const { setUserData } = useContext(UserContext);
    const history = useHistory();
    const [error, setError] = useState();

    const submit = async function(e){
        e.preventDefault();

        try{
            const connexionMembre = { email, motDePasse };

            const loginRes = await Requete.post( // On fait directement la connexion pour pouvoir récupérer le token
                "/membres/connexion",
                connexionMembre,
            );
            setUserData({
                token: loginRes.data.token,
                membre: loginRes.data.membre,
            });
            
            localStorage.setItem("auth-token", loginRes.data.token);
            history.goBack();

        } catch(err){
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    };

    return(
        <div className="col-md-12">
            <div className="card card-container">
                <img
                    src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                    alt="profile-img"
                    className="profile-img-card"
                />
                <form onSubmit={submit}>
                {error && (
                    <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Votre email'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Mot de passe:</label>
                        <input
                            type='password'
                            className='form-control'
                            placeholder='Mot de passe'
                            onChange={(e) => setMotDePasse(e.target.value)}
                        />
                    </div>

                    <div className='form-group'>
                        <input type='submit' value='Connexion' className='btn btn-primary'/>
                    </div>
                </form>
            </div>
        </div>
    )
}