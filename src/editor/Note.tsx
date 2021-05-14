import React, { useState, useRef, MouseEventHandler, CSSProperties } from 'react'
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable'
// import ReactMarkdown from 'react-markdown'
// import gfm from 'remark-gfm'

const Note: React.FC<INoteProp> = (props) => {
    const [text, setText] = useState(props.text)
    const [reference, setReference] = useState(props.reference)
    const [position, setPosition] = useState(props.position)
    let [size, setSize] = useState({ x: 250, y: 30 })
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

    // Resize div
    const onResizeStart: MouseEventHandler = (event) => {
        console.log("onResizeStart")
        if (event.button === 0 && event.buttons === 1) {
            event.preventDefault()
            initialPosition = { x: event.clientX, y: event.clientY }
            document.onmouseup = onResizeEnd
            document.onmousemove = onResizeMove
            if (size.x < 0) {
                console.log(textAreaRef.current)
                console.log(textAreaRef.current.getBoundingClientRect())
                size = { x: textAreaRef.current.el.current.style.width, y: 0 }
                setSize({ x: textAreaRef.current.el.current.style.width, y: 0 })
            }
        }
    }
    const onResizeMove = (event: any) => {
        console.log("onResizeMove")
        setSize({
            x: size.x + event.clientX - initialPosition.x,
            y: size.y + event.clientY - initialPosition.y
        })
    }
    const onResizeEnd = (event: any) => {
        console.log("onResizeEnd")
        setSize({
            x: size.x + event.clientX - initialPosition.x,
            y: size.y + event.clientY - initialPosition.y
        })
        document.onmousemove = null
        document.onmouseup = null
    }
    const onResetSize: MouseEventHandler = (event) => {
        setSize({
            x: -1,
            y: 0
        })
    }

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
    const markdown = `A paragraph with *emphasis* and **strong importance**.`
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