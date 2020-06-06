import React,  { useState } from 'react'
import CheckCode from './email/CheckCode'
import { sendCodeByNewEMail, getToken, getCustomerByMail } from '../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'

const ChangeEmail = ({history, setSection}) => {
    const [email, setEmail] = useState(null)
    const [emailErr, setEmailErr] = useState(false)
    const [validEmail, setValidEmail] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [loading, setLoading] = useState(false)

    const idProduct = 1

    const checkEmail = async () => {
        if(!email) return setEmailErr(true)
        let regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if( regEx.test(email.toLowerCase()) ){
            setEmailErr(false)
            setEmailError(false)
            setLoading(true)
            let response = await getToken()
            let validToken = response.data.token
            let coords = sessionStorage.getItem('coords')
            if(!coords) coords = 'Location blocked'
            let myIp = sessionStorage.getItem('ip')
            if(!myIp) myIp = '192.168.1.254'
            let user = JSON.parse(sessionStorage.getItem('loggedUser'))
            const data = {
                newEMail: email,
                newMobile: '',
                userAgent: navigator.userAgent,
                remoteIp: myIp,
                coordinates: coords,
                isNIP: false,
                idCustomer: user.customerId,
                idProduct
            }
            sendCodeByNewEMail(data, validToken)
            .then(res => {
                console.log(res)
                if(res.status === 200){
                    setValidEmail(true)
                    setLoading(false)
                }
                setEmailError(true)
                setLoading(false)
            })
            
        } else{
            setEmailErr(true)
            setLoading(false)
        }
    }

    return (
        <div>
        {validEmail ? 
            <CheckCode history={history} email={email} setValidEmail={setValidEmail} setSection={setSection}/>
        :
            <div>
                <h4>Cambiar correo electrónico</h4>
                <p style={{fontWeight: 'bold', marginTop: '2rem'}}><strong>Nueva dirección de correo electrónico</strong></p>
                <div className="input-wrapper">
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={(e) => setEmail(e.target.value)} value={email} placeholder='ejemplo@email.com' type='email' className="form-control"/>
                </div>
                {emailErr ? <small style={{color: 'red'}}>Ingresa un correo válido</small> : null}
                {emailError ? <small style={{color: 'red'}}>Esta cuenta de correo ya está en uso o hubo un error interno</small> : null}
                <div style={{textAlign: 'center', margin: '1rem 0'}}>
                    {loading ? <BallClipRotate color={'#A8CC46'} loading/> :
                    <p onClick={checkEmail} className='btn-minimal-width btn-full-width'>
                        CAMBIAR DIRECCIÓN DE CORREO ELECTRÓNICO
                    </p>}
                </div>
                <div onClick={() => setSection('home')} className='return-to-profile'>
                    <p>Cancelar</p>
                </div>
            </div>
        }
        </div>
    )
}

export default ChangeEmail