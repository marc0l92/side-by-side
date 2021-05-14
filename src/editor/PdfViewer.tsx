import React, { useState } from 'react'
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/display/api'

// import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
import samplePDF from '../../static/sample.pdf'

const Editor: React.FC = () => {
    const [numPages, setNumPages] = useState(null)

    const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
        setNumPages(numPages)
    }

    return (
        <div className="viewerColumn debugBox2">
            <Document file={samplePDF} onLoadSuccess={onDocumentLoadSuccess}>
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
        </div>
    )
};

export default Editor;