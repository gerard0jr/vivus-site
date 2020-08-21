import React, { useState, useEffect } from 'react'
import { BallBeat } from 'react-pure-loaders'
import { getToken, getCustomerByMail, setBureauAuthorization, getAnalytics } from '../../../services/api'
import TagManager from 'react-gtm-module'

const idProduct = 1

export const Identity = ({props, setCurrentStep}) => {

    const [loading, setLoading] = useState(false)
    const [customer, setCustomer] = useState(null)
    const [authorized, setAuthorized] = useState(false)
    const [nip, setNip] = useState(null)
    const [nipError, setNipError] = useState(null)

    const handleSubmit = async () => {
        if(customer.eMail === 'demo@demo.com') return props.history.push('/registration-complete')
        if(!authorized) return
        if(!nip) return setNipError(true)
        if(nip.length > 4) return setNipError(true)
        setLoading(true)
        let response = await getToken()
        let validToken = response.data.token
        let data = {
            idProduct,
            idCustomer: customer.customerId,
            nipCode: nip,
            authorized,
            isNIP: false,
            userAgent: navigator.userAgent,
            ip: '192.868.1.254',
            coordinates: '92.76, -98.54'
          }
        setBureauAuthorization(data, validToken)
            .then(res => {
                if(res.status === 200){
                    setNipError(false)
                    setLoading(false)
                    return props.history.push('/registration-complete')
                }
            })
            .catch(err => {
                setNipError(true)
                setLoading(false)
            })
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
                                    url: '/registration/identity',
                                    referrer: '/registration/nip-bureau'
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
            const validToken = response.data.token
            sessionStorage.removeItem('customer-direct-step')
            sessionStorage.setItem('session-step', 4)
            const loggedUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
            if(!loggedUser){
                const emptyCustomer = await JSON.parse(sessionStorage.getItem('empty-customer'))
                if(emptyCustomer) {
                    if(emptyCustomer.idCustomer){
                        //TAG MANAGER
                        getAnalytics({idCustomer: emptyCustomer.idCustomer, idProduct}, validToken)
                        .then(res => {
                            if(res.data){
                                const tagManagerArgs = {
                                    dataLayer: {
                                        event: 'pageChange',
                                        page: {
                                            url: '/registration/identity',
                                            referrer: '/registration/nip-bureau'
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
                        return setCustomer({customerId:emptyCustomer.idCustomer, eMail: emptyCustomer.eMail})
                    }
                    //TAG MANAGER
                    getAnalytics({idCustomer: emptyCustomer.customerId, idProduct}, validToken)
                    .then(res => {
                        if(res.data){
                            const tagManagerArgs = {
                                dataLayer: {
                                    event: 'pageChange',
                                    page: {
                                        url: '/registration/identity',
                                        referrer: '/registration/nip-bureau'
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
                    return setCustomer({customerId:emptyCustomer.customerId, eMail: emptyCustomer.eMail})
                }
                return loadLocalData()
            }
            //TAG MANAGER
            getAnalytics({idCustomer: loggedUser.customerId, idProduct}, validToken)
            .then(res => {
                if(res.data){
                    const tagManagerArgs = {
                        dataLayer: {
                            event: 'pageChange',
                            page: {
                                url: '/registration/identity',
                                referrer: '/registration/nip-bureau'
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
            setCustomer(loggedUser)
        }
        initialConfig()
    }, [])

    let fillDemo = () => {
        setAuthorized(true)
        setNip(1234)
    }

    return (
        <div className='register-form-container-full'>
            {/* <div onClick={fillDemo} className="fill-demo">DEMO</div> */}
            <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Autorización consulta</h1>
            <h2 style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '3rem'}}>de historial crediticio</h2>
            <div style={{borderBottom: '5px solid black', width: '50px'}}></div>
            <div style={{margin: '2rem 0 0'}}>
                <small>Para continuar y si estás de acuerdo con la consulta de tu historial crediticio da un click en la siguiente casilla y vuelve a ingresar el mismo NIP que te enviamos previamente</small>
            </div>
            <div className='buro-acepto'>
                <div className='educacion-fin'>
                    <input onChange={() => setAuthorized(!authorized)} type='checkbox' name='educacion' checked={authorized} value={authorized}/>
                    <p style={{marginLeft: '1rem', marginBottom: '1rem'}}>Acepto la consulta de mi Buró de Crédito</p>
                </div>
                <p className='buro-terminos'>Por este medio, declaro bajo protesta de decir verdad, que la información proporcionada a 4finance, S.A. de C.V. SOFOM ENR en este formato electrónico es verdadera y precisa, por este medio libero a 4finance, S.A. de C.V. SOFOM ENR de cualquier responsabilidad en relación con la misma. Por este medio autorizo a 4finance, S.A. de C.V. SOFOM ENR para realizar mediante sus representantes o cualquier otra persona autorizada para tal propósito, cualquier investigación sobre mi historial crediticio o del historial crediticio de la persona que por este medio represento ante Círculo de Crédito S.A. de C.V. Sociedad de Información Crediticia y/o Trans Union de México S.A. Sociedad de Información Crediticia. Además, por este medio declaro que estoy consciente del alcance de las actividades realizadas por las sociedades de información crediticia y del uso y propósitos de la información crediticia que obtendrá 4finance, S.A. de C.V. SOFOM ENR como se refleja en el reporte de crédito correspondiente. Por este medio, consiento el estar vinculado por esta autorización por un periodo de tres años empezando en esta fecha y en cualquier caso, durante el tiempo en que la relación jurídica con 4finance S.A. de C.V. SOFOM ENR sea válida. Por este medio, consiento que 4finance S.A. de C.V. SOFOM ENR, Círculo de Créditos S.A. de C.V: Sociedad de Información Crediticia y/o Trans Union de México S.A., Sociedad de Información  Crediticia tendrán en custodia este documento de acuerdo con el artículo 28 de la ley para regular las sociedades de información crediticia</p>
            </div>
            <div className={nipError ? 'input-div input-error' : 'input-div'}>
                <p><strong>El cliente autoriza a 4FINANCE, S.A. de C.V., SOFOM E.N.R. la utilización de medios electrónicos de autentificación, tales como el NIP.</strong></p>
                <br/>
                <p style={{fontWeight: 'bold'}}><strong>Ingresa NUEVAMENTE el mismo NIP que te mandamos aquí:</strong></p>
                <div>
                    <input style={{width: '100px', padding: '0.6rem', fontSize: '1rem'}} onChange={e => setNip(e.target.value)} type='text' maxLength='4' value={nip}/>
                </div>
            </div>
            <div onClick={handleSubmit} style={authorized ? {width: '200px'} : {width: '200px', backgroundColor: 'lightgray', cursor: 'default'}} className='btn-register'>{loading ? <BallBeat loading color={'white'}/> : 'CONTINUAR'}</div>
        </div>
    )
}
