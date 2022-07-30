import React, { useState } from 'react'
import { Button, Modal, Form, ModalBody, ModalFooter } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderPlus } from '@fortawesome/free-solid-svg-icons';



export default function AddFolderButton() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setName('');
    closeModal();
  }

  return (
    <>
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
