import React, {useState, useEffect} from 'react'
import Countdown from 'react-countdown-now';
import { withRouter, Link } from 'react-router-dom'
import { BallBeat } from 'react-pure-loaders'
import cookie from 'react-cookies'
import { getToken, checkCode, recoverPassword, getCustomerByMail } from '../../services/api'

const idProduct = 1

const PasswordRecoveryEmailConfirmation = (props) => {
  const [eMail, setEMail] = useState(null)
  const [counter, setCounter] = useState(false)
  const [codigo, setCodigo] = useState(null)
  const [codeError, setCodeError] = useState(null)
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    let getEmail = sessionStorage.getItem('recoveryEmail')
    if(!getEmail) return props.history.push('/login')
    setEMail(getEmail)
  },[])

  useEffect(() => {
    if(sessionStorage.getItem('loggedUser') && cookie.load('token')) props.history.push('/dashboard/initial')
  }, [])

	const renderer = ({ seconds, completed }) => {
		if (completed) {
      // Render a completed state
      setCounter(true)
		  return null
		} else {
		  // Render a countdown
		  return <span style={{ padding: '1.5rem 3rem 1.5rem 3rem', color:'#999', border: '1px solid #999', borderRadius: '3px', margin:'1rem' }}>INTENTA DE NUEVO ({seconds} SEC.)</span>
		}
  }
  
    const handleCode = async () => {
      if(!codigo) return setCodeError(true)
      if(codigo.length > 4) return setCodeError(true)
      setCodeError(false)
      setLoading(true)
      let data = {
        code: parseInt(codigo),
        idProduct,
        isNIP: false,
        userAgent: navigator.userAgent,
        clientIP: '192.868.1.254',
        coordinates: '92.76, -98.54'
      }
      let response = await getToken()
      if(!response) return
      let validToken = response.data.token
      getCustomerByMail(idProduct, eMail, validToken)
      .then(res => {
        if(res.status === 200){
          data.idCustomer = res.data.customerId
          checkCode(data, validToken)
            .then(res => {
              if(res.data.idStatus === 1){
                sessionStorage.setItem('code-valid', 'true')
                return props.history.push('/nuevo-password')
              }
              setCodeError(true)
              setLoading(false)
            })
            .catch(err => {
              setCodeError(true)
              setLoading(false)
            })
        }
      })
    }
    
    const sendAgain = async () => {
      let response = await getToken()
      if(!response) return
      let validToken = response.data.token
      const data = {
        idProduct,
        eMail
      }
      recoverPassword(data, validToken)
    }

    return (
        <div className='app-container'>
          <div className='forgot-layout' style={{backgroundColor: 'white', textAlign: 'center'}}>
            <h2 style={{fontWeight: 'bold', backgroundColor: '#A3CD3A', color: 'white', padding: '3rem'}}>¡Enviado! <br/>Revisa tu email</h2>
            <img src="/img/vivus-recover-sent.png" alt="user" style={{width: '96px'}} />
			      <p>Hemos enviado un link para que puedas recuperar tu acceso a tu email {eMail}</p>
            <div style={{margin: '2rem 1rem'}}>
              <div style={{margin: '3rem 0'}}>			
                <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} type='text' name='codigo' maxLength='4' placeholder="Código para recuperación" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                {codeError && <div><small style={{color: 'red'}}>Código incorrecto</small></div>}
                <div style={{margin: '1rem 0'}}><p className='btn-minimal-width btn-forgot' onClick={handleCode}>{loading ? <BallBeat color={'#fff'} loading/> : 'INGRESA CÓDIGO'}</p></div>
              </div>
            </div>
            <div style={{display: 'block', justifyContent: 'center', alignItems: 'center'}}>                
              <div style={{margin: '2rem 1rem'}}>
					      <p style={{margin: '1rem'}}>{counter ? <button onClick={() => {sendAgain(); setCounter(false)}} className="btn btn-primary">INTENTA DE NUEVO</button> : <Countdown date={Date.now() + 60000} renderer={renderer} />}</p>      
              </div>
              <div style={{margin: '2rem 1rem'}}>
                <p style={{fontSize: '1rem'}}>(Antes de reenviarte revisa tu carpeta de SPAM)</p>
                <div style={{paddingBottom: '2rem', margin: '2rem 0'}}>
                  <p><Link to="/recupera-opcion">Cambia opción de recuperación</Link></p>
                  <p><Link to="/login">Cancelar</Link></p>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
}

export default withRouter(PasswordRecoveryEmailConfirmation)
