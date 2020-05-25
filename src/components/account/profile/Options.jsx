import React from 'react'

const Options = ({user, setSection}) => {
    return (
        <div>
            <h4>Revisión de la cuenta</h4>
            <div className='profile-field'>
                <p className='pfield-title'>Tu nombre</p>
                <p className='pfield-content'>{user ? user.fullName : 'Cargando...'}</p>
            </div>
            <div className='profile-field-editable'>
                <div className='left-fields'>
                    <p className='pfield-title'>Correo Electrónico</p>
                    <p className='pfield-content'>{user ? user.eMail : 'Cargando...'}</p>
                </div>
                {/* <p onClick={() => {}} className='btn-minimal-width btn-full-width profile-edit-button-blocked'>EDITAR</p> */}
                <p onClick={() => setSection('email')} className='btn-minimal-width btn-full-width profile-edit-button'>EDITAR</p>
            </div>
            <div className='profile-field-editable'>
                <div className='left-fields'>
                    <p className='pfield-title'>Número de teléfono</p>
                    <p className='pfield-content'>{user ? user.mobile : 'Caargando...'}</p>
                </div>
                {/* <p onClick={() => {}} className='btn-minimal-width btn-full-width profile-edit-button-blocked'>EDITAR</p> */}
                <p onClick={() => setSection('phone')} className='btn-minimal-width btn-full-width profile-edit-button'>EDITAR</p>
            </div>
            <div className='profile-field-editable'>
                <div className='left-fields'>
                    <p className='pfield-title'>Contraseña</p>
                    <p className='pfield-content'>******</p>
                </div>
                {/* <p onClick={() => {}} className='btn-minimal-width btn-full-width profile-edit-button'>EDITAR</p> */}
                <p onClick={() => setSection('password')} className='btn-minimal-width btn-full-width profile-edit-button'>EDITAR</p>
            </div>
            <div className='profile-field-editable'>
                <div className='left-fields'>
                    <p className='pfield-title'>Métodos de pago</p>
                    {/* <p className='pfield-content'>Cuenta Bancaria</p> */}
                </div>
                {/* <p onClick={() => {}} className='btn-minimal-width btn-full-width profile-edit-button-blocked'>EDITAR</p> */}
                <p onClick={() => setSection('payment')} className='btn-minimal-width btn-full-width profile-edit-button'>EDITAR</p>
            </div>
            {/* <hr/>
            <div className='profile-field'>
                <p className='pfield-title'>Preferencias</p>
                <div style={{display: 'flex'}}><input style={{marginRight: '1rem'}} type='checkbox'/><p className='pfield-content'>Recibir promociones y ofertas</p></div>
            </div> */}
        </div>
    )
}

export default Options
