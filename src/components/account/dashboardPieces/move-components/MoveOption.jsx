import React, {useState} from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import ChargeOption from '../pay-components/liquidate-components/ChargeOption'
import BankOption from '../pay-components/liquidate-components/BankOption'
import DebitOption from '../pay-components/liquidate-components/DebitOption'
import CashOption from '../pay-components/liquidate-components/CashOption'
import '../../newStyles.scss'
import { momentEs } from '../../../../services/moment'
import { getToken, requestExtension } from '../../../../services/api'


const idProduct = 1
const MoveOption = ({user}) => {

    const [willPay, setWillPay] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [extensionData, setExtensionData] = useState({
        oldDueDate: new Date(),
        dueDateSeven: new Date(),
        dueDateFourteen: new Date(),
        dueDateThirty: new Date(),
        priceSeven: 121,
        priceFourteen: 216,
        priceThirty: 429,
        reference: '123456789'
    })
    const [selected, setSelected] = useState(null)

    const setExtension = async () => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        let loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(demoUser || loggedUser.eMail === 'demo@demo.com') return setWillPay(true)
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
                setExtensionData(data)
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
                        <p style={{fontSize: '1.5rem'}}>de pago de tu préstamo</p>
                    </div>
                </div>
                <p style={{fontSize: '1.2rem'}}>Selecciona el número de días que deseas recorrer</p>
                <div className='move-vencimiento'>
                    <p>Vencimiento actual de tu préstamo:</p>
                    <p className='move-md-size' style={{marginLeft: '2rem', textAlign: 'right'}}>{momentEs(extensionData.oldDueDate).format('D/MMM/Y')}</p>
                </div>
                <div className="move-options-container">
                    <div className={selected === 7 ? 'move-nuevo-vencimiento move-selected' : 'move-nuevo-vencimiento'}>
                        <div className='price-move'>
                            <p>7</p>
                            <p>días</p>
                            <p>hasta</p>
                            <p>{momentEs(extensionData.dueDateSeven).format('D/MMM/Y')}</p>
                            <hr/>
                            <p className='move-md-size'><strong>{extensionData.priceSeven ? extensionData.priceSeven.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 'Cargando...'}</strong></p>
                            <small>Costo de la extensión</small>
                            <div style={{marginTop: '10px', display: 'flex', justifyContent: 'center'}}>
                                <p className='btn-minimal-width move-select-button' onClick={() => {setExtension(); setSelected(7)}}>{serverError ? 'Error en el servidor' : 'PAGAR'}</p>
                            </div>
                        </div>
                    </div>
                    <div className={selected === 14 ? 'move-nuevo-vencimiento move-selected' : 'move-nuevo-vencimiento'}>
                        <div className='price-move'>
                            <p>14</p>
                            <p>días</p>
                            <p>hasta</p>
                            <p>{momentEs(extensionData.dueDateSeven).format('D/MMM/Y')}</p>
                            <hr/>
                            <p className='move-md-size'><strong>{extensionData.priceFourteen ? extensionData.priceFourteen.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 'Cargando...'}</strong></p>
                            <small>Costo de la extensión</small>
                            <div style={{marginTop: '10px', display: 'flex', justifyContent: 'center'}}>
                                <p className='btn-minimal-width move-select-button' onClick={() => {setExtension(); setSelected(14)}}>{serverError ? 'Error en el servidor' : 'PAGAR'}</p>
                            </div>
                        </div>
                    </div>
                    <div className={selected === 30 ? 'move-nuevo-vencimiento move-selected' : 'move-nuevo-vencimiento'}>
                        <div className='price-move'>
                            <p>30</p>
                            <p>días</p>
                            <p>hasta</p>
                            <p>{momentEs(extensionData.dueDateSeven).format('D/MMM/Y')}</p>
                            <hr/>
                            <p className='move-md-size'><strong>{extensionData.priceThirty ? extensionData.priceThirty.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : 'Cargando...'}</strong></p>
                            <small>Costo de la extensión</small>
                            <div style={{marginTop: '10px', display: 'flex', justifyContent: 'center'}}>
                                <p className='btn-minimal-width move-select-button' onClick={() => {setExtension(); setSelected(30)}}>{serverError ? 'Error en el servidor' : 'PAGAR'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <p className='move-terms'>
                    Al seleccionar el núnero de días que deseas reestructurar y con ello recorrer la fecha de pago de tu préstamo,
                    confirmas que has leído y que estás de acuerdo con los términos y condiciones del Contrato de Reestructura y 
                    otorgas tu consentimiento de manera expresa de conformidad con el Art. 1803 del Código Civil Federal vigente.
                </p>
            </div>
            <div className='right-move-option'>
                {willPay ? <div className='will-pay-options'>
                    <p><strong>¿Cómo pagar el servicio</strong></p>
                    <p>para recorrer fecha de pago?</p>
                    <br/><br/>
                    <Tabs>
                        <TabList>
                            <Tab className='tabs-underlined'>Efectivo en tiendas</Tab>
                            <Tab className='tabs-underlined'>Banco</Tab>
                            <Tab className='tabs-underlined'>Tarjeta de Débito</Tab>
                        </TabList>
                        <TabPanel>
                            <CashOption extensionReference={extensionData.reference} moveImgWidth={'200px'}/>
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
