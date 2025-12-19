
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileImage, FaDownload, FaArrowLeft } from 'react-icons/fa';
import './ConvertFromJpg.css';

const ConvertFromJpg = () => {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const [error, setError] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setError(null);
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
  }, []);

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
        link.download = `${originalName}.${outputFormat}`;
        link.click();
    };
  };

  const handleBack = () => {
      setFile(null);
      setError(null);
  };

  return (
    <div className='file-page-container'>
        <div className='file-page-header'>
            <h1 className='file-page-title'>Convert from JPG</h1>
            <p className='file-page-description'>Easily convert your JPG images to other formats like PNG or WebP.</p>
        </div>

        {!file ? (
            <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''} ${error ? 'error' : ''}` })}>
                <input {...getInputProps()} />
                <div className="dropzone-content">
                    <FaFileImage size={50} />
                    <p>Drag & drop a JPG image here, or click to select a file</p>
                    {error && <p className="error-message">{error}</p>}
                </div>
            </div>
        ) : (
            <div className="file-page-main">
                <div className="image-preview-container">
                    <img 
                        src={file.preview} 
                        alt="Preview" 
                        className='image-preview' 
                    />
                </div>

                <div className="file-page-sidebar">
                    <div className='settings-group'>
                        <label htmlFor='outputFormat'>Output Format:</label>
                        <select 
                            id='outputFormat'
                            value={outputFormat}
                            onChange={(e) => setOutputFormat(e.target.value)}
                            className='format-select'
                        >
                            <option value='png'>PNG</option>
                            <option value='webp'>WebP</option>
                            <option value='gif'>GIF</option>
                        </select>
                    </div>

                    <div className="sidebar-buttons">
                        <button 
                            className='download-button' 
                            onClick={handleDownload}
                        >
                            <FaDownload /> Download as {outputFormat.toUpperCase()}
                        </button>
                        <button 
                            className='back-button'
                            onClick={handleBack}
                        >
                            <FaArrowLeft /> Back
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ConvertFromJpg;
