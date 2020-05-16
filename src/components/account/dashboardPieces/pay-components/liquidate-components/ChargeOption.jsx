import React, {useState} from 'react'

const ChargeOption = () => {
    const [autoCharge, setAutoCharge] = useState(false)
    return (
        <div>{ autoCharge ? 
            <div className='charge-resume-true'>
                <p className='bold-type'>¡Listo!</p>
                <p>Ya tenemos todo lo necesario para realizar el cargo automático a tu cuenta</p>
                <p>Tan pronto quede aplicado te notificaremos vía <strong>SMS</strong> y en tu <strong>mail</strong></p>
                <small>El cargo se realizará de acuerdo al horario de solicitud</small> <br/>
                <small>1. mismo día hábil, si lo solicitaste <strong>antes</strong> de las 12 hrs.</small> <br/>
                <small>2. día hábil siguiente, <strong>después</strong> de las 12 hrs.</small>
            </div>   
            :
            <div className='charge-resume'>
                <p>Programa tu cargo automático en el botón de abajo y nosotros lo haremos por ti, olvídate de <strong>hacer filas</strong> o <strong>pagar comisiones</strong> extra en tiendas.</p>
                <p className='btn-minimal-width' style={{width: '215px', margin: '0 auto'}} onClick={() => setAutoCharge(true)}>PROGRAMAR CARGO AUTOMÁTICO</p>
            </div>
        }</div>
    )
}

export default ChargeOption
