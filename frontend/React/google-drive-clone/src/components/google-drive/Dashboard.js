import React from 'react'
import { Container } from 'react-bootstrap'
import AddFolderButton from './AddFolderButton'
import Navbar from './Navbar'
import { useFolder } from '../hooks/useFolder'
import Folder from './Folder'
import { useParams, useLocation } from 'react-router-dom'
import FolderBreadcrumbs from './FolderBreadcrumbs'

export default function Dashboard() {
    const { folderId } = useParams()
    const { state = {} } = useLocation()
    const location = useLocation()
    console.log(`location : ${JSON.stringify(location)}`)
    const { folder, childFolders } = useFolder(folderId, state)
    console.log(state);

    return (
        <>
            <Navbar />
            <Container fluid>
                <div className='d-flex align-items-center'>
                    <FolderBreadcrumbs currentFolder={folder} />
                    <AddFolderButton currentFolder={folder} />
                </div>

                {childFolders.length > 0 && (
                    <div className="d-flex flex-wrap">
                        {childFolders.map(childFolder => (
                            <div key={childFolder.id} className="p-2" style={{ maxWidth: "250px" }}>
                                <Folder folder={childFolder} />
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </>



    )
}
