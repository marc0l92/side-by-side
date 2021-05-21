import React, { useState, useRef, CSSProperties, WheelEventHandler } from 'react'
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/display/api'
import './pdfViewer.css'

import 'react-pdf/dist/umd/Page/AnnotationLayer.css';
import samplePDF from '../../static/sample.pdf'

const ZOOM_CONFIG = {
    min: 1.0,
    max: 2.5,
    speed: .001,
    indicatorDuration: 1000,
}

const Editor: React.FC<IProp> = ({ width }) => {
    const [numPages, setNumPages] = useState(null)
    const [zoom, setZoom] = useState({ x: 0, y: 0, scale: 1 })
    const pdfViewerRef = useRef()

    const onDocumentLoadSuccess = ({ numPages }: PDFDocumentProxy) => {
        setNumPages(numPages)
    }
    // Zoom
    const onZoom: WheelEventHandler = (event) => {
        if (event.ctrlKey) {
            let newScale = zoom.scale - event.deltaY * ZOOM_CONFIG.speed
            newScale = Math.min(Math.max(newScale, ZOOM_CONFIG.min), ZOOM_CONFIG.max)
            if (newScale !== zoom.scale) {

                const canvasPosition = (pdfViewerRef.current as HTMLDivElement).getBoundingClientRect()
                const pointer = {
                    x: event.clientX - canvasPosition.x,
                    // y: event.clientY - canvasPosition.y,
                }
                const target = {
                    x: (pointer.x - zoom.x) / zoom.scale,
                    // y: (pointer.y - zoom.y) / zoom.scale,
                }
                const position = {
                    x: - target.x * newScale + pointer.x,
                    // y: - target.y * newScale + pointer.y,
                }
                if (position.x > 0) position.x = 0
                if (position.x + width * newScale < width) position.x = -width * (newScale - 1)
                setZoom({
                    x: position.x,
                    y: 0,
                    scale: newScale,
                })
            }
        }
    }

    // Style
    const pdfViewerStyle: CSSProperties = {
        width: `calc(${width}px + var(--scrollbar-size))`,
    }
    const pdfMovingStyle: CSSProperties = {
        transform: `translate(${zoom.x}px, ${zoom.y}px) `,
    }
    return (
        <div className="viewerColumn pdfViewer" ref={pdfViewerRef} style={pdfViewerStyle} onWheel={onZoom}>
            <div style={pdfMovingStyle}>
                <Document
                    className="pdfDocument"
                    file={samplePDF}
                    onLoadSuccess={onDocumentLoadSuccess}
                    externalLinkTarget="_blank"
                >
                    {Array.from(
                        new Array(numPages),
                        (el, index) => (
                            <Page
                                key={`page_${index + 1}`}
                                className="pdfPage"
                                pageNumber={index + 1}
                                renderAnnotationLayer={true}
                                renderTextLayer={true}
                                width={width}
                                scale={zoom.scale}
                                renderMode="canvas"
                            />
                        ),
                    )}
                </Document>
            </div>
        </div>
    )
};

interface IProp {
    width: number,
}

export default Editor;