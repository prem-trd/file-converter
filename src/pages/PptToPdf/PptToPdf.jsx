
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFilePowerpoint, FaTrashAlt } from 'react-icons/fa';
import JSZip from 'jszip';
import jsPDF from 'jspdf';
import './PptToPdf.css';

const PptToPdf = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] },
        multiple: false
    });

    const handleConvertToPdf = async () => {
        if (!file) return;

        setIsLoading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const arrayBuffer = event.target.result;
                    const zip = await JSZip.loadAsync(arrayBuffer);
                    const imageFiles = [];

                    // Find all image files in the ppt/media/ directory
                    zip.folder('ppt/media').forEach((relativePath, file) => {
                        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                            imageFiles.push(file);
                        }
                    });

                    if (imageFiles.length === 0) {
                        setError('No images found in the presentation. The converted PDF would be empty.');
                        setIsLoading(false);
                        return;
                    }
                    
                    // Sort images by their file name (e.g., image1.jpeg, image2.png)
                    imageFiles.sort((a, b) => {
                        const aNum = parseInt(a.name.match(/\d+/)[0], 10);
                        const bNum = parseInt(b.name.match(/\d+/)[0], 10);
                        return aNum - bNum;
                    });

                    const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape for slides
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();

                    for (let i = 0; i < imageFiles.length; i++) {
                        const imageFile = imageFiles[i];
                        const imageData = await imageFile.async('base64');
                        const imageExt = imageFile.name.split('.').pop().toUpperCase();
                        
                        if (i > 0) {
                            pdf.addPage();
                        }
                        
                        // Add image, maintaining aspect ratio
                        pdf.addImage(
                            `data:image/${imageExt};base64,${imageData}`,
                            imageExt,
                            0, 0,
                            pdfWidth,
                            pdfHeight
                        );
                    }

                    pdf.save(`${file.name.replace(/\.pptx$/i, '')}.pdf`);
                } catch (err) {
                    console.error('Error processing presentation:', err);
                    setError('Could not process the .pptx file. It might be corrupt or in an unsupported format.');
                } finally {
                    setIsLoading(false);
                }
            };

            reader.onerror = () => {
                setError('Failed to read the file.');
                setIsLoading(false);
            };

            reader.readAsArrayBuffer(file);

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
        <div className="ppt-to-pdf-container">
            <div className="ppt-to-pdf-header">
                <h1 className="ppt-to-pdf-title">PowerPoint to PDF Converter</h1>
                <p className="ppt-to-pdf-description">
                    Extracts images from a .pptx file and compiles them into a PDF.
                </p>
            </div>

            <div className="ppt-to-pdf-content">
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                {!file ? (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFilePowerpoint size={48} />
                            <p>Drag 'n' drop a .pptx file here, or click to select a file</p>
                        </div>
                    </div>
                ) : (
                    <div className="file-display">
                        <FaFilePowerpoint size={40} />
                        <span>{file.name}</span>
                        <FaTrashAlt
                            onClick={handleRemoveFile}
                            style={{ cursor: 'pointer', marginLeft: 'auto', color: '#dc3545' }}
                        />
                    </div>
                )}

                {isLoading && <div className='spinner-container'><Spinner animation="border" /></div>}

                {file && (
                    <div className="convert-button-container">
                        <Button onClick={handleConvertToPdf} size="lg" disabled={isLoading}>
                            {isLoading ? 'Converting...' : 'Convert to PDF'}
                        </Button>
                    </div>
                )}
            </div>
            {/* This container is no longer used for rendering, but let's keep it in case of future needs */}
            <div id="pptx-container" style={{ display: 'none' }}></div>
        </div>
    );
};

export default PptToPdf;
