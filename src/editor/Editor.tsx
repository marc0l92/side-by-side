import { hot } from 'react-hot-loader'
import React, { DragEventHandler, CSSProperties, useState } from 'react'
import './editor.css'
import PdfViewer from './PdfViewer'
import NotesCanvas from './NotesCanvas'

const Editor: React.FC = () => {
    const [pdfViewerWidth, setPdfViewerWidth] = useState(600)
    let initialPosition = { x: 0, y: 0 };

    const onResizeStart: DragEventHandler = (event) => {
        if (event.button === 0 && event.buttons === 1) {
            event.preventDefault()
            initialPosition = { x: event.clientX, y: event.clientY }
            document.onmouseup = onMoveEnd
            document.onmousemove = onMouseMove
        }
    }
    const onMouseMove = (event: any) => {
        setPdfViewerWidth(pdfViewerWidth + event.clientX - initialPosition.x)
    }
    const onMoveEnd = (event: any) => {
        setPdfViewerWidth(pdfViewerWidth + event.clientX - initialPosition.x)
        document.onmousemove = null
        document.onmouseup = null
    }

    return (
        <div className="editor">
            <PdfViewer width={pdfViewerWidth} />
            <div className="resizeHandle" draggable="true" onDragStart={onResizeStart} />
            <NotesCanvas />
        </div>)
}

export default hot(module)(Editor);