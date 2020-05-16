import React, { useState, useEffect } from 'react'
import './register.scss'
import { RegisterSteps } from './RegisterSteps'
import { PersonalData } from './steps/PersonalData'
import { JobData } from './steps/JobData'
import { Verification } from './steps/Verification'
import { Identity } from './steps/Identity'
import Done from './steps/Done'
import BasicInfo from './steps/BasicInfo'
import RegisterCalculator from './RegisterCalculator'
import { withRouter } from 'react-router-dom'
import { Questionary } from './steps/Questionary'

const Register = (props) => {

    const [currentStep, setCurrentStep] = useState(props.url)
    const [proposalChange, setProposalChange] = useState(null)

    const changeProposal = e => setProposalChange(e)

    useEffect(() => {
        const scroll = () => window.scrollTo(0, 0)
        return scroll()
    }, [currentStep])

    useEffect(() => {
        setCurrentStep(props.url)
    }, [props.url])

    return (
        <div className='app-container'>
            <div className='steps-container'>
                <RegisterSteps props={props} currentStep={currentStep} setCurrentStep={setCurrentStep}/>
            </div>
            <div className={currentStep > 2 ? 'register-container-full' : 'register-container'}>
                <div className={currentStep > 2 ? 'left-register-full' : 'left-register'}>
                    {currentStep === 0 ? 
                        <BasicInfo props={props.history} currentStep={currentStep} setCurrentStep={setCurrentStep} changeProposal={changeProposal}/>
                        : currentStep === 1 ? 
                        <PersonalData props={props} setCurrentStep={setCurrentStep} changeProposal={changeProposal}/>
                        : currentStep === 2 ? 
                        <JobData props={props} setCurrentStep={setCurrentStep} changeProposal={changeProposal}/>
                        : currentStep === 3 ? 
                        <Verification props={props} setCurrentStep={setCurrentStep}/>
                        : currentStep === 4 ? 
                        <Identity props={props} setCurrentStep={setCurrentStep}/>
                        : currentStep === 5 ? 
                        <Done props={props} setCurrentStep={setCurrentStep}/>
                        : currentStep === 6 ? 
                        <Questionary props={props} setCurrentStep={setCurrentStep}/>
                        :
                        <BasicInfo props={props.history} setCurrentStep={setCurrentStep}/>
                    }
                </div>
                {currentStep > 2 ? 
                null
                :
                <div className='right-register'>
                    <RegisterCalculator props={props.history} proposalChange={proposalChange}/>
                </div>}
            </div>
        </div>
    )
}

export default withRouter(Register)