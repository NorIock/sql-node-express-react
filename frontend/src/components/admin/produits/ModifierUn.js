import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import { Image } from 'cloudinary-react';
import Requete from '../../../middlewares/Requete';
import ErrorNotice from '../../../middlewares/ErrorNotice';
import DropDownMenu from '../../../middlewares/DropDownMenu';

export default function ModifierProduit(){

    const [categorieData, setCategorieData] = useState([]);
    const [produitData, setProduitData] = useState([]);
    const [nom, setNom] = useState();
    const [prix, setPrix] = useState();
    const [quantite, setQuantite] = useState();
    const [ajoutPhoto] = useState("");
    const [photo, setPhoto] = useState([]);
    const [photoSupprimer, setPhotoSupprimer] = useState([]);
    const [description, setdescription] = useState();
    const [categorie, setCategorie] = useState();
    const [error, setError] = useState();

    const {REACT_APP_CLOUDINARY_NAME} = process.env;
    const history = useHistory();
    const { id } = useParams();

    let token = localStorage.getItem("auth-token"); // Permet de récupérer le token afin de l'envoyer dans la requête
    if(token === null){ // S'il n'y a pas de token dans le local storage, cela crée une erreur. Avec ce if, cela nous permet que s'il est null lui attribuer une valeur et éviter une erreur
        localStorage.setItem("auth-token", "");
        token="";
    }

    useEffect(()=>{
        async function fetchCategorieData(){
            const categorieResult = await Requete.get(
                "/categorieProduits/afficher",
            )
            setCategorieData(categorieResult.data);
        }
        fetchCategorieData();

        async function fetchProduitData(){
            const produitResult = await Requete.get(
                "/produit/afficher-un/" + id,
            )
            setProduitData(produitResult.data);
        }
        fetchProduitData();
    }, [id]);

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

    const supprimerPhoto = (supprimer) => {
        setPhotoSupprimer([...photoSupprimer, supprimer]);
    }

    const annulerSupprimerPhoto = (annuler) => {
        setPhotoSupprimer(photoSupprimer.filter(annulerSupprimer => annulerSupprimer !== annuler));
    }

    const submit = async function(e){
        e.preventDefault();

        try{

            const modifierProduit = { nom, photo, photoSupprimer, prix, quantite, description, categorie }

            await Requete.put(
                "/produit/modifier/" + id,
                modifierProduit,
                { headers: { "x-auth-token": token } }
            )
            history.push("/admin/produit/afficherUn/" + id);
        } catch(err){
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    }

    return(
        <div style={{marginTop: "80px"}}>
            {categorieData.length === 0 || produitData.length === 0 ?
                <h3>Chargement....</h3>
            :

        <div className="container" style={{marginTop: '6%'}}>
            <h3 style={{textAlign: "center"}}>Modifier le produit</h3>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label><strong>Modifier le nom du produit:</strong></label>
                    <input
                        type='text'
                        placeholder="Indiquer le nom du produit"
                        defaultValue={produitData.nom}
                        onChange={(e) => setNom(e.target.value)}
                        className='form-control'
                    />
                </div>
                <div>
                <label><strong>Ajouter une ou plusieurs photos:</strong></label>
                <div className="form-group">
                    <input
                        type="file"
                        accept=".jpg, .jpeg, .png, .svg"
                        onChange={nouvellePhoto}
                        value={ajoutPhoto}
                        className="form-control"
                    />
                </div>
                <div>
                    <h6 style={{color: "green"}}>Pour ajouter plusieurs photos (6 maximum), cliquer à nouveau sur le bouton Choose File</h6>
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
                <h6><strong>Supprimer une ou plusieurs photos existantes déjà pour le produit:</strong>
                    {produitData.photos.length > 0 &&
                        <div>
                        {produitData.photos.map(photo => (
                            <div key={photo.photo_id} style={{display: "inline-block"}}>
                                <div>
                                <Image
                                    cloudName={REACT_APP_CLOUDINARY_NAME}
                                    publicId={photo.public_id}
                                    width='150'
                                    crop="scale"
                                />
                                </div>
                                {photoSupprimer.includes(photo.public_id) === false &&
                                    <div>
                                    <button
                                        type='button'
                                        className='btn btn-danger'
                                        onClick={() => supprimerPhoto(photo.public_id)}
                                        style={{marginLeft: "50px"}}
                                    >Suppimer</button>
                                    </div>
                                }
                                {photoSupprimer.includes(photo.public_id) === true &&
                                    <div>
                                    <button
                                        type='button'
                                        className='btn btn-info'
                                        onClick={() => annulerSupprimerPhoto(photo.public_id)}
                                        style={{marginLeft: "30px"}}
                                    >Ne pas supprimer</button>
                                    </div>
                                }
                            </div>
                        ))}
                        </div>
                    }
                </h6>
                </div>
                <div className="form-group side-by-side">
                    <label style={{marginTop: "0.9%"}}><strong>Quantitée:</strong></label>
                    <input
                        type='number'
                        min={1}
                        defaultValue={produitData.quantite}
                        onChange={(e) => setQuantite(e.target.value)}
                        className='form-control'
                        style={{width: "10%"}}
                    />
                    <label style={{marginTop: "0.9%"}}><strong>Prix de vente:</strong></label>
                    <input
                        type='number'
                        step='0.01'
                        // precision={2}
                        min={0}
                        defaultValue={produitData.prix}
                        onChange={(e) => setPrix(e.target.value)}
                        className='form-control'
                        style={{width: "10%"}}
                    />
                    <label style={{marginTop: "0.9%"}}><strong>Catégorie:</strong></label>
                    <DropDownMenu
                        onChange={(e) => setCategorie(e.target.value)}
                        donneesMap={categorieData}
                        largeur= "30%"
                    />
                </div>
                <div className='form-group'>
                    <label><strong>Description:</strong></label>
                    <textarea
                        type='text'
                        defaultValue={produitData.description}
                        placeholder="Description du produit"
                        rows={8}
                        onChange={(e) => setdescription(e.target.value)}
                        className='form-control'
                    />
                </div>
                <div className="form-group">
                    <input
                        type="submit"
                        className="btn btn-primary"
                        value="Enregistrer les modifications"
                    />
                </div>
                {error && (
                    <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                )} {/*S'il y a une erreur, affiche le message d'erreur, la fonction anonyme supprime quand on clique */}
            </form>
            <Link to={"/admin/produit/afficherUn/" + id}>Retour</Link>
        </div>
        }
        </div>
    )
}