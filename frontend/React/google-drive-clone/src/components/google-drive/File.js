import { faFolder } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function File({ file }) {
    return (
        <a href={file.url} target="_blank" className='btn btn-outline-dark text-truncate w-100'>
            <FontAwesomeIcon icon={faFolder} style={{ marginRight: ".45rem"}} />
            {file.name}
        </a>
    )
}
