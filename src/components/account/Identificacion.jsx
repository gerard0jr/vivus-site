import React, { useState, useEffect } from 'react'
import './newStyles.scss'
import { withRouter } from 'react-router-dom'
import { getToken, getFile, uploadFile, getStatus, getAnalytics } from '../../services/api'
import TagManager from 'react-gtm-module'

const idProduct = 1

const Identificacion = (props) => {

    const [cargadoAnverso, setCargadoAnverso] = useState(false)
    const [cargadoReverso, setCargadoReverso] = useState(false)
    const [cargadoNomina, setCargadoNomina] = useState(false)
    const [cargadoSelfie, setCargadoSelfie] = useState(false)
    const [loading, setLoading] = useState(true)
    const [loading1, setLoading1] = useState(true)
    const [loading2, setLoading2] = useState(true)
    const [loading3, setLoading3] = useState(true)
    const [user, setUser] = useState(null)
    const [fileSizeError, setFileSizeError] = useState(false)
    const [token, setToken] = useState(null)
    const [serverError, setServerError] = useState(false)

    const handleFileAnverso = e => {
        setLoading(true)
        let file = e.target.files[0]
        if(file.size > 10000000) return setFileSizeError(true)
        let extension = file.type.replace('image/','')
        let reader = new FileReader()
        reader.onprogress = e => {setLoading(true)}
        reader.onload = e => {
            const finalString = e.target.result.replace(`data:image/${extension};base64,`,'')
            const data = {
                idProduct,
                idCustomer: user.customerId,
                idDocument: 27,
                fileName: file.name,
                fileExtension: extension,
                fileContent: finalString
            }    
            uploadFile(data, token)
                .then(res => {
                    if(res.status === 200){
                        setLoading(false)
                        return setCargadoAnverso(true)
                    }
                    return setServerError(true)
                })
                .catch(err => setLoading(false))
        }
        reader.readAsDataURL(file)

    }
    const handleFileReverso = e => {
        setLoading1(true)
        let file = e.target.files[0]
        if(file.size > 10000000) return setFileSizeError(true)
        let extension = file.type.replace('image/','')
        let reader = new FileReader()
        reader.onprogress = e => {setLoading1(true)}
        reader.onload = e => {
            const finalString = e.target.result.replace(`data:image/${extension};base64,`,'')
            const data = {
                idProduct,
                idCustomer: user.customerId,
                idDocument: 30,
                fileName: file.name,
                fileExtension: file.type.replace('image/',''),
                fileContent: finalString
            }    
            uploadFile(data, token)
                .then(res => {
                    if(res.status === 200){
                        setLoading1(false)
                        return setCargadoReverso(true)
                    }
                    return setServerError(true)
                })
                .catch(err => setLoading1(false))
        }
        reader.readAsDataURL(file)

    }
    const handleFileNomina = e => {
        setLoading2(true)
        let file = e.target.files[0]
        if(file.size > 10000000) return setFileSizeError(true)
        let extension = file.type.replace('image/','')
        let reader = new FileReader()
        reader.onprogress = e => {setLoading2(true)}
        reader.onload = e => {
            const finalString = e.target.result.replace(`data:image/${extension};base64,`,'')
            const data = {
                idProduct,
                idCustomer: user.customerId,
                idDocument: 28,
                fileName: file.name,
                fileExtension: file.type.replace('image/',''),
                fileContent: finalString
            }    
            uploadFile(data, token)
                .then(res => {
                    if(res.status === 200){
                        setLoading2(false)
                        return setCargadoNomina(true)
                    }
                    return setServerError(true)
                })
                .catch(err => setLoading2(false))
        }
        reader.readAsDataURL(file)

    }

    const handleFileSelfie = e => {
        setLoading3(true)
        let file = e.target.files[0]
        if(file.size > 10000000) return setFileSizeError(true)
        let extension = file.type.replace('image/','')
        let reader = new FileReader()
        reader.onprogress = e => {setLoading3(true)}
        reader.onload = e => {
            const finalString = e.target.result.replace(`data:image/${extension};base64,`,'')
            const data = {
                idProduct,
                idCustomer: user.customerId,
                idDocument: 39,
                fileName: file.name,
                fileExtension: file.type.replace('image/',''),
                fileContent: finalString
            }    
            uploadFile(data, token)
                .then(res => {
                    if(res.status === 200){
                        setLoading3(false)
                        return setCargadoSelfie(true)
                    }
                    return setServerError(true)
                })
                .catch(err => setLoading3(false))
            
        }
        reader.readAsDataURL(file)

    }

    const askToken = async () => {
        let response = await getToken()
        if(!response) return
        setToken(response.data.token)
    }

    useEffect(() => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        if(demoUser) return
        const checkFile = async (idCustomer) => {
            let response = await getToken()
            if(!response) return
            let validToken = response.data.token
            const dataAnverso = {
                idProduct,
                idCustomer,
                idDocument: 27
            }
            const dataReverso = {
                idProduct,
                idCustomer,
                idDocument: 30
            }
            const dataNomina = {
                idProduct,
                idCustomer,
                idDocument: 28
            }
            const dataSelfie = {
                idProduct,
                idCustomer,
                idDocument: 39
            }
            getFile(dataAnverso, validToken)
                .then(res => {
                    if(res.status === 200){
                        setCargadoAnverso(true)
                        return setLoading(false)
                    }
                    setLoading(false)
                })
                .catch(err => console.log(err))
            getFile(dataReverso, validToken)
                .then(res => {
                    if(res.status === 200){
                        setCargadoReverso(true)
                        return setLoading1(false)
                    }
                    setLoading1(false)
                })
                .catch(err => console.log(err))
            getFile(dataNomina, validToken)
                .then(res => {
                    if(res.status === 200){
                        setCargadoNomina(true)
                        return setLoading2(false)
                    }
                    setLoading2(false)
                })
                .catch(err => console.log(err))
            getFile(dataSelfie, validToken)
                .then(res => {
                    if(res.status === 200){
                        setCargadoSelfie(true)
                        return setLoading3(false)
                    }
                    setLoading3(false)
                })
                .catch(err => console.log(err))
        }
        const checkUser = async (user) => {
            let response = await getToken()
            if(!response) return
            let validToken = response.data.token
            getStatus(idProduct, user.customerId, false, validToken)
                .then(res =>{
                    if(res.status && res.data.idStatus === 1){
                        if(res.data.idSubStatus === 219){
                            setCargadoAnverso(true)
                            setCargadoNomina(true)
                            return setCargadoReverso(true)
                        }
                    }
                    if(res.status && res.data.idStatus === 4){
                        // return props.history.push('/denied')
                    }
                    if(res.status && res.data.idStatus === 6){
                        return props.history.push('/application-complete')
                    }
                    if(res.status && res.data.idStatus === 7){
                        return props.history.push('/dashboard/welcome')
                    }
                })
                //TAG MANAGER
                getAnalytics({idCustomer: user.customerId, idProduct}, validToken)
                .then(analytics => {
                    if(analytics.data){
                        const tagManagerArgs = {
                            dataLayer: {
                                event: 'pageChange',
                                page: {
                                    url: '/dashboard/id',
                                    referrer: sessionStorage.getItem('utm') || '/'
                                },
                                client: {
                                    hFN: analytics.data.hFN,
                                    hLN: analytics.data.hLN,
                                    hTN: analytics.data.hTN,
                                    hMA: analytics.data.hMA,
                                    dateOfBirth: analytics.data.dateOfBirth,
                                    returningClient: analytics.data.returningClient,
                                    identifiedBy: analytics.data.identifiedBy,
                                    registeredBy: analytics.data.registeredBy
                                },
                                loans: {
                                    loansCount: analytics.data.loansCount
                                },
                                lastest_loan: {
                                    status: analytics.data.status,
                                    id: analytics.data.id,
                                    repaymentDate: analytics.data.repaymentDate
                                },
                                application: {
                                    id: analytics.data.application.id
                                }
                            },
                            dataLayerName: 'dataLayer'
                        }
                        TagManager.dataLayer(tagManagerArgs)
                    }
                })
                //TAG MANAGER
            }
        let approved = sessionStorage.getItem('APP')
        // if(approved === 'no') return props.history.push('/denied')
        let getUser = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(!getUser){
            let emptyCustomer = JSON.parse(sessionStorage.getItem('empty-customer'))
            setUser(emptyCustomer)
            checkUser(getUser)
            checkFile(emptyCustomer.customerId)
            return
        }
        setUser(getUser)
        checkUser(getUser)
        if(getUser.customerId){
            checkFile(getUser.customerId)
            return
        }
        checkFile(getUser.idCustomer)
        return
    }, [])

    useEffect(() => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        if(demoUser) return setUser(demoUser)
        askToken()
        return
        // let getToken = cookie.load('token')
        // if(!getToken) return props.history.push('/login')
        // setToken(getToken)
    }, [])

    let fillDemo = () => {
        setLoading(false)
        setLoading1(false)
        setLoading2(false)
        setLoading3(false)
        setCargadoAnverso(true)
        setCargadoNomina(true)
        setCargadoReverso(true)
        setCargadoSelfie(true)
    }

    return (
        <div className='app-container'>
            <div onClick={fillDemo} className="fill-demo">DEMO</div>
            <div className='id-container'>
                <div className="id-top-container">
                    <div className='top-instructions'>
                        <div className={cargadoAnverso && cargadoReverso && cargadoSelfie && cargadoNomina ? 'document-uploaded' : null}>
                            <h2>{cargadoAnverso && cargadoReverso && cargadoSelfie && cargadoNomina ? 'Estamos revisando tu' : 'Necesitamos tu'}</h2>
                            <h3><strong>{cargadoAnverso && cargadoReverso && cargadoSelfie && cargadoNomina ? 'Solicitud' : 'identificación oficial'}</strong></h3>
                        </div>
                        <p>¡Finalmente solo necesitamos tu identificación oficial y comprobante de ingresos!</p>
                        <br/>
                        <p>Tu identificación debe encontrarse vigente y tu comprobante de ingreso puede ser tu último recibo de nómina timbrado por el SAT, un estado de cuenta bancario o tu última declaración de impuestos. Tan pronto los recibamos completos, en tan solo unos minutos recibirás el depósito de tu préstamo.</p>
                        <h5 style={{fontSize: '1rem'}}>Por favor lee detalladamente las instrucciones para enviarnos tu identificación:</h5>
                    </div>
                    <div className='instructions'>
                        <div className='ife-description'>
                            <p><strong>Credencial de elector (Frente y reverso)</strong></p>
                            <div className='ife-container'>
                                <img src='https://www.altonivel.com.mx/wp-content/uploads/2018/09/credencial-elector-ine.png' alt="ife"/>
                                <div className='ife-content'>
                                    <p>Para subir tu credencial de elector considera lo siguiente:</p>
                                    <ul>
                                        <li>Tu credencial debe estar vigente ante el INE</li>
                                        <li>Que los bordes y esquinas de la credencial sean totalmente visibles</li>
                                        <li>Que la foto de la credencial sea del documento original en color (no blanco y negro)</li>
                                        <li>Que la credencial no cuente con modificaciones o alteraciones físicas</li>
                                        <li>Que toda la información sea legible</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className='ife-description'>
                            <p><strong>Selfie</strong></p>
                            <div className='ife-container'>
                                <div className='ife-content'>
                                    <p>Para subir tu selfie considera lo siguiente:</p>
                                    <ul>
                                        <li>La foto debe ser actual</li>
                                        <li>A color y sin uso de filtros</li>
                                        <li>Indispensable que el formato de tu fotografía sea PNG o JPG</li>
                                        <li>Con rostro completo desde barbilla, sin anteojos ni gorras</li>
                                    </ul>
                                </div>
                                <img src='/img/selfie.jpg' alt="selfie"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='upload-container'>
                    <div className='upload-section'>
                        <p className='upload-title'><strong>Carga tus documentos en línea</strong></p>
                        <div className='upload-description'>
                            <div>
                                <img src="/img/import-file.png" alt="online"/>
                            </div>
                            <p>Las imágenes pueden ser capturadas con la cámara del celular. Tamaño máximo del archivo: 5MB / Formatos: JPG, PNG o cualquier otro formato de imagen (No PDF)</p>
                        </div>
                        <p>¡Este es el método más rápido</p>
                        <div  className='buttons-wrapper'style={{margin: '1rem 0'}}>
                            <input onChange={handleFileAnverso} style={{display: 'none'}} type="file" accept="image/*" name="userIDAnverso" id="userIDAnverso"/>
                            <input onChange={handleFileReverso} style={{display: 'none'}} type="file" accept="image/*" name="userIDReverso" id="userIDReverso"/>
                            <input onChange={handleFileNomina} style={{display: 'none'}} type="file" accept="image/*" name="userIDNomina" id="userIDNomina"/>
                            <input onChange={handleFileSelfie} style={{display: 'none'}} type="file" accept="image/png, image/jpeg" name="userIDSelfie" id="userIDSelfie"/>
                            <div>
                                <div className='button-wrapper-id'>
                                    <p style={cargadoAnverso ? {backgroundColor: '#88CF00'} : null} onClick={() => document.getElementById('userIDAnverso').click()} className='btn-minimal-width' disabled={cargadoAnverso}>{loading ? 'CARGANDO...' : cargadoAnverso ? 'ANVERSO CARGADO' : 'CARGAR ANVERSO'}</p>
                                </div>
                                <div className='button-wrapper-id'>
                                    <p style={cargadoReverso ? {backgroundColor: '#88CF00'} : null} onClick={() => document.getElementById('userIDReverso').click()} className='btn-minimal-width' disabled={cargadoReverso}>{loading1 ? 'CARGANDO...' : cargadoReverso ? 'REVERSO CARGADO' : 'CARGAR REVERSO'}</p>
                                </div>
                            </div>
                            <div>
                                <div className='button-wrapper-id'>
                                    <p style={cargadoNomina ? {backgroundColor: '#88CF00'} : null} onClick={() => document.getElementById('userIDNomina').click()} className='btn-minimal-width' disabled={cargadoNomina}>{loading2 ? 'CARGANDO...' : cargadoNomina ? 'COMPROBANTE DE INGRESOS CARGADO' : 'CARGAR COMPROBANTE DE INGRESOS'}</p>
                                </div>    
                                <div className='button-wrapper-id'>
                                    <p style={cargadoSelfie ? {backgroundColor: '#88CF00'} : null} onClick={() => document.getElementById('userIDSelfie').click()} className='btn-minimal-width' disabled={cargadoSelfie}>{loading3 ? 'CARGANDO...' : cargadoSelfie ? 'SELFIE CARGADA' : 'CARGAR SELFIE'}</p>
                                </div>    
                            </div>
                        </div>
                        {fileSizeError ? <div style={{margin: '1rem 0'}}>
                            <small style={{color: 'red'}}>El archivo no debe pesar más de 10MB</small>
                        </div> : null}
                        {serverError ? <div style={{margin: '1rem 0'}}>
                            <small style={{color: 'red'}}>Error en el servidor, intenta nuevamente</small>
                        </div> : null}
                    </div>
                    <div className='upload-section'>
                        <p className='upload-title'><strong>Enviar por correo</strong> </p>
                        <div className='upload-description'>
                            <div>
                                <img src="/img/mail-account.png" alt='email'/>
                            </div>
                            <div>
                                <p>Envíanos tus documentos a la siguiente dirección <a href="mailto:documentos@Vivus.com.mx">documentos@Vivus.com.mx</a></p>
                                <br/>
                                <p>Este método podría tomar más tiempo que cargar las imágenes</p>
                            </div>
                        </div>
                        <div style={{margin: '1rem 0'}}>
                            <p className='btn-minimal-width' style={{backgroundColor: 'white', outline: '1px solid #A3CD3A', color: '#A3CD3A', margin: '1rem 0'}}>ENVIARÉ MIS DOCUMENTOS</p>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <p>Por favor asegúrate de enviarnos tus documentos.</p>
                            <p>No podremos procesar tu solicitud sin ellos.</p>
                        </div>
                    </div>
                    {cargadoAnverso && cargadoReverso && cargadoSelfie && cargadoNomina ? 
                        <div className='help-banner'>
                            <h2>¿Necesitas ayuda?</h2>
                            <h4>Mándanos un WhatsApp</h4>
                        </div>
                        :
                        null
                    }
                </div>
            </div>
        </div>
    )
}

export default withRouter(Identificacion)
