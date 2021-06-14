import React, { useState, useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

import Requete from '../../../middlewares/Requete';
import GetToken from '../../../middlewares/GetToken';

export default function RetirerOuRemettreProduitEnVente(){

    const [data, setData] = useState([]);
    const history = useHistory();
    const { id } = useParams();

    let token = GetToken();

    useEffect(()=>{
        async function fetchData(){
            const result = await Requete.get(
                "/produit/afficher-un/" + id
            )
            setData(result.data);
        }
        fetchData();
    }, [id]);

    const submit = async ()=>{

        let modifierEn_vente;
        if(data.en_vente){
            modifierEn_vente = '0';
        }
        if(!data.en_vente){
            modifierEn_vente = '1';
        }
        const modifierVente = { modifierEn_vente };

        await Requete.post(
            "/produit/retirer-ou-remettre-en-vente/" + id,
            modifierVente,
            { headers: { "x-auth-token": token } },
        )
        history.push("/admin/produit/afficherUn/" + id);
            
    }

    return(
        <div className="container" style={{marginTop: "80px"}}>
            {data.length === 0 ?
                <h3 style={{ textAlign: "center", marginTop: "50px"}}>Chargement...</h3>
            : (
                <div>
                    <h3 style={{textAlign: "center"}}>Modifier la mise en vente de {data.nom}</h3>
                    {!data.en_vente ?
                        <div>
                            <h4 style={{color: "red", textAlign: "center", marginTop: "50px"}}>N'est plus proposé à la vente</h4>
                            <input
                                type='submit'
                                value='Remettre ne vente'
                                className='btn btn-primary float-right'
                                onClick={submit}
                            />
                        </div>
                    :
                    data.en_vente &&
                        <div>
                            <h4 style={{color: "green", textAlign: "center", marginTop: "50px"}}>Est proposé à la vente</h4>
                            <input
                                type='submit'
                                value='Retirer de la vente'
                                className='btn btn-danger float-right'
                                onClick={submit}
                            />
                        </div>
                    }
                    <h4 style={{ textAlign: "center", marginTop: "50px"}}><Link to={"/admin/produit/afficherUn/" + id}>Retour</Link></h4>
                </div>
            )}
        </div>
    )
}