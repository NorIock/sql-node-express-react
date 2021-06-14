import React, { useState } from 'react';
import { Image } from 'cloudinary-react';

export default function ImageProduit(props){

    const [autreImage, setAutreImage] = useState(props.photoPrincipale);

    const {REACT_APP_CLOUDINARY_NAME} = process.env;

    return(
        <div style={{justifyContent : 'space-between', width: "300px", height: "100px", textAlign: "center", display: "table-cell", verticalAlign: "middle"}}>
            <div style={{display: "inline-flex"}}>
            <div style={{marginRight: "1%"}}>
                {props.photos.map(photo => (
                    <div 
                        key={photo.photo_id}
                        style={{justifyContent : 'space-between', cursor: 'pointer', border: '1px solid', marginBottom: "10%"}}
                        onMouseOver={()=>setAutreImage(photo.photo_id)}
                    >
                        {photo.hauteur >= photo.largeur ?
                            <Image
                            cloudName={REACT_APP_CLOUDINARY_NAME}
                            publicId={photo.public_id}
                            height="50"
                            crop="scale"
                        />
                        : 
                        photo.hauteur < photo.largeur ?
                            <Image
                                cloudName={REACT_APP_CLOUDINARY_NAME}
                                publicId={photo.public_id}
                                width='60'
                                crop="scale"
                            />
                        : null
                        }
                    </div>
                ))}
            </div> 
            {props.photos.map(grandePhoto => (
                <div 
                    key={grandePhoto.photo_id}
                    style={{justifyContent : 'space-between', display: "block"}}
                >
                    {grandePhoto.photo_id === autreImage &&
                        <>
                            {grandePhoto.hauteur >= grandePhoto.largeur ?
                                <Image
                                    cloudName={REACT_APP_CLOUDINARY_NAME}
                                    publicId={grandePhoto.public_id}
                                    height='500'
                                    crop="scale"
                                />
                            :
                            grandePhoto.hauteur < grandePhoto.largeur ?
                                <Image
                                    cloudName={REACT_APP_CLOUDINARY_NAME}
                                    publicId={grandePhoto.public_id}
                                    width='500'
                                    crop="scale"
                                />
                        : null
                        }
                        </>
                    }
                </div>
            ))}
            </div>
        </div>
    )
}