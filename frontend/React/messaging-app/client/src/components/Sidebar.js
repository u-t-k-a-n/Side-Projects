import React, { useState } from 'react'
import { Button, Nav, Tab, Modal } from 'react-bootstrap'
import Contacts from './Contacts'
import Conversations from './Conversations'
import NewConversationModal from './NewConversationModal'
import NewContactModal from './NewContactModal'

const CONTACS_KEY = "contacts"
const CONVERSATIONS_KEY = "conversations"

export default function Sidebar({ id }) {
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY)
  const [modalOpen, setModalOpen] = useState(false)
  const conversationsOpen = activeKey === CONVERSATIONS_KEY

  function closeModal() {
    setModalOpen(false)
  }

  return (
    <div className='d-flex flex-column' style={{ width: "250px" }}>
      <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
        <Nav variant='tabs' className='justify-content-center'>
          <Nav.Item>
            <Nav.Link eventKey={CONVERSATIONS_KEY} >Conversations</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={CONTACS_KEY} >Contacs</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className='border-end overflow-auto flex-grow-1'>
          <Tab.Pane eventKey={CONVERSATIONS_KEY} >
            <Conversations />
          </Tab.Pane>
          <Tab.Pane eventKey={CONTACS_KEY}>
            <Contacts />
          </Tab.Pane>
        </Tab.Content>
        <div className='p-2 border-top border-end small'>
          Your Id: <span className='text-muted'>{id}</span>
        </div>
        <Button className='rounded-0' onClick={() => setModalOpen(true)}>
          New {conversationsOpen ? "Conversation" : "Contact"}
        </Button>
      </Tab.Container>
      <Modal show={modalOpen} onHide={closeModal}>
        {conversationsOpen
          ? <NewConversationModal closeModal={closeModal} />
          : <NewContactModal closeModal={closeModal} />}
      </Modal>
    </div>
  )
}
