import React, { useState, useEffect } from 'react'
import contentful from '../../services/contentful'
import { BallClipRotate } from 'react-pure-loaders'
import marked from 'marked'

export const Article = ({match}) => {

    let [loading, setLoading] = useState(true)
    let [entry, setEntry] = useState({})
    let [text, setText] = useState(null)

    useEffect(() => {
        const fetchpost = () => {
            contentful.getEntries({
                order: '-sys.createdAt'
            })
            .then(ents => {
                ents.items.map(article => {
                    if(article.fields.url.toLowerCase() === match.params.article.toLowerCase()){
                        let markedText = marked(article.fields.text)
                        setText(markedText)
                        return setEntry({...article.fields})
                    }
                    return null
                })
                setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
        }
        fetchpost()
    }, [])
    console.log(entry)
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
                        {entry.relatedPosts.filter((_, ix) => ix < 3).map(relPost => {
                            return(
                                <div className='related-post'>
                                    <img src={relPost.fields.image.fields.file.url} alt="rel post"/>
                                    <p>{relPost.fields.title}</p>
                                </div>  
                            ) 
                        })}
                    </div>
                </div>
            }
        </div>
    )
}
