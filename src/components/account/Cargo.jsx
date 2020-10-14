import React, {useState, useEffect} from 'react'
import './newStyles.scss'
import { withRouter, Link } from 'react-router-dom'
import { getFilledContract, getToken, getCustomerByMail, getStatus, getProposal, getSimulation, setContractAuthorization, getAnalytics, setDirectDebitAuthorization } from '../../services/api'
import { momentEs } from '../../services/moment'
import publicIp from 'public-ip'
import TagManager from 'react-gtm-module'
import Popup from "reactjs-popup"
import { useMediaQuery } from 'react-responsive'
import { BallClipRotate } from 'react-pure-loaders'

const idProduct = 1

const Cargo = (props) => {
    
    const [customer, setCustomer] = useState(null)

    const [loadingConfirm, setLoadingConfirm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [directDebitError, setDirectDebitError] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(true)
    const [contract, setContract] = useState(null)
    const [balance, setBalance] = useState({
        amount: 0,
        creditLimitUsed:0,
        installments: [{ idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}],
        term: 0,
        commision: 0, 
        idFrequency: 3,
        curentInstallment: {
            paymentValue: 0
        }
    })

    const [open, setOpen] = useState(false)

    const goTo = async () => {
        if(customer.eMail === 'demo@demo.com') return props.history.push('/dashboard/id')
        setLoadingConfirm(true)
        const onCoords = async ({coords, timestamp}) => {
            const myIp = await publicIp.v4()
            if(myIp){
                sessionStorage.setItem('ip', myIp)
                sessionStorage.setItem('coords', coords.latitude + ', ' +  coords.longitude + ', ' + timestamp)
                const data = {
                    idProduct,
                    idCustomer: customer.customerId,
                    authorized: termsAccepted,
                    userAgent: navigator.userAgent,
                    ip: myIp,
                    coordinates: coords.latitude + ', ' +  coords.longitude + ', ' + timestamp
                }
                let response = await getToken()
                const validToken = response.data.token
                setContractAuthorization(data, validToken)
                    .then(res => {
                        if(res.status === 200){
                            setLoadingConfirm(false)
                            // if(res.data.codigo === '200') return props.history.push('/dashboard/confirm')
                            if(res.data.codigo === '200') {
                                let coords = sessionStorage.getItem('coords')
                                if(!coords) coords = 'Location blocked'
                                const debitData = {
                                    userAgent: navigator.userAgent,
                                    ip: myIp,
                                    authorized: true,
                                    coordinates: coords,
                                    idProduct,
                                    idCustomer: customer.customerId
                                }
                                setDirectDebitAuthorization(debitData, validToken)
                                    .then(res => {
                                        getStatus(idProduct, customer.customerId, false, validToken)
                                            .then(response => {
                                                if(response.status === 200){
                                                    if(response.data.idSubStatus === 15) return props.history.push('/application-complete')
                                                    if(response.data.idSubStatus === 218) return props.history.push('/application-complete')
                                                    if(response.data.idSubStatus === 219) return props.history.push('/dashboard/id')
                                                    if(response.data.idSubStatus === 206) return props.history.push('/dashboard/id')
                                                    return props.history.push('/dashboard/id')
                                                }
                                                return props.history.push('/dashboard/id')
                                            })
                                    })
                                    .catch(err => {
                                        if(err.response.status === 400){
                                            setLoadingConfirm(false)
                                            setDirectDebitError(true)
                                        }
                                    })
                                    return
                            }
                        }
                    })
                    .catch(err => {
                        if(err.response.status === 400){
                            setLoadingConfirm(false)
                            setServerError(true)
                        }
                    })
            }
        }
        const onErr = async (err) => {
            const myIp = await publicIp.v4()
            if(myIp){
                sessionStorage.setItem('ip', myIp)
                sessionStorage.setItem('coords', err)
                const data = {
                    idProduct,
                    idCustomer: customer.customerId,
                    authorized: termsAccepted,
                    userAgent: navigator.userAgent,
                    ip: myIp,
                    coordinates: err.message
                }
                let response = await getToken()
                const validToken = response.data.token
                setContractAuthorization(data, validToken)
                    .then(res => {
                        if(res.status === 200){
                            setLoadingConfirm(false)
                            // if(res.data.codigo === 200) return props.history.push('/dashboard/confirm')
                            if(res.data.codigo === 200) {
                                let coords = sessionStorage.getItem('coords')
                                if(!coords) coords = 'Location blocked'
                                const debitData = {
                                    userAgent: navigator.userAgent,
                                    ip: myIp,
                                    authorized: true,
                                    coordinates: coords,
                                    idProduct,
                                    idCustomer: customer.customerId
                                }
                                setDirectDebitAuthorization(debitData, validToken)
                                    .then(res => {
                                        getStatus(idProduct, customer.customerId, false, validToken)
                                        .then(response => {
                                            if(response.status === 200){
                                                if(response.data.idSubStatus === 15) return props.history.push('/application-complete')
                                                if(response.data.idSubStatus === 218) return props.history.push('/application-complete')
                                                if(response.data.idSubStatus === 219) return props.history.push('/dashboard/id')
                                                if(response.data.idSubStatus === 206) return props.history.push('/dashboard/id')
                                                return props.history.push('/dashboard/id')
                                            }
                                            if(response.status === 400) return setDirectDebitError(true)
                                            return props.history.push('/dashboard/id')
                                        })
                                    })
                                    .catch(err => setServerError(true))
                                return
                            }
                        }
                        setLoadingConfirm(false)
                        setServerError(true)
                    })
                    .catch(err => {
                        setLoadingConfirm(false)
                        setServerError(true)
                    })
            }
        }
        navigator.geolocation.getCurrentPosition(onCoords, onErr)
    }

    const fillContract = async (idCustomer, token) => {

        let contRes = await getFilledContract({idProduct, idCustomer}, token)
        if(contRes.data){
            setContract(contRes.data.document)
        }
        return setLoading(false)
    }

    const getBalance = (idCustomer, token) => {
        getProposal(idProduct, idCustomer, token)
            .then(res => {
                if(res.status === 200){
                    getSimulation(idProduct, res.data.amount, res.data.opFrequency, res.data.term, idCustomer, token)
                        .then(resSim => {
                            setBalance({...balance, 
                                amount: res.data.amount,
                                creditLimitUsed: res.data.creditLimit,
                                term: res.data.term,
                                idFrequency: res.data.opFrequency,
                                startDate: resSim.data.startDate,
                                installments: resSim.data.amortizationTable,
                                commision: resSim.data.commision,
                                curentInstallment: {
                                    paymentValue: resSim.data.firstPaymentAmount
                                }
                            })
                            //TAG MANAGER
                            getAnalytics({idCustomer, idProduct}, token)
                            .then(analytics => {
                                if(analytics.data){
                                    const tagManagerArgs = {
                                        dataLayer: {
                                            event: 'pageChange',
                                            page: {
                                                url: '/pre-approved',
                                                referrer: '/'
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
                        .catch(err => console.log(err))
                }
            })
            .catch(err => {})
    }

    const loadLocalData = async () => {
        let localRegister = await JSON.parse(sessionStorage.getItem('data-step-registration'))
        if(!localRegister) return props.history.push('/login')
        let response = await getToken()
        const validToken = response.data.token
        getCustomerByMail(idProduct, localRegister.eMail, validToken)
            .then(res => {
                setCustomer(res.data)
                fillContract(res.data.customerId, validToken)
                getBalance(res.data.customerId, validToken)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        const initialConfig = async () => {
            let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
            const loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
            if(demoUser || (loggedUser && loggedUser.eMail === 'demo@demo.com')){
                let dummyData = {
                    amount: 2500,
                    creditLimitUsed: 2500,
                    term: 3,
                    idFrequency: 1,
                    startDate: new Date(),
                    installments: [
                        {idDeferral: 1, dueDate: new Date(), paymentValue: 200, interest: 25},
                        {idDeferral: 2, dueDate: new Date(), paymentValue: 200, interest: 25},
                        {idDeferral: 3, dueDate: new Date(), paymentValue: 200, interest: 25},
                        {idDeferral: 4, dueDate: new Date(), paymentValue: 200, interest: 25}
                    ],
                    commision: 100,
                    curentInstallment: {
                        idDeferral: 1,
                        principalBalance: 500,
                        interest: 250,
                        paymentValue: 560,
                        dueDate: new Date()
                    }
                }
                setBalance(dummyData)
                if(loggedUser && loggedUser.eMail==='demo@demo.com') return setCustomer(loggedUser)
                return setCustomer(demoUser)
            }
            let response = await getToken()
            let validToken = response.data.token
            const checkUser = async (user) => {
                if(user.idCustomer){
                    getStatus(idProduct, user.idCustomer, false, validToken)
                        .then(res =>{
                            if(res.status && res.data.idStatus === 1){
                                if(res.data.idSubStatus === 180) return props.history.push('/registration/personal-details')
                                if(res.data.idSubStatus === 181) return props.history.push('/registration/employment-details')
                                if(res.data.idSubStatus === 182) return props.history.push('/registration/nip-bureau')
                                if(res.data.idSubStatus === 183) return props.history.push('/registration/identity')
                                if(res.data.idSubStatus === 184) return props.history.push('/registration/identity')
                                if(res.data.idSubStatus === 185) return props.history.push('/registration/nip-bureau')
                                if(res.data.idSubStatus === 195) return props.history.push('/registration-complete')
                                if(res.data.idSubStatus === 196) return 
                                if(res.data.idSubStatus === 203) return 
                                if(res.data.idSubStatus === 206) return props.history.push('/dashboard/id')
                                if(res.data.idSubStatus === 217) return props.history.push('/dashboard/confirm')
                                if(res.data.idSubStatus === 218) return props.history.push('/application-complete')
                                if(res.data.idSubStatus === 219) return props.history.push('/application-complete')
                            }
                            if(res.status && res.data.idStatus === 4){
                                return props.history.push('/denied')
                            }
                            else return
                        })
                }
                else getStatus(idProduct, user.customerId, false, validToken)
                    .then(res =>{
                        if(res.status && res.data.idStatus === 4){
                            return props.history.push('/denied')
                        }
                        else return
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
                    checkUser(data)
                    setCustomer({customerId:data.idCustomer, eMail: emptyCustomer.eMail, mobile:emptyCustomer.mobile})
                    fillContract(data.idCustomer, validToken)
                    return getBalance(data.idCustomer, validToken)
                }
                return loadLocalData()
            }
            setCustomer(loggedUser)
            checkUser(loggedUser)
            fillContract(loggedUser.customerId, validToken)
            getBalance(loggedUser.customerId, validToken)
        }
        initialConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const checkMobile = useMediaQuery({ query: '(max-device-width: 700px)' })

    let fillDemo = () => {
        setLoading(false)
        setTermsAccepted(true)
    }

    return (
        <div className='app-container'>
            <div onClick={fillDemo} className="fill-demo">DEMO</div>
            <Popup onClose={() => setOpen(false)} open={open} position="right center">
                <iframe style={{width:'100%', height:'85%'}} src={`data:application/pdf;base64,${contract}`} title='Contract' frameborder="0"></iframe>
                <div className='button-container'>
                    <a title='Descargar contrato' download='Contrato' href={`data:application/pdf;base64,${contract}`} style={{color: 'black', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => {setTermsAccepted(true);setOpen(false)}}>Descargar Contrato</a>
                </div>
                <div className='button-container'>
                    <p className='btn-register' onClick={() => {setTermsAccepted(true);setOpen(false)}}>Estoy de acuerdo</p>
                    <p className='btn-register' style={{marginLeft: '1rem', backgroundColor: 'lightgray'}} onClick={() => setOpen(false)}>Cerrar</p>
                </div>
            </Popup>
            <div className='cargo-container'>
                <div className='contract-layer'>
                    <div>
                        {/* <h2>Por favor lee y acepta el contrato del préstamo</h2> */}
                        {checkMobile ? 
                        <div className='check-contrato'>
                            <input onClick={() => setOpen(true)} disabled={loading} checked={termsAccepted} type='checkbox' name='educacion' value='educacion'/>
                            <span>{'ACEPTAR Y CONTINUAR'}</span>
                            {loading ? <span>Cargando contrato...</span> : <a title='Descargar contrato' download='Contrato' href={`data:application/pdf;base64,${contract}`} style={{color: 'black', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setTermsAccepted(true)}><u><strong>Abrir contrato</strong></u></a>}
                        </div>
                        :
                        <div className='check-contrato'>
                            <input onClick={() => setOpen(true)} disabled={loading} checked={termsAccepted} type='checkbox' name='educacion' value='educacion'/>
                            <span>{'ACEPTAR Y CONTINUAR'}</span>
                            {loading ? <span>Cargando contrato...</span> : <p style={{cursor: 'pointer', color: 'black'}} rel="noopener noreferrer" onClick={() => setOpen(true)}><u><strong>Abrir contrato</strong></u></p>}
                        </div>
                        }
                    </div>
                </div>
                <div className='contract-resume-container'>
                    <div className='resume-dashboard-red'>
                        <h2>Revisa el Monto de préstamo</h2>
                        <p>De acuerdo a nuestras políticas internas en este momento <strong>podemos ofrecerte</strong> hasta el monto indicado en tu <strong>Resumen de condiciones</strong>. Si deseas modificarlo da click en:</p>
                        <div style={{margin: '1rem auto 0'}}>
                            <Link to='/dashboard'><p style={{textDecoration: 'underline'}}><strong>Modificar solicitud de préstamo</strong></p></Link>
                            {/* <br/>
                            <p style={{margin:'0 auto'}} className={termsAccepted ? 'btn-minimal-width' : 'btn-minimal-width-disabled'} onClick={termsAccepted ? goTo : null}>CONTINUAR</p> */}
                        </div>
                    </div>
                    <div className='resumen-contrato'>
                        <div className='contrato-top'>
                            <div className='resumen-left'>
                                <h2 style={{color: 'white'}}>Resumen de condiciones</h2>
                                <div className='data'>
                                    <div className='data-margin'>
                                        <p className='data-title'>Monto del préstamo</p>
                                        <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{balance.amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p>
                                    </div>
                                    <div className='data-margin'>
                                        <p className='data-title'>Interés</p>
                                        <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>${balance.installments.reduce((acc, installment) => acc + installment.interest, 0).toFixed(2)}<small> MXN</small></p>
                                    </div>
                                    <div className='data-margin'>
                                        <p className='data-title'>Plazo del préstamo</p>
                                        <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{balance.term} {balance.idFrequency === 1 ? 'semanas' : 'días'}</p>
                                    </div>
                                    <div className='data-margin'>
                                        <p className='data-title'>Comisión</p>
                                        <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{balance.commision.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} <small>MXN</small></p>
                                    </div>
                                </div>
                                <div className='data'>
                                    <div className='data-margin'>
                                        <p className='data-title'>Inicio del préstamo</p>
                                        <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{momentEs(balance.startDate).format('D/MMM/Y')}</p>
                                    </div>
                                    <div className='data-margin'>
                                        <p className='data-title'>Fin del préstamo</p>
                                        <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{momentEs(balance.installments[balance.installments.length - 1].dueDate).format('D/MMM/Y')}</p>
                                    </div>
                                    <div className='data-margin'>
                                        <p className='data-title'>Monto total a pagar</p>
                                        <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{balance.curentInstallment.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small> <small style={{color: 'white'}}>IVA incluído</small></p> 
                                    </div>
                                </div>
                                <p style={{fontSize: '0.8rem', color: 'white', margin: 'auto'}}>El préstamo está sujeto a aprobación y verificación de crédito</p>
                            </div>
                        </div>
                        <div className= 'contrato-bottom'>
                            <p className={termsAccepted ? 'btn-minimal-width' : 'btn-minimal-width-disabled'} onClick={termsAccepted ? goTo : () => window.scrollTo(0,0)}>{loadingConfirm ? <BallClipRotate loading color={'white'}/> : !termsAccepted ? 'DESCARGA EL CONTRATO' : 'CONTINUAR'}</p>
                            {serverError ? <p style={{color: 'red'}}>Ocurrió un error, inténtalo nuevamente <br/>(400, bad request: setContractAuthorization)</p> : null}
                            {directDebitError ? <p style={{color: 'red'}}>Ocurrió un error, inténtalo nuevamente <br/>(400, bad request: directDebit)</p> : null}
                            <Link style={{color: 'black', fontWeight: 'bold', textDecoration: 'underline'}} to='/dashboard'>Modificar solicitud de préstamo</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Cargo)
