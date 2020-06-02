import React, { useState, useEffect } from 'react'
import Calculator from '../calculator/Calculator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp, faTimes } from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'
import './landing.scss'
import TagManager from 'react-gtm-module'
import { momentEs } from '../../services/moment'
import cookie from 'react-cookies'
import { RatingCarousel } from './RatingCarousel'
import { VideoCarousel } from './VideoCarousel'
 


export const Home = (props) => {

    const [popup, setPopup] = useState(false)

    const [showText, setShowText] = useState(false)
    const [tempScreen, setTempScreen] = useState(null)

    useEffect(() => {
        if(props.location.search === '') sessionStorage.setItem('utm', '/')
        else sessionStorage.setItem('utm', props.location.search)
        const tagManagerArgs = {
            dataLayer: {
                event: 'pageChange',
                page: {
                    url: '/',
                    referrer: sessionStorage.getItem('utm') || '/'
                }
            },
            dataLayerName: 'dataLayer'
        }
        TagManager.dataLayer(tagManagerArgs)
    }, [])

    useEffect(() => {
        let startDate   = momentEs("01/04/2020", "DD/MM/YYYY")
        let endDate     = momentEs("30/04/2020", "DD/MM/YYYY")
        if(momentEs().isBetween(startDate, endDate)) return setTempScreen(true)
        return setTempScreen(false)
    }, [])

    useEffect(() => {
        const limiter = async () => {
            let popuped = await cookie.load('popuped')
            if(!popuped){
                cookie.save('popuped', 'true', {maxAge: 60 * 60 * 24})
                return setTimeout(() => setPopup(true), 3000)
            }
            return
        }
        // limiter()
    }, [])

    return (
        <div className='home'>
            {popup ? 
                <div className='popup'>
                    <div className='popup-container'>
                        <div className='close-button' onClick={() => setPopup(false)}><FontAwesomeIcon icon={faTimes}/> </div>
                        <h2>En <span>VIVUS</span><br/>estamos de tu lado.</h2>
                        <div className='popup-rectangle'>
                            <p>Si tienes un <span>préstamo</span> y necesitas apoyo,
                            podemos brindarte una <span>opción personalizada</span></p>
                        </div>
                        <div className='popup-button'>
                            <a href="https://bit.ly/2xDkmts" target='_blank' rel="noopener noreferrer">
                                Da click para más información
                            </a>
                        </div>
                    </div>
                </div>
            :
                null
            }
            <div className='calculator-container' style={tempScreen ? {backgroundImage: 'url(/img/landing/cover-abril.jpg)'} : tempScreen === false ? {backgroundImage: 'url(/img/landing/landing.jpg)'} : {backgroundColor: 'white'}}>
                <Calculator style={{marginTop: '-5rem'}}/>
                {!tempScreen ? 
                    null
                    :
                    <div className="title-wrap abril">
                        <p className="first-title">Tu préstamo</p>
                        <p className='second-title'>efectivo y rápido</p>
                    </div>
                }
            </div>

            {/* <div className="home-features">
                <div className='feature'>
                    <img src="/img/time.svg" alt="vivus time"/>
                    <h2>Rápido y sin tanto rollo</h2>
                    <p>Solicita por internet en minutos y recíbelo en tu cuenta en menos de 1 hora.*</p>
                </div>
                <div className='feature'>
                    <img src="/img/lock.svg" alt="vivus lock"/>
                    <h2>Seguro y transparente</h2>
                    <p>Escoges el monto y periodicidad de pago, así como el tiempo. Sin costos ocultos. Tu información está protegida.</p>
                </div>
                <div className='feature'>
                    <img src="/img/id.svg" alt="vivus id"/>
                    <h2>Requisitos Simples</h2>
                    <p>
                        - Ser mexicano(a)
                        <br/>- Tener entre 20 y 65 años 
                        <br/>- Recibo de nómina timbrado por el SAT más reciente, estado de cuenta o bien, declaración de impuestos.
                        <br/>- Contar con tu credencial del INE vigente, ¡es lo único!. 
                        <br/>Si tu INE no tiene dirección, te solicitaremos comprobante de domicilio (Luz, agua o teléfono con antigüedad no mayor a 3 meses).
                    </p>
                </div>
            </div> */}
            <div className="reasons-container">
                <div className='left-reasons'>
                    <div className='reasons-title'>¿Cómo funciona?</div>
                    <div className="como-vivus-points">
                        <ul>
                            <li>
                                <span className="como-vivus-span"><strong>1</strong></span>
                                <strong className="bold-title">Completa tu solicitud</strong>
                                <p>Llena la solicitud con tu información personal y financiera, te tomará pocos minutos. </p>
                            </li>
                            <li>
                                <span className="como-vivus-span"><strong>2</strong></span>
                                <strong className="bold-title">Confirma tu identidad</strong>
                                <p>Te pediremos que nos envíes una foto de tu Credencial para Votar expedida por el INE y cualquiera de los siguientes documentos: tu último recibo de nómina timbrado por el Servicio de Administración Tributaria (SAT), algún estado de cuenta reciente o tu declaración de impuestos.</p>
                            </li>
                            <li>
                                <span className="como-vivus-span"><strong>3</strong></span>
                                <strong className="bold-title">Recibe tu dinero</strong>
                                <p>Una vez aprobada tu solicitud, recibirás el préstamo en tu cuenta en menos de 1 hora.*</p>
                            </li>
                            <li className='span-last'>
                                <span className="como-vivus-span"><strong>4</strong></span>
                                <strong className="bold-title">Paga tu préstamo</strong>
                                <p className="como-p">Recibirás un recordatorio de pago antes de la fecha de tu vencimiento. Pagar es muy fácil y hay muchas opciones, </p>
                                <div className="popup-link">
                                    <p data-tip="1. En tiendas OXXO - Ingresa a tu perfil vivus, crea un número de referencia para pago total o de parcialidad y paga con él en OXXO bajo la modalidad OXXO Pay. <br/> 2. Con tu tarjeta de débito - Ingresa a tu perfil vivus y paga total o parcialmente usando tu tarjeta de débito. <br/>3. Pago en cuenta bancaria - Realiza deposito en cuenta bancaria a la cuenta de CI Banco 1633635, a nombre de INTEGRATED MANAGEMENT SERVICES MEXICO SA DE CV.<br/> No olvides poner tu número de crédito y nombre en la referencia." 
                                    style={{color: '#A3CD3A'}}>
                                        conócelas aquí
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className='right-reasons'>
                    <div className='home-reasons'>
                        <div className='reasons-isotipo'>
                            <img src="/img/landing/isotipo.svg" alt="isotipo"/>
                        </div>
                        <div className='reason'>
                            <img src="/img/efectigo-percent.svg" alt="percent"/>
                            <div className='reason-description'>
                                <p className='reason-title'>Flexibilidad</p>
                                <p>Si necesitas dinero adicional en tu préstamo, o quieres recorrer la fecha de pago de tu parcialidad, con vivus es fácil hacerlo.</p>
                            </div>
                        </div>
                        <div className='reason'>
                            <img src="/img/efectigo-check.svg" alt="percent"/>
                            <div className='reason-description'>
                                <p className='reason-title'>Empresa confiable</p>
                                <p>Millones de personas ya utilizan nuestros servicios. Somos una de las empresas de préstamos más reconocidas en el mundo.</p>
                            </div>
                        </div>
                        <div className='reason'>
                            <img src="/img/efectigo-head.svg" alt="percent"/>
                            <div className='reason-description'>
                                <p className='reason-title'>Soporte local</p>
                                <p>¡Lo más importante en vivus eres tú! Por lo que nuestro equipo está siempre listo para ayudarte.</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="dotted-ball">
                    <img src="/img/dotted-ball.svg" alt="dotted"/>
                </div> */}
                {/* <div className="green-ball">
                    <img src="/img/green-ball.svg" alt="dotted"/>
                </div>   */}
            </div>

            <div className='rating-container'>
                <h2>Más de 175,000 préstamos</h2>
                <h3>Aprobados en México</h3>
                <RatingCarousel/>
                <p>Comentarios de clientes en eKomi</p>
            </div>

            <VideoCarousel/>

            <div className='call-to-action'>
                <h2>Obtén tu primer préstamo con 50% de descuento.*</h2>
                <p>Conoce desde el inicio cuanto debes pagar</p>
                <Link to='/registration'><p className='cta-button'>SOLICÍTALO YA</p></Link>
            </div>

            <div className='terms-container'>
                {showText ? null : <div className='shadow'></div>}
                <div className={showText ? 'home-terms' : 'home-terms-collapsed'}>
                    <p>VIVUS es una marca protegida y registrada bajo las leyes mexicanas. Todos los derechos reservados.</p>
                    <p>
                        Recuerda que VIVUS no opera con intermediarios y que la solicitud de tu crédito debes llevarla a cabo de manera personal de conformidad con nuestros 
                        Términos y Condiciones, así como con las leyes y reglamentos aplicables, por lo que nos deslindamos expresamente de cualquier responsabilidad derivada
                        de una solicitud realizada en incumplimiento a lo anterior incluyendo, sin limitar, que un tercero solicite un crédito a tu nombre.
                    </p>
                    <p>
                        4Finance, S.A. de C.V., SOFOM, E.N.R., se encuentra en Avenida Insurgentes Sur, no. 1647, interior 302, Piso 3, Col. San José Insurgentes, C.P. 03900,
                        Benito Juárez, Distrito Federal. Para mayor información, contactar a une@vivus.com.mx. Según las normas aplicables a 4finance, S.A. de C.V., SOFOM,
                        E.N.R., No requiere de autorización de la Secretaria de Hacienda y Crédito Público para organizarse y operar como una Sociedad Financiera de Objeto 
                        Múltiple, Entidad No Regulada, y está sujeta a la supervisión de la Comisión Nacional Bancaria y de Valores únicamente para efectos del artículo 56 
                        de la Ley General de Organizaciones y Actividades Auxiliares del Crédito.
                    </p>
                    <p>
                        El plazo del crédito quedará establecido conforme a lo pactado entre el cliente y 4Finance, el cual puede variar entre 7 y 30 días. Los créditos
                        personales podrán ser adquiridos en toda la República Mexicana. No existen comisiones. No existen renovaciones automáticas de créditos. Cualquier 
                        préstamo o monto adicional otorgado por 4Finance deberá ser solicitado por el cliente, quien deberá aceptar explícitamente las condiciones de montos y 
                        plazos previamente.
                    </p>
                    <p>
                        <span className="bold-type type-up"> *Clientes Nuevos:</span> Sólo aplica para pago oportuno del primer préstamo. Sujeto a aprobación del préstamo. En caso de 
                        requerir el servicio de reestructura del préstamo, aplicará el pago correspondiente por dicho servicio. Interés mensual ordinario aplicable es de 
                        <span className="bold-type type-up"> 17.50%</span> más el IVA. Por defecto, la tasa de interés anual fija es de <span className="bold-type type-up"> 210%</span> 
                        más el IVA. O un <span className="bold-type type-up"> Costo Anual Total (CAT)</span> PROMEDIO:<span className="bold-type type-up"> 592.56%</span> sin IVA por 
                        $6,000 M.N. calculado sobre un préstamo de 30 días. Solamente para información y fines comparativos.
                    </p>
                    <p>
                        <span className="bold-type type-up">Clientes Existentes:</span> la tasa de interés mensual ordinaria aplicable es de <span className="bold-type type-up">  35%</span> 
                        más el IVA. Por defecto, la tasa de interés anual fija es de <span className="bold-type type-up"> 420%</span> más el IVA. O un 
                        <span className="bold-type type-up"> Costo Anual Total (CAT)</span> PROMEDIO: <span className="bold-type type-up"> 3564.4%</span> sin IVA por $6,000 M.N. 
                        calculado sobre un préstamo de 30 días. Solamente para información y fines comparativos.
                    </p>
                    <p>
                        Entre las implicaciones que podrían resultar de la falta de pago están: (1) Intereses moratorios a una tasa anual fija de 
                        <span className="bold-type type-up"> 540%</span> equivalente al <span className="bold-type type-up">1.5%</span> diario, (2) Gestiones de cobranza al 
                        teléfono y domicilio del cliente, (3) Afectación del historial de crédito, (4) Implicaciones legales derivadas del incumplimiento del contrato.
                    </p>
                    <p>
                        El Buró de Entidades Financieras es una herramienta de consulta y difusión con la que podrás conocer los productos que ofrecen las entidades financieras, 
                        sus comisiones y tasas, las reclamaciones de los usuarios, las prácticas no sanas en que incurren, las sanciones administrativas que les han impuesto, 
                        las cláusulas abusivas de sus contratos y otra información que resulte relevante para informarte sobre su desempeño. Con el Buró de Entidades Financieras, 
                        se logrará saber quién es quién en bancos, seguros, sociedades financieras de objeto múltiple, cajas de ahorro, afores, entre otras entidades. Con ello, 
                        podrás comparar y evaluar a las entidades financieras, sus productos y servicios y tendrás mayores elementos para elegir lo que más te convenga. 
                        Esta información te será útil para elegir un producto financiero y también para conocer y usar mejor los que ya tienes. Este Buró de Entidades Financieras,
                        es una herramienta que puede contribuir al crecimiento económico del país, al promover la competencia entre las instituciones financieras; que impulsará 
                        la transparencia al revelar información a los usuarios sobre el desempeño de éstas y los productos que ofrecen y que 
                        va a facilitar un manejo responsable de los productos y servicios financieros al conocer a detalle sus características.
                    </p>
                </div>

                <p style={{cursor: 'pointer', textAlign: 'center', fontSize: '1rem', color: '#959595'}} onClick={() => setShowText(!showText)}>{showText ? 'OCULTAR' : 'MOSTRAR'} TODO</p>
                {showText ? <FontAwesomeIcon icon={faChevronUp} style={{color: '#959595'}}/> : <FontAwesomeIcon icon={faChevronDown} style={{color: '#959595'}}/>}

            </div>
            <ReactTooltip style={{backgroundColor: 'white'}} place="bottom" type="light" html={true} effect="solid"/>
        </div>
    )
}
