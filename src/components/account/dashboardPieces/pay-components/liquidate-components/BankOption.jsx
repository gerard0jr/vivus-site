import React, { useState, useEffect } from 'react'
import {Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel} from 'react-accessible-accordion'
import './accordion.scss'
import { getToken, getBankPaymentReference } from '../../../../../services/api'

const idProduct = 1

const BankOption = () => {

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
            setBank2({
                account: '25478154',
                paymentReference: '12354874561237862'
            })
            return
        }
        if(user){
            getData(user)
        }        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <>
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
        </>
    )
}

export default BankOption
