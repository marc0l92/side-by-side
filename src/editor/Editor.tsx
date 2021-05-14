import { hot } from 'react-hot-loader'
import React from 'react'
import './editor.css'
import PdfViewer from './PdfViewer'
import NotesCanvas from './NotesCanvas'

const Editor: React.FC = () => (
    <div className="containerFlex">
        <PdfViewer />
        <NotesCanvas />
    </div>);

export default hot(module)(Editor);