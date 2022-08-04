import React from 'react'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { storage } from '../../firebase';
import { ref, uploadBytes } from "firebase/storage"
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../hooks/useFolder';

export default function AddFileButton({ currentFolder }) {
    const { currentUser } = useAuth();

    function handleUpload(e) {
        const file = e.target.files[0];
        if (currentFolder == null || file == null) return;

        const filePath =
            currentFolder === ROOT_FOLDER
                ? `${currentFolder.path.map(folder => folder.id).join('/')}/${file.name}}`  
                 // `${currentFolder.path.join('/')}/${file.name}`
                : `${currentFolder.path.map(folder => folder.id).join('/')}/${currentFolder.name}/${file.name}` 
                // `${currentFolder.path.join('/')}/${currentFolder.name}/${file.name}`;
console.log(currentFolder.name);
        const uploadTaskRef = ref(storage, `/files/${currentUser.uid}/${filePath}`);
        uploadBytes(uploadTaskRef, file)
        .then((snapshot) => {
            console.log(snapshot.metadata.fullPath);
        }    )

    }

    return (
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
    )
}
