import React, { useState, useEffect } from 'react'
import contentfulReq from '../../services/contentful'
import { BlogContent } from './BlogContent'
import './blog.scss'
import { BallClipRotate } from 'react-pure-loaders'

export const Blog = () => {

    const [entries, setEntries] = useState([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('')

    let drawContent = () => <BlogContent category={category} entries={entries}/>
    
    useEffect(() => {
        setLoading(true)
        contentfulReq.getEntries({
            limit: 20,
            order: '-sys.createdAt',
            query: category
        })
            .then(ents => {
                setEntries(ents.items.filter(item => item.fields.title))
                setLoading(false)
                drawContent()
            })
            .catch(err => {
                setLoading(false)
            })
    }, [category])

    return (
        <div className='app-container'>
            <div className='blog-sections'>
                <ul>
                    <li 
                        className={category === '' ? 'active-item-blog' : null} 
                        onClick={() => {setCategory(''); setEntries([])}}
                    >
                        Inicio
                    </li>
                    <li 
                        className={category.includes('Maneja-tus-Finanzas') ? 'active-item-blog' : null} 
                        onClick={() => setCategory('Maneja-tus-Finanzas')}
                    >
                        Maneja tus finanzas
                    </li>
                    <li 
                        className={category.includes('Vida-de-Hoy') ? 'active-item-blog' : null} 
                        onClick={() => setCategory('Vida-de-Hoy')}
                    >
                        Vida de hoy
                    </li>
                    <li 
                        className={category.includes('vivus-en-las-Noticias') ? 'active-item-blog' : null} 
                        onClick={() => setCategory('vivus-en-las-Noticias')}
                    >
                        Vivus en las noticias
                    </li>
                    <li 
                        className={category.includes('concursos') ? 'active-item-blog' : null} 
                        onClick={() => setCategory('xbox')}
                    >
                        Concursos
                    </li>
                </ul>
            </div>
            {loading || !entries.length ? 
                <BallClipRotate loading color={'#A3CD3A'}/>
                :
                <div className='blog-content'>
                    {drawContent()}
                </div>
            }
        </div>
    )
}
