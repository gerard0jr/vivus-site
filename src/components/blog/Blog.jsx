import React, { useState, useEffect } from 'react'
import contentfulReq from '../../services/contentful'
import { BlogContent } from './BlogContent'
import './blog.scss'
import { BallClipRotate } from 'react-pure-loaders'

export const Blog = () => {

    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [section, setSection] = useState(0)

    useEffect(() => {
        contentfulReq.getEntries({
            limit: 20,
            order: '-sys.createdAt'
        })
            .then(ents => {
                console.log(ents)
                setEntries(ents.items)
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
                console.log(err)
            })
    }, [])

    return (
        <div className='app-container'>
            <div className='blog-sections'>
                <ul>
                    <li className={section === 0 ? 'active-item-blog' : null} onClick={() => setSection(0)}>Inicio</li>
                    <li className={section === 1 ? 'active-item-blog' : null} onClick={() => setSection(1)}>Maneja tus finanzas</li>
                    <li className={section === 2 ? 'active-item-blog' : null} onClick={() => setSection(2)}>Vida de hoy</li>
                    <li className={section === 3 ? 'active-item-blog' : null} onClick={() => setSection(3)}>Vivus en las noticias</li>
                    <li className={section === 4 ? 'active-item-blog' : null} onClick={() => setSection(4)}>Concursos</li>
                </ul>
            </div>
            {loading ? 
                <BallClipRotate loading color={'#A3CD3A'}/>
                :
                <div className='blog-content'>
                    {section === 0 ?
                        <BlogContent section={section} entries={entries}/>
                        :
                        null
                    }
                </div>
            }
        </div>
    )
}
