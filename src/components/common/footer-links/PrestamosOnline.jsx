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
            url: '/prestamos-online',
            referrer: sessionStorage.getItem('utm') || '/'
        }
    },
    dataLayerName: 'dataLayer'
}

export const PrestamosOnline = () => {
    TagManager.dataLayer(tagManagerArgs)
    const [showText, setShowText] = useState(false)
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])
    return (
        <div className='app-container'>
            <div className='foot-ex-links-container'>
                <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '3rem'}}>¡El préstamo online que necesitas!</h1>
                <div style={{borderBottom: '4px solid black', width: '140px', margin: '0rem 0 3rem'}}></div>
                <p>Seguro, rápido y sin salir de casa. Puedes solicitar desde de tu computadora o dispositivo móvil.</p>
                <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '2rem'}}>¿Qué debes hacer para obtener tu préstamo en línea?</h1>
                <ol className='numbers-footer'>
                    <li><strong>Llena la solicitud</strong><p>Incluye toda la información personal requerida. No te preocupes, protegeremos tus datos.</p></li>
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
                <p>Puedes reestructurar tu préstamo y con ello recorrer tu fecha de pago. Sólo ingresa a tu perfil en Vivus.com.mx para seleccionar la reestructura de tu preferencia y acepta los términos y condiciones. Puedes solicitar ayuda a un asesor de Servicio al Cliente llamando al (0155) 6717 0750. Te atendemos de lunes a viernes de 8:00 a 20:00 horas o los sábados de 08:00 a 14:00 horas.</p>
            </div>
            <div class="get-loan-nobg">
                <Link to='/registration' class="cta-button" >SOLICÍTALO YA</Link>
            </div>
            <div style={{marginTop: '2rem', backgroundColor: '#eceef2'}} className='terms-container'>
                {showText ? null : <div className='shadow-gray'></div>}
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
                        <span class="bold-type type-up"> *Clientes Nuevos:</span> Sólo aplica para pago oportuno del primer préstamo. Sujeto a aprobación del préstamo. En caso de 
                        requerir el servicio de reestructura del préstamo, aplicará el pago correspondiente por dicho servicio. Interés mensual ordinario aplicable es de 
                        <span class="bold-type type-up"> 17.50%</span> más el IVA. Por defecto, la tasa de interés anual fija es de <span class="bold-type type-up"> 210%</span> 
                        más el IVA. O un <span class="bold-type type-up"> Costo Anual Total (CAT)</span> PROMEDIO:<span class="bold-type type-up"> 592.56%</span> sin IVA por 
                        $6,000 M.N. calculado sobre un préstamo de 30 días. Solamente para información y fines comparativos.
                    </p>
                    <p>
                        <span class="bold-type type-up">Clientes Existentes:</span> la tasa de interés mensual ordinaria aplicable es de <span class="bold-type type-up">  35%</span> 
                        más el IVA. Por defecto, la tasa de interés anual fija es de <span class="bold-type type-up"> 420%</span> más el IVA. O un 
                        <span class="bold-type type-up"> Costo Anual Total (CAT)</span> PROMEDIO: <span class="bold-type type-up"> 3564.4%</span> sin IVA por $6,000 M.N. 
                        calculado sobre un préstamo de 30 días. Solamente para información y fines comparativos.
                    </p>
                    <p>
                        Entre las implicaciones que podrían resultar de la falta de pago están: (1) Intereses moratorios a una tasa anual fija de 
                        <span class="bold-type type-up"> 540%</span> equivalente al <span class="bold-type type-up">1.5%</span> diario, (2) Gestiones de cobranza al 
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
        </div>
    )
}
