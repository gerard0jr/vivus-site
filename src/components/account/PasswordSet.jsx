import React, {useState, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import { BallBeat } from 'react-pure-loaders'
import { getToken, changePassword } from '../../services/api'
import { Link } from 'react-router-dom'

const idProduct = 1

const PasswordSet = (props) => {
    
    const [eMail, setEMail] = useState(null)
    const [serverError, setServerError] = useState(false)
    const [passError, setPassError] = useState(false)
    const [newPassword, setNewPassword] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [success, setSuccess] = useState(false)

    const sendNewPassword = async () => {
        if(!newPassword) return setPassError(true)
        if (newPassword.length < 6) return setPassError(true)
        if (newPassword.length > 30) return setPassError(true)
        if (newPassword.search(/\d/) === -1) return setPassError(true)
        if (newPassword.search(/[a-zA-Z]/) === -1) return setPassError(true)
        setPassError(false)
        setLoading(true)
        let response = await getToken()
        if(!response) return
        let validToken = response.data.token
        const data = {
          idProduct, 
          eMail, 
          userName: eMail, 
          coordinates: '92.55, -92.34', 
          newPassword, 
          ipAddress: '189.241.25.64', 
          userAgent: window.navigator.userAgent, 
          password: newPassword
        }
        changePassword(data, validToken)
          .then(res => {
            if(res.status === 200){
              setLoading(false)
              setSuccess(true)
              return setTimeout(() => props.history.push('/login'), 3000) 
            }
            setServerError(true)
            setLoading(false)
          })
          .catch(err => {
            setServerError(true)
            setLoading(false)
          })
    }

    useEffect(() => {
        let validCode = sessionStorage.getItem('code-valid')
        if(!validCode) return props.history.push('/recupera')

        let recoveryMail = sessionStorage.getItem('recoveryEmail')
        if(!recoveryMail) return props.history.push('/recupera')
        setEMail(sessionStorage.getItem('recoveryEmail'))
    }, [])

    return (
        <div className='app-container'>
          <div className='forgot-layout' style={{backgroundColor: 'white', textAlign: 'center'}}>
            <h2 style={{fontWeight: 'bold', backgroundColor: '#A3CD3A', color: 'white', padding: '3rem'}}>Ingresa tu nueva contraseña</h2>
            <div style={{margin: '2rem 1rem'}}>
              <div style={{margin: '3rem 0'}}>			
                <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} type={showPassword ? 'text' : 'password'} placeholder="Ingresa una nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                <small onClick={() => setShowPassword(!showPassword)} className="show-password">{showPassword ? 'Ocultar' : 'Mostrar'} contraseña</small>
                {serverError ? <small style={{color: 'red'}}>Error en el servidor</small> : null}
                <br/><br/><small style={passError ? {color: 'red'} : null}>La contraseña debe ser de al menos 6 caracteres y debe incluir 1 número</small>
                <div style={{margin: '1rem 0'}}><p className='btn-minimal-width btn-forgot' onClick={sendNewPassword}>{loading ? <BallBeat color={'#fff'} loading/> : 'CAMBIAR CONTRASEÑA'}</p></div>
                {success ? <div><small style={{color: '#93d500'}}>Contraseña actualizada correctamente, redirigiendo a inicio de sesión...</small></div> : null}
              </div>
            </div>
            <div style={{margin: '2rem 1rem'}}>
              <div style={{margin: '2rem 0'}}>
                <p><Link to="/recupera-opcion">Cambia opción de recuperación</Link></p>
              </div>
            </div>
          </div>
        </div>
    )
}

export default withRouter(PasswordSet)
