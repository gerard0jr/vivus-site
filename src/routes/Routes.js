import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import { Home } from '../components/landing/Home';
import { HowItWorks } from '../components/works/HowItWorks';
import Register from '../components/register/Register';
import NewLogin from '../components/account/NewLogin';
import NewProfile from '../components/account/profile/NewProfile';
// import FirstTimeDash from '../components/account/FirstTimeDash';
// import Buro from '../components/account/Buro';
import CargoAuto from '../components/account/CargoAuto';
import Cargo from '../components/account/Cargo';
import Identificacion from '../components/account/Identificacion';
import NewDashboard from '../components/account/NewDashboard';
import NewForgotPassword from '../components/account/NewForgotPassword';
import PasswordRecoveryEmail from '../components/account/PasswordRecoveryEmail';
import PasswordRecoveryEmailConfirmation from '../components/account/PasswordRecoveryEmailConfirmation';
// import PasswordRecoveryMobile from '../components/account/PasswordRecoveryMobile';
import PasswordRecoveryMobileConfirmation from '../components/account/PasswordRecoveryMobileConfirmation';
import PasswordSet from '../components/account/PasswordSet';
import { NotFound } from '../components/account/NotFound';
// import { Blog } from '../components/blog/Blog';
import { PreApproved } from '../components/register/PreApproved';
import { NotApproved } from '../components/register/NotApproved';
import DeniedDash from '../components/register/DeniedDash';
import { PrestamosEnLinea } from '../components/common/footer-links/PrestamosEnLinea';
import { PrestamosOnline } from '../components/common/footer-links/PrestamosOnline';
import { PrestamoInmediato } from '../components/common/footer-links/PrestamoInmediato';
import { AvisoDePrivacidad } from '../components/common/footer-links/AvisoDePrivacidad';
import { TerminosCondiciones } from '../components/common/footer-links/TerminosCondiciones';
import { AboutUs } from '../components/aboutUs/AboutUs';
import { Error } from '../components/common/Error';
import { SecondLoan } from '../components/account/SecondLoan';
import { Manteinance } from '../components/common/Manteinance';
import { momentEs } from '../services/moment'

const Routes = () => {

    const [inManteinance, setInManteinance] = useState(false)

    // useEffect(() => {
    //     let startDate   = momentEs("04-04-2020 01:00", "DD/MM/YYYY HH:mm")
    //     let endDate     = momentEs("04-04-2021 17:00", "DD/MM/YYYY HH:mm")
    //     if(momentEs().isBetween(startDate, endDate)) return setInManteinance(true)
    //     return setInManteinance(false)
    // }, [])

    return(
        <>
            {inManteinance ? 
                <Switch>
                    {/* RUTAS EN mantenimiento */}
                    <Route exact path='/' component={Home}/>
                    <Route exact path='/en-mantenimiento' component={Manteinance} /> 
                    <Route path='/*' render={props => <Redirect to='/en-mantenimiento'/>} /> 
                </Switch>
                :
                <Switch>
                    {/* <Route exact path='/en-mantenimiento' component={Manteinance} /> 
                    <Route exact path='/' render={props => <Redirect to='/en-mantenimiento'/>} />  */}
                    {/* Home */}
                    <Route exact path='/' component={Home}/>
                    {/* Landing sections */}
                    <Route path='/como-funciona' component={HowItWorks}/>
                    {/* <Route path='/blog' component={Blog}/> */}
                    <Route path='/us' component={AboutUs}/>
                    {/* Login / Recover password */}
                    <Route path='/login' component={NewLogin} />

                    <Route exact path='/registration' render={props => <Register {...props} url={0}/>}/>
                    <Route path='/registration/personal-details' render={props => <Register {...props} url={1}/>}/>
                    <Route path='/registration/employment-details' render={props => <Register {...props} url={2}/>}/>
                    <Route path='/registration/nip-bureau' render={props => <Register {...props} url={3}/>}/>
                    <Route path='/registration/identity' render={props => <Register {...props} url={4}/>}/>
                    <Route path='/registration-complete' render={props => <Register {...props} url={5}/>}/>
                    <Route path='/registration/questionary' render={props => <Register {...props} url={6} questionnaire/>}/>
                    
                    <Route path='/application-complete' component={PreApproved} />
                    <Route path='/rejected' component={NotApproved} />
                    <Route path='/recupera' component={PasswordRecoveryEmail}/>
                    <Route path='/recupera-opcion' component={NewForgotPassword} />
                    <Route path='/confirmacion-email' component={PasswordRecoveryEmailConfirmation}/>
                    <Route path='/confirmacion-sms' component={PasswordRecoveryMobileConfirmation}/>
                    <Route path='/nuevo-password' component={PasswordSet}/>
                    <Route path='/denied' component={DeniedDash} />
                    {/* Application */}
                    {/* <Route path='/dashboard/initial' component={FirstTimeDash}/> */}
                    <Route exact path='/dashboard' component={SecondLoan}/>
                    <Route path='/perfil' component={NewProfile}/>
                    {/* <Route path='/dashboard/buro' component={Buro}/> */}
                    <Route path='/dashboard/confirm' component={CargoAuto}/>
                    <Route path='/pre-approved' component={Cargo}/>
                    <Route path='/dashboard/id' component={Identificacion}/>
                    <Route path='/dashboard/welcome' component={NewDashboard}/>
                    {/* <Route path='/borrow-more' component={NewDashboard}/> */}
                    {/* LINKS FOOTER */}
                    <Route path='/contenido/prestamos-en-linea' component={PrestamosEnLinea}/>
                    <Route path='/contenido/prestamos-online' component={PrestamosOnline}/>
                    <Route path='/contenido/prestamo-inmediato' component={PrestamoInmediato}/>
                    <Route path='/contenido/aviso-de-privacidad' component={AvisoDePrivacidad}/>
                    <Route path='/contenido/terminos-y-condiciones' component={TerminosCondiciones}/>
                    
                    {/* REPEATERS */}
                    <Route path='/repeated/credit-check' render={props => <Cargo {...props} repeater/>}/>
                    <Route path='/repeated/application/complete' render={props => <Register {...props} url={5} repeater/>}/>
                    <Route path='/repeated/application/pre-approved' render={props => <PreApproved {...props} repeater/>}/>
                    <Route path='/repeated/application/rejected'render={props => <NotApproved {...props} repeater/>}/>
                    
                    {/* ADDITIONAL AMOUNT */}
                    <Route path='/additional/application/pre-approved' render={props => <Cargo {...props} additional/>}/>
                    <Route path='/additional/application/complete' render={props => <PreApproved {...props} additional/>}/>

                    <Route path='/error' component={Error} />
                    {/* 404 */}
                    <Route component={NotFound} />
                </Switch>
            }
        </>
    )
}

export default Routes