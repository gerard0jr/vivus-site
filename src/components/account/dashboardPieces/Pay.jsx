import React, {useState} from 'react'
import Options from './pay-components/Options'
import '../newStyles.scss'
import Liquidate from './pay-components/Liquidate'
import Bank from './pay-components/Bank'
import Debit from './pay-components/Debit'
import Cash from './pay-components/Cash'

const Pay = ({balance}) => {
    const [cargos, setCargos] = useState('resumen')

    return (
        <div className='pagar-container'>
            {/* {cargos === 'resumen' || cargos === 'liquidate' ? 
                <div>
                    <h3>Anticipar pago</h3>
                    <div className='pagar-text-box'><p>Despreocúpate ya tenemos programado el cargo de tu pago para que no hagas filas ni pagues comisiones extra en los establecimientos</p></div>
                    <div className='liquidar-prestamo'>
                        <span>Selecciona aquí si quieres</span>
                        <button onClick={() => setCargos('liquidate')} className={cargos === 'liquidate' ? 'dashboard-gray-button active-dash-button' : 'dashboard-gray-button'}>Anticipar tu pago</button>
                    </div>
                    <div className='separator'></div>
                </div>
                :
                null
            }     */}
            { cargos === 'resumen' ?
                <Options cargos={cargos} setCargos={setCargos}/>
                : cargos === 'liquidate' ?
                <Liquidate balance={balance}/> 
                : cargos === 'bank' ?
                <Bank balance={balance}/>
                : cargos === 'debit' ?
                <Debit balance={balance} />
                : cargos === 'cash' ?
                <Cash balance={balance}/> 
                :
                <Options/>
            }
            <div>
                {cargos !== 'resumen' ? <p onClick={() => setCargos('resumen')} className='return-dash'>Regresar</p> : null}
            </div>
        </div>
    )
}

export default Pay
