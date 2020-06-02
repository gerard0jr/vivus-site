import React, {useState, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import { BallBeat } from 'react-pure-loaders'
import cookie from 'react-cookies'

const PasswordRecoveryEmail = (props) => {
  
  const [email, setEmail] = useState(null)
  const [emailError, setEmailError] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const confirmation = async () => {
    setLoading(true)
    let rex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!email || !rex.test(email.toLowerCase())) {
        setLoading(false)
        return setEmailError(true)
    }
    sessionStorage.setItem('recoveryEmail', email)
    return props.history.push('/recupera-opcion')
    // let response = await getToken()
    // if(!response) return
    // let validToken = response.data.token
    // const data = {
    //   eMail:email,
    //   idProduct
    // }
    // recoverPassword(data, validToken)
    // .then(res => {
    //   if(res.data.codigo === '200'){
    //     setEmailError(false)
    //   }
    //   setEmailError(true)
    //   setLoading(false)
    // })
    // .catch(err => {
    //   console.log(err) 
    //   setEmailError(true)
    //   setLoading(false)
    // })
  } 
    
    useEffect(() => {
      if(sessionStorage.getItem('loggedUser') && cookie.load('token')) props.history.push('/dashboard/initial')
    }, [props])
  
    return (
        <div className='app-container'>
          <div className='forgot-layout' style={{backgroundColor: 'white', textAlign: 'center'}}>
            <h2 style={{fontWeight: 'bold', backgroundColor: '#A3CD3A', color: 'white', padding: '3rem'}}>Ingresa tu correo electrónico para recuperar el acceso</h2>
            <div style={{display: 'block', justifyContent: 'center', alignItems: 'center'}}>                
                <div style={{margin: '2rem 1rem', paddingBottom: '1rem'}}>
                    <div style={{margin: '2rem 0'}}>
                      <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} placeholder='ejemplo@email.com' type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)}/>
                      {emailError && <div><small style={{color: 'red'}}>Correo no válido</small></div>}
                    </div>
                   
                    <p className='btn-minimal-width btn-forgot' onClick={confirmation}>{loading ? <BallBeat color={'#fff'} loading/> : 'SELECCIONAR MÉTODO DE RECUPERACIÓN'}</p>
                    {/* <p className='btn-minimal-width btn-forgot' onClick={confirmation}>{loading ? <BallBeat color={'#fff'} loading/> : 'ENVIAR EMAIL'}</p> */}
					
                </div>
                {/* <div style={{marginBlockEnd: '2rem', paddingBottom: '2rem'}}>
                    <p>¿Sin acceso aún? <Link to="#">Contáctanos</Link> </p>
                </div> */}
            </div>
          </div>
      </div>
    )
}

export default withRouter(PasswordRecoveryEmail)
