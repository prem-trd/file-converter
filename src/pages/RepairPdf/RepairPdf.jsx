
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFilePdf, FaDownload } from 'react-icons/fa';
import './RepairPdf.css';

const RepairPdf = () => {
    const [file, setFile] = useState(null);
    const [repairedPdf, setRepairedPdf] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setRepairedPdf(null);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false,
    });

    const handleRepairPdf = async () => {
        if (!file) {
            setError('Please upload a PDF file first.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const fileBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer, { ignoreEncryption: true });
            const newPdfDoc = await PDFDocument.create();

            const copiedPages = await newPdfDoc.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach(page => newPdfDoc.addPage(page));

            const repairedPdfBytes = await newPdfDoc.save();
            setRepairedPdf(repairedPdfBytes);
        } catch (e) {
            console.error("Failed to repair PDF:", e);
            setError("An error occurred while repairing the PDF. The file might be heavily corrupted or encrypted.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!repairedPdf) return;

        const blob = new Blob([repairedPdf], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `repaired-${file.name}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const truncateFilename = (name, maxLength = 30) => {
        if (name.length <= maxLength) {
            return name;
        }
        return name.substring(0, maxLength - 3) + '...';
    };

    return (
        <div className="repair-pdf-container">
            <Helmet>
                <title>Repair PDF - Fix Corrupted PDF Files Online</title>
                <meta name="description" content="Attempt to repair corrupted or damaged PDF files online for free. Our tool tries to reconstruct your PDF to recover as much data as possible." />
                <link rel="canonical" href={`${window.location.origin}/repair-pdf`} />
            </Helmet>
            <div className="repair-pdf-header">
                <h1 className="repair-pdf-title">Repair PDF</h1>
                <p className="repair-pdf-description">
                    Upload a corrupted PDF file to try and repair it. This tool reconstructs the PDF to fix issues.
                </p>
            </div>

            <div className="repair-pdf-content">
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                <div className="repair-pdf-file-upload-area">
                    {!file ? (
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <div className="dropzone-content">
                                <FaFilePdf size={48} />
                                <p>Drag 'n' drop a PDF file here, or click to select a file</p>
                            </div>
                        </div>
                    ) : (
                        <div className="repair-pdf-file-info">
                            <p><strong>Selected file:</strong> {truncateFilename(file.name)} ({formatBytes(file.size)})</p>
                            <Button onClick={() => { setFile(null); setRepairedPdf(null); }} variant="secondary">Choose a different file</Button>
                        </div>
                    )}
                </div>

                {file && !repairedPdf && (
                    <Button onClick={handleRepairPdf} size="lg" disabled={isLoading} className="mt-3">
                        {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Repair PDF'}
                        {isLoading ? ' Repairing...' : ''}
                    </Button>
                )}

                {repairedPdf && (
                    <div className="repair-pdf-result-area">
                        <Alert variant="success">PDF repaired successfully!</Alert>
                        <Button onClick={handleDownload} size="lg" variant="success">
                            <FaDownload /> Download Repaired PDF
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RepairPdf;
