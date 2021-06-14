import React, { useState, useContext } from 'react';
import Requete from '../../middlewares/Requete';

import UserContext from '../../context/UserContext';

export default function ModifierAdresseDepuisPageAchat(props){

    const [adresse, setAdresse] = useState(props.adresse);
    const [codePostal, setCodePostal] = useState(props.codePostal);
    const [ville, setVille] = useState(props.ville);

    const { rafraichir, setRafraichir, setModifierAdresse } = useContext(UserContext);

    const validerChangementAdresse = async (e)=>{

        e.preventDefault();
        const nouvelleAdresse = { adresse, codePostal, ville }

        await Requete.post(
            "/membres/modifier-adresse-depuis-ecran-achat",
            nouvelleAdresse,
            { headers: { "x-auth-token": props.token } }
        )

        setRafraichir(rafraichir*1 + 1);
        setModifierAdresse(false);
    };

    return(
        <div style={{width: "50%", marginLeft: "25%"}}>
            <div className='form-group'>
            <label>Adresse:<span style={{color: "red"}}>*</span></label>
            <input
                className='form-control'
                type='text'
                placeholder="4 bis rue Vauban"
                onChange={(e) => setAdresse(e.target.value)}
                defaultValue={props.adresse}
            />
            </div>
            <div className='form-group'>
                    <label>Code Postal:<span style={{color: "red"}}>*</span></label>
                    <input
                        className='form-control'
                        type='text'
                        placeholder="5 chiffres"
                        onChange={(e) => setCodePostal(e.target.value)}
                        defaultValue={props.codePostal}
                    />
            </div>
            <div className='form-group'>
                    <label>Ville:<span style={{color: "red"}}>*</span></label>
                    <input
                        className='form-control'
                        type='text'
                        placeholder="Paris, Lyon ...."
                        onChange={(e) => setVille(e.target.value)}
                        defaultValue={props.ville}
                    />
            </div>
            <div className='form-group'>
                <input type='submit'
                        value='Modifier adresse' 
                        className='btn btn-primary'
                        onClick={validerChangementAdresse}/>
            </div>
        </div>
    )
}