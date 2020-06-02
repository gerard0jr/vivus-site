import React, {useState, useEffect} from 'react'
import MoveOption from './move-components/MoveOption'

const Move = () => {
    const [user, setUser] = useState({})

    useEffect(() => {
        let demoUser = JSON.parse(sessionStorage.getItem('demoUser'))
        if(demoUser) return setUser(demoUser)
        let user = JSON.parse(sessionStorage.getItem('loggedUser'))
        if(user) setUser(user)
    }, [])

    return (
        <div className='move-container'>
            <MoveOption user={user}/>
        </div>
    )
}

export default Move
