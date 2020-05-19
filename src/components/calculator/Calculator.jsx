import React, { useState, useEffect } from 'react'
import './calculator.scss'
import Slider from 'react-rangeslider'
import { BallClipRotate } from 'react-pure-loaders'
import { getToken, getConfiguration, getSimulation } from '../../services/api.js'
import { faExclamationTriangle, faTable, faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import cookie from 'react-cookies'
import { momentEs } from '../../services/moment'
import { withRouter } from 'react-router-dom'
import { PopInformation } from '../register/PopInformation'

const idProduct = 2

const Calculator = (props) => {

    const [open, setOpen] = useState(false)
    const [monto, setMonto] = useState(null)
    const [firstPaymentAmount, setFirstPaymentAmount] = useState(0)
    const [plazo, setPlazo] = useState(null)
    const [periodicidad, setPeriodicidad] = useState(2)
    const [cat, setCat] = useState(null)
    const [interesIVA, setInteresIVA] = useState(null)
    const [fecha, setFecha] = useState(null)
    const [amortizationTable, setAmortizationTable] = useState([])

    let today = new Date()

    const [config, setConfig] = useState(null)

    const loadSimulation = () => {
        setMonto(3000)
        setPlazo(1)
        setConfig('error')
        setCat(293)
        setInteresIVA(0)
        setFecha('DD/MM/AAA')
        setFirstPaymentAmount(0)
    }

    const initialConfiguration = async () => {
        const response = await getToken()
        console.log(response)
        if(response.status !== 200) return loadSimulation()
        cookie.save('token', response.data.token, {maxAge: 60 * 20})
        getConfiguration(idProduct, response.data.token)
            .then(res => {
                const { data } = res
                if(res.status === 200) {
                    setMonto(data.defaultAmount)
                    setPlazo(data.frequencies[1].frequencyTerm.defaultValue)
                    setConfig(data)
                    return simulate(data.dafaultAmount, 2, data.frequencies[1].frequencyTerm.defaultValue, response.data.token)
                }
                setConfig('error')
            })
            .catch(err => setConfig('error'))
    }

    const simulate = async (amount, freq, term, inputToken) => {
        if(!inputToken){
            let validToken = await cookie.load('token')
            if(!validToken) {
                const response = await getToken()
                if(response.status !== 200) return loadSimulation()
                validToken = response.data.token
            }
            getSimulation(idProduct, amount, freq, term, validToken)
                .then(res => {
                    const { data } = res
                    if(res.status === 200){
                        setCat(data.cat)
                        setInteresIVA(data.interest)
                        setFecha(data.firstDueDate)
                        setFirstPaymentAmount(data.firstPaymentAmount)
                        setAmortizationTable(data.amortizationTable)
                    }
                })
                .catch(err => setConfig('error'))
        }
        getSimulation(idProduct, amount, freq, term, inputToken)
            .then(res => {
                const { data } = res
                if(res.status === 200){
                    setCat(data.cat)
                    setInteresIVA(data.interest)
                    setFecha(data.firstDueDate)
                    setFirstPaymentAmount(data.firstPaymentAmount)
                    setAmortizationTable(data.amortizationTable)
                }
            })
            .catch(err => setConfig('error'))
    }

    const updateMonto = val => {
        setMonto(val)
    }

    const updatePlazo = val => {
        setPlazo(val)
    }

    const updatePeriodicidad = val => {
        if(val === 2){
            if(plazo > 6) setPlazo(6)
        }
        if(val === 1){
            if(plazo < 4) setPlazo(4)
        }
        setPeriodicidad(val)
    }

    const setData = () => {
        sessionStorage.setItem('proposal', JSON.stringify({idProduct, monto, periodicidad, plazo}))
        if(sessionStorage.getItem('proposal')) return props.history.push('/registration')
    }

    useEffect(() => {
        simulate(monto, periodicidad, plazo)
    }, [monto, periodicidad, plazo])

    useEffect(() => {
        initialConfiguration()
    }, [])

    let stepWidth = 24

    return (
        <>
            {
            // config === 'error' ?
            //     <div className='calculator'>
            //         <div className='slider-container-go'>
            //             <FontAwesomeIcon icon={faExclamationTriangle}/>
            //         </div>
            //         <div className='calculator-info'>
            //             <h2 style={{textAlign: 'center'}}>Servidor no disponible, intenta más tarde</h2>
            //         </div>
            //     </div> 
            // : 
            config !== null && fecha !== null ?
            <div className='calculator'>
            {/* <div style={props.style ? {top: '0'} : null} className='calculator'> */}
                <div className='slider-container-go'>
                    <div className='title-winput'>
                        <p>Monto total</p>
                        <div className="slider-input-wrapper">
                            <input className="slider-input" type="text" value={monto} readOnly/>
                            <span className="slider-input-unit">$</span>
                        </div>
                    </div>
                    <div className='slider'>
                        <div className='slider-steps'>
                            <span className='step'></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                        </div>
                        <Slider
                            min={config.minAmount}
                            max={config.maxAmount}
                            value={monto}
                            labels={config !== 'error' ? {[config.minAmount]:`$${config.minAmount}`, [config.maxAmount]:`$${config.maxAmount}`} : {'0': 0, '0': 0}}
                            step={config.stepAmount}
                            orientation='horizontal'
                            tooltip={false}
                            onChange={val => updateMonto(val)}
                        />
                    </div>
                    <hr style={{width: '100%', border: '0.5px solid #737373', marginTop: '3rem', opacity: 0}}/>
                    {/* <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
                        <p style={{marginBottom: '1rem'}}>Periodicidad de pago</p>
                        <div style={{display: 'flex', justifyContent: 'space-evenly', margin: '0.5rem'}}>
                            <p className={periodicidad === 1 ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => updatePeriodicidad(1)}>Semanal</p>
                            <p className={periodicidad === 2 ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => updatePeriodicidad(2)}>Quincenal</p>
                        </div>
                    </div> */}
                    <hr style={{width: '100%', border: '0.5px solid #FAFAFA'}}/>
                    <div className='title-winput'>
                        <p>Plazo</p>
                        <div className="slider-input-wrapper">
                            <input className="slider-input" type="text" value={plazo} readOnly/>
                            <span style={{fontSize: '0.7rem'}} className="slider-input-unit">{periodicidad === 2 ? ' quincenas' : ' semanas'}</span>
                        </div>
                    </div>
                    <div className='slider'>
                        <div className='slider-steps'>
                            <span className='step'></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                            <span className='step' style={{marginLeft: `${stepWidth}px`}}></span>
                        </div>
                        <Slider
                            // En periodicidad, 1 es semanal, 2 es quincenal
                            // En frequencies, 0 es semanal, 1 es quincenal
                            // Preguntamos primero por perdiodicidad quincenal
                            min={config !== 'error' ? periodicidad === 2 ? config.frequencies[1].frequencyTerm.minTerm : config.frequencies[0].frequencyTerm.minTerm : 0}
                            max={config !== 'error' ? periodicidad === 2 ? config.frequencies[1].frequencyTerm.maxTerm : config.frequencies[0].frequencyTerm.maxTerm : 0}
                            value={plazo}
                            labels={config !== 'error' ? periodicidad === 2 ?
                                        {[config.frequencies[1].frequencyTerm.minTerm]:`${config.frequencies[1].frequencyTerm.minTerm}`,
                                        [config.frequencies[1].frequencyTerm.maxTerm]: `${config.frequencies[1].frequencyTerm.maxTerm}`}
                                        :
                                        {[config.frequencies[0].frequencyTerm.minTerm]:`${config.frequencies[0].frequencyTerm.minTerm}`,
                                        [config.frequencies[0].frequencyTerm.maxTerm]: `${config.frequencies[0].frequencyTerm.maxTerm}`}
                                        :
                                        {"0":"0","0":"0"}
                            }
                            orientation='horizontal'
                            tooltip={false}
                            onChange={val => updatePlazo(val)}
                        />
                    </div>
                </div>
                <div className='calculator-info'>
                    <div className='info-row'>
                        <p>Préstamo</p>
                        <p>{monto.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                    </div>
                    <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                    <div className='info-row'>
                        <p>Plazo</p>
                        <p>{plazo} {periodicidad === 2 ? 'quincenas' : 'semanas'}</p>
                    </div>
                    <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                    <div className='info-row'>
                        <p>Interés</p>
                        <div>
                            <p>{interesIVA.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                        </div>
                    </div>
                    <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                    <div className='info-row'>
                        <p><strong>Parcialidad a pagar</strong></p>
                        <div>
                            <p><strong>{firstPaymentAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</strong></p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                        </div>
                    </div>
                    <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                    <div className='info-row'>
                        <p><strong>Fecha de pago 1er parcialidad</strong></p>
                        <p><strong>{momentEs(fecha).format('D/MMM/Y')}</strong></p>
                    </div>
                    <div className='cat-prom'>
                        <b>CAT: {cat}%</b> promedio sin IVA para fines informativos y de comparación exclusivamente. <br/>Fecha de cálculo: {momentEs(today).format('D/MMM/Y')}<br/><br/>
                        Calculadora para fines informativos y de comparación. <br/><br/>
                        Nunca solicitamos anticipos, cuotas, pago de pólizas o cualquier otro concepto para otorgarte un préstamo.
                    </div>
                    {/* <div className='amortization-button'>
                        <div style={{textAlign: 'left', padding: '0 1rem'}}>
                            <p>Tabla de amortización</p>
                            <p onClick={() => setOpen(true)} style={{color: '#fd6b21', cursor: 'pointer'}}>Abrir <FontAwesomeIcon icon={faDownload}/></p>
                        </div>
                        <div style={{backgroundColor: '#f1f1f1', padding: '1rem', fontSize: '1.5rem', color: '#fd6b21', borderRadius: '0 10px 10px 0'}}>
                            <FontAwesomeIcon icon={faTable}/>
                        </div>
                    </div> */}
                    <p onClick={setData} className="btn">SOLICÍTALO YA</p>
                </div>
            </div>
            :
            <div className='calculator'>
                <div className='slider-container-go'>
                    <BallClipRotate loading color={'white'}/>
                </div>
                <div className='calculator-info'>
                    <h2 style={{textAlign: 'center'}}>Cargando datos...</h2>
                </div>
            </div>
            }
            <div className='calc-popup'>
                <PopInformation style={{margin: 'auto'}} open={open} close={() => setOpen(false)} amortizationTable={amortizationTable}/>
            </div>
        </>
    )
}

export default withRouter(Calculator)
