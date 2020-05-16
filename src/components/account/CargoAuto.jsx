import React, {useState, useEffect} from 'react'
import './newStyles.scss'
import { withRouter } from 'react-router-dom'
import { getToken, getCustomerByMail, getDirectDebitInformation, setDirectDebitAuthorization, getStatus, getAnalytics } from '../../services/api'
import { momentEs } from '../../services/moment'
import TagManager from 'react-gtm-module'

const idProduct = 2

const CargoAuto = (props) => {
    const [customer, setCustomer] = useState(null)
    const [auth, setAuth] = useState(false)
    const [data, setData] = useState(null)    

    const goTo = async () => {
        let response = await getToken()
        let validToken = response.data.token
        let coords = sessionStorage.getItem('coords')
        if(!coords) coords = 'Location blocked'
        let myIp = sessionStorage.getItem('ip')
        const data = {
            userAgent: navigator.userAgent,
            ip: myIp,
            authorized: auth,
            coordinates: coords,
            idProduct,
            idCustomer: customer.customerId
        }

        setDirectDebitAuthorization(data, validToken)
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
        .catch(err => console.log(err))
    }

    const loadDebitData = (idCustomer, token) => {
        getDirectDebitInformation({idProduct, idCustomer}, token)
        .then(res => {
            if(res.status === 200){
                return setData(res.data)
            }

        })
        .catch(err => console.log(err))
        //TAG MANAGER
        getAnalytics({idCustomer, idProduct}, token)
        .then(analytics => {
            if(analytics.data){
                const tagManagerArgs = {
                    dataLayer: {
                        event: 'pageChange',
                        page: {
                            url: '/dashboard/confirm',
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

    const loadLocalData = async () => {
        let localRegister = await JSON.parse(sessionStorage.getItem('data-step-registration'))
        let response = await getToken()
        const validToken = response.data.token
        getCustomerByMail(idProduct, localRegister.eMail, validToken)
            .then(res => {
                setCustomer(res.data)
                loadDebitData(res.data.customerId, validToken)
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
                    setCustomer({idCustomer:data.idCustomer, eMail: emptyCustomer.eMail, mobile:emptyCustomer.mobile})
                    loadDebitData(data.idCustomer, validToken)
                }
                return loadLocalData()
            }
            setCustomer(loggedUser)
            checkUser(loggedUser)
            loadDebitData(loggedUser.customerId, validToken)
        }
        initialConfig()
    }, [])

    return (
        <div className='app-container'>
            <div className='buro-container'>
                <div>
                    <p>Estamos <span style={{fontSize:'2rem'}}>ya casi listos</span> para que disfutes de tu nuevo <span style={{fontSize:'2.8rem'}}>préstamo,</span> <span style={{fontSize:'2.4rem'}}> el cual será más fácil pagar</span><span style={{fontSize:'2.8rem'}}> sin filas</span><span style={{fontSize:'2.4rem'}}> ni</span><span style={{fontSize:'2.8rem'}}> comisiones extras.</span></p>
                    <p>Solo necesitas activar tu servicio de cargo automático a tu cuenta.</p>
                </div>
                <div className='educacion-fin'>
                    <div style={{margin: 0}} className='checkbox-div'>
                        <div className="checkbox-top">
                            <label className="container">
                                <input onChange={() => setAuth(!auth)} type='checkbox'/>
                                <span className="checkmark"></span>
                            </label>
                        </div>
                    </div>
                    <div style={{marginLeft:'2rem'}}>
                        <p>Solicito y autorizo a 4Finance, S.A. de C.V. SOFOM ENR realice cargos periódicos para el pago de mi préstamo de forma 
                            <input value={data && data.frequence} type="text" style={{backgroundColor: '#fd6b21', color: 'white'}}/> a mi cuenta CLABE y/o tarjeta bancaria de 
                            <input value={data && data.bank} type="text" style={{backgroundColor: '#fd6b21', color: 'white'}} /> con número 
                            <input type='text' value={data && data.bankAccountNumber} style={{backgroundColor: '#fd6b21', color: 'white'}} /> por un importe de 
                            <input type="text" value={data && data.firstPaymentAmount} style={{backgroundColor: '#fd6b21', color: 'white'}} /> pesos m.n.</p>
                        <p>Esta autorización vence el <input type="text" value={data && momentEs(data.dueDate).format('D/MMM/Y')} style={{backgroundColor: '#fd6b21', color: 'white'}} /> fecha de mi última cuota de pago o hasta que quede liquidado en su totalidad dicho préstamo.</p>
                        <p>Estoy enterado de que en cualquier momento podré solicitar la cancelación de la presente domiliciación sin costo a mi cargo.</p>
                        <p>Atentamente. <input type="text" value={data && data.customerName} style={{backgroundColor: '#fd6b21', color: 'white', width: '300px'}} /></p>
                    </div>
                </div>
                <p className={auth ? 'btn-minimal-width' : 'btn-minimal-width-disabled'} onClick={goTo}>CONTINUAR</p>
            </div>
        </div>
    )               
}

export default withRouter(CargoAuto)
