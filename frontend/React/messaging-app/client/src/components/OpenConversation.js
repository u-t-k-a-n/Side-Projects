import React, { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'

export default function OpenConversation() {
    const [text, setText] = useState("")

    return (
        <div className='d-flex flex-column flex-grow-1'>
            <div className='flex-grow-1 overflow-auto'>

            </div>
            <Form className='m-2'>
                <Form.Group >
                    <InputGroup >
                        <Form.Control
                            as="textarea"
                            required
                            value={text}
                            onChange={e => setText(e.target.value)}
                            style={{ resize: "none", height: "75px" }}
                        />
                        <InputGroup.Append>

                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </Form>

        </div>
    )
}
