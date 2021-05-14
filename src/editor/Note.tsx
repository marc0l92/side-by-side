import React, { useState, DragEventHandler } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

const Note: React.FC<INoteProp> = (props) => {
    const [text, setText] = useState(props.text)
    const [reference, setReference] = useState(props.reference)

    const onDragStartHandler: DragEventHandler = (event) => {
        console.log("onDragStartHandler", event)
    }
    const onContentChange = (event: ContentEditableEvent) => {
        // setText(prevState => ({ ...prevState, text: event.target.value }))
        setText(event.target.value)
    }

    return (
        <div className="note" draggable="true" onDragStart={onDragStartHandler}>
            <button className="reference" hidden={!reference}><i className="fas fa-caret-left"></i></button>
            <ContentEditable className="textArea" html={text} onChange={onContentChange} />
        </div>
    )
}

Note.defaultProps = {
    reference: true,
    text: "Initial text",
}

interface INoteProp {
    reference?: boolean,
    text?: string,
}

export default Note;