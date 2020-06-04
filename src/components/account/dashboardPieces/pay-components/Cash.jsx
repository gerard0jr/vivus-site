import React, { useState } from 'react'
import '../../newStyles.scss'
import { getToken, getOXXOPaymentReference } from '../../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'
import { momentEs } from '../../../../services/moment'

const idProduct = 1

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
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(demoUser || user.eMail === 'demo@demo.com'){
            return setReference(1234789456123)
        }
        setLoading(true)
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
                <p>Puedes usar esta opción sólo en caso de tener algún <strong>problema</strong> con tu <strong>cuenta</strong> para el <strong>cargo automático</strong> de tu <strong>pago.</strong></p>
                <p>Te sugerimos que al usarla realices el <strong>pago antes</strong> de la fecha de <strong>vencimiento</strong> para evitar aclaraciones.</p>
                <div className='bank-bottom-container'>
                    <div className='liquidate-left'>
                        <div className='liquidate-resume'>
                            <p className='bold-type'>DETALLES DEL PAGO</p>
                            <hr/>
                            <div className='liquidate-values'><p>Capital:</p><p>{balance.curentInstallment.principalBalance.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p></div>
                            <hr/>
                            <div className='liquidate-values'><p>Intereses:</p><p>{balance.curentInstallment.interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p></div>
                            <hr/>
                            <div className='liquidate-values'><p className='bold-type'>Monto a pagar:</p><p style={{textAlign: 'right'}} className='bold-type'>{balance.curentInstallment.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small><small> IVA incluído</small></p></div>
                            <hr/>
                            <p>Fecha de vencimiento</p>
                            <p className='bold-type' style={{textAlign: 'right'}}>{momentEs(balance.curentInstallment.dueDate).format('D/MMM/Y')}</p>
                        </div>
                    </div>
                    <div className='bank-accordion'>
                        <div>
                            <ol>
                                <li>Solicita tu número de referencia para pagar haciendo click en el botón de abajo y la enciaremos de inmediato a tu correo electrónico.</li>
                                <li>Acude a cualquier tienda participante y realiza tu pago en efectivo</li>
                            </ol>
                            <div className='flex-distributed'>
                                <img width='250px' src="/img/paycash/soriana.png" alt="efectivo"/>
                                <img width='250px' src="/img/paycash/comercialmexicana.png" alt="efectivo"/>
                                <img width='250px' src="/img/paycash/extra.png" alt="efectivo"/>
                                <img width='250px' src="/img/paycash/7eleven.png" alt="efectivo"/>
                                <img width='250px' src="/img/paycash/Walmart.png" alt="efectivo"/>
                                <img width='250px' src="/img/paycash/superama.png" alt="efectivo"/>
                                <img width='250px' src="/img/paycash/Circle_K.png" alt="efectivo"/>
                                <img width='250px' src="/img/paycash/bodega-aurrera.png" alt="efectivo"/>
                                <img width='250px' src="/img/paycash/oxxo.png" alt="efectivo"/>
                            </div>
                            {reference ? 
                            <>
                                <p className='btn-minimal-width' style={{width: '80%', margin: '0 auto', backgroundColor: 'gray', cursor: 'default', padding: '10px 1rem'}}>Hemos enviado la referencia a tu correo electrónico</p>
                            </>
                            :
                            <p onClick={requestRef} className='btn-minimal-width' style={{width: '80%', margin: '0 auto', padding: '10px 1rem', border: '2px solid gray'}}>{loading ? <BallClipRotate loading color='white'/> : 'SOLICITAR NÚMERO DE REFERENCIA'}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cash
