import React, {useState, useEffect} from 'react'
import { withRouter } from 'react-router-dom'
import Axios from 'axios'
import { BallBeat } from 'react-pure-loaders'
import cookie from 'react-cookies'
import './newStyles.scss'
import './efectiStyles.scss'

const url = 'https://www.bpoamericas.co/Vivus/TraceIdentityService'

const Account = (props) => {
    const [email, setEmail] = useState(null)
    const [errorMessage, setErrorMessage] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [loading, setLoading] = useState(false)

    const getToken = async () => {
      let res = await Axios.post(`${url}/api/Security/RequestToken`, {username: 'Fr0ntV1vu5', password: 'b2dbb203bb33dc419d57ad540f866812'})
      cookie.save('token', res.data.token, {maxAge: 60 * 20})
      return res.data.token
    }

    const getEmail = tokn => {
      Axios.post(`${url}/api/Customer/GetCustomerByMail`, {eMail: email}, {headers: {'Authorization': `Bearer ${tokn}`}})
      .then(response => {
          localStorage.setItem('user', JSON.stringify(response.data))
          props.history.push('/nuevoLogin')
      })
      .catch(err => {if(err.toString() === 'Error: Request failed with status code 404') return props.history.push('/ingresar')})
    }

    const handleSubmit = () => {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        let validMail = re.test(String(email).toLowerCase())
        if(!validMail) {
          return setErrorMessage(true)
        }
        else {
          setErrorMessage(false)
        }

        localStorage.setItem('email', email)

        setLoading(true)

        getToken()
        .then(tok => getEmail(tok))
        .catch(err => {setServerError(true); setLoading(false)})
    }

    const handleEmail = e => {
      setEmail(e.target.value)
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      let validMail = re.test(String(email).toLowerCase())
      if(validMail) return setErrorMessage(false)
    }

    useEffect(() => {
      cookie.remove('token')
      sessionStorage.clear()
      localStorage.clear()
    }, [props.history])
  return (
    <div className='app-container'> 
      <div style={{width: '58%', textAlign: 'left', padding: '6rem'}}>
        <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '4rem'}}>Bienvenido de nuevo</h1>
        <h1 style={{margin: '0 0 1rem 0', padding: 0, fontWeight: '400'}}>Ingresa a tu cuenta Vivus</h1>
        <div style={{borderBottom: '5px solid black', width: '50px'}}></div>

        <div style={{marginTop: '2rem'}}>
            <p style={{fontWeight: 'bold'}}>Correo electrónico</p>
            <div style={{marginBottom: '2rem'}}>
              <input style={{width: '250px'}} type='email' name='email' value={email} onChange={handleEmail} />
              {errorMessage ? <div><small style={{color: 'red'}}>Ingresa un mail válido</small></div> : null}
              {serverError ? <div><small style={{color: 'red'}}>Ocurrió un error con el servidor, inténtalo de nuevo</small></div> : null}
            </div>
            <p onClick={handleSubmit} className='btn-minimal-width'>
                {loading ? <BallBeat color={'#fff'} loading/> : 'INGRESAR'}
            </p>
        </div>
        <div style={{margin: '1rem'}}><button onClick={() => setEmail('lui0208@yopmail.com')}>Ingresar email válido</button></div>
      </div>
    </div>
    )
}


export default withRouter(Account)
