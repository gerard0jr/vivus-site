import React, {useState, useEffect} from 'react'
import MoveOption from './move-components/MoveOption'
import { requestExtension, getToken } from '../../../services/api'

const idProduct = 1

const Move = ({setFlux}) => {
    const [canMove, setCanMove] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [extensionData, setExtensionData] = useState({})
    const [notAllowedReasons, setNotAllowedReasons] = useState([])
    const [user, setUser] = useState({})

    const getData = async (user) => {
        let response = await getToken() 
        if(!response) return setServerError(true)
        let validToken = response.data.token
        const data = {
            idProduct,
            idCustomer: user.customerId,
            idAction: 1
        }
        requestExtension(data, validToken)
        .then(res => {
            const {data} = res
            if(data){
                if(data.continue){
                    // ALLOW EXTENSION
                    setExtensionData(data.details)
                    return setCanMove(true)
                }
                // DENY EXTENSION
                return setNotAllowedReasons(data.rejectReasons)
            }            

        })
    }

    useEffect(() => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        if(demoUser) return setUser(demoUser)
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(user){
            setUser(user)
            if(user.eMail === 'demo@demo.com') return
            getData(user)
        }
    }, [])

    let fillDemo = () => {
        setCanMove(true)
        setExtensionData({
            idDeferral: 1,
            oldDueDate: new Date(2020, 10, 10),
            oldLastDueDate: new Date(2020, 10, 20),
            extensionFee: 450,
            newDueDate: new Date(2020, 10, 12),
            newLastDueDate: new Date(2020, 10, 22),
            oxxoReference: 123456789
        })
    }

    return (
        <div className='move-container'>
            <div onClick={fillDemo} className="fill-demo">DEMO</div>
            {serverError ? 
                <div className='move-titles'>
                   <p style={{fontSize: '2.5rem'}}>Error en el servidor</p>
                </div>
                : canMove ? 
                <MoveOption user={user} extensionData={extensionData}/>
                :
                <div>
                    <div className='move-titles'>
                        <p style={{fontSize: '2.5rem'}}>Es un excelente beneficio</p>
                        <p className='move-medium-size bold-style'>Para recorrer la fecha de tu</p>
                        <p className='move-big-size bold-style'>parcialidad</p>
                        <p >Solo necesitas cumplir con los siguientes requisitos:</p>
                    </div>
                    <div className='move-requirements'>
                        <p className='move-number'>1</p>
                        <p>Haber pagado tu <strong className='green'>primer</strong><span className='green'> parcialidad</span></p>
                    </div>
                    <div className='move-requirements'>
                        <p className='move-number'>2</p>
                        <p>Tener tu parcialidad <strong className='green'>anterior pagada</strong>, es decir puedes gozar de este beneficio siempre y cuando tengas la parcialidad anterior cubierta.</p>
                    </div>
                    {
                        notAllowedReasons.length > 0 ?
                        notAllowedReasons.map(reason => 
                            <div key={reason.reason} className='check-requirement'>
                                <p>{reason.reason}</p>
                            </div>
                        )
                        :
                        <div className='check-requirement'>
                            <p>Cargando...</p>
                        </div>
                    }
                    {/* <div className='check-requirement'>
                        <p>No disponible</p>
                    </div> */}
                    {/* <p onClick={() => setFlux('default')} style={{textAlign: 'right', padding: '0 2rem', cursor: 'pointer', width: 'fit-content', margin: '0 auto'}} className='green'>Regresar a mi cuenta</p> */}
                </div>
            }
        </div>
    )
}

export default Move
