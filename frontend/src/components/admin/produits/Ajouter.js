import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import Requete from '../../../middlewares/Requete';
import ErrorNotice from '../../../middlewares/ErrorNotice';
import DropDownMenu from '../../../middlewares/DropDownMenu';

export default function AjouterProduit(){

    const [categorieData, setCategorieData] = useState([]);
    const [modeLivraisonData, setModeLivraisonData] = useState([]);
    const [moyenPaiementData, setMoyenPaiementData] = useState([]);

    const [nom, setNom] = useState();
    const [prix, setPrix] = useState();
    const [quantite, setQuantite] = useState();
    const [ajoutPhoto] = useState("");
    const [photo, setPhoto] = useState([]);
    const [description, setdescription] = useState();
    const [categorie, setCategorie] = useState();
    const [error, setError] = useState();

    const history = useHistory();

    let token = localStorage.getItem("auth-token"); // Permet de récupérer le token afin de l'envoyer dans la requête
    if(token === null){ // S'il n'y a pas de token dans le local storage, cela crée une erreur. Avec ce if, cela nous permet que s'il est null lui attribuer une valeur et éviter une erreur
        localStorage.setItem("auth-token", "");
        token="";
    }

    useEffect(()=>{
        // Afficher les catégoriess est indispensable pour la création d'un nouveau produit, on récupère aussi les moyens de 
        // paiement et les modes de livraison pour être sûr que l'administrateur a bien créé ces champs aavant d'ajouter un produit
        async function fetchCategorieData(){
            const categorieResult = await Requete.get(
                "/categorieProduits/afficher",
            )
            setCategorieData(categorieResult.data);
        }
        fetchCategorieData();

        async function fetchModeLivraisonData(){
            const modeLivraisonResult = await Requete.get(
                "/modeLivraison/afficher",
            )
            setModeLivraisonData(modeLivraisonResult.data);
        }
        fetchModeLivraisonData();

        async function fetchMoyenPaiementData(){
            const moyenPaiementResult = await Requete.get(
                "/modePaiement/afficher",
            )
            setMoyenPaiementData(moyenPaiementResult.data);
        }
        fetchMoyenPaiementData();
    }, []);

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

    const submit = async function(e){
        e.preventDefault();

        try{

            const nouveauProduit = { nom, photo, prix, quantite, description, categorie }

            const produitAjoute = await Requete.post(
                "/produit/ajouter",
                nouveauProduit,
                { headers: { "x-auth-token": token } }
            )
            history.push("/admin/produit/afficherUn/" + produitAjoute.data[0].produit_id);
        } catch(err){
            err.response.data.msg && setError(err.response.data.msg); //Les 2 doivent être vrai pour être executés. Si le premier est vrai, le setState s'executera pour stocker le message d'erreur
        }
    }

    const dropDownTarget = (e) => {
        setCategorie(e.target.value);
    }

    return(
        <div className="container" style={{marginTop: '6%'}}>
            {(categorieData.length === 0 || modeLivraisonData.length === 0 || moyenPaiementData.length === 0) ?
                <h3 style={{textAlign: "center"}}>Chargement...</h3>
            : (categorieData === "Rien" || modeLivraisonData === "Rien" || moyenPaiementData === "Rien") ?
                <div>
                {categorieData === "Rien" &&
                    <h4 
                        style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer"}}
                        onClick={()=>history.push("/admin/menusDeroulants/categorieProduits/ajouter")}
                    >
                        Veuillez créer des catégories avant d'ajouter un nouveau produit.
                    </h4>
                }
                {modeLivraisonData === "Rien" &&
                    <h4
                        style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer"}}
                        onClick={()=>history.push("/admin/menusDeroulants/modeLivraison/ajouter")}
                    >
                        Veuillez créer des modes de livraison avant d'ajouter un nouveau produit.
                    </h4>
                }
                {moyenPaiementData === "Rien" &&
                    <h4 
                        style={{textDecoration: "underline", color: "#0f584c", cursor: "pointer"}}
                        onClick={()=>history.push("/admin/menusDeroulants/modePaiement/ajouter")}
                    >
                        Veuillez créer des moyens de paiement avant d'ajouter un nouveau produit.
                    </h4>
                }
                </div>
            :
            <div>
                <h3 style={{textAlign: "center"}}>Ajouter un nouveau produit</h3>
                <form onSubmit={submit}>
                    <div className="form-group">
                        <label>Nom du produit:</label>
                        <input
                            type='text'
                            placeholder="Indiquer le nom du produit"
                            onChange={(e) => setNom(e.target.value)}
                            className='form-control'
                        />
                    </div>
                    <div>
                    <label>Ajouter une ou plusieurs photos</label>
                    <div className="form-group">
                        <input
                            type="file"
                            accept=".jpg, .jpeg, .png, .svg"
                            onChange={nouvellePhoto}
                            value={ajoutPhoto}
                            className="form-control"
                        />
                    </div>
                    {photo.length > 0 && (
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
                    )}
                    </div>
                    <div className="form-group side-by-side">
                        <label style={{marginTop: "0.9%"}}>Quantitée:</label>
                        <input
                            type='number'
                            min={1}
                            onChange={(e) => setQuantite(e.target.value)}
                            className='form-control'
                            style={{width: "10%"}}
                        />
                        <label style={{marginTop: "0.9%"}}>Prix de vente:</label>
                        <input
                            type='number'
                            step='0.01'
                            // precision={2}
                            min={0}
                            onChange={(e) => setPrix(e.target.value)}
                            className='form-control'
                            style={{width: "10%"}}
                        />
                        <label style={{marginTop: "0.9%"}}>Catégorie:</label>
                        <DropDownMenu
                            // onChange={(e) => setCategorie(e.target.key)}
                            onChange={dropDownTarget}
                            donneesMap={categorieData}
                            largeur= "30%"
                        />
                    </div>
                    <div className='form-group'>
                        <label>Description:</label>
                        <textarea
                            type='text'
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
                            value="Enregistrer"
                        />
                    </div>
                    {error && (
                        <ErrorNotice message={error} clearError={()=> setError(undefined)} />
                    )} {/*S'il y a une erreur, affiche le message d'erreur, la fonction anonyme supprime quand on clique */}
                </form>
            </div>
            }
            <Link to={"/admin"}>Retour</Link>
        </div>
    )
}