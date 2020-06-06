import React, {useState} from 'react'
import CheckCode from './email/CheckCode'
import { getToken, sendCodeByNewSMS } from '../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'

const idProduct = 1

const ChangePhone = ({history, setSection}) => {

    const [number, setNumber] = useState(null)
    const [numberErr, setNumberErr] = useState('')
    const [validNumber, setValidNumber] = useState(false)
    const [loading, setLoading] = useState(false)

    const checkNumber = async () => {
        if(number.length < 10) return setNumberErr(true)
        let reg = /[0-9]{10}$/
        if(reg.test(number)){
            setLoading(true)
            let response = await getToken()
            let validToken = response.data.token
            let coords = sessionStorage.getItem('coords')
            if(!coords) coords = 'Location blocked'
            let myIp = sessionStorage.getItem('ip')
            if(!myIp) myIp = '192.168.1.254'
            let user = JSON.parse(sessionStorage.getItem('loggedUser'))
            const data = {
                newEMail: '',
                newMobile: number,
                userAgent: navigator.userAgent,
                remoteIp: myIp,
                coordinates: coords,
                isNIP: false,
                idCustomer: user.customerId,
                idProduct
            }
            sendCodeByNewSMS(data, validToken)
            .then(res => {
                console.log(res)
                if(res.status === 200){
                    setValidNumber(true)
                    setLoading(false)
                }
                setNumberErr(true)
                setLoading(false)
            })
            setNumberErr(false)
            return setValidNumber(true)
        }
        setNumberErr(true)
    }

    return (
        <div>
            {validNumber ? 
            <CheckCode history={history} number={number} setValidNumber={setValidNumber} setSection={setSection}/>
            :
            <div>
                <h4>Cambiar número celular</h4>
                <p style={{fontWeight: 'bold', marginTop: '2rem'}}><strong>Ingresa tu nuevo número celular</strong></p>
                <div className="input-wrapper">
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} maxLength='10' onChange={(e) => setNumber(e.target.value)} value={number} placeholder='Ingresa tu número a 10 dígitos' type='text' className="form-control"/>
                </div>
                {numberErr ? <small style={{color: 'red'}}>Número incorrecto</small> : null}
                <div style={{textAlign: 'center', margin: '1rem 0'}}>
                    {loading ? <BallClipRotate color={'#A8CC46'} loading/> :
                    <p onClick={checkNumber} className='btn-minimal-width btn-full-width'>
                        CAMBIAR NÚMERO DE TELÉFONO CELULAR
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

export default ChangePhone