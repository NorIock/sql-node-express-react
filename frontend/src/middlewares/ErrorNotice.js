import React from 'react';

export default function ErrorNotice(props){

    return(
        <div className= "error-notice"  style={{whiteSpace: "pre-wrap"}}>
            <span>{props.message}</span>
            <button onClick={props.clearError}>X</button>
        </div>
    )
}