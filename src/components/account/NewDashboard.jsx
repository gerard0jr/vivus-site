import React, {useState, useEffect} from 'react'
import './newStyles.scss'
import Default from './dashboardPieces/Default'
import Pay from './dashboardPieces/Pay'
import Move from './dashboardPieces/Move'
import More from './dashboardPieces/More'
import cookie from 'react-cookies'
import { withRouter } from 'react-router-dom'
import { BallClipRotate } from 'react-pure-loaders'
import { getStatus } from '../../services/api'

const idProduct = 2

const NewDashboard = (props) => {
    
    const [flux, setFlux] = useState('default')
    const [user, setUser] = useState(null)
    const [balance, setBalance] = useState({})
    const [bannerId, setBannerId] = useState(null)

    const checkUser = (user, token) => {
        return getStatus(idProduct, user.customerId, false, token)
        .then(res =>{
            console.log(res)
            setBannerId(res.data.bannerId)
            if(res.status && res.data.idStatus === 4){
                return props.history.push('/denied')
            }
            if(res.status === 200){
                if(res.data.idStatus === 1){
                    if(res.data.idSubStatus === 184) return props.history.push('/registration')
                    if(res.data.idSubStatus === 196) return props.history.push('/pre-approved')
                    if(res.data.idSubStatus === 203) return props.history.push('/pre-approved')
                    if(res.data.idSubStatus === 206) return props.history.push('/dashboard/id')
                    if(res.data.idSubStatus === 217) return props.history.push('/dashboard/confirm')
                    return props.history.push('/registration')
                }
                if(res.data.idStatus === 7){
                    return
                }
                if(res.data.idStatus === 6){
                    if(res.data.idSubStatus === 15) return props.history.push('/application-complete')
                }
                if(res.data.idStatus === 8){
                    if(res.data.idSubStatus === 55) return props.history.push('/dashboard')
                }
                if(res.data.idStatus === 4){
                    return props.history.push('/denied')
                }
            }
        })
    }

    const checkToken = () => {
        let getToken = cookie.load('token')
        if(!getToken) return props.history.push('/login')
    }

    useEffect(() => {
        let getUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(!getUser) return props.history.push('/login')
        setUser(getUser)
        let approved = sessionStorage.getItem('APP')
        if(approved === 'no') return props.history.push('/denied')
        let getToken = cookie.load('token')
        if(!getToken) return props.history.push('/login')
        checkUser(getUser, getToken)
    }, [])

    useEffect(() => {
        // if(props.location.pathname.includes('/borrow-more')) setFlux('move')
    },[])
    
    return (
        <div className='app-container'>
            {user ? 
            <div style={{textAlign: 'center', justifyContent: 'center'}}>
                <div className='account-container'>
                    <div className='left-dash-new'>
                        <h2 style={{margin: '2rem 0'}}>| TU CUENTA |</h2>
                        {
                            flux === 'default' ? <Default history={props.history} setBalance={setBalance} bannerId={bannerId}/> :
                            flux === 'pay' ? <Pay balance={balance}/> :
                            flux === 'move' ? <Move setFlux={setFlux}/> :
                            flux === 'more' ? <More/> :
                            <Default/>
                        }
                    </div>
                    <div className='right-dash-new'>
                        <h2 style={{margin: '2rem 0'}}>| TÚ DECIDES |</h2>
                        <div onClick={() => {setFlux('pay'); checkToken()}} style={flux === 'pay' || flux === 'move' || flux === 'more' ? {padding: '6.4rem 3rem'} : null} className={flux === 'pay' || flux === 'default' ? 'active select-option' : 'select-option'}><strong>PAGAR MI PRÉSTAMO</strong></div>
                        <div onClick={() => {setFlux('move'); checkToken()}} style={flux === 'pay' || flux === 'move' || flux === 'more' ? {padding: '6.4rem 3rem', borderTop: '1px solid black', borderBottom: '1px solid black'} : {borderTop: '1px solid black', borderBottom: '1px solid black'}} className={flux === 'move' ? 'active select-option' : 'select-option'} ><strong>RECORRE LA FECHA DE TU PRÉSTAMO</strong></div>
                        <div onClick={() => {setFlux('more'); checkToken()}} style={flux === 'pay' || flux === 'move' || flux === 'more' ? {padding: '6.4rem 3rem'} : null} className={flux === 'more' ? 'active select-option' : 'select-option'}><strong>SOLICITA MÁS DINERO</strong></div>
                    </div>
                </div>
                <br/>
                <p style={{margin: '0 auto', width: '290px'}}className='btn-minimal-width' onClick={() => {setFlux('default'); checkToken()}}>Regresar a dashboard principal</p>
            </div>
            :
            <BallClipRotate color={'#A8CC46'} loading/>
            }
      </div>
    )
}

export default withRouter(NewDashboard)
