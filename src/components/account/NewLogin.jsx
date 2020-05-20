import React, {useState, useEffect} from 'react'
import { Link, withRouter } from 'react-router-dom'
import './newStyles.scss'
import { BallBeat } from 'react-pure-loaders'
import cookie from 'react-cookies'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons'
import { getToken, getStatus, login, getCustomerByMail, saveSingleUTM } from '../../services/api'
import publicIp from 'public-ip'
import TagManager from 'react-gtm-module'

const idProduct = 2

const NewLogin = (props) => {
    const [password, setPassword] = useState(null)
    const [email, setEmail] = useState(null) 
    const [customerId, setCustomerId] = useState(null) 
    const [showPassword, setShowPassword] = useState(false)
    const [passError, setPassError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [cleanLogin, setCleanLogin] = useState(false)

    const [emailError, setEmailError] = useState(false)

    const handleSubmit = async () => {
      setLoading(true)
      let rex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(!email || !rex.test(email.toLowerCase())) {
          setLoading(false)
          return setEmailError(true)
      }
      setEmailError(false)
      if(!password || password.length < 1) {
        setLoading(false)
        return setPassError(true)
      }
      setPassError(false)
      const myIp = await publicIp.v4()
      if(myIp){
          sessionStorage.setItem('ip', myIp)
          let userAgent= window.navigator.userAgent
          let coordinates
          navigator.geolocation.getCurrentPosition(function(position) { 
            coordinates = `${position.coords.latitude} ${position.coords.longitude}`
            sessionStorage.setItem('coords', `${position.coords.latitude} ${position.coords.longitude}`)
          })
          let submittedData = {
            idProduct,
            userName: email,
            password,
            ipAddress: myIp,
            userAgent,
            coordinates
          }  
          let response = await getToken()
          if(!response.data) {
            return props.history.push('/error')
          }
          if(response.data){
            let validToken = response.data.token
            cookie.save('token', response.data.token, {maxAge: 60 * 20})
            return login(submittedData, validToken)
              .then(res => {
                const { data } = res
                if(res.status === 200){
                  sessionStorage.setItem('loggedUser', JSON.stringify(data.customer))
                  return checkStatus(data.customer.customerId, validToken, myIp)
                }    
                setLoading(false)
                return setPassError(true)
              })     
          }
        }
        sessionStorage.setItem('ip', 'IP blocked')
        let userAgent= window.navigator.userAgent
        let coordinates
        navigator.geolocation.getCurrentPosition(function(position) { 
          coordinates = `${position.coords.latitude} ${position.coords.longitude}`
          sessionStorage.setItem('coords', `${position.coords.latitude} ${position.coords.longitude}`)
        })
        let submittedData = {
          idProduct,
          userName: email,
          password,
          ipAddress: myIp,
          userAgent,
          coordinates
        }  
        let response = await getToken()
        if(!response.data) {
          return props.history.push('/error')
        }
        if(response.data){
          let validToken = response.data.token
          cookie.save('token', response.data.token, {maxAge: 60 * 20})
          return login(submittedData, validToken)
            .then(res => {
              const { data } = res
              if(res.status === 200){
                sessionStorage.setItem('loggedUser', JSON.stringify(data.customer))
                return checkStatus(data.customer.customerId, validToken, myIp)
              }    
              setLoading(false)
              return setPassError(true)
            })     
        }
    }

    const checkStatus = async (idCustomer, token, ip) => {
      let dataWithStatus = {
        data: JSON.parse(sessionStorage.getItem('customer-register')),
        step: 0
      }  

      let utm = sessionStorage.getItem('utm')

      saveSingleUTM({customerOrigin: document.URL, utm, userAgent: navigator.userAgent, clientIP: ip, idCustomer, idProduct},token)
      .then(res => console.log(res.status))

      return getStatus(idProduct, idCustomer, false, token)  //false is for isNIP
        .then(res => {
          const { data } = res
          console.log(data)
          let directStep = 1
          if(res.status === 200){
            if(data.idStatus === 1){
              return getCustomerByMail(idProduct, email, token)
                .then(res => {
                  if(data.idSubStatus === 180) {dataWithStatus.step = 1; directStep = 1}
                  if(data.idSubStatus === 181) {dataWithStatus.step = 2; directStep = 2}
                  if(data.idSubStatus === 182) {dataWithStatus.step = 3; directStep = 3}
                  if(data.idSubStatus === 183) {dataWithStatus.step = 4; directStep = 4}
                  if(data.idSubStatus === 184) {dataWithStatus.step = 4; directStep = 4}
                  if(data.idSubStatus === 185) {dataWithStatus.step = 3; directStep = 3}
                  if(data.idSubStatus === 195) {dataWithStatus.step = 5; directStep = 5}
                  if(data.idSubStatus === 196) return props.history.push('/pre-approved')
                  if(data.idSubStatus === 203) return props.history.push('/pre-approved')
                  if(data.idSubStatus === 206) return props.history.push('/dashboard/id')
                  if(data.idSubStatus === 217) return props.history.push('/dashboard/confirm')
                  if(data.idSubStatus === 218) return props.history.push('/application-complete')
                  if(data.idSubStatus === 219) return props.history.push('/application-complete')
                    if(cleanLogin){
                      sessionStorage.setItem('empty-customer', JSON.stringify({idCustomer, email, mobile: res.data.mobile}))
                      sessionStorage.setItem('customer-direct-step', JSON.stringify(directStep))
                      if(directStep === 1) return props.history.push('/registration/personal-details')
                      if(directStep === 2) return props.history.push('/registration/employment-details')
                      if(directStep === 3) return props.history.push('/registration/nip-bureau')
                      if(directStep === 4) return props.history.push('/registration/identity')
                      if(directStep === 5) return props.history.push('/registration-complete')
                      // return props.history.push('/registration')
                    }
                    if(sessionStorage.getItem('recoveryEmail')) {
                      sessionStorage.removeItem('recoveryEmail')
                      sessionStorage.setItem('empty-customer', JSON.stringify({idCustomer, email, mobile: res.data.mobile}))
                      sessionStorage.setItem('customer-direct-step', JSON.stringify(directStep))
                      if(directStep === 1) return props.history.push('/registration/personal-details')
                      if(directStep === 2) return props.history.push('/registration/employment-details')
                      if(directStep === 3) return props.history.push('/registration/nip-bureau')
                      if(directStep === 4) return props.history.push('/registration/identity')
                      if(directStep === 5) return props.history.push('/registration-complete')
                      // return props.history.push('/registration')
                    }
                    sessionStorage.removeItem('recoveryEmail')
                    sessionStorage.setItem('customer-logged', JSON.stringify(dataWithStatus))
                    if(dataWithStatus.step === 1) return props.history.push('/registration/personal-details')
                    if(dataWithStatus.step === 2) return props.history.push('/registration/employment-details')
                    if(dataWithStatus.step === 3) return props.history.push('/registration/nip-bureau')
                    if(dataWithStatus.step === 4) return props.history.push('/registration/identity')
                    if(dataWithStatus.step === 5) return props.history.push('/registration-complete')
                    // return props.history.push('/registration')
                })
                .catch(err => console.log(err))
              }
              if(data.idStatus === 4){
                sessionStorage.setItem('empty-customer', JSON.stringify({idCustomer, email, mobile: res.data.mobile, penaltyDays: res.data.penaltyDays}))
                sessionStorage.setItem('APP', 'no')
                return props.history.push('/denied')
              }
              if(data.idStatus === 6){
                sessionStorage.setItem('empty-customer', JSON.stringify(res.data))
                sessionStorage.setItem('APP', 'yes')
                return props.history.push('/dashboard/welcome')
              }
              if(data.idStatus === 7){
                console.log(res.data)
                sessionStorage.setItem('empty-customer', JSON.stringify(res.data))
                sessionStorage.setItem('APP', 'yes')
                return props.history.push('/dashboard/welcome')
              }
              setLoading(false)
              setPassError(false)
              return props.history.push('/dashboard/welcome')
          }
        })
        .catch(err => console.log(err))
    }

    useEffect(() => {
      const checkRegister = async () => {
        let recoveryMail = await sessionStorage.getItem('recoveryEmail')
        if(recoveryMail) return setEmail(recoveryMail)

        let comesFromRegister = await JSON.parse(sessionStorage.getItem('customer-register'))
        if(!comesFromRegister) {
          setCleanLogin(true)
          if(sessionStorage.getItem('loggedUser') && cookie.load('token')) props.history.push('/dashboard/welcome')
          return
        }
        setCustomerId(comesFromRegister.customerId)
        return setEmail(comesFromRegister.eMail)
      }
      checkRegister()
    }, [])

    // TAG MANAGER
    useEffect(() => {
      const tagManagerArgs = {
          dataLayer: {
              event: 'pageChange',
              page: {
                  url: '/login',
                  referrer: '/'
              }
          },
          dataLayerName: 'dataLayer'
      }
      TagManager.dataLayer(tagManagerArgs)
  }, [])
  // TAG MANAGER END

    return (
      <div className='app-container login-container'>
          <div className='leftLogin' style={{width: '58%', textAlign: 'left', padding: '3rem 6rem'}}>
            <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '3rem'}}>Bienvenido de nuevo</h1>
            <h1 style={{margin: '0 0 1rem 0', padding: 0, fontWeight: '300'}}>Ingresa a tu cuenta efectiGO</h1>
            <div style={{borderBottom: '5px solid black', width: '50px'}}></div>

            <div style={{marginTop: '2rem'}}>
                <p style={{fontWeight: 'bold'}}><strong>Correo electrónico</strong></p>
                <div style={{marginBottom: '2rem'}}>
                  <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={e => setEmail(e.target.value)} type='email' name='email' value={email}/>
                </div>
                {emailError ? 
                <div style={{margin: '-1.5rem 0 1.5rem 0'}}>
                  <p style={{color: 'red'}}>Ingresa un correo válido</p>
                </div> 
                : null}
                <p style={{fontWeight: 'bold'}}><strong>Ingresar contraseña</strong></p>
                <div className={showPassword ? 'password-wrapper eye' : 'password-wrapper eye-hidden'}>
                  <div className="input-wrapper">
                    <input onChange={(e) => setPassword(e.target.value)} style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} type={showPassword ? 'text' : 'password'} className="form-control" id="password" name="password"/>
                  </div>
                  <p onClick={() => setShowPassword(!showPassword)} className="show-password">{showPassword ? 'Ocultar' : 'Mostrar'} contraseña</p>
                </div>
                {passError ? <div><small style={{color: 'red', fontSize: '0.9rem', marginTop: '1rem'}}>Contraseña incorrecta</small></div> : null}
                {serverError ? <div><small style={{color: 'red', fontSize: '0.9rem', marginTop: '1rem'}}>Error en el servidor</small></div> : null}
                <div className='login-button' style={{display: 'flex', alignItems: 'center', width: '500px', marginTop: '2rem'}}>
                  <p onClick={handleSubmit} className='btn-minimal-width'>
                      {loading ? <BallBeat color={'#fff'} loading/> : 'INGRESAR'}
                  </p>
                  <Link className='no-margin-mquery' style={{borderBottom: '0px', marginLeft: '2rem', cursor: 'pointer', color: '#A3CD3A'}} to="/recupera">¿Olvidaste tu contraseña?</Link>
                </div>
                <div style={{margin: '2rem 0 0'}}>
                  <span>¿No tienes cuenta? <Link className='no-margin-mquery' style={{borderBottom: '0px', cursor: 'pointer', color: '#A3CD3A'}} to="/registration">Crea tu cuenta</Link></span>
                </div>
                <div style={{display: 'flex', alignItems: 'flex-start', padding: '2rem 0'}}>
                  <FontAwesomeIcon style={{fontSize:'2rem', color: 'gray'}} icon={faShieldAlt} />
                  <p style={{marginLeft: '1rem', width: '250px', fontSize: '0.9rem', color: 'gray'}}>Utilizamos el mismo nivel de seguridad que un banco para resguardar tu información</p>
                </div>
            </div>
          </div>
          {/* Ready for referred plan? */}
          {/* <div className='rightLogin'>
            <div className="friends-container">
              <div className='top-friends'>
                <p><strong>Invita</strong></p>
                <p>a tus amigos</p>
              </div>
              <div className='bottom-friends'>
                <img src="/img/ref_man.svg" alt="refman"/>
                <div style={{padding: '1rem'}}>
                  <p style={{fontWeight: 300, fontSize: '1rem', marginBottom: '1rem'}}>Gana dinero invitando a tus amigos a solicitar un préstamo con efectiGO. Ingresa a tu cuenta para comenzar a invitar.</p>
                  <Link to='/'>Más información</Link>
                </div>
              </div>
            </div>
          </div> */}
      </div>
    )
}

export default withRouter(NewLogin)
