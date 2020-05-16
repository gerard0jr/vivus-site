import React, { useEffect } from 'react'
import TagManager from 'react-gtm-module'
 
const tagManagerArgs = {
    dataLayer: {
        event: 'pageChange',
        page: {
            url: '/aviso-de-privacidad',
            referrer: sessionStorage.getItem('utm') || '/'
        }
    },
    dataLayerName: 'dataLayer'
}

export const AvisoDePrivacidad = () => {
    TagManager.dataLayer(tagManagerArgs)
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])
    return (
        <div className='app-container'>
            <div className='foot-ex-links-container'>
                <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: '300', fontSize: '3rem'}}>Aviso de Privacidad</h1>
                <div style={{borderBottom: '4px solid black', width: '140px', margin: '0rem 0 3rem'}}></div>
                <div style={{textAlign: 'center', marginBottom: '2rem'}}>
                    <p style={{textDecoration: 'underline'}}>AVISO DE PRIVACIDAD PARA CLIENTES O POSIBLES CLIENTES</p>
                </div>
                <p>
                    <strong>I. Responsable de los Datos personales.</strong>
                    <br/>
                    4finance, S.A. de C.V., SOFOM, E.N.R. (“efectiGO”), con domicilio en Avenida Insurgentes no. 1647, tercer
                    piso, interior 302, colonia San José Insurgentes, delegación Benito Juárez, México, Distrito Federal, C.P.
                    03900, es responsable del tratamiento de sus datos personales y de su protección. efectiGO, como
                    responsable del tratamiento de Datos Personales, garantiza su buen uso, protección y confidencialidad.
                    <br/>
                    <br/>
                    <strong>II. Datos Personales y/o Datos Personales Sensibles que se recaban del Titular y son sometidos a Tratamiento.</strong>
                    <br/>
                    Para las finalidades establecidas en el presente aviso de privacidad (“efectiGO”) podrá recabar los siguientes
                    Datos Personales de usted (el “Titular”): fotografía, nombre completo, domicilio particular, género, teléfono
                    fijo, teléfono celular, correo electrónico, nacionalidad e información migratoria (en su caso), lugar y fecha de
                    nacimiento, estado civil, Registro Federal de Contribuyentes (RFC), Clave Única de Registro de Población
                    (CURP), Clave del Instituto Mexicano del Seguro Social (IMSS), Créditos con el Instituto del Fondo Nacional
                    para la Vivienda de los Trabajadores (INFONAVIT), ocupación o actividad profesional (actual o anterior),
                    grados de estudio, y en su caso, número de Cédula Profesional expedida por la Secretaría de Educación
                    Pública (SEP), cuenta de Facebook, idiomas, referencias laborales, y personales, datos de familiares,
                    conocimiento y habilidades, así como datos económicos/financieros tales como: sueldo, ingreso familiar
                    total, cuentas bancarias, forma y fecha de pago de nómina, obtención de ingresos para pagar el préstamo; así
                    como preguntas generales tal como necesidad del préstamo y probabilidad o causas de incumplimiento; en
                    adelante y en su conjunto los “Datos Personales”. Asimismo efectiGO, podrá recabar Datos Personales
                    Sensibles, como estado de salud, tipo sanguíneo, preferencias sexuales, creencias religiosas, ideología
                    política, afiliación sindical, origen étnico y/o estrato socioeconómico (en adelante “Datos Personales
                    Sensibles”), de alguna de las siguientes formas: (i) cuando el Titular los proporcione al personal o
                    directamente; (ii) cuando efectiGO los obtenga de forma indirecta; y/o (iii) cuando se obtengan por efectiGO
                    a través de las fuentes permitidas por la legislación.
                    <br/>
                    El Titular podrá en cualquier momento limitar el acceso de efectiGO a su perfil de Facebook, o limitar la
                    información que comparte en Facebook. Por favor visite las políticas de privacidad de Facebook para tales
                    efectos.
                    <br/>
                    Los datos personales, económicos/financieros y sensibles recabados por efectiGO serán tratados para el
                    cumplimiento de las finalidades identificadas en el presente Aviso de Privacidad, para lo cual efectiGO
                    requiere su consentimiento expreso para el tratamiento de dichos datos, de conformidad con lo establecido
                    en el artículo 9° de la Ley Federal de Protección de Datos Personales en Posesión de Particulares (“LFPDPPP”).
                    <br/>
                    <br/>
                    <strong>III. Finalidades para las que se recaban los Datos Personales.</strong>
                    <br/>
                    Sus datos personales podrán ser utilizados por efectiGO para (i) gestión, control y administración de la
                    solicitud, obtención y, en su caso, otorgamiento del préstamo; (ii) gestión, control, y administración del cobro
                    judicial o extrajudicial de los servicios proporcionados por efectiGO; (iii) proporcionar al Titular los servicios
                    contratados; (iv) identificación del cliente; (v) dar cumplimiento a las obligaciones establecidas en las leyes
                    aplicables; (vi) evaluación de perfil de riesgo y capacidad crediticia del cliente; (vii) reportar el estado del
                    crédito; (viii) realizar recordatorios sobre pagos y adeudos del cliente; (ix) integración de expediente del
                    cliente; (x) otorgamiento de incentivos y/o recompensas a clientes; (xi) proporcionar servicios de atención al
                    cliente, tal como atención a quejas, dudas o asesoría, u otros similares; (xii) celebración de contratos de
                    crédito con el cliente; (xiii) publicidad y ofertas sobre productos o servicios relacionados con el crédito del
                    cliente; (xiv) analizar la manera en que el Titular hace uso de nuestros servicios y sitio web; y (xv) analizar la
                    utilidad de nuestra publicidad considerando, entre otros puntos, la manera en que el Titular tuvo
                    conocimiento de nuestros servicios.
                    <br/>
                    <br/>
                    <strong>IV. Transferencias de Datos Personales</strong>
                    <br/>
                    Sus Datos Personales y/o Datos Personales Sensibles podrán ser transferidos y tratados por personas
                    distintas de efectiGO , tales como: (i) Sociedades subsidiarias, afiliadas o controladoras de efectiGO con
                    finalidades de resguardo de la información, control de altas y bajas, cualquier cambio sobre su crédito; (ii)
                    terceros no relacionados (prestadores de servicios), con la finalidad exclusiva de asistir a efectiGO en la
                    ejecución de los servicios de crédito contratados y la exigibilidad de las obligaciones del acreditado bajo
                    dichos créditos, incluyendo requerimientos de pago y cobranza; (iii) cuando sea requerido por mandato
                    judicial de autoridades administrativas, judiciales o gubernamentales mexicanas o extranjeras de cualquier
                    índole; (iv) al subcontratar a terceros, encargados de procesar su información por cuenta y bajo instrucciones
                    de efectiGO, o de cualquiera de sus sociedades matrices o afiliadas; (v) Sociedades de Información Crediticia,
                    en el entendido de que dichos terceros asumen el compromiso de mantener dichos datos personales bajo
                    estricto orden confidencial, reconociendo además los términos y condiciones de este Aviso de Privacidad y se
                    comprometen a dar cumplimiento al mismo, y (vi) cualquier tercero persona física o moral que adquiera de
                    efectiGO, en todo o en parte, bajo cualquier vehículo legal, sus derechos y obligaciones derivados del crédito
                    contratado y/o los documentos que amparen o se relacionen con dichos créditos, incluyendo de manera
                    enunciativa mas no imitativa contratos, pagarés, recibos, y cualquier otra información o documento.
                    <br/>
                    Asimismo, efectiGO transmite Datos Personales relativos a (i) nombre, (ii) copia de identificación oficial, (iii)
                    Registro Federal de Contribuyentes (RFC), (iv) Clave Única de Registro de Población (CURP), y (vi) copia de
                    comprobante de domicilio a terceros a efecto de que se evalúe la capacidad crediticia. En términos del
                    artículo 68 del Reglamento de la Ley de Datos Personales y el artículo 36 de dicha la LFPDPPP, usted
                    consiente y autoriza expresamente cualquier transferencia de sus datos personales que efectiGO realice a sus
                    empresas relacionadas, subsidiarias, proveedores o consultores. Además, efectiGO garantiza que las
                    transferencias realizadas cumplirán en todo momento con lo dispuesto por los artículos 36 de la LFPDPPP y
                    68 del Reglamento de la LFPDPPP.
                    <br/>
                    <br/>
                    <strong>V. Derecho de Acceso, Rectificación, Cancelación, Oposición (ARCO)</strong>
                    <br/>
                    Usted tiene derecho de acceder, rectificar y cancelar sus datos personales, oponerse al tratamiento de los
                    mismos, limitar su uso o divulgación, o revocar el consentimiento que nos ha otorgado para el tratamiento de
                    sus datos (Estos derechos se conocen como derechos ARCO), enviando una solicitud al correo electrónico
                    une@efectigo.com.mx, Atención: Servicio a Clientes.
                    <br/>
                    Su solicitud deberá contener al menos la siguiente información: (i) nombre completo y correo electrónico o
                    domicilio para comunicarle la respuesta a su solicitud; (ii) los documentos que acrediten su identidad o, en su
                    caso, la representación legal; (iii) la descripción clara y precisa de los datos personales respecto de los que
                    busca ejercer alguno de los derechos antes mencionados; y (iv) cualquier otro elemento o documento que
                    facilite la localización de los datos personales. Su petición será atendida dentro del plazo permitido por la ley
                    y le informaremos sobre la procedencia de la misma a través del correo electrónico o domicilio que nos haya
                    proporcionado.
                    <br/>
                    En caso de que la información proporcionada en la solicitud sea insuficiente o errónea, o bien, no se
                    acompañen los documentos necesarios, dentro de los 5 (cinco) días hábiles siguientes a la recepción de la
                    solicitud, podremos requerirle que aporte los elementos o documentos necesarios para dar trámite a la
                    misma. Usted contará con 10 (diez) días hábiles para atender el requerimiento, contados a partir del día
                    siguiente en que lo haya recibido. De no dar respuesta en dicho plazo, se tendrá por no presentada la
                    solicitud correspondiente.
                    <br/>
                    Le comunicaremos la determinación adoptada en un plazo máximo de 20 (veinte) días hábiles contados
                    desde la fecha en que se recibió la solicitud (o, en su caso, desde el día siguiente en que usted haya atendido
                    el requerimiento de información), a efecto de que, si resulta procedente, se haga efectiva la misma dentro de
                    los 15 (quince) días hábiles siguientes a la fecha en que se comunique la respuesta. La respuesta se dará vía
                    electrónica a la dirección de correo que se especifique en su solicitud. Los plazos antes referidos únicamente
                    podrán ser ampliados de conformidad con la normatividad aplicable.
                    <br/>
                    <br/>
                    <strong>VI. Revocación</strong>
                    <br/>
                    Usted puede revocar el consentimiento que, en su caso, nos haya otorgado para el tratamiento de sus datos
                    personales en relación con las finalidades de tratamiento del presente Aviso de Privacidad. Sin embargo, es
                    importante que tenga en cuenta que no en todos los casos podremos atender su solicitud o concluir el uso de
                    forma inmediata, ya que es posible que por alguna obligación legal requiramos seguir tratando sus datos
                    personales. Asimismo, usted deberá considerar que para ciertos fines, la revocación de su consentimiento
                    implicará que no le podamos seguir prestando el servicio que nos solicitó, o la conclusión de su relación con
                    nosotros. Usted podrá revocar su consentimiento siguiendo el mismo procedimiento descrito anteriormente
                    relacionado con los derechos ARCO.
                    <br/>
                    <br/>
                    <strong>VII. Derecho de Limitar el Uso de los Datos Personales</strong>
                    <br/>
                    Usted también podrá ejercer su derecho de limitar el uso o divulgación de su información, por ejemplo, para
                    fines de mercadotecnia, siguiendo el mismo procedimiento descrito anteriormente relacionado con los
                    derechos ARCO.
                    <br/>
                    <br/>
                    <strong>VIII. Medios Automáticos para Recabar Datos Personales</strong>
                    <br/>
                    efectiGO utiliza cookies propias y de terceros con finalidades analíticas y publicitarias para mejorar su
                    experiencia de navegación en nuestro sitio web www.efectigo.com.mx. Si usted navega en nuestro sitio web
                    sin cambiar la configuración de cookies, consideraremos que acepta su instalación y uso conforme a nuestra
                    política de cookies. Sin embargo, si usted lo desea, puede cambiar la configuración de cookies en cualquier
                    momento.
                    <br/>
                    efectiGO podrá grabar cualquier conversación telefónica que Usted tenga con cualquiera de sus empleados,
                    representantes, agentes y subcontratistas.
                    <br/>
                    Contamos con las medidas de seguridad suficientes para la protección, confidencialidad y aseguramiento de
                    sus datos personales con la finalidad de restringir el acceso a los mismos a personas no autorizadas.
                    Asimismo, nuestros empleados, representantes, subcontratistas, consultores y/o los terceros que
                    intervengan en cualquier fase del tratamiento de sus datos personales guardaran confidencialidad respecto
                    de éstos, obligación que subsistirá hasta después de finalizar la relación entre dichas personas.
                    <br/>
                    <br/>
                    <strong>IX. Modificaciones al Aviso de Privacidad</strong>
                    <br/>
                    Cualquier modificación a este aviso de privacidad se la haremos llegar al último correo electrónico que haya
                    proporcionado a efectiGO.
                    <br/>
                    Al aceptar los términos de este aviso de privacidad, usted manifiesta su consentimiento expreso para que
                    efectiGO use, trate y transfiera sus Datos Personales y/o Datos Personales Sensibles para las finalidades aquí
                    previstas.
                    <br/>
                    <br/>
                    Fecha de última actualización: 13 de Noviembre de 2019
                </p>
            </div>
        </div>
    )
}
