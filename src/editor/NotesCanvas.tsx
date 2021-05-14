import React, { useState, DragEventHandler } from 'react'
import Note from './Note'
import './notesCanvas.css'

const NotesCanvas: React.FC = () => {
    const [notes, setNotes] = useState([
        // <Note />,
        // <Note />,
    ])

    const allowDrop: DragEventHandler = (event) => {
        event.preventDefault();
    }
    // const drag: DragEventHandler = (event) => {
    //     console.log(event)
    //     event.preventDefault();
    // }
    const onDrop: DragEventHandler = (event) => {
        console.log(event)
        var data = event.dataTransfer.getData("Text")
        console.log(data)

        // setNotes([...notes, { text: data }])
        event.preventDefault();
    }

    return (
        <div className="notesColumn notesCanvas debugBox3" onDrop={onDrop} onDragOver={allowDrop}>
            {notes.map((component, index) => (<React.Fragment key={index}>
                {component}
            </React.Fragment>))}
            <Note />
        </div>
    )
}

export default NotesCanvas;