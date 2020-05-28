import React, { useState, useEffect } from 'react'
import { BallClipRotate } from 'react-pure-loaders'
import { getToken, getRiskResult, getCustomerByMail, getAnalytics } from '../../../services/api'
import { withRouter } from 'react-router-dom'
import Questionnaire from './Questionnaire'
import TagManager from 'react-gtm-module'
import publicIp from 'public-ip'

const idProduct = 1

const iovationBlackBox = document.getElementsByName('ioBlackBox')[0].value

const Done = (props) => {

    const [showQuestionnaire, setShowQuestionnaire] = useState(false)
    const [serverError, setServerError] = useState(false)

    const loadRisk = async (idCustomer, customerMail) => {
        const myIp = await publicIp.v4()
        if(myIp){
            sessionStorage.setItem('ip', myIp)
            let response = await getToken()
            const validToken = response.data.token
            const data = {
                idProduct,
                idCustomer,
                customerMail,
                customerIP: myIp,
                iovationBlackBox
            }
            //TAG MANAGER
            getAnalytics({idCustomer, idProduct}, validToken)
            .then(res => {
                if(res.data){
                    const tagManagerArgs = {
                        dataLayer: {
                            event: 'pageChange',
                            page: {
                                url: '/registration-complete',
                                referrer: '/registration/identity'
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
            getRiskResult(data, validToken)
                .then(res => {
                    // console.log(res)
                    if(res.status === 200){
                        if(res.data.continue === true){
                            return props.history.push('/registration/questionary')
                        }
                        // return props.history.push('/rejected')
                    }
                    // return props.history.push('/rejected')
                })
                .catch(err => {
                    // console.log(err.response)
                    if(err.response.status === 403) return props.history.push('/rejected')
                    if(err.response.status === 400) return props.history.push('/error')
                })
        }
    }

    const loadLocalData = async () => {
        let localRegister = await JSON.parse(sessionStorage.getItem('data-step-registration'))
        let response = await getToken()
        const validToken = response.data.token
        getCustomerByMail(idProduct, localRegister.eMail, validToken)
            .then(res => {
                loadRisk(res.data.customerId, res.data.eMail)
            })
            .catch(err => console.log(err))
    }
    
    useEffect(() => {
        const initialConfig = async () => {
            let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
            if(demoUser) {
                setTimeout(() => {
                    return props.history.push('/pre-approved')
                },2000)
            }
            sessionStorage.removeItem('customer-direct-step')
            sessionStorage.setItem('session-step', 5)
            const loggedUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
            if(!loggedUser){
                const emptyCustomer = await JSON.parse(sessionStorage.getItem('empty-customer'))
                if(emptyCustomer) {
                    if(emptyCustomer.idCustomer){
                        return loadRisk(emptyCustomer.idCustomer, emptyCustomer.email)
                    }
                    return loadRisk(emptyCustomer.customerId, emptyCustomer.eMail)
                }
                return loadLocalData()
            }
            return loadRisk(loggedUser.customerId, loggedUser.eMail)
        }
        initialConfig()
    }, [])

    return (
        <div style={{textAlign: 'center'}} className='register-form-container-100'>
            {serverError ? 
                <>
                    <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Lo sentimos...</h1>
                    <h2 style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '3rem'}}>Ocurrió un error en el servidor, intenta más tarde.</h2>
                </>
                :
                <>
                    <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>¡No te vayas!</h1>
                    <h2 style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '3rem'}}>Estamos verificando tu información...</h2>
                    <div className='big-loader'>
                        <BallClipRotate loading color={'#A3CD3A'}/>
                    </div>
                    <small>No debería tardar más que unos segundos</small>
                </>
            }
        </div>
    )
}

export default withRouter(Done)