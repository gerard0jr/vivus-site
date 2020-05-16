import React, { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import '../../newStyles.scss'
import 'react-tabs/style/react-tabs.scss'
import ChargeOption from './liquidate-components/ChargeOption'
import BankOption from './liquidate-components/BankOption'
import DebitOption from './liquidate-components/DebitOption'
import CashOption from './liquidate-components/CashOption'

const idProduct = 2

const Liquidate = ({balance}) => {
    console.log(balance)
    return (
        <div className='liquidate-container'>
            <div className='liquidate-left'>
                <h4>Monto para liquidar préstamo</h4>
                <div className='liquidate-resume'>
                    <p className='bold-type'>Tu préstamo</p>
                    <hr/>
                    <div className='liquidate-values'><p className='bold-type'>Monto total a pagar:</p><strong>{balance.liquidateAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</strong></div>
                    <hr/>
                    <div className='liquidate-values'><p>Monto del préstamo:</p><strong>{balance.creditLimitUsed.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</strong></div>
                    <hr/>
                    <div className='liquidate-values'><p>Intereses:</p><strong>${balance.installments.reduce((acc, installment) => acc + installment.interest, 0).toFixed(2)}</strong></div>
                </div>
            </div>
            <div className='liquidate-right'>
                <h4>Selecciona la opción de pago</h4>
                <div className='liquidate-paginator'>
                <Tabs>
                    <TabList>
                        <Tab>Cargo automático</Tab>
                        <Tab>Efectivo en tiendas(OXXO)</Tab>
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
