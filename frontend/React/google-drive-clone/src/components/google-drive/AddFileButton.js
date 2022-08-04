import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { storage, database } from '../../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../hooks/useFolder';
import { addDoc, where, query, getDocs, onSnapshot } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { Toast, ProgressBar } from 'react-bootstrap';


export default function AddFileButton({ currentFolder }) {
    const { currentUser } = useAuth();
    const [uploadingFiles, setUploadingFiles] = useState([]);

    function handleUpload(e) {
        const file = e.target.files[0];
        if (currentFolder == null || file == null) return;

        const id = uuidv4()
        setUploadingFiles(prevUploadingFiles => [
            ...prevUploadingFiles,
            { id: id, name: file.name, progress: 0, error: false }
        ]);

        const filePath =
            currentFolder === ROOT_FOLDER
                ? `${currentFolder.path.map(folder => folder.name).join('/')}/${file.name}`
                : `${currentFolder.path.map(folder => folder.name).join('/')}/${currentFolder.name}/${file.name}`

        const uploadTaskRef = ref(storage, `/files/${currentUser.uid}/${filePath}`);
        const uploadTask = uploadBytesResumable(uploadTaskRef, file)

        uploadTask.on('state_changed', (snapshot) => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes
            setUploadingFiles(prevUploadingFiles => {
                return prevUploadingFiles.map(uploadingFile => {
                    if (uploadingFile.id === id) {
                        return { ...uploadingFile, progress: progress }
                    }
                    return uploadingFile
                })
            })

        },
            () => {
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.map(uploadingFile => {
                        if (uploadingFile.id === id) {
                            return { ...uploadingFile, error: true }
                        }
                        return uploadingFile
                    })
                })
            },
            () => {
                setUploadingFiles(prevUploadingFiles => {
                    return prevUploadingFiles.filter(uploadingFile => {
                        return uploadingFile.id !== id
                    })
                })
                getDownloadURL(uploadTask.snapshot.ref).then(url => {
                    const q = query(database.files,
                        where('name', '==', file.name),
                        where('userId', '==', currentUser.uid),
                        where("folderId", "==", currentFolder.id)
                    )

                    return onSnapshot(q, (existingFiles) => {
                        const existingFile = existingFiles.docs[0]
                        if (!existingFile) {
                            try {
                                const docRef = addDoc(database.files, {
                                    name: file.name,
                                    createdAt: database.getCurrentTimestamp(),
                                    url: url,
                                    userId: currentUser.uid,
                                    folderId: currentFolder.id,
                                });
                            }
                            catch { }
                        }
                    })

                })
            });
    }

    return (
        <>
            <label
                className='btn btn-outline-success btn-sm m-2 '
            >
                <FontAwesomeIcon icon={faFileUpload} />
                <input
                    type='file'
                    onChange={handleUpload}
                    style={{ opacity: 0, position: 'absolute', left: "-9999px" }}
                />
            </label>
            {uploadingFiles.length > 0 &&
                ReactDOM.createPortal(
                    <div
                        style={{
                            position: 'absolute',
                            bottom: "1rem",
                            right: "1rem",
                            maxWidth: "250px"
                        }}
                    >
                        {uploadingFiles.map(file => (
                            <Toast key={file.id} onClose={() => {
                                setUploadingFiles(prevUploadingFiles => {
                                    return prevUploadingFiles.filter(uploadingFile => {
                                        return uploadingFile.id !== file.id
                                    })
                                })
                            }}>
                                <Toast.Header
                                    className='text-truncate w-100 '
                                    closeButton={file.error}
                                >
                                    <strong
                                        className='text-truncate w-100'
                                    >
                                        {file.name}
                                    </strong>
                                </Toast.Header>
                                <Toast.Body>
                                    <ProgressBar
                                        variant={file.error ? "danger" : "primary"}
                                        animated={!file.error}
                                        now={file.error ? 100 : file.progress * 100}
                                        label={
                                            file.error
                                                ? "Error"
                                                : `${Math.round(file.progress * 100)}%`
                                        }
                                    />
                                </Toast.Body>
                            </Toast>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    )
}
