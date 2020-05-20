import React, {useState, useEffect} from 'react'
import './newStyles.scss'
import ReactSpeedometer from "react-d3-speedometer"
import { withRouter } from 'react-router-dom'
import Slider from 'react-rangeslider'
import cookie from 'react-cookies'
import { BallClipRotate } from 'react-pure-loaders'

const data = {
    activeContract: false,
    pagado: 0,
    edoCuenta: [
        {numero: 1, fecha: '15/SEP/2019', importe: 1377.25}, 
        {numero: 2, fecha: '30/SEP/2019', importe: 1377.25},
        {numero: 3, fecha: '15/OCT/2019', importe: 1377.25}, 
        {numero: 4, fecha: '31/OCT/2019', importe: 1377.25},
        {numero: 5, fecha: '15/NOV/2019', importe: 1377.25},
        {numero: 6, fecha: '31/NOV/2019', importe: 1377.25}
    ],
    contrato: [ 
    ],
    liquidaHoy: 4377.25
}

const FirstTimeDash = (props) => {
    let stepWidth = 25
    const [token, setToken] = useState(null)
    const [user, setUser] = useState(null)
    const [monto, setMonto] = useState(6000)
    const [plazo, setPlazo] = useState(6)
    const [periodicidad, setPeriodicidad] = useState('quincenal')
    const [disponible, setDisponible] = useState(3000)
    const [interes, setInteres] = useState((6000 / 6) * 0.325)
    const [interesIVA, setInteresIVA] = useState(((6000 / 6) * 0.325) * 1.16)
    const [parcialidad, setParcialidad] = useState((((6000 / 6) * 0.325) * 1.16) + (6000 / 6))
    const [fecha, setFecha] = useState('15/OCT/2019')
    const [liquidaHoy, setLiquidaHoy] = useState(6000)
    const [payedTable, setPayedTable] = useState([]) 
    const [debtTable, setDebtTable] = useState([{numero: 1, fecha: '15/SEP/2019', importe: 1377.25}, 
                                                {numero: 2, fecha: '30/SEP/2019', importe: 1377.25},
                                                {numero: 3, fecha: '15/OCT/2019', importe: 1377.25}, 
                                                {numero: 4, fecha: '31/OCT/2019', importe: 1377.25},
                                                {numero: 5, fecha: '15/NOV/2019', importe: 1377.25},
                                                {numero: 6, fecha: '31/NOV/2019', importe: 1377.25}]
                                                )

    const goTo = () => {
        const debtData = {
            monto, 
            plazo, 
            periodicidad,
            disponible,
            interes,
            interesIVA,
            parcialidad,
            fecha,
            debtTable,
            payedTable,
            liquidaHoy
        }
        sessionStorage.setItem('debt', JSON.stringify(debtData))
        props.history.push('/dashboard/buro')
    }

    useEffect(() => {
        let getUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(!getUser) return props.history.push('/login')
        setUser(getUser)
        let getToken = cookie.load('token')
        if(!getToken) return props.history.push('/login')
        setToken(getToken)
        // Aquí obtendremos la información del usuario
        if(data.activeContract) return props.history.push('/dashboard/new')
    }, [])
    
    return (
        <div className='app-container'>
            {user ? 
            <div style={{textAlign: 'center', justifyContent: 'center'}}>
                <strong><h2 style={{margin: '2rem 0'}}>TU CUENTA</h2></strong>
                <div className='account-container'>
                    <div className='left-dash'>
                        <div className='slider-container'>
                            <h2>Solicita un</h2>
                            <h3>nuevo préstamo</h3>
                            <div className='title-winput'>
                                <p>Monto total</p>
                                <div className="slider-input-wrapper">
                                    <input className="slider-input" type="text" value={monto} readOnly/>
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
                                    min={3000} 
                                    max={9000} 
                                    value={monto} 
                                    labels={{3000:'$3,000', 9000: '$9,000'}} 
                                    step={1000} 
                                    orientation='horizontal' 
                                    tooltip={false}
                                    onChange={val => {setMonto(val); setDisponible(9000 - val); setInteres((val / plazo) * 0.325); setInteresIVA(((val / plazo) * 0.325) * 1.16); setParcialidad((((val / plazo) * 0.325) * 1.16) + (val / plazo))}}
                                />
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373', marginTop: '3rem'}}/>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '1rem'}}>
                                <p>Periodicidad de pago</p>
                                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                                    <button className={periodicidad === 'quincenal' ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => setPeriodicidad('quincenal')}>Quincenal</button>
                                    <button className={periodicidad === 'semanal' ? 'boton-periodicidad period-active' : 'boton-periodicidad'} onClick={() => setPeriodicidad('semanal')}>Semanal</button>
                                </div>
                            </div>
                            <hr style={{width: '100%', border: '0.5px solid #737373'}}/>
                            <div className='title-winput'>
                                <p>Plazo</p>
                                <div className="slider-input-wrapper">
                                    <input className="slider-input" type="text" value={plazo} readOnly/>
                                    <span style={{fontSize: '0.7rem'}} className="slider-input-unit">{periodicidad === 'quincenal' ? ' quincenas' : ' semanas'}</span>
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
                                    min={periodicidad === 'quincenal' ? 2 : 4} 
                                    max={periodicidad === 'quincenal' ? 6 : 12} 
                                    value={plazo} 
                                    labels={periodicidad === 'quincenal' ? {2:'2', 6: '6'} : {4: '4', 12: '12'}} 
                                    orientation='horizontal' 
                                    tooltip={false}
                                    onChange={val => {setPlazo(val); setInteres((monto / val) * 0.325); setInteresIVA(((monto / val) * 0.325) * 1.16); setParcialidad( (((monto / val) * 0.325) * 1.16) + (monto / val) )}}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='right-dash'>
                    <div className='dashboard-default'>
                        <div className='dash-top-container'>
                            <div className='dash-box'>
                                <p className='title'><strong>Mi préstamo</strong></p>
                                <div className='prestamo'>
                                    <div className='importe-disponible'>
                                        <div className='importe-letra'>importe disponible</div>
                                        <div className='importe-numero'>{disponible.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
                                    </div>
                                    <div className='importe-en-uso'>
                                        <div className='importe-letra'>importe en uso</div>
                                        <div className='importe-numero'>{monto.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</div>
                                    </div>
                                </div>
                            </div>
                            <div className='dash-box'>
                                <p className='title'><strong>Mi parcialidad</strong></p>
                                <div className='parcialidad'>
                                    <p>Plazo  {plazo} {periodicidad === 'quincenal' ? ' quincenas' : ' semanas'}</p>
                                    <p>Interés  {interes.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} <small>({interesIVA.toLocaleString('en-US', {style: 'currency', currency: 'USD'}) + ' IVA incluído'})</small></p>
                                    <p>Parcialidad a pagar  {parcialidad.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} <small>IVA incluído</small></p>
                                    <p>Fecha de pago  {fecha}</p>
                                </div>
                            </div>
                            <div className='dash-box'>
                                <p className='title'><strong>Mi avance en pagos</strong></p>
                                <div className='avance'>
                                    <ReactSpeedometer
                                        maxValue={monto}
                                        value={data.pagado}
                                        valueFormat={"($,.2f"}
                                        needleColor="red"
                                        startColor="#8e3c12"
                                        segments={plazo}
                                        endColor="#A3CD3A"
                                        maxSegmentLabels={5}
                                        forceRender
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='dash-banner'></div>
                        <div className='dash-bottom-container'>
                            <div className='dash-box'>
                                <div className='edo-cuenta'>
                                    <p className='bottom-title'><strong>Parcialidades a pagar</strong></p>
                                    <table className='tabla'>
                                        <thead>
                                            <tr>
                                                <th>Número de pago</th>
                                                <th>Fecha de pago</th>
                                                <th>Importe</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.edoCuenta.map((el, ix) => 
                                                <tr key={ix}>
                                                    <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.numero}</td>
                                                    <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.fecha}</td>
                                                    <td className={ix % 2 ? 'row-non' : 'row-par'}>{el.importe}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className='empty-box'>
                                <div className='edo-cuenta-empty' style={{backgroundColor: '#f2f2f2'}}>
                                    <p className='bottom-title-empty'><strong>Parcialidades pagadas</strong></p>
                                    <table className='tabla'>
                                        <thead>
                                            <tr>
                                                <th>Número de pago</th>
                                                <th>Fecha de pago</th>
                                                <th>Importe</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className='row-par'> </td>
                                                <td className='row-par'> </td>
                                                <td className='row-par'> </td>
                                            </tr>
                                            <tr>
                                                <td className='row-non'> </td>
                                                <td className='row-non'> </td>
                                                <td className='row-non'> </td>
                                            </tr>
                                            <tr>
                                                <td className='row-par'> </td>
                                                <td className='row-par'> </td>
                                                <td className='row-par'> </td>
                                            </tr>
                                            <tr>
                                                <td className='row-non'> </td>
                                                <td className='row-non'> </td>
                                                <td className='row-non'> </td>
                                            </tr>
                                            <tr>
                                                <td className='row-par'> </td>
                                                <td className='row-par'> </td>
                                                <td className='row-par'> </td>
                                            </tr>
                                            <tr>
                                                <td className='row-non'> </td>
                                                <td className='row-non'> </td>
                                                <td className='row-non'> </td>
                                            </tr>
                                            <tr>
                                                <td className='row-par'> </td>
                                                <td className='row-par'> </td>
                                                <td className='row-par'> </td>
                                            </tr>
                                            <tr>
                                                <td className='row-non'> </td>
                                                <td className='row-non'> </td>
                                                <td className='row-non'> </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className='flex-horizontal'>
                            <p style={{textAlign: 'left', marginRight: '2rem'}}>La fecha de vencimiento del préstamo es <strong>90</strong> días a partir de la aprobación del mismo. <strong>CAT: 592.6%</strong> promedio sin IVA</p>
                            <p className='btn-minimal-width' style={{fontSize: '1.3rem', width: '180px'}} onClick={goTo}>SOLICÍTALO YA</p>
                        </div>
                    </div>
                    </div>
                </div>
                <br/>
            </div>
            :
            <BallClipRotate loading color={'#A8CC46'}/>
            }
            </div>
    )
}

export default withRouter(FirstTimeDash)
