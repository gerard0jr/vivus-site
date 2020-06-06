import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import TagManager from 'react-gtm-module'

export const PreApproved = () => {
    //TAG MANAGER
    const tagManagerArgs = {
        dataLayer: {
            event: 'pageChange',
            page: {
                url: '/application-complete',
                referrer: sessionStorage.getItem('utm') || '/'
            }
        },
        dataLayerName: 'dataLayer'
    }
    TagManager.dataLayer(tagManagerArgs)
    //TAG MANAGER
    return (
        <div className='app-container'>
            <div style={{textAlign: 'center', padding: '7rem 5rem'}} className='register-form-container-100'>
                <div style={{display: 'flex', justifyContent: 'center', alignContent: 'center'}}>
                    <div style={{margin: '1rem 0 0 1rem', padding: 0, fontWeight: 'bold', fontSize: '2.5rem'}}>
                        <FontAwesomeIcon style={{fontSize:'3rem', color: '#93d500'}} icon={faCheck}/>
                    </div>
                    <h1 style={{margin: '1rem 0 0 1rem', padding: 0, fontWeight: 'bold', fontSize: '2.5rem'}}>Tu dinero está en camino</h1>
                </div>
                <h2 style={{margin: '2rem 0 0', padding: 0, fontWeight: 200, fontSize: '2rem'}}>
                    En cuanto depositemos el dinero a tu cuenta, podrás acceder al administrador de tu préstamo iniciando sesión en la plataforma
                </h2>
            </div>
        </div>
    )
}
