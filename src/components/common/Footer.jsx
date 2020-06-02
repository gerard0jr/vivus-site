import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import Popup from "reactjs-popup"
import './popupFooter.css'

export const Footer = ({location}) => {
    const [popup, setPopup] = useState(false)

    return (
        <>
            <div className='footer-container'>
                <div className='left-footer'>
                    <img src="/img/footer/support.webp" alt="customer service"/>
                    <div className='chat-section'>
                        <h2><strong>¿Necesitas ayuda?</strong></h2>
                        <p>Contáctanos</p>
                        <p style={{fontSize: '0.9rem'}}>Por favor, si tienes alguna duda, ponte en contacto con nosotros.</p>
                    </div>
                </div>
                <div className='right-footer'>
                    <div className='contact-icons'>
                        <div className='contact-icon'>
                            <FontAwesomeIcon className='clickable' icon={faPhone}/> <br/>
                            <a href="tel:5567170750">(0155) 6717 0750</a>
                        </div>
                        <div className='contact-icon'>
                            <FontAwesomeIcon className='clickable' icon={faEnvelope}/> <br/>
                            <a href="mailto:info@vivus.com.mx">info@vivus.com.mx</a>
                        </div>
                    </div>
                    <div className='bussiness-hours'>
                        <p><strong>Nuestro horario de atención al cliente es:</strong></p>
                        <p>Lunes a Viernes de 8:00 a 20:00 y Sábados de 8:00 a 14:00</p>
                    </div>
                </div>
            </div>
            <div className='footer-links-container'>
                <Link to={location === 'manteinance' ? '#' : '/contenido/prestamos-en-linea'}>Préstamos en línea</Link>
                <Link to={location === 'manteinance' ? '#' : '/contenido/prestamos-online'}>Préstamos online</Link>
                <Link to={location === 'manteinance' ? '#' : '/contenido/prestamo-inmediato'}>Préstamo inmediato</Link>
                <Link to={location === 'manteinance' ? '#' : '/contenido/aviso-de-privacidad'}>Aviso de privacidad</Link>
                <Link to={location === 'manteinance' ? '#' : '/contenido/terminos-y-condiciones'}>Términos y Condiciones</Link>
                <a target='_blank' rel="noopener noreferrer" href='https://4finance.com'>© 4Finance Group</a>
                <img onClick={() => setPopup(true)} style={{cursor: 'pointer'}} width='50px' src="/img/logo-buro.png" alt="buro"/>
            </div>
            <div className='footer-popup'>
                <Popup onClose={() => setPopup(false)} open={popup} position="right center">
                    <>
                        <div className='f-popup-container'>
                            <div className='image-f-popup-container'>
                                <a style={{width: 'inherit'}} target='_blank' rel="noopener noreferrer" href='https://www.buro.gob.mx/'><img src="/img/buro.jpg" alt="buro"/></a>
                            </div>
                            <div className='text-f-popup-container'>
                                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <img width='150px' src="/img/navbar/logo-vivus-mexico.svg" alt="logo"/>
                                </div>
                                <h2>¿Qué es el Buró de Entidades Financieras?</h2>
                                <br/>
                                Es una herramienta de consulta y difusión con la que podrás conocer los productos que ofrecen las entidades financieras, sus comisiones y tasas, las reclamaciones de los usuarios, las prácticas no sanas en que incurren, las sanciones administrativas que les han impuesto, las cláusulas abusivas de sus contratos y otra información que resulte relevante para informarte sobre su desempeño.
                                <br/>
                                Con el Buró de Entidades Financieras, se logrará saber quién es quién en bancos, seguros, sociedades financieras de objeto múltiple, cajas de ahorro, afores, entre otras entidades.
                                <br/>
                                Con ello, podrás comparar y evaluar a las entidades financieras, sus productos y servicios y tendrás mayores elementos para elegir lo que más te convenga.
                                <br/>
                                Esta información te será útil para elegir un producto financiero y también para conocer y usar mejor los que ya tienes.
                                <br/>
                                Este Buró de Entidades Financieras, es una herramienta que puede contribuir al crecimiento económico del país, al promover la competencia entre las instituciones financieras; que impulsará la transparencia al revelar información a los usuarios sobre el desempeño de éstas y los productos que ofrecen y que va a facilitar un manejo responsable de los productos y servicios financieros al conocer a detalle sus características.
                                <br/>
                                Lo anterior, podrá derivar en un mayor bienestar social, porque al conjuntar en un solo espacio tan diversa información del sistema financiero, el usuario tendrá más elementos para optimizar su presupuesto, para mejorar sus finanzas personales, para utilizar correctamente los créditos que fortalecerán su economía y obtener los seguros que la protejan, entre otros aspectos.
                            </div>
                        </div>
                        <button onClick={() => setPopup(false)} className='btn-minimal-width'>Cerrar</button>
                    </>
                </Popup>
            </div>
        </>
    )
}
