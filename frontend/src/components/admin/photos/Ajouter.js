import React, { useState } from 'react';

import Requete from '../../../middlewares/Requete';
import ErrorNotice from '../../../middlewares/ErrorNotice';

export default function AjouterPhotoProduit(){

    const [ajoutPhoto] = useState("");
    const [photo, setPhoto] = useState([]);
    var [toChild, setToChild] = useState(0);

    const [error, setError] = useState();

    let token = localStorage.getItem("auth-token"); // Permet de récupérer le token afin de l'envoyer dans la requête
    if(token === null){ // S'il n'y a pas de token dans le local storage, cela crée une erreur. Avec ce if, cela nous permet que s'il est null lui attribuer une valeur et éviter une erreur
        localStorage.setItem("auth-token", "");
        token="";
    }

    const nouvellePhoto = (e) => {

        const fichier = e.target.files[0];

        const reader = new FileReader();
        reader.readAsDataURL(fichier);
        reader.onloadend = () => {
            setPhoto([...photo, reader.result]);
        }
    }

    const retirerPhoto = (retirer) => {
        setPhoto(photo.filter(retirerPhoto => retirerPhoto !== retirer));
    }

    const submit = async (e) => {
        e.preventDefault();

        if(!photo) return;

        const nouvellePhoto = { photo };

        try{

            await Requete.post(
                "/photo/ajouter",
                nouvellePhoto,
                { headers: { "x-auth-token": token } }
            );
            setToChild(toChild*1 + 1);

        } catch(err){
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    }

    return(
        <div style={{marginTop: "80px"}}>
            <h3>Ajouter une ou plusieurs photos</h3>
            <form onSubmit={submit}>
                <div className="form-group">
                    <input
                        type="file"
                        accept=".jpg, .jpeg, .png, .svg"
                        onChange={nouvellePhoto}
                        value={ajoutPhoto}
                        className="form-control"
                    />
                    {error && (
                        <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                    )} {/*S'il y a une erreur, affiche le message d'erreur, la faction anonyme supprime quand on clique */}
                    <div className='form-group'>
                        <input type='submit' value='Valider' className='btn btn-primary'/>
                    </div>
                </div>
            </form>
            {photo.length > 0 && (
                <div>
                    <h5 style={{color: "red"}}>Pour ajouter plusieurs photos (6 maximum), cliquer à nouveau sur le bouton Choose File</h5>
                    {photo.map((unePhoto, i) =>(
                        <div style={{display:"inline-block"}} key={i}>
                            <div>
                                <img 
                                    src={unePhoto}
                                    alt="chosen"
                                    style={{width: "200px"}}
                                />
                            </div>
                            <div>
                                <button
                                    type='button'
                                    className='btn btn-danger'
                                    onClick={() => retirerPhoto(unePhoto)}
                                    style={{marginLeft: "80px"}}
                                >X</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}