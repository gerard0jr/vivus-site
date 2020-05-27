import React, { useState, useEffect } from 'react'
import '../newStyles.scss'
import { withRouter } from 'react-router-dom'
import Options from './Options'
import ChangeEmail from './ChangeEmail'
import ChangePhone from './ChangePhone'
import ChangePassword from './ChangePassword'
import ChangePayment from './ChangePayment'
import PaymentBank from './payment/PaymentBank'
import PaymentDebit from './payment/PaymentDebit'
import cookie from 'react-cookies'
import { BallClipRotate } from 'react-pure-loaders'
import { Link } from 'react-router-dom'

const logo = '/img/navbar/logo-vivus-mexico.svg'


const NewProfile = (props) => {

    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [section, setSection] = useState('home')

    useEffect(() => {
        let getUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(!getUser) return props.history.push('/login')
        setUser(getUser)
        if(getUser.eMail === 'demo@demo.com') return
        let getToken = cookie.load('token')
        if(!getToken) return props.history.push('/login')
        setToken(getToken)
    }, [section])
    
    return( 
        <div className='app-container'>
            {user ? 
            <div style={{padding: '2rem'}}>
                <div className='profile-top-home'>
                    <h3>Mis datos</h3>
                    {/* <p><strong>Número de contrato:</strong> 983123899</p>
                    <p>Contrato de Reestructura</p> */}
                </div>
                <div className='profile-home'>
                    <div className='left-profile'>
                        <img src={logo} alt="logo vivus"/>
                    </div>
                    <div className='right-profile'>
                        {section === 'home' ? <Options setSection={setSection} user={user}/> :
                        section === 'email' ? <ChangeEmail setSection={setSection} history={props.history}/> :
                        section === 'phone' ? <ChangePhone setSection={setSection} history={props.history}/> :
                        section === 'password' ? <ChangePassword setSection={setSection}/> :
                        section === 'payment' ? <ChangePayment setSection={setSection}/> : 
                        section === 'payment-bank' ? <PaymentBank history={props.history} setSection={setSection}/> : 
                        section === 'payment-debit' ? <PaymentDebit history={props.history} setSection={setSection}/> : 
                        <Options setSection={setSection} user={user}/>}
                    </div>
                </div>
                <div style={{marginTop: '2rem'}}>
                    <Link to='/dashboard/welcome' style={{margin: '0 auto', width: '290px'}}className='btn-minimal-width'>Regresar a dashboard principal</Link>
                </div>
            </div>
            :
            <div>
                <BallClipRotate loading color={'#A8CC46'}/>
            </div>
            }
        </div>
    )
}

export default withRouter(NewProfile)