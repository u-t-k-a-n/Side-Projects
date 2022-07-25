import React, { useState } from 'react'
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import { Controlled as ControlledEditor } from 'react-codemirror2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompressAlt, faExpandAlt } from '@fortawesome/free-solid-svg-icons';

export default function Editor(props) {
    const {
        language,
        displayName,
        value,
        onChange
    }
        = props;

    const [open, setOpen] = useState(true);

    function handleChange(editor, data, value) {
        onChange(value);
    }

    return (
        <div className={`editor-container ${open ? "" : "collapsed"}`}>
            <div className='editor-title'>
                {displayName}
                <button
                    className='expand-collapse-button'
                    type='button'
                    onClick={() => setOpen(prevOpen => !prevOpen)}
                >
                    <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
                </button>
            </div>
            <ControlledEditor
                value={value}
                onBeforeChange={handleChange}
                className='code-mirror-wrapper'
                options={{
                    lineWrapping: true,
                    mode: language,
                    lint: true,
                    lineNumbers: true,
                    theme: "material"
                }}
            />
        </div>
    )
}
