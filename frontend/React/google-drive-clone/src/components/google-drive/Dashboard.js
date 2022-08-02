import React from 'react'
import { Container } from 'react-bootstrap'
import AddFolderButton from './AddFolderButton'
import Navbar from './Navbar'
import { useFolder } from '../hooks/useFolder'
import Folder from './Folder'

export default function Dashboard() {
    const { folder, childFolders } = useFolder("HLGKyGWBAfiuD8H6V90W")
    console.log(childFolders);

    return (
        <>
            <Navbar />
            <Container fluid>
                <AddFolderButton currentFolder={folder} />
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
