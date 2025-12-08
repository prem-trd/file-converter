
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
        margin: 10,
        startPage: 1,
        endPage: 0,
        format: 'Page {n} of {total}',
        fontSize: 12,
        font: 'Helvetica',
        color: '#000000',
    });
    const isGeneratingRef = useRef(false);

    const generatePagePreviews = useCallback(async (file, opts) => {
        if (isGeneratingRef.current) return;
        isGeneratingRef.current = true;
        setIsLoading(true);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const numPages = pdfDoc.getPageCount();

            const parsedOpts = {
                ...opts,
                margin: parseInt(opts.margin, 10) || 0,
                fontSize: parseInt(opts.fontSize, 10) || 12,
                startPage: parseInt(opts.startPage, 10) || 1,
                endPage: parseInt(opts.endPage, 10) || 0,
            };

            const effectiveEndPage = parsedOpts.endPage === 0 ? numPages : parsedOpts.endPage;

            const pagePromises = Array.from({ length: numPages }, (_, i) =>
                (async () => {
                    const newPdf = await PDFDocument.create();
                    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                    newPdf.addPage(copiedPage);

                    if (i + 1 >= parsedOpts.startPage && i + 1 <= effectiveEndPage) {
                        const tempPage = newPdf.getPage(0);
                        const { width, height } = tempPage.getSize();
                        const font = await newPdf.embedFont(StandardFonts[parsedOpts.font] || StandardFonts.Helvetica);
                        const text = parsedOpts.format.replace('{n}', i + 1).replace('{total}', numPages);
                        const textWidth = font.widthOfTextAtSize(text, parsedOpts.fontSize);

                        const positions = {
                            'top-left': { x: parsedOpts.margin, y: height - parsedOpts.fontSize - parsedOpts.margin },
                            'top-center': { x: (width - textWidth) / 2, y: height - parsedOpts.fontSize - parsedOpts.margin },
                            'top-right': { x: width - textWidth - parsedOpts.margin, y: height - parsedOpts.fontSize - parsedOpts.margin },
                            'bottom-left': { x: parsedOpts.margin, y: parsedOpts.margin },
                            'bottom-center': { x: (width - textWidth) / 2, y: parsedOpts.margin },
                            'bottom-right': { x: width - textWidth - parsedOpts.margin, y: parsedOpts.margin },
                        };

                        tempPage.drawText(text, {
                            ...positions[parsedOpts.position],
                            font,
                            size: parsedOpts.fontSize,
                            color: rgb(parseInt(parsedOpts.color.slice(1, 3), 16) / 255, parseInt(parsedOpts.color.slice(3, 5), 16) / 255, parseInt(parsedOpts.color.slice(5, 7), 16) / 255),
                        });
                    }

                    const dataUri = await newPdf.saveAsBase64({ dataUri: true });
                    return { id: `${file.name}-${i}`, preview: dataUri, originalIndex: i };
                })()
            );

            const pageData = await Promise.all(pagePromises);
            setPages(pageData);
        } catch (e) {
            console.error(e);
            setError("Could not read or render the PDF. It may be corrupted or protected.");
            setFile(null);
            setPages([]);
        } finally {
            isGeneratingRef.current = false;
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (file) {
            generatePagePreviews(file, options);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [file, options]);

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
        const { name, value, type, checked } = e.target;
        setOptions(prevOptions => ({ ...prevOptions, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleApplyNumbers = async () => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const numPages = pdfDoc.getPageCount();
            const font = await pdfDoc.embedFont(StandardFonts[options.font] || StandardFonts.Helvetica);

            const parsedOpts = {
                ...options,
                margin: parseInt(options.margin, 10) || 0,
                fontSize: parseInt(options.fontSize, 10) || 12,
                startPage: parseInt(options.startPage, 10) || 1,
                endPage: parseInt(options.endPage, 10) || 0,
            };

            const effectiveEndPage = parsedOpts.endPage === 0 ? numPages : parsedOpts.endPage;

            for (let i = parsedOpts.startPage - 1; i < effectiveEndPage; i++) {
                if (i < 0 || i >= numPages) continue;

                const page = pdfDoc.getPage(i);
                const { width, height } = page.getSize();
                const text = parsedOpts.format.replace('{n}', i + 1).replace('{total}', numPages);
                const textWidth = font.widthOfTextAtSize(text, parsedOpts.fontSize);

                const positions = {
                    'top-left': { x: parsedOpts.margin, y: height - parsedOpts.fontSize - parsedOpts.margin },
                    'top-center': { x: (width - textWidth) / 2, y: height - parsedOpts.fontSize - parsedOpts.margin },
                    'top-right': { x: width - textWidth - parsedOpts.margin, y: height - parsedOpts.fontSize - parsedOpts.margin },
                    'bottom-left': { x: parsedOpts.margin, y: parsedOpts.margin },
                    'bottom-center': { x: (width - textWidth) / 2, y: parsedOpts.margin },
                    'bottom-right': { x: width - textWidth - parsedOpts.margin, y: parsedOpts.margin },
                };

                page.drawText(text, {
                    ...positions[parsedOpts.position],
                    font,
                    size: parsedOpts.fontSize,
                    color: rgb(parseInt(parsedOpts.color.slice(1, 3), 16) / 255, parseInt(parsedOpts.color.slice(3, 5), 16) / 255, parseInt(parsedOpts.color.slice(5, 7), 16) / 255),
                });
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `numbered-${file.name}`;
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

    const fontOptions = Object.keys(StandardFonts).map(fontKey => (
        <option key={fontKey} value={fontKey}>{fontKey}</option>
    ));

    return (
        <div className="page-numbers-container">
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
                                {/* Form Groups... */}
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
                                    <Form.Label column sm={4}>Pages</Form.Label>
                                    <Col sm={4}>
                                        <Form.Control type="number" name="startPage" value={options.startPage} onChange={handleOptionsChange} min="1"/>
                                        <Form.Text>Start</Form.Text>
                                    </Col>
                                    <Col sm={4}>
                                        <Form.Control type="number" name="endPage" value={options.endPage} onChange={handleOptionsChange} min="0"/>
                                        <Form.Text>End (0=last)</Form.Text>
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
                                        {pages.map(page => (
                                            <div key={page.id} className="page-item">
                                                <img src={page.preview} alt={`Page ${page.originalIndex + 1}`} className="page-preview-img"/>
                                                <div className="page-number-indicator">{page.originalIndex + 1}</div>
                                            </div>
                                        ))}
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
