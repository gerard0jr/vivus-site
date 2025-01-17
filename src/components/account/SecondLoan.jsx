import React, { useState, useEffect} from 'react'
import ReactTooltip from 'react-tooltip'
import { getToken, getCustomerByMail, getStatus, getProposal, getSimulation, getConfiguration, saveProposal, getAnalytics } from '../../services/api'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faTable, faDownload } from '@fortawesome/free-solid-svg-icons'
import { PopInformation } from '../register/PopInformation'
import cookie from 'react-cookies'
import Slider from 'react-rangeslider'
import { BallClipRotate } from 'react-pure-loaders'
import { momentEs } from '../../services/moment'
import TagManager from 'react-gtm-module'


const idProduct = 1

export const SecondLoan = (props) => {

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false) //CHANGE
    const [customer, setCustomer] = useState(null)
    const [amortizationTable, setAmortizationTable] = useState([])
    const [registerData, setRegisterData] = useState(null)
    const [monto, setMonto] = useState(1000)
    const [firstPaymentAmount, setFirstPaymentAmount] = useState(0)
    const [plazo, setPlazo] = useState(7)
    const [periodicidad, setPeriodicidad] = useState(3)
    const [cat, setCat] = useState(0)
    const [interesIVA, setInteresIVA] = useState(0)
    const [fecha, setFecha] = useState('dd/mm/aaaa')
    const [commision, setCommision] = useState(0)
    const [serverError, setServerError] = useState(false)
    const [idClient, setIdClient] = useState(0)
    const [loadingAmount, setLoadingAmount] = useState(false)

    let today = new Date()

    const simulate = async (amount, freq, term) => {
        let validToken = await cookie.load('token')
        if(!validToken){
            let response = await getToken()
            if(!response.data) return props.push('/error')
            if(response.data) validToken = response.data.token
        }       
        getSimulation(idProduct, amount, freq, term, idClient, validToken)
            .then(res => {
                const { data } = res
                if(res.status === 200){
                    setCat(data.cat)
                    setInteresIVA(data.interest)
                    setFirstPaymentAmount(data.firstPaymentAmount)
                    setFecha(data.firstDueDate) 
                    setLoading(false)
                    setAmortizationTable(data.amortizationTable)
                    setCommision(data.commision)
                }
            })
            .catch(err => console.log(err))
    }

    const finishProposal = async () => {
        setLoadingAmount(true)
        if(customer.eMail === 'demo@demo.com') return props.history.push('/pre-approved')
        let validToken = await cookie.load('token')
        if(!validToken){
            let response = await getToken()
            if(!response.data) return props.push('/error')
            if(response.data) validToken = response.data.token
        }
        saveProposal(idProduct, customer.customerId, monto, periodicidad, plazo, validToken)
            .then(res => {
                setLoadingAmount(false)
                if(res.status === 200){
                    return getStatus(idProduct, customer.customerId, false, validToken)
                    .then(res => {
                        if(res.data){
                            if(res.data.idStatus === 1){
                                if(res.data.idSubStatus === 195) {
                                    sessionStorage.setItem('customer-direct-step', JSON.stringify(5))
                                    if(props.repeater) return props.history.push('/repeated/application/complete')
                                    return props.history.push('/registration-complete')
                                }
                                if(props.repeater){
                                    if(res.data.idSubStatus === 196) return props.history.push('/repeated/credit-check')
                                    if(res.data.idSubStatus === 203) return props.history.push('/repeated/credit-check')
                                    if(res.data.idSubStatus === 206) return props.history.push('/dashboard/id')
                                    if(res.data.idSubStatus === 219) return props.history.push('/dashboard/id')
                                }
                                if(res.data.idSubStatus === 196) return props.history.push('/pre-approved')
                                if(res.data.idSubStatus === 203) return props.history.push('/pre-approved')
                                if(res.data.idSubStatus === 206) return props.history.push('/dashboard/id')
                                if(res.data.idSubStatus === 219) return props.history.push('/dashboard/id')
                            }
                            if(res.data.idStatus === 6){
                                if(props.repeater) return props.history.push('/repeated/application/pre-approved')
                                else if(res.data.idSubStatus === 15) return props.history.push('/application-complete')
                            }
                        }
                    })
                    // props.history.push('/pre-approved')
                }
                setServerError(true)
            })
            //TAG MANAGER
            getAnalytics({idCustomer: customer.customerId, idProduct}, validToken)
            .then(analytics => {
                if(analytics.data){
                    const tagManagerArgs = {
                        dataLayer: {
                            event: 'pageChange',
                            page: {
                                url: '/dashboard/welcome',
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
    }

    const proposal = (customerId, token) => {
        getProposal(idProduct, customerId, token)
        .then(res => {
            if(res.data){
                setMonto(res.data.amount)
                setPeriodicidad(res.data.opFrequency)
                setPlazo(res.data.term)
                return simulate(res.data.amount, res.data.opFrequency, res.data.term)
            }
            // setMonto(3000)
            // setPeriodicidad(3)
            // setPlazo(4)
            // sessionStorage.setItem('proposal', JSON.stringify({monto: 3000, periodicidad: 1, plazo: 4, idProduct}))
            // simulate(3000, 3, 7)
        })
    }

    const updateMonto = val => {
        setMonto(val)
    }

    const updatePlazo = val => {
        setPlazo(val)
    }

    // const updatePeriodicidad = val => {
    //     if(val === 2){
    //         if(plazo > 6) setPlazo(6)
    //     }
    //     if(val === 1){
    //         if(plazo < 4) setPlazo(4)
    //     }
    //     setPeriodicidad(val)
    // }

    useEffect(() => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
            if(demoUser) return 
        if(!loading) {
            simulate(monto, periodicidad, plazo)
            sessionStorage.setItem('proposal', JSON.stringify({monto, periodicidad, plazo, idProduct}))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monto, periodicidad, plazo])

    const loadLocalData = async () => {
        let localRegister = await JSON.parse(sessionStorage.getItem('data-step-registration'))
        if(!localRegister) return props.history.push('/login')
        let response = await getToken()
        const validToken = response.data.token
        getCustomerByMail(idProduct, localRegister.eMail, validToken)
            .then(res => {
                setIdClient(res.data.customerId)
                setCustomer(res.data)
                proposal(res.data.customerId, validToken)
            })
            .catch(err => console.log(err))
    }

    const getInitConfig = async () => {
        let validToken = await cookie.load('token')
        if(!validToken){
            let response = await getToken()
            if(!response.data) return props.push('/error')
            if(response.data) validToken = response.data.token
        }
        getConfiguration(idProduct, validToken)
            .then(res => {
                const { data } = res
                if(res.status === 200) {
                    let config = {
                        minAmount: data.minAmount,
                        maxAmount: data.maxAmount,
                        stepAmount: data.stepAmount,
                        minTermSem: data.frequencies[0].frequencyTerm.minTerm,
                        maxTermSem: data.frequencies[0].frequencyTerm.maxTerm
                    }
                    setRegisterData({sliderConfig:config})
                    setMonto(data.defaultAmount)
                    setPlazo(data.frequencies[0].frequencyTerm.defaultValue)
                    simulate(data.defaultAmount, idProduct, data.frequencies[1].frequencyTerm.defaultValue)
                    sessionStorage.setItem('proposal', JSON.stringify({idProduct, monto:data.defaultAmount, periodicidad:3, plazo:data.frequencies[0].frequencyTerm.defaultValue}))
                }
            })
            .catch(err => console.log(err))
    }

    const calcConfig = async () => {
        let validToken = await cookie.load('token')
        if(!validToken){
            let response = await getToken()
            if(!response.data) return props.push('/error')
            if(response.data) validToken = response.data.token
        }
        getConfiguration(idProduct, validToken)
            .then(res => {
                const { data } = res
                if(res.status === 200) {
                    let config = {
                        minAmount: data.minAmount,
                        maxAmount: data.maxAmount,
                        stepAmount: data.stepAmount,
                        minTermSem: data.frequencies[0].frequencyTerm.minTerm,
                        maxTermSem: data.frequencies[0].frequencyTerm.maxTerm
                    }
                    setRegisterData({sliderConfig:config})
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        const loadConfig = async () => {
            let getLocalProposal = await JSON.parse(sessionStorage.getItem('proposal'))
            if(!getLocalProposal) return getInitConfig()
            calcConfig()
            setMonto(getLocalProposal.monto)
            setPlazo(getLocalProposal.plazo)
            setPeriodicidad(getLocalProposal.periodicidad)
            return simulate(getLocalProposal.monto, getLocalProposal.periodicidad, getLocalProposal.plazo)
        }
        loadConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const initialConfig = async () => {
            let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
            const loggedUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
            if(!loggedUser) return props.history.push('/login')
            if(demoUser || loggedUser.eMail === 'demo@demo.com') {
                if(loggedUser && loggedUser.eMail === 'demo@demo.com') setCustomer(loggedUser)
                else setCustomer(demoUser)
                setRegisterData({
                  sliderConfig: {
                        minAmount: 1000,
                        maxAmount: 8000,
                        stepAmount: 1000,
                        minTermSem: 7,
                        maxTermSem: 30
                  }  
                })
                setMonto(2000)
                setPlazo(7)
                setPeriodicidad(3)
                setCat(321)
                setInteresIVA(500)
                setFirstPaymentAmount(new Date())
                setFecha(new Date()) 
                setCommision(120)
                setLoading(false)
                return
            }
            let response = await getToken()
            let validToken = response.data.token
            const checkUser = async (user) => {
                getStatus(idProduct, user.customerId, false, validToken)
                    .then(res =>{
                        if(res.status && res.data.idStatus === 1){
                            if(res.data.idSubStatus === 180) return props.history.push('/registration/personal-details')
                            if(res.data.idSubStatus === 181) return props.history.push('/registration/employment-details')
                            if(res.data.idSubStatus === 182) return props.history.push('/registration/nip-bureau')
                            if(res.data.idSubStatus === 183) return props.history.push('/registration/identity')
                            if(res.data.idSubStatus === 184) return props.history.push('/registration/identity')
                            if(res.data.idSubStatus === 185) return props.history.push('/registration/nip-bureau')
                            if(res.data.idSubStatus === 195) return props.history.push('/registration-complete')
                            if(res.data.idSubStatus === 196) return props.history.push('/pre-approved')
                            if(res.data.idSubStatus === 203) return props.history.push('/pre-approved')
                            if(res.data.idSubStatus === 206) return props.history.push('/dashboard/id')
                            if(res.data.idSubStatus === 217) return props.history.push('/application-complete')
                            if(res.data.idSubStatus === 218) return props.history.push('/application-complete')
                            if(res.data.idSubStatus === 219)return props.history.push('/application-complete')
                        }
                        if(res.status && res.data.idStatus === 4){
                            return props.history.push('/denied')
                        }
                        if(res.status && res.data.idStatus === 6){
                            return props.history.push('/application-complete')
                        }
                    })
            }
            let approved = sessionStorage.getItem('APP')
            if(approved === 'no') return props.history.push('/denied')
            if(!loggedUser){
                const emptyCustomer = await JSON.parse(sessionStorage.getItem('empty-customer'))
                if(emptyCustomer) {
                    let data = {
                        idProduct,
                    }
                    if(emptyCustomer.idCustomer){
                        data.idCustomer = emptyCustomer.idCustomer
                    }
                    else data.idCustomer = emptyCustomer.customerId
                    setIdClient(data.idCustomer)
                    checkUser(data.idCustomer)
                    setCustomer({customerId:data.idCustomer, eMail: emptyCustomer.eMail, mobile:emptyCustomer.mobile})
                    proposal(data.idCustomer, validToken)
                }
                return loadLocalData()
            }
            setCustomer(loggedUser)
            checkUser(loggedUser)
            setIdClient(loggedUser.customerId)
            proposal(loggedUser.customerId, validToken)
        }
        initialConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    let stepWidth = 23
    return (
        <>
            {!loading && registerData ?
            <div className='app-container'>
                <ReactTooltip place="left" type="dark" effect="float"/>
                <div className='loan-container'>
                    <div className="left-loan">

                        <div style={{width: '100%'}}>
                            <div className='title-winput-register'>
                                <p style={{fontWeight: 'bold'}}>Monto total</p>
                                <div className="slider-input-wrapper">
                                    <input className="slider-input" type="text" value={monto} readOnly/>
                                    <span className="slider-input-unit">$</span>
                                </div>
                            </div>
                            <div className='slider'>
                                <div className='slider-steps-loan'>
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
                                    min={registerData.sliderConfig.minAmount} 
                                    max={registerData.sliderConfig.maxAmount} 
                                    value={monto} 
                                    labels={{[registerData.sliderConfig.minAmount]:`$${registerData.sliderConfig.minAmount}`, [registerData.sliderConfig.maxAmount]:`$${registerData.sliderConfig.maxAmount}`}} 
                                    step={registerData.sliderConfig.stepAmount} 
                                    orientation='horizontal' 
                                    tooltip={false}
                                    onChange={val => updateMonto(val)}
                                />
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373', marginTop: '3rem', opacity: 0}}/>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='title-winput-register'>
                                <p style={{fontWeight: 'bold'}}>Plazo</p>
                                <div className="slider-input-wrapper">
                                    <input className="slider-input" type="text" value={plazo} readOnly/>
                                    <span style={{fontSize: '0.7rem'}} className="slider-input-unit">{periodicidad === 2 ? ' quincenas' : ' días'}</span>
                                </div>
                            </div>
                            <div className='slider'>
                                <div className='slider-steps-loan'>
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
                                    // En periodicidad, 1 es semanal, 2 es quincenal
                                    // En frequencies, 0 es semanal, 1 es quincenal
                                    // Preguntamos primero por perdiodicidad quincenal
                                    min={periodicidad === 2 ? registerData.sliderConfig.minTermQuin : registerData.sliderConfig.minTermSem}
                                    max={periodicidad === 2 ? registerData.sliderConfig.maxTermQuin : registerData.sliderConfig.maxTermSem}
                                    value={plazo} 
                                    labels={periodicidad === 2 ? //{1:'1', 6:'6'} : {1:'1', 12:'12'}
                                                {[registerData.sliderConfig.minTermQuin]:`${registerData.sliderConfig.minTermQuin}`, 
                                                [registerData.sliderConfig.maxTermQuin]: `${registerData.sliderConfig.maxTermQuin}`} 
                                                : 
                                                {[registerData.sliderConfig.minTermSem]:`${registerData.sliderConfig.minTermSem}`, 
                                                [registerData.sliderConfig.maxTermSem]: `${registerData.sliderConfig.maxTermSem}`} 
                                    }
                                    orientation='horizontal' 
                                    tooltip={false}
                                    onChange={val => updatePlazo(val)}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="right-loan">
                        <div className='calculator-info-loan'>
                            <div className="loan-title">
                                <div className='loan-left-title'>
                                    <p><strong>Monto del</strong></p>
                                    <p>Préstamo</p>
                                </div>
                                <div className='loan-right-title'>
                                    <p>{monto.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<span>MXN</span></p>
                                </div>
                            </div>
                            <div className='info-row-register'>
                                <p>Préstamo</p>
                                <p>{monto.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='info-row-register'>
                                <p>Plazo</p>
                                <p>{plazo} {periodicidad === 2 ? 'quincenas' : 'días'}</p>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='info-row-register'>
                                <p>Interés</p>
                                <div>
                                    <p>{interesIVA.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                                </div>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='info-row-register'>
                                <p>Comisión por disposición</p>
                                <div>
                                    <p>{commision.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                                </div>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='info-row-register'>
                                <p><strong>Monto total a pagar</strong></p>
                                <div>
                                    <p><strong>{(firstPaymentAmount).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></strong></p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                                </div>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='info-row-register'>
                                <p><strong>Fecha de pago</strong></p>
                                <p><strong>{momentEs(fecha).format('D/MMM/Y')}</strong></p>
                            </div>
                            <div className='cat-prom' style={{textAlign: 'left'}}>
                                <b>CAT: {cat}%</b> promedio sin IVA para fines informativos y de comparación exclusivamente. <br/>Fecha de cálculo: {momentEs(today).format('D/MMM/Y')}<br/><br/>
                                Calculadora para fines informativos y de comparación.
                            </div>
                            <div className='amortization-loan-button'>
                                {/* <div style={{margin: '0 auto'}} className='amortization-button'>
                                    <div style={{textAlign: 'left', padding: '0 1rem'}}>
                                        <p>Tabla de amortización</p>
                                        <p onClick={() => setOpen(true)} style={{color: '#A3CD3A', cursor: 'pointer'}}>Abrir <FontAwesomeIcon icon={faDownload}/></p>
                                    </div>
                                    <div style={{backgroundColor: '#f1f1f1', padding: '1rem', fontSize: '1.5rem', color: '#A3CD3A', borderRadius: '0 10px 10px 0'}}>
                                        <FontAwesomeIcon icon={faTable}/>
                                    </div>
                                </div> */}
                                <p onClick={finishProposal} style={{width: '50%', padding: '1rem 0'}} className="btn">{loadingAmount ? <BallClipRotate loading color='white'/> : 'SOLICÍTALO YA'}</p>
                            </div>
                            {serverError ? <p style={{padding: '2rem 0 1rem', color: 'red'}}>Ocurrió un problema, intenta nuevamente</p> : null}
                        </div>
                    </div>
                </div>
                <div className='calc-popup'>
                    <PopInformation style={{margin: 'auto'}} open={open} close={() => setOpen(false)} amortizationTable={amortizationTable}/>
                </div>
            </div>
            :
            <div className='app-container'>
                <div style={{margin: '1rem auto'}} className='register-calculator'>
                    <div className='register-slider-container-go' style={{textAlign: 'center'}}>
                        <BallClipRotate loading color={'white'}/>
                    </div>
                    <div className='calculator-info'>
                        <h2 style={{textAlign: 'center'}}>Cargando datos...</h2>
                    </div>
                </div>
            </div>
            }
        </>
    )
}
