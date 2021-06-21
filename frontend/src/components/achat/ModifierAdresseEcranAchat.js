import React, { useState, useContext, useEffect } from 'react';
import Requete from '../../middlewares/Requete';

import UserContext from '../../context/UserContext';

export default function ModifierAdresseDepuisPageAchat(){

    const [membreData, setMembreData] = useState([]);
    const [rafraichir, setRafraichir] = useState(0);
    
    const { modifierAdresse, setModifierAdresse, adresse, setAdresse, codePostal, setCodePostal, ville, setVille, token } = useContext(UserContext);

    useEffect(()=>{
        if(token !== ""){
            async function fetchMembreData(){
                const resultMembre = await Requete.get(
                    "/membres/afficher-connecte",
                    { headers: { "x-auth-token": token } },
                );
                setMembreData(resultMembre.data[0]);
                setAdresse(resultMembre.data[0].adresse);
                setCodePostal(resultMembre.data[0].code_postal);
                setVille(resultMembre.data[0].ville);
            };
            fetchMembreData();
        }
    }, [token, rafraichir, setAdresse, setCodePostal, setVille]);

    const champsModifierAdresse = () => {
        if(modifierAdresse === false){setModifierAdresse(true)}
        if(modifierAdresse === true){setModifierAdresse(false)}
    }

    const validerChangementAdresse = async (e)=>{

        e.preventDefault();
        const nouvelleAdresse = { adresse, codePostal, ville }

        await Requete.post(
            "/membres/modifier-adresse-depuis-ecran-achat",
            nouvelleAdresse,
            { headers: { "x-auth-token": token } }
        )

        setRafraichir(rafraichir*1 + 1);
        setModifierAdresse(false);
    };

    return(
        <div style={{width: "50%", textAlign: "center", marginTop: "5%"}} className="container">
            {membreData.length === 0 ?
                <h3>Chargement...</h3>
            :
            <div>
                {!modifierAdresse &&
                        <>
                        <h5>Adresse de livraison:</h5>
                        <h5>{membreData.prenom} {membreData.nom}</h5>
                        <h5>{membreData.adresse} {membreData.code_postal} {membreData.ville}</h5>
                        <h6 onClick={champsModifierAdresse} style={{textDecoration: "underline", cursor: "pointer"}}>
                            modifier
                        </h6>
                    </>
                    }
                {modifierAdresse &&
                    <>
                        <div className='form-group'>
                        <label>Adresse:</label>
                        <input
                            className='form-control'
                            type='text'
                            placeholder="4 bis rue Vauban"
                            onChange={(e) => setAdresse(e.target.value)}
                            defaultValue={membreData.adresse}
                        />
                        </div>
                        <div className='form-group'>
                                <label>Code Postal:</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    placeholder="5 chiffres"
                                    onChange={(e) => setCodePostal(e.target.value)}
                                    defaultValue={membreData.codePostal}
                                />
                        </div>
                        <div className='form-group'>
                                <label>Ville:</label>
                                <input
                                    className='form-control'
                                    type='text'
                                    placeholder="Paris, Lyon ...."
                                    onChange={(e) => setVille(e.target.value)}
                                    defaultValue={membreData.ville}
                                />
                        </div>
                        <div style={{width: "100%", display: "inline-flex", justifyContent: "space-between"}}>
                            <input type='submit'
                                    value='Annuler' 
                                    className='btn btn-danger'
                                    onClick={champsModifierAdresse}
                            />
                            <input type='submit'
                                    value='Modifier adresse' 
                                    className='btn btn-primary'
                                    onClick={validerChangementAdresse}
                            />
                        </div>
                    </>
                }
            </div>
            }
        </div>
    )
}