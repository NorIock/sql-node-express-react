import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function BarreRecherche(props){

    const [recherche, setRecherche] = useState();
    const history = useHistory();

    const submit = (e)=>{

        e.preventDefault();
        if(recherche !== undefined && recherche.length > 0){
            history.push("/produit/" + recherche);
        }
    }

    return(
        <div>
            <form onSubmit={submit} style={{position: "sticky", top: "0"}}>
                <div className="form-group container" style={{display: "inline-flex"}}>
                    <input
                        type= 'text'
                        placeholder="Rechercher un article..."
                        className="form-control"
                        onChange={ (e) => setRecherche(e.target.value)}
                        defaultValue={props.recherche}
                    />
                    <input type='submit' value='Rechercher' className='btn btn-primary'/>
                </div>
            </form>
        </div>
    )
}