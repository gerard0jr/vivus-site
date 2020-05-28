import React from 'react'
import './common.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faYoutube, faFacebookF } from '@fortawesome/free-brands-svg-icons'

export const Social = ({location}) => {

    const scrollBottom = () => {
        window.scrollTo(0, document.body.scrollHeight)
    }

    return (
        <div className='social'>
            <a className='whatsapp' rel="noopener noreferrer" target='_blank' href='https://api.whatsapp.com/send?phone=525579064344&text=Hola%20Vivus%20hoy%20necesito%20su%20ayuda&source=&data='><img src="/img/whatsapp.png" alt="whatsapp"/></a>
            <div className="quick-contacts-content">
                <ul>
                    <li>
                        <FontAwesomeIcon onClick={scrollBottom} className='clickable' icon={faPhone}/>
                    </li>
                    <li>
                        <FontAwesomeIcon onClick={scrollBottom} className='clickable' icon={faEnvelope}/>
                    </li>
                    <li>
                        <a target='_blank' rel="noopener noreferrer" href='https://www.facebook.com/Vivus4finance'><FontAwesomeIcon onClick={scrollBottom} className='clickable' icon={faFacebookF}/></a>
                    </li>
                    <li style={{border: 'none'}}>
                        <a target='_blank' rel="noopener noreferrer" href='https://www.youtube.com/channel/UCRQsy4zv4Qsb1IdcOaLEICw'><FontAwesomeIcon onClick={scrollBottom} className='clickable' icon={faYoutube}/></a>
                    </li>
                </ul>
            </div>
        </div>
    )
}
