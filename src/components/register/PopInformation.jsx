import React from 'react'
import Popup from "reactjs-popup"
import { BallClipRotate } from 'react-pure-loaders';
import { momentEs } from '../../services/moment'

export const PopInformation = ({open, close, data, accept, amortizationTable}) => {
    return (
        <Popup onClose={close} open={open} position="right center">
            <div style={{textAlign: 'justify', padding: '1rem 2rem'}}>
                <div dangerouslySetInnerHTML={data}></div>
                {data ? 
                <div className='button-container'>
                    <p className='btn-register' onClick={() => {close(); accept(true)}}>Estoy de acuerdo</p>
                    <p className='btn-register' style={{marginLeft: '1rem', backgroundColor: 'lightgray'}} onClick={close}>Cerrar</p>
                </div>
                : amortizationTable ? 
                <>  
                    <h2>Tabla de amortización</h2>
                    <table style={{borderSpacing: 0, width: '100%'}}>
                        <thead>
                            <tr>
                                <th>Pago</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Capital</th>
                                <th>Interés</th>
                            </tr>
                        </thead>
                        <tbody>
                        {amortizationTable.filter((data) => data.idDeferral > 0).map((data, ix) =>
                        <tr key={ix} style={ix % 2 === 0 ? {backgroundColor: 'lightgray'} : null}>
                            <td>{data.idDeferral}</td>
                            <td>{momentEs(data.dueDate).format('L')}</td>
                            <td>{data.paymentValue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                            <td>{data.principal.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                            <td>{data.interest.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                        </tr>        
                        )}
                        </tbody>
                    </table>
                </> 
                : 
                <h2>Cargando...<BallClipRotate loading color='#A3CD3A'/></h2>
                }
            </div>
        </Popup>
    )
}
