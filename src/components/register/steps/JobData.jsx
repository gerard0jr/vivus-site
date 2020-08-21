import React, { useState, useEffect } from 'react'
import cookie from 'react-cookies'
import { getToken, getCustomerByMail, getSingleCatalog, getEmploymentInformation, setEmploymentInformation, saveProposal, getAnalytics } from '../../../services/api'
import { BallBeat } from 'react-pure-loaders'
import TagManager from 'react-gtm-module'

const idProduct = 1

export const JobData = ({props, setCurrentStep, changeProposal}) => {

    const [loading, setLoading] = useState(false)
    const [customer, setCustomer] = useState(null)

    const [employmentCatalog, setEmploymentCatalog] = useState([])
    const [industryCatalog, setIndustryCatalog] = useState([])

    const [employmentType, setEmploymentType] = useState(1)
    const [idEmploymentIndustry, setIdEmploymentIndustry] = useState(1)
    const [data, setData] = useState({})
    const [antMonth, setAntMonth] = useState(null)
    const [antYear, setAntYear] = useState(null)
    const [income, setIncome] = useState(null)

    const [incomeError, setIncomeError] = useState(false)
    const [employerNameError, setEmployerNameError] = useState(false)
    const [employerPhoneError, setEmployerPhoneError] = useState(false)
    const [antError, setAntError] = useState(false)

    const handleData = e => setData({...data, [e.target.name]: e.target.value})

    const handleSubmit = async () => {
        if(!income) return setIncomeError(true)
        if(!data.employerName) return setEmployerNameError(true)
        else setEmployerNameError(false)
        if(!data.employmentPhone || data.employmentPhone.length < 10) return setEmployerPhoneError(true)
        if(data.employmentPhone.match(/^[0-9]+$/) === null) return setEmployerPhoneError(true)
        if(data.employmentPhone.search(/[a-zA-Z]/) !== -1) return setEmployerPhoneError(true)
        else setEmployerPhoneError(false)
        if(antMonth === null || antYear === null) return setAntError(true)
        if(customer.eMail === 'demo@demo.com') return props.history.push('/registration/nip-bureau')
        else setAntError(false)
        setLoading(true)
        let submittedData = {
            idProduct,
            idCustomer: customer.customerId,
            ...data,
            income: parseInt(income),
            antMonth,
            antYear,
            employmentType,
            idEmploymentIndustry
        }
        let validToken = cookie.load('token')
        if(!validToken){
            let response = await getToken()
            validToken = response.data.token
        }
        setEmploymentInformation(submittedData, validToken)
            .then(res => {
                if(res.status === 200){
                    let proposal = JSON.parse(sessionStorage.getItem('proposal'))
                    saveProposal(idProduct, submittedData.idCustomer, proposal.monto, proposal.periodicidad, proposal.plazo, validToken)
                    .then(res => {
                        if(res.status === 200) {
                            return props.history.push('/registration/nip-bureau')
                        }
                    })
                    .catch(err => setLoading(false))
                }
                setLoading(false)
            })
            .catch(err => console.log(err))
    }

    const loadCustomerData = async (idCustomer, token) => {
        const data = {
            idProduct,
            idCustomer
        }
        getEmploymentInformation(data, token)
            .then(res => {
                if(res.status === 200){
                    setEmploymentType(res.data.employmentType)
                    setIdEmploymentIndustry(res.data.idEmploymentIndustry)
                    setIncome(res.data.income)
                    setData({
                        employerName: res.data.employerName,
                        employmentPhone: res.data.employmentPhone
                    })
                    setAntMonth(res.data.antMonth)
                    setAntYear(res.data.antYear)
                }
            })
            .catch(err => console.log(err))
            //TAG MANAGER
            getAnalytics({idCustomer, idProduct}, token)
            .then(res => {
                if(res.data){
                    const tagManagerArgs = {
                        dataLayer: {
                            event: 'pageChange',
                            page: {
                                url: '/registration/employment-details',
                                referrer: '/registration/personal-details'
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
                                    url: '/registration/employment-details',
                                    referrer: '/registration/personal-details'
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
        const getCatalogs = async () => {
            let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
            if(demoUser){
                setEmploymentCatalog([
                    {value: 1, text: 'Ingeniero'},
                    {value: 2, text: 'Contador'},
                    {value: 3, text: 'Abogado'}
                ])
                return setIndustryCatalog([
                    {value: 1, text: 'Tecnología'},
                    {value: 2, text: 'Construcción'},
                    {value: 3, text: 'Otra industria'}
                ])
            }
            let response = await getToken()
            let validToken = response.data.token
            let tipo = {
                catalogName: 'sProfesion',
                dependsFilterValue: 0
            }
            let industry = {
                catalogName: 'IndustriaEmpresa',
                dependsFilterValue: 0
            }
            getSingleCatalog(tipo, validToken)
                .then(res => {
                    setEmploymentCatalog(res.data.catalogs[0].records)
                })
                .catch(err => console.log(err))
            getSingleCatalog(industry, validToken)
                .then(res => {
                    setIndustryCatalog(res.data.catalogs[0].records)
                })
                .catch(err => console.log(err))
        }
        getCatalogs()
    }, [])

    useEffect(() => {
        const loadPersonalData = async () => {
            let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
            if(demoUser) return setCustomer(demoUser)
            let response = await getToken()
            let validToken = response.data.token
            let currentStep = await sessionStorage.getItem('session-step')
            if(currentStep === '3'){
                return props.history.push('/registration/nip-bureau')
                }
            else if(currentStep === '4') return props.history.push('/registration/identity')
            else if(currentStep === '5') return props.history.push('/registration-complete')
            else sessionStorage.setItem('session-step', 2)
            sessionStorage.removeItem('customer-direct-step')
            const loggedUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
            if(!loggedUser){
                const emptyCustomer = await JSON.parse(sessionStorage.getItem('empty-customer'))
                if(emptyCustomer) {
                    if(emptyCustomer.idCustomer){
                        setCustomer({customerId:emptyCustomer.idCustomer, eMail: emptyCustomer.eMail})
                        return loadCustomerData(emptyCustomer.idCustomer, validToken)
                    }
                    setCustomer({customerId:emptyCustomer.customerId, eMail: emptyCustomer.eMail})
                    return loadCustomerData(emptyCustomer.customerId, validToken)
                }
                return loadLocalData()
            }
            setCustomer(loggedUser)
            return loadCustomerData(loggedUser.customerId, validToken)
        }
        loadPersonalData()
    }, [])

    let fillDemo = () => {
        setEmploymentType(1)
        setIdEmploymentIndustry(1)
        setIncome(25000)
        setData({
            employerName: 'Mayorga',
            employmentPhone: '5562788120'
        })
        setAntYear(2)
        setAntMonth(5)
    }

    return (
        <div className='register-form-container'>
            {/* <div onClick={fillDemo} className="fill-demo">DEMO</div> */}
            <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Detalles</h1>
            <h2 style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '3rem'}}>de tu empleo</h2>
            <div style={{borderBottom: '5px solid black', width: '50px'}}></div>
            <div style={{marginBottom: '1rem'}}>
                <small>Por favor llena todos los campos</small>
            </div>
            <div className='register-subtitle'>
                <h5>Empleo</h5>
            </div>
            <div className='input-div'>
                <p style={{fontWeight: 'bold'}}><strong>Tipo de empleo</strong></p>
                <div>
                    <select style={{width: '200px', padding: '0.6rem', fontSize: '1rem', backgroundColor: 'white'}} name='employmentType' onChange={e => setEmploymentType(parseInt(e.target.value))} value={employmentType}>
                        {employmentCatalog ? employmentCatalog.map((employment, ix) => <option key={ix} value={employment.value}>{employment.text}</option>) : <option value={0}>Cargando...</option>}
                    </select>
                </div>
            </div>
            <div className='input-div'>
                <p style={{fontWeight: 'bold'}}><strong>Industria a la que pertenece su empleo</strong></p>
                <div>
                    <select style={{width: '200px', padding: '0.6rem', fontSize: '1rem', backgroundColor: 'white'}} name='employmentType' onChange={e => setIdEmploymentIndustry(parseInt(e.target.value))} value={idEmploymentIndustry}>
                        {industryCatalog ? industryCatalog.map((industry, ix) => <option key={ix} value={industry.value}>{industry.text}</option>) : <option value={0}>Cargando...</option>}
                    </select>
                </div>
            </div>
            <div className={incomeError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Ingreso Neto</strong></p>
                <div>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={e => setIncome(e.target.value)} type='text' name='income' maxlength="10" value={income}/>
                </div>
                <small>Éste es tu ingreso mensual después de impuestos</small>
            </div>
            <div className={employerNameError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Nombre de la empresa en la que trabajas</strong></p>
                <div>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='employerName' value={data.employerName}/>
                </div>
            </div>
            <div className={employerPhoneError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Teléfono del empleo</strong></p>
                <div>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} maxLength='10' type='text' name='employmentPhone' value={data.employmentPhone}/>
                </div>
            </div>
            <div className={antError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Antiguedad de tu empleo</strong></p>
                <div>
                    <select style={{width: '200px', padding: '0.6rem', fontSize: '1rem', backgroundColor: 'white'}} name='antYear' onChange={e => setAntYear(parseInt(e.target.value))} value={antYear}>
                        <option value='' selected disabled>Años</option>
                        <option value={0}>0 Años</option>
                        <option value={1}>1 año</option>
                        <option value={2}>2 años</option>
                        <option value={3}>3 años</option>
                        <option value={4}>4 años</option>
                        <option value={5}>5 años</option>
                        <option value={6}>6 años</option>
                        <option value={7}>7 años</option>
                        <option value={8}>8 años</option>
                        <option value={9}>9 años</option>
                        <option value={10}>10 años o más</option>
                    </select>
                </div>
                <div style={{marginTop: '1rem'}}>
                    {antYear !== null ? <select style={{width: '200px', padding: '0.6rem', fontSize: '1rem', backgroundColor: 'white'}} name='antMonth' onChange={e => setAntMonth(parseInt(e.target.value))} value={antMonth}>
                        <option value='' selected disabled>Meses</option>
                        {antYear > 0 ? <option value={0}>0 meses</option> : null}
                        <option value={1}>1 mes</option>
                        <option value={2}>2 meses</option>
                        <option value={3}>3 meses</option>
                        <option value={4}>4 meses</option>
                        <option value={5}>5 meses</option>
                        <option value={6}>6 meses</option>
                        <option value={7}>7 meses</option>
                        <option value={8}>8 meses</option>
                        <option value={9}>9 meses</option>
                        <option value={10}>10 meses</option>
                        <option value={11}>11 meses</option>
                    </select> 
                    : 
                    null}
                </div>
            </div>
            <div onClick={handleSubmit} style={{width: '200px'}} className='btn-register'>{loading ? <BallBeat loading color={'white'}/> : 'CONTINUAR'}</div>
        </div>
    )
}
