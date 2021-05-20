import React, { useState, useRef, MouseEventHandler, DragEventHandler, CSSProperties } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
import { NOTES_ACTIONS, INote, INoteAction } from '../models/notesState'
// import ReactMarkdown from 'react-markdown'
// import gfm from 'remark-gfm'

const Note: React.FC<INoteProp> = ({ data, notesDispatch }) => {
    const { id, reference, position, text, size } = data
    const [moving, setMoving] = useState(false)
    const textAreaRef = useRef(null)
    let initialPosition = { x: 0, y: 0 };

    // ContentEditable
    const onContentChange = (event: ContentEditableEvent) => {
        // setText(event.target.value)
        notesDispatch({ type: NOTES_ACTIONS.EDIT, payload: { id: id, text: event.target.value } })
    }
    // Move note
    const onMoveStart: DragEventHandler = (event) => {
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
        notesDispatch({
            type: NOTES_ACTIONS.EDIT,
            payload: {
                id: id,
                position: {
                    x: position.x + event.clientX - initialPosition.x,
                    y: position.y + event.clientY - initialPosition.y,
                }
            }
        })
    }
    const onMoveEnd = (event: any) => {
        notesDispatch({
            type: NOTES_ACTIONS.EDIT,
            payload: {
                id: id,
                position: {
                    x: position.x + event.clientX - initialPosition.x,
                    y: position.y + event.clientY - initialPosition.y,
                }
            }
        })
        setMoving(false)
        document.onmousemove = null
        document.onmouseup = null
    }
    // Resize note
    const onResizeStart: DragEventHandler = (event) => {
        if (event.button === 0 && event.buttons === 1) {
            event.preventDefault()
            initialPosition = { x: event.clientX, y: event.clientY }
            document.onmouseup = onResizeEnd
            document.onmousemove = onResizeMove
        }
    }
    const onResizeMove = (event: any) => {
        notesDispatch({
            type: NOTES_ACTIONS.EDIT,
            payload: {
                id: id,
                size: {
                    x: position.x + event.clientX - initialPosition.x,
                    y: position.y + event.clientY - initialPosition.y,
                }
            }
        })
    }
    const onResizeEnd = (event: any) => {
        notesDispatch({
            type: NOTES_ACTIONS.EDIT,
            payload: {
                id: id,
                size: {
                    x: position.x + event.clientX - initialPosition.x,
                    y: position.y + event.clientY - initialPosition.y,
                }
            }
        })
        document.onmousemove = null
        document.onmouseup = null
    }
    const onResetSize: MouseEventHandler = (event) => {
        notesDispatch({
            type: NOTES_ACTIONS.EDIT,
            payload: {
                id: id,
                size: { x: -1, y: 0 }
            }
        })
    }

    // Style
    const noteStyle: CSSProperties = {
        top: position.y + 'px',
        left: position.x + 'px',
        opacity: (moving) ? '50%' : '100%',
        cursor: (moving) ? 'move' : '',
    }
    const referenceStyle: CSSProperties = {
        cursor: (moving) ? 'move' : '',
    }
    const textAreaStyle: CSSProperties = {
        width: (size.x >= 0) ? (size.x + 'px') : '',
        minHeight: size.y + 'px',
    }
    const resizeHandleClass: string = "resizeHandle" + ((size.x >= 0) ? ' fixed' : '')
    return (
        <div className="note" style={noteStyle}>
            <button className="reference" style={referenceStyle} hidden={!reference} draggable="true" onDragStart={onMoveStart}><i className="fas fa-caret-left" /></button>
            {/* <div className="reference" style={referenceStyle} hidden={reference} draggable="true" onDragStart={onMoveStart}><i className="fas fa-grip-lines-vertical" /></div> */}
            <div>
                <div className="moveHandle" draggable="true" onDragStart={onMoveStart}><div /></div>
                <ContentEditable ref={textAreaRef} className="textArea" style={textAreaStyle} html={text} onChange={onContentChange} />
                {/* <ReactMarkdown remarkPlugins={[gfm]} children={text} /> */}
            </div>
            <button className={resizeHandleClass} draggable="true" onDragStart={onResizeStart} onDoubleClick={onResetSize}><i className="fas fa-angle-right fa-2x" /></button>
        </div>
    )
}

interface INoteProp {
    data: INote,
    notesDispatch: React.Dispatch<INoteAction>,
}

export default Note;