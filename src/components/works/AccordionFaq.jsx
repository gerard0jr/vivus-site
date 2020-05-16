import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export const AccordionFaq = ({question, answer}) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='accordion-container'>
            <div onClick={() => setOpen(!open)} className={open ? 'acc-title-open' : 'acc-title'}>
                <div className='acc-icon'>
                    {open ? <FontAwesomeIcon icon={faChevronDown}/> : <FontAwesomeIcon icon={faChevronRight}/>}
                </div>
                <div className='acc-question'>
                    {question}
                </div>
            </div> 
            <div className={open ? 'acc-content' : 'acc-content-collapsed'}>
                {answer}
            </div>
        </div>
    )
}
