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
    const [monto, setMonto] = useState(2000)
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
            let demoUser = await JSON.parse(sessionStorage.getItem('demoUser'))
            let getUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
            if(demoUser) return setUser(demoUser)
            if(getUser.eMail === 'demo@demo.com') return setUser(getUser)
            if(!getUser){
                let registration = await JSON.parse(sessionStorage.getItem('data-step-registration'))
                return loadLocal(registration)
            }
            setUser(getUser)
            return loadCustomer(getUser)
        }
        loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                                    min={1000} 
                                    max={8000} 
                                    value={monto} 
                                    labels={{1000:'$1,000', 8000: '$8,000'}} 
                                    step={1000} 
                                    orientation='horizontal' 
                                    tooltip={false}
                                    onChange={val => setMonto(val)}
                                />
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373', marginTop: '3rem', opacity: 0}}/>
                            {/* <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
                                <p>Periodicidad de pago</p>
                                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                    <button className={periodicidad === 'quincenal' ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => setPeriodicidad('quincenal')}>Quincenal</button>
                                    <button className={periodicidad === 'semanal' ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => setPeriodicidad('semanal')}>Semanal</button>
                                </div>
                            </div> */}
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='title-winput'>
                                <p>Plazo</p>
                                <div className="slider-input-wrapper">
                                    <input className="slider-input" type="text" value={plazo} readOnly/>
                                    <span style={{fontSize: '0.7rem'}} className="slider-input-unit">{periodicidad === 'quincenal' ? ' días' : ' semanas'}</span>
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
                                    min={periodicidad === 'quincenal' ? 7 : 4} 
                                    max={periodicidad === 'quincenal' ? 30 : 12} 
                                    value={plazo} 
                                    labels={periodicidad === 'quincenal' ? {7:'7', 30: '30'} : {4: '4', 12: '12'}} 
                                    orientation='horizontal' 
                                    tooltip={false}
                                    onChange={val => setPlazo(val)}
                                />
                            </div>
                        </div>
                    </div>
                    {error ? 
                        <div style={{height: '609px', padding: '3rem 2rem', textAlign: 'left', backgroundColor: '#A5CD39', color: 'white'}} className='right-dash-denied'>
                            <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Lo sentimos</h1>
                            <h2 style={{margin: '0', padding: '0 0 1rem', fontWeight: 200, fontSize: '3rem'}}>ocurrió un error, intenta más tarde</h2>
                        </div>
                        :
                        <div style={{height: '609px', padding: '3rem 2rem', textAlign: 'left', backgroundColor: '#A5CD39', color: 'white'}} className='right-dash-denied'>
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
                                <h2 style={{margin: '10px 0', padding: 0, fontWeight: 600, fontSize: '2rem'}}>Gracias por tu solicitud de préstamo</h2>
                                <svg width='250' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 940.345 105.351">
                                    <path fill-rule="evenodd" clip-rule="evenodd" fill="white" d="M156.178 73.759V31.606c0-17.448-14.148-31.605-31.609-31.605h-7.493v18.864c0 26.133-21.251 47.386-47.399 47.386H50.834v7.508c0 17.442 14.15 31.592 31.586 31.592h42.149c17.461 0 31.609-14.15 31.609-31.592"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" fill="white" d="M101.281 18.855V0h-18.86C64.985 0 50.835 14.156 50.835 31.607v18.847h18.849c17.455 0 31.597-14.154 31.597-31.599m-87.863-4.271H0v13.401c0 12.401 10.065 22.47 22.472 22.47h13.405V37.05c.001-12.412-10.054-22.466-22.459-22.466"/>
                                    <path fill="white" d="M269.253 31.359v70.884s.42 2.797 3.188 2.797h11.937s2.688-.21 2.688-3.02V31.359s.086-3.318-3.207-3.318h-11.833c0 .001-2.773-.207-2.773 3.318m44.291-3.266h-10.551s-3.828-.275-3.022 3.26c.831 3.557 17.702 63.609 17.702 63.609s3.429 9.947 16.193 9.947c12.741 0 15.496-9.682 15.496-9.682l17.834-62.784s1.367-4.625-1.918-4.625H352.52s-2.884.275-3.579 3.407c-.671 3.128-12.876 57.179-12.876 57.179s-.289 2.041-2.201 2.041c-1.924 0-2.612-2.316-2.612-2.316l-12.897-56.776c.002 0-.473-3.405-4.811-3.26m-112.665 0h-10.574s-3.823-.275-2.99 3.266c.798 3.563 17.687 63.717 17.687 63.717s3.425 9.964 16.184 9.964c12.758 0 15.507-9.699 15.507-9.699l17.822-62.89s1.378-4.633-1.92-4.633h-12.749s-2.893.275-3.577 3.413c-.677 3.133-12.888 57.275-12.888 57.275s-.278 2.044-2.194 2.044c-1.931 0-2.6-2.32-2.6-2.32l-12.914-56.871s-.46-3.411-4.794-3.266m178.123 2.649v47.334s.966 26.963 31.269 26.963c30.309 0 30.719-25.608 30.719-25.608v-48.29S441.391 28 437.972 28h-11.791s-2.6-.56-2.6 3.01v48.841s-1.521 10.132-13.169 10.132c-11.662 0-13.452-10.403-13.452-10.403V32.109s.283-4.25-3.15-4.25h-12.342c.001-.001-2.466-.001-2.466 2.883m124.406 12.375s-14.549-1.367-20.567-1.231c-6.039.142-9.749.817-9.749 5.165 0 4.369 5.356 6.35 9.609 8.819 4.809 2.805 15.891 9.022 19.176 12.016 3.319 2.986 7.567 7.623 7.567 15.923 0 8.304-4.395 16.199-12.481 19.051-8.105 2.86-23.188 2.181-29.351 1.225-6.187-.953-7.822-1.357-8.93-1.765-1.093-.408-2.61-1.229-2.61-3.555v-6.651s-.121-3.821 4.123-3.002c4.252.819 15.496 2.314 21.27 2.031 5.763-.268 9.732-.814 10.152-5.839.392-5.025-5.63-6.934-11.536-10.76-5.902-3.802-11.245-6.524-15.756-10.203-4.534-3.67-8.791-10.611-8.791-18.098 0-7.491 5.189-18.383 25.099-18.383 17.286 0 23.888 1.908 24.829 2.192.966.262 2.205.948 2.205 3.124 0 2.179.042 7.512.042 7.512s.365 2.963-4.301 2.429M269.253 3.467v11.405s.325 2.891 2.773 2.891h12.046s2.994.209 2.994-2.981V3.467s.511-3.182-3.709-3.182h-10.496c-4.007 0-3.608 3.182-3.608 3.182"/>
                                    <path fill="white" d="M539.748 104.295c-.409.409-.888.614-1.434.614h-11.982c-.547 0-1.042-.205-1.485-.614-.444-.41-.665-.887-.665-1.434V89.957c0-.546.221-1.007.665-1.383.443-.375.938-.563 1.485-.563h11.982c.546 0 1.024.188 1.434.563.41.376.614.837.614 1.383v12.904c0 .547-.204 1.024-.614 1.434zm59.246-1.739c-.376.304-.939.558-1.689.761-1.094.339-3.006.71-5.735 1.116-2.731.405-5.906.608-9.524.608-3.893 0-7.666-.542-11.317-1.622-3.653-1.081-6.879-2.889-9.678-5.424-2.801-2.535-5.054-5.862-6.76-9.985-1.707-4.121-2.561-9.19-2.561-15.206V60.029c0-6.014.854-11.083 2.561-15.206 1.706-4.121 3.959-7.434 6.76-9.935 2.799-2.5 6.024-4.291 9.678-5.373a39.66 39.66 0 0 1 11.317-1.622c3.618 0 6.793.204 9.524.613 2.729.408 4.642.783 5.735 1.121.75.206 1.313.444 1.689.716.374.272.563.782.563 1.53v9.9c0 1.358-.65 2.036-1.946 2.036h-.307a774.86 774.86 0 0 1-6.913-.507c-2.63-.203-5.377-.304-8.245-.304-1.775 0-3.431.253-4.967.758-1.536.507-2.885 1.418-4.045 2.733-1.162 1.315-2.066 3.068-2.714 5.261-.65 2.192-.974 4.973-.974 8.344v12.745c0 3.373.323 6.154.974 8.346.647 2.192 1.552 3.946 2.714 5.261 1.16 1.315 2.509 2.225 4.045 2.731 1.536.507 3.191.759 4.967.759 2.868 0 5.615-.101 8.245-.304 2.627-.203 4.932-.37 6.913-.507h.307c1.296 0 1.946.677 1.946 2.027v9.834c.001.743-.189 1.266-.563 1.57zm68.464-30.133c0 5.869-.784 10.863-2.353 14.978-1.568 4.116-3.714 7.473-6.44 10.07-2.728 2.598-5.931 4.487-9.611 5.668-3.681 1.179-7.635 1.771-11.859 1.771-4.227 0-8.181-.592-11.86-1.771-3.681-1.18-6.885-3.07-9.611-5.668-2.727-2.597-4.873-5.954-6.441-10.07-1.567-4.115-2.351-9.109-2.351-14.978V60.379c0-5.87.783-10.862 2.351-14.978 1.568-4.115 3.715-7.472 6.441-10.07 2.727-2.596 5.931-4.486 9.611-5.668 3.68-1.18 7.634-1.771 11.86-1.771 4.225 0 8.179.591 11.859 1.771 3.681 1.181 6.884 3.071 9.611 5.668 2.727 2.598 4.872 5.955 6.44 10.07 1.568 4.116 2.353 9.108 2.353 14.978v12.044zm-17.513-12.071c0-6.165-1.042-10.604-3.124-13.315-2.083-2.71-5.274-4.065-9.575-4.065-4.302 0-7.477 1.355-9.525 4.065-2.048 2.711-3.072 7.149-3.072 13.315V72.45c0 6.166 1.024 10.604 3.072 13.314 2.049 2.711 5.224 4.066 9.525 4.066s7.492-1.355 9.575-4.066c2.082-2.711 3.124-7.148 3.124-13.314V60.352zm98.881 44.246a2.398 2.398 0 0 1-1.178.311H734.13c-.479 0-.87-.208-1.178-.622a2.364 2.364 0 0 1-.461-1.451V59.612c0-.552-.171-.829-.512-.829-.274 0-.548.243-.819.726l-9.218 17.104c-.684 1.175-1.707 1.762-3.072 1.762h-8.193c-1.366 0-2.391-.587-3.072-1.762l-9.218-17.104c-.273-.483-.547-.726-.819-.726-.342 0-.512.277-.512.829v43.225c0 .553-.153 1.036-.461 1.451-.307.414-.701.622-1.178.622h-13.519c-.41 0-.804-.104-1.178-.311-.376-.207-.563-.586-.563-1.14V31.418c0-1.105.341-1.97 1.024-2.592.682-.622 1.569-.933 2.662-.933h9.628c2.048 0 3.549.933 4.506 2.799l15.669 29.542c.41.899.784 1.347 1.127 1.347.272 0 .648-.448 1.127-1.347l15.669-29.542c.955-1.866 2.458-2.799 4.507-2.799h9.627c1.091 0 1.979.329 2.662.985.682.657 1.024 1.538 1.024 2.643v71.937c.001.554-.188.933-.563 1.14zm110.667.138a2.398 2.398 0 0 1-1.178.311h-13.519c-.479 0-.87-.208-1.178-.622a2.364 2.364 0 0 1-.461-1.451V59.75c0-.552-.171-.829-.512-.829-.274 0-.548.243-.819.726l-9.218 17.104c-.684 1.175-1.707 1.762-3.072 1.762h-8.193c-1.366 0-2.391-.587-3.072-1.762l-9.218-17.104c-.273-.483-.547-.726-.819-.726-.342 0-.512.277-.512.829v43.225c0 .553-.153 1.036-.461 1.451-.307.414-.701.622-1.178.622h-13.519c-.41 0-.804-.104-1.178-.311-.376-.207-.563-.586-.563-1.14V31.556c0-1.105.341-1.97 1.024-2.592.682-.622 1.569-.933 2.662-.933h9.628c2.048 0 3.549.933 4.506 2.799l15.669 29.542c.41.899.784 1.347 1.127 1.347.272 0 .648-.448 1.127-1.347l15.669-29.542c.955-1.866 2.458-2.799 4.507-2.799h9.627c1.091 0 1.979.329 2.662.985.682.657 1.024 1.538 1.024 2.643v71.937c.001.554-.187.934-.562 1.14zm-81.428-.441c-.409.409-.888.614-1.434.614h-11.982c-.547 0-1.042-.205-1.485-.614-.444-.41-.665-.887-.665-1.434V89.957c0-.546.221-1.007.665-1.383.443-.375.938-.563 1.485-.563h11.982c.546 0 1.024.188 1.434.563.41.376.614.837.614 1.383v12.904c.001.547-.203 1.024-.614 1.434zm162.28-.422c0 .691-.45 1.036-1.347 1.036h-16.481c-.692 0-1.228-.12-1.606-.363-.381-.241-.743-.638-1.089-1.192l-13.475-21.871-12.128 21.353c-.346.622-.725 1.124-1.14 1.503-.414.381-.898.57-1.451.57h-15.341c-1.036 0-1.555-.449-1.555-1.347 0-.208.068-.449.208-.726l21.664-37.419-21.872-35.554c-.14-.275-.208-.483-.208-.622 0-.345.156-.656.467-.933a1.594 1.594 0 0 1 1.088-.415h16.689c.552 0 1.037.208 1.451.622.414.415.793.865 1.141 1.348l12.853 20.939 11.609-20.939a5.627 5.627 0 0 1 1.089-1.348c.449-.414.949-.622 1.503-.622h15.341c.414 0 .777.14 1.088.415.312.277.467.587.467.933 0 .139-.07.346-.208.622l-21.353 36.59 22.286 36.383c.207.415.31.762.31 1.037z"/>
                                </svg>
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
