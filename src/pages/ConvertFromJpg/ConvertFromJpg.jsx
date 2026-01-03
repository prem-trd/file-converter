
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { FaFileImage, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { checkConversionLimit, incrementConversionCount } from '../../utils/conversionLimiter.jsx';
import './ConvertFromJpg.css';

const ConvertFromJpg = () => {
    const [file, setFile] = useState(null);
    const [outputFormat, setOutputFormat] = useState('png');
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const onDrop = useCallback(acceptedFiles => {
        setError(null);
        if (!currentUser && checkConversionLimit()) {
            setError("You have reached your daily conversion limit. Please sign up for unlimited conversions.");
            return;
        }

        if (acceptedFiles.length === 0) {
            setError('Invalid file type. Please upload a JPG or JPEG file.');
            return;
        }

        const uploadedFile = acceptedFiles[0];
        if (uploadedFile) {
            setFile({
                preview: URL.createObjectURL(uploadedFile),
                name: uploadedFile.name
            });
        }
    }, [currentUser]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg']
        },
        multiple: false,
        onDropRejected: () => {
            setError('Invalid file type. Please upload a JPG or JPEG file.');
        }
    });

    const handleDownload = () => {
        if (!currentUser) {
            incrementConversionCount();
        }

        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = file.preview;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0);
            const link = document.createElement('a');
            const mimeType = `image/${outputFormat}`;
            link.href = canvas.toDataURL(mimeType);
            const originalName = file.name.split('.').slice(0, -1).join('.');
            link.download = `convert-from-jpg-smartconverter-${originalName}.${outputFormat}`;
            link.click();
        };
    };

    const handleBack = () => {
        setFile(null);
        setError(null);
    };

    return (
        <div className='convert-from-jpg-container'>
            <Helmet>
                <title>Convert from JPG - Free Online JPG to PNG, WebP, and GIF Converter</title>
                <meta name="description" content="Easily convert your JPG images to other formats like PNG, WebP, or GIF for free. Our online converter is fast, secure, and easy to use."
                />
                <link rel="canonical" href={`${window.location.origin}/convert-from-jpg`} />
            </Helmet>
            <div className='convert-from-jpg-header'>
                <h1 className='convert-from-jpg-title'>Convert from JPG</h1>
                <p className='convert-from-jpg-description'>Easily convert your JPG images to other formats like PNG or WebP.</p>
            </div>
            <div className="convert-from-jpg-content">
                {!file ? (
                    <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''} ${error ? 'error' : ''}` })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFileImage size={50} />
                            <p>Drag & drop a JPG image here, or click to select a file</p>
                            {error && <p className="convert-from-jpg-error-message">{error}</p>}
                        </div>
                    </div>
                ) : (
                    <div className="convert-from-jpg-main">
                        <div className="convert-from-jpg-image-preview-container">
                            <img
                                src={file.preview}
                                alt="Preview"
                                className='convert-from-jpg-image-preview'
                            />
                        </div>

                        <div className="convert-from-jpg-sidebar">
                            <div className='convert-from-jpg-settings-group'>
                                <label htmlFor='outputFormat'>Output Format:</label>
                                <select
                                    id='outputFormat'
                                    value={outputFormat}
                                    onChange={(e) => setOutputFormat(e.target.value)}
                                    className='convert-from-jpg-format-select'
                                >
                                    <option value='png'>PNG</option>
                                    <option value='webp'>WebP</option>
                                    <option value='gif'>GIF</option>
                                </select>
                            </div>

                            <div className="convert-from-jpg-sidebar-buttons">
                                <button
                                    className='convert-from-jpg-download-button'
                                    onClick={handleDownload}
                                >
                                    <FaDownload /> Download as {outputFormat.toUpperCase()}
                                </button>
                                <button
                                    className='convert-from-jpg-back-button'
                                    onClick={handleBack}
                                >
                                    <FaArrowLeft /> Back
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConvertFromJpg;
