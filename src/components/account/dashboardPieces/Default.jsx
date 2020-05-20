import React, {useState, useEffect} from 'react'
import ReactSpeedometer from "react-d3-speedometer"
import { withRouter } from 'react-router-dom'
import { getToken, getCustomerBalance, getPaymentsDetail, getFilledContract, getAccountStatement, getAnalytics, getStatus } from '../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'
import { momentEs } from '../../../services/moment'
import TagManager from 'react-gtm-module'
import Media from 'react-media'
import { useMediaQuery } from 'react-responsive'
import Popup from 'reactjs-popup'

const idProduct = 2

const Default = ({history, setBalance, bannerId}) => {
    const [customerBalance, setCustomerBalance] = useState({creditLimit: 0, creditLimitUsed: 0, liquidateAmount: 0})
    const [contract, setContract] = useState('')
    const [accStatement, setAccStatement] = useState(null)
    const [serverError, setServerError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loadingAcc, setLoadingAcc] = useState(true)
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
        
                getAccountStatement(data, validToken)
                .then(res => {
                    if(res.data){
                        setAccStatement(res.data.document)
                        setLoadingAcc(false)
                    }
                })
                .catch(err =>  console.log(err))
        
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
            getData(user)
        }
    }, [])

    const checkMobile = useMediaQuery({ query: '(max-device-width: 700px)' })

    return (
        <div className='dashboard-default'>
            {loading || !customerBalance ? 
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
                        <div className='prestamo'>
                            <div className='importe-disponible'>
                                <div className='importe-letra'>importe disponible</div>
                                <div className='importe-numero'>{(customerBalance.creditLimit - customerBalance.creditLimitUsed).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
                            </div>
                            <div className='importe-en-uso'>
                                <div className='importe-letra'>importe en uso</div>
                                <div className='importe-numero'>{customerBalance.creditLimitUsed.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
                            </div>
                        </div>
                    </div>
                    <div className='dash-box'>
                        <p className='title'><strong>Mi parcialidad</strong></p>
                        <div className='parcialidad'>
                            <p>Plazo {customerBalance.term} {customerBalance.idFrequency === 1 ? 'semanas' : 'quincenas'}</p>
                            <p>Interés {customerBalance.curentInstallment ?  customerBalance.curentInstallment.interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 0} </p>
                            <p>Parcialidad a pagar {customerBalance.curentInstallment ? customerBalance.curentInstallment.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 0} <small>IVA incluído</small></p>
                            <p>Fecha de pago {customerBalance.curentInstallment ? momentEs(customerBalance.curentInstallment.dueDate).format('D/MMM/Y') : 'dd/mm/aaaa'}</p>
                        </div>
                    </div>
                    <div className='dash-box'>
                        <p className='title'><strong>Mi avance en pagos</strong></p>
                        <div className='avance'>
                            <ReactSpeedometer
                                maxValue={customerBalance.creditLimit}
                                value={customerBalance.paidAmount}
                                valueFormat={"($,.2f"}
                                needleColor="red"
                                startColor="#8e3c12"
                                segments={customerBalance.term}
                                endColor="#A3CD3A"
                                maxSegmentLabels={5}
                                forceRender
                            />
                        </div>
                    </div>
                </div>
                <Media queries={{
                    small: "(max-width: 930px)"
                }}>
                {matches => (
                    <>
                    {!matches.small && 
                        <div className='dash-banner'>
                            <video width='900' height='65' autoplay="autoplay">
                                <source src={`/img/banners/Desktop/Video${bannerId}.mp4`} type="video/mp4"/>
                                Tu navegaror no soporta la reproducción de video
                            </video>
                        </div>}
                    {matches.small && bannerId && 
                    <div className='dash-banner'>
                        <video width='300' height='65' autoplay="autoplay">
                            <source src={`/img/banners/Mobile/Video${bannerId}.mp4`} type="video/mp4"/>
                            Tu navegaror no soporta la reproducción de video
                        </video>
                    </div>}
                    </>
                )}
                </Media>
                <div className='dash-bottom-container'>
                    <div className='dash-box'>
                        <div className='edo-cuenta'>
                            <p className='bottom-title'>Parcialidades pendientes</p>
                            <table className='tabla'>
                                <thead>
                                    <tr>
                                        <th>Número de pago</th>
                                        <th>Fecha de pago</th>
                                        <th>Importe</th>
                                    </tr>
                                </thead>
                                {customerBalance.installments && customerBalance.installments.length > 0 ? customerBalance.installments.map((el, ix) => 
                                <tbody>
                                    <tr index={ix}>
                                        <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.idDeferral}</td>
                                        <td className={ix % 2 ? 'row-non' : 'row-par'}>{momentEs(el.dueDate).format('D/MMM/Y')}</td>
                                        <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                    </tr>
                                </tbody>
                                ) : 
                                <tbody>
                                    <tr>
                                        <td className='row-par'> </td>
                                        <td className='row-par'> </td>
                                        <td className='row-par'> </td>
                                    </tr>
                                    <tr>
                                        <td className='row-non'> </td>
                                        <td className='row-non'> </td>
                                        <td className='row-non'> </td>
                                    </tr>
                                    <tr>
                                        <td className='row-par'> </td>
                                        <td className='row-par'> </td>
                                        <td className='row-par'> </td>
                                    </tr>
                                    <tr>
                                        <td className='row-non'> </td>
                                        <td className='row-non'> </td>
                                        <td className='row-non'> </td>
                                    </tr>
                                    <tr>
                                        <td className='row-par'> </td>
                                        <td className='row-par'> </td>
                                        <td className='row-par'> </td>
                                    </tr>
                                    <tr>
                                        <td className='row-non'> </td>
                                        <td className='row-non'> </td>
                                        <td className='row-non'> </td>
                                    </tr>
                                    <tr>
                                        <td className='row-par'> </td>
                                        <td className='row-par'> </td>
                                        <td className='row-par'> </td>
                                    </tr>
                                    <tr>
                                        <td className='row-non'> </td>
                                        <td className='row-non'> </td>
                                        <td className='row-non'> </td>
                                    </tr>
                                </tbody>}
                                <tr style={{backgroundColor: '#EBFEA6'}}>
                                    <td colSpan='2'>Monto de pago si decides liquidar el día de hoy</td>
                                    <td>{customerBalance.liquidateAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div className='dash-box'>
                        <div className='contrato-table'>
                            <p className='bottom-title'>Parcialidades pagadas</p>
                            <table className='tabla'>
                                <thead>
                                    <tr>
                                        <th>Número de pago</th>
                                        <th>Fecha de pago</th>
                                        <th>Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {customerBalance.payments && customerBalance.payments.length > 0 ? customerBalance.payments.map((el, ix) => 
                                        <tr index={ix}>
                                            <td className={ix % 2 ? 'row-non' : 'row-gray'}>{el.idDeferral}</td>
                                            <td className={ix % 2 ? 'row-non' : 'row-gray'}>{momentEs(el.paymentDate).format('D/MMM/Y')}</td>
                                            <td className={ix % 2 ? 'row-non' : 'row-gray'}>{el.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                        </tr>
                                    ) : 
                                    <>
                                        <tr>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                        </tr>
                                        <tr>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                        </tr>
                                        <tr>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                        </tr>
                                        <tr>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                        </tr>
                                        <tr>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                        </tr>
                                        <tr>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                        </tr>
                                        <tr>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                            <td className='row-gray'> </td>
                                        </tr>
                                        <tr>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                            <td className='row-non'> </td>
                                        </tr>
                                    </>}
                                    </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="flex-horizontal" style={{justifyContent: 'space-evenly', width: '100%', marginTop: '0.9rem'}}>
                    <Popup onClose={() => setOpen(false)} open={open} position="right center">
                        <iframe style={{width:'100%', height:'85%'}} src={`data:application/pdf;base64,${accStatement}`} title='Contract' frameborder="0"></iframe>
                        <div className='button-container'>
                            <a title='Estado de cuenta detallado' download='Estado de Cuenta' href={`data:application/pdf;base64,${accStatement}`} style={{color: 'black', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setOpen(false)}>Descargar estado de cuenta</a>
                        </div>
                        <div className='button-container'>
                            <p className='btn-register' style={{marginLeft: '1rem', backgroundColor: 'lightgray'}} onClick={() => setOpen(false)}>Cerrar</p>
                        </div>
                    </Popup>
                    {loadingAcc ? 
                        <span style={{color: 'gray'}}>Cargando estado de cuenta...</span> 
                        : checkMobile ? <a title='Estado de cuenta detallado' download='Estado de cuenta' href={`data:application/pdf;base64,${accStatement}`} style={{color: 'black', textDecoration: 'underline', cursor: 'pointer', fontWeight: 'bold'}}><u>Estado de cuenta detallado</u></a>
                        : <p style={{cursor: 'pointer', color: 'black'}} rel="noopener noreferrer" onClick={() => setOpen(true)}><u>Estado de cuenta detallado</u></p>
                    }
                    {contract.length > 0 ? <a href={`data:application/pdf;base64,${contract}`} download="contrato.pdf">Tu contrato</a> : <p style={{color: 'gray'}}>Cargando contrato...</p>}
                    
                </div>
            </>}
        </div>
    )
}

export default withRouter(Default)
