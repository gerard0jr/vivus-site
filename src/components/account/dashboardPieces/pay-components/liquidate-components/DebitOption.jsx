import React from 'react'

const DebitOption = () => {
    return (
        <div>
            <p>Por favor presiona el botón de abajo y serás redirigido a la plataforma de pago. Ahí deberás llenar toda la información requerida y podrás hacer tu pago</p>
            <p>La seguridad de tu información está garantizada</p>
            <div className='flex-distributed'>
                <img width='100' src="/img/mastercard.svg" alt="mastercard"/>
                <img width='100' src="/img/visa.png" alt="visa"/>
            </div>
            <p className='btn-minimal-width' style={{width: '80%', fontSize: '1.6rem', margin: '0 auto'}}><a rel="noopener noreferrer" target='_blank' href='https://4finance.mit.com.mx/vivWeb/'>PAGAR CON TARJETA DE DÉBITO</a></p>
        </div>
    )
}

export default DebitOption
