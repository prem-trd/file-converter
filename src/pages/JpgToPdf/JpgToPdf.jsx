
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, IconButton } from 'rsuite';
import { jsPDF } from 'jspdf';
import { FaFileImage, FaPlus } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import './JpgToPdf.css';

const JpgToPdf = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
        setFiles(prevFiles => [...prevFiles, ...imageFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }))]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png'
    });

    const removeFile = (file) => {
        setFiles(files.filter(f => f !== file));
    }

    const handleConvertToPdf = () => {
        if (files.length === 0) return;

        setIsLoading(true);
        const doc = new jsPDF();
        
        files.forEach((file, index) => {
            const img = new Image();
            img.src = file.preview;
            img.onload = () => {
                const imgWidth = doc.internal.pageSize.getWidth();
                const imgHeight = (img.height * imgWidth) / img.width;
                
                if (index > 0) {
                    doc.addPage();
                }
                doc.addImage(file.preview, 'JPEG', 0, 0, imgWidth, imgHeight);

                if (index === files.length - 1) {
                    doc.save('converted.pdf');
                    setIsLoading(false);
                }
            };
        });
    };

    const truncateFilename = (name) => {
        return name.length > 25 ? `${name.substring(0, 22)}...` : name;
    }

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    return (
        <div className="jpg-to-pdf-container">
            <div className="jpg-to-pdf-header">
                <h2 className="jpg-to-pdf-title">JPG to PDF Converter</h2>
                <p className="jpg-to-pdf-description">Combine multiple JPG images into a single, easy-to-share PDF document.</p>
            </div>
            <div className={`dropzone ${isDragActive ? 'drag-over' : ''}`} {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="dropzone-content">
                    <FaFileImage size={48} />
                    <p>Drag 'n' drop JPG files here, or click to select files</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="file-list-container">
                    {files.map((file, i) => (
                        <div key={i} className="file-item">
                             <IconButton 
                                icon={<CgClose />} 
                                className="remove-btn" 
                                onClick={() => removeFile(file)} 
                                circle 
                                size="xs" 
                            />
                            <img src={file.preview} alt="preview" className="image-preview" />
                            <span className="file-name" title={file.name}>{truncateFilename(file.name)} ({formatBytes(file.size)})</span>
                        </div>
                    ))}
                </div>
            )}

            {files.length > 0 && (
                 <div className="convert-button-container">
                    <Button 
                        size="lg" 
                        appearance="primary" 
                        startIcon={<FaPlus />} 
                        onClick={handleConvertToPdf}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Converting...' : 'Convert to PDF'}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default JpgToPdf;
