import React from 'react'
import Steps from 'rc-steps'
import 'rc-steps/assets/index.css'

const { Step } = Steps

export const RegisterSteps = ({props, currentStep, setCurrentStep}) => {
    return (
        <Steps type="navigation" current={currentStep} 
        onChange={current => {
            if(current === 0) return props.history.push('/registration')
            if(current === 1) return props.history.push('/registration/personal-details')
            if(current === 2) return props.history.push('/registration/employment-details')
            if(current === 3) return props.history.push('/registration/nip-bureau')
            if(current === 4) return props.history.push('/registration/identity')
            if(current === 5) return props.history.push('/registration-complete')
            if(current === 6) return props.history.push('/registration/questionary')
            // setCurrentStep(current)
            }}>
            <Step disabled={currentStep > 2} title='Registro'/>
            <Step disabled={currentStep < 1 || currentStep > 2} title='Datos personales y Dirección'/>
            <Step disabled={currentStep < 2 || currentStep > 2} title='Detalles de Empleo'/>
            <Step disabled={true} title='Preguntas de Verificación'/>
            <Step disabled={true} title='Revisión de Identidad'/>
            <Step disabled={true} title='Finalizada'/>
        </Steps>
    )
}
