import React from 'react'

export const Slide = ({review}) => {
    return (
        <div className='ekomi-container'>
            <div className='comment-ekomi'>{review}</div>
            <div className="rating-star"/>
        </div>
    )
}
