import React, {useState, useEffect} from 'react'
import Slider from 'react-rangeslider'
import {withRouter} from 'react-router-dom'
import '../newStyles.scss'
import { getToken, requestAdditionalAmount, getSimulation } from '../../../services/api'
import { momentEs } from '../../../services/moment'
import { BallClipRotate } from 'react-pure-loaders'

const idProduct = 1

const More = (props) => {

    let stepWidth = 22
    let periodicidad = 3

    const [loadingDone, setLoadingDone] = useState(false)
    const [loadingSimulation, setLoadingSimulation] = useState(false)
    const [loadingCalc, setLoadingCalc] = useState(true)
    const [user, setUser] = useState({})
    const [data, setData] = useState({})
    const [serverError, setServerError] = useState(false)
    const [allowed, setAllowed] = useState(false) 
    const [balance, setBalance] = useState({}) 
    //SIMULATION VALUES
    const [amount, setAmount] = useState(0)
    const [interest, setInterest] = useState(0)
    const [plazo, setPlazo] = useState(0)
    const [commision, setCommision] = useState(0)
    // const [table, setTable] = useState([])
    const [firstPayment, setFirstPayment] = useState(0)

    const getLoan = async () => {
        setLoadingDone(true)
        let response = await getToken() 
        if(!response) return setServerError(true)
        let validToken = response.data.token
        const sentData = {
            idProduct,
            idCustomer: user.customerId,
            idAction: 2,
            customerIp: sessionStorage.getItem('ip') ? sessionStorage.getItem('ip') : '0.0.0.0',
            newLoanAmount: amount,
            newLoanTerm: data.term,
            newLoanFrequency: data.frequency
        }
        requestAdditionalAmount(sentData, validToken)
            .then(res => {
                setLoadingDone(false)
                if(res.status === 200) return props.history.push('/additional/application/pre-approved')
            })
            .catch(err => {
                if(err.response.status === 400){
                    setServerError(true)
                    setAllowed(false)
                    setLoadingDone(false)
                }
            })
    }

    const simulate = async () => {
        if(!allowed) return
        if(user.eMail === 'demo@demo.com'){
            setInterest(500)
            return setFirstPayment(2000)
        }
        setLoadingSimulation(true)
        let response = await getToken() 
        if(!response) return setServerError(true)
        let validToken = response.data.token
        if(data.actualLoan){
            getSimulation(idProduct, amount , data.frequency, data.term, validToken)
                .then(res => {
                    const {data} = res
                    setInterest(data.interest)
                    setFirstPayment(data.firstPaymentAmount)
                    setCommision(data.commision)
                    // setTable(data.amortizationTable)
                    setLoadingSimulation(false)
                })
                setLoadingSimulation(false)
        }
    }

    const getData = async (user) => {
        let userBalance = JSON.parse(sessionStorage.getItem('balance'))
        if(userBalance) setBalance(userBalance)
        if(user.eMail === 'demo@demo.com'){
            setUser(user)
            setAmount(2000)
            setPlazo(7)
            setData({
                minAmount: 1000,
                maxAmount: 2000,
                actualLoan: 2000,
                term: 7,
                frequency: 3,
                paymentDate: new Date(),
                minPlazo: 7,
                maxPlazo: 30,
                step: 1
            })
            setLoadingCalc(false)
            return setAllowed(true)
        }
        let response = await getToken() 
        if(!response) return setServerError(true)
        let validToken = response.data.token
        const data = {
            idProduct,
            idCustomer: user.customerId,
            idAction: 1,
            customerIp: sessionStorage.getItem('ip') ? sessionStorage.getItem('ip') : '0.0.0.0',
            newLoanAmount: 0,
            newLoanTerm: 0,
            newLoanFrequency: 0
        }
        requestAdditionalAmount(data, validToken)
            .then(res => {
                const {data} = res
                setData(data)
                setAmount(data.simulation.amount)
                setLoadingCalc(false)
                setAllowed(true)
            })
            .catch(err => {
                if(err.response){
                    setLoadingCalc(false)
                    if(err.response.status === 400) return setServerError(true)
                }
            })
    }

    useEffect(() => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        if(demoUser){
                getData(demoUser)
             return setUser(demoUser)
            }
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        setUser(user)
        getData(user)
    }, [])

    useEffect(() => {
        simulate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allowed])

    return (
        <>
        {
            serverError ? 
                <div className='more-container'>
                    <p>Error en el servidor</p>
                </div>
            :
            loadingCalc ? 
                <div className='more-container'>
                    <div className='loading-calc'>
                        <p>Cargando...</p>
                        <BallClipRotate color='white' loading/>
                    </div>
                </div>
            :
                <div className='more-container'>
                    <div className='left-monto-option'>
                        <p style={{margin: '0'}} className='move-md-size'><strong>Solicita</strong></p>
                        <p className='move-md-size'>más dinero</p>
                        <div className='calc-amounts'>
                            <p>Monto actual de préstamo: <strong>{balance.creditLimit.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} MXN</strong></p>
                            <p>Monto disponible: <strong>{balance.creditLimitUsed.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} MXN</strong></p>
                        </div>
                        <div className='title-winput'>
                            <p>Monto total</p>
                            <div className="slider-input-wrapper">
                                <input className="slider-input" type="text" value={amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} readOnly/>
                                <span className="slider-input-unit">$</span>
                            </div>
                        </div>
                        <div className='slider'>
                            <div style={{top: '0.4rem'}} className='slider-steps'>
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
                                min={data.minAmount} 
                                max={data.maxAmount} 
                                value={amount} 
                                labels={{[data.minAmount]:`${data.minAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`, 
                                        [data.maxAmount]: `${data.maxAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}`}} 
                                orientation='horizontal' 
                                tooltip={false} 
                                step={100}
                                onChangeComplete={simulate}
                                onChange={val => setAmount(val)}
                            />
                        </div>
                        <hr style={{width: '100%', border: '0.5px solid #737373', opacity: 0}}/>
                        {/* <div className='title-winput'>
                            <p>Plazo</p>
                            <div className="slider-input-wrapper">
                                <input className="slider-input" type="text" value={data.term} readOnly disabled/>
                                <span style={{fontSize: '0.7rem'}} className="slider-input-unit">{data.frequency === 2 ? ' quincenas' : ' semanas'}</span>
                            </div>
                        </div> */}
                        <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                        <div className='title-winput'>
                            <p>Plazo</p>
                            <div className="slider-input-wrapper">
                                <input className="slider-input" type="text" value={plazo} readOnly/>
                                <span style={{fontSize: '0.7rem'}} className="slider-input-unit">{periodicidad === 3 ? ' días' : ' días'}</span>
                            </div>
                        </div>
                        <div className='slider'>
                            <div style={{top: '0.4rem'}} className='slider-steps'>
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
                                min={data.minPlazo} 
                                max={data.maxPlazo} 
                                value={amount} 
                                labels={{[data.minPlazo]:`${data.minPlazo}`, 
                                        [data.maxPlazo]: `${data.maxPlazo}`}} 
                                orientation='horizontal' 
                                tooltip={false} 
                                step={data.step}
                                onChangeComplete={simulate}
                                onChange={val => setPlazo(val)}
                            />
                        </div>
                    </div>
                    <div className='right-monto-option'>
                        <div className='new-loan'>
                            <div className='amount-calculator-info'>
                                <h3 className='amount-calc-title'>Préstamo</h3>
                                <p className='amount-calc-subtitle'>General</p>
                                <p className='big-amount-calc'>{amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p>
                                <div className='amount-info-row'>
                                    <p>Préstamo</p>
                                    <p>{loadingSimulation ? 'Cargando...' : amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p>
                                </div>
                                <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                                <div className='amount-info-row'>
                                    <p>Plazo</p>
                                    <p>{loadingSimulation ? 'Cargando...' : plazo} {periodicidad === 2 ? 'días' : 'días'}</p>
                                </div>
                                <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                                <div className='amount-info-row'>
                                    <p>Interés</p>
                                    <div>
                                        <p>{loadingSimulation ? 'Cargando...' : interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                                    </div>
                                </div>
                                <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                                <div className='amount-info-row'>
                                    <p>Comisión por disposición</p>
                                    <div>
                                        <p>{loadingSimulation ? 'Cargando...' : commision.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                                    </div>
                                </div>
                                <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                                <div className='amount-info-row'>
                                    <p><strong>Monto a devolver</strong></p>
                                    <div>
                                        <p><strong>{loadingSimulation ? 'Cargando...' : firstPayment.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}<small> MXN</small></strong></p><p style={{fontSize: '0.6rem'}}>IVA incluído</p>
                                    </div>
                                </div>
                                <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                                <div className='amount-info-row'>
                                    <p><strong>Fecha de pago</strong></p>
                                    <p><strong>{loadingSimulation ? 'Cargando...' : momentEs(data.paymentDate).format('D/MMM/Y')}</strong></p>
                                </div>
                                <div className='cat-prom'>
                                    Fecha de vencimiento del préstamo es {loadingSimulation ? 'Cargando...' : plazo} días a partir de la fecha de su expedición efectiva
                                </div>
                                
                                <p onClick={getLoan} className="btn">SOLICÍTALO YA</p>
                            </div>
                        </div>
                        
                    </div>
                </div>
        }
        </>
    )
}

export default withRouter(More)
