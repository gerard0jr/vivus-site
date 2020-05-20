import React from 'react'
import { momentEs } from '../../services/moment'
import { Link } from 'react-router-dom'

export const BlogContent = ({section, entries}) => {

    console.log(momentEs(entries[0].fields.publishTime).format('DD/MM/YYYY'))

    return (
        <div>
            <div>
                {section === 0 ? 
                    <div className='big-blog-container'>
                        <Link to={{pathname: `/blog/${entries[0].fields.title.split(' ').join('-')}`, state: {id: entries[0].sys.id}}} style={{backgroundImage: `url(${entries[0].fields.image.fields.file.url})`}} className='left-blog-container'>
                            <div className='opacity-mask'></div>
                            <div className='absolute-text'>
                                <p className='entrie-date'>{momentEs(entries[0].fields.publishTime).format('DD/MM/YYYY')}</p>
                                <p className='entrie-title'>{entries[0].fields.title}</p>
                            </div>
                        </Link>
                        <div className='right-blog-container'>
                            <div className='text-blog-container'>
                                <p className='entrie-title'>{entries[1].fields.title}</p>
                                <p className='entrie-description'>{entries[1].fields.text}</p>
                                <p className='entrie-date'>{momentEs(entries[1].fields.publishTime).format('DD/MM/YYYY')}</p>
                            </div>
                            <div className='text-blog-container'>
                                <p className='entrie-title'>{entries[2].fields.title}</p>
                                <p className='entrie-description'>{entries[2].fields.text}</p>
                                <p className='entrie-date'>{momentEs(entries[2].fields.publishTime).format('DD/MM/YYYY')}</p>
                            </div>
                            <div className='text-blog-container'>
                                <p className='entrie-title'>{entries[3].fields.title}</p>
                                <p className='entrie-description'>{entries[3].fields.text}</p>
                                <p className='entrie-date'>{momentEs(entries[3].fields.publishTime).format('DD/MM/YYYY')}</p>
                            </div>
                        </div>
                    </div>
                : section === 1 ?
                <h2>Maneja tus finanzas</h2>
                : section === 2 ?
                <h2>Vida de hoy</h2>
                : section === 3 ?
                <h2>Noticias</h2>
                : section === 4 ?
                <h2>Concursos</h2>
                : null}
            </div>
            <h2>Lo más reciente</h2>
            <div className='entries-container'>
                {entries.filter((entrie, ix) => ix > 2).map((entrie, ix) => 
                    <div className='entrie' key={ix}>
                        <a href={`https://efectigo.firebaseapp.com/blog/${entrie.fields.url}`}>
                            <img src={entrie.fields.image.fields.file.url} alt="efectigo"/>
                            <div className='entrie-text'>
                                <p className='entrie-title'>{entrie.fields.title}</p>
                                <p className='entrie-date'>{momentEs(entrie.fields.publishTime).format('DD/MM/YYYY')}</p>
                            </div>
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
