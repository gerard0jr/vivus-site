import React, { useState } from 'react'
import { getToken, changeCLABE } from '../../../../services/api'

const idProduct = 1

const PaymentBank = ({setSection}) => {

    const [clabe, setClabe] = useState('')
    const [clabeErr, setClabeErr] = useState(false)
    const [currentChange, setCurrentChange] = useState(false)
    const [success, setSuccess] = useState(false)

    const checkClabe = async () => {
        let response = await getToken() 
        if(!response) return setClabeErr(true)
        let validToken = response.data.token
        if (!clabe) return setClabeErr(true)
        let regEx = /^([0-9]{18})$/
        const user = JSON.parse(sessionStorage.getItem('loggedUser'))
        const data = {
            clabeAccount: clabe,
            customerIP: sessionStorage.getItem('ip') || '0.0.0.0',
            coordinates: sessionStorage.getItem('coords') || 'location blocked by user',
            userAgent: window.navigator.userAgent,
            idCustomer: user.customerId,
            idProduct
        }
        if(regEx.test(clabe)){
            setClabeErr(false)
            changeCLABE(data, validToken)
            .then(res => {
                setSuccess(true)
            })
            .catch(err => {
                if(err.response.status === 403) return setCurrentChange(true)
                else setClabeErr(true)
            })
        }else{
            setClabeErr(true)
        }
    }

    return (
        <div>
            {success ? 
            <div>
                <h4>Listo, el cambio de tu CLABE está en trámite</h4>
                <p className='pfield-title' style={{marginTop: '1rem'}}>
                    Realizaremos una validación y en breve te informaremos el resultado, 
                    espéralo en tu correo electrónico en un plazo de 24 horas hábiles
                </p>
                <p className='pfield-title' style={{marginTop: '1rem', color: 'red'}}>
                    Al continuar, acepto que este nuevo número es válido para actualizar mi formato de autorización de cargo automático
                    por el monto de las parcialidades que en su caso tenga pendientes. CLABE número: <br/>
                    {clabe}
                </p>
                <div onClick={() => setSection('home')} className='return-to-profile'>
                    <p>Continuar</p>
                </div>
            </div>
            :
            <div>
                <h4>Cuenta Bancaria</h4>
                <p style={{fontWeight: 'bold', marginTop: '2rem'}}><strong>CLABE (18 dígitos)</strong></p>
                <div className="input-wrapper">
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} maxLength='18' onChange={(e) => setClabe(e.target.value)} value={clabe} type='text' className="form-control"/>
                </div>
                {currentChange ? <small style={{color: 'red'}}>Ya tienes un trámite en proceso</small> : null}
                {clabeErr ? <small style={{color: 'red'}}>CLABE incorrecta</small> : null}
                <div style={{marginTop: '1rem'}}>
                    <p className='pfield-title' >
                        La CLABE es un numero de 18 dígitos que generan los bancos para poder realizar transferencias electrónicas.
                        Puedes localizarlo en cualquier estado de cuenta, contrato o puedes llamar a tu banco para obtenerlo, si no lo tienes, 
                        no se captura correctamente o no está A TU NOMBRE, no podremos realizar el depósito.
                    </p>
                </div>
                <div style={{textAlign: 'center', margin: '1rem 0'}}>
                    <p onClick={checkClabe} className='btn-minimal-width btn-full-width'>GUARDAR</p>
                </div>
                <div onClick={() => setSection('home')} className='return-to-profile'>
                    <p>Cancelar</p>
                </div>
            </div>
            }
        </div>
    )
}

export default PaymentBank
