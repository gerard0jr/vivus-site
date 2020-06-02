import React from 'react'
import { AccordionFaq } from './AccordionFaq'

const questions = [
    '¿Cómo puedo solicitar un préstamo?',
    '¿Cuáles son los requisitos para solicitar un préstamo?',
    '¿Necesito presentar algún documento para obtener el préstamo?',
    '¿Qué monto puedo solicitar?',
    '¿Cuáles son los plazos de préstamo disponibles para mí?',
    '¿Qué hago si necesito más dinero?',
    '¿Cómo puedo recibir mi dinero?',
    '¿Por qué rechazaron mi solicitud?',
    '¿Cómo puedo ingresar a mi perfil personal de Vivus.com.mx?',
    '¿Qué debo hacer en caso de que olvide la contraseña?',
    '¿Cómo pagar mi préstamo?',
    '¿Puedo pagar mi préstamo antes del vencimiento?',
    '¿Qué puedo hacer si no puedo pagar mi préstamo en tiempo?',
    '¿Cómo puedo cambiar mi información personal?',
    '¿En cuanto tiempo dan respuesta a mi solicitud?',
    '¿Cómo debo enviar mi comprobante de ingresos?',
    '¿Por qué el monto adicional debe ser a un plazo de 3 meses?',
    '¿Con quién puedo hablar en caso de no encontrar respuestas a mis dudas?',
]

const answers = [
    'Si eres cliente nuevo da clic en Solicítalo Ya y completa la solicitud del préstamo. Una vez registrado para ingresar a tu perfil deberás seleccionar ¿Ya eres cliente?, elige el monto, periodicidad de pago, así como plazo de tu conveniencia y sigue las instrucciones. Cualquier duda, por favor, comunícate con nuestro Equipo de Servicio al Cliente mediante WhatsApp o bien, llamando al (0155) 6717 0750 de lunes a Viernes de 8:00-20:00 y Sábados de 8:00 a 14:00 o contáctanos en info@vivus.com.mx',
    'Para obtener el préstamo debes: 1) Ser ciudadano mexicano(a) 2) Tener de 20 a 65 años 3) Ser empleado, profesionista independiente o contar con ingreso regular  4) Tener un teléfono celular y un correo electrónico 5) Completar toda la información requerida en la solicitud de préstamo 6) Enviar la documentación solicitada.',
    'Debes subir las fotos (frente y reverso) de tu identificación oficial (IFE/INE), en formato de imagen, por favor no envíes PDF. Puedes hacerlo a través de tu perfil en el portal Vivus.com.mx, WhatsApp o bien, enviarla a documentos@Vivus.com.mx. En caso de que la Credencial de Elector no contenga la dirección, te solicitaremos un comprobante de domicilio (luz agua o teléfono no mayor a 3 meses). Por último, deberás enviarnos un recibo de nómina timbrado por el SAT más reciente, estado de cuenta o bien, declaración de impuestos.',
    'Puedes solicitar un préstamo desde 3,000 pesos y hasta un máximo de 9,000 pesos. El monto disponible es determinado en forma individual para cada uno de nuestros clientes. Puedes revisar tu límite de préstamo disponible ingresando a tu perfil en Vivus.com.mx',
    'Puedes solicitar un préstamo por un plazo de hasta 3 meses, pero no menor a 1 mes.',
    'Una vez que has solicitado tu préstamo puedes ingresar a tu perfil en Vivus.com.mx y solicitar un monto adicional siempre y cuando no sobrepases tu límite de crédito y tu primer parcialidad se encuentre cubierta. Si tu límite ha sido alcanzado debes realizar el pago de tu siguiente parcialidad antes de solicitar más dinero.',
    'Con Vivus puedes recibir tu dinero fácil y sencillo: Por transferencia, directamente a tu cuenta bancaria mediante el uso de CLABE o Número de tarjeta de débito. (Dinero disponible en minutos una vez aprobado el préstamo).',
    'Todas las solicitudes están sujetas a verificación. Cada solicitud debe cumplir con todos los requisitos siguiendo nuestras normas de crédito internas y externas. Tu solicitud fue rechazada posiblemente debido a que no cumplió con estos requisitos.',
    'Si ya eres cliente y ya tienes un perfil, haz clic en el botón ¿Ya eres cliente?, en la parte superior derecha de la página de inicio. Una vez ahí, sólo debes ingresar tu dirección de correo electrónico, contraseña y listo. Si eres cliente nuevo, selecciona el monto, periodicidad de pago y plazo que deseas solicitar en la calculadora Vivus y haz clic en el botón "Solicítalo ya", automáticamente serás direccionado a la página de Registro. Una vez ahí completa los campos necesarios para registrarte y crear tu perfil personal.',
    'En caso de que hayas olvidado tu contraseña, por favor haz clic en el enlace ¿Ya eres cliente?, en la esquina superior derecha de la página web. Después haz clic en el enlace "¿Olvidó su contraseña?" y sigue los pasos. Tu nueva contraseña temporal y las instrucciones sobre qué hacer a continuación serán enviados a tu dirección de correo electrónico. Toma en cuenta que la contraseña temporal tendrá una vigencia de sólo una semana. Por lo tanto, asegúrate de cambiarla desde tu perfil por una permanente. Por tu seguridad, la contraseña temporal no se puede utilizar cuando se toma un préstamo, ya que se debe cambiar a una contraseña permanente previamente.',
    `Tenemos estas opciones de pago para ti, disponibles desde tu perfil Vivus: Si lo tuyo es no hacer filas entonces tenemos la opción perfecta para ti. Al registrarte deberás ingresar una cuenta en la cual se depositará tu préstamo, al vencer tu parcialidad, nosotros tomaremos el monto a pagar directamente de esa misma cuenta. De esta forma te brindamos seguridad al realizar tu pago correspondiente. Si tu cuenta presenta algún inconveniente, contamos con otras opciones de pago. Puedes conocerlas en tu perfil o bien, contacta a nuestro equipo de Servicio al Cliente.`,
    'Si, puedes pagarlo en cualquier momento antes del vencimiento del plazo, sin ninguna penalización y cubriendo sólo los intereses devengados hasta ese momento.',
    'Si crees que necesitas más tiempo para pagar tu préstamo, por favor, ingresa a tu perfil en Vivus.com.mx y consulta la opción de recorrer la fecha de pago de tu parcialidad, solo si tu primer parcialidad se encuentra pagada y no hayas utilizado este beneficio en tu parcialidad anterior.',
    'Ingresa a tu perfil en Vivus.com.mx y solicita el cambio de la información que necesites. Por seguridad, te haremos llegar un código PIN a tu correo o celular a fin de validar cualquier cambio. ',
    'Si tu solicitud fue pre aprobada y la información que registraste, así como los documentos que nos envías son correctos y cumplen con las características requeridas, ¡te damos respuesta en minutos!',
    'El comprobante de ingresos debe estar timbrado por el SAT y no debe ser mayor a 3 meses, si no cuentas con alguno, también puedes enviarnos un estado de cuenta o bien, declaración de impuestos de los últimos 3 meses.',
    'Para VIVUS es muy importante cuidar de tu economía, por ese motivo solicitamos que  el monto adicional se pague a un plazo de 3 meses y de esta manera evitar que excedas tu capacidad de pago. No te preocupes, puedes liquidar anticipadamente y no tendrás ninguna penalización o inconveniente al solicitar tu siguiente préstamo.',
    'Puedes contactar a nuestro Equipo de Servicio al Cliente llamando al (0155) 6717 0750 de Lunes a Viernes de 8:00 -20:00 hrs. o los Sábados de 8:00 a 14:00 hrs.'
]

export const FAQ = () => {
    return (
        <div style={{padding: '2rem 3rem'}}>
            <h2 style={{fontSize: '2rem', fontWeight: '300', margin: 0, textAlign: 'left'}}>Preguntas Frecuentes</h2>
            <div className="accordion-faq">
                {questions.map((question, index) => <AccordionFaq question={question} answer={answers[index]} key={index}/>)}
            </div>    
        </div>
    )
}
