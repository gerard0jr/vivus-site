import React from 'react'
import '../../newStyles.scss'
import aes256 from 'aes256'
import { momentEs } from '../../../../services/moment'

const Debit = ({balance}) => {

    const generateLink = () => {
        const xml =
                    `<xml>
                        <business>
                            <id_company>SNBX</id_company>
                            <id_branch>01SNBXBRNCH</id_branch>
                            <user>SNBXUSR01</user>
                            <pwd>SECRETO</pwd>
                        </business>
                        <url>
                            <reference>FACTURA999</reference>
                            <amount>2500.00</amount>
                            <moneda>MXN</moneda>
                            <canal>W</canal>
                            <omitir_notif_default>1</omitir_notif_default>
                            <promociones>C,3,6,9</promociones>
                            <st_correo>1</st_correo>
                            <fh_vigencia>27/12/2019</fh_vigencia>
                            <mail_cliente>nospam@gmail.com</mail_cliente>
                            <st_cr>A</st_cr>
                            <datos_adicionales>
                            <data id="1" display="true">
                                <label>Talla</label>
                                <value>Grande</value>
                            </data>
                            <data id="2" display="false">
                                <label>Color</label>
                                <value>Azul</value>
                            </data>
                            </datos_adicionales>
                        </url>
                    </xml>`
        const key = '5DCC67393750523CD165F17E1EFADD21'

        const encodedString = aes256.encrypt(key, xml)

        const xmlToSend = 
        `xml = <pgs>
            <data0>SNDBX123</data0>
            <data>${encodedString}</data>
        </pgs>`

        // axios.post('https://wppsandbox.mit.com.mx/gen', {xmlToSend}, {headers: {"Access-Control-Allow-Origin": "*"}})
        // .then(res => console.log(res))
        // .catch(err => console.log(err))
        
    }

    return (
        <div className='bank-container'>
            <div className='bank-header'>
                <h3 style={{margin: 0, padding: '0 1rem'}}>Otras opciones</h3>
                <p><strong>Tarjeta de débito</strong></p>
            </div>
            <div className='bank-content'>
                <p>Puedes usar esta opción sólo en caso de tener algún <strong>problema</strong> con tu <strong>cuenta</strong> para el <strong>cargo automático</strong> de tu siguiente <strong>parcialidad.</strong></p>
                <p>Te sugerimos que al usarla realices el <strong>pago antes</strong> de la fecha de <strong>vencimiento</strong> para evitar aclaraciones.</p>
                <div className='bank-bottom-container'>
                    <div className='liquidate-left'>
                    <div className='liquidate-resume'>
                            <p className='bold-type'>Tu parcialidad no. <strong>{balance.curentInstallment.idDeferral}</strong></p>
                            <hr/>
                            <div className='liquidate-values'><p className='bold-type'>Monto a pagar:</p><p className='bold-type'>{balance.curentInstallment.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p></div>
                            <hr/>
                            <div className='liquidate-values'><p>Capital:</p><p>{balance.curentInstallment.principalBalance.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p></div>
                            <hr/>
                            <div className='liquidate-values'><p>Intereses:</p><p>{balance.curentInstallment.interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p></div>
                            <hr/>
                            <p className='bold-type'>Fecha de vencimiento</p>
                            <p style={{textAlign: 'right'}}>{momentEs(balance.curentInstallment.dueDate).format('D/MMM/Y')}</p>
                        </div>
                    </div>
                    <div className='bank-accordion'>
                        <p>Por favor presiona el botón de abajo y serás redirigido a la plataforma de pago. Ahí deberás llenar toda la información requerida y podrás hacer tu pago</p>
                        <p>La seguridad de tu información está garantizada</p>
                        <div className='flex-distributed'>
                            <img width='100' src="/img/mastercard.svg" alt="mastercard"/>
                            <img width='100' src="/img/visa.png" alt="visa"/>
                        </div>
                        <p onClick={generateLink} className='btn-minimal-width' style={{width: '200px', margin: '0 auto', padding: '1rem'}}><a rel="noopener noreferrer" target='_blank' href='https://4finance.mit.com.mx/vivWeb/'>PAGAR CON TARJETA DE DÉBITO</a></p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Debit
