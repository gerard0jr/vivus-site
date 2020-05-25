import React, {useState, useEffect} from 'react'
import '../account/newStyles.scss'
import { withRouter } from 'react-router-dom'
import Slider from 'react-rangeslider'
import { BallClipRotate } from 'react-pure-loaders'
import { getToken, getStatus, getCustomerByMail, getAnalytics } from '../../services/api'
import TagManager from 'react-gtm-module'

const idProduct = 1

const DeniedDash = (props) => {
    let stepWidth = 25
    const [user, setUser] = useState(null)
    const [monto, setMonto] = useState(6000)
    const [plazo, setPlazo] = useState(6)
    const [periodicidad, setPeriodicidad] = useState('quincenal')
    const [dias, setDias] = useState(null)
    const [error, setError] = useState(false)

    const loadCustomer = async (user) => {
        let response = await getToken()
        if(!response) return
        let validToken = response.data.token
        getStatus(idProduct, user.customerId, false, validToken)
            .then(res => {
                if(res.status === 200){
                    if(res.data.idStatus === 1){
                        return props.history.push('/registration')
                    }
                    if(res.data.idStatus === 4){
                        if(res.data.penaltyDays === 0) return props.history.push('/dashboard')
                        return setDias(res.data.penaltyDays)
                    }
                    return
                }
                setError(true)
                //TAG MANAGER
                getAnalytics({idCustomer: res.data.customerId, idProduct}, validToken)
                .then(analytics => {
                    if(analytics.data){
                        const tagManagerArgs = {
                            dataLayer: {
                                event: 'pageChange',
                                page: {
                                    url: '/denied',
                                    referrer: sessionStorage.getItem('utm') || '/'
                                },
                                client: {
                                    hFN: analytics.data.hFn,
                                    hLN: analytics.data.hLN,
                                    hTN: analytics.data.hTN,
                                    hMA: analytics.data.hMA,
                                    dateOfBirth: analytics.data.dateOfBirth,
                                    returningClient: analytics.data.returningClient,
                                    identifiedBy: analytics.data.identifiedBy,
                                    registeredBy: analytics.data.registeredBy
                                },
                                loans: {
                                    loansCount: analytics.data.loansCount
                                },
                                lastest_loan: {
                                    status: analytics.data.status,
                                    id: analytics.data.id,
                                    repaymentDate: analytics.data.repaymentDate
                                },
                                application: {
                                    id: analytics.data.application.id
                                }
                            },
                            dataLayerName: 'dataLayer'
                        }
                        TagManager.dataLayer(tagManagerArgs)
                    }
                })
                //TAG MANAGER
            })
            .catch(err => setError(true))
    }

    const loadLocal = async (localRegister) => {
        if(localRegister){
            let response = await getToken()
            const validToken = response.data.token
            getCustomerByMail(idProduct, localRegister.eMail, validToken)
                .then(res => {
                    setUser(res.data)
                    getStatus(idProduct, res.data.customerId, false, validToken)
                        .then(res => {
                            if(res.status === 200){
                                if(res.data.idStatus === 1){
                                    return props.history.push('/registration')
                                }
                                if(res.data.idStatus === 4){
                                    return setDias(res.data.penaltyDays)
                                }
                                return
                            }
                            setError(true)
                        })
                        .catch(err => setError(true))
                        //TAG MANAGER
                        getAnalytics({idCustomer: res.data.customerId, idProduct}, validToken)
                        .then(analytics => {
                            if(analytics.data){
                                const tagManagerArgs = {
                                    dataLayer: {
                                        event: 'pageChange',
                                        page: {
                                            url: '/denied',
                                            referrer: sessionStorage.getItem('utm') || '/'
                                        },
                                        client: {
                                            hFN: analytics.data.hFn,
                                            hLN: analytics.data.hLN,
                                            hTN: analytics.data.hTN,
                                            hMA: analytics.data.hMA,
                                            dateOfBirth: analytics.data.dateOfBirth,
                                            returningClient: analytics.data.returningClient,
                                            identifiedBy: analytics.data.identifiedBy,
                                            registeredBy: analytics.data.registeredBy
                                        },
                                        loans: {
                                            loansCount: analytics.data.loansCount
                                        },
                                        lastest_loan: {
                                            status: analytics.data.status,
                                            id: analytics.data.id,
                                            repaymentDate: analytics.data.repaymentDate
                                        },
                                        application: {
                                            id: analytics.data.application.id
                                        }
                                    },
                                    dataLayerName: 'dataLayer'
                                }
                                TagManager.dataLayer(tagManagerArgs)
                            }
                        })
                        //TAG MANAGER
                })
                .catch(err => setError(true))
        }
    }

    useEffect(() => {
        const loadUser = async () => {
            let getUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
            if(!getUser){
                let registration = await JSON.parse(sessionStorage.getItem('data-step-registration'))
                return loadLocal(registration)
            }
            setUser(getUser)
            return loadCustomer(getUser)
        }
        loadUser()
    }, [])
    
    return (
        <div className='app-container'>
            {user ? 
            <div style={{textAlign: 'center', justifyContent: 'center'}}>
                <strong><h2 style={{margin: '2rem 0'}}>TU CUENTA</h2></strong>
                <div className='account-container-denied'>
                    <div className='left-dash-denied'>
                        <div style={{height: '640px'}} className='slider-container'>
                            <h2>Solicita un</h2>
                            <h3>nuevo préstamo</h3>
                            <div className='title-winput'>
                                <p>Monto total</p>
                                <div className="slider-input-wrapper">
                                    <input className="slider-input" type="text" value={monto} readOnly/>
                                    <span className="slider-input-unit">$</span>
                                </div>
                            </div>
                            <div className='slider'>
                                <div style={{top: '0.4rem'}} className='slider-steps'>
                                    <span className='step'></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                </div>
                                <Slider 
                                    min={3000} 
                                    max={9000} 
                                    value={monto} 
                                    labels={{3000:'$3,000', 9000: '$9,000'}} 
                                    step={1000} 
                                    orientation='horizontal' 
                                    tooltip={false}
                                    onChange={val => setMonto(val)}
                                />
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373', marginTop: '3rem'}}/>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
                                <p>Periodicidad de pago</p>
                                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                    <button className={periodicidad === 'quincenal' ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => setPeriodicidad('quincenal')}>Quincenal</button>
                                    <button className={periodicidad === 'semanal' ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => setPeriodicidad('semanal')}>Semanal</button>
                                </div>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='title-winput'>
                                <p>Plazo</p>
                                <div className="slider-input-wrapper">
                                    <input className="slider-input" type="text" value={plazo} readOnly/>
                                    <span style={{fontSize: '0.7rem'}} className="slider-input-unit">{periodicidad === 'quincenal' ? ' quincenas' : ' semanas'}</span>
                                </div>
                            </div>
                            <div className='slider'>
                                <div style={{top: '0.4rem'}} className='slider-steps'>
                                    <span className='step'></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                    <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                                </div>
                                <Slider 
                                    min={periodicidad === 'quincenal' ? 2 : 4} 
                                    max={periodicidad === 'quincenal' ? 6 : 12} 
                                    value={plazo} 
                                    labels={periodicidad === 'quincenal' ? {2:'2', 6: '6'} : {4: '4', 12: '12'}} 
                                    orientation='horizontal' 
                                    tooltip={false}
                                    onChange={val => setPlazo(val)}
                                />
                            </div>
                        </div>
                    </div>
                    {error ? 
                        <div style={{height: '609px', padding: '3rem 2rem', textAlign: 'left', backgroundColor: '#A3CD3A', color: 'white'}} className='right-dash-denied'>
                            <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Lo sentimos</h1>
                            <h2 style={{margin: '0', padding: '0 0 1rem', fontWeight: 200, fontSize: '3rem'}}>ocurrió un error, intenta más tarde</h2>
                        </div>
                        :
                        <div style={{height: '609px', padding: '3rem 2rem', textAlign: 'left', backgroundColor: '#A3CD3A', color: 'white'}} className='right-dash-denied'>
                            <div>
                                <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Te esperamos</h1>
                                <h2 style={{margin: '0', padding: '0 0 1rem', fontWeight: 200, fontSize: '3rem'}}>de vuelta pronto</h2>
                            </div>
                            <div style={{margin: '4rem 0'}}>
                                <p style={{fontSize: '2rem'}}>
                                    Desafortunadamente en esta ocasión no podremos otorgarte un préstamo de acuerdo a nuestra política de créditos.
                                    No te preocupes, por que puedes realizar nuevamente una solicitud en <strong>{dias ? dias : 'Cargando...'} días</strong>
                                </p>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <h2 style={{margin: '0', padding: 0, fontWeight: 600, fontSize: '2rem'}}>Gracias por tu solicitud de préstamo</h2>
                                <img width='200px' src="/img/white-logo.png" alt="efectigo"/>
                            </div>
                        </div>
                    }
                </div>
                <br/>
            </div>
            :
            <BallClipRotate loading color={'#A8CC46'}/>
            }
            </div>
    )
}

export default withRouter(DeniedDash)
