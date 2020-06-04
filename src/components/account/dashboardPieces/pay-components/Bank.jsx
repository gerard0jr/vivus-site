import React, { useState, useEffect } from 'react'
import {Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel} from 'react-accessible-accordion'
import '../pay-components/liquidate-components/accordion.scss'
import '../../newStyles.scss'
import { getToken, getBankPaymentReference } from '../../../../services/api'
import { momentEs } from '../../../../services/moment'

const idProduct = 1

const Bank = ({balance}) => {

    const [serverError, setServerError] = useState(false)
    const [bank0, setBank0] = useState({})
    const [bank1, setBank1] = useState({})
    const [bank2, setBank2] = useState({})

    const bankData = async (user, idBank, validToken) => {
        const data = {
            idProduct,
            idCustomer: user.customerId,
            idBank
        }
        if(idBank === 3 ){
        getBankPaymentReference(data, validToken)
            .then(res => setBank0(res.data))
            .catch(err => setServerError(true))
        }
        if(idBank === 10 ){
        getBankPaymentReference(data, validToken)
            .then(res => setBank1(res.data))
            .catch(err => setServerError(true))
        }
        if(idBank === 11 ){
        getBankPaymentReference(data, validToken)
            .then(res => setBank2(res.data))
            .catch(err => setServerError(true))
        }
    }

    const getData = async (user) => {
        // Here goes post to get user debt instead of session storage
        let response = await getToken()
        if(!response) return setServerError(true)
        let validToken = response.data.token
        bankData(user, 3, validToken) //BBVA
        bankData(user, 10, validToken) //CI
        bankData(user, 11, validToken) //INBURSA
    }

    useEffect(() => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(demoUser || user.eMail === 'demo@demo.com'){
            setBank0({
                account: '25478154',
                paymentReference: '12354874561237862'
            })
            setBank1({
                account: '25478154',
                paymentReference: '12354874561237862'
            })
            return setBank2({
                account: '25478154',
                paymentReference: '12354874561237862'
            })
        }
        if(user){
            getData(user)
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <div className='bank-container'>
            <div className='bank-header'>
                <h3 style={{margin: 0, padding: '0 1rem'}}>Otras opciones</h3>
                <p><strong>Banco</strong></p>
            </div>
            <div className='bank-content'>
                <p>Puedes usar esta opción sólo en caso de tener algún <strong>problema</strong> con tu <strong>cuenta</strong> para el <strong>cargo automático</strong> de tu siguiente <strong>parcialidad.</strong></p>
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
                        <Accordion allowZeroExpanded='true' >
                            <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        BBVA
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    <ol>
                                        <li>Acude a una practicaja en la opción pagar <strong>otros servicios</strong></li>
                                        <li>Utiliza el convenio <strong>{bank0.account}</strong> e ingresa en concepto <strong>pago total</strong></li>
                                        <li>Ingresa tu <strong>monto</strong> y tu número de <strong>referencia</strong> {bank0.paymentReference}</li>
                                    </ol>
                                </AccordionItemPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        CI BANCO
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    <p>Acude a una sucursal bancaria y proporciona:</p>
                                    <p>Número de Cuenta: <strong>{bank1.account}</strong></p>
                                    <p>Referencia: <strong>{bank1.paymentReference}</strong></p>
                                </AccordionItemPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionItemHeading>
                                    <AccordionItemButton>
                                        Inbursa
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel>
                                    <p>Acude a una sucursal o cualquier módulo dentro de Sanborns, Sam's o Walmart y proporciona:</p>
                                    <p>Convenio: <strong>{bank2.account}</strong></p>
                                    <p>Referencia: <strong>{bank2.paymentReference}</strong></p>
                                </AccordionItemPanel>
                            </AccordionItem>
                        </Accordion>
                        {serverError && <span>*Error en el servidor</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bank
