import React, { useState, DragEventHandler } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

const Note: React.FC<INoteProp> = (props) => {
    const [text, setText] = useState(props.text)
    const [reference, setReference] = useState(props.reference)
    const [position, setPosition] = useState(props.position)
    const [absolutePosition, setAbsolutePosition] = useState({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)

    // ContentEditable
    const onContentChange = (event: ContentEditableEvent) => {
        // setText(prevState => ({ ...prevState, text: event.target.value }))
        setText(event.target.value)
    }
    // Drag and drop
    const onDragStartHandler: DragEventHandler = (event) => {
        console.log("onDragStartHandler", event)
        console.log(event.clientX, event.clientY)
        // document.body.style.cursor = "move"
        setAbsolutePosition({ x: event.clientX, y: event.clientY })
        setDragging(true)
    }
    const onDragEndHandler: DragEventHandler = (event) => {
        console.log("onDragEndHandler", event)
        console.log(event.clientX, event.clientY)
        setPosition({
            x: position.x + event.clientX - absolutePosition.x,
            y: position.y + event.clientY - absolutePosition.y
        })
        setDragging(false)
    }

    const noteStyle = {
        top: position.y + "px",
        left: position.x + "px",
        opacity: (dragging) ? '40%' : '100%',
    }
    return (
        <div className="note" draggable="true" onDragStart={onDragStartHandler} onDragEnd={onDragEndHandler} style={noteStyle}>
            <button className="reference" hidden={!reference}><i className="fas fa-caret-left"></i></button>
            <ContentEditable className="textArea" html={text} onChange={onContentChange} />
        </div>
    )
}

Note.defaultProps = {
    reference: true,
    text: "Initial text",
    position: { x: 20, y: 20 },
}

interface INoteProp {
    reference?: boolean,
    text?: string,
    position?: IPosition,
}
interface IPosition {
    x: number, y: number
}

export default Note;