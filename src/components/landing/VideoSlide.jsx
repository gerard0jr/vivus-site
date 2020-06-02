import React, { useState } from 'react'

export const VideoSlide = ({video}) => {

    let iframeUrl = `https://www.youtube.com/embed/${video}?rel=0&controls=1&autoplay=1`
    const imageUrl = `https://img.youtube.com/vi/${video}/maxresdefault.jpg`
    let [opened, setOpened] = useState(false)

    return (
        <div className="video-slide">
            { opened && 
                <div className="open-video">
                    <div onClick={() => setOpened(false)} className="button-close"></div>
                    <iframe
                    src={iframeUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                    title={`video ${video}`}
                    />
                </div>
            }
            <div onClick={() => setOpened(true)} className="full-thumb">
                <div className='button-open'>
                    <svg viewBox='0 0 100 100'>
                        <polygon points="30 25,30 75,80 50" className="triangle" />
                    </svg>
                </div>
                <img src={imageUrl} alt="fullthumb"/>
            </div>
        </div>
    )
}
