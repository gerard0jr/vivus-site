import React, {useState, useEffect} from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
// import ChargeOption from '../pay-components/liquidate-components/ChargeOption'
import BankOption from '../pay-components/liquidate-components/BankOption'
import DebitOption from '../pay-components/liquidate-components/DebitOption'
import CashOption from '../pay-components/liquidate-components/CashOption'
import '../../newStyles.scss'
import { momentEs } from '../../../../services/moment'
import { getToken, requestExtension } from '../../../../services/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'


const idProduct = 1
const MoveOption = ({user}) => {

    const [willPay, setWillPay] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [extensionData, setExtensionData] = useState({
        oldDueDate: null,
        dueDateSeven: null,
        dueDateFourteen: null,
        dueDateThirty: null,
        priceSeven: 0,
        priceFourteen: 0,
        priceThirty: 0,
        reference: '0'
    })
    const [selected, setSelected] = useState(null)
    const [extensionError, setExtensionError] = useState(null)

    const setExtension = async (days) => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        let loggedUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(demoUser || loggedUser.eMail === 'demo@demo.com') return setWillPay(true)
        let response = await getToken()  
        if(!response) return setServerError(true)
        let validToken = response.data.token
        const data = {
            idAction: 2,
            days,
            idCustomer: user.customerId,
            idProduct
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

    useEffect(() => {
        let loadExtension = async () => {
            let user = await JSON.parse(sessionStorage.getItem('loggedUser'))
            let response = await getToken()  
            if(!response) return setServerError(true)
            let validToken = response.data.token
            const data = {
                idAction: 1,
                days: 0,
                idCustomer: user.customerId,
                idProduct
            }
            requestExtension(data, validToken)
            .then(res => {
                const {data} = res
                console.log(data)
                if(!data) return setExtensionError('Server Error: 400')
                if(data.continue){
                    setExtensionData({
                        oldDueDate: data.details[0].oldDueDate,
                        dueDateSeven: data.details[0].newDueDate,
                        dueDateFourteen: data.details[1].newDueDate,
                        dueDateThirty: data.details[2].newDueDate,
                        priceSeven: data.details[0].extensionFee,
                        priceFourteen: data.details[1].extensionFee,
                        priceThirty: data.details[2].extensionFee,
                        reference: data.details[0].oxxoReference
                    })
                }            
                else {
                    setExtensionError(data.rejectReasons[0].reason)
                }
            })
        }
        loadExtension()
    }, [])

    return (
        <div className='move-option-container'>
            <div className='left-move-option'>
                <div className='move-option-title flex-centered'>
                    <div style={{fontSize: '3rem', margin: '0 1rem 0 0'}}>
                        <FontAwesomeIcon icon={faCalendar}/>
                    </div>
                    <div>
                        <p className='move-md-size'><strong>Recorre la fecha</strong></p>   
                        <p style={{fontSize: '1.5rem'}}>de pago de tu préstamo</p>
                    </div>
                </div>
                <p style={{fontSize: '1.2rem'}}>Selecciona el número de días que deseas recorrer</p>
                <div className='move-vencimiento'>
                    <p>Vencimiento actual de tu préstamo:</p>
                    <p className='move-md-size' style={{marginLeft: '2rem', textAlign: 'right'}}>{extensionData.oldDueDate ? momentEs(extensionData.oldDueDate).format('D/MMM/Y') : '-'}</p>
                </div>
                <div className="move-options-container">
                    <div className={selected === 7 ? 'move-nuevo-vencimiento move-selected' : 'move-nuevo-vencimiento'}>
                        <div className='price-move'>
                            <p>7</p>
                            <p>días</p>
                            <p>hasta</p>
                            <p>{extensionData.dueDateSeven ? momentEs(extensionData.dueDateSeven).format('D/MMM/Y') : '-'}</p>
                            <hr/>
                            <p className='move-md-size'><strong>{extensionData.priceSeven ? extensionData.priceSeven.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '-'}<small> MXN</small></strong></p>
                            <small>Costo de la extensión</small>
                            <div style={{marginTop: '10px', display: 'flex', justifyContent: 'center'}}>
                                <p style={extensionError ? {backgroundColor: 'gray'} : null} className='btn-minimal-width move-select-button' onClick={extensionError ? null : () => setExtension(7)}>{serverError ? 'Error en el servidor' : 'PAGAR'}</p>
                            </div>
                        </div>
                    </div>
                    <div className={selected === 14 ? 'move-nuevo-vencimiento move-selected' : 'move-nuevo-vencimiento'}>
                        <div className='price-move'>
                            <p>14</p>
                            <p>días</p>
                            <p>hasta</p>
                            <p>{extensionData.dueDateFourteen ? momentEs(extensionData.dueDateFourteen).format('D/MMM/Y') : '-'}</p>
                            <hr/>
                            <p className='move-md-size'><strong>{extensionData.priceFourteen ? extensionData.priceFourteen.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '-'}<small> MXN</small></strong></p>
                            <small>Costo de la extensión</small>
                            <div style={{marginTop: '10px', display: 'flex', justifyContent: 'center'}}>
                                <p style={extensionError ? {backgroundColor: 'gray'} : null} className='btn-minimal-width move-select-button' onClick={extensionError ? null : () => setExtension(14)}>{serverError ? 'Error en el servidor' : 'PAGAR'}</p>
                            </div>
                        </div>
                    </div>
                    <div className={selected === 30 ? 'move-nuevo-vencimiento move-selected' : 'move-nuevo-vencimiento'}>
                        <div className='price-move'>
                            <p>30</p>
                            <p>días</p>
                            <p>hasta</p>
                            <p>{extensionData.dueDateThirty ? momentEs(extensionData.dueDateThirty).format('D/MMM/Y') : '-'}</p>
                            <hr/>
                            <p className='move-md-size'><strong>{extensionData.priceThirty ? extensionData.priceThirty.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) : '-'}<small> MXN</small></strong></p>
                            <small>Costo de la extensión</small>
                            <div style={{marginTop: '10px', display: 'flex', justifyContent: 'center'}}>
                                <p style={extensionError ? {backgroundColor: 'gray'} : null} className='btn-minimal-width move-select-button' onClick={extensionError ? null : () => setExtension(30)}>{serverError ? 'Error en el servidor' : 'PAGAR'}</p>
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
                {
                    willPay ? 
                    <div className='will-pay-options'>
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
                    </div> 
                : 
                    <div className='blank-div'>
                    {
                        extensionError ? <div className='extension-error'><p>{extensionError}</p></div> : null
                    }    
                    </div>}
            </div>
        </div>
    )
}

export default MoveOption
