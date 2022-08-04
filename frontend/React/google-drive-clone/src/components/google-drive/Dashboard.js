import React from 'react'
import { Container } from 'react-bootstrap'
import AddFolderButton from './AddFolderButton'
import Navbar from './Navbar'
import { useFolder } from '../hooks/useFolder'
import Folder from './Folder'
import { useParams } from 'react-router-dom'
import FolderBreadcrumbs from './FolderBreadcrumbs'
import AddFileButton from './AddFileButton'

export default function Dashboard() {
    const { folderId } = useParams()
    const { folder, childFolders } = useFolder(folderId)

    return (
        <>
            <Navbar />
            <Container fluid>
                <div className='d-flex align-items-center'>
                    <FolderBreadcrumbs currentFolder={folder} />
                    <AddFileButton currentFolder={folder} />
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
