import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getToken, getSingleCatalog, setPersonalInformation, getPersonalInformation, saveProposal, getCustomerByMail, getCatalogByZipCode, getAnalytics } from '../../../services/api.js'
import cookie from 'react-cookies'
import { BallBeat } from 'react-pure-loaders'
import TagManager from 'react-gtm-module'

const idProduct = 1

export const PersonalData = ({props, setCurrentStep, changeProposal}) => {
    
    const [loading, setLoading] = useState(false)
    const [customer, setCustomer] = useState(null)

    const [badRequest, setBadRequest] = useState(false)
    const [curpRepeatError, setCurpRepeatError] = useState(false)
    const [notFoundZip, setNotFoundZip] = useState(false)
    const [loadingZip, setLoadingZip] = useState(false)
    const [colCat, setColCat] = useState([])

    const [loadedClabe, setLoadedClabe] = useState(false)
    const [loadedDebit, setLoadedDebit] = useState(false)

    const [maskedClabe, setMaskedClabe] = useState(false)
    const [maskedDebit, setMaskedDebit] = useState(false)

    const [localLoaded, setLocalLoaded] = useState(false)

    const [data, setData] = useState({
        gender: 1,
        birthPlace: 0,
        idState: 0
    })

    const [catalog, setCatalog] = useState(null)
    const [bankCatalog, setBankCatalog] = useState(null)

    const [date, setDate] = useState({
        day: null,
        month: null,
        year: null
    })
    const [clabe, setClabe] = useState(null)
    const [debit, setDebit] = useState(null)

    const [bank, setBank] = useState(0)
    const [birthPlace, setBirthPlace] = useState(0)
    const [idState, setIdState] = useState(0)
    const [stateName, setStateName] = useState(null)
    const [municipality, setMunicipality] = useState(null)
    const [suburb, setSuburb] = useState(null)

    const [referenceName, setReferenceName] = useState(null)
    const [referenceNumber, setReferenceNumber] = useState(null)

    const [paymentType, setPaymentType] = useState(0) //0 es para débito

    // Error handling
    const [birthDateError, setBirthDateError] = useState(false)
    const [curpError, setCurpError] = useState(false)
    const [rfcError, setRfcError] = useState(false)
    const [streetError, setStreetError] = useState(false)
    const [exteriorNumberError, setExteriorNumberError] = useState(false)
    const [suburbError, setSuburbError] = useState(false)
    const [zipCodeError, setZipCodeError] = useState(false)
    const [municipalityError, setMunicipalityError] = useState(false)
    const [clabeError, setClabeError] = useState(false)
    const [debitError, setDebitError] = useState(false)
    const [referenceNameError, setReferenceNameError] = useState(false)
    const [referenceNumberError, setReferenceNumberError] = useState(false)

    useEffect(() => {
        if(birthDateError || curpError || rfcError || curpRepeatError){
            window.scrollTo(0, 180)
        }
    }, [birthDateError, curpError, rfcError, curpRepeatError])
    
    useEffect(() => {
        if(streetError || exteriorNumberError || suburbError || zipCodeError || municipalityError){
            window.scrollTo(0, 850)
        }
    }, [streetError, exteriorNumberError, suburbError, zipCodeError, municipalityError])

    const handleData = e => setData({...data, [e.target.name]: e.target.value})

    const handleCaseData = e => setData({...data, [e.target.name]: e.target.value.toUpperCase()})

    const handleSubmit = async () => {
        let curpRx = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
        var rfcRx = /[A-ZÑ&]{3,4}\d{6}([A-V1-9][A-Z1-9][0-9A])?$/
        if(!date.day || !date.month || !date.year) return setBirthDateError(true)
        if(date.day < 1 || date.day > 31) return setBirthDateError(true)
        else if(date.month < 1 || date.month > 12) return setBirthDateError(true)
        else if(date.year < 1953 || date.year > 2100) return setBirthDateError(true)
        else setBirthDateError(false)
        if(!data.curp) return setCurpError(true)
        if(!curpRx.test(data.curp.toUpperCase())) return setCurpError(true)
        else setCurpError(false)
        if(!data.rfc) return setRfcError(true)
        if(!rfcRx.test(data.rfc.toUpperCase())) return setRfcError(true)
        else setRfcError(false)
        if(!data.street) return setStreetError(true)
        setStreetError(false)
        if(!data.exteriorNumber) return setExteriorNumberError(true)
        if(data.exteriorNumber.search(/[a-zA-Z]/) !== -1) return setExteriorNumberError(true)
        setExteriorNumberError(false)
        if(!suburb) return setSuburbError(true)
        setSuburbError(false)
        if(!data.zipCode) return setZipCodeError(true)
        if(data.zipCode.length < 5) return setZipCodeError(true)
        if(data.zipCode.search(/[a-zA-Z]/) !== -1) return setZipCodeError(true)
        setZipCodeError(false)
        if(!municipality) return setMunicipalityError(true)
        setMunicipalityError(false)
        if(!clabe && paymentType === 0) return setClabeError(true)
        if(clabe.length < 18 && paymentType === 0) return setClabeError(true)
        if(clabe.search(/[a-zA-Z]/) !== -1 && paymentType === 0) return setClabeError(true)
        if(clabe.match(/^[0-9]+$/) === null && paymentType === 0) return setClabeError(true)
        setClabeError(false)
        if(!debit && paymentType === 1) return setDebitError(true)
        if(debit.length < 16 && paymentType === 1) return setDebitError(true)
        if(debit.search(/[a-zA-Z]/) !== -1 && paymentType === 1) return setDebitError(true)
        if(debit.match(/^[0-9]+$/) === null && paymentType === 1) return setDebitError(true)
        setDebitError(false)
        if(!referenceName) return setReferenceNameError(true)
        setReferenceNameError(false)
        if(!referenceNumber || referenceNumber.length < 10) return setReferenceNumberError(true)
        if(referenceNumber.search(/[a-zA-Z]/) !== -1) return setReferenceNumberError(true)
        setReferenceNumberError(false)
        if(customer.eMail === 'demo@demo.com') return props.history.push('/registration/employment-details')
        setLoading(true)
        let birthDate = new Date(date.year, date.month - 1, date.day).toISOString()
        let submittedData = {
            ...data,
            idCustomer:customer.customerId,
            idProduct,
            birthDate,
            birthPlace,
            suburb,
            idState,
            municipality,
            reference:{
                referenceName,
                referenceNumber
            },
            disbursementMethod: {
                clabe,
                debitCardNumber: debit,
                idBank: bank
            }
        }
        if(paymentType === 0) submittedData.disbursementMethod.debitCardNumber = ''
        if(paymentType === 1) submittedData.disbursementMethod.clabe = ''
        let validToken = cookie.load('token')
        if(!validToken){
            let response = await getToken()
            validToken = response.data.token
        }
        sessionStorage.setItem('customer-personalData', JSON.stringify(submittedData))
        setPersonalInformation(submittedData, validToken)
            .then(res => {
                let proposal = JSON.parse(sessionStorage.getItem('proposal'))
                if(res.status === 200){
                    saveProposal(idProduct, submittedData.idCustomer, proposal.monto, proposal.periodicidad, proposal.plazo, validToken)
                    .then(res => {
                        if(res.status === 200) {
                            return props.history.push('/registration/employment-details')
                        }
                    })
                    .catch(err => setLoading(false))
                }
                setLoading(false)
            })
            .catch(err => {
                if(err.response.status === 400) setBadRequest(true)
                if(err.response.status === 403) setCurpRepeatError(true)
                return setLoading(false)
            })
    }

    const loadCustomerData = (idCustomer, token) => {
        const data = {
            idProduct,
            idCustomer
        }
        //TAG MANAGER
        getAnalytics({idCustomer, idProduct}, token)
        .then(res => {
            if(res.data){
                const tagManagerArgs = {
                    dataLayer: {
                        event: 'pageChange',
                        page: {
                            url: '/registration/personal-details',
                            referrer: '/registration'
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
        getPersonalInformation(data, token)
            .then(res => {
                const {data} = res
                if(res.status === 200){
                    setBank(data.disbursementMethod.idBank)
                    setBirthPlace(data.birthPlace)
                    setClabe(data.disbursementMethod.clabe)
                    setDebit(data.disbursementMethod.debitCardNumber)
                    if(data.disbursementMethod.clabe.length > 1) setPaymentType(0)
                    else setPaymentType(1)
                    setLoadedClabe(true)
                    setLoadedDebit(true)
                    setMaskedClabe('************** ' + data.disbursementMethod.clabe.slice(-4))
                    setMaskedDebit('**** **** **** ' + data.disbursementMethod.debitCardNumber.slice(-4))
                    setReferenceName(data.reference.referenceName)
                    setReferenceNumber(data.reference.referenceNumber)
                    setSuburb(data.suburb)
                    setData({
                        curp:data.curp,
                        rfc:data.rfc,
                        street:data.street,
                        exteriorNumber:data.exteriorNumber,
                        interiorNumber:data.interiorNumber,
                        zipCode:data.zipCode,
                        gender: data.gender
                    })
                    const date = new Date(data.birthDate)
                    const day = date.getDate()
                    const month = date.getMonth() + 1
                    const year = date.getFullYear()
                    setDate({
                        day,
                        month,
                        year
                    })
                    validateZip(data.zipCode)
                    setLocalLoaded(true)
                }
            })
    }

    const loadLocalData = async () => {
        let localRegister = await JSON.parse(sessionStorage.getItem('data-step-registration'))
        if(!localRegister) return props.history.push('/registration')
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
                                    url: '/registration/personal-details',
                                    referrer: '/registration'
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

    const validateZip = async (zip) => {
        setIdState(null)
        setStateName(null)
        setMunicipality(null)
        setColCat([])
        if(!zip && (!data.zipCode || data.zipCode.length < 5)) return setZipCodeError(true)
        setZipCodeError(false)
        setNotFoundZip(false)
        setLoadingZip(true)
        let response = await getToken()
        const validToken = response.data.token
        const submitData = {}
        if(zip){
            submitData.zipCode = zip
        } else{
            submitData.zipCode = data.zipCode
        }
        getCatalogByZipCode(submitData, validToken)
        .then(res => {
            if(res.status === 200 && res.data.length > 0){
                setIdState(res.data[0].idEstado)
                setStateName(res.data[0].estado)
                setMunicipality(res.data[0].municipio)
                if(!zip) setSuburb(res.data[0].colonia)
                setColCat(res.data)
                return setLoadingZip(false)
            }
            setNotFoundZip(true)
            setLoadingZip(false)
        })
        .catch(err => {
            setLoadingZip(false)
        })
    }

    useEffect(() => {
        const populateCatalog = async () => {
            let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
            if(demoUser){
                setBankCatalog([
                    {value: 1, text: 'Banamex'},
                    {value: 2, text: 'Santander'},
                    {value: 3, text: 'BBVA'}
                ])
                return setCatalog([
                    {value: 1, text: 'CDMX'},
                    {value: 2, text: 'Edo. Mex.'},
                    {value: 3, text: 'Monterrey'}
                ])
            }
            let response = await getToken()
            const validToken = response.data.token
            let data = {
                catalogName: 'Estados',
                dependsFilterValue: 0
            }
            let dataBank = {
                catalogName: 'Bancos',
                dependsFilterValue: 0
            }
            getSingleCatalog(data, validToken)
                .then(res => setCatalog(res.data.catalogs[0].records))
                .catch(err => console.log(err))
            getSingleCatalog(dataBank, validToken)
                .then(res => setBankCatalog(res.data.catalogs[0].records))
                .catch(err => console.log(err))
        }
        populateCatalog()
    }, [])

    useEffect(() => {
        const loadPersonalData = async () => {
            let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
            if(demoUser) return setCustomer(demoUser)
            let validToken = cookie.load('token')
            if(!validToken){
                let response = await getToken()
                validToken = response.data.token
            }
            let currentStep = await sessionStorage.getItem('session-step')
            if(currentStep === '3') return props.history.push('/registration/nip-bureau')
            if(currentStep === '4') return props.history.push('/registration/identity')
            if(currentStep === '5') return props.history.push('/registration-complete')
            sessionStorage.removeItem('customer-direct-step')
            sessionStorage.setItem('session-step', 1)
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
        setDate({day: 1, month: 5, year: 1990})
        setBirthPlace(1)
        setData({
            gender: 1,
            birthPlace: 1,
            curp: 'AAPR931117HDFMNR09',
            rfc: 'AAPR931117AA0',
            street: 'Calle 32',
            exteriorNumber: '12',
            interiorNumber: 'H34',
            zipCode: '07839'
        })
        setColCat([
            {colonia: 'Gertrudis Sánchez'}
        ])
        setMunicipality('GAM')
        setSuburb(1)
        setStateName('CDMX')
        setClabe('123456789012345678')
        setDebit('')
        setReferenceName('Contacto')
        setReferenceNumber('5511223344')
    }

    return (
        <div className='register-form-container'>
            <div onClick={fillDemo} className="fill-demo">DEMO</div>
            <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Información</h1>
            <h2 style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '3rem'}}>Personal</h2>
            <div style={{borderBottom: '5px solid black', width: '50px'}}></div>
            <div style={{marginBottom: '1rem'}}>
                <div className='register-questions'>
                    <p>¿Ya eres cliente?</p><Link to='/login'>Por favor ingresa aquí</Link>
                </div>
                <small>Por favor llena todos los campos</small>
            </div>
            <div className='register-subtitle'>
                <h5>Datos personales</h5>
            </div>
            <div className={birthDateError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Fecha de nacimiento</strong></p>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <input style={{width: '40px', padding: '0.6rem', fontSize: '1rem', marginRight: '6px'}} onChange={e => setDate({...date, day:e.target.value})} placeholder='dd' type='number' name='birthDate' min='1' max='31' value={date.day}/> / 
                    <input style={{width: '40px', padding: '0.6rem', fontSize: '1rem', margin: '0 6px'}} onChange={e => setDate({...date, month:e.target.value})} placeholder='mm' type='number' name='birthDate' min='1' max='12' value={date.month}/> /
                    <input style={{width: '50px', padding: '0.6rem', fontSize: '1rem', marginLeft: '6px'}} onChange={e => setDate({...date, year:e.target.value})} placeholder='aaaa' type='number' name='birthDate' min='1953' max='2100' value={date.year}/>
                </div>
            </div>
            <div className='input-div'>
                <p style={{fontWeight: 'bold'}}><strong>Lugar de nacimiento</strong></p>
                <div>
                    <select value={birthPlace} style={{width: '200px', padding: '0.6rem', fontSize: '1rem', backgroundColor: 'white'}} name='birthPlace' onChange={e => setBirthPlace(parseInt(e.target.value))}>
                        {catalog ? catalog.map((state, ix) => <option key={ix} value={state.value}>{state.text}</option>) : <option value={0}>Cargando...</option>}
                    </select>
                </div>
            </div>
            <div className='input-div'>
                <p style={{fontWeight: 'bold'}}><strong>Sexo</strong></p>
                <div style={{display: 'flex', alignItems: 'center'}} onChange={e => setData({...data, gender:parseInt(e.target.value)})}>
                    <input style={{margin: '5px'}} type='radio' name='gender' checked={data.gender === 1} value={1}/> <span style={{marginRight: '1rem'}}>Hombre</span>
                    <input style={{margin: '5px'}} type='radio' name='gender' checked={data.gender === 2} value={2}/> <span>Mujer</span>
                </div>
            </div>
            <div className={curpError || curpRepeatError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>CURP</strong></p>
                <div>
                    <input disabled={localLoaded} style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleCaseData} type='text' name='curp' maxlength="18" value={data.curp}/>
                </div>
                {curpRepeatError ? <p><small style={{color: 'red', padding: '1rem 0', fontWeight: 'bold'}}>No es posible continuar, este CURP ya tiene una solicitud</small></p> : null}
                <small>Registra tu CURP a 18 dígitos (ejemplo: AAPR931117HDFMNR09). SI no la tienes, puedes obtenerla en <a href="https://www.gob.mx/curp/">https://www.gob.mx/curp/</a></small>
            </div>
            <div className={rfcError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>RFC (Registro Federal de Contribuyentes)</strong></p>
                <div>
                    <input disabled={localLoaded} style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleCaseData} type='text' name='rfc' maxlength="13" value={data.rfc}/>
                </div>
                <small>Registra tu RFC con homoclave a 13 dígitos, por ejemplo AAPR931117AA0. Si no estás registrado en el SAT ingresa los 10 primeros dígitos de tu CURP</small>
            </div>
            <div className='register-subtitle'>
                <h5>Domicilio</h5>
                <p>Por favor, captura tu domicilio actual</p>
            </div>
            <div className={streetError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Calle</strong></p>
                <div>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='street' maxlength="35"  value={data.street}/>
                </div>
            </div>
            <div className={exteriorNumberError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Número exterior</strong></p>
                <div>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='exteriorNumber' maxlength="10" value={data.exteriorNumber}/>
                </div>
                {exteriorNumberError ? <small style={{color: 'red'}}>Ingresa solamente números</small> : null}
            </div>
            <div className='input-div'>
                <p style={{fontWeight: 'bold'}}><strong>Número interior</strong></p>
                <div>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='interiorNumber' maxlength="25" value={data.interiorNumber}/>
                </div>
            </div>
            <div className={zipCodeError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Código Postal</strong></p>
                <div className='zip-button-container'>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='zipCode' maxlength="5" value={data.zipCode}/>
                    <div onClick={() => validateZip()} style={{backgroundColor: '#A3CD3A', padding: '0.5rem 1rem', margin: '0 1rem', color: 'white', fontWeight: '600', cursor: 'pointer', minWidth: '57px'}}>{loadingZip ? <BallBeat loading color={'white'}/> : 'Verificar'}</div>
                </div>
                {notFoundZip ? <small style={{color: 'red'}}>Código postal no encontrado</small> : null}
            </div>
            <div className={municipalityError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Alcaldía o Municipio</strong></p>
                <div>
                    <input disabled style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='municipality' maxlength="30" value={municipality}/>
                </div>
            </div>
            <div className='input-div'>
                <p style={{fontWeight: 'bold'}}><strong>Estado</strong></p>
                <div>
                    <input disabled style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} type='text' name='idState' maxlength="30" value={stateName}/>
                </div>
            </div>
            <div className={suburbError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Colonia</strong></p>
                <div>
                {colCat.length > 0 ? 
                <select value={suburb} style={{width: '200px', padding: '0.6rem', fontSize: '1rem', backgroundColor: 'white'}} name='suburb' onChange={e => setSuburb(e.target.value)}>
                    {colCat.map((res, ix) => <option key={ix} value={res.colonia}>{res.colonia}</option>)}
                </select>
                : 
                <select style={{width: '200px', padding: '0.6rem', fontSize: '1rem', backgroundColor: 'white'}} name='dummy'>
                    <option value=''>Ingresar CP</option>
                </select>}
                </div>
            </div>
            <div className='register-subtitle'>
                <h5>Método de desembolso del préstamo</h5>
                <p>Elija cómo quiere recibir su dinero</p>
            </div>
            <div className="payment-register">
                <div className='payment-register-options'>
                    <div onClick={() => setPaymentType(0)} className={paymentType === 0 ? "payment-register-option-selected" : "payment-register-option"}>Cuenta Bancaria</div>
                    <div onClick={() => setPaymentType(1)} className={paymentType === 1 ? "payment-register-option-selected" : "payment-register-option"}>Tarjeta de débito</div>
                </div>
                <div className="payment-register-content">
                    {paymentType === 0 ?
                        <div className={clabeError ? 'input-div input-error' : 'input-div'}>
                            <small>El préstamo será transferido a tu cuenta bancaria</small>
                            <p style={{fontWeight: 'bold'}}><strong>CLABE (18 dígitos)</strong></p>
                            <div>
                                {loadedClabe && clabe.length > 1 ? 
                                <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={() => {setClabe(''); setDebit(''); setLoadedClabe(false)}} type='text' maxlength="18" value={maskedClabe}/>
                                :
                                <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={e => {setClabe(e.target.value); setDebit('')}} type='text' maxlength="18" value={clabe}/>}
                            </div>
                            <small>La CLABE es un número de 18 dígitos que generan los Bancos para poder realizar transferencias electrónicas. 
                                Puedes localizarlo en cualquier estado de cuenta, contrato o puedes llamar a tu banco para obtenerlo. 
                                Si no lo tienes, no se captura correctamente o no está a TU NOMBRE, no podremos realizar el depósito.</small>
                        </div>
                        :
                        <>
                            <div className={debitError ? 'input-div input-error' : 'input-div'}>
                                <small>El préstamo será transferido a su tarjeta de débito</small>
                                <p style={{fontWeight: 'bold'}}><strong>Número de tarjeta de débito</strong></p>
                                <div>
                                    {loadedDebit && debit.length > 1? 
                                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={() => {setDebit(''); setClabe(''); setLoadedDebit(false)}} type='text' maxlength="16" value={maskedDebit}/>
                                    :
                                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={e => {setDebit(e.target.value); setClabe('')}} type='text' maxlength="16" value={debit}/>}
                                </div>
                                <small></small>
                            </div>
                            <p style={{fontWeight: 'bold', marginTop: '2rem'}}><strong>Emisor de tarjeta de débito</strong></p>
                            <div className="input-wrapper">
                                <select onChange={(e) => setBank(e.target.value)} value={bank} type='text' className="form-control">
                                    {bankCatalog ? bankCatalog.map((banks, ix) => <option key={ix} value={banks.value}>{banks.text}</option>) : <option value={0}>Cargando...</option>}
                                </select>
                            </div>
                        </>
                    }
                </div>
            </div>
            <div className={referenceNameError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Nombre del contacto de referencia</strong></p>
                <div>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={e => setReferenceName(e.target.value)} type='text' maxlength="30" value={referenceName}/>
                </div>
                <small>Puedes ingresar el nombre de algún familiar o amigo donde podamos contactarte</small>
            </div>
            <div className={referenceNumberError ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Número del contacto de referencia</strong></p>
                <div>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={e => setReferenceNumber(e.target.value)} type='text' maxlength="10" value={referenceNumber}/>
                </div>
                <small>Registra por favor el número de teléfono celular donde podremos contactar a tu referencia</small>
            </div>
            <div onClick={handleSubmit} style={{width: '200px'}} className='btn-register'>{loading ? <BallBeat loading color={'white'}/> : 'GUARDAR Y CONTINUAR'}</div>
            {badRequest ? <p><small style={{color: 'red'}}>Error 400, Bad request</small></p> : null}
        </div>
    )
}
