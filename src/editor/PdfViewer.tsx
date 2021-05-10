import { hot } from 'react-hot-loader'
import React, { useState } from 'react'
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/display/api'

// import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
import samplePDF from '../../static/sample.pdf'

const Editor = () => {
    const [numPages, setNumPages] = useState(null)

    function onDocumentLoadSuccess({ numPages }: PDFDocumentProxy) {
        setNumPages(numPages)
    }

    return (
        <Document file={samplePDF} onLoadSuccess={onDocumentLoadSuccess} >
            {Array.from(
                new Array(numPages),
                (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        renderAnnotationLayer={false}
                    />
                ),
            )}
        </Document>
    )
};

export default hot(module)(Editor);