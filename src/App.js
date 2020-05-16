import React, { useState, useEffect } from 'react';
import './App.css';
import Routes from './routes/Routes';
import NavBar from './components/common/NavBar'
import { Footer } from './components/common/Footer'
import { Social } from './components/common/Social';
import { withRouter } from 'react-router-dom'
import TagManager from 'react-gtm-module'
import { momentEs } from './services/moment'

const tagManagerArgs = {
  gtmId: 'GTM-TQJ8F7K',
  dataLayerName: 'dataLayer'
}

TagManager.initialize(tagManagerArgs)

function App(props) {
  const [location, setLocation] = useState(null)
  const [isLogged, setIsLogged] = useState(false)

  const [loaded, setLoaded] = useState(false)

//   useEffect(() => {
//     let startDate   = momentEs("11-04-2020 01:00", "DD/MM/YYYY HH:mm")
//     let endDate     = momentEs("04-04-2021 17:00", "DD/MM/YYYY HH:mm")
//     if(momentEs().isBetween(startDate, endDate)) return setLoaded(true)
//     return setLoaded(false)
// }, [])

  useEffect(() => {
    if(window.location.pathname === '/') setLocation('home')
    if(props.location.pathname.includes('/dashboard')) setLocation('dashboard')
    if(props.location.pathname.includes('/login')) setLocation('app')
    if(props.location.pathname.includes('/blog')) setLocation('blog')
    if(props.location.pathname.includes('/registration')) setLocation('app')
    if(props.location.pathname.includes('/denied')) setLocation('denied')
    if(props.location.pathname.includes('/contenido')) setLocation('contenido')
    if(props.location.pathname.includes('/us')) setLocation('us')
    if(props.location.pathname.includes('/denied')) setLocation('denied')
    if(props.location.pathname.includes('/en-mantenimiento')) setLocation('manteinance')
    if(sessionStorage.getItem('loggedUser')) setIsLogged(true)
    else setIsLogged(false)
  }, [props.location])
  
  return (
    <div className="App">
      {loaded ?
      <div></div>
      :
      <> 
        <>
          <NavBar isLogged={isLogged} location={location} setLocation={setLocation}/>
          <Routes/>
          <Social location={location}/>
        </>
        <Footer location={location}/>
      </>
      }
    </div>
  );
}

export default withRouter(App)
