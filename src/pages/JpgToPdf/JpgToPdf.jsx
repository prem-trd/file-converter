
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { jsPDF } from 'jspdf';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFileImage, FaTrash, FaRedo, FaPlus } from 'react-icons/fa';
import DraggableImage from './DraggableImage';
import './JpgToPdf.css';

const JpgToPdf = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback(acceptedFiles => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        const newFileObjects = imageFiles.map((file, index) => ({
            id: `file-${files.length + Date.now() + index}`,
            file,
            preview: URL.createObjectURL(file),
            rotation: 0
        }));
        setFiles(f => [...f, ...newFileObjects]);
    }, [files]);

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'] } });

    const moveImage = (dragIndex, hoverIndex) => {
        const draggedFile = files[dragIndex];
        const updatedFiles = [...files];
        updatedFiles.splice(dragIndex, 1);
        updatedFiles.splice(hoverIndex, 0, draggedFile);
        setFiles(updatedFiles);
    };

    const handleRemoveFile = (id) => {
        const fileToRemove = files.find(f => f.id === id);
        if (fileToRemove) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
        setFiles(f => f.filter(file => file.id !== id));
    };

    const handleRotateFile = (id) => {
        setFiles(f => f.map(file =>
            file.id === id ? { ...file, rotation: (file.rotation + 90) % 360 } : file
        ));
    };

    const handleConvertToPdf = () => {
        if (files.length === 0) {
            setError("Please add some images first.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const doc = new jsPDF();

        const processFile = (index) => {
            if (index >= files.length) {
                doc.save('converted.pdf');
                setIsLoading(false);
                setFiles([]);
                return;
            }

            const file = files[index];
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = file.preview;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();

                if (file.rotation === 90 || file.rotation === 270) {
                    canvas.width = img.height;
                    canvas.height = img.width;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }

                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(file.rotation * Math.PI / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);

                const ratio = canvas.width / canvas.height;
                let pdfImgWidth = pageWidth;
                let pdfImgHeight = pdfImgWidth / ratio;

                if (pdfImgHeight > pageHeight) {
                    pdfImgHeight = pageHeight;
                    pdfImgWidth = pdfImgHeight * ratio;
                }

                const x = (pageWidth - pdfImgWidth) / 2;
                const y = (pageHeight - pdfImgHeight) / 2;

                if (index > 0) {
                    doc.addPage();
                }
                doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', x, y, pdfImgWidth, pdfImgHeight);

                processFile(index + 1);
            };

            img.onerror = () => {
                console.error(`Failed to load image: ${file.file.name}`);
                setError(`Failed to load image: ${file.file.name}`);
                processFile(index + 1); // Skip to the next image
            };
        };

        processFile(0);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="jpg-to-pdf-container">
                <div className="jpg-to-pdf-header">
                    <h1 className="jpg-to-pdf-title">JPG to PDF Converter</h1>
                    <p className="jpg-to-pdf-description">
                        Drag & drop images to reorder. Rotate or delete images as needed.
                    </p>
                </div>

                <div className="jpg-to-pdf-content">
                    {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                    {files.length === 0 ? (
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <div className="dropzone-content">
                                <FaFileImage size={48} />
                                <p>Drag 'n' drop JPG or PNG files here, or click to select files</p>
                            </div>
                        </div>
                    ) : (
                        <div className="image-grid">
                            {files.map((file, index) => (
                                <DraggableImage key={file.id} id={file.id} index={index} moveImage={moveImage}>
                                    <div className="image-card">
                                        <div className="image-card-actions">
                                            <Button variant="light" size="sm" onClick={() => handleRotateFile(file.id)}><FaRedo /></Button>
                                            <Button variant="light" size="sm" onClick={() => handleRemoveFile(file.id)}><FaTrash /></Button>
                                        </div>
                                        <img
                                            src={file.preview}
                                            alt={file.file.name}
                                            className="image-preview"
                                            style={{ transform: `rotate(${file.rotation}deg)` }}
                                        />
                                    </div>
                                </DraggableImage>
                            ))}
                             <div {...getRootProps({ className: 'dropzone-mini' })}>
                                <input {...getInputProps()} />
                                <FaPlus />
                            </div>
                        </div>
                    )}

                    {isLoading && <div className='spinner-container'><Spinner animation="border" /></div>}

                    {files.length > 0 && (
                        <div className="jpg-to-pdf-button-container">
                            <Button onClick={handleConvertToPdf} size="lg" disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Convert to PDF'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </DndProvider>
    );
};

export default JpgToPdf;
