import React, {useState, useEffect} from 'react'
import './newStyles.scss'
import { withRouter, Link } from 'react-router-dom'
import { getFilledContract, getToken, getCustomerByMail, getStatus, getProposal, getSimulation, setContractAuthorization, getAnalytics } from '../../services/api'
import { momentEs } from '../../services/moment'
import publicIp from 'public-ip'
import TagManager from 'react-gtm-module'
import Popup from "reactjs-popup"
import { useMediaQuery } from 'react-responsive'
import { BallClipRotate } from 'react-pure-loaders'

const idProduct = 2

const Cargo = (props) => {
    
    const [customer, setCustomer] = useState(null)

    const [loadingConfirm, setLoadingConfirm] = useState(false)
    const [loading, setLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [contract, setContract] = useState(null)
    const [balance, setBalance] = useState({
        creditLimitUsed:0,
        installments: [{ idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}, { idDeferral: 'cargando...', dueDate: new Date(), interest: 0}],
        term: 0,
        idFrequency: 1,
        curentInstallment: {
            paymentValue: 0
        }
    })

    const [open, setOpen] = useState(false)

    const goTo = async () => {
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
                            if(res.data.codigo === '200') return props.history.push('/dashboard/confirm')
                        }
                    })
                    .catch(err => {
                        if(err.response === 400){
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
                            if(res.data.codigo === 200) return props.history.push('/dashboard/confirm')
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
                    getSimulation(idProduct, res.data.creditLimit, res.data.opFrequency, res.data.term, token)
                        .then(resSim => {
                            setBalance({...balance, 
                                creditLimitUsed: res.data.creditLimit,
                                term: res.data.term,
                                idFrequency: res.data.opFrequency,
                                installments: resSim.data.amortizationTable,
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
            let response = await getToken()
            let validToken = response.data.token
            const checkUser = async (user) => {
                getStatus(idProduct, user.customerId, false, validToken)
                    .then(res =>{
                        if(res.status && res.data.idStatus === 4){
                            return props.history.push('/denied')
                        }
                    })
            }
            let approved = sessionStorage.getItem('APP')
            if(approved === 'no') return props.history.push('/denied')
            const loggedUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
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
                    checkUser(data.idCustomer)
                    setCustomer({customerId:data.idCustomer, eMail: emptyCustomer.eMail, mobile:emptyCustomer.mobile})
                    fillContract(data.idCustomer, validToken)
                    getBalance(data.idCustomer, validToken)
                }
                return loadLocalData()
            }
            setCustomer(loggedUser)
            checkUser(loggedUser)
            fillContract(loggedUser.customerId, validToken)
            getBalance(loggedUser.customerId, validToken)
        }
        initialConfig()
    }, [])

    const checkMobile = useMediaQuery({ query: '(max-device-width: 700px)' })

    return (
        <div className='app-container'>
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
                        <h2 style={{textAlign: 'left'}}>Por favor lee y acepta el contrato del préstamo</h2>
                        {checkMobile ? 
                        <div className='check-contrato'>
                            <input onClick={() => setOpen(true)} disabled={loading} checked={termsAccepted} type='checkbox' name='educacion' value='educacion'/>
                            {loading ? <span>Contrato de Préstamo</span> : <a title='Descargar contrato' download='Contrato' href={`data:application/pdf;base64,${contract}`} style={{color: 'black', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setTermsAccepted(true)}><u>Contrato de Préstamo</u></a>}
                            <span>{loading && !termsAccepted ? 'Cargando...' : !loading && !termsAccepted ? 'Contrato no aceptado' : 'Contrato aceptado'}</span>
                        </div>
                        :
                        <div className='check-contrato'>
                            <input onClick={() => setOpen(true)} disabled={loading} checked={termsAccepted} type='checkbox' name='educacion' value='educacion'/>
                            {loading ? <span>Contrato de Préstamo</span> : <p style={{cursor: 'pointer', color: 'black'}} rel="noopener noreferrer" onClick={() => setOpen(true)}><u>Contrato de Préstamo</u></p>}
                            <span>{loading && !termsAccepted ? 'Cargando...' : !loading && !termsAccepted ? 'Contrato no aceptado' : 'Contrato aceptado'}</span>
                        </div>
                        }
                    </div>
                    <div className='resume-dashboard-red'>
                            <h2>Revisa el Monto de préstamo</h2>
                            <p>De acuerdo a nuestras políticas internas en este momento podemos ofrecerte hasta el monto indicado en tu <strong>Resumen de condiciones</strong></p>
                            <p>Si deseas modificarlo da click en:</p>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <Link to='/dashboard'><p style={{textDecoration: 'underline'}}><strong>Modificar solicitud de préstamo</strong></p></Link>
                                <p className={termsAccepted ? 'btn-minimal-width' : 'btn-minimal-width-disabled'} onClick={termsAccepted ? goTo : null}>CONTINUAR</p>
                            </div>
                    </div>
                </div>
                <div className='resumen-contrato'>
                    <div className='contrato-top'>
                        <div className='resumen-left'>
                            <h2 style={{color: 'white'}}>Resumen de condiciones</h2>
                            <div className='data'>
                                <div className='data-margin'>
                                    <p className='data-title'>Monto del préstamo</p>
                                    <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{balance.creditLimitUsed.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                                </div>
                                <div className='data-margin'>
                                    <p className='data-title'>Interés</p>
                                    <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>${balance.installments.reduce((acc, installment) => acc + installment.interest, 0).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className='data'>
                                <div className='data-margin'>
                                    <p className='data-title'>Plazo del préstamo</p>
                                    <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{balance.term} {balance.idFrequency === 1 ? 'semanas' : 'quincenas'}</p>
                                </div>
                                <div className='data-margin'>
                                    <p className='data-title'>Inicio del préstamo</p>
                                    <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{momentEs(balance.installments[0].dueDate).format('D/MMM/Y')}</p>
                                </div>
                            </div>
                            <div className='data'>
                                <div className='data-margin'>
                                    <p className='data-title'>Monto de parcialidad</p>
                                    <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{balance.curentInstallment.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} <small style={{color: 'white'}}>IVA incluído</small></p> 
                                </div>
                                <div className='data-margin'>
                                    <p className='data-title'>Fin del préstamo</p>
                                    <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{momentEs(balance.installments[balance.installments.length - 1].dueDate).format('D/MMM/Y')}</p>
                                </div>
                            </div>
                            <div className='data'>
                                <div className='data-margin'>
                                    <p className='data-title'>Número de parcialidades</p>
                                    <p style={{fontWeight:'600', color: 'darkgreen', fontSize: '1.2rem'}}>{balance.term}</p>
                                </div>
                            </div>
                            <p style={{fontSize: '0.8rem', color: 'white', marginLeft: '2rem'}}>El préstamo está sujeto a aprobación y verificación de crédito</p>
                        </div>
                        <div className='resumen-right'>
                          <h5>Parcialidades a pagar</h5>      
                          <table className='tabla'>
                            <thead>
                                <tr>
                                    <th>Pago</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Capital</th>
                                    <th>Interés</th>
                                </tr>
                            </thead>
                            <tbody>
                                {balance.installments.filter(el => el.idDeferral !== 0).map((el, ix) => 
                                    <tr key={ix}>
                                        <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.idDeferral}</td>
                                        <td className={ix % 2 ? 'row-non' : 'row-par'}>{momentEs(el.dueDate).format('D/MMM/Y')}</td>
                                        <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.paymentValue ? el.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 0}</td>
                                        <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.principal ? el.principal.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 0}</td>
                                        <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.interest ? el.interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 0}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div className= 'contrato-bottom'>
                        <p className={termsAccepted ? 'btn-minimal-width' : 'btn-minimal-width-disabled'} onClick={termsAccepted ? goTo : null}>{loadingConfirm ? <BallClipRotate loading color={'#fd6b21'}/> : 'CONTINUAR'}</p>
                        {serverError ? <p style={{color: 'red'}}>Ocurrió un error, inténtalo nuevamente(400, bad request)</p> : null}
                        <Link style={{color: 'black', fontWeight: 'bold', textDecoration: 'underline'}} to='/dashboard'>Modificar solicitud de préstamo</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Cargo)
