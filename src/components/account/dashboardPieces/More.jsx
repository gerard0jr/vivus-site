import React, {useState, useEffect} from 'react'
import Slider from 'react-rangeslider'
import {withRouter} from 'react-router-dom'
import '../newStyles.scss'
import { getToken, requestAdditionalAmount, getSimulation } from '../../../services/api'
import { momentEs } from '../../../services/moment'
import { BallClipRotate } from 'react-pure-loaders'

const idProduct = 1

const More = (props) => {

    let stepWidth = 25
    const [loadingDone, setLoadingDone] = useState(false)
    const [loadingSimulation, setLoadingSimulation] = useState(false)
    const [loadingFirst, setLoadingFirst] = useState(false)
    const [user, setUser] = useState({})
    const [data, setData] = useState({})
    const [serverError, setServerError] = useState(false)
    const [allowed, setAllowed] = useState(false) 
    //SIMULATION VALUES
    const [amount, setAmount] = useState(0)
    const [interest, setInterest] = useState(0)
    const [table, setTable] = useState([])
    const [firstPayment, setFirstPayment] = useState(0)
    const [cat, setCat] = useState(0)

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
                    setCat(data.cat)
                    setTable(data.amortizationTable)
                    setLoadingSimulation(false)
                })
                setLoadingSimulation(false)
        }
    }

    const getData = async (user) => {
        // setLoadingFirst(true) //comment/uncomment this
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
        setAllowed(false) //remove/add this line
        //COMMENT 
        // requestAdditionalAmount(data, validToken)
        //     .then(res => {
        //         const {data} = res
        //         setData(data)
        //         setAmount(data.simulation.amount)
        //         setLoadingFirst(false)
        //         setAllowed(true)
        //     })
        //     .catch(err => {
        //         if(err.response){
        //             setLoadingFirst(false)
        //             if(err.response.status === 403) return setAllowed(false)
        //             if(err.response.status === 400) return setServerError(true)
        //         }
        //     })
    // COMMENT
    }

    useEffect(() => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        if(demoUser) return setUser(demoUser)
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(user){
            setUser(user)
            getData(user)
        }
    }, [])

    useEffect(() => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        if(demoUser) return
        simulate()
    }, [allowed])

    return (
        <div style={!allowed ? {backgroundColor: '#A3CD3A'} : null} className='more-container'>
            {
                
                allowed ? 
                <>
                    <div className='left-monto-option'>
                        <div className='more-option-title flex-centered'>
                            <p>Tu límite de crédito te permite pedir prestado entre {data.minAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} y {data.maxAmount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} <strong>adicionales</strong>.</p>
                        </div>
                        <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                        <p style={{margin: '0'}} className='move-md-size'>Selecciona el <strong>monto</strong></p>
                        <p className='move-md-size'>que <strong>necesites</strong></p>
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
                        <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                        <div className='title-winput'>
                            <p>Plazo</p>
                            <div className="slider-input-wrapper">
                                <input className="slider-input" type="text" value={data.term} readOnly disabled/>
                                <span style={{fontSize: '0.7rem'}} className="slider-input-unit">{data.frequency === 2 ? ' quincenas' : ' semanas'}</span>
                            </div>
                        </div>
                        <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                        <p style={{margin: '0'}}><strong>Recuerda:</strong> uno de los <strong>beneficios</strong> de Vivus, es que tus pagos anticipados <strong>reducen</strong> el <strong>plazo</strong> para finalizar tu préstamo</p>
                        <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                    </div>
                    <div className='right-monto-option'>
                        <h3>Mi nuevo préstamo</h3>
                        <div className='new-loan'>
                            <div className='new-loan-left'>
                                <p>Préstamo actual</p>
                                <p>Monto total nuevo préstamo</p>
                                <p>Plazo</p>
                                <p>Interés</p>
                                <p>Nueva parcialidad a pagar</p>
                                <p style={{margin: 0}}><strong>Fecha de pago</strong></p>
                            </div>
                            <div className='new-loan-right'>
                                <p>{data.actualLoan.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                                <p>{amount.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</p>
                                <p>{data.term} {data.frequency === 2 ? ' quincenas' : ' semanas'}</p>
                                <p>{loadingSimulation ? 'Cargando...' : interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} <small>IVA incluído</small></p>
                                <p><strong>{loadingSimulation ? 'Cargando...' : firstPayment.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} </strong><small>IVA incluído</small></p>
                                <p style={{margin: 0}}><strong>{momentEs(data.paymentDate).format('D/MMM/Y')}</strong></p>
                            </div>
                        </div>
                        <h3>Parcialidades por pagar</h3>
                        <div className='new-loan' style={{overflowY: 'auto', height: '250px'}}>
                            <table className='tabla'>
                                <thead>
                                    <tr>
                                        <th>Número de pago</th>
                                        <th>Fecha de pago</th>
                                        <th>Importe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.filter(el => el.idDeferral > 0).map((el, ix) => 
                                        <tr index={ix}>
                                            <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.idDeferral}</td>
                                            <td className={ix % 2 ? 'row-non' : 'row-par'}>{momentEs(el.dueDate).format('D/MMM/Y')}</td>
                                            <td className={ix % 2 ? 'row-non' : 'row-par'}>{loadingSimulation ? 'Cargando...' : el.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div style={{margin: '0 1rem', padding: '1rem 0'}} className='flex-horizontal'>
                            <div>
                                <p style={{textAlign: 'left', width: '150px', fontSize: '0.7rem', marginBottom: '0', paddingRight: '1rem'}}><b>CAT: {cat}</b> promedio sin IVA</p>
                            </div>
                            <p onClick={getLoan} className='btn-minimal-width smaller-button'>{loadingDone ? <BallClipRotate color={'white'} loading/> : 'SOLICÍTALO YA'}</p>
                        </div>
                    </div>
                </>
                :
                <div style={{backgroundColor: '#A3CD3A', color: 'white',textAlign: 'left'}}>
                    <div className='move-titles'>
                        <p style={{fontSize: '2.5rem'}}>Es un excelente beneficio</p>
                        <p className='move-medium-size bold-style'>Para extender el monto de tu</p>
                        <p className='move-big-size bold-style'>parcialidad</p>
                        <p >Solo necesitas cumplir con los siguientes requisitos:</p>
                    </div>
                    <div className='move-requirements'>
                        <p className='move-number'>1</p>
                        <p>Tener saldo <strong className='green'>disponible</strong><span className='green'></span></p>
                    </div>
                    <div className='move-requirements'>
                        <p className='move-number'>2</p>
                        <p>Tener tu parcialidad <strong className='green'>anterior pagada</strong>, es decir puedes gozar de este beneficio siempre y cuando tengas la parcialidad anterior cubierta.</p>
                    </div>
                    { loadingFirst ? 
                        <div className='check-requirement'>
                            <p>Cargando...</p>
                        </div>
                        : serverError ? 
                        <div className='check-requirement'>
                            <p>Ocurrió un problema en el servidor, intenta más tarde</p>
                        </div>
                        :
                        <div className='check-requirement'>
                            <p>Lo sentimos, por ahora no puedes solicitar más dinero</p>
                        </div>
                    }
                    {/* <div className='check-requirement'>
                        <p>No disponible</p>
                    </div> */}
                    {/* <p onClick={() => setFlux('default')} style={{textAlign: 'right', padding: '0 2rem', cursor: 'pointer', width: 'fit-content', margin: '0 auto'}} className='green'>Regresar a mi cuenta</p> */}
                </div>
            }
        </div>
    )
}

export default withRouter(More)
