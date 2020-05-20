import React, { useState } from 'react'
import { VideoSlide } from './VideoSlide'

export const VideoCarousel = () => {
    const videos = [
        '6vO8DVeo1Pw',
        'L3aikWiWZns',
        '8TF4QW58Lag',
        'IjsbLalhGVA'
    ]
    const [currentVideo, setCurrentVideo] = useState(1)
    return (
        <div className="video-wrapper">
            {
                currentVideo === 1 ?
                    <VideoSlide video={videos[0]}/>
                : currentVideo === 2 ?
                    <VideoSlide video={videos[1]}/>
                : currentVideo === 3 ?
                    <VideoSlide video={videos[2]}/>
                :
                    <VideoSlide video={videos[3]}/>
            }
            <div className="thumbnails">
                <div onClick={() => setCurrentVideo(1)} className={`thumb ${currentVideo === 1 && 'video-active'}`}>
                    <img src={`https://img.youtube.com/vi/${videos[0]}/mqdefault.jpg`} alt={currentVideo}/>
                </div>
                <div onClick={() => setCurrentVideo(2)} className={`thumb ${currentVideo === 2 && 'video-active'}`}>
                    <img src={`https://img.youtube.com/vi/${videos[1]}/mqdefault.jpg`} alt={currentVideo}/>
                </div>
                <div onClick={() => setCurrentVideo(3)} className={`thumb ${currentVideo === 3 && 'video-active'}`}>
                    <img src={`https://img.youtube.com/vi/${videos[2]}/mqdefault.jpg`} alt={currentVideo}/>
                </div>
                <div onClick={() => setCurrentVideo(4)} className={`thumb ${currentVideo === 4 && 'video-active'}`}>
                    <img src={`https://img.youtube.com/vi/${videos[3]}/mqdefault.jpg`} alt={currentVideo}/>
                </div>
            </div>
        </div>
    )
}
