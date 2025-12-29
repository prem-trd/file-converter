
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFileCode, FaTrashAlt, FaExclamationTriangle } from 'react-icons/fa';
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

        const reader = new FileReader();
        reader.onload = (event) => {
            const htmlContent = event.target.result;

            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.top = '-9999px';
            iframe.style.width = '1280px';
            iframe.style.border = 'none';
            iframe.sandbox = 'allow-same-origin';
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(htmlContent);
            iframeDoc.close();

            const conversionHandler = async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 1500));

                    const body = iframe.contentWindow.document.body;
                    const html = iframe.contentWindow.document.documentElement;

                    const contentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
                    const contentWidth = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);

                    iframe.style.height = `${contentHeight}px`;
                    iframe.style.width = `${contentWidth}px`;

                    const canvas = await html2canvas(body, {
                        scale: 2,
                        useCORS: true,
                        backgroundColor: '#ffffff',
                        width: contentWidth,
                        height: contentHeight,
                        windowWidth: contentWidth,
                        windowHeight: contentHeight,
                        scrollX: 0,
                        scrollY: 0,
                        allowTaint: true
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
                    pdf.save(`html-to-pdf-smartconverter-${file.name.replace(/\.(html|htm)$/i, '')}.pdf`);

                } catch (err) {
                    console.error('Error during canvas conversion:', err);
                    setError('Conversion failed. This is likely because the HTML file is trying to load local images or stylesheets. Please use a self-contained HTML file.');
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                } finally {
                    setIsLoading(false);
                }
            };

            if (iframe.contentWindow.document.readyState === 'complete') {
                conversionHandler();
            } else {
                iframe.onload = conversionHandler;
            }
        };

        reader.onerror = () => {
            setError('Failed to read the file.');
            setIsLoading(false);
        };

        reader.readAsText(file);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setError(null);
    };

    return (
        <div className="html-to-pdf-container">
            <Helmet>
                <title>HTML to PDF Converter - Free Online Tool</title>
                <meta name="description" content="Convert your HTML files to high-quality PDF documents for free. Our online tool accurately renders your HTML, including CSS and images, into a downloadable PDF." />
                <link rel="canonical" href={`${window.location.origin}/html-to-pdf`} />
            </Helmet>
            <div className="html-to-pdf-header">
                <h1 className="html-to-pdf-title">HTML File to PDF</h1>
                <Alert variant="warning" className="mt-3">
                    <FaExclamationTriangle />
                    <strong> This tool cannot access local files.</strong> For a correct conversion, your HTML file must be self-contained. This means all images and stylesheets must use full web URLs (e.g., https://...) or be embedded directly in the file.
                </Alert>
            </div>

            <div className="html-to-pdf-content">
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                {!file ? (
                    <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFileCode size={48} className="dropzone-icon" />
                            <p>Drag 'n' drop a .html file here, or click to select</p>
                        </div>
                    </div>
                ) : (
                    <div className="file-display">
                        <FaFileCode size={40} className="file-icon" />
                        <span>{file.name}</span>
                        <Button variant="light" size="sm" onClick={handleRemoveFile}>
                            <FaTrashAlt />
                        </Button>
                    </div>
                )}

                {isLoading && <div className='spinner-container'><Spinner animation="border" /></div>}

                {file && !isLoading && (
                    <div className="html-to-pdf-button-container">
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
