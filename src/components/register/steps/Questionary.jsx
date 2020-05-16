import React, { useEffect } from 'react'
import Questionnaire from './Questionnaire'

export const Questionary = (props) => {
    useEffect(() => {
        let currentStep = sessionStorage.getItem('session-step')
        if(currentStep === '1'){
            return props.props.history.push('/registration/personal-details')
            }
        if(currentStep === '2'){
            return props.props.history.push('/registration/employment-details')
            }
        if(currentStep === '3'){
            return props.props.history.push('/registration/nip-bureau')
            }
        else if(currentStep === '4') return props.props.history.push('/registration/identity')
        // else if(currentStep === '5') return props.props.history.push('/registration-complete')
        else sessionStorage.setItem('session-step', 6)
    },[])
    return (
        <div style={{textAlign: 'center'}} className='register-form-container-100'>
             <Questionnaire/>
        </div>
    )
}
