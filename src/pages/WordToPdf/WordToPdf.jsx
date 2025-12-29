
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFileWord, FaTrashAlt } from 'react-icons/fa';
import { renderAsync } from 'docx-preview';
import { jsPDF } from 'jspdf';
import './WordToPdf.css';

const WordToPdf = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
        multiple: false
    });

    const handleConvertToPdf = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const arrayBuffer = await file.arrayBuffer();

        const contentDiv = document.createElement('div');
        contentDiv.style.width = '100%';
        contentDiv.style.padding = '20px';
        contentDiv.style.background = 'white';
        document.body.appendChild(contentDiv);

        try {
            await renderAsync(arrayBuffer, contentDiv);

            const doc = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4'
            });

            doc.html(contentDiv, {
                callback: function (doc) {
                    doc.save(`word-to-pdf-smartconverter-${file.name.replace('.docx', '')}.pdf`);
                    setIsLoading(false);
                    setFile(null);
                    document.body.removeChild(contentDiv);
                },
                x: 0,
                y: 0,
                width: 595,
                windowWidth: contentDiv.scrollWidth,
                autoPaging: 'text'
            });

        } catch (error) {
            console.error("Error converting to PDF:", error);
            setError("Failed to convert the Word document to PDF. The file might be corrupted or in an unsupported format.");
            setIsLoading(false);
            if (document.body.contains(contentDiv)) {
                document.body.removeChild(contentDiv);
            }
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    }

    return (
        <div className="word-to-pdf-container">
            <Helmet>
                <title>Word to PDF - Convert DOCX to PDF Online for Free</title>
                <meta name="description" content="Easily convert your Microsoft Word (.docx) documents to high-quality PDF files. Our online converter is fast, free, and easy to use." />
                <link rel="canonical" href={`${window.location.origin}/word-to-pdf`} />
            </Helmet>
            <div className="word-to-pdf-header">
                <h1 className="word-to-pdf-title">Word to PDF Converter</h1>
                <p className="word-to-pdf-description">
                    Convert your .docx files to PDF documents.
                </p>
            </div>

            <div className="word-to-pdf-content">
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                {!file ? (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFileWord size={48} />
                            <p>Drag 'n' drop a .docx file here, or click to select a file</p>
                        </div>
                    </div>
                ) : (
                    <div className="word-to-pdf-display">
                        <div>
                            <FaFileWord size={40} className="file-icon" />
                            <span>{file.name}</span>
                        </div>
                        <Button variant="light" size="sm" onClick={handleRemoveFile}>
                            <FaTrashAlt style={{ cursor: 'pointer', marginLeft: 'auto', color: '#dc3545' }} />
                        </Button>

                    </div>
                )}

                {isLoading && <div className='spinner-container'><Spinner animation="border" /></div>}

                {file && (
                    <div className="word-to-pdf-button-container">
                        <Button onClick={handleConvertToPdf} size="lg" disabled={isLoading}>
                            {isLoading ? 'Converting...' : 'Convert to PDF'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WordToPdf;
