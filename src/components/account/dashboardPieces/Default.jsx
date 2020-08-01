import React, {useState, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import { getToken, getCustomerBalance, getFilledContract, getAccountStatement, getAnalytics, getStatus } from '../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'
import { momentEs } from '../../../services/moment'
import TagManager from 'react-gtm-module'
import Media from 'react-media'
import { useMediaQuery } from 'react-responsive'
import Popup from 'reactjs-popup'

const idProduct = 1

const Default = ({history, setBalance, bannerId}) => {
    const [customerBalance, setCustomerBalance] = useState({creditLimit: 0, creditLimitUsed: 0, liquidateAmount: 0})
    const [contract, setContract] = useState('')
    // const [accStatement, setAccStatement] = useState(null)
    const [serverError, setServerError] = useState(false)
    const [loading, setLoading] = useState(true)
    // const [loadingAcc, setLoadingAcc] = useState(true)
    const [open, setOpen] = useState(false)

    const getData = async (user) => {
        setLoading(true)
        // Here goes post to get user debt instead of session storage
        let response = await getToken()
        if(!response) return setServerError(true)
        let validToken = response.data.token
        const data = {
            idProduct,
            idCustomer: user.customerId
        }

        getStatus(idProduct, user.customerId, false, validToken)
        .then(res => {
            if(res.status === 200){
                if(res.data.idStatus === 6){
                    if(res.data.idSubStatus === 15) return history.push('/repeated/application/pre-approved')
                }
                getCustomerBalance(data, validToken) //
                    .then(res => {
                        if(res.status === 200){
                            if(res.data.creditLimitUsed === 0) return history.push('/dashboard')
                            setCustomerBalance(res.data)
                            setBalance(res.data)
                            sessionStorage.setItem('balance', JSON.stringify(res.data))
                            return setLoading(false)
                        }
                        setServerError(true)
                        setLoading(false)
                    })
                    .catch(err => {
                        setServerError(true)
                        setLoading(false)
                    })
                
                getFilledContract({idProduct, idCustomer: user.customerId}, validToken)
                .then(res => {
                    if(res.status === 200)
                    setContract(res.data.document)
                })
                .catch(err => console.log(err))
        
                // getAccountStatement(data, validToken)
                // .then(res => {
                //     if(res.data){
                //         setAccStatement(res.data.document)
                //         setLoadingAcc(false)
                //     }
                // })
                // .catch(err =>  console.log(err))
        
                //TAG MANAGER
                getAnalytics({idCustomer: user.customerId, idProduct}, validToken)
                .then(analytics => {
                    if(analytics.data){
                        const tagManagerArgs = {
                            dataLayer: {
                                event: 'pageChange',
                                page: {
                                    url: '/dashboard/welcome',
                                    referrer: '/login'
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
        })
    }

    useEffect(() => {
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(user){
            if(user.eMail === 'demo@demo.com'){
                let dummyData = {
                    creditLimit: 5000,
                    creditLimitUsed: 2000,
                    liquidateAmount: 1500,
                    term: 3,
                    frequency: 3,
                    idFrequency: 3,
                    curentInstallment: {
                        idDeferral: 1,
                        principalBalance: 500,
                        interest: 250,
                        paymentValue: 560,
                        dueDate: new Date()
                    },
                    paidAmount: 1000,
                    installments: [
                        {idDeferral: 1, dueDate: new Date(), paymentValue: 200},
                        {idDeferral: 2, dueDate: new Date(), paymentValue: 200},
                        {idDeferral: 3, dueDate: new Date(), paymentValue: 200},
                        {idDeferral: 4, dueDate: new Date(), paymentValue: 200}
                    ],
                    payments: [
                        {idDeferral: 1, dueDate: new Date(), paymentValue: 200},
                        {idDeferral: 2, dueDate: new Date(), paymentValue: 200},
                        {idDeferral: 3, dueDate: new Date(), paymentValue: 200},
                        {idDeferral: 4, dueDate: new Date(), paymentValue: 200}
                    ]
                }
                setCustomerBalance(dummyData)
                sessionStorage.setItem('balance', JSON.stringify(dummyData))
                return setBalance(dummyData)
            }
            getData(user)
        }
    }, [])

    const checkMobile = useMediaQuery({ query: '(max-device-width: 700px)' })

    return (
        <div className='dashboard-default'>
            {
                // loading || 
                !customerBalance ? 
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '685px', minWidth: '500px'}}>
                        <h2>Cargando...</h2>
                        <div className='big-loader'>
                            <BallClipRotate loading className='big-loader' color='#A3CD3A'/>
                        </div>
                    </div>
                :
                <>
                    <div className='dash-top-container'>
                        <div className='dash-box'>
                            <p className='title'><strong>Mi préstamo</strong></p>
                            <div className="prestamo">
                                <div className='prestamo-bars'>
                                    <div style={{width: `${customerBalance.creditLimitUsed * 500 / customerBalance.creditLimit}px`}} className="prestamo-bar-uso"></div>
                                    <div style={{width: `${(customerBalance.creditLimit - customerBalance.creditLimitUsed) * 500 / customerBalance.creditLimit}px`}} className="prestamo-bar-disponible"></div>
                                </div>
                                <div className="prestamo-texto">
                                    <div className='prestamo-disponible'>
                                        <p>Importe en uso</p>
                                        <p style={{color: '#006d38'}}>{customerBalance.creditLimitUsed.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} MXN</p>
                                    </div>
                                    <div className='prestamo-en-uso'>
                                        <p>Importe disponible</p>
                                        <p style={{color: '#a3cd3a'}}>{(customerBalance.creditLimit - customerBalance.creditLimitUsed).toLocaleString('en-US', {style: 'currency', currency: 'USD'})} MXN</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='dash-box'>
                            <p className='title'><strong>Mi pago</strong></p>
                            <div className='parcialidad'>
                                <div className="parcialidad-container">
                                    <p>Plazo</p>
                                    <p>{customerBalance.term}</p>
                                    <p>{customerBalance.idFrequency === 3 ? 'días' : ''}</p>
                                </div>
                                <div className="parcialidad-container">
                                    <p>Interés</p>
                                    <p>{customerBalance.curentInstallment ?  customerBalance.curentInstallment.interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 0} MXN</p>
                                </div>
                                <div className="parcialidad-container">
                                    <p>Monto total a pagar</p>
                                    <p>{customerBalance.curentInstallment ? customerBalance.curentInstallment.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 0} MXN</p>
                                    <p>IVA incluído</p>
                                </div>
                                <div className="parcialidad-container">
                                    <p>Fecha de pago</p>
                                    <p>{customerBalance.curentInstallment ? momentEs(customerBalance.curentInstallment.dueDate).format('D/MMM/Y') : 'dd/mm/aaaa'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Media queries={{
                        small: "(max-width: 1000px)"
                    }}>
                    {matches => (
                        <>
                        {!matches.small && 
                            <div className='dash-banner'>
                                <video width='900' height='65' autoplay="autoplay" loop={true}>
                                    <source src={`/img/banners/Desktop/Video${bannerId}.mp4`} type="video/mp4"/>
                                    Tu navegaror no soporta la reproducción de video
                                </video>
                            </div>}
                        {matches.small && bannerId && 
                        <div className='dash-banner'>
                            <video width='300' height='65' autoplay="autoplay" loop={true}>
                                <source src={`/img/banners/Mobile/Video${bannerId}.mp4`} type="video/mp4"/>
                                Tu navegaror no soporta la reproducción de video
                            </video>
                        </div>}
                        </>
                    )}
                    </Media>
                    <div className="flex-horizontal" style={{justifyContent: 'space-evenly', width: '100%', marginTop: '0.9rem'}}>
                        {/* <Popup onClose={() => setOpen(false)} open={open} position="right center">
                            <iframe style={{width:'100%', height:'85%'}} src={`data:application/pdf;base64,${accStatement}`} title='Contract' frameborder="0"></iframe>
                            <div className='button-container'>
                                <a title='Estado de cuenta detallado' download='Estado de Cuenta' href={`data:application/pdf;base64,${accStatement}`} style={{color: 'black', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setOpen(false)}>Descargar estado de cuenta</a>
                            </div>
                            <div className='button-container'>
                                <p className='btn-register' style={{marginLeft: '1rem', backgroundColor: 'lightgray'}} onClick={() => setOpen(false)}>Cerrar</p>
                            </div>
                        </Popup> */}
                        {/* {loadingAcc ? 
                            <span style={{color: 'gray'}}>Cargando estado de cuenta...</span> 
                            : checkMobile ? <a title='Estado de cuenta detallado' download='Estado de cuenta' href={`data:application/pdf;base64,${accStatement}`} style={{color: 'black', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}}><u>Estado de cuenta detallado</u></a>
                            : <p style={{cursor: 'pointer', color: 'black'}} rel="noopener noreferrer" onClick={() => setOpen(true)}><u>Estado de cuenta detallado</u></p>
                        } */}
                        {contract.length > 0 ? <a href={`data:application/pdf;base64,${contract}`} download="contrato_VIVUS.pdf">Tu contrato</a> : <p style={{color: 'gray'}}>Cargando contrato...</p>}
                        
                    </div>
                </>
            }
        </div>
    )
}

export default withRouter(Default)
