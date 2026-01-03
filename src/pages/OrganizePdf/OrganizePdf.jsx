
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { PDFDocument, degrees, PageSizes } from 'pdf-lib';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFilePdf, FaTrash, FaRedo, FaPlus } from 'react-icons/fa';
import DraggablePage from './DraggablePage';
import { useAuth } from '../../context/AuthContext';
import { checkConversionLimit, incrementConversionCount } from '../../utils/conversionLimiter';
import './OrganizePdf.css';

const OrganizePdf = () => {
    const [files, setFiles] = useState([]);
    const [pages, setPages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const loadFilePages = async (fileObject) => {
        const newPages = [];
        try {
            const fileBuffer = await fileObject.file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(fileBuffer);
            for (let i = 0; i < pdfDoc.getPageCount(); i++) {
                newPages.push({
                    id: `page-${fileObject.id}-${i}`,
                    originalIndex: i,
                    fileId: fileObject.id,
                    rotation: 0,
                    isNew: false,
                });
            }
            return newPages;
        } catch (e) {
            console.error(e);
            setError(`Failed to load pages from ${fileObject.file.name}. The file may be corrupt.`);
            return []; // Return empty array on failure
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        if (!currentUser && checkConversionLimit()) {
            setError("You have reached your daily conversion limit. Please sign up for unlimited conversions.");
            return;
        }
        const newFileObjects = acceptedFiles.map((file, index) => ({
            file,
            id: `file-${files.length + Date.now() + index}`,
        }));

        setFiles(f => [...f, ...newFileObjects]);
        setIsLoading(true);

        const pagesPromises = newFileObjects.map(loadFilePages);
        const loadedPagesArrays = await Promise.all(pagesPromises);
        const allNewPages = loadedPagesArrays.flat();

        setPages(p => [...p, ...allNewPages]);
        setIsLoading(false);
    }, [files, currentUser]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
    });

    const handleRemoveFile = (fileId) => {
        setFiles(f => f.filter(file => file.id !== fileId));
        setPages(p => p.filter(page => page.fileId !== fileId));
    };

    const handleAddEmptyPage = (index) => {
        const newPage = { id: `page-new-${Date.now()}`, rotation: 0, isNew: true };
        const updatedPages = [...pages];
        updatedPages.splice(index, 0, newPage);
        setPages(updatedPages);
    };

    const movePage = (dragIndex, hoverIndex) => {
        const draggedPage = pages[dragIndex];
        const updatedPages = [...pages];
        updatedPages.splice(dragIndex, 1);
        updatedPages.splice(hoverIndex, 0, draggedPage);
        setPages(updatedPages);
    };

    const handleDeletePage = (id) => {
        setPages(p => p.filter(page => page.id !== id));
    };

    const handleRotatePage = (id) => {
        setPages(p => p.map(page =>
            page.id === id ? { ...page, rotation: (page.rotation + 90) % 360 } : page
        ));
    };

    const handleOrganizePdf = async () => {
        if (pages.length === 0) {
            setError('There are no pages to organize.');
            return;
        }

        if (!currentUser) {
            incrementConversionCount();
        }

        setIsLoading(true);
        setError(null);

        try {
            const newPdfDoc = await PDFDocument.create();
            const fileIdToDocMap = new Map();

            // Load only the necessary PDF documents
            for (const file of files) {
                if (pages.some(p => p.fileId === file.id)) {
                    const fileBuffer = await file.file.arrayBuffer();
                    const pdfDoc = await PDFDocument.load(fileBuffer);
                    fileIdToDocMap.set(file.id, pdfDoc);
                }
            }

            for (const page of pages) {
                if (page.isNew) {
                    newPdfDoc.addPage(PageSizes.A4);
                    continue;
                }
                const sourcePdfDoc = fileIdToDocMap.get(page.fileId);
                if (sourcePdfDoc) {
                    const [copiedPage] = await newPdfDoc.copyPages(sourcePdfDoc, [page.originalIndex]);
                    copiedPage.setRotation(degrees(page.rotation));
                    newPdfDoc.addPage(copiedPage);
                }
            }

            const organizedPdfBytes = await newPdfDoc.save();
            const blob = new Blob([organizedPdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'organize-pdf-smartconverter.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Reset state
            setFiles([]);
            setPages([]);

        } catch (e) {
            console.error("Failed to organize PDF:", e);
            setError("An error occurred while organizing the PDF.");
        } finally {
            setIsLoading(false);
        }
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
        <DndProvider backend={HTML5Backend}>
            <div className="organize-pdf-container">
                <Helmet>
                    <title>Organize PDF Pages - Reorder, Rotate, and Delete PDF Pages</title>
                    <meta name="description" content="Easily organize your PDF files online. Drag and drop to reorder pages, rotate pages, and delete pages from your PDF. Create a perfectly organized document for free." />
                    <link rel="canonical" href={`${window.location.origin}/organize-pdf`} />
                </Helmet>
                <div className="organize-pdf-header">
                    <h1 className="organize-pdf-title">Organize PDF Pages</h1>
                    <p className="organize-pdf-description">
                        Drag & drop pages to reorder. Add, rotate, or delete pages as needed.
                    </p>
                </div>

                <div className="organize-pdf-content">
                    {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                    {files.length === 0 ? (
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <div className="dropzone-content">
                                <FaFilePdf size={48} />
                                <p>Drag 'n' drop PDF files here, or click to select files</p>
                            </div>
                        </div>
                    ) : (
                        <div className="file-processing-area">
                            <div className="organize-pdf-file-list-container">
                                {files.map(file => (
                                    <div key={file.id} className="organize-pdf-file-item">
                                        <FaFilePdf className="pdf-icon" size={24} />
                                        <span className="organize-pdf-file-name" title={file.file.name}>{truncateFilename(file.file.name)} ({formatBytes(file.file.size)})</span>
                                        <div className="organize-pdf-file-item-actions">
                                            <Button variant="link" onClick={() => handleRemoveFile(file.id)} className="delete-button">
                                                <FaTrash />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div {...getRootProps({ className: 'dropzone-mini' })}>
                                <input {...getInputProps()} />
                                <p>Add more files...</p>
                            </div>
                        </div>
                    )}

                    {isLoading && <div className='spinner-container'><Spinner animation="border" /></div>}

                    {pages.length > 0 && (
                        <div className="page-grid">
                            <div className="add-page-first-wrapper">
                                <Button variant="outline-secondary" className="add-page-btn" onClick={() => handleAddEmptyPage(0)}><FaPlus /></Button>
                            </div>
                            {pages.map((page, index) => (
                                <div key={page.id} className="page-item-wrapper">
                                    <DraggablePage id={page.id} index={index} movePage={movePage}>
                                        <div className="page-card">
                                            <div className="page-card-actions">
                                                <Button variant="light" size="sm" onClick={() => handleRotatePage(page.id)}><FaRedo /></Button>
                                                <Button variant="light" size="sm" onClick={() => handleDeletePage(page.id)}><FaTrash /></Button>
                                            </div>
                                            <div className="page-number" style={{ transform: `rotate(${page.rotation}deg)` }}>
                                                {page.isNew ? 'New' : index + 1}
                                            </div>
                                        </div>
                                    </DraggablePage>
                                    <Button variant="outline-secondary" className="add-page-btn" onClick={() => handleAddEmptyPage(index + 1)}><FaPlus /></Button>
                                </div>
                            ))}
                        </div>
                    )}

                    {pages.length > 0 && (
                        <div className="organize-button-container">
                            <Button onClick={handleOrganizePdf} size="lg" disabled={isLoading}>
                                {isLoading ? 'Processing...' : 'Save Organized PDF'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </DndProvider>
    );
};

export default OrganizePdf;
