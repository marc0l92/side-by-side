import React, { useState, useRef, MouseEventHandler } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'

const Note: React.FC<INoteProp> = (props) => {
    const [text, setText] = useState(props.text)
    const [reference, setReference] = useState(props.reference)
    const [position, setPosition] = useState(props.position)
    const [moving, setMoving] = useState(false)
    const textAreaRef = useRef(null)
    let initialPosition: IPosition = { x: 0, y: 0 };

    // ContentEditable
    const onContentChange = (event: ContentEditableEvent) => {
        // setText(prevState => ({ ...prevState, text: event.target.value }))
        setText(event.target.value)
    }
    // Mouse down move
    const onMoveStart: MouseEventHandler = (event) => {
        if (event.button === 0 && event.buttons === 1) {
            event.preventDefault()
            initialPosition = { x: event.clientX, y: event.clientY }
            document.onmouseup = onMoveEnd
            document.onmousemove = onMouseMove
        }
    }
    const onMouseMove = (event: any) => {
        setMoving(true)
        textAreaRef.current.el.current.blur()
        setPosition({
            x: position.x + event.clientX - initialPosition.x,
            y: position.y + event.clientY - initialPosition.y
        })
    }
    const onMoveEnd = (event: any) => {
        setPosition({
            x: position.x + event.clientX - initialPosition.x,
            y: position.y + event.clientY - initialPosition.y
        })
        setMoving(false)
        document.onmousemove = null
        document.onmouseup = null
    }

    const noteStyle = {
        top: position.y + "px",
        left: position.x + "px",
        opacity: (moving) ? '50%' : '100%',
        cursor: (moving) ? 'move' : '',
    }
    const referenceStyle = {
        cursor: (moving) ? 'move' : '',
    }
    return (
        <div className="note" style={noteStyle} draggable="true" onDragStart={onMoveStart}>
            <button className="reference" style={referenceStyle} hidden={!reference}><i className="fas fa-caret-left"></i></button>
            <div className="reference" style={referenceStyle} hidden={reference}><i className="fas fa-grip-lines-vertical"></i></div>
            <ContentEditable ref={textAreaRef} className="textArea" html={text} onChange={onContentChange} />
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