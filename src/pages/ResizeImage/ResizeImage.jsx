
import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { FaFileImage, FaDownload, FaTrash } from 'react-icons/fa';
import './ResizeImage.css';

const ResizeImage = () => {
  const [files, setFiles] = useState([]);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [resizedPreview, setResizedPreview] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
    setResizedPreview(null); // Clear previous resized preview
  }, []);

  useEffect(() => {
    if (files.length > 0 && (width || height)) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          const aspectRatio = img.width / img.height;
          let newWidth = width ? parseInt(width, 10) : 0;
          let newHeight = height ? parseInt(height, 10) : 0;

          if (newWidth && !newHeight) {
            newHeight = Math.round(newWidth / aspectRatio);
          } else if (!newWidth && newHeight) {
            newWidth = Math.round(newHeight * aspectRatio);
          } else if (!newWidth && !newHeight) {
            newWidth = img.width;
            newHeight = img.height;
          }
          
          canvas.width = newWidth;
          canvas.height = newHeight;

          ctx.drawImage(img, 0, 0, newWidth, newHeight);
          setResizedPreview(canvas.toDataURL(file.type));
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
     else {
        setResizedPreview(null);
    }
  }, [width, height, files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resizedPreview;
    link.download = `resized-${files[0].name}`;
    link.click();
  };

  const removeFile = () => {
    setFiles([]);
    setResizedPreview(null);
    setWidth('');
    setHeight('');
  };

  return (
    <div className="resize-image-container">
      <Helmet>
        <title>Resize Image Online - Free Image Resizer Tool</title>
        <meta name="description" content="Easily resize any image online for free. Specify the exact dimensions (width and height) and download the resized image instantly without losing quality."
        />
        <link rel="canonical" href={`${window.location.origin}/resize-image`} />
      </Helmet>
      <div className="resize-image-header">
        <h1 className="resize-image-title">Resize Image</h1>
        <p className="resize-image-description">Easily resize your image to the perfect dimensions for any project.</p>
      </div>

      <div className="resize-image-content">
        {files.length === 0 && (
            <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
                <input {...getInputProps()} />
                <div className="dropzone-content">
                    <FaFileImage size={50} />
                    <p>Drag & drop an image here, or click to select a file</p>
                </div>
            </div>
        )}

        {files.length > 0 && (
            <div className="resize-main">
                <div className="image-preview-area">
                    <div className='preview-column'>
                        <h3>Original Image</h3>
                        <img src={files[0].preview} alt="Original" className="preview-image" />
                    </div>
                    <div className='preview-column'>
                        <h3>Resized Preview</h3>
                        {resizedPreview ? (
                            <img src={resizedPreview} alt="Resized Preview" className="preview-image" />
                        ) : (
                            <div className='no-preview'>Enter a width or height to see a preview</div>
                        )}
                    </div>
                </div>
            
                <div className="controls">
                    <div className="dimension-group">
                        <label htmlFor="width">Width</label>
                        <input
                        id="width"
                        type="number"
                        placeholder="e.g., 1920"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        className="dimension-input"
                        />
                    </div>
                    <div className="dimension-group">
                        <label htmlFor="height">Height</label>
                        <input
                        id="height"
                        type="number"
                        placeholder="e.g., 1080"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="dimension-input"
                        />
                    </div>
                    <button onClick={handleDownload} className="resize-button" disabled={!resizedPreview}>
                        <FaDownload />
                        Resize & Download
                    </button>
                    <button onClick={removeFile} className="remove-file-button">
                        <FaTrash />
                        Remove Image
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResizeImage;
