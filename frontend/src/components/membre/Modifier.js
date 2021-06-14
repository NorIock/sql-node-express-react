import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Requete from '../../middlewares/Requete';
import ErrorNotice from '../../middlewares/ErrorNotice';
import GetToken from '../../middlewares/GetToken';

export default function ModifierProfil(){

    const [data, setData] = useState([]);
    const [email, setEmail] = useState();
    const [motDePasse, setMotDePasse]= useState();
    const [motDePasseConfirmation, setMotDePasseConfirmation]= useState();
    const [adresse, setAdresse] = useState();
    const [codePostal, setCodePostal] = useState();
    const [ville, setVille] = useState();

    const [error, setError] = useState();
    const history = useHistory();

    let token = GetToken();

    useEffect(()=>{
        async function fetchData(){
            const result = await Requete.get(
                "/membres/afficher-connecte",
                { headers: { "x-auth-token": token } }
            );
            setData(result.data[0]);
        };
        fetchData();
    }, [token]);

    const submit = async (e) => {

        e.preventDefault(e);

        try {
            const nouvellesDonneesProfil = { email, motDePasse, motDePasseConfirmation, adresse, codePostal, ville };

            await Requete.post(
                "/membres/modifier-profil",
                nouvellesDonneesProfil,
                { headers: { "x-auth-token": token } }
            )
            history.push("/profil");
            
        } catch (err) {
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    }

    return(
        <div style={{marginTop: "80px"}} className="card card-container">
            {data.length === 0 ?
                <h3 style={{textAlign: "center", marginTop: "100px"}}>Chargement...</h3>
            :
            <div>
                <form onSubmit={submit}>
                        <div className="form-group">
                            <h3 style={{textAlign: 'center', marginBottom: "5%"}}>Modifier mon profil:</h3>
                            <label>Email:</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Nouvel email'
                                defaultValue={data.email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Mot de passe:</label>
                            <input
                                type='password'
                                className='form-control'
                                placeholder='Nouveau mot de passe'
                                onChange={(e) => setMotDePasse(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <input
                                type='password'
                                className='form-control'
                                placeholder='Confirmez votre nouveau mot de passe'
                                onChange={(e) => setMotDePasseConfirmation(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Adresse:</label>
                            <input
                                className='form-control'
                                type='text'
                                placeholder="Nouvelle adresse"
                                defaultValue={data.adresse}
                                onChange={(e) => setAdresse(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Code Postal:</label>
                            <input
                                className='form-control'
                                type='text'
                                placeholder="Nouveau code postal (5 chiffres)"
                                defaultValue={data.code_postal}
                                onChange={(e) => setCodePostal(e.target.value)}
                            />
                        </div>
                        <div className='form-group'>
                            <label>Ville:</label>
                            <input
                                className='form-control'
                                type='text'
                                placeholder="Nouvelle ville"
                                defaultValue={data.ville}
                                onChange={(e) => setVille(e.target.value)}
                            />
                        </div>
                            {error && (
                                <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                            )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
                        <div className='form-group'>
                            <input type='submit' value='Modifier' className='btn btn-primary float-right'/>
                        </div>
                </form>
                <h5><Link to={"/profil"}>Retour</Link></h5>
            </div>
            }
        </div>
    )
}