
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { PDFDocument, rgb, degrees, StandardFonts, BlendMode } from 'pdf-lib';
import { Button, Spinner, Alert, Form, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { FaFilePdf, FaTrash, FaImage, FaFont } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { checkConversionLimit, incrementConversionCount } from '../../utils/conversionLimiter.jsx';
import './AddWatermarkPdf.css';

const AddWatermarkPdf = () => {
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();
    const [watermarkType, setWatermarkType] = useState('text');
    const [textOptions, setTextOptions] = useState({
        text: 'CONFIDENTIAL',
        font: 'Helvetica-Bold',
        fontSize: 30,
        color: '#ff0000',
        opacity: 0.5,
        position: 'center',
        rotation: -45,
        tiling: 'single', // single or tiled
        rows: 3,
        cols: 3,
    });
    const [imageFile, setImageFile] = useState(null);
    const [imageOptions, setImageOptions] = useState({
        opacity: 0.5,
        position: 'center',
        scale: 1,
    });

    const isGeneratingRef = useRef(false);

    // Debounce preview generation
    useEffect(() => {
        if (!file) return;
        const handler = setTimeout(() => {
            generatePreviews();
        }, 500);
        return () => clearTimeout(handler);
    }, [file, watermarkType, textOptions, imageFile, imageOptions]);


    const generatePreviews = useCallback(async () => {
        if (!file || isGeneratingRef.current) return;
        isGeneratingRef.current = true;
        setIsLoading(true);

        try {
            const pdfBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const numPages = pdfDoc.getPageCount();
            let watermarkImage = null;

            if (watermarkType === 'image' && imageFile) {
                const imageBuffer = await imageFile.arrayBuffer();
                if (imageFile.type === 'image/png') {
                    watermarkImage = await pdfDoc.embedPng(imageBuffer);
                } else {
                    watermarkImage = await pdfDoc.embedJpg(imageBuffer);
                }
            }

            const pagePromises = Array.from({ length: numPages }, (_, i) =>
                (async () => {
                    const newPdf = await PDFDocument.create();
                    const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
                    newPdf.addPage(copiedPage);
                    const page = newPdf.getPage(0);
                    const { width, height } = page.getSize();

                    if (watermarkType === 'text' && textOptions.text) {
                        const font = await newPdf.embedFont(StandardFonts[textOptions.font] || StandardFonts.Helvetica);
                        const textWidth = font.widthOfTextAtSize(textOptions.text, textOptions.fontSize);
                        const textHeight = font.heightAtSize(textOptions.fontSize);
                        const positions = getWatermarkPositions(width, height, textWidth, textHeight, textOptions.tiling, textOptions.position, 20, textOptions.rows, textOptions.cols);

                        for (const pos of positions) {
                            page.drawText(textOptions.text, {
                                x: pos.x,
                                y: pos.y,
                                font,
                                size: textOptions.fontSize,
                                color: hexToRgb(textOptions.color),
                                opacity: textOptions.opacity,
                                rotate: degrees(textOptions.rotation),
                                blendMode: BlendMode.Multiply,
                            });
                        }
                    } else if (watermarkImage) {
                        const imgWidth = watermarkImage.width * imageOptions.scale;
                        const imgHeight = watermarkImage.height * imageOptions.scale;
                        const positions = getWatermarkPositions(width, height, imgWidth, imgHeight, 'single', imageOptions.position, 20, 1, 1);

                        page.drawImage(watermarkImage, {
                            x: positions[0].x,
                            y: positions[0].y,
                            width: imgWidth,
                            height: imgHeight,
                            opacity: imageOptions.opacity,
                            blendMode: BlendMode.Multiply,
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
            setError("Could not process the PDF. It may be corrupted, protected, or the image format may not be supported.");
        } finally {
            isGeneratingRef.current = false;
            setIsLoading(false);
        }
    }, [file, watermarkType, textOptions, imageFile, imageOptions]);

    const onPdfDrop = useCallback(acceptedFiles => {
        if (!currentUser && checkConversionLimit()) {
            setError("You have reached your daily conversion limit. Please sign up for unlimited conversions.");
            return;
        }
        if (acceptedFiles.length > 0) {
            setError(null);
            setPages([]);
            setFile(acceptedFiles[0]);
        }
    }, [currentUser]);

    const onImageDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            setImageFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps } = useDropzone({ onDrop: onPdfDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });
    const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({ onDrop: onImageDrop, accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] }, maxFiles: 1 });

    const handleTextOptionsChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = e.target.type === 'number' ? parseFloat(value) : value;
        setTextOptions(prev => ({ ...prev, [name]: parsedValue }));
    };

    const handleImageOptionsChange = (e) => {
        const { name, value } = e.target;
        setImageOptions(prev => ({ ...prev, [name]: parseFloat(value) }));
    };

    const handleApplyWatermark = async () => {
        if (!file) return;

        if (!currentUser) {
            incrementConversionCount();
        }

        setIsLoading(true);

        try {
            const pdfBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBuffer);
            const pagesOfDoc = pdfDoc.getPages();
            let watermarkImage = null;

            if (watermarkType === 'image' && imageFile) {
                const imageBuffer = await imageFile.arrayBuffer();
                if (imageFile.type === 'image/png') {
                    watermarkImage = await pdfDoc.embedPng(imageBuffer);
                } else {
                    watermarkImage = await pdfDoc.embedJpg(imageBuffer);
                }
            }

            for (const page of pagesOfDoc) {
                const { width, height } = page.getSize();

                if (watermarkType === 'text' && textOptions.text) {
                    const font = await pdfDoc.embedFont(StandardFonts[textOptions.font] || StandardFonts.Helvetica);
                    const textWidth = font.widthOfTextAtSize(textOptions.text, textOptions.fontSize);
                    const textHeight = font.heightAtSize(textOptions.fontSize);
                    const positions = getWatermarkPositions(width, height, textWidth, textHeight, textOptions.tiling, textOptions.position, 20, textOptions.rows, textOptions.cols);

                    for (const pos of positions) {
                        page.drawText(textOptions.text, {
                            x: pos.x, y: pos.y, font, size: textOptions.fontSize,
                            color: hexToRgb(textOptions.color), opacity: textOptions.opacity, rotate: degrees(textOptions.rotation),
                            blendMode: BlendMode.Multiply,
                        });
                    }
                } else if (watermarkImage) {
                    const imgWidth = watermarkImage.width * imageOptions.scale;
                    const imgHeight = watermarkImage.height * imageOptions.scale;
                    const positions = getWatermarkPositions(width, height, imgWidth, imgHeight, 'single', imageOptions.position, 20, 1, 1);

                    page.drawImage(watermarkImage, {
                        x: positions[0].x, y: positions[0].y, width: imgWidth, height: imgHeight, opacity: imageOptions.opacity,
                        blendMode: BlendMode.Multiply,
                    });
                }
            }

            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `add-watermark-smartconverter-${file.name}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(link.href);
            removeFile();
        } catch (e) {
            console.error(e);
            setError("Failed to apply watermark.");
        } finally {
            setIsLoading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
        setPages([]);
        setError(null);
        setImageFile(null);
    };

    const fontOptions = Object.keys(StandardFonts).map(fontKey => (
        <option key={fontKey} value={fontKey}>{fontKey}</option>
    ));

    return (
        <div className="watermark-container">
            <Helmet>
                <title>Add Watermark to PDF - Online PDF Watermarking Tool</title>
                <meta name="description" content="Easily add a text or image watermark to your PDF files. Customize the font, color, opacity, and position of your watermark. Free and secure." />
                <link rel="canonical" href={`${window.location.origin}/add-watermark-pdf`} />
            </Helmet>
            <div className="watermark-header">
                <h1 className='watermark-title'>Add Watermark to PDF</h1>
                <p className='watermark-description'>Apply a text or image watermark to your PDF files with customizable options.</p>
            </div>

            <div className="watermark-content">
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                {!file ? (
                    <div {...getPdfRootProps({ className: 'dropzone' })}>
                        <input {...getPdfInputProps()} />
                        <div className="dropzone-content">
                            <FaFilePdf size={48} />
                            <p>Drag and drop a PDF file here, or click to select a file</p>
                        </div>
                    </div>
                ) : (
                    <div className="watermark-main-area">
                        <div className="watermark-options-panel">
                            <Tabs activeKey={watermarkType} onSelect={(k) => setWatermarkType(k)} className="mb-3" justify>
                                <Tab eventKey="text" title={<><FaFont /> Text</>}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Watermark Text</Form.Label>
                                        <Form.Control type="text" name="text" value={textOptions.text} onChange={handleTextOptionsChange} />
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm={6}>Font Size</Form.Label>
                                        <Col sm={6}><Form.Control type="number" name="fontSize" value={textOptions.fontSize} onChange={handleTextOptionsChange} min="6" /></Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm={4}>Pattern</Form.Label>
                                        <Col sm={8}>
                                            <Form.Select name="tiling" value={textOptions.tiling} onChange={handleTextOptionsChange}>
                                                <option value="single">Single</option>
                                                <option value="tiled">Tiled</option>
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>

                                    {textOptions.tiling === 'tiled' && (
                                        <>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm={6}>Rows</Form.Label>
                                                <Col sm={6}><Form.Control type="number" name="rows" value={textOptions.rows} onChange={handleTextOptionsChange} min="1" max="20" /></Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm={6}>Columns</Form.Label>
                                                <Col sm={6}><Form.Control type="number" name="cols" value={textOptions.cols} onChange={handleTextOptionsChange} min="1" max="20" /></Col>
                                            </Form.Group>
                                        </>
                                    )}
                                </Tab>
                                <Tab eventKey="image" title={<><FaImage /> Image</>}>
                                    <div {...getImageRootProps({ className: 'image-dropzone mb-3' })}>
                                        <input {...getImageInputProps()} />
                                        {imageFile ? <img src={URL.createObjectURL(imageFile)} alt="Watermark Preview" className="image-preview" /> : <p>Drop watermark image here</p>}
                                    </div>
                                </Tab>
                            </Tabs>
                        </div>

                        <div className="watermark-preview-area">
                            <div className="watermark-file-info">
                                <span className="file-name">{file.name}</span>
                                <Button variant="link" onClick={removeFile} className="delete-button"><FaTrash /></Button>
                            </div>
                            <div className="watermark-grid-container">
                                {isLoading ? <div className="spinner-container"><Spinner animation="border" /></div> : (
                                    <div className="watermark-grid">
                                        {pages.map(p => (
                                            <div key={p.id} className="page-item"><img src={p.preview} alt={`Page ${p.originalIndex + 1}`} className="page-preview-img" /></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="watermark-action-button">
                                <Button onClick={handleApplyWatermark} disabled={isLoading || !file} size="lg">
                                    {isLoading ? 'Applying Watermark...' : 'Add Watermark & Download'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
};

const getWatermarkPositions = (pageW, pageH, elW, elH, tiling, position, margin, rows, cols) => {
    if (tiling === 'tiled') {
        const positions = [];
        const numCols = cols || 3;
        const numRows = rows || 3;
        const colWidth = pageW / numCols;
        const rowHeight = pageH / numRows;
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                positions.push({ x: j * colWidth + (colWidth - elW) / 2, y: i * rowHeight + (rowHeight - elH) / 2 });
            }
        }
        return positions;
    }
    // Single position logic
    const pos = { x: 0, y: 0 };
    switch (position) {
        case 'top-left': pos.x = margin; pos.y = pageH - elH - margin; break;
        case 'top-center': pos.x = (pageW - elW) / 2; pos.y = pageH - elH - margin; break;
        case 'top-right': pos.x = pageW - elW - margin; pos.y = pageH - elH - margin; break;
        case 'middle-left': pos.x = margin; pos.y = (pageH - elH) / 2; break;
        case 'center': pos.x = (pageW - elW) / 2; pos.y = (pageH - elH) / 2; break;
        case 'middle-right': pos.x = pageW - elW - margin; pos.y = (pageH - elH) / 2; break;
        case 'bottom-left': pos.x = margin; pos.y = margin; break;
        case 'bottom-center': pos.x = (pageW - elW) / 2; pos.y = margin; break;
        case 'bottom-right': pos.x = pageW - elW - margin; pos.y = margin; break;
        default: pos.x = (pageW - elW) / 2; pos.y = (pageH - elH) / 2; break;
    }
    return [pos];
};

export default AddWatermarkPdf;
