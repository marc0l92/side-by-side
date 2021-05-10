import { hot } from 'react-hot-loader'
import React from 'react'
import './editor.css'
import PdfViewer from './PdfViewer'
import NotesCanvas from './NotesCanvas'

const Editor = () => (
    <div className="containerFlex debugBox1">
        <div className="viewerColumn debugBox2">
            <PdfViewer />
        </div>
            <NotesCanvas />
    </div>);

export default hot(module)(Editor);