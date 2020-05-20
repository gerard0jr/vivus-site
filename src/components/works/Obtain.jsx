import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

export const Obtain = () => {
    return (
        <div>
            <h2 style={{fontSize: '2rem', fontWeight: '300'}}>¡Tres sencillos pasos para disponer del dinero en tu cuenta de la manera más conveniente!</h2>
            <ol className='numbers-work'>
                <li><p><strong>Elige el monto, periodicidad de pago y plazo en el simulador, luego presiona “SOLICITALO YA”</strong></p></li>
                <li><p><strong>Continúa llenando el formulario de registro. </strong>¡No te preocupes! Te vamos a hacer varias preguntas respecto a tu información personal y bancaria. Esta información es sumamente importante para poder brindarte el préstamo de forma rápida y segura. Toda la información es confidencial y sólo será utilizada para validar tu préstamo.</p></li>
                <li><p>Luego de brindar toda la información solicitada, <strong>espera unos momentos por nuestra confirmación.</strong> Si la solicitud es aprobada, serás informado en tu perfil en Vivus.com.mx y también mediante un correo electrónico y mensaje de texto. El dinero solicitado será transferido a tu cuenta bancaria o en efectivo a la brevedad.</p></li>
            </ol>
            <hr style={{width: '80%', border: '0.5px solid #737373', margin: '2rem auto'}}/>
            <div className="note">
                <div className='note-left'>
                    <FontAwesomeIcon icon={faExclamationCircle}/>
                </div>
                <div className='note-right'>
                    Si ya estás registrado previamente en Vivus.com.mx <Link to='/login' style={{color:'#A3CD3A'}}>Ingresar</Link> en tu perfil utilizando tu correo electrónico, contraseña y respetando las guías disponibles para solicitar tu préstamo por primera vez o préstamos subsecuentes. <br/> Si ya tienes un préstamo con nosotros, te podemos ofrecer un monto adicional o recorrer la fecha de pago de tu parcialidad.
                </div>
            </div>
        </div>
    )
}
