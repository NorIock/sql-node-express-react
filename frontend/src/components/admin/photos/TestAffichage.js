import React, { useState, useEffect } from 'react';
import { Image } from 'cloudinary-react';

import Requete from '../../../middlewares/Requete';

export default function AfficherImagesCloudinary(props){

    const [imageIds, setImageIds] = useState();

    useEffect(()=>{
        async function fetchImage(){
            const result = await Requete.get(
                "/image/afficher"
            );
            setImageIds(result.data);
        }
        fetchImage();
    }, [props.toChild]);

    return(
        <div style={{marginTop: "80px"}}>
            <h3>Dans la page pour afficher les images de cloudinary</h3>
            {imageIds &&
                imageIds.map(imageId => (
                    <div key={imageId.id} style={{display: "inline-flex", justifyContent : 'space-between'}}>
                        <Image
                            cloudName="norlock"
                            publicId={imageId.public_id}
                            width='300'
                            crop="scale"
                        />
                    </div>
                ))
            }
        </div>
    )
}