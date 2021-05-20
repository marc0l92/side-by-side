import React, { useState, useRef, DragEventHandler, WheelEventHandler, CSSProperties } from 'react'
import Note from './Note'
import './notesCanvas.css'

const ZOOM_CONFIG = {
    min: .3,
    max: 2.5,
    speed: .001,
    indicatorDuration: 1000,
}

const NotesCanvas: React.FC = () => {
    const [notes, setNotes] = useState([{
        id: 1,
        reference: true,
        text: "Initial text1",
        position: { x: 20, y: 20 },
    }, {
        id: 2,
        reference: false,
        text: "Initial text2",
        position: { x: 120, y: 80 },
    }
    ])
    const [zoom, setZoom] = useState({ x: 0, y: 0, value: 1 })
    const [zoomIndicator, setZoomIndicator] = useState({ hidden: true, timer: null })
    const notesCanvasRef = useRef()
    // const [position, setPosition] = useState({ x: 0, y: 0 })
    // let initialPosition = { x: 0, y: 0 };

    const allowDrop: DragEventHandler = (event) => {
        event.preventDefault();
    }
    // const drag: DragEventHandler = (event) => {
    //     console.log(event)
    //     event.preventDefault();
    // }
    const onDrop: DragEventHandler = (event) => {
        event.preventDefault();
        console.log(event)
        var data = event.dataTransfer.getData("Text")
        console.log(data)

        // setNotes([...notes, { text: data }])
    }
    // Zoom
    const onZoom: WheelEventHandler = (event) => {
        clearTimeout(zoomIndicator.timer)
        let newZoom = zoom.value - event.deltaY * ZOOM_CONFIG.speed
        newZoom = Math.min(Math.max(newZoom, ZOOM_CONFIG.min), ZOOM_CONFIG.max)
        if (newZoom !== zoom.value) {
            const canvasPosition = (notesCanvasRef.current as HTMLDivElement).getBoundingClientRect()
            const pointer = {
                x: (event.clientX - (event.target as HTMLDivElement).offsetLeft) - canvasPosition.x,
                y: (event.clientY - (event.target as HTMLDivElement).offsetTop) - canvasPosition.y,
            }
            const target = {
                x: (pointer.x - zoom.x) / zoom.value,
                y: (pointer.y - zoom.y) / zoom.value,
            }
            setZoom({
                x: - target.x * newZoom + pointer.x,
                y: - target.y * newZoom + pointer.y,
                value: newZoom,
            })
        }
        setZoomIndicator({
            hidden: false,
            timer: setTimeout(() => { setZoomIndicator({ ...zoomIndicator, hidden: true }) }, ZOOM_CONFIG.indicatorDuration),
        })
    }
    // Pan
    // const onPanStart: DragEventHandler = (event) => {
    //     if (event.button === 0 && event.buttons === 1) {
    //         event.preventDefault()
    //         initialPosition = { x: event.clientX, y: event.clientY }
    //         document.onmouseup = onPanEnd
    //         document.onmousemove = onMouseMove
    //     }
    // }
    // const onMouseMove = (event: any) => {
    //     setPosition({
    //         x: position.x + event.clientX - initialPosition.x,
    //         y: position.y + event.clientY - initialPosition.y
    //     })
    // }
    // const onPanEnd = (event: any) => {
    //     setPosition({
    //         x: position.x + event.clientX - initialPosition.x,
    //         y: position.y + event.clientY - initialPosition.y
    //     })
    //     document.onmousemove = null
    //     document.onmouseup = null
    // }
    const movingCanvasStyle: CSSProperties = {
        transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.value}, ${zoom.value})`,
    }
    return (
        <div className="notesColumn notesCanvas" ref={notesCanvasRef} onDrop={onDrop} onDragOver={allowDrop} onWheel={onZoom}>
            <div className="zoomPercentage" hidden={zoomIndicator.hidden}>{Math.round(zoom.value * 100)} %</div>
            <div className="movingCanvas debugBox5" style={movingCanvasStyle}>
                {notes.map((note) => (<Note key={note.id} data={note} />))}
            </div>
        </div>
    )
}

export default NotesCanvas;