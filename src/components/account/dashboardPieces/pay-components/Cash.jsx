import React, { useState } from 'react'
import '../../newStyles.scss'
import { getToken, getOXXOPaymentReference } from '../../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'
import { momentEs } from '../../../../services/moment'

const idProduct = 2

const Cash = ({balance}) => {
    const [loading, setLoading] = useState(false)
    const [reference, setReference] = useState(null)

    const oxxoData = async (user, validToken) => {
        const data = {
            idProduct,
            idCustomer: user.customerId
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
        oxxoData(user, validToken)
    }

    const requestRef = () => {
        setLoading(true)
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(user){
            getData(user)
        }        
        else setLoading(false)
    }
    return (
        <div className='bank-container'>
            <div className='bank-header'>
                <h3 style={{margin: 0, padding: '0 1rem'}}>Otras opciones</h3>
                <p><strong>Efectivo</strong></p>
            </div>
            <div className='bank-content'>
                <p>Puedes usar esta opción sólo en caso de tener algún <strong>problema</strong> con tu <strong>cuenta</strong> para el <strong>cargo automático</strong> de tu siguiente <strong>parcialidad.</strong></p>
                <p>Te sugerimos que al usarla realices el <strong>pago antes</strong> de la fecha de <strong>vencimiento</strong> para evitar aclaraciones.</p>
                <div className='bank-bottom-container'>
                    <div className='liquidate-left'>
                        <div className='liquidate-resume'>
                            <p className='bold-type'>Tu parcialidad no. <strong>{balance.curentInstallment.idDeferral}</strong></p>
                            <hr/>
                            <div className='liquidate-values'><p className='bold-type'>Monto a pagar:</p><p className='bold-type'>{balance.curentInstallment.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p></div>
                            <hr/>
                            <div className='liquidate-values'><p>Capital:</p><p>{balance.curentInstallment.principalBalance.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p></div>
                            <hr/>
                            <div className='liquidate-values'><p>Intereses:</p><p>{balance.curentInstallment.interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p></div>
                            <hr/>
                            <p className='bold-type'>Fecha de vencimiento</p>
                            <p style={{textAlign: 'right'}}>{momentEs(balance.curentInstallment.dueDate).format('D/MMM/Y')}</p>
                        </div>
                    </div>
                    <div className='bank-accordion'>
                        <div>
                            <ol>
                                <li>Solicita tu número de referencia para pagar haciendo click en el botón de abajo y la enciaremos de inmediato a tu correo electrónico.</li>
                                <li>Acude a cualquier tienda participante y realiza tu pago en efectivo</li>
                            </ol>
                            <div className='flex-distributed'>
                                <img width='250px' src="/img/oxxo-black.png" alt="efectivo"/>
                            </div>
                            {reference ? 
                            <p className='btn-minimal-width' style={{width: '80%', margin: '0 auto', backgroundColor: 'gray', cursor: 'default'}}>{reference}</p>
                            :
                            <p onClick={requestRef} className='btn-minimal-width' style={{width: '80%', margin: '0 auto'}}>{loading ? <BallClipRotate loading color='white'/> : 'SOLICITAR NÚMERO DE REFERENCIA'}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cash
