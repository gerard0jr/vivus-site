import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './footerStyles.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import TagManager from 'react-gtm-module'
 
const tagManagerArgs = {
    dataLayer: {
        event: 'pageChange',
        page: {
            url: '/prestamos-en-linea',
            referrer: sessionStorage.getItem('utm') || '/'
        }
    },
    dataLayerName: 'dataLayer'
}

export const PrestamosEnLinea = () => {
    TagManager.dataLayer(tagManagerArgs)
    const [showText, setShowText] = useState(false)
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])
    return (
        <div className='app-container'>
            <div className='foot-ex-links-container'>
                <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '3rem'}}>¡Tu préstamo en línea sin tanto rollo!</h1>
                <div style={{borderBottom: '4px solid black', width: '140px', margin: '0rem 0 3rem'}}></div>
                <p>Olvídate de las filas, el papeleo y los trámites complicados.</p>
                <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '2rem'}}>¿Qué debes hacer para obtener tu préstamo en línea?</h1>
                <ol className='numbers-footer'>
                    <li><strong>Llena la solicitud</strong><p>Incluye todos los datos requeridos. Esto te tomará pocos minutos porque sólo te pedimos la información necesaria.</p></li>
                    <li><strong>Identifícate</strong><p>Envíanos una foto tuya y de tu credencial de elector para verificar tu identidad. Tus datos estarán protegidos.</p></li>
                    <li><strong>Recibe tu dinero</strong><p>Cuando tu solicitud se apruebe, el dinero será enviado en menos de una hora.</p></li>
                    <li><strong>Paga tu préstamo</strong><p>Antes de que llegue tu fecha límite de pago, recibirás un recordatorio.</p></li>
                </ol>
            </div>
            <section class="get-loan">
                <div class="page-content">
                    <Link to='/registration' class="cta-button" >SOLICÍTALO YA</Link>
                </div>
            </section>
            <div className='foot-ex-links-container'>
                <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '2rem'}}>¿Cuáles son los requisitos para solicitar un préstamo en línea?</h1>
                <ol className='numbers-footer'>
                    <li>Ser ciudadano mexicano.</li>
                    <li>Tener de 20 a 65 años.</li>
                    <li>Ser empleado o profesionista independiente con ingresos de manera regular.</li>
                    <li>Tener un teléfono celular y un correo electrónico.</li>
                    <li>Completar toda la información requerida en la solicitud de préstamo.</li>
                    <li>Elegir la forma de recibir tu dinero. En una cuenta bancaria o en efectivo.</li>
                </ol>
                <h1 style={{margin: '2rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '2rem'}}>¿Qué monto puedo solicitar?</h1>
                <p>Puedes solicitar un préstamo inmediato desde $3,000 pesos hasta un máximo de $9,000 pesos. El monto es determinado de manera individual, de acuerdo a un análisis personalizado. Esta información la encontrarás al ingresar a tu perfil</p>
                <h1 style={{margin: '2rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '2rem'}}>¿Cuáles son los plazos de préstamo disponibles para mí?</h1>
                <p>puedes solicitar uno de nuestros préstamos en línea por un plazo no menor a 1 mes, ni mayor a 3 meses.</p>
                <h1 style={{margin: '2rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '2rem'}}>¿Cómo puedo pagar mi préstamo?</h1>
                <p>Los préstamos en línea ofrecen varias opciones para liquidar tu deuda. A diferencia de los préstamos tradicionales en los que tienes que ir forzosamente al banco o a la institución financiera para pagar, con los préstamos en línea de bajo interés puedes elegir entre depositar a una cuenta bancaria, pagar en línea o hacer un pago en efectivo en cualquier tienda Oxxo. Tú escoges la opción con la que te sientas más cómodo.</p>
                <ol className='numbers-footer'>
                    <li>Depósito a una cuenta bancaria de Inbursa, CI Banco y BBVA.</li>
                    <li>Pago en línea con tu tarjeta de débito. Recibirás un enlace personalizado para que captures tus datos</li>
                    <li>En efectivo, a través de las tiendas Oxxo en todo el país. Únicamente debes acudir con el número de referencia que te hicimos llegar por email. El número de referencia solo puede usarse una vez.</li>
                </ol>
                <h1 style={{margin: '2rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '2rem'}}>¿Qué ocurre si no puedo pagar mi préstamo en la fecha límite?</h1>
                <p>Puedes reestructurar tu préstamo y con ello recorrer tu fecha de pago. Sólo ingresa a tu perfil en efectigo.com.mx para seleccionar la reestructura de tu preferencia y acepta los términos y condiciones. Puedes solicitar ayuda a un asesor de Servicio al Cliente llamando al (0155) 6717 0755. Te atendemos de lunes a viernes de 8:00 a 20:00 horas o los sábados de 08:00 a 14:00 horas.</p>
            </div>
            <div class="get-loan-nobg">
                <Link to='/registration' class="cta-button" >SOLICÍTALO YA</Link>
            </div>
            <div style={{marginTop: '2rem', backgroundColor: '#eceef2'}} className='terms-container'>
                {showText ? null : <div style={{backgroundImage: 'linear-gradient(transparent, #eceef2)'}} className='shadow'></div>}
                <div className={showText ? 'home-terms' : 'home-terms-collapsed'}>
                <p>
                        efectiGO es una marca protegida y registrada bajo las leyes mexicanas. Todos los derechos reservados.
                        <br/><br/>
                        Recuerda que efectiGO no opera con intermediarios y que la solicitud de tu crédito debes llevarla a cabo de
                        manera personal de conformidad con nuestros Términos y Condiciones, así como con las leyes y reglamentos
                        aplicables, por lo que nos deslindamos expresamente de cualquier responsabilidad derivada de una solicitud
                        realizada en incumplimiento a lo anterior incluyendo, sin limitar, que un tercero solicite un crédito a tu nombre.
                        <br/><br/>
                        4Finance, S.A. de C.V., SOFOM, E.N.R., se encuentra en Avenida Insurgentes Sur, no. 1647, interior 302,
                        Piso 3, Col. San José Insurgentes, C.P. 03900, Benito Juárez, Ciudad de México. Para mayor información,
                        contactar a une@efectiGO.com.mx. Según las normas aplicables a 4finance, S.A. de C.V., SOFOM, E.N.R.,
                        no requiere de autorización de la Secretaria de Hacienda y Crédito Público para organizarse y operar como
                        una Sociedad Financiera de Objeto Múltiple, Entidad No Regulada, y está sujeta a la supervisión de la
                        Comisión Nacional Bancaria y de Valores únicamente para efectos del artículo 56 de la Ley General de
                        Organizaciones y Actividades Auxiliares del Crédito.
                        <br/><br/>
                        El plazo del crédito quedará establecido conforme a lo pactado entre el cliente y 4Finance, el cual puede variar
                        de 1 mes a 3 meses. Los créditos personales podrán ser adquiridos en toda la República Mexicana. No
                        existen renovaciones automáticas de créditos. Cualquier préstamo o monto adicional otorgado por 4Finance
                        deberá ser solicitado por el cliente, quien deberá aceptar explícitamente las condiciones de montos y plazos
                        previamente.
                        <br/><br/>
                        *Sujeto a aprobación del préstamo. El tiempo de respuesta se computará a partir de que se complete el
                        proceso de solicitud del préstamo. Nuestro tiempo de respuesta será en un horario de 8:30 a 16:00 hrs de
                        Lunes a Viernes. No aplica en días festivos ni fines de semana. La tasa de interés mensual ordinaria aplicable
                        es de <strong style={{fontSize: '1.1rem'}}>15%</strong> más IVA. Por defecto, la tasa de interés anual fija es de <strong style={{fontSize: '1.1rem'}}>180%</strong> más IVA o un <strong>Costo Anual Total
                        (CAT)</strong> promedio <strong style={{fontSize: '1.1rem'}}>467.3%</strong> sin IVA por $3,000 pesos M.N. Calculado sobre un préstamo de 6 quincenas.
                        Solamente para información y fines comparativos. En caso de requerir el servicio de reestructura del préstamo,
                        aplicará el pago correspondiente por dicho servicio.
                        <br/><br/>
                        Entre las implicaciones que podrían resultar de la falta de pago están: (1) Intereses moratorios a una tasa
                        anual fija de <strong style={{fontSize: '1.1rem'}}>540%</strong> equivalente al <strong style={{fontSize: '1.1rem'}}>1.5%</strong> diario, (2) Gestiones de cobranza al teléfono y domicilio del cliente, (3)
                        Afectación del historial de crédito, (4) Implicaciones legales derivadas del incumplimiento del contrato.
                        <br/><br/>
                        El Buró de Entidades Financieras es una herramienta de consulta y difusión con la que podrás conocer los
                        productos que ofrecen las entidades financieras, sus comisiones y tasas, las reclamaciones de los usuarios,
                        las prácticas no sanas en que incurren, las sanciones administrativas que les han impuesto, las cláusulas
                        abusivas de sus contratos y otra información que resulte relevante para informarte sobre su desempeño. Con
                        el Buró de Entidades Financieras, se logrará saber quién es quién en bancos, seguros, sociedades financieras
                        de objeto múltiple, cajas de ahorro, afores, entre otras entidades. Con ello, podrás comparar y evaluar a las
                        entidades financieras, sus productos y servicios y tendrás mayores elementos para elegir lo que más te
                        convenga. Esta información te será útil para elegir un producto financiero y también para conocer y usar mejor
                        los que ya tienes. Este Buró de Entidades Financieras, es una herramienta que puede contribuir al crecimiento
                        económico del país, al promover la competencia entre las instituciones financieras; que impulsará la
                        transparencia al revelar información a los usuarios sobre el desempeño de éstas y los productos que ofrecen y
                        que va a facilitar un manejo responsable de los productos y servicios financieros al conocer a detalle sus
                        características.
                    </p> 
                </div>

                <p style={{cursor: 'pointer', textAlign: 'center', fontSize: '1rem', color: '#959595'}} onClick={() => setShowText(!showText)}>{showText ? 'OCULTAR' : 'MOSTRAR'} TODO</p>
                {showText ? <FontAwesomeIcon icon={faChevronUp} style={{color: '#959595'}}/> : <FontAwesomeIcon icon={faChevronDown} style={{color: '#959595'}}/>}

            </div>
        </div>
    )
}
