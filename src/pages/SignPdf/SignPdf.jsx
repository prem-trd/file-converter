
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { Button, Message, toaster, Loader, Row, Col, IconButton, RadioGroup, Radio, InputNumber } from 'rsuite';
import { VscFilePdf, VscTrash } from "react-icons/vsc";
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';
import './SignPdf.css';

const SignPdf = () => {
    const [pdfFile, setPdfFile] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [placement, setPlacement] = useState('bottom-right');
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onPdfDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            if (selectedFile.type !== 'application/pdf') {
                toaster.push(<Message type="error" closable>Please upload a valid PDF file.</Message>);
                return;
            }
            setPdfFile(selectedFile);
            setIsLoading(true);
            try {
                const pdfBytes = await selectedFile.arrayBuffer();
                const pdfDoc = await PDFDocument.load(pdfBytes);
                setNumPages(pdfDoc.getPageCount());
                setPageNumber(1);
            } catch (error) {
                console.error("Error reading PDF:", error);
                toaster.push(<Message type="error" closable>Could not read the PDF file.</Message>);
                setPdfFile(null);
                setNumPages(null);
            } finally {
                setIsLoading(false);
            }
        }
    }, []);

    const onSignatureDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            if (!selectedFile.type.startsWith('image/')) {
                toaster.push(<Message type="error" closable>Please upload a valid image file.</Message>);
                return;
            }
            setSignatureFile(selectedFile);
            setSignaturePreview(URL.createObjectURL(selectedFile));
        }
    }, []);

    const { getRootProps: getPdfRootProps, getInputProps: getPdfInputProps, isDragActive: isPdfDragActive } = useDropzone({ onDrop: onPdfDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });
    const { getRootProps: getSignatureRootProps, getInputProps: getSignatureInputProps, isDragActive: isSignatureDragActive } = useDropzone({ onDrop: onSignatureDrop, accept: { 'image/*': [] }, maxFiles: 1 });

    const handleSignPdf = async () => {
        if (!pdfFile || !signatureFile) {
            toaster.push(<Message type="error" closable>Please select both a PDF and a signature file.</Message>);
            return;
        }
        setIsLoading(true);

        try {
            const pdfBytes = await pdfFile.arrayBuffer();
            const signatureBytes = await signatureFile.arrayBuffer();

            const pdfDoc = await PDFDocument.load(pdfBytes);
            const signatureImage = await pdfDoc.embedPng(signatureBytes);

            const pages = pdfDoc.getPages();
            if (pageNumber < 1 || pageNumber > pages.length) {
                toaster.push(<Message type="error" closable>Invalid page number selected.</Message>);
                setIsLoading(false);
                return;
            }
            const page = pages[pageNumber - 1];

            const { width, height } = page.getSize();
            const imageWidth = 150;
            const imageHeight = (signatureImage.height / signatureImage.width) * imageWidth;
            const margin = 50;

            let x, y;

            switch (placement) {
                case 'top-left':
                    x = margin;
                    y = height - imageHeight - margin;
                    break;
                case 'top-right':
                    x = width - imageWidth - margin;
                    y = height - imageHeight - margin;
                    break;
                case 'bottom-left':
                    x = margin;
                    y = margin;
                    break;
                case 'bottom-right':
                default:
                    x = width - imageWidth - margin;
                    y = margin;
                    break;
            }

            page.drawImage(signatureImage, {
                x,
                y,
                width: imageWidth,
                height: imageHeight,
            });

            const pdfWithSignatureBytes = await pdfDoc.save();

            const blob = new Blob([pdfWithSignatureBytes], { type: 'application/pdf' });
            saveAs(blob, `signed-${pdfFile.name}`);

            toaster.push(<Message type="success" closable>PDF signed successfully!</Message>);
        } catch (error) {
            console.error("Error signing PDF:", error);
            toaster.push(<Message type="error" closable>Failed to sign PDF. Please try again.</Message>);
        } finally {
            setIsLoading(false);
            setPdfFile(null);
            setSignatureFile(null);
            setSignaturePreview(null);
            setNumPages(null);
            setPageNumber(1);
        }
    };

    const removePdfFile = () => {
        setPdfFile(null);
        setNumPages(null);
        setPageNumber(1);
    };

    const removeSignatureFile = () => {
        setSignatureFile(null);
        setSignaturePreview(null);
    };

    const truncateFilename = (name, maxLength = 30) => {
        if (name.length <= maxLength) {
            return name;
        }
        return name.substring(0, maxLength - 3) + '...';
    };


    return (
        <div className="sign-pdf-container">
            <Helmet>
                <title>Sign PDF Online - Add Your Signature to a PDF for Free</title>
                <meta name="description" content="Easily sign your PDF documents online. Upload your PDF and an image of your signature, choose the placement, and download the signed file securely. No registration required." />
                <link rel="canonical" href={`${window.location.origin}/sign-pdf`} />
            </Helmet>
            <div className="sign-pdf-header">
                <h1 className="sign-pdf-title">Sign PDF File</h1>
                <p className="sign-pdf-description">
                    Upload your PDF and signature, choose the page and placement, and sign.
                </p>
            </div>

            <Row gutter={30} className="upload-section">
                <Col md={12}>
                    <div {...getPdfRootProps({ className: `dropzone` })}>
                        <input {...getPdfInputProps()} />
                        <p className="dropzone-content">Drop PDF here, or click to select</p>
                    </div>
                    {pdfFile && (
                        <div className="sign-pdf-file-list-container">
                            <div className="sign-pdf-file-item">
                                <VscFilePdf size={24} style={{ color: '#e74c3c' }} />
                                <span className="file-name" title={pdfFile.name}>{truncateFilename(pdfFile.name)}</span>
                                <div className="sign-pdf-file-item-actions">
                                    <IconButton icon={<VscTrash />} size="xs" onClick={removePdfFile} />
                                </div>
                            </div>
                            {numPages && (
                                <div className="page-selection-container">
                                    <label className="page-selection-label">Page to sign:</label>
                                    <InputNumber value={pageNumber} onChange={setPageNumber} min={1} max={numPages} />
                                    <span className="page-count-info">of {numPages}</span>
                                </div>
                            )}
                        </div>
                    )}
                </Col>
                <Col md={12}>
                    <div {...getSignatureRootProps({ className: `dropzone` })}>
                        <input {...getSignatureInputProps()} />
                        <p className="dropzone-content">Drop signature here, or click to select</p>
                    </div>
                    {signaturePreview && (
                        <div className="signature-preview-container">
                            <p>Signature Preview:</p>
                            <img src={signaturePreview} alt="Signature Preview" className="signature-preview" />
                            <IconButton icon={<VscTrash />} size="xs" onClick={removeSignatureFile} className="remove-signature-btn" />
                        </div>
                    )}
                </Col>
            </Row>

            <div className="placement-options">
                <label className="placement-label">Signature Placement:</label>
                <RadioGroup name="placement" inline appearance="picker" value={placement} onChange={setPlacement}>
                    <Radio value="bottom-right">Bottom Right</Radio>
                    <Radio value="bottom-left">Bottom Left</Radio>
                    <Radio value="top-right">Top Right</Radio>
                    <Radio value="top-left">Top Left</Radio>
                </RadioGroup>
            </div>

            <div className="sign-button-container">
                <Button onClick={handleSignPdf} appearance="primary" color="blue" size="lg" loading={isLoading} disabled={!pdfFile || !signatureFile}>
                    {isLoading ? 'Signing...' : 'Sign PDF'}
                </Button>
            </div>
        </div>
    );
};

export default SignPdf;
