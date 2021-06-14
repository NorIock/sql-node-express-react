import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import UserContext from '../../../context/UserContext';
import ErrorNotice from '../../../middlewares/ErrorNotice';
import Requete from '../../../middlewares/Requete';
import GetToken from '../../../middlewares/GetToken';

export default function Inscription(props){

     const [nom, setNom] = useState();
     const [prenom, setPrenom] = useState();
     const [email, setEmail] = useState();
     const [motDePasse, setMotDePasse]= useState();
     const [motDePasseConfirmation, setMotDePasseConfirmation]= useState();
     const [adresse, setAdresse] = useState();
     const [codePostal, setCodePostal] = useState();
     const [ville, setVille] = useState();

     const [error, setError] = useState();

     const { setUserData } = useContext(UserContext);
     const history = useHistory();

     let token = GetToken();

     const submit = async function(e){

          e.preventDefault();

          try{
               const nouveauMembre = { nom, prenom, email, motDePasse, motDePasseConfirmation,
                      adresse, codePostal, ville };
               
               if(!props.admin){
                    await Requete.post(
                         "/membres/inscription",
                         nouveauMembre,
                         );

                    const loginRes = await Requete.post(
                         "/membres/connexion",
                         {
                              email, 
                              motDePasse,
                         }
                    );

                    setUserData({
                         token: loginRes.data.token,
                         membre: loginRes.data.membre,
                    });

                    localStorage.setItem("auth-token", loginRes.data.token);
               }

               if(props.admin){
                    await Requete.post(
                         "/membres/creation-admin",
                         nouveauMembre,
                         { headers: { "x-auth-token": token } }
                    )
               }
               
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
                {error && (
                    <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label>Nom:<span style={{color: "red"}}>*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Votre nom'
                            onChange={(e) => setNom(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Prénom:<span style={{color: "red"}}>*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Votre prénom'
                            onChange={(e) => setPrenom(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:<span style={{color: "red"}}>*</span></label>
                        <input
                            type='text'
                            className='form-control'
                            placeholder='Votre email'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <label>Mot de passe:<span style={{color: "red"}}>*</span></label>
                        <input
                            type='password'
                            className='form-control'
                            placeholder='Mot de passe'
                            onChange={(e) => setMotDePasse(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                        <input
                            type='password'
                            className='form-control'
                            placeholder='Confirmez votre mot de passe'
                            onChange={(e) => setMotDePasseConfirmation(e.target.value)}
                        />
                    </div>
                    <div className='form-group'>
                         <label>Adresse:<span style={{color: "red"}}>*</span></label>
                         <input
                              className='form-control'
                              type='text'
                              placeholder="4 bis rue Vauban"
                              onChange={(e) => setAdresse(e.target.value)}
                         />
                    </div>
                    <div className='form-group'>
                         <label>Code Postal:<span style={{color: "red"}}>*</span></label>
                         <input
                              className='form-control'
                              type='text'
                              placeholder="5 chiffres"
                              onChange={(e) => setCodePostal(e.target.value)}
                         />
                    </div>
                    <div className='form-group'>
                         <label>Ville:<span style={{color: "red"}}>*</span></label>
                         <input
                              className='form-control'
                              type='text'
                              placeholder="Paris, Lyon ...."
                              onChange={(e) => setVille(e.target.value)}
                         />
                    </div>
                    <div className='form-group'>
                        <input type='submit' value='Inscription' className='btn btn-primary'/>
                    </div>
                </form>
               </div>
          </div>
     )
}