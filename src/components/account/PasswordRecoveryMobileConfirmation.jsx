import React, {useState, useEffect} from 'react'
import { withRouter, Link } from 'react-router-dom'
import cookie from 'react-cookies'
import { getToken, checkCode, sendCodeBySMS } from '../../services/api'
import Countdown from 'react-countdown-now'
import { BallBeat } from 'react-pure-loaders'

const idProduct = 1

const PasswordRecoveryMobileConfirmation = (props) => {
  const [idCustomer, setIdCustomer] = useState(null)
  const [codigo, setCodigo] = useState(null)
  const [celular, setCelular] = useState(null)
  const [codeError, setCodeError] = useState(false)
  const [counter, setCounter] = useState(false)
  const [loading, setLoading] = useState(false)

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
  
  useEffect(() => {
    let getCellphone = sessionStorage.getItem('mobile')
    let getIdCustomer = parseInt(sessionStorage.getItem('idCustomer'))
    if(!getCellphone || !getIdCustomer) return props.history.push('/recupera-opcion')
    setCelular(getCellphone)
    setIdCustomer(getIdCustomer)
  }, [])

  useEffect(() => {
    if(sessionStorage.getItem('loggedUser') && cookie.load('token')) props.history.push('/dashboard/initial')
  }, [])

  const handleCode = async () => {
    setLoading(true)
      let data = {
        idCustomer, 
        code: codigo,
        idProduct,
        isNIP: false,
        userAgent: navigator.userAgent,
        clientIP: '192.868.1.254',
        coordinates: '92.76, -98.54'
      }
      let response = await getToken()
      if(!response) return
      let validToken = response.data.token
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

  const sendAgain = async () => {
    let response = await getToken()
    if(!response) return
    let validToken = response.data.token
    const data = {
      idProduct,
      idCustomer
    }
    sendCodeBySMS(data, validToken)
  }

    return (
      <div className='app-container'>
        <div className='forgot-layout' style={{backgroundColor: 'white', textAlign: 'center'}}>
            <h2 style={{fontWeight: 'bold', backgroundColor: '#A3CD3A', color: 'white', padding: '3rem'}}>¡Enviado! <br/>Revisa tu celular</h2>
		        <img src="/img/vivus-recover-sent.png" alt="user" style={{width: '96px'}} />
			      <p>Hemos enviado tu código vía SMS al {celular}</p>
            <div style={{margin: '2rem 1rem'}}>
              <div style={{margin: '3rem 0'}}>			
                <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} type='number' name='codigo' placeholder="Código para recuperación" value={codigo} onChange={(e) => setCodigo(parseInt(e.target.value))} />
                {codeError && <div><small style={{color: 'red'}}>Código incorrecto</small></div>}
                <div style={{margin: '1rem 0'}}><p className='btn-minimal-width btn-forgot' onClick={handleCode}>{loading ? <BallBeat color={'#fff'} loading/> : 'INGRESA CÓDIGO'}</p></div>
              </div>
            </div>
            <div style={{display: 'block', justifyContent: 'center', alignItems: 'center'}}>
              <div style={{margin: '2rem 1rem'}}>
					      <p style={{margin: '1rem'}}>{counter ? <button onClick={() => {sendAgain(); setCounter(false)}} className="btn btn-primary">INTENTA DE NUEVO</button> : <Countdown date={Date.now() + 60000} renderer={renderer} />}</p>      
              </div>
              <div style={{margin: '2rem 1rem'}}>
                <div style={{padding: '2rem 0', margin: '2rem 0'}}>
                  <p><Link to="/recupera-opcion">Cambia opción de recuperación</Link></p>
                  <p><Link to="/login">Cancelar</Link></p>
                </div>
              </div>
            </div>
        </div>
      </div>
    )
}

export default withRouter(PasswordRecoveryMobileConfirmation)
