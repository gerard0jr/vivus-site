import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import '../../newStyles.scss'
import 'react-tabs/style/react-tabs.scss'
import ChargeOption from './liquidate-components/ChargeOption'
import BankOption from './liquidate-components/BankOption'
import DebitOption from './liquidate-components/DebitOption'
import CashOption from './liquidate-components/CashOption'
import { momentEs } from '../../../../services/moment'

const Liquidate = ({balance}) => {
    console.log(balance)
    return (
        <div className='liquidate-container'>
            <div className='liquidate-left'>
                <h4>Monto para liquidar préstamo</h4>
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
            <div className='liquidate-right'>
                <h4>Selecciona la opción de pago</h4>
                <div className='liquidate-paginator'>
                <Tabs>
                    <TabList>
                        <Tab>Cargo automático</Tab>
                        <Tab>Efectivo en tiendas</Tab>
                        <Tab>Banco</Tab>
                        <Tab>Tarjeta de Débito</Tab>
                    </TabList>
                    <TabPanel>
                        <ChargeOption balance={balance}/>
                    </TabPanel>
                    <TabPanel>
                        <CashOption balance={balance}/>
                    </TabPanel>
                    <TabPanel>
                        <BankOption balance={balance}/>
                    </TabPanel>
                    <TabPanel>
                        <DebitOption balance={balance}/>
                    </TabPanel>
                </Tabs>
                </div>
            </div>
        </div>
    )
}

export default Liquidate
