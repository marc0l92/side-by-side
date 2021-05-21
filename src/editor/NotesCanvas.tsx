import React, { useState, useRef, DragEventHandler, WheelEventHandler, CSSProperties } from 'react'
import Note from './Note'
import { reducer, NOTES_ACTIONS } from '../models/notesState'
import './notesCanvas.css'

const ZOOM_CONFIG = {
    min: .3,
    max: 2.5,
    speed: .001,
    indicatorDuration: 1000,
}

const NotesCanvas: React.FC = () => {
    const [notesState, notesDispatch] = React.useReducer(reducer, {
        notes: [{
            id: '1',
            reference: true,
            text: "Initial text1",
            position: { x: 20, y: 20 },
            size: { x: 250, y: 30 },
        }, {
            id: '2',
            reference: false,
            text: "Initial text2",
            position: { x: 120, y: 80 },
            size: { x: 250, y: 30 },
        }]
    })
    const [zoom, setZoom] = useState({ x: 0, y: 0, scale: 1 })
    const [zoomIndicator, setZoomIndicator] = useState({ hidden: true, timer: null })
    const notesCanvasRef = useRef()
    const [smoothTransitions, setSmoothTransitions] = useState(false)
    let initialPosition = { x: 0, y: 0 };

    const allowDrop: DragEventHandler = (event) => {
        event.preventDefault();
    }
    // const drag: DragEventHandler = (event) => {
    //     console.log(event)
    //     event.preventDefault();
    // }
    const onDrop: DragEventHandler = (event) => {
        event.preventDefault();
        const canvasPosition = (notesCanvasRef.current as HTMLDivElement).getBoundingClientRect()
        notesDispatch({
            type: NOTES_ACTIONS.CREATE,
            payload: {
                text: event.dataTransfer.getData("Text"),
                reference: true,
                position: {
                    x: event.clientX - canvasPosition.x,
                    y: event.clientY - canvasPosition.y,
                }
            }
        })
    }
    // Zoom
    const onZoom: WheelEventHandler = (event) => {
        clearTimeout(zoomIndicator.timer)
        let newZoom = zoom.scale - event.deltaY * ZOOM_CONFIG.speed
        newZoom = Math.min(Math.max(newZoom, ZOOM_CONFIG.min), ZOOM_CONFIG.max)
        if (newZoom !== zoom.scale) {
            const canvasPosition = (notesCanvasRef.current as HTMLDivElement).getBoundingClientRect()
            const pointer = {
                x: event.clientX - canvasPosition.x,
                y: event.clientY - canvasPosition.y,
            }
            const target = {
                x: (pointer.x - zoom.x) / zoom.scale,
                y: (pointer.y - zoom.y) / zoom.scale,
            }
            setZoom({
                x: - target.x * newZoom + pointer.x,
                y: - target.y * newZoom + pointer.y,
                scale: newZoom,
            })
            setSmoothTransitions(true)
        }
        setZoomIndicator({
            hidden: false,
            timer: setTimeout(() => { setZoomIndicator({ ...zoomIndicator, hidden: true }) }, ZOOM_CONFIG.indicatorDuration),
        })
    }
    // Pan
    const onPanStart: DragEventHandler = (event) => {
        if ((event.target as HTMLDivElement).classList.contains('canPan') && event.button === 0 && event.buttons === 1) {
            event.preventDefault()
            initialPosition = { x: event.clientX, y: event.clientY }
            document.onmouseup = onPanEnd
            document.onmousemove = onMouseMove
            document.body.style.cursor = 'move'
        }
    }
    const onMouseMove = (event: any) => {
        setZoom({
            ...zoom,
            x: zoom.x + event.clientX - initialPosition.x,
            y: zoom.y + event.clientY - initialPosition.y,
        })
        setSmoothTransitions(false)
    }
    const onPanEnd = (event: any) => {
        setZoom({
            ...zoom,
            x: zoom.x + event.clientX - initialPosition.x,
            y: zoom.y + event.clientY - initialPosition.y,
        })
        setSmoothTransitions(false)
        document.onmousemove = null
        document.onmouseup = null
        document.body.style.cursor = ''
    }
    const movingCanvasStyle: CSSProperties = {
        transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale}, ${zoom.scale})`,
        transition: smoothTransitions ? 'transform .3s ease' : '',
    }
    return (
        <div className="notesColumn notesCanvas canPan" ref={notesCanvasRef} onDrop={onDrop} onDragOver={allowDrop} onWheel={onZoom} onDragStart={onPanStart} draggable="true">
            <div className="zoomPercentage" hidden={zoomIndicator.hidden}>{Math.round(zoom.scale * 100)} %</div>
            <div className="movingCanvas canPan" style={movingCanvasStyle}>
                {notesState.notes.map((note) => (<Note key={note.id} data={note} notesDispatch={notesDispatch} />))}
            </div>
        </div>
    )
}

export default NotesCanvas