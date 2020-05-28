import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import TagManager from 'react-gtm-module'

export const NotApproved = () => {
    //TAG MANAGER
    const tagManagerArgs = {
        dataLayer: {
            event: 'pageChange',
            page: {
                url: '/rejected',
                referrer: sessionStorage.getItem('utm') || '/'
            }
        },
        dataLayerName: 'dataLayer'
    }
    TagManager.dataLayer(tagManagerArgs)
    //TAG MANAGER
    return (
        <div className='app-container'>
            <div style={{textAlign: 'left', padding: '2rem'}} className='register-form-container-100'>
                <div style={{display: 'flex', alignContent: 'center'}}>
                    <div style={{margin: '1rem 1rem 0 0', padding: 0, fontWeight: 'bold', fontSize: '2.5rem'}}>
                        <FontAwesomeIcon style={{fontSize:'3rem', color: 'gray'}} icon={faTimesCircle}/>
                    </div>
                    <div>
                        <h1 style={{margin: '1rem 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Disculpa, lamentablemente no podemos ofrecerte</h1>
                        <h2 style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '3rem'}}>un préstamo en este momento</h2>
                    </div>
                </div>

                <p className='subtitle-denied'>Razones comunes por las cuales un crédito es rechazado:</p>
                <ul>
                    <li>No se pudo consultar tu historial crediticio</li>
                    <li>Tu nivel de endeudamiento es actualmente alto</li>
                    <li>Tienes adeudos pendientes con otras compañías</li>
                </ul>

                <p className='subtitle-denied'>Cosas que puedes hacer</p>
                <p style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '1rem'}}>
                    Es fundamental que revises tu historial crediticio. Verifica que tus datos personales sean correctos, especialmente tu RFC y domicilio. 
                    Asegúrate que todos los datos específicos sobre alguna deuda en el pasado estén actualizados
                </p>

                <p className='subtitle-denied'>Nos mantendremos en contacto</p>
                <p style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '1rem'}}>
                    Nos encantaría poder otorgarte un préstamo en el futuro. Si crees que esta respuesta es incorrecta, 
                    si tu situación cambia o sospechas que existe algún error en tu historial de crédito que puede ser aclarado con la institución que te reporta,
                    por favor contáctanos nuevamente y te atenderemos con gusto.
                </p>
                <div style={{marginTop: '2rem'}}>
                    <p style={{fontSize: '1rem'}}>Mucha suerte. El equipo de Vivus.com.mx</p>
                </div>
            </div>
        </div>
    )
}
