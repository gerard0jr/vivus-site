import React from 'react'

const ChangePayment = ({setSection}) => {
    return (
        <div>
            <h4>Cambia aquí tu CLABE o Tarjeta de Débito</h4>
            <div className='change-payment-options'>
                <div onClick={() => setSection('payment-bank')} className='payment-type'>
                    <div>
                        <img src="/icons/uEA27-disbursement_bank.svg" alt="bank"/>
                        <p>Cuenta bancaria</p>
                    </div>
                    <img src="/icons/uE020-chevron_right.svg" alt="chev right"/>
                </div>
                <hr style={{width: '100%', margin: '1rem'}}/>
                <div onClick={() => setSection('payment-debit')} className='payment-type'>
                    <div>
                        <img src="/icons/uEA28-disbursement_card.svg" alt="bank"/>
                        <p>Tarjeta de débito</p>
                    </div>
                    <img src="/icons/uE020-chevron_right.svg" alt="chev right"/>
                </div>
            </div>
        </div>
    )
}

export default ChangePayment