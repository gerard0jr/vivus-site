import React from 'react'
import './aboutUs.scss'
import { Link } from 'react-router-dom'
import TagManager from 'react-gtm-module'
 
const tagManagerArgs = {
    dataLayer: {
        event: 'pageChange',
        page: {
            url: '/us',
            referrer: sessionStorage.getItem('utm') || '/'
        }
    },
    dataLayerName: 'dataLayer'
}

export const AboutUs = () => {
    TagManager.dataLayer(tagManagerArgs)
    return (
        <div className='app-container-white'>
            <div className='first-block'>
                <div className='first-block-left'>
                    <h2>4finance S.A. de <br/> C.V. SOFOM E.N.R.</h2>
                    <p>El principal objetivo de 4finance SA de CV SOFOM E.N.R. es ofrecer a nuestros clientes una alternativa de financiamiento fácil, rápida y responsable al momento de cubrir imprevistos. 
                        Con esta visión en mente, trabajamos día a día para dar un trato excepcional a quienes confían en nosotros, siendo la transparencia nuestro principal pilar de servicio.</p>
                </div>
                <div className='first-block-right'>
                    <img src="/img/landing/isotipo.svg" alt="logo"/>
                </div>
            </div>
            <div className="second-block">
                <div className='second-block-title'>
                    Los principios que rigen nuestro trabajo son:
                </div>
                <div className="reasons-container-us">
                    <div className="about-features">
                        <div className='feature'>
                            <img src="/img/aboutUs/icon-people.svg" alt="percent"/>
                            <h2>Satisfacción del cliente</h2>
                            <p>Queremos resolver una necesidad de dinero urgente con la mayor rapidez, eficacia y buen trato.</p>
                        </div>
                        <div className='feature'>
                            <img src="/img/aboutUs/icon-thumbs.svg" alt="feat"/>
                            <h2>Transparencia</h2>
                            <p>Recuerda que nuestra tasa de interés siempre es visible, nuestros préstamos son sin comisiones, letras chiquitas o costos ocultos. El único requisito es pagarlo en un lapso de 1 a 3 meses.</p>
                        </div>
                        <div className='feature'>
                            <img src="/img/aboutUs/icon-shield.svg" alt="shield"/>
                            <h2>Responsabilidad</h2>
                            <p>Sugerimos a nuestros clientes que pidan un préstamo rápido, solo si es su mejor opción de financiamiento.</p>
                        </div>
                    </div>
                    {/* <div className="dotted-ball">
                        <img src="/img/dotted-ball.svg" alt="dotted"/>
                    </div> */}
                </div>
            </div>
            <div className='third-block'>
                <div className='third-block-left'>
                    <h2>¿Quiénes somos?</h2>
                    <p><span style={{color: '#A3CD3A'}}>4finance</span> comenzó su camino en México el 16 de noviembre del año 2015, siendo parte de una de las compañías líderes mundiales en micropréstamos.
                        <br/><br/>Actualmente 4finance Group ofrece servicios a clientes en 17 países: <span style={{color: '#A3CD3A'}}>Alemania</span>, 
                        <span style={{color: '#A3CD3A'}}> Polonia</span>, <span style={{color: '#A3CD3A'}}>Suecia</span>, <span style={{color: '#A3CD3A'}}>Dinamarca</span>, 
                        <span style={{color: '#A3CD3A'}}> Finlandia</span>, <span style={{color: '#A3CD3A'}}>República Checa</span>, <span style={{color: '#A3CD3A'}}>Bulgaria</span>, 
                        <span style={{color: '#A3CD3A'}}> Rumanía</span>, <span style={{color: '#A3CD3A'}}>Armenia</span>, <span style={{color: '#A3CD3A'}}>Georgia</span>, 
                        <span style={{color: '#A3CD3A'}}> Lituania</span>, <span style={{color: '#A3CD3A'}}>Letonia</span>, <span style={{color: '#A3CD3A'}}>España</span>, 
                        <span style={{color: '#A3CD3A'}}> México</span>, <span style={{color: '#A3CD3A'}}>Estados Unidos</span>, <span style={{color: '#A3CD3A'}}> Reino Unido</span> y 
                        <span style={{color: '#A3CD3A'}}> Argentina.</span>
                        <br/><br/>Al día de hoy, 4finance Group ha otorgado más de 11.5 millones de microcréditos en el mundo.</p>
                </div>
            </div>
            <div className='fourth-block'>
                <div className='bottom-info-content'>
                    <div className='wallet-block'>
                        <div className='wallet-block-left'>
                            <h2>¿Qué ofrecemos?</h2>
                            <p>
                                Vivus ofrece un préstamo rápido, eficaz y que se adapta a tu estilo de vida. El importe máximo de nuestros créditos es de $9,000 pesos para clientes existentes, con un plazo desde 1 hasta 3 meses.
                               <br/><br/>Pedir un préstamo Vivus es muy fácil: solamente es necesario llenar el formulario en línea y en instantes nosotros analizamos las solicitudes y respondemos. Todas las solicitudes están sujetas a los términos y condiciones de los préstamos.
                            </p>
                        </div>
                        <div className='wallet-block-right'>
                            <img src="/img/wallet.svg" alt="logo"/>
                        </div>
                    </div>
                </div>
                <div className='bottom-info-content'>
                    <div className='umbrella-block'>
                        <div className='umbrella-block-left'>
                            <h2>Las ventajas de Vivus</h2>
                            <p><img src='/img/bulletCheck.svg' alt='bullet'/>Nuestros préstamos son accesibles desde cualquier lugar de México, solo se requiere conexión a Internet.</p>
                            <p><img src='/img/bulletCheck.svg' alt='bullet'/>Nuestros servicios de transferencia están disponibles las 24 horas los 7 días de la semana (para clientes existentes).</p>
                            <p><img src='/img/bulletCheck.svg' alt='bullet'/>El registro es fácil y rápido. En menos de 5 minutos te damos una respuesta a tu solicitud.</p>
                            <p><img src='/img/bulletCheck.svg' alt='bullet'/>Los datos personales son totalmente confidenciales y son tratados con la máxima seguridad.</p>
                            <p><img src='/img/bulletCheck.svg' alt='bullet'/>El depósito se realiza a tu cuenta registrada en menos de 1 hora una vez aprobado.</p>
                        </div>
                        <div className='umbrella-block-right'>
                            <img src="/img/umbrella.svg" alt="logo"/>
                        </div>
                    </div>
                    {/* <div className="orange-ball">
                        <img src="/img/orange-ball.svg" alt="orange ball"/>
                    </div> */}
                </div>
                <div className='call-to-action goTo-about-us'>
                    <h2>Obtén tu primer préstamo con nosotros en menos de 30min.*</h2>
                    <p>Conoce desde el inicio cuanto debes pagar</p>
                    <Link to='/registration'><p className='cta-button'>SOLICÍTALO YA</p></Link>
                </div>
            </div>
        </div>
    )
}
