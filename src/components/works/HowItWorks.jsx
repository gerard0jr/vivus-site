import React, { useState } from 'react'
import { Obtain } from './Obtain'
import { Restructure } from './Restructure'
import { AdditionalAmount } from './AdditionalAmount'
import { FAQ } from './FAQ'
import './works.scss'
import TagManager from 'react-gtm-module'
 
const tagManagerArgs = {
    dataLayer: {
        event: 'pageChange',
        page: {
            url: '/como-funciona',
            referrer: sessionStorage.getItem('utm') || '/'
        }
    },
    dataLayerName: 'dataLayer'
}

export const HowItWorks = () => {
    TagManager.dataLayer(tagManagerArgs)
    const [section, setSection] = useState(1)

    return (
        <div>
            <div className='works-button-nav'>
                <div className={section === 1 ? 'works-active' : null} onClick={() => setSection(1)}>¿Cómo puedo obtener un préstamo?</div>
                <div className={section === 2 ? 'works-active' : null} onClick={() => setSection(2)}>¿Cómo reestructuro el plazo de mi préstamo?</div>
                <div className={section === 3 ? 'works-active' : null} onClick={() => setSection(3)}>¿Cómo puedo obtener un monto adicional?</div>
                <div className={section === 4 ? 'works-active' : null} onClick={() => setSection(4)}>Preguntas frecuentes</div>
            </div>
            {section === 1 ? <Obtain/> :
                section === 2 ? <Restructure/> : 
                section === 3 ? <AdditionalAmount/> :
                section === 4 ? <FAQ/> :
                <Obtain/>
            }        
        </div>
    )
}
