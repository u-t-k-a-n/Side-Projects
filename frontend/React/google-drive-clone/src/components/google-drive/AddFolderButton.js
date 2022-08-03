import React, { useState } from 'react'
import { Button, Modal, Form, ModalBody, ModalFooter, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';
import { database } from '../../firebase';
import { addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../hooks/useFolder';



export default function AddFolderButton({ currentFolder}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (currentFolder == null) return;

    const path = [...currentFolder.path]
    if (currentFolder !== ROOT_FOLDER){ 
      path.push({ id : currentFolder.id, name: currentFolder.name })
    }

    try {
      setError('');
      const docRef = await addDoc(database.folders, { name : name, 
        createdAt: database.getCurrentTimestamp(),  
        parentId : currentFolder.id,
        userId : currentUser.uid,
        path : path
      });
    }
    catch (error) {
      setError("Failed to add folder");
    }
    setName('');
    closeModal();
  }

  return (
    <>
      {error && <Alert variant="danger" className='text-center text-danger'>{error}</Alert>}
      <Button variant='outline-success' onClick={openModal} size="sm">
        <FontAwesomeIcon icon={faFolderPlus} />
      </Button>
      <Modal show={open} onHide={closeModal}>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <Form.Group >
              <Form.Label>Folder Name</Form.Label>
              <Form.Control
                type='text'
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
          </ModalBody>
          <ModalFooter >
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
            <Button variant="success" type="submit">
              Add Folder
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </>
  )
}
