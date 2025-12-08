import React, { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileImage } from 'react-icons/fa';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import './PhotoEditor.css';

const PhotoEditor = () => {
    const [image, setImage] = useState(null);
    const [filters, setFilters] = useState({
        brightness: 100,
        contrast: 100,
        saturate: 100,
        grayscale: 0,
        sepia: 0,
        blur: 0,
    });
    const imageRef = useRef(null);

    const onDrop = (acceptedFiles) => {
        const reader = new FileReader();
        reader.onload = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        }
    });

    const handleFilterChange = (filter, value) => {
        setFilters({ ...filters, [filter]: value });
    };

    const resetFilters = () => {
        setFilters({
            brightness: 100,
            contrast: 100,
            saturate: 100,
            grayscale: 0,
            sepia: 0,
            blur: 0,
        });
    };

    const downloadImage = () => {
        if (imageRef.current) {
            const imageElement = imageRef.current;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            const { naturalWidth, naturalHeight } = imageElement;
            canvas.width = naturalWidth;
            canvas.height = naturalHeight;

            const filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) blur(${filters.blur}px)`;
            context.filter = filterString;
            context.drawImage(imageElement, 0, 0, naturalWidth, naturalHeight);

            const link = document.createElement('a');
            link.download = 'edited-photo.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    const imageStyle = {
        filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturate}%) grayscale(${filters.grayscale}%) sepia(${filters.sepia}%) blur(${filters.blur}px)`
    };

    return (
        <div className="photo-editor-container">
            <div className="photo-editor-header">
                <h1 className="photo-editor-title">Photo Editor</h1>
                <p className="photo-editor-description">
                    Upload an image to apply filters and adjustments.
                </p>
            </div>
            <div className="photo-editor-content">
                {!image ? (
                    <div {...getRootProps({ className: 'dropzone' })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFileImage size={48} />
                            <p>Drag & drop an image here, or click to select a file</p>
                        </div>
                    </div>
                ) : (
                    <div className="editor-main">
                        <div className="image-display">
                            <img ref={imageRef} src={image} alt="Uploaded" className="main-image" style={imageStyle} />
                        </div>
                        <div className="controls">
                            <div className="filter-group">
                                <label>Brightness</label>
                                <input type="range" min="0" max="200" value={filters.brightness} onChange={(e) => handleFilterChange('brightness', e.target.value)} />
                            </div>
                            <div className="filter-group">
                                <label>Contrast</label>
                                <input type="range" min="0" max="200" value={filters.contrast} onChange={(e) => handleFilterChange('contrast', e.target.value)} />
                            </div>
                            <div className="filter-group">
                                <label>Saturation</label>
                                <input type="range" min="0" max="200" value={filters.saturate} onChange={(e) => handleFilterChange('saturate', e.target.value)} />
                            </div>
                            <div className="filter-group">
                                <label>Grayscale</label>
                                <input type="range" min="0" max="100" value={filters.grayscale} onChange={(e) => handleFilterChange('grayscale', e.target.value)} />
                            </div>
                            <div className="filter-group">
                                <label>Sepia</label>
                                <input type="range" min="0" max="100" value={filters.sepia} onChange={(e) => handleFilterChange('sepia', e.target.value)} />
                            </div>
                            <div className="filter-group">
                                <label>Blur</label>
                                <input type="range" min="0" max="10" value={filters.blur} onChange={(e) => handleFilterChange('blur', e.target.value)} />
                            </div>
                            <div className="button-group">
                                <button className="btn btn-secondary-tool" onClick={resetFilters}><FiTrash2 /> Reset</button>
                                <button className="btn btn-primary-tool" onClick={downloadImage}><FiDownload /> Download</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoEditor;
