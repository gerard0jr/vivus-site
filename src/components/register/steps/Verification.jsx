import React, { useState, useEffect } from 'react'
import { BallBeat } from 'react-pure-loaders'
import { getToken, getCustomerByMail, sendCodeBySMS, checkSecurityCode, getAnalytics } from '../../../services/api'
import TagManager from 'react-gtm-module'

const idProduct = 1

export const Verification = ({props, setCurrentStep}) => {

    const [loading, setLoading] = useState(false)
    const [customer, setCustomer] = useState(null)
    const [nip, setNip] = useState(null)
    const [nipError, setNipError] = useState(null)
    const [sentBySMS, setSentBySMS] = useState(false)

    const handleSubmit = async () => {
        setLoading(true)
        if(!nip) return setNipError(true)
        if(nip.length > 4) return setNipError(true)
        if(customer.eMail === 'demo@demo.com') return props.history.push('/registration/identity')
        let response = await getToken()
        let validToken = response.data.token
        let data = {
            idCustomer: customer.idCustomer,
            code: parseInt(nip),
            idProduct,
            isNIP: true,
            userAgent: navigator.userAgent,
            clientIP: '192.868.1.254',
            coordinates: '92.76, -98.54'
          }
        checkSecurityCode(data, validToken)
        .then(res => {
            if(res.status === 200){
                setNipError(false)
                setLoading(false)
                return props.history.push('/registration/identity')
            }
            if(res.status === 403){
                setNipError(true)
                setLoading(false)
            }
            setNipError(true)
            setLoading(false)
        })
        .catch(err => {
            setNipError(true)
            setLoading(false)
        })
    }

    const sendSMS = async () => {
        const data = {
            idProduct,
            idCustomer: customer.idCustomer,
            isNIP: true
        }
        let response = await getToken()
        if(!response) return
        let validToken = response.data.token
        return sendCodeBySMS(data, validToken)
                .then(res => setSentBySMS(true))
                .catch(err => console.log(err))
    }

    const loadLocalData = async () => {
        let localRegister = await JSON.parse(sessionStorage.getItem('data-step-registration'))
        let response = await getToken()
        const validToken = response.data.token
        getCustomerByMail(idProduct, localRegister.eMail, validToken)
            .then(res => {
                setCustomer(res.data)
                //TAG MANAGER
                getAnalytics({idCustomer: res.data.idCustomer, idProduct}, validToken)
                .then(res => {
                    if(res.data){
                        const tagManagerArgs = {
                            dataLayer: {
                                event: 'pageChange',
                                page: {
                                    url: '/registration/nip-bureau',
                                    referrer: '/registration/employment-details'
                                },
                                client: {
                                    hFN: res.data.hFN,
                                    hLN: res.data.hLN,
                                    hTN: res.data.hTN,
                                    hMA: res.data.hMA,
                                    dateOfBirth: res.data.dateOfBirth,
                                    returningClient: res.data.returningClient,
                                    identifiedBy: res.data.identifiedBy,
                                    registeredBy: res.data.registeredBy
                                },
                                loans: {
                                    loansCount: res.data.loansCount
                                },
                                lastest_loan: {
                                    status: res.data.status,
                                    id: res.data.id,
                                    repaymentDate: res.data.repaymentDate
                                },
                                application: {
                                    id: res.data.application.id
                                }
                            },
                            dataLayerName: 'dataLayer'
                        }
                        TagManager.dataLayer(tagManagerArgs)
                    }
                })
                //TAG MANAGER
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        const initialConfig = async () => {
            let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
            if(demoUser) return setCustomer(demoUser)
            let response = await getToken()
            let validToken = response.data.token
            sessionStorage.removeItem('customer-direct-step')
            sessionStorage.setItem('session-step', 3)
            const loggedUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
            if(!loggedUser){
                const emptyCustomer = await JSON.parse(sessionStorage.getItem('empty-customer'))
                if(emptyCustomer) {
                    let data = {
                        idProduct,
                        isNIP: true
                    }
                    if(emptyCustomer.idCustomer){
                        data.idCustomer = emptyCustomer.idCustomer
                    }
                    else data.idCustomer = emptyCustomer.customerId
                    setCustomer({idCustomer:data.idCustomer, eMail: emptyCustomer.eMail, mobile:emptyCustomer.mobile})
                    //TAG MANAGER
                    getAnalytics({idCustomer: data.idCustomer, idProduct}, validToken)
                    .then(res => {
                        if(res.data){
                            const tagManagerArgs = {
                                dataLayer: {
                                    event: 'pageChange',
                                    page: {
                                        url: '/registration/nip-bureau',
                                        referrer: '/registration/employment-details'
                                    },
                                    client: {
                                        hFN: res.data.hFN,
                                        hLN: res.data.hLN,
                                        hTN: res.data.hTN,
                                        hMA: res.data.hMA,
                                        dateOfBirth: res.data.dateOfBirth,
                                        returningClient: res.data.returningClient,
                                        identifiedBy: res.data.identifiedBy,
                                        registeredBy: res.data.registeredBy
                                    },
                                    loans: {
                                        loansCount: res.data.loansCount
                                    },
                                    lastest_loan: {
                                        status: res.data.status,
                                        id: res.data.id,
                                        repaymentDate: res.data.repaymentDate
                                    },
                                    application: {
                                        id: res.data.application.id
                                    }
                                },
                                dataLayerName: 'dataLayer'
                            }
                            TagManager.dataLayer(tagManagerArgs)
                        }
                    })
                    //TAG MANAGER
                    return sendCodeBySMS(data, validToken)
                        .then(res => {})
                        .catch(err => console.log(err))
                }
                return loadLocalData()
            }
            let data = {
                idProduct,
                idCustomer: loggedUser.customerId,
                isNIP: true
            }
            //TAG MANAGER
            getAnalytics({idCustomer: data.idCustomer, idProduct}, validToken)
            .then(res => {
                if(res.data){
                    const tagManagerArgs = {
                        dataLayer: {
                            event: 'pageChange',
                            page: {
                                url: '/registration/nip-bureau',
                                referrer: '/registration/employment-details'
                            },
                            client: {
                                hFN: res.data.hFN,
                                hLN: res.data.hLN,
                                hTN: res.data.hTN,
                                hMA: res.data.hMA,
                                dateOfBirth: res.data.dateOfBirth,
                                returningClient: res.data.returningClient,
                                identifiedBy: res.data.identifiedBy,
                                registeredBy: res.data.registeredBy
                            },
                            loans: {
                                loansCount: res.data.loansCount
                            },
                            lastest_loan: {
                                status: res.data.status,
                                id: res.data.id,
                                repaymentDate: res.data.repaymentDate
                            },
                            application: {
                                id: res.data.application.id
                            }
                        },
                        dataLayerName: 'dataLayer'
                    }
                    TagManager.dataLayer(tagManagerArgs)
                }
            })
            //TAG MANAGER
            setCustomer({idCustomer: loggedUser.customerId, eMail: loggedUser.eMail, mobile: loggedUser.mobile})
            sendCodeBySMS(data, validToken)
                .then(res => {})
                .catch(err => console.log(err))
        }
        initialConfig()
    }, [])

    let fillDemo = () => {
        setNip(1234)
    }

    return (
        <div className={'register-form-container-full'}>
            <div onClick={fillDemo} className="fill-demo">DEMO</div>
            <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Ingresar</h1>
            <h2 style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '3rem'}}>NIP</h2>
            <div style={{borderBottom: '5px solid black', width: '50px'}}></div>
            <div style={{margin: '2rem 0'}}>
                <small>Hemos enviado un NIP de 4 dígitos como mensaje de texto a tu teléfono celular <strong>{customer && customer.mobile}</strong></small>
            </div>
            <div className={nipError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>NIP</strong></p>
                <div>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={e => setNip(e.target.value)} type='text' maxLength='4' value={nip}/>
                </div>
                {nipError ? <><small style={{color: 'red'}}>NIP incorrecto</small><br/></> : null}
                <small>Sólo espera un momento para recibir nuestro mensaje de texto.</small> <br/>
                <small>{sentBySMS ? <strong>Reenviado</strong> : <strong onClick={sendSMS} style={{cursor: 'pointer', color: '#A3CD3A'}}>Reenviar</strong>}</small><br/>
                <small>En caso de no recibirlo en 10 min por favor llama a (0155) 6717 0750</small>
            </div>
            <div onClick={handleSubmit} style={{width: '200px'}} className='btn-register'>{loading ? <BallBeat loading color={'white'}/> : 'CONTINUAR'}</div>
        </div>
    )
}
