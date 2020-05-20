import React from 'react'

export const AdditionalAmount = () => {
    return (
        <div style={{padding: '2rem 3rem'}}>
            <h2 style={{fontSize: '2rem', fontWeight: '300', margin: 0, textAlign: 'left'}}>¿Necesitas más dinero?</h2>
            <h2 style={{fontSize: '2rem', fontWeight: '600', margin: 0, textAlign: 'left'}}>Solicita un monto adicional.</h2>
            <p style={{padding: '2rem 0', textAlign: 'left'}}>Una vez registrado en Vivus.com.mx y luego de efectuar una revisión automatizada de tus datos, podemos ofrecerte una cantidad adicional al préstamo existente. Esta posibilidad estará disponible en tu perfil personal una vez que inicies sesión. ¡Si quieres conocer tus opciones de montos adicionales disponibles, por favor revisa tu perfil en Vivus.com.mx!</p>
            <div className='addAmount-questions'>
                <h3>¿Quién puede solicitar un monto adicional?</h3>
                <p>Para poder solicitar un monto adicional, deberás tener cubierta la primer parcialidad de tu crédito. Una vez que inicies sesión, tendrás disponible esta opción en tu perfil y podrás solicitarlo de manera directa y rápida.</p>
                <h3>¿Cuánto monto adicional puedo solicitar?</h3>
                <p>Una vez elegido el préstamo, nuestro simulador te permitirá analizar las opciones y montos adicionales disponibles.</p>
                <h3>¿Qué sucederá con mi préstamo actual si solicito un monto adicional?</h3>
                <p>El crédito inicial junto con el adeudo se sumarán al monto adicional que solicites y se considerará como un único préstamo a pagar a un plazo de 3 meses.</p>
                <h3>¿Cuántos montos adicionales puedo solicitar?</h3>
                <p>Puedes solicitar montos adicionales las veces que quieras hasta alcanzar el máximo permitido por tu límite de crédito.</p>
            </div>
        </div>
    )
}
