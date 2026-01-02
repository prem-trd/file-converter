
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { pdfjs } from 'react-pdf';
import { Button, Spinner, Alert } from 'react-bootstrap';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './PdfToJpg.css';

// Force the PDF.js worker to be loaded from a reliable CDN.
// This is the standard and most robust way to avoid bundling issues.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
console.log('PDF.js worker source set to:', pdfjs.GlobalWorkerOptions.workerSrc);

const PdfToJpg = () => {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pdfName, setPdfName] = useState('');

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setImages([]);
        setPdfName(file.name.replace(/\.pdf$/i, ''));

        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const pdf = await pdfjs.getDocument({ data: typedarray }).promise;

                const pagePromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    pagePromises.push(pdf.getPage(i));
                }

                const pages = await Promise.all(pagePromises);

                const imageDataPromises = pages.map(async (page) => {
                    const viewport = page.getViewport({ scale: 2.5 });
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    await page.render({ canvasContext: context, viewport: viewport }).promise;
                    return canvas.toDataURL('image/jpeg', 0.9);
                });

                const imageDataUrls = await Promise.all(imageDataPromises);
                setImages(imageDataUrls);

            } catch (err) {
                setError('Failed to process the PDF. It may be corrupted, password-protected, or in an unsupported format.');
                console.error('PDF processing error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        reader.onerror = () => {
            setError('Failed to read the file.');
            setIsLoading(false);
        };

        reader.readAsArrayBuffer(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const handleDownload = async () => {
        if (images.length === 0) return;
        const zip = new JSZip();

        images.forEach((imgData, i) => {
            const imgName = `${pdfName}-page-${i + 1}.jpg`;
            zip.file(imgName, imgData.split(',')[1], { base64: true });
        });

        try {
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `pdf-to-jpg-smartconverter-${pdfName}.zip`);
        } catch (err) {
            setError('Failed to create the zip file.');
            console.error('ZIP creation error:', err);
        }
    };

    return (
        <div className="pdf-to-jpg-container">
            <Helmet>
                 <title>PDF to JPG - Free Online PDF to Image Converter</title>
                 <meta name="description" content="Convert your PDF files to high-quality JPG images for free. Our online tool quickly turns each PDF page into a separate image, perfect for sharing or editing." />
                <link rel="canonical" href={`${window.location.origin}/pdf-to-jpg`} />
            </Helmet>
            <div className="pdf-to-jpg-header">
                <h1 className="pdf-to-jpg-title">PDF to JPG Converter</h1>
                <p className="pdf-to-jpg-description">
                    Convert each page of your PDF into a high-quality JPG image.
                </p>
            </div>

            <div className="pdf-to-jpg-content">
                {error && <Alert variant="danger" className="w-100" onClose={() => setError(null)} dismissible>{error}</Alert>}

                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                    <input {...getInputProps()} />
                    {isLoading ? (
                        <>
                            <Spinner animation="border" as="span" size="sm" role="status" aria-hidden="true" />
                            <span className="ms-2">Processing PDF...</span>
                        </>
                    ) : (
                        <p>Drag & drop a PDF file here, or click to select a file</p>
                    )}
                </div>

                {images.length > 0 && (
                    <div className="pdf-to-jpg-button-container mt-5 w-100 text-center">
                        <div className="image-grid">
                            {images.map((imgData, index) => (
                                <div key={index} className="image-preview-container">
                                    <img src={imgData} alt={`Page ${index + 1}`} className="image-preview" />
                                    <div className="page-number">Page {index + 1}</div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleDownload} size="lg" className="mt-4 btn-primary-tool">
                            Download Images as .ZIP
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PdfToJpg;
