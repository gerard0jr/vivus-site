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
import { getStatus, getToken } from '../../services/api'
import cookie from 'react-cookies'

let idProduct = 1

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

    useEffect(() => {
        let checkUser = async () => {
            let validToken = cookie.load('token')
            if(!validToken){
                let response = await getToken()
                if(!response.data) return
                if(response.data) validToken = response.data.token
            }
            let loggedUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
            if(!loggedUser) {
                let emptyCustomer = await JSON.parse(sessionStorage.getItem('empty-customer'))
                if(emptyCustomer){
                    getStatus(idProduct, emptyCustomer.customerId, false, validToken)
                        .then(res => {
                            const { data } = res
                            if(res.status === 200){
                                if(data.idStatus === 1){
                                    if(data.idSubStatus === 180) return props.history.push('/registration/personal-details')
                                    if(data.idSubStatus === 181) return props.history.push('/registration/employment-details')
                                    if(data.idSubStatus === 182) return props.history.push('/registration/nip-bureau')
                                    if(data.idSubStatus === 183) return props.history.push('/registration/identity')
                                    if(data.idSubStatus === 184) return props.history.push('/registration/identity')
                                    if(data.idSubStatus === 185) return props.history.push('/registration/nip-bureau')
                                    if(data.idSubStatus === 195) return props.history.push('/registration-complete')
                                    if(data.idSubStatus === 196) return props.history.push('/pre-approved')
                                    if(data.idSubStatus === 203) return props.history.push('/pre-approved')
                                    if(data.idSubStatus === 206) return props.history.push('/dashboard/id')
                                    if(data.idSubStatus === 217) return props.history.push('/dashboard/confirm')
                                    if(data.idSubStatus === 218) return props.history.push('/application-complete')
                                    if(data.idSubStatus === 219) return props.history.push('/application-complete')
                                }
                                if(data.idStatus === 4){
                                return props.history.push('/denied')
                                }
                                if(data.idStatus === 6){
                                return props.history.push('/dashboard/welcome')
                                }
                                if(data.idStatus === 7){
                                return props.history.push('/dashboard/welcome')
                                }
                                return props.history.push('/dashboard/welcome')
                            }
                        })
                        .catch(err => console.log(err))
                }
                return
            }
            getStatus(idProduct, loggedUser.customerId, false, validToken)
            .then(res => {
                const { data } = res
                if(res.status === 200){
                    if(data.idStatus === 1){
                        if(data.idSubStatus === 180) return props.history.push('/registration/personal-details')
                        if(data.idSubStatus === 181) return props.history.push('/registration/employment-details')
                        if(data.idSubStatus === 182) return props.history.push('/registration/nip-bureau')
                        if(data.idSubStatus === 183) return props.history.push('/registration/identity')
                        if(data.idSubStatus === 184) return props.history.push('/registration/identity')
                        if(data.idSubStatus === 185) return props.history.push('/registration/nip-bureau')
                        if(data.idSubStatus === 195) return props.history.push('/registration-complete')
                        if(data.idSubStatus === 196) return props.history.push('/pre-approved')
                        if(data.idSubStatus === 203) return props.history.push('/pre-approved')
                        if(data.idSubStatus === 206) return props.history.push('/dashboard/id')
                        if(data.idSubStatus === 217) return props.history.push('/dashboard/confirm')
                        if(data.idSubStatus === 218) return props.history.push('/application-complete')
                        if(data.idSubStatus === 219) return props.history.push('/application-complete')
                    }
                    if(data.idStatus === 4){
                        return props.history.push('/denied')
                    }
                    if(data.idStatus === 6){
                        return props.history.push('/dashboard/welcome')
                    }
                    if(data.idStatus === 7){
                        return props.history.push('/dashboard/welcome')
                    }
                    return props.history.push('/dashboard/welcome')
                }
                })
                .catch(err => console.log(err))
        }
        checkUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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