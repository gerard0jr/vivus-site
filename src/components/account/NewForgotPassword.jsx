import React, {useEffect, useState} from 'react'
import { withRouter, Link } from 'react-router-dom'
import cookie from 'react-cookies'
import { getToken, recoverPassword, getCustomerByMail, sendCodeBySMS } from '../../services/api'
import { BallBeat } from 'react-pure-loaders'

const idProduct = 1

const NewForgotPassword = (props) => {

  const [loading, setLoading] = useState(false)
  const [loadingCel, setLoadingCel] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [cellError, setCellError] = useState(false)

	const goSMS = async () => {
    setLoadingCel(true)
    let response = await getToken()
    if(!response) return
    let validToken = response.data.token
    let email = sessionStorage.getItem('recoveryEmail')
    getCustomerByMail(idProduct, email, validToken)
    .then(res => {
      if(res.data){
        sessionStorage.setItem('mobile', res.data.mobile)
        sessionStorage.setItem('idCustomer', res.data.customerId)
        let data = {
          idProduct,
          idCustomer: res.data.customerId,
          isNIP: false
        }
        return sendCodeBySMS(data, validToken)
          .then(res => props.history.push('/confirmacion-sms'))
      }
      setCellError(true)
    })
	}
	
	const goEmail = async () => {
    setLoading(true)
    let response = await getToken()
    if(!response) return
    let validToken = response.data.token
    let email = sessionStorage.getItem('recoveryEmail')
    const data = {
      eMail:email,
      idProduct
    }
    recoverPassword(data, validToken)
    .then(res => {
      if(res.data.codigo === '200'){
        setEmailError(false)
        return props.history.push('/confirmacion-email')
      }
      setEmailError(true)
      setLoading(false)
    })
    .catch(err => {
      setEmailError(true)
      setLoading(false)
    })
  }
  
  useEffect(() => {
    if(sessionStorage.getItem('loggedUser') && cookie.load('token')) props.history.push('/dashboard/initial')
  }, [])

    return (
        <div className='app-container'>
          <div className='forgot-layout' style={{backgroundColor: 'white', textAlign: 'center'}}>
            <h2 style={{fontWeight: 'bold', backgroundColor: '#A3CD3A', color: 'white', padding: '3rem'}}>Recupera tu acceso</h2>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div style={{margin: '2rem 1rem'}}>
                    <div style={{margin: '2rem 0'}}><svg style={{fill: '#A3CD3A', maxHeight: '73px', maxWidth: '100%'}} viewBox="0 0 79 73" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M6 2a4 4 0 0 0-4 4v61a4 4 0 0 0 4 4h67a4 4 0 0 0 4-4V6a4 4 0 0 0-4-4H6zm0-2h67a6 6 0 0 1 6 6v61a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6z" fill-rule="nonzero"></path><path d="M20 31a1 1 0 0 0-1 1v25a1 1 0 0 0 1 1h39a1 1 0 0 0 1-1V32a1 1 0 0 0-1-1H20zm0-2h39a3 3 0 0 1 3 3v25a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V32a3 3 0 0 1 3-3z" fill-rule="nonzero"></path><path d="M18.464 34.741l-.928 1.772 21.036 11.019a2 2 0 0 0 1.856 0l21.036-11.02-.928-1.77L39.5 45.76 18.464 34.741z" fill-rule="nonzero"></path><path d="M1 17h77v-2H1zM19 8.5c0 1.382-1.118 2.5-2.5 2.5A2.499 2.499 0 0 1 14 8.5C14 7.118 15.118 6 16.5 6S19 7.118 19 8.5M12 8.5c0 1.382-1.118 2.5-2.5 2.5A2.499 2.499 0 0 1 7 8.5C7 7.118 8.118 6 9.5 6S12 7.118 12 8.5"></path></g></svg></div>
                    <p style={{fontWeight: 'bold'}}>POR MAIL</p>
                    <p>Vamos a enviarte un mail con el código de validación</p>
                    <p className='btn-minimal-width btn-forgot' onClick={goEmail}>{loading ? <BallBeat color={'#fff'} loading/> : 'POR MAIL'}</p>
                    {emailError ? <p style={{color: 'red'}}>No hay ningun usuario asociado a  este correo</p> : null}
                </div>
                <div style={{margin: '2rem 1rem'}}>
                    <div style={{margin: '2rem 0'}}><svg style={{fill: '#A3CD3A', maxHeight: '73px', maxWidth: '100%'}} viewBox="0 0 46 73" xmlns="http://www.w3.org/2000/svg"><g fill-rule="evenodd"><path d="M4 2a2 2 0 0 0-2 2v65a2 2 0 0 0 2 2h38a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H4zm0-2h38a4 4 0 0 1 4 4v65a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z" fill-rule="nonzero"></path><path d="M20.65 41.877a2 2 0 0 1 1.077-.092C22.47 41.928 23.23 42 24 42c6.627 0 12-5.373 12-12s-5.373-12-12-12-12 5.373-12 12c0 2.504.766 4.888 2.174 6.89a2 2 0 0 1 .302 1.645l-1.593 6.25 7.767-2.908zM10 48l2.538-9.96A13.936 13.936 0 0 1 10 30c0-7.732 6.268-14 14-14s14 6.268 14 14-6.268 14-14 14c-.906 0-1.791-.086-2.65-.25L10 48z" fill-rule="nonzero"></path><path d="M27 61.5c0 1.935-1.565 3.5-3.5 3.5a3.498 3.498 0 0 1-3.5-3.5c0-1.935 1.565-3.5 3.5-3.5s3.5 1.565 3.5 3.5"></path></g></svg></div>
                    <p style={{fontWeight: 'bold'}}>POR SMS A TU CELULAR</p>
                    <p>Vamos a enviarte un SMS con el código de validación</p>
                    <p className='btn-minimal-width btn-forgot' onClick={goSMS}>{loadingCel ? <BallBeat color={'#fff'} loading/> : 'POR SMS'}</p>
                    {cellError ? <p style={{color: 'red'}}>Ocurrió un problema, intenta nuevamente</p> : null}
                </div>
            </div>
            <div style={{margin: '0 auto 1rem', width: '250px', paddingBottom: '1rem'}}>
              <p><Link to="/recupera">Regresar</Link></p>
            </div>
          </div>
        </div>
    )
}

export default withRouter(NewForgotPassword)
