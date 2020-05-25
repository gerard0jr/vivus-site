import React, { useState } from 'react'
import { checkCode, getToken, changeCustomerEmail, changeCustomerMobile } from '../../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'

const idProduct = 1

const CheckCode = ({history, email, setValidEmail, setSection, number, setValidNumber}) => {
    
    const [code, setCode] = useState('')
    const [codeErr, setCodeErr] = useState(false)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [notChanged, setNotChanged] = useState(false)
    
    const validateCode = async () => {
        if(!code || code.length < 4) return setCodeErr(true)
        setCodeErr(false)
        setNotChanged(false)
        let response = await getToken()
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(response){
            setLoading(true)
            let validToken = response.data.token
            let coords = sessionStorage.getItem('coords')
            if(!coords) coords = 'Location blocked'
            let myIp = sessionStorage.getItem('ip')
            if(!myIp) myIp = '192.168.1.254'
            if(email){
                let data = {
                    code,
                    isNIP: false,
                    userAgent: navigator.userAgent,
                    clientIP: myIp,
                    coordinates: coords,
                    idCustomer: user.customerId,
                    idProduct
                }
                checkCode(data, validToken)
                .then(res =>{
                    if(res.status === 200){
                        let dataChange = {
                            isNIP: false,
                            userAgent: navigator.userAgent,
                            remoteIp: myIp,
                            coordinates: coords,
                            idCustomer: user.customerId,
                            idProduct
                        }
                        return changeCustomerEmail({newEMail: email, newMobile: '', ...dataChange}, validToken)
                        .then(changed => {
                            if(changed.status === 200){
                                let session = JSON.parse(sessionStorage.getItem('loggedUser'))
                                session.eMail = email
                                sessionStorage.setItem('loggedUser', JSON.stringify(session))
                                setSuccess(true)
                                setLoading(false)
                            }
                            setNotChanged(true)
                            setLoading(false)
                        })
                    }
                    setCodeErr(true)
                    setLoading(false)
                })
            }
            if(number){
                let data = {
                    code,
                    isNIP: false,
                    userAgent: navigator.userAgent,
                    clientIP: myIp,
                    coordinates: coords,
                    idCustomer: user.customerId,
                    idProduct
                }
                checkCode(data, validToken)
                .then(res =>{
                    if(res.status === 200){
                        let dataChange = {
                            isNIP: false,
                            userAgent: navigator.userAgent,
                            remoteIp: myIp,
                            coordinates: coords,
                            idCustomer: user.customerId,
                            idProduct
                        }
                        return changeCustomerMobile({newEMail: '', newMobile: number, ...dataChange}, validToken)
                        .then(changed => {
                            if(changed.status === 200){
                                let session = JSON.parse(sessionStorage.getItem('loggedUser'))
                                session.mobile = number
                                sessionStorage.setItem('loggedUser', JSON.stringify(session))
                                setSuccess(true)
                                setLoading(false)
                            }
                            setNotChanged(true)
                            setLoading(false)
                        })
                    }
                    setCodeErr(true)
                    setLoading(false)
                })
            }
        }
    }

    return (
        <div>
            {success ? 
             <div style={{textAlign: 'center'}}>
                <h4 style={{margin: '4rem 0'}}>{number ? 'Número' : 'Correo'} actualizado correctamente</h4>
                {/* <p>Los cambios se verán reflejados cuando vuelvas a iniciar sesión</p> */}
                <div style={{textAlign: 'center', margin: '2rem 0'}}>
                    <p onClick={() => setSection('home')} className='btn-minimal-width btn-full-width'>
                        CONTINUAR
                    </p>
                </div>
            </div>
            :
            <div>
                <h4>{number ? 'Cambiar número celular' : 'Cambiar correo electrónico'}</h4>
                <p><strong>{number ? number : email}</strong></p>
                <div style={{margin: '1rem 0'}} onClick={number ? () => setValidNumber(false) : () => setValidEmail(false)} className='return-to-profile'>
                    <p>{number ? '¿Número celular erróneo?' : '¿Correo electrónico erróneo?'}</p>
                </div>
                <p>Ingresa en este campo el código de confirmación que te hemos enviado {number ? 'al número celular' : 'por correo electrónico'}</p>
                <div style={{marginTop: '2rem'}}>
                    <p style={{fontWeight: 'bold'}}><strong>Código de confirmación</strong></p>
                </div>
                <div className="input-wrapper">
                    <input maxLength='4' onChange={(e) => setCode(e.target.value)} value={code} type='text' className="form-control"/>
                </div>
                {codeErr ? <small style={{color: 'red'}}>Código inválido</small> : null}
                {notChanged ? <small style={{color: 'red'}}>Ocurrió un problema con el servidor, intenta nuevamente</small> : null}
                <div style={{textAlign: 'center', margin: '1rem 0'}}>
                    {loading ? <BallClipRotate color={'#A8CC46'} loading/> :
                    <p onClick={validateCode} className='btn-minimal-width btn-full-width'>
                        CONFIRMAR
                    </p>
                    }
                </div>
                <div onClick={() => setSection('home')} className='return-to-profile'>
                    <p>Cancelar</p>
                </div>
            </div>
            }
        </div>
    )
}

export default CheckCode
