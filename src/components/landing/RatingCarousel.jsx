import React from 'react'
import { ratings } from './ratedDB'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Slide } from './Slide'

export const RatingCarousel = () => {
    let settings = {
        dots: false,
        infinite: true,
        // autoplay: true,
        autoplaySpeed: 5000,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    return (
        <Slider {...settings}>
            {ratings.map((review, ix) => <Slide key={ix} {...review}/>)}
        </Slider>
    )
}