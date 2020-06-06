import React, { useState } from 'react'
import { getToken, getOXXOPaymentReference } from '../../../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'

const idProduct = 1

const CashOption = ({moveImgWidth, extensionReference}) => {
    const [loading, setLoading] = useState(false)
    const [reference, setReference] = useState(null)
    const [extension, setExtension] = useState(null)

    const oxxoData = async (user, idBank, validToken) => {
        const data = {
            idProduct,
            idCustomer: user.customerId,
            idBank
        }
        getOXXOPaymentReference(data, validToken)
        .then(res => {
            setReference(res.data.paymentReference)
            setLoading(false)
        })
        .catch(err => setLoading(false))
    }

    const getData = async (user) => {
        // Here goes post to get user debt instead of session storage
        let response = await getToken()
        if(!response) return setLoading(false)
        let validToken = response.data.token
        oxxoData(user, 3, validToken)
    }

    const requestRef = () => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(demoUser || user.eMail === 'demo@demo.com'){
            setExtension(1234789456123)
            return setLoading(false)
        }
        setLoading(true)
        if(user){
            getData(user)
        }        
        else setLoading(false)
    }

    return (
        <div>
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
            {reference ? 
            <p className='btn-minimal-width' style={{width: '80%', margin: '0 auto', backgroundColor: 'gray', cursor: 'default'}}>Hemos enviado la referencia a tu correo electrónico</p>
            :
            extension ? 
            <p className='btn-minimal-width' style={{width: '80%', margin: '0 auto', backgroundColor: 'gray', cursor: 'default'}}>Hemos enviado la referencia a tu correo electrónico</p>
            :
            <p onClick={requestRef} className='btn-minimal-width' style={{width: '80%', margin: '0 auto'}}>{loading ? <BallClipRotate loading color='white'/> : 'SOLICITAR NÚMERO DE REFERENCIA'}</p>}
        </div>
    )
}

export default CashOption
