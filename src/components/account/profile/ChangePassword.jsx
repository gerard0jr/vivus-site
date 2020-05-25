import React, {useState} from 'react'
import { getToken, login, changePassword } from '../../../services/api'
import { BallClipRotate } from 'react-pure-loaders'

const idProduct = 1

const ChangePassword = ({setSection}) => {
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [oldPasswordErr, setOldPasswordErr] = useState(false)
    const [newPasswordErr, setNewPasswordErr] = useState(false)
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)

    const checkPassword = async () => {
        if(newPassword.length < 6) return setNewPasswordErr(true)
        if (newPassword.length > 30) return setNewPasswordErr(true)
        if (newPassword.search(/\d/) === -1) return setNewPasswordErr(true)
        if (newPassword.search(/[a-zA-Z]/) === -1) return setNewPasswordErr(true)
        setNewPasswordErr(false)
        setLoading(true)
        let response = await getToken()
        let validToken = response.data.token
        let coords = sessionStorage.getItem('coords')
        if(!coords) coords = 'Location blocked'
        let myIp = sessionStorage.getItem('ip')
        if(!myIp) myIp = '192.168.1.254'
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        const data = {
            idProduct,
            userName: user.eMail,
            password: oldPassword,
            ipAddress: myIp,
            userAgent: navigator.userAgent,
            coordinates: coords
        }
        login(data, validToken)
        .then(res => {
            if(res.status === 200){
                const changeData = {
                    idProduct, 
                    eMail: user.eMail, 
                    userName: user.eMail, 
                    newPassword, 
                    ipAddress: myIp,
                    userAgent: navigator.userAgent,
                    coordinates: coords,
                    password: newPassword
                  }
                return changePassword(changeData, validToken)
                    .then(changed => {
                        if(changed.status === 200){
                            setSuccess(true)
                            setLoading(false)
                        }
                        setError(true)
                        setLoading(false)
                    })
            }
            setLoading(false)
            setOldPasswordErr(true)
        })
    }
    
    return (
        <div>
            {success ? 
                <div style={{textAlign: 'center'}}>
                    <h4 style={{margin: '4rem 0'}}>Contraseña actualizada correctamente</h4>
                    <div style={{textAlign: 'center', margin: '2rem 0'}}>
                        <p onClick={() => setSection('home')} className='btn-minimal-width btn-full-width'>
                            CONTINUAR
                        </p>
                    </div>
                </div>
            :
            <div style={{textAlign: 'left'}}>
                <h4>Cambiar contraseña</h4>
                <p style={{fontWeight: 'bold', marginBlockStart: '2rem'}}><strong>Ingresar contraseña anterior</strong></p>
                <div className={showOldPassword ? 'password-wrapper eye' : 'password-wrapper eye-hidden'}>
                <div style={{margin: '0.5rem 0'}} className="input-wrapper">
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={(e) => setOldPassword(e.target.value)} value={oldPassword} type={showOldPassword ? 'text' : 'password'} className="form-control"/>
                </div>
                <p onClick={() => setShowOldPassword(!showOldPassword)} className="show-password">{showOldPassword ? 'Ocultar' : 'Mostrar'} contraseña</p>
                </div>
                {oldPasswordErr ? <small style={{color: 'red'}}>Contraseña incorrecta</small> : null}
                <br/>
                <p style={{fontWeight: 'bold', marginBlockStart: '2rem'}}><strong>Ingresar nueva contraseña</strong></p>
                <div className={showNewPassword ? 'password-wrapper eye' : 'password-wrapper eye-hidden'}>
                <div style={{margin: '0.5rem 0'}} className="input-wrapper">
                    <input style={{width: '250px', padding: '0.6rem', fontSize: '1rem'}} onChange={(e) => setNewPassword(e.target.value)} value={newPassword} type={showNewPassword ? 'text' : 'password'} className="form-control"/>
                </div>
                <p onClick={() => setShowNewPassword(!showNewPassword)} className="show-password">{showNewPassword ? 'Ocultar' : 'Mostrar'} contraseña</p>
                </div>
                {newPasswordErr ? <small style={{color: 'red'}}>La contraseña debe tener mínimo 6 caracteres</small> : null}
                {error ? <small style={{color: 'red'}}>Ocurrió un error en el servidor al actualizar tu contraseña, intenta nuevamente</small> : null}
                
                <div style={{textAlign: 'center', margin: '2rem 0'}}>
                    {loading ? <BallClipRotate color={'#A8CC46'} loading/> :
                    <p onClick={checkPassword} className='btn-minimal-width btn-forgot'>
                        CONFIRMAR
                    </p>}
                </div>
                <div onClick={() => setSection('home')} className='return-to-profile'>
                    <p>Cancelar</p>
                </div>
            </div>
            }
        </div>
        
    )
}

export default ChangePassword