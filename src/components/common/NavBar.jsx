import React, { useState, useEffect } from 'react'
import './common.scss'
import { Link } from 'react-router-dom'
import cookie from 'react-cookies'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Media from 'react-media'
import { momentEs } from '../../services/moment'

const NavBar = ({isLogged, location, setLocation}) => {

    const [showMenu, setShowMenu] = useState(false)
    const [tempScreen, setTempScreen] = useState(null)

    useEffect(() => {
        let startDate   = momentEs("01/04/2020", "DD/MM/YYYY")
        let endDate     = momentEs("30/04/2020", "DD/MM/YYYY")
        if(momentEs().isBetween(startDate, endDate)) return setTempScreen(true)
        return setTempScreen(false)
    }, [])

    return (
        <Media query={{ maxWidth: 990 }}>
        {matches =>
          matches ? (
            <div  className="flex-horizontal-new navbar" style={location === 'manteinance' ? {padding: '1rem 6rem'} : null}>
                {location === 'manteinance' ? <img width='300px' src='/img/navbar/logo-vivus-mexico.svg' alt='vivus logo'/> : <Link onClick={() => setLocation('home')} to='/'><img width='300px' src={tempScreen ? '/img/navbar/logo-vivus-mexico.svg' : location === 'home' ? '/img/navbar/logo-vivus-mexico.svg' : '/img/navbar/logo-vivus-mexico.svg'} alt='vivus logo'/></Link>}
                <div style={tempScreen ? {fontSize:'2rem', color: '#ff6b00', marginTop: '10px'} : location === 'home' ? {fontSize:'2rem', color: 'gray', marginTop: '10px'} : {fontSize:'2rem', color: 'black', marginTop: '20px'}}>
                    <FontAwesomeIcon onClick={() => setShowMenu(!showMenu)} icon={faBars}/>
                </div>
                {isLogged && location !== 'home' && location !== 'works' && location !== 'app' && location !== 'blog' 
                && location !== 'contenido' && location !== 'us' ? 
                <ul className={showMenu ? 'flex-menu-section flex-menu-mobile mobile-open' : 'flex-menu-section flex-menu-mobile'}>
                    {location !== 'denied' ? 
                        <li style={showMenu ? {borderBottom: '2px solid lightgray'} : null} className={location === 'profile' ? 'active-go' : null}>
                            <Link onClick={() => {setLocation('profile'); setShowMenu(false)}} to='/perfil'>Mis datos</Link>
                        </li>
                        : null
                    }
                    <li className={location === 'home' ? 'menu-button-home' : null}>
                        <Link onClick={() => {
                            setLocation('app')
                            setShowMenu(!showMenu)
                            sessionStorage.removeItem('loggedUser')
                            sessionStorage.removeItem('empty-customer')
                            sessionStorage.removeItem('customer-logged')
                            sessionStorage.removeItem('session-step')
                            sessionStorage.removeItem('proposal')
                            sessionStorage.removeItem('data-step-registration')
                            sessionStorage.removeItem('customer-personalData')
                            cookie.remove('token')
                            }} to='/login'>Cerrar sesión</Link>
                    </li>
                </ul>
                :
                <ul className={location === 'home' && showMenu  ? 'flex-menu-home flex-menu-home-mobile mobile-open' : location === 'home' && !showMenu ? 'flex-menu-home flex-menu-home-mobile' : showMenu ? 'flex-menu-section flex-menu-mobile mobile-open' : 'flex-menu-section flex-menu-mobile'}>
                    <li className={location === 'works' ? 'active-go' : null}>
                        {location === 'manteinance' ? null : <Link onClick={() => {setLocation('works'); setShowMenu(false)}} to='/como-funciona'>¿Cómo funciona?</Link>}
                    </li>
                    <li className={location === 'blog' ? 'active-go' : null}>
                        {location === 'manteinance' ? null : <Link onClick={() => {setLocation('blog'); setShowMenu(false)}} to='/blog'>Blog</Link>}
                    </li>
                    <li className={location === 'us' ? 'active-go' : null}>
                        {location === 'manteinance' ? null : <Link onClick={() => {setLocation('us'); setShowMenu(false)}} to='/us'>Sobre Nosotros</Link>}
                    </li>
                    <li className={location === 'home' ? 'menu-button-home' : location === 'app' ? 'active-go' : null}>
                        {location === 'manteinance' ? null : <Link onClick={() => {setLocation('app'); setShowMenu(false)}} to='/login'>¿Ya eres cliente?</Link>}
                    </li>
                </ul>
                }

            </div>
          ) : (
            <div className="flex-horizontal-new navbar" style={location === 'manteinance' ? {padding: '1rem 6rem'} : null}>
                {location === 'manteinance' ? <img width='300px' src='/img/navbar/logo-vivus-mexico.svg' alt='vivus logo'/> : <Link onClick={() => setLocation('home')} to='/'><img width={tempScreen ? '300px' : '300px'}  src={tempScreen ? '/img/navbar/logo-vivus-mexico.svg' : location === 'home' ? '/img/navbar/logo-vivus-mexico.svg' : '/img/navbar/logo-vivus-mexico.svg'} alt='vivus logo'/></Link>}
                {isLogged && location !== 'home' && location !== 'works' && location !== 'app' && location !== 'blog' 
                && location !== 'contenido' && location !== 'us' ? 
                <ul className='flex-menu-section'>
                    {location !== 'denied' ?
                        <li className={location === 'profile' ? 'active-go' : null}>
                            <Link onClick={() => setLocation('profile')} to='/perfil'>Mis datos</Link>
                        </li>
                        : null
                    }
                    <li className={location === 'home' ? 'menu-button-home' : null}>
                        <Link onClick={() => {
                            setShowMenu(!showMenu)
                            sessionStorage.removeItem('loggedUser')
                            sessionStorage.removeItem('empty-customer')
                            sessionStorage.removeItem('customer-logged')
                            sessionStorage.removeItem('session-step')
                            sessionStorage.removeItem('proposal')
                            sessionStorage.removeItem('data-step-registration')
                            sessionStorage.removeItem('customer-personalData')
                            cookie.remove('token')
                            }} to='/login'>Cerrar sesión</Link>
                    </li>
                </ul>
                :
                <ul className={location === 'home' ? 'flex-menu-home' : 'flex-menu-section'}>
                    <li className={location === 'works' ? 'active-go' : null}>
                        {location === 'manteinance' ? null : <Link style={tempScreen ? null : null} onClick={() => setLocation('works')} to='/como-funciona'>¿Cómo funciona?</Link>}
                    </li>
                    <li className={location === 'blog' ? 'active-go' : null}>
                        {location === 'manteinance' ? null : <Link style={tempScreen ? null : null} onClick={() => setLocation('blog')} to='/blog'>Blog</Link>}
                    </li>
                    <li className={location === 'us' ? 'active-go' : null}>
                        {location === 'manteinance' ? null : <Link style={tempScreen ? null : null} onClick={() => setLocation('us')} to='/us'>Sobre Nosotros</Link>}
                    </li>
                    <li className={location === 'home' ? 'menu-button-home' : location === 'app' ? 'active-go' : null}>
                        {location === 'manteinance' ? null : <Link onClick={() => setLocation('app')} to='/login'>¿Ya eres cliente?</Link>}
                    </li>
                </ul>
                }

            </div>
          )
        }
      </Media>
    )
}

export default NavBar