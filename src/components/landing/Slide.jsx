import React from 'react'

export const Slide = ({review, key}) => {
    return (
        <div key={key} className='ekomi-container'>
            <div className='comment-ekomi'>{review}</div>
            <div className="rating-star"/>
        </div>
    )
}
