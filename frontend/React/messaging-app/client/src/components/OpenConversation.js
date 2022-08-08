import React, { useState, useCallback } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useConversations } from '../contexts/ConversationsProvider'

export default function OpenConversation() {
    const [text, setText] = useState("")
    const { sendMessage, selectedConversation } = useConversations()
    const setRef = useCallback(node => {
        if (node) {
            node.scrollIntoView({ behavior: "smooth" })
        }
    }, [])

    function handleSubmit(e) {
        e.preventDefault()
        sendMessage(
            selectedConversation.recipients.map(recipient => recipient.id),
            text
        )
        setText("")
    }

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='flex-grow-1 overflow-auto'>
                <div className='d-flex flex-column justify-content-end align-items-start px-3'>
                    {selectedConversation.messages.map((message, index) => {
                        const lastMessage = selectedConversation.messages.length - 1 === index

                        return (
                            <div
                                ref={lastMessage ? setRef : null}
                                key={index}
                                className={`my-1 d-flex flex-column ${message.fromMe ? 'align-self-end' : ''}`}
                            >
                                <div
                                    className={`rounded px-2 py-1 ${message.fromMe
                                        ? 'bg-primary text-white'
                                        : 'border'}`}
                                >
                                    {message.text}
                                </div>
                                <div
                                    className={`text-muted small ${message.fromMe ? 'text-right' : 'text-left'}`}
                                >
                                    {message.fromMe ? "You" : message.sender}
                                </div>
                            </div>
                        )

                    })
                    }
                </div>
            </div>
            <Form className='m-2' onSubmit={handleSubmit}>
                <Form.Group >
                    <InputGroup >
                        <Form.Control
                            as="textarea"
                            required
                            value={text}
                            onChange={e => setText(e.target.value)}
                            style={{ resize: "none", height: "75px" }}
                        />
                        <Button type="submit">Send</Button>
                    </InputGroup>
                </Form.Group>
            </Form>

        </div>
    )
}
