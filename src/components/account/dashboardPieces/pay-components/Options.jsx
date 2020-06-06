import React from 'react'

const Options = ({cargos, setCargos}) => {
    return (
        <div>
            <h3>Otras opciones</h3>
            <div className='pagar-text-box'><p>Si tienes algún problema con tu cuenta en la que realizaremos el cargo automático, te ofrecemos las siguientes opciones para realizar tu pago:</p></div>
            <div className='options-buttons'>
                <div className='op-left-buttons'>
                    <button onClick={() => setCargos('bank')} className='dashboard-gray-button'>Banco</button>
                    <div className='bank-images'>
                        <img style={{backgroundColor: 'black'}} src="https://www.globant.com/sites/default/files/2019-07/BBVA-White.png" alt="bbva"/>
                        <img src="https://www.telefonoysucursales.com/wp-content/uploads/2018/08/CIBanco-creditos-cuentas-pagares-y-cedes.jpg" alt="cibanco"/>
                        <img style={{backgroundColor: 'black'}} src="https://www.inbursa.com/storage/logo-gfi.png" alt="inbursa"/>
                    </div>
                    <button onClick={() => setCargos('debit')} className='dashboard-gray-button'>Tarjeta débito</button>
                </div>
                <div className='op-right-buttons' style={{alignItems: 'center'}}>
                    <button onClick={() => setCargos('cash')} style={{width: '320px', marginBottom: '1rem'}} className='dashboard-gray-button'>Efectivo</button>
                    {/* <img style={{width: '200px', height: 'auto'}} src="/img/oxxoPay.png" alt="efectivo pago"/> */}
                </div>
            </div>
        </div>
    )
}

export default Options
