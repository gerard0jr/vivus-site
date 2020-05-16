import React, { useState } from 'react'
import { getToken, getOXXOPaymentReference } from '../../../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'

const idProduct = 2

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
        setLoading(true)
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(user){
            getData(user)
        }        
        else setLoading(false)
    }

    const oxxoRef = () => {
        setLoading(true)
        setTimeout(() => {
            setExtension(extensionReference)
            setLoading(false)
        }, 1000)
    }

    console.log(extensionReference)
    return (
        <div>
            <ol>
                <li>Solicita tu número de referencia para pagar haciendo click en el botón de abajo y la enviaremos de inmediato a tu correo electrónico.</li>
                <li>Acude a cualquier tienda participante y realiza tu pago en efectivo</li>
            </ol>
            <div className='flex-distributed'>
                <img width={moveImgWidth ? '200px' : '250px'} src="/img/oxxo-black.png" alt="mastercard"/>
            </div>
            {reference ? 
            <p className='btn-minimal-width' style={{width: '80%', margin: '0 auto', backgroundColor: 'gray', cursor: 'default'}}>{reference}</p>
            :
            extension ? 
            <p className='btn-minimal-width' style={{width: '80%', margin: '0 auto', backgroundColor: 'gray', cursor: 'default'}}>{extension}</p>
            : extensionReference ? 
            <p onClick={oxxoRef} className='btn-minimal-width' style={{width: '80%', margin: '0 auto'}}>{loading ? <BallClipRotate loading color='white'/> : 'SOLICITAR NÚMERO DE REFERENCIA'}</p>
            :
            <p onClick={requestRef} className='btn-minimal-width' style={{width: '80%', margin: '0 auto'}}>{loading ? <BallClipRotate loading color='white'/> : 'SOLICITAR NÚMERO DE REFERENCIA'}</p>}
        </div>
    )
}

export default CashOption
