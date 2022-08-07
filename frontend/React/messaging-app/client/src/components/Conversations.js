import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

export default function Conversations() {
  const { conversations, selectConversationIndex } = useConversations()

  return (
    <ListGroup>
      {conversations.map((conversation, index) => (
        <ListGroup.Item 
        key={index}
        active={conversation.selected}
        action
        onClick={() => {selectConversationIndex(index)}}
        >
          {conversation.recipients.map(recipient => recipient.name).join(', ')}
          </ListGroup.Item>
      ))}
    </ListGroup>
  )
}
