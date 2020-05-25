import React, {useState, useEffect} from 'react'
import { withRouter, Link } from 'react-router-dom'
import cookie from 'react-cookies'
import { getToken, recoverPassword } from '../../services/api'
import { BallBeat } from 'react-pure-loaders'

const idProduct = 1

const PasswordRecoveryMobile = (props) => {
	const [celular, setCelular] = useState(null)
  const [celularError, setCelularError] = useState(false)
  const [loading, setLoading] = useState(false)

	const confirmation = async () => {
    setLoading(true)
    if (celular === null || celular === '') return setCelularError(true)
    if(celular.search(/[a-zA-Z]/) !== -1) return setCelularError(true)
    setCelularError(false)
    let response = await getToken()
    if(!response) return
    let validToken = response.data.token
    const data = {
      cellphone:celular,
      idProduct
    }
    recoverPassword(data, validToken)
      .then(res => {
        if(res.data.codigo === '200'){
          setCelularError(false)
          sessionStorage.setItem('cellphone', celular)
          return props.history.push('/confirmacion-sms')
        }
        setCelularError(true)
        setLoading(false)
      })
      .catch(err => {
        setCelularError(true)
        setLoading(false)
      })
		props.history.push('/confirmacion-sms')
  }
  
  useEffect(() => {
    if(sessionStorage.getItem('loggedUser') && cookie.load('token')) props.history.push('/dashboard/initial')
  }, [])

    return (
        <div className='app-container'>
          <div className='forgot-layout' style={{backgroundColor: 'white', textAlign: 'center'}}>
            <h2 style={{fontWeight: 'bold', backgroundColor: '#A3CD3A', color: 'white', padding: '3rem'}}>Ingresa tu número celular para recuperar el acceso</h2>
            <div style={{display: 'block', justifyContent: 'center', alignItems: 'center'}}>                
                <div style={{margin: '2rem 1rem'}}>
                    <div style={{margin: '2rem 0'}}>
                      <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} type='text' maxlength="10" name='celular' value={celular} placeholder="Teléfono" onChange={(e) => setCelular(e.target.value)} />
                      {celularError && <div><small style={{color: 'red'}}>Intruduce tu número celular</small></div>}
                    </div>
                   
                    <p className='btn-minimal-width btn-forgot' onClick={confirmation}>{loading ? <BallBeat color={'#fff'} loading/> : 'ENVIAR SMS'}</p>
					
                </div>
				        <div style={{margin: '2rem 1rem'}}>
                    <p>O</p>
                    <div style={{margin: '2rem 0'}}>
                        <p><Link to="/recupera-por-email">Elegir mail</Link> opción de recuperación</p>
                        <p>¿Tienes algún inconveniente? <Link to="#">Contáctanos</Link> </p>
                    </div>
                </div>
            </div>
          </div>
      </div>
    )
}

export default withRouter(PasswordRecoveryMobile)
