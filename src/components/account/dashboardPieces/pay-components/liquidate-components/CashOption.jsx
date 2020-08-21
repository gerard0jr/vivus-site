import React, { useState } from 'react'
import { BallClipRotate } from 'react-pure-loaders'

const CashOption = ({extensionReference}) => {
    const [loading, setLoading] = useState(false)
    const [extension, setExtension] = useState(false)
    const [email, setEmail] = useState('')

    const requestRef = () => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(demoUser || user.eMail === 'demo@demo.com'){
            setExtension(true)
            setEmail(user.eMail)
            return setLoading(false)
        }
        setLoading(false)
        setEmail(user.eMail)
        return setExtension(true)
    }

    return (
        <div>
            {
                extension ? 
                    <div className='move-sent'>
                        <p><strong>Las instrucciones de pago</strong></p>   
                        <p>han sido enviadas</p>
                        <p>Te hamos enviado un correo a</p>
                        <p>{email}</p>
                        <p>
                            Si no recibes el correo en los próximos 5 minutos o quieres utilizar otra cuenta de correo electrónico, 
                            por favor <b>inicia sesión</b> en esa cuenta o contáctanos en <a rel="noopener noreferrer" target='_blank' href='http://bit.ly/WAVivus'>Whatsapp</a>
                        </p>
                    </div>
                :
                    <>
                        <ol>
                            <li>Solicita tu número de referencia para pagar haciendo click en el botón de abajo y la enviaremos de inmediato a tu correo electrónico.</li>
                            <li>Acude a cualquier tienda participante y realiza tu pago en efectivo</li>
                        </ol>
                        <div className='flex-distributed'>
                            <img width='250px' src="/img/paycash/soriana.png" alt="efectivo"/>
                            <img width='250px' src="/img/paycash/comercialmexicana.png" alt="efectivo"/>
                            <img width='250px' src="/img/paycash/extra.png" alt="efectivo"/>
                            <img width='250px' src="/img/paycash/7eleven.png" alt="efectivo"/>
                            <img width='250px' src="/img/paycash/superama.png" alt="efectivo"/>
                            <img width='250px' src="/img/paycash/Circle_K.png" alt="efectivo"/>
                            <img width='250px' src="/img/paycash/bodega-aurrera.png" alt="efectivo"/>
                            <img width='250px' src="/img/paycash/oxxo.png" alt="efectivo"/>
                            <img width='250px' src="/img/paycash/Walmart.png" alt="efectivo"/>
                        </div>
                        <p onClick={requestRef} className='btn-minimal-width' style={{width: '80%', margin: '0 auto'}}>{loading ? <BallClipRotate loading color='white'/> : 'SOLICITAR NÚMERO DE REFERENCIA'}</p>
                    </>
            }
        </div>
    )
}

export default CashOption
