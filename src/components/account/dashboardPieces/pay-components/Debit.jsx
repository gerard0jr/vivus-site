import React from 'react'
import '../../newStyles.scss'
import { momentEs } from '../../../../services/moment'

const Debit = ({balance}) => {
    return (
        <div className='bank-container'>
            <div className='bank-header'>
                <h3 style={{margin: 0, padding: '0 1rem'}}>Otras opciones</h3>
                <p><strong>Tarjeta de débito</strong></p>
            </div>
            <div className='bank-content'>
                <p>Puedes usar esta opción sólo en caso de tener algún <strong>problema</strong> con tu <strong>cuenta</strong> para el <strong>cargo automático</strong> de tu <strong> pago.</strong></p>
                <p>Te sugerimos que al usarla realices el <strong>pago antes</strong> de la fecha de <strong>vencimiento</strong> para evitar aclaraciones.</p>
                <div className='bank-bottom-container'>
                    <div className='liquidate-left'>
                        <div className='liquidate-resume'>
                            <p className='bold-type'>DETALLES DEL PAGO</p>
                            <hr/>
                            <div className='liquidate-values'><p>Capital:</p><p>{balance.curentInstallment.principalBalance.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p></div>
                            <hr/>
                            <div className='liquidate-values'><p>Intereses:</p><p>{balance.curentInstallment.interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p></div>
                            <hr/>
                            <div className='liquidate-values'><p className='bold-type'>Monto a pagar:</p><p style={{textAlign: 'right'}} className='bold-type'>{balance.curentInstallment.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small><small> IVA incluído</small></p></div>
                            <hr/>
                            <p>Fecha de vencimiento</p>
                            <p className='bold-type' style={{textAlign: 'right'}}>{momentEs(balance.curentInstallment.dueDate).format('D/MMM/Y')}</p>
                        </div>
                    </div>
                    <div className='bank-accordion'>
                        <p>Por favor presiona el botón de abajo y serás redirigido a la plataforma de pago. Ahí deberás llenar toda la información requerida y podrás hacer tu pago</p>
                        <p>La seguridad de tu información está garantizada</p>
                        <div className='flex-distributed'>
                            <img width='100' src="/img/mastercard.svg" alt="mastercard"/>
                            <img width='100' src="/img/visa.png" alt="visa"/>
                        </div>
                        <p className='btn-minimal-width' style={{width: '200px', margin: '0 auto', padding: '1rem'}}><a rel="noopener noreferrer" target='_blank' href='https://4finance.mit.com.mx/vivWeb/'>PAGAR CON TARJETA DE DÉBITO</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Debit
