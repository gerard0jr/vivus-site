import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faServer, faTimes } from '@fortawesome/free-solid-svg-icons'

export const Error = () => {
    return (
        <div className='app-container'>
            <div className='error-page'>
                <h1>Oops...</h1>
                <div className='background-error-icon'>
                    <FontAwesomeIcon icon={faServer}/>
                    <span style={{fontSize: '3rem', marginLeft: '1rem'}}><FontAwesomeIcon icon={faTimes}/></span>
                </div>
                <h2>Ocurrió un problema en el servidor</h2>
                <h3>Por favor intenta más tarde</h3>
                <div className='return-error-button'>
                    <Link to='/'>Regresar a la página principal</Link>
                </div>
            </div>
        </div>
    )
}
