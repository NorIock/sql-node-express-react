import React from 'react';

// Dans cette fonction, la valeur que l'on transmet en e.target.value est le champs
const DropdownMenuValueChamps = ({ onChange, donneesMap, valeurDefaut, largeur, margeGauche }) => {

    // donneesMap est ce que l'on récupère (les différents champs du dropdown que l'on souhaite mapper)
    // Je donne l'id à value afin de faire plus facilement la jonction entre les tables pour les relation one to one, one to many
    // ou many to many, cela évite de faire faire une requête supplémentaire pour récupérer l'id à partir du nom
    let optionItems = donneesMap.map((donnee => 
        <option key={donnee.id} value={donnee.champs}>{donnee.champs}</option>
    ));

    return (
        <select 
            className="form-control"
            onChange={onChange}
            defaultValue={valeurDefaut}
            style={{width: largeur, marginLeft: margeGauche}}
        >
            <option>Choisir</option>
            {optionItems}
        </select>

    )
};

export default DropdownMenuValueChamps;