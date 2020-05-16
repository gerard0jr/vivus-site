import React, {useState} from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import ChargeOption from '../pay-components/liquidate-components/ChargeOption'
import BankOption from '../pay-components/liquidate-components/BankOption'
import DebitOption from '../pay-components/liquidate-components/DebitOption'
import CashOption from '../pay-components/liquidate-components/CashOption'
import '../../newStyles.scss'
import { momentEs } from '../../../../services/moment'
import { getToken, requestExtension } from '../../../../services/api'


const idProduct = 2
const MoveOption = ({extensionData, user}) => {

    const [willPay, setWillPay] = useState(false)
    const [serverError, setServerError] = useState(false)

    const setExtension = async () => {
        let response = await getToken()  
        if(!response) return setServerError(true)
        let validToken = response.data.token
        const data = {
            idProduct,
            idCustomer: user.customerId,
            idAction: 2
        }
        requestExtension(data, validToken)
        .then(res => {
            const {data} = res
            if(data){
                // ALLOW EXTENSION
                setWillPay(true)
                // DENY EXTENSION
                return setServerError(true)
            }            

        })
    }
    return (
        <div className='move-option-container'>
            <div className='left-move-option'>
                <div className='move-option-title flex-centered'>
                    <img src="/img/calendar_icon.png" alt="calendar"/>
                    <div>
                        <p className='move-md-size'><strong>Recorre la fecha</strong></p>   
                        <p style={{fontSize: '1.5rem'}}>de pago de tu parcialidad</p>
                    </div>
                </div>
                <p>Solo necesitas seleccionar la nueva fecha de vencimiento, elegir el método de pago, realizarlo y no preocuparte más.</p>
                <div className='move-vencimiento'>
                    <p>Vencimiento actual de tu parcialidad numero {extensionData.idDeferral}:</p>
                    <p className='move-md-size' style={{marginLeft: '2rem', textAlign: 'right'}}>{momentEs(extensionData.oldDueDate).format('D/MMM/Y')}</p>
                </div>
                <div className='move-vencimiento'>
                    <p>Vencimiento actual de tu préstamo:</p>
                    <p className='move-md-size' style={{marginLeft: '2rem', textAlign: 'right'}}>{momentEs(extensionData.oldLastDueDate).format('D/MMM/Y')}</p>
                </div>
                <div className={willPay ? 'move-nuevo-vencimiento-selected' : 'move-nuevo-vencimiento'}>
                    <div className='price-move'>
                        <p className='move-md-size'><strong>{extensionData.extensionFee ? extensionData.extensionFee.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 'Cargando...'}</strong></p>
                        <p>IVA incluído</p>
                        <p>Costo del servicio</p>
                        <p className='btn-minimal-width move-select-button' onClick={setExtension}>SOLICITAR</p>
                    </div>
                    <div>
                        <p><u>Nuevo vencimiento de</u></p>
                        <p>parcialidad No. {extensionData.idDeferral}:</p>
                        <p className="move-md-size"><strong>{momentEs(extensionData.newDueDate).format('D/MMM/Y')}</strong></p>
                        <p>préstamo:</p>
                        <p className="move-md-size"><strong>{momentEs(extensionData.newLastDueDate).format('D/MMM/Y')}</strong></p>
                    </div>
                </div>
            </div>
            <div className='right-move-option'>
                {willPay ? <div className='will-pay-options'>
                    <p><strong>¿Cómo pagar el servicio</strong></p>
                    <p>para recorrer fecha de pago?</p>
                    <br/><br/>
                    <Tabs>
                        <TabList>
                            <Tab className='tabs-underlined'>Cargo automático</Tab>
                            <Tab className='tabs-underlined'>Efectivo en tiendas(OXXO)</Tab>
                            <Tab className='tabs-underlined'>Banco</Tab>
                            <Tab className='tabs-underlined'>Tarjeta de Débito</Tab>
                        </TabList>
                        <TabPanel>
                            <ChargeOption/>
                        </TabPanel>
                        <TabPanel>
                            <CashOption extensionReference={extensionData.oxxoReference} moveImgWidth={'200px'}/>
                        </TabPanel>
                        <TabPanel>
                            <BankOption/>
                        </TabPanel>
                        <TabPanel>
                            <DebitOption moveLoan={true}/>
                        </TabPanel>
                    </Tabs>
                </div> : <div className='blank-div'></div>}
            </div>
        </div>
    )
}

export default MoveOption
