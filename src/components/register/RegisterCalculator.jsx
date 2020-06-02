import React, { useState, useEffect } from 'react'
import './RegisterCalculator.scss'
import Slider from 'react-rangeslider'
import { BallClipRotate } from 'react-pure-loaders'
import { getToken, getSimulation, getConfiguration } from '../../services/api.js'
import cookie from 'react-cookies'
import { momentEs } from '../../services/moment'
import { withRouter, Link } from 'react-router-dom'
import { PopInformation } from '../register/PopInformation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
// import { faTable, faDownload } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const idProduct = 1

const RegisterCalculator = ({proposalChange = {}, props}) => {

    const [open, setOpen] = useState(false)
    const [monto, setMonto] = useState(null)
    const [firstPaymentAmount, setFirstPaymentAmount] = useState(null)
    const [plazo, setPlazo] = useState(null)
    const [periodicidad, setPeriodicidad] = useState(3)
    const [cat, setCat] = useState(null)
    const [interesIVA, setInteresIVA] = useState(null)
    const [fecha, setFecha] = useState(null)
    const [registerData, setRegisterData] = useState(null)
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(true)
    const [amortizationTable, setAmortizationTable] = useState([])
    const [serverError, setServerError] = useState(false)

    let today = new Date()

    const simulate = async (amount, freq, term) => {
        let validToken = await cookie.load('token')
        if(!validToken){
            let response = await getToken()
            if(!response.data) return props.push('/error')
            if(response.data) validToken = response.data.token
        }
        getSimulation(idProduct, amount, freq, term, validToken)
            .then(res => {
                const { data } = res
                if(res.status === 200){
                    setCat(data.cat)
                    setInteresIVA(data.interest)
                    setFirstPaymentAmount(data.firstPaymentAmount)
                    setFecha(data.firstDueDate) 
                    setLoading(false)
                    setAmortizationTable(data.amortizationTable)
                }
            })
            .catch(err => console.log(err))
    }

    const updateMonto = val => {
        setMonto(val)
    }

    const updatePlazo = val => {
        setPlazo(val)
    }

    // const updatePeriodicidad = val => {
    //     if(val === 2){
    //         if(plazo > 6) setPlazo(6)
    //     }
    //     if(val === 1){
    //         if(plazo < 4) setPlazo(4)
    //     }
    //     setPeriodicidad(val)
    // }

    const getInitConfig = async () => { 
        let validToken = await cookie.load('token')
        if(!validToken){
            let response = await getToken()
            if(!response.data) return props.push('/error')
            if(response.data) validToken = response.data.token
        }
        getConfiguration(idProduct, validToken)
            .then(res => {
                const { data } = res
                if(res.status === 200) {
                    let config = {
                        minAmount: data.minAmount,
                        maxAmount: data.maxAmount,
                        stepAmount: data.stepAmount,
                        minTermSem: data.frequencies[0].frequencyTerm.minTerm,
                        maxTermSem: data.frequencies[0].frequencyTerm.maxTerm,
                        minTermQuin: data.frequencies[1] ? data.frequencies[1].frequencyTerm.minTerm : 0,
                        maxTermQuin: data.frequencies[1] ? data.frequencies[1].frequencyTerm.maxTerm : 0
                    }
                    setRegisterData({sliderConfig:config})
                    setMonto(data.defaultAmount)
                    setPlazo(data.frequencies[0].frequencyTerm.defaultValue)
                    simulate(data.defaultAmount, 2, data.frequencies[0].frequencyTerm.defaultValue)
                    sessionStorage.setItem('proposal', JSON.stringify({idProduct, monto:data.defaultAmount, periodicidad:3, plazo:data.frequencies[0].frequencyTerm.defaultValue}))
                }
            })
            .catch(err => console.log(err))
    }

    const calcConfig = async () => {
        let validToken = await cookie.load('token')
        if(!validToken){
            let response = await getToken()
            if(!response.data) return props.push('/error')
            if(response.data) validToken = response.data.token
        }
        getConfiguration(idProduct, validToken)
            .then(res => {
                const { data } = res
                if(res.status === 200) {
                    let config = {
                        minAmount: data.minAmount,
                        maxAmount: data.maxAmount,
                        stepAmount: data.stepAmount,
                        minTermSem: data.frequencies[0].frequencyTerm.minTerm,
                        maxTermSem: data.frequencies[0].frequencyTerm.maxTerm,
                        minTermQuin: data.frequencies[1] ? data.frequencies[1].frequencyTerm.minTerm : 0,
                        maxTermQuin: data.frequencies[1] ? data.frequencies[1].frequencyTerm.maxTerm : 0
                    }
                    setRegisterData({sliderConfig:config})
                }
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        const loadConfig = async () => {
            let response = await getToken()
            if(!response.data) return setServerError(true)
            let getLocalProposal = await JSON.parse(sessionStorage.getItem('proposal'))
            if(!getLocalProposal) return getInitConfig()
            calcConfig()
            setMonto(getLocalProposal.monto)
            setPlazo(getLocalProposal.plazo)
            setPeriodicidad(getLocalProposal.periodicidad)
            return simulate(getLocalProposal.monto, getLocalProposal.periodicidad, getLocalProposal.plazo)
        }
        loadConfig()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if(!loading && registerData) {
            simulate(monto, periodicidad, plazo)
            sessionStorage.setItem('proposal', JSON.stringify({monto, periodicidad, plazo, idProduct}))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [monto, periodicidad, plazo])

    useEffect(() => {
        if(proposalChange){
            setMonto(proposalChange.monto)
            setPlazo(proposalChange.plazo)
            setPeriodicidad(proposalChange.periodicidad)
            simulate(proposalChange.monto, proposalChange.periodicidad, proposalChange.plazo)
            sessionStorage.setItem('proposal', JSON.stringify({monto: proposalChange.monto, periodicidad: proposalChange.periodicidad, plazo: proposalChange.plazo, idProduct}))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [proposalChange])

    let stepWidth = 25
    return (
        <>
            {
                serverError ? 
                    <div className='calculator'>
                        <div className='register-slider-container-go'>
                            <FontAwesomeIcon icon={faExclamationTriangle}/>
                        </div>
                        <div className='calculator-info'>
                            <h2 style={{textAlign: 'center'}}>Servidor no disponible, intenta más tarde</h2>
                        </div>
                    </div> 
                : !loading && registerData ?
                    <div className='register-calculator'>
                        <div className='register-slider-container-go'>
                            <div className='top-slider-toggle'>
                                <div className='top-left-slider-toggle'>
                                    <h3>Resumen</h3>
                                    <h2>del préstamo</h2>
                                </div>
                                <div className='top-right-slider-toggle'>
                                    <p onClick={() => setEdit(!edit)} className='top-right-button'>{edit ? 'Cerrar' : 'Editar'}</p>
                                </div>
                            </div>
                            <div className={edit ? 'show-sliders' : 'hide-sliders'}>
                                <div className='title-winput-register'>
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
                                        min={registerData.sliderConfig.minAmount} 
                                        max={registerData.sliderConfig.maxAmount} 
                                        value={monto} 
                                        labels={{[registerData.sliderConfig.minAmount]:`$${registerData.sliderConfig.minAmount}`, [registerData.sliderConfig.maxAmount]:`$${registerData.sliderConfig.maxAmount}`}} 
                                        step={registerData.sliderConfig.stepAmount} 
                                        orientation='horizontal' 
                                        tooltip={false}
                                        onChange={val => updateMonto(val)}
                                    />
                                </div>
                                <hr style={{width: '100%', border: '0.5px solid #FAFAFA', marginTop: '3rem'}}/>
                                {/* <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
                                    <p style={{marginBottom: '1rem', color: 'white'}}>Periodicidad de pago</p>
                                    <div style={{display: 'flex', justifyContent: 'space-evenly', margin: '0.5rem'}}>
                                        <p className={periodicidad === 1 ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => updatePeriodicidad(1)}>Semanal</p>
                                        <p className={periodicidad === 2 ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => updatePeriodicidad(2)}>Quincenal</p>
                                    </div>
                                </div> */}
                                <hr style={{width: '100%', border: '0.5px solid #737373', opacity: 0}}/>
                                <div className='title-winput-register'>
                                    <p>Plazo</p>
                                    <div className="slider-input-wrapper">
                                        <input className="slider-input" type="text" value={plazo} readOnly/>
                                        <span style={{fontSize: '0.7rem'}} className="slider-input-unit">{periodicidad === 2 ? ' días' : ' días'}</span>
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
                                        min={periodicidad === 2 ? registerData.sliderConfig.minTermQuin : registerData.sliderConfig.minTermSem}
                                        max={periodicidad === 2 ? registerData.sliderConfig.maxTermQuin : registerData.sliderConfig.maxTermSem}
                                        value={plazo} 
                                        labels={periodicidad === 2 ? //{1:'1', 6:'6'} : {1:'1', 12:'12'}
                                                    {[registerData.sliderConfig.minTermQuin]:`${registerData.sliderConfig.minTermQuin}`, 
                                                    [registerData.sliderConfig.maxTermQuin]: `${registerData.sliderConfig.maxTermQuin}`} 
                                                    : 
                                                    {[registerData.sliderConfig.minTermSem]:`${registerData.sliderConfig.minTermSem}`, 
                                                    [registerData.sliderConfig.maxTermSem]: `${registerData.sliderConfig.maxTermSem}`} 
                                        }
                                        orientation='horizontal' 
                                        tooltip={false}
                                        onChange={val => updatePlazo(val)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='calculator-info'>
                            <div className='info-row-register'>
                                <p>Préstamo</p>
                                <p>{monto.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='info-row-register'>
                                <p>Plazo</p>
                                <p>{plazo} {periodicidad === 2 ? 'días' : 'días'}</p>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='info-row-register'>
                                <p>Interés</p>
                                <div>
                                    <p>{interesIVA.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                                </div>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='info-row-register'>
                                <p><strong>Parcialidad a pagar</strong></p>
                                <div>
                                    <p><strong>{(firstPaymentAmount).toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</strong></p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                                </div>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='info-row-register'>
                                <p><strong>Fecha de pago</strong></p>
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
                                    <p onClick={() => setOpen(true)} style={{color: '#A3CD3A', cursor: 'pointer'}}>Abrir <FontAwesomeIcon icon={faDownload}/></p>
                                </div>
                                <div style={{backgroundColor: '#f1f1f1', padding: '1rem', fontSize: '1.5rem', color: '#A3CD3A', borderRadius: '0 10px 10px 0'}}>
                                    <FontAwesomeIcon icon={faTable}/>
                                </div>
                            </div> */}
                            <div className='register-qualification'>
                                <h2>Para calificar, necesitas:</h2>
                                <ul>
                                    <li>Ser de nacionalidad mexicana</li>
                                    <li>Tener entre 20 y 65 años</li>
                                    <li>Elegir la forma de recibir tu dinero. En una cuenta bancaria</li>
                                    <li>Tener un teléfono celular y una cuenta de correo electrónico</li>
                                </ul>
                                <br/>
                                <hr style={{width: '100%', border: '0.5px solid #eee'}}/>
                                <div style={{textAlign: 'center'}}>
                                    <img src="/img/digicert.png" alt="digicert"/>
                                </div>
                                <hr style={{width: '100%', border: '0.5px solid #eee'}}/>
                            </div>
                            <div style={{textAlign: 'center'}}>
                                <Link to='/contenido/aviso-de-privacidad'>Aviso de privacidad</Link>
                            </div>
                        </div>
                    </div>
                :
                    <div className='register-calculator'>
                        <div className='register-slider-container-go' style={{textAlign: 'center'}}>
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

export default withRouter(RegisterCalculator)