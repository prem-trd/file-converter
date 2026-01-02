
import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Button, Spinner, Alert, Form, Row, Col } from 'react-bootstrap';
import { FaFilePdf, FaTrash } from 'react-icons/fa';
import './AddPageNumbers.css';

const AddPageNumbers = () => {
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState({
        position: 'bottom-center',
        margin: 5,
        format: 'Page {n} of {total}',
        fontSize: 12,
        font: 'Helvetica',
        color: '#000000',
    });

    const generatePagePreviews = useCallback(async (file) => {
        setIsLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const numPages = pdfDoc.getPageCount();

            const pagePromises = Array.from({ length: numPages }, async (_, i) => {
                const newPdf = await PDFDocument.create();
                const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                newPdf.addPage(copiedPage);
                const dataUri = await newPdf.saveAsBase64({ dataUri: true });
                return { id: `${file.name}-${i}`, preview: dataUri, originalIndex: i };
            });

            const pageData = await Promise.all(pagePromises);
            setPages(pageData);
        } catch (e) {
            console.error(e);
            setError("Could not read the PDF. It may be corrupted or protected.");
            setFile(null);
            setPages([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (file) {
            generatePagePreviews(file);
        }
    }, [file, generatePagePreviews]);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length === 0) return;
        const selectedFile = acceptedFiles[0];
        if (selectedFile.type !== 'application/pdf') {
            setError("Please upload a valid PDF file.");
            return;
        }
        setError(null);
        setPages([]);
        setFile(selectedFile);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

    const handleOptionsChange = (e) => {
        const { name, value } = e.target;
        setOptions(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyNumbers = async () => {
        if (!file) return;
        setIsLoading(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const numPages = pdfDoc.getPageCount();
            const font = await pdfDoc.embedFont(StandardFonts[options.font] || StandardFonts.Helvetica);

            for (let i = 0; i < numPages; i++) {
                const page = pdfDoc.getPage(i);
                const { width, height } = page.getSize();
                const text = options.format.replace('{n}', i + 1).replace('{total}', numPages);
                const textWidth = font.widthOfTextAtSize(text, parseInt(options.fontSize, 10));
                
                const margin = parseInt(options.margin, 10);
                const positions = {
                    'top-left': { x: margin, y: height - parseInt(options.fontSize, 10) - margin },
                    'top-center': { x: (width - textWidth) / 2, y: height - parseInt(options.fontSize, 10) - margin },
                    'top-right': { x: width - textWidth - margin, y: height - parseInt(options.fontSize, 10) - margin },
                    'bottom-left': { x: margin, y: margin },
                    'bottom-center': { x: (width - textWidth) / 2, y: margin },
                    'bottom-right': { x: width - textWidth - margin, y: margin },
                };

                page.drawText(text, {
                    ...positions[options.position],
                    font,
                    size: parseInt(options.fontSize, 10),
                    color: rgb(parseInt(options.color.slice(1, 3), 16) / 255, parseInt(options.color.slice(3, 5), 16) / 255, parseInt(options.color.slice(5, 7), 16) / 255),
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `add-page-numbers-smartconverter-${file.name}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
            removeFile();
        } catch (e) {
            console.error(e);
            setError("An error occurred while adding page numbers.");
        } finally {
            setIsLoading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPages([]);
        setError(null);
    };

    const getPreviewNumberStyle = () => {
        const style = {
            fontFamily: options.font.replace(/[^a-zA-Z]/g, ' '),
            fontSize: `${options.fontSize}px`,
            color: options.color,
            position: 'absolute',
        };
        const margin = `${options.margin}px`;

        switch (options.position) {
            case 'top-left':
                style.top = margin;
                style.left = margin;
                break;
            case 'top-center':
                style.top = margin;
                style.left = '50%';
                style.transform = 'translateX(-50%)';
                break;
            case 'top-right':
                style.top = margin;
                style.right = margin;
                break;
            case 'bottom-left':
                style.bottom = margin;
                style.left = margin;
                break;
            case 'bottom-right':
                style.bottom = margin;
                style.right = margin;
                break;
            default: // bottom-center
                style.bottom = margin;
                style.left = '50%';
                style.transform = 'translateX(-50%)';
                break;
        }
        return style;
    };

    const fontOptions = Object.keys(StandardFonts).map(fontKey => (
        <option key={fontKey} value={fontKey}>{fontKey}</option>
    ));

    return (
        <div className="page-numbers-container">
             <Helmet>
                <title>Add Page Numbers to PDF - Easily Number Your PDF Pages</title>
                <meta name="description" content="Easily add page numbers to your PDF documents online for free. Customize the position, format, font, and style of your page numbers with a live preview." />
                <link rel="canonical" href={`${window.location.origin}/add-page-numbers`} />
            </Helmet>
            <div className="page-numbers-header">
                <h1 className="page-numbers-title">Add Page Numbers to PDF</h1>
                <p className="page-numbers-description">Easily insert page numbers into your PDF file. Customize position, format, and more.</p>
            </div>

            <div className="page-numbers-content">
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                {!file ? (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFilePdf size={48} />
                            <p>Drag 'n' drop a PDF file here, or click to select a file</p>
                        </div>
                    </div>
                ) : (
                    <div className="page-numbers-main-area">
                        <div className="page-numbers-options-panel">
                            <h3 className="options-title">Page Number Options</h3>
                             <Form>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Position</Form.Label>
                                    <Col sm={8}>
                                        <Form.Select name="position" value={options.position} onChange={handleOptionsChange}>
                                            <option value="bottom-center">Bottom Center</option>
                                            <option value="bottom-left">Bottom Left</option>
                                            <option value="bottom-right">Bottom Right</option>
                                            <option value="top-center">Top Center</option>
                                            <option value="top-left">Top Left</option>
                                            <option value="top-right">Top Right</option>
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Format</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="text" name="format" value={options.format} onChange={handleOptionsChange} />
                                        <Form.Text>Use {"{n}"} for page number and {"{total}"} for total pages.</Form.Text>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Font Size</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="number" name="fontSize" value={options.fontSize} onChange={handleOptionsChange} min="6" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Font</Form.Label>
                                    <Col sm={8}>
                                        <Form.Select name="font" value={options.font} onChange={handleOptionsChange}>
                                            {fontOptions}
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm={4}>Color</Form.Label>
                                    <Col sm={8}>
                                        <Form.Control type="color" name="color" value={options.color} onChange={handleOptionsChange} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                     <Form.Label column sm={4}>Margin</Form.Label>
                                     <Col sm={8}>
                                         <Form.Control type="number" name="margin" value={options.margin} onChange={handleOptionsChange} min="0" />
                                     </Col>
                                 </Form.Group>
                            </Form>
                        </div>
                        <div className="page-numbers-preview-area">
                             <div className="page-numbers-file-info">
                                <span className="file-name">{file.name}</span>
                                <Button variant="link" onClick={removeFile} className="delete-button"><FaTrash /></Button>
                            </div>
                            <div className="page-numbers-grid-container">
                                {isLoading ? (
                                    <div className="spinner-container"><Spinner animation="border" /></div>
                                ) : (
                                    <div className="page-numbers-grid">
                                        {pages.map(page => {
                                            const pageNumber = page.originalIndex + 1;
                                            return (
                                                <div key={page.id} className="page-item">
                                                    <img src={page.preview} alt={`Page ${pageNumber}`} className="page-preview-img"/>
                                                    <div style={getPreviewNumberStyle()}>
                                                        {options.format.replace('{n}', pageNumber).replace('{total}', pages.length)}
                                                    </div>
                                                    {/* <div className="page-number-indicator">{pageNumber}</div> */}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            <div className="page-numbers-action-button">
                                <Button onClick={handleApplyNumbers} size="lg" disabled={isLoading}>
                                    {isLoading ? 'Processing...' : 'Add Page Numbers & Download'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddPageNumbers;
