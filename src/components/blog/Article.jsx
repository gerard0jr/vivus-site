import React, { useState, useEffect } from 'react'
import contentful from '../../services/contentful'
import { BallClipRotate } from 'react-pure-loaders'
import marked from 'marked'
import { Link } from 'react-router-dom'

export const Article = ({match}) => {

    let [loading, setLoading] = useState(true)
    let [entry, setEntry] = useState({
        image: {fields: {file: {url: ''}}},
        relatedPosts: [],
        tags: []
    })
    let [text, setText] = useState(null)
    let [lastest, setLastest] = useState({
        items: []
    })

    let scrollToTop = () => {
        window.scrollTo(0,0)
    }

    useEffect(() => {
        const fetchpost = () => {
            contentful.getEntries({
                order: '-sys.createdAt',
                query: match.params.article
            })
            .then(res => {
                let article = res.items[0]
                let markedText = marked(article.fields.text)
                setText(markedText)
                setLoading(false)
                return setEntry({...article.fields})
            })
            .catch(err => {
                setLoading(false)
            })
        }
        fetchpost()
    }, [match])

    useEffect(() => {
        contentful.getEntries({
            limit: 3,
            order: '-sys.createdAt'
        })
            .then(ents => {
                setLastest(ents)
            })
            .catch(err => {
                setLastest([])
            })
    }, [])

    return (
        <div className='app-container'>
            {
                loading ? 
                    <div style={{position: 'relative', height: '40vh', width: '100vw'}}>
                        <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
                            <BallClipRotate loading color='#A7CE3A'/>
                        </div>
                    </div>
                : 
                <div className='article-container'>
                    <div className="article">
                        <div style={{backgroundImage: `linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0), rgba(255,255,255,0.1), rgba(255,255,255,0.7)), url(${entry.image.fields.file.url})`}} className="article-image"></div>
                        <h2>{entry.title}</h2>
                        <div className="article-content" dangerouslySetInnerHTML={{__html: text}}/>
                    </div>
                    <div className="related-box">
                        <h3>Artículos relacionados:</h3>
                        {
                            entry.relatedPosts ? 
                                entry.relatedPosts.filter((_, ix) => ix < 3).map(relPost => {
                                    return(
                                        <Link onClick={scrollToTop} to={`/blog/${relPost.fields.url}`} key={relPost.fields.title} className='related-post'>
                                            <img src={relPost.fields.image.fields.file.url} alt="rel post"/>
                                            <p>{relPost.fields.title}</p>
                                        </Link>  
                                    ) 
                                })
                            :
                            <p className='no-related'>No hay artículos relacionados</p>
                        }
                        <div className="categories-container">
                            <p>Tags:</p>
                            {
                                entry.tags ? 
                                    entry.tags.map((tag, ix)=>{
                                        return(
                                            <div key={ix} className="category">
                                                {tag.fields.name}
                                            </div>
                                        )
                                    })
                                :
                                    <div className="category">
                                        No hay tags
                                    </div>
                            }
                        </div>
                        <div className="lastest-posts">
                            <h3>Últimos:</h3>
                            {lastest.items.filter(item => item.fields.title).map(lastPost => {
                                return (
                                    <Link onClick={scrollToTop} to={`/blog/${lastPost.fields.url}`} key={lastPost.fields.title} className='related-post'>
                                        <img src={lastPost.fields.image.fields.file.url} alt="rel post"/>
                                        <p>{lastPost.fields.title}</p>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
