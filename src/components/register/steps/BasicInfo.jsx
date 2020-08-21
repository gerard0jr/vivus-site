import React, {useState, useEffect} from 'react'
import { withRouter, Link } from 'react-router-dom'
import { PopInformation } from '../PopInformation'
import { getToken, getContract, getTermsAndConditions, getCustomerByMail, saveProposal, setRegistration, getRegistration, getProposal, getFinancialEducation, getAnalytics } from '../../../services/api.js'
import cookie from 'react-cookies'
import { BallBeat } from 'react-pure-loaders'
import TagManager from 'react-gtm-module'
import Axios from 'axios'

const idProduct = 1

const BasicInfo = ({setCurrentStep, changeProposal, props}) => {
    
    const [data, setData] = useState({})
    const [showPassword, setShowPassword] = useState(false)
    const [showRepeatPassword, setShowRepeatPassword] = useState(false)
    const [passError, setPassError] = useState(false)
    const [passRepeatError, setPassRepeatError] = useState(false)
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [privacyAccepted, setPrivacyAccepted] = useState(false)
    const [financialAccepted, setFinancialAccepted] = useState(false)

    const [customer, setCustomer] = useState(null)
    const [customerInvalid, setCustomerInvalid] = useState(false)
    const [validEmail, setValidEmail] = useState(false)

    const [repeatPassword, setRepeatPassword] = useState(null)

    const [openContract, setOpenContract] = useState(false)
    const [openPrivacy, setOpenPrivacy] = useState(false)
    const [openFinancial, setOpenFinancial] = useState(false)

    const [contract, setContract] = useState(null)
    const [privacy, setPrivacy] = useState(null)
    const [financial, setFinancial] = useState(null)

    const [loadingForm, setLoadingForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [logged, setLogged] = useState(false)
    const [ip, setIp] = useState(null)
    
    // Error handling
    const [firstNameError, setFirstNameError] = useState(false)
    const [firstLastNameError, setFirstLastNameError] = useState(false)
    const [secondLastNameError, setSecondLastNameError] = useState(false)
    const [mobilePhoneError, setMobilePhoneError] = useState(false)
    const [homePhoneError, setHomePhoneError] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [tokenError, setTokenError] = useState(false)

    useEffect(() => {
        if(firstNameError || firstLastNameError || secondLastNameError || mobilePhoneError || homePhoneError || serverError || tokenError){
            window.scrollTo(0, 180)
        }
    }, [firstNameError, firstLastNameError, secondLastNameError, mobilePhoneError, homePhoneError, serverError, tokenError])

    const handleData = e => {
        if(e.target.name === 'eMail') return setData({...data, [e.target.name]: e.target.value.toLowerCase()})
        setData({...data, [e.target.name]: e.target.value})
    }

    const checkPassword = pass => {
        if(logged) return true
        if(!data.password){
            setPassError(true)
            return false
        }
        setPassError(false)
        if(!pass){
            setPassRepeatError(true)
            return false
        }
        if(data.password !== pass){
            setPassRepeatError(true)
            return false
        }
        setPassRepeatError(false)
        return true
    }
    // TAG MANAGER
    useEffect(() => {
        const tagManagerArgs = {
            dataLayer: {
                event: 'pageChange',
                page: {
                    url: '/register',
                    referrer: '/'
                }
            },
            dataLayerName: 'dataLayer'
        }
        TagManager.dataLayer(tagManagerArgs)
    }, [])
    // TAG MANAGER END

    const submitData = async () => {
        if(data.eMail === 'demo@demo.com') return props.push('/registration/personal-details')
        if(!(termsAccepted && privacyAccepted && financialAccepted)) return
        if(!data.firstName) return setFirstNameError(true)
        else setFirstNameError(false)
        if(!data.firstLastName) return setFirstLastNameError(true)
        else setFirstLastNameError(false)
        if(!data.secondLastName) return setSecondLastNameError(true)
        else setSecondLastNameError(false)
        if(!data.mobilePhone) return setMobilePhoneError(true)
        else setMobilePhoneError(false)
        if(data.mobilePhone.length < 10) return setMobilePhoneError(true)
        else setMobilePhoneError(false)
        if (data.mobilePhone.match(/^[0-9]+$/) === null) return setMobilePhoneError(true)
        else setMobilePhoneError(false)
        if (data.mobilePhone.search(/[a-zA-Z]/) !== -1) return setMobilePhoneError(true)
        else setMobilePhoneError(false)
        if(data.mobilePhone === data.homePhone) return setHomePhoneError(true)
        else setHomePhoneError(false)
        if(!data.homePhone) return setHomePhoneError(true)
        else setHomePhoneError(false)
        if(data.homePhone.length < 10) return setHomePhoneError(true)
        else setHomePhoneError(false)
        if (data.homePhone.match(/^[0-9]+$/) === null) return setHomePhoneError(true)
        else setHomePhoneError(false)
        if (data.homePhone.search(/[a-zA-Z]/) !== -1) return setHomePhoneError(true)
        else setHomePhoneError(false)
        let repeatPass = await checkPassword(repeatPassword)
        if(!repeatPass) return
        if(!logged && (!data.password || data.password.length < 6)) return setPassError(true)
        else setPassError(false)
        setLoadingForm(true)
        let submittedData = {
            ...data,
            idProduct, 
            secondName: '',
            termsAccepted,
            privacyAccepted,
            financialAccepted,
            utm: sessionStorage.getItem('utm') || '/',
            customerOrigin: document.URL,
            userAgent: navigator.userAgent,
            clientIP: sessionStorage.getItem('ip') || ip,
            additionalFields: []
        }
        if(logged) submittedData.password = ''
        if(!logged) submittedData.idCustomer = 0
        else submittedData.idCustomer = customer.customerId
        let validToken = cookie.load('token')
        if(!validToken){
            let response = await getToken()
            if(!response.data) return props.push('/error')
            if(response.data) validToken = response.data.token
        }
       
        sessionStorage.setItem('data-step-registration', JSON.stringify(submittedData))
        setRegistration(submittedData, validToken)
            .then(res => {
                if(res.status === 200){
                    setServerError(false)
                    let proposal = JSON.parse(sessionStorage.getItem('proposal'))
                    return getCustomerByMail(idProduct, data.eMail, validToken)
                    .then(response => {
                        sessionStorage.setItem('empty-customer', JSON.stringify(response.data))
                        if(response.status === 200){
                            return saveProposal(idProduct, response.data.customerId, proposal.monto, proposal.periodicidad, proposal.plazo, validToken)
                            .then(res => {
                                if(res.status === 200) {
                                    return props.push('/registration/personal-details')
                                }
                            })
                            .catch(err => setLoadingForm(false))
                        }
                    })
                    .catch(err => {
                        setServerError(false)
                        setLoadingForm(false)
                    })
                }
                setServerError(true)
                setLoadingForm(false)
            })
            .catch(err => setLoadingForm(false))
            // Save slider
        
    }

    const checkUser = async () => {
        sessionStorage.removeItem('customer-register')
        sessionStorage.removeItem('empty-customer')
        sessionStorage.removeItem('data-step-registration')
        sessionStorage.removeItem('session-step')
        sessionStorage.removeItem('customer-logged')
        if(data.eMail === 'demo@demo.com') return setValidEmail(true)
        setLoading(true)
        let rex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!data.eMail || !rex.test(data.eMail.toLowerCase())) {
            setLoading(false)
            return setCustomerInvalid(true)
        }
        setCustomerInvalid(false)
        let validToken = cookie.load('token')
        if(!validToken){
            let response = await getToken()
            if(!response.data) return props.push('/error')
            if(response.data) validToken = response.data.token
        }
        let response = await getCustomerByMail(idProduct, data.eMail, validToken)
        if(response.status === 200){
            sessionStorage.setItem('customer-register', JSON.stringify(response.data))
            return props.push('/login')
        }
        setValidEmail(true)
        setLoading(false)
    }

    const handlePassword = e => {
        if (e.target.value.length < 6) {
            return setPassError(true)
        } else if (e.target.value.length > 30) {
            return setPassError(true)
        } else if (e.target.value.search(/\d/) === -1) {
            return setPassError(true)
        } else if (e.target.value.search(/[a-zA-Z]/) === -1) {
            return setPassError(true)
        } else if (e.target.value.search(/[^a-zA-Z0-9!@#$%^&*()_+.,;:]/) !== -1) {
            return setPassError(true)
        }
        setPassError(false)
    }

    const loadEmptyCustomer = (idCustomer, eMail, validToken) => {
        getCustomerByMail(idProduct, eMail, validToken)
            .then(res => {
                setCustomer(res.data)
                setValidEmail(true)
                getRegistration(idProduct, idCustomer, eMail, validToken)
                    .then(res => setData(res.data))
                    .catch(err => console.log(err))
                getProposal(idProduct, idCustomer, validToken)
                    .then(res => {
                        if(res.status === 200){
                            let proposal = {
                                monto: res.data.amount,
                                periodicidad: res.data.opFrequency,
                                plazo: res.data.term
                            }
                            changeProposal(proposal)
                            let step = sessionStorage.getItem('session-step')
                            // if(step === '0') return props.push('/registration')
                            // if(step === '1') return props.push('/registration/personal-details')
                            // if(step === '2') return props.push('/registration/employment-details')
                            // if(step === '3') return props.push('/registration/nip-bureau')
                            // if(step === '4') return props.push('/registration/identity')
                            // if(step === '5') return props.push('/registration-complete')
                            if(sessionStorage.getItem('session-step')) sessionStorage.setItem('session-step', 0)
                        }
                    })
                    .catch(err => console.log(err))
            })
            .catch(err => {
                console.log(err)
            })
    }

    const loadCalculatorOnly = (idCustomer, step, token) => {
        getProposal(idProduct, idCustomer, token)
            .then(res => {
                if(res.status === 200){
                    let proposal = {
                        monto: res.data.amount,
                        periodicidad: res.data.opFrequency,
                        plazo: res.data.term
                    }
                    changeProposal(proposal)
                    if(step === 0) return props.push('/registration')
                    if(step === 1) return props.push('/registration/personal-details')
                    if(step === 2) return props.push('/registration/employment-details')
                    if(step === 3) return props.push('/registration/nip-bureau')
                    if(step === 4) return props.push('/registration/identity')
                    if(step === 5) return props.push('/registration-complete')
                    if(step === 6) return props.push('/registration/questionary')
                    // setCurrentStep(step)
                }
            })
    }

    const blockScroll = () => {
        document.getElementsByTagName('body')[0].style.overflowY = 'hidden'
    }   

    const releaseScroll = () => {
        document.getElementsByTagName('body')[0].style.overflowY = 'auto'
    }

    useEffect(() => {
        const askToken = async () => {
            let validToken = cookie.load('token')
            if(!validToken){
                let response = await getToken()
                if(!response.data) return
                if(response.data) validToken = response.data.token
            }

            let contRes = await getContract(idProduct, 0, validToken)
            let termRes = await getTermsAndConditions(idProduct, 0, validToken)
            let finRes = await getFinancialEducation(idProduct, 0, validToken)

            setContract({__html: contRes.data.htmlText})
            setPrivacy({__html: termRes.data.htmlText})
            setFinancial({__html: finRes.data.htmlText})
            return
        }
        askToken()
        Axios.get('https://api.ipify.org')
            .then(res => setIp(res.data))
            .catch(err => setIp('0.0.0.0'))
    }, [])

    useEffect(() => {
        const askLogged = async () => {
            let validToken = cookie.load('token')
            if(!validToken){
                let response = await getToken()
                if(!response.data) return
                if(response.data) validToken = response.data.token
            }
            let currentStep = await sessionStorage.getItem('session-step')
            if(currentStep === '3') return props.push('/registration/nip-bureau')
            if(currentStep === '4') return props.push('/registration/identity')
            if(currentStep === '5') return props.push('/registration-complete')
            if(currentStep === '6') return props.push('/registration/questionary')
            // if(currentStep === '3' || currentStep === '4' || currentStep === '5') return setCurrentStep(parseInt(currentStep))
            let directStep = await sessionStorage.getItem('customer-direct-step')
            if(directStep){
                let emptyCustomer = await JSON.parse(sessionStorage.getItem('empty-customer'))
                if(emptyCustomer){
                    setLogged(true)
                    return loadCalculatorOnly(emptyCustomer.customerId ? emptyCustomer.customerId : emptyCustomer.idCustomer, parseInt(directStep), validToken)
                }
                if(directStep === 0) return props.push('/registration')
                if(directStep === 1) return props.push('/registration/personal-details')
                if(directStep === 2) return props.push('/registration/employment-details')
                if(directStep === 3) return props.push('/registration/nip-bureau')
                if(directStep === 4) return props.push('/registration/identity')
                if(directStep === 5) return props.push('/registration-complete')
                if(directStep === 6) return props.push('/registration/questionary')
                // return setCurrentStep(parseInt(directStep))
            } else{
                let loggedUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
                if(!loggedUser) {
                    let emptyCustomer = await JSON.parse(sessionStorage.getItem('empty-customer'))
                    if(emptyCustomer){
                        setLogged(true)
                        return loadEmptyCustomer(emptyCustomer.customerId ? emptyCustomer.customerId : emptyCustomer.idCustomer, emptyCustomer.eMail, validToken)
                    }
                    return
                }
                setCustomerInvalid(false)
                setCustomer(loggedUser)
                setLogged(true)
                return loadEmptyCustomer(loggedUser.customerId, loggedUser.eMail, validToken)
            }
        }
        askLogged()
    }, [])

    let fillDemo = () => {
        sessionStorage.setItem('demoUser', JSON.stringify({
            eMail: 'demo@demo.com',
            customerId: 12345,
            fullName: 'Demo',
            mobile: '5565829661'
        }))
        if(!data.eMail) return setData({eMail: 'demo@demo.com'})
        setData({...data, 
            firstName: 'Demo',
            firstLastName: 'FN',
            secondLastName: 'LN',
            homePhone: '5565829661',
            mobilePhone: '5544778899',
            password: 'parole1',
        })
        setRepeatPassword('parole1')
        setTermsAccepted(true)
        setPrivacyAccepted(true)
        setFinancialAccepted(true)
    }

    return (
        <>
        {!tokenError ? 
        <div className='register-form-container'>
            {/* <div onClick={fillDemo} className="fill-demo">DEMO</div> */}
            <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Registro</h1>
            <div style={{borderBottom: '5px solid black', width: '50px'}}></div>
            <div style={{marginBottom: '1rem'}}>
                <div className='register-questions'>
                    <p>¿Ya eres cliente?</p><Link to='/login'>Por favor ingresa aquí</Link>
                </div>
                <small>Por favor llena todos los campos</small>
            </div>
            <div className={customerInvalid ? 'input-div input-error' : 'input-div'}>
                <p style={{fontWeight: 'bold'}}><strong>Correo electrónico</strong></p>
                <div className='validation-email-register'>
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='eMail' value={data.eMail}/>
                    {validEmail || customer ? null : loading ? <div style={{backgroundColor: '#A3CD3A', padding: '0.5rem 1rem', margin: '0 1rem', color: 'white', fontWeight: '600', cursor: 'pointer', minWidth: '57px'}}><BallBeat loading color={'white'}/></div> : <small onClick={checkUser} style={{backgroundColor: '#A3CD3A', padding: '0.5rem 1rem', margin: '0 1rem', color: 'white', fontWeight: '600', cursor: 'pointer'}}>Verificar</small>}
                </div>
                {customerInvalid ? <><small style={{color: 'red', marginLeft: '1rem'}}>Correo electrónico incorrecto</small><br/></> : null}
                <small>Para mantenerte informado sobre el progreso de tu solicitud</small>
            </div>
            {validEmail || customer ?
            <>
                <div className={firstNameError ? 'input-div input-error' : 'input-div'}>
                    <p style={{fontWeight: 'bold'}}><strong>Nombre</strong></p>
                    <div>
                        <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='firstName' maxlength="40" value={data.firstName}/>
                    </div>
                </div>
                <div className={firstLastNameError ? 'input-div input-error' : 'input-div'}>
                    <p style={{fontWeight: 'bold'}}><strong>Apellido Paterno</strong></p>
                    <div>
                        <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='firstLastName' maxlength="30" value={data.firstLastName}/>
                    </div>
                </div>
                <div className={secondLastNameError ? 'input-div input-error' : 'input-div'}>
                    <p style={{fontWeight: 'bold'}}><strong>Apellido Materno</strong></p>
                    <div>
                        <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='secondLastName' maxlength="30" value={data.secondLastName}/>
                    </div>
                </div>
                <div className='register-subtitle'>
                    <h5>Detalles de contacto</h5>
                    <p>Esta información es confidencial y sólo será utilizada para corroborar tu identidad</p>
                </div>
                <div className={mobilePhoneError ? 'input-div input-error' : 'input-div'}>
                    <p style={{fontWeight: 'bold'}}><strong>Celular</strong></p>
                    <div>
                        <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='mobilePhone' maxlength="10" value={data.mobilePhone}/>
                    </div>
                    <small>Ingresa tu teléfono a 10 dígitos incluyendo código de ciudad (ejemplo: 5511112222)</small>
                </div>
                <div className={homePhoneError ? 'input-div input-error' : 'input-div'}>
                    <p style={{fontWeight: 'bold'}}><strong>Otro teléfono de contacto</strong></p>
                    <div>
                        <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={handleData} type='text' name='homePhone' maxlength="10" value={data.homePhone}/>
                    </div>
                    <small style={homePhoneError ? {color: 'red'} : null}>Requerimos de un número telefónico adicional donde podamos localizarte, este número debe ser diferente de tu teléfono celular y debe capturarse a 10 dígitos incluyendo código de ciudad</small>
                </div>
                {!logged ? 
                <>
                    <div className='register-subtitle'>
                        <h5>Cuenta Online</h5>
                        <p>Revisa tu estado de cuenta aquí</p>
                    </div>
                    <div className={passError ? 'input-div input-error' : 'input-div'}>
                        <p style={{fontWeight: 'bold'}}><strong>Elegir una contraseña</strong></p>
                        <div className={showPassword ? 'password-wrapper eye' : 'password-wrapper eye-hidden'}>
                            <div className="input-wrapper">
                                <input onChange={e => {handleData(e); handlePassword(e)}} value={data.password} style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} type={showPassword ? 'text' : 'password'} className="form-control" name="password"/>
                            </div>
                            <p onClick={() => setShowPassword(!showPassword)} className="show-password">{showPassword ? 'Ocultar' : 'Mostrar'} contraseña</p>
                        </div>
                        {passError ? <div><small style={{color: 'red', fontSize: '0.9rem', marginTop: '1rem'}}>La contraseña es muy débil</small></div> : null}
                        <small>La contraseña debe ser de al menos 6 caracteres y debe incluir al menos 1 número</small>
                    </div>
                    <div className={passError ? 'input-div input-error' : 'input-div'}>
                        <p style={{fontWeight: 'bold'}}><strong>Repite tu contraseña</strong></p>
                        <div className={showPassword ? 'password-wrapper eye' : 'password-wrapper eye-hidden'}>
                            <div className="input-wrapper">
                                <input onChange={e => {setRepeatPassword(e.target.value); checkPassword(e.target.value)}} value={repeatPassword} style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} type={showRepeatPassword ? 'text' : 'password'} className="form-control" name="password"/>
                            </div>
                            <p onClick={() => setShowRepeatPassword(!showRepeatPassword)} className="show-password">{showRepeatPassword ? 'Ocultar' : 'Mostrar'} contraseña</p>
                        </div>
                        {passRepeatError ? <div><small style={{color: 'red', fontSize: '0.9rem', marginTop: '1rem'}}>Las contraseñas no coinciden</small></div> : null}
                    </div>
                </>
                : null}
                <div className='register-subtitle'>
                    <h5>Consentimiento legal</h5>
                    <p>Por favor, abre, lee y acepta a Vivus.</p>
                </div>
                <div className='checkbox-div'>
                    <div className='checkbox-top'>
                        <label className="container">
                            <input onChange={() => {setOpenContract(true); blockScroll()}} checked={termsAccepted} type="checkbox"/>
                            <span className="checkmark"></span>
                        </label>
                        <p style={{fontWeight: 'bold', margin: '0 2rem'}}><strong>Términos del contrato</strong></p>
                        {termsAccepted ? <p style={{backgroundColor: 'lightgray', cursor: 'default'}} className='btn-register'>Aceptado</p> : <div onClick={contract ? () => {setOpenContract(true); blockScroll()} : null} className='btn-register'>{contract ? 'Por favor, lee y acepta' : <BallBeat loading color={'white'}/>}</div>}
                    </div>
                </div>
                <div className='checkbox-div'>
                    <div className='checkbox-top'>
                        <label className="container">
                            <input onChange={() => {setOpenPrivacy(true); blockScroll()}} checked={privacyAccepted} type="checkbox"/>
                            <span className="checkmark"></span>
                        </label>
                        <p style={{fontWeight: 'bold', margin: '0 2rem'}}><strong>Aviso de Privacidad</strong></p>
                        {privacyAccepted ? <p style={{backgroundColor: 'lightgray', cursor: 'default'}} className='btn-register'>Aceptado</p> : <div onClick={privacy ? () => {setOpenPrivacy(true); blockScroll()} : null} className='btn-register'>{privacy ? 'Por favor, lee y acepta' : <BallBeat loading color={'white'}/>}</div>}
                    </div>
                    <small>Al proporcionar tu correo electrónico aceptas recibir por parte de Vivus noticias y comunicaciones promocionales. Podrás revocar dicho consentimiento en cualquier momento, para más detalles consulta nuestro Aviso de Privacidad</small>
                </div>
                <div className='checkbox-div'>
                    <div className='checkbox-top'>
                        <label className="container">
                            <input onChange={() => {setOpenFinancial(true); blockScroll()}} checked={financialAccepted} type="checkbox"/>
                            <span className="checkmark"></span>
                        </label>
                        <p style={{fontWeight: 'bold', margin: '0 2rem'}}><strong>Educación Financiera</strong></p>
                        {financialAccepted ? <p style={{backgroundColor: 'lightgray', cursor: 'default'}} className='btn-register'>Aceptado</p> : <div onClick={financial ? () => {setOpenFinancial(true); blockScroll()} : null} className='btn-register'>{financial ? 'Por favor, lee y acepta' : <BallBeat loading color={'white'}/>}</div>}
                    </div>
                    <small>Acepto recibir el servicio de Educación Financiera prestado por 4finance</small>
                </div>
                <div onClick={submitData} className={termsAccepted && privacyAccepted && financialAccepted ? 'btn-register' : 'btn-register-disabled'}>{loadingForm ? <BallBeat loading color={'white'}/> :  'Continuar'}</div>
                {serverError ? 
                <div>
                    <small>Ocurrió un error en el servidor, intenta nuevamente</small>
                </div> 
                : 
                null}
            </>
            :
            null}
            <PopInformation open={openContract} close={() => {setOpenContract(false); releaseScroll()}} data={contract} accept={setTermsAccepted}/>
            <PopInformation open={openPrivacy} close={() => {setOpenPrivacy(false); releaseScroll()}} data={privacy} accept={setPrivacyAccepted}/>
            <PopInformation open={openFinancial} close={() => {setOpenFinancial(false); releaseScroll()}} data={financial} accept={setFinancialAccepted}/>
        </div> : <div>Error en el servidor...</div>}
        </>
    )
}

export default withRouter(BasicInfo)