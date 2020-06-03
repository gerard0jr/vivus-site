import React from 'react'

export const Restructure = () => {
    return (
        <div style={{padding: '2rem 3rem'}}>
            <h2 style={{fontSize: '2rem', fontWeight: '300', margin: 0, textAlign: 'left'}}>¿No puedes realizar el pago el día de vencimiento?</h2>
            <h2 style={{fontSize: '2rem', fontWeight: '600', margin: 0, textAlign: 'left'}}>Te ofrecemos recorrer la fecha de pago de tu parcialidad</h2>
            <p style={{padding: '2rem 0', textAlign: 'left'}}>A veces las cosas no van de acuerdo a lo planeado y un poco de flexibilidad financiera puede realmente ayudar. Por eso te brindamos más tiempo para realizar tu pago, ofreciéndote mover la parcialidad correspondiente al final del plazo de tu crédito. Sólo ingresa a tu perfil en Vivus.com.mx y acepta términos y condiciones. Si tienes dudas, contáctanos en WhatsApp.</p>
            <div className='numbers-work'>
                <div>
                    <ol className='numbers-work'>
                        <li><p><strong>Considera lo siguiente al solicitar recorrer la fecha de pago de tu parcialidad:</strong><br/>- Tener pagada la primer parcialidad de tu préstamo<br/>- No haber utilizado este beneficio en tu parcialidad anterior</p></li>
                        <li><p><strong>Formas de pago:</strong><br/>El cargo se realizará directamente a la cuenta registrada en tu perfil Vivus sólo debes ingresar y solicitar esta opción o bien, para solicitarlo con nosotros vía WhatsApp comunícate al 55 67717 0750. Si tu cuenta presenta algún imprevisto</p></li>
                    </ol>
                </div>
            </div>
        </div>
    )
}
