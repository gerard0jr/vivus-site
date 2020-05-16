import React, { useState, useEffect } from 'react'
import { getToken, getCustomerByMail, getQuestionnaire, answerQuestionnaire } from '../../../services/api'
import { withRouter } from 'react-router-dom'
import { BallBeat, BallClipRotate } from 'react-pure-loaders'

const idProduct = 2

const Questionnaire = (props) => {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [answersError, setAnswersError] = useState(false)
    const [answers, setAnswers] = useState({
        answers: [
            {
                idQuestion: 0,
                idAnswer: 0
            },
            {
                idQuestion: 0,
                idAnswer: 0
            },
            {
                idQuestion: 0,
                idAnswer: 0
            },
            {
                idQuestion: 0,
                idAnswer: 0
            },
            {
                idQuestion: 0,
                idAnswer: 0
            },
            {
                idQuestion: 0,
                idAnswer: 0
            },
        ]
    })
    const [questionnaire, setQuestionanire] = useState({})

    const checkAnswersError = () => {
        for(let i=0; i < answers.answers.length; i++){
            if(answers.answers[i].idAnswer === 0 ) {
                return true
            }
        }
        return false
    }

    const handleSubmit = async () => {
        const answersError = await checkAnswersError()
        if(answersError) return setAnswersError(true)
        setAnswersError(false)
        setLoading(true)
        let response = await getToken()
        const validToken = response.data.token
        answerQuestionnaire(answers, validToken)
            .then(res => {
                if(res.status === 200){
                    if(res)
                    sessionStorage.setItem('APP', 'yes')
                    return props.history.push('/pre-approved')
                }
                sessionStorage.setItem('APP', 'no')
                props.history.push('/rejected')
            })
            .catch(err => {
                setError(true)
                setLoading(false)
            })
    }

    const loadQuestions = async (datos) => {
        let result = await getToken()
        if(!result) return
        const validToken = result.data.token
        const data = {
            idProduct,
            idCustomer: datos.customerId,
            userAgent: 'Chrome',
            clientIP: '100.0.0.0'
        }
        return getQuestionnaire(data, validToken)
            .then(res => {
                if(res.status === 200){
                    setQuestionanire(res.data)
                    setAnswers({...answers, 
                        idProduct,
                        idCustomer: res.data.idCustomer,
                        idQuestionnaire: res.data.idQuestionnaire,
                        clientIP: '100.0.0.0',
                        userAgent: 'Chrome'
                    })
                    return setLoading(false)
                }
                // 200 array de preguntas, 403 solicita respuesta y salta
            })
            .catch(err => {
                console.log(err.response)
                if(err.response.status === 403){
                    sessionStorage.setItem('APP', 'yes')
                    return props.history.push('/pre-approved')    
                }
                if(err.response.status === 400){
                    return setError(true)
                }
                setError(true)
            })
    }

    const handleAnswers = (e, idQuestion, ix) => {
        const data = answers
        data.answers[ix] = {
            idQuestion,
            idAnswer: parseInt(e.target.value)
        }
        setAnswers(data)
    }

    const loadLocalData = async () => {
        let localRegister = await JSON.parse(sessionStorage.getItem('data-step-registration'))
        if(!localRegister) return props.history.push('/login')
        let response = await getToken()
        const validToken = response.data.token
        getCustomerByMail(idProduct, localRegister.eMail, validToken)
            .then(res => {
                loadQuestions(res.data)
            })
            .catch(err => setError(true))
    }

    useEffect(() => {
        const initialConfig = async () => {
            const loggedUser = await JSON.parse(sessionStorage.getItem('loggedUser'))
            if(!loggedUser){
                return loadLocalData()
            }
            return loadQuestions(loggedUser)
        }
        initialConfig()
    }, [])

    return (
            <div style={{textAlign: 'left', padding: '2rem 3rem'}}>
                <h1 style={{margin: '1rem 0 0 0', padding: 0, fontWeight: 'bold', fontSize: '2rem'}}>Estamos casi listos</h1>
                <h2 style={{margin: '0', padding: 0, fontWeight: 200, fontSize: '2rem'}}>Por tu seguridad, necesitamos asegurarnos de que eres tú quien solicita el préstamo</h2>
                <div style={{margin: '2rem 0'}}>
                    <small>Por favor ayúdanos a responder este breve cuestionario de seguridad</small>
                </div>
                {error ? 
                    <div className="questionnaire-container">
                        <p>Ocurrió un error en el servidor, intenta más tarde</p>
                    </div>
                    :
                    <>
                        <div className="questionnaire-container">
                            <ol>
                                {questionnaire.questions ? questionnaire.questions.map((question, qnIx) =>
                                <li key={question.idQuestion}>
                                    <div className='qn-question'>
                                        {question.questionText}
                                    </div>
                                    <div className='qn-answer'>
                                        <div className='input-div'>
                                            <div className='qns-inputs' onChange={e => handleAnswers(e, question.idQuestion, qnIx)}>
                                                {question.answers.map((bpoAnswer, ix) =>
                                                    <div style={{display: 'flex', alignItems: 'center'}} key={ix}><input style={{margin: '5px'}} type='radio' name={'answer' + qnIx + 'x' + bpoAnswer.idQuestion} value={bpoAnswer.idAnswer}/> <span style={{marginRight: '1rem'}}>{bpoAnswer.answerText}</span></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                )
                                :
                                <li style={{listStyleType: 'none'}}>
                                    <div className='qn-question'>
                                        Cargando... <BallClipRotate loading color='black'/>
                                    </div>
                                </li>
                                }
                            </ol>
                        </div>
                        <p onClick={handleSubmit} className='btn-minimal-width'>
                            {loading ? <BallBeat color={'#fff'} loading/> : 'INGRESAR'}
                        </p>
                        {answersError ? <div style={{color: 'red', marginTop: '1rem'}}><p>Debes responder todas las preguntas</p></div> : null}
                    </>
                }
            </div> 
    )
}

export default withRouter(Questionnaire)