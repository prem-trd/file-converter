
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFileCode, FaTrashAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './HtmlToPdf.css';

const HtmlToPdf = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            const acceptedFile = acceptedFiles[0];
            if (acceptedFile.type === 'text/html' || acceptedFile.name.endsWith('.html')) {
                setFile(acceptedFile);
                setError(null);
            } else {
                setError('Invalid file type. Please upload a .html file.');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/html': ['.html', '.htm'] },
        multiple: false
    });

    const handleConvertToPdf = async () => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                const htmlContent = event.target.result;

                const iframe = document.createElement('iframe');
                iframe.style.position = 'absolute';
                iframe.style.left = '-9999px';
                iframe.style.top = '-9999px';
                iframe.style.width = '1024px'; // A reasonable default width
                iframe.style.border = 'none';

                document.body.appendChild(iframe);

                const iframeDoc = iframe.contentWindow.document;
                iframeDoc.open();
                iframeDoc.write(htmlContent);
                iframeDoc.close();

                iframe.onload = async () => {
                    try {
                        const body = iframe.contentWindow.document.body;
                        const html = iframe.contentWindow.document.documentElement;

                        const images = Array.from(body.getElementsByTagName('img'));
                        const promises = images.map(img => {
                            if (img.complete) return Promise.resolve();
                            return new Promise(resolve => {
                                img.onload = resolve;
                                img.onerror = resolve;
                            });
                        });

                        await Promise.all(promises);

                        const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
                        iframe.style.height = `${height}px`;
                        const width = body.scrollWidth;
                        iframe.style.width = `${width}px`;

                        const canvas = await html2canvas(body, {
                            scale: 2,
                            useCORS: true,
                            backgroundColor: '#ffffff',
                            width: width,
                            height: height,
                            windowWidth: width,
                            windowHeight: height,
                        });

                        document.body.removeChild(iframe);

                        const imgData = canvas.toDataURL('image/png');

                        const pdfWidth = canvas.width;
                        const pdfHeight = canvas.height;

                        const pdf = new jsPDF({
                            orientation: pdfWidth > pdfHeight ? 'l' : 'p',
                            unit: 'px',
                            format: [pdfWidth, pdfHeight]
                        });

                        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                        pdf.save(`${file.name.replace(/\.(html|htm)$/i, '')}.pdf`);

                    } catch (err) {
                        console.error('Error during canvas conversion:', err);
                        setError('Failed to convert HTML to PDF. The content may have issues.');
                        if (document.body.contains(iframe)) {
                            document.body.removeChild(iframe);
                        }
                    } finally {
                        setIsLoading(false);
                    }
                };
            };

            reader.onerror = () => {
                setError('Failed to read the file.');
                setIsLoading(false);
            };

            reader.readAsText(file);

        } catch (err) {
            console.error('General error:', err);
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setError(null);
    };

    return (
        <div className="html-to-pdf-container">
            <div className="html-to-pdf-header">
                <h1 className="html-to-pdf-title">HTML to PDF Converter</h1>
                <p className="html-to-pdf-description">
                    Convert your .html files into PDF documents.
                </p>
            </div>

            <div className="html-to-pdf-content">
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                {!file ? (
                    <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFileCode size={48} className="dropzone-icon" />
                            <p>Drag 'n' drop a .html file here, or click to select a file</p>
                        </div>
                    </div>
                ) : (
                    <div className="file-display">
                        <div>
                            <FaFileCode size={40} className="file-icon" />
                            <span>{file.name}</span>
                        </div>
                        <Button variant="light" size="sm" onClick={handleRemoveFile}>
                            <FaTrashAlt style={{ cursor: 'pointer', marginLeft: 'auto', color: '#dc3545' }} />
                        </Button>
                    </div>
                )}

                {isLoading && <div className='spinner-container'><Spinner animation="border" /></div>}

                {file && !isLoading && (
                    <div className="convert-button-container">
                        <Button onClick={handleConvertToPdf} size="lg">
                            Convert to PDF
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HtmlToPdf;
