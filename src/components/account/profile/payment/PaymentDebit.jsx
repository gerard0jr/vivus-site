import React, { useState, useEffect } from 'react'
import cookie from 'react-cookies'
import Axios from 'axios'
import { withRouter } from 'react-router-dom'
import { getToken, changeDebit, getBanks } from '../../../../services/api'

const idProduct = 1

const PaymentDebit = ({history, setSection}) => {

    const [token, setToken] = useState(null)
    const [card, setCard] = useState('')
    const [banks, setBanks] = useState([])
    const [bank, setBank] = useState('')
    const [bankError, setBankError] = useState('')
    const [cardErr, setCardErr] = useState(false)
    const [success, setSuccess] = useState(false)
    const [currentChange, setCurrentChange] = useState(false)

    const checkClabe = async () => {
        let response = await getToken() 
        if(!response) return setCardErr(true)
        let validToken = response.data.token
        if (!card) return setCardErr(true)
        let regEx = /^([0-9]{16})$/
        const user = JSON.parse(sessionStorage.getItem('loggedUser'))
        const data = {
            debitCard: card,
            idBank: parseInt(bank),
            CustomerIP: sessionStorage.getItem('ip') || '0.0.0.0',
            Coordinates: sessionStorage.getItem('coords') || 'location blocked by user',
            UserAgent: window.navigator.userAgent,
            IdCustomer: user.customerId,
            IdProduct: idProduct
        }
        if(regEx.test(card)){
            setCardErr(false)
            if(bank === '') return setBankError(true)
            setBankError(false)
            changeDebit(data, validToken)
            .then(res => {
                setSuccess(true)
            })
            .catch(err => {
                if(err.response.status === 403) return setCurrentChange(true)
                setCardErr(true)
            })
        }else{
            setCardErr(true)
        }
    }

    const loadBanks = async () => {
        let response = await getToken() 
        if(!response) return setBanks(['Server error'])
        let validToken = response.data.token
        getBanks(validToken)
            .then(res => {
                setBanks(res.data.catalogs[0].records)
            })
            .catch(err => setBanks(['Server error']))
    }

    useEffect(() => {
        let getToken = cookie.load('token')
        if(!getToken) return history.push('/login')
        setToken(getToken)
        loadBanks()
    }, [])

    return (
        <div>
            {success ? 
            <div>
                <h4>Listo, el cambio de tu tarjeta de débito está en trámite</h4>
                <p className='pfield-title' style={{marginTop: '1rem'}}>
                    Realizaremos una validación y en breve te informaremos el resultado, 
                    espéralo en tu correo electrónico en un plazo de 24 horas hábiles
                </p>
                <p className='pfield-title' style={{marginTop: '1rem', color: 'red'}}>
                    Al continuar, acepto que este nuevo número es válido para actualizar mi formato de autorización de cargo automático
                    por el monto de las parcialidades que en su caso tenga pendientes. Tarjeta de débito número: <br/>
                    <strong>{card}</strong>
                </p>
                <div onClick={() => setSection('home')} className='return-to-profile'>
                    <p>Continuar</p>
                </div>
            </div>
            :
            <div>
                <h4>Tarjeta de débito</h4>
                <p style={{fontWeight: 'bold', marginTop: '2rem'}}><strong>Numero de tarjeta débito</strong></p>
                <div className="input-wrapper">
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} maxLength='16' onChange={(e) => setCard(e.target.value)} value={card} type='text' className="form-control"/>
                </div>
                {currentChange ? <small style={{color: 'red'}}>Ya tienes un trámite en proceso</small> : null}
                {cardErr ? <small style={{color: 'red'}}>Numero de tarjeta incorrecto</small> : null}
                <div style={{marginTop: '2rem'}}>
                    <p style={{fontWeight: 'bold', marginTop: '2rem'}}><strong>Emisor de tarjeta de débito</strong></p>
                </div>
                <div style={{marginBottom: '2rem'}} className="input-wrapper">
                    <select onChange={(e) => setBank(e.target.value)} value={bank} type='text' className="form-control">
                        <option value='' disabled selected>{banks.length > 0 ? 'Selecciona un banco' : 'Cargando bancos'}</option>
                        {banks.map(bank => <option key={bank.value} value={bank.value}>{bank.text}</option>)}
                    </select>
                    <br/>
                    {bankError ? <small style={{color: 'red'}}>Selecciona un banco</small> : null}
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

export default withRouter(PaymentDebit)
