import React from 'react'

export const Manteinance = () => {
    return (
        <div className='app-container'>
            <div className='manteinance-page'>
                <div className='left-manteinance'>
                    <h1>Estamos haciendo mejoras en nuestra página web</h1>
                    <h2>Enseguida volveremos a estar disponibles</h2>
                    <h3>Disculpa las molestias</h3>
                    <br/>
                    <h3 style={{fontWeight: 'bold'}}>¿Necesitas ayuda?</h3>
                    <h2>info@Vivus.com.mx</h2>
                    <h2>(0155) 6717 0755</h2>
                </div>
                <div className='right-manteinance'>
                    <img src="/img/manteinance.png" alt="manteinance-Vivus"/>
                </div>
            </div>
        </div>
    )
}
