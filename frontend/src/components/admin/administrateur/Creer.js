import React from 'react';
import { Link } from 'react-router-dom';

import Inscription from '../../membre/base/Inscription';

export default function CreerAdmin(){
    return(
        <div className="container">
            <Inscription
                admin={true}
            />
            <h4 style={{textAlign: "center"}}><Link to={"/admin"}>retour</Link></h4>
        </div>
    )
}