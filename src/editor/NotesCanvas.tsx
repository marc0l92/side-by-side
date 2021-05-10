import { hot } from 'react-hot-loader'
import React, { useState } from 'react'
import './notesCanvas.css'

const NotesCanvas = () => {
    const [notes, setNotes] = useState([])

    function allowDrop(event: any) {
        console.log(event)
        event.preventDefault();
    }
    function drag(event: any) {
        console.log(event)
        event.preventDefault();
    }
    function drop(event: any) {
        console.log(event)
        var data = event.dataTransfer.getData("Text")
        console.log(data)
        setNotes([...notes, data])
        event.preventDefault();
    }

    return (
        <div className="notesColumn notesCanvas debugBox3" onDrop={drop} onDragOver={allowDrop}>
            {notes}
            <div className="box noteBox" draggable="true" onDragStart={drag}>test</div>
        </div>
    )
}

export default hot(module)(NotesCanvas);