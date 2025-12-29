
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { FaFileImage, FaDownload, FaTrash, FaUndo, FaRedo } from 'react-icons/fa';
import './RotateImage.css';

const RotateImage = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [rotation, setRotation] = useState(0);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const handleDownload = () => {
    if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const angle = rotation * Math.PI / 180;

            // Adjust canvas size to fit the rotated image
            const sin = Math.abs(Math.sin(angle));
            const cos = Math.abs(Math.cos(angle));
            const newWidth = image.width * cos + image.height * sin;
            const newHeight = image.width * sin + image.height * cos;

            canvas.width = newWidth;
            canvas.height = newHeight;

            ctx.translate(newWidth / 2, newHeight / 2);
            ctx.rotate(angle);
            ctx.drawImage(image, -image.width / 2, -image.height / 2);

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg');
            link.download = 'rotate-image-smartconverter.jpeg';
            link.click();
        };
    }
  };

  const removeImage = () => {
    setImageSrc(null);
    setRotation(0);
  };

  return (
    <div className="rotate-image-container">
        <Helmet>
            <title>Rotate Image Online - Free Image Rotator</title>
            <meta name="description" content="Easily rotate your images online for free. Upload an image, choose the rotation angle, and download the rotated image instantly."
            />
            <link rel="canonical" href={`${window.location.origin}/rotate-image`} />
        </Helmet>
      <div className="rotate-image-header">
        <h1 className="rotate-image-title">Rotate Image</h1>
        <p className="rotate-image-description">Upload an image, rotate it as you wish, and download the result.</p>
      </div>

      <div className="rotate-image-content">
        {!imageSrc ? (
          <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <FaFileImage size={50} />
              <p>Drag & drop an image here, or click to select a file</p>
            </div>
          </div>
        ) : (
          <div className="rotate-main">
            <div className="image-preview-wrapper">
                <img 
                    src={imageSrc} 
                    alt="Preview" 
                    style={{ transform: `rotate(${rotation || 0}deg)`}} 
                    className='image-preview'
                />
            </div>
            <div className="controls">
              <div className="slider-group">
                <label>Rotation</label>
                <input
                  type="range"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  onChange={(e) => setRotation(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="button-group">
                <button onClick={() => setRotation((rotation - 90) % 360)} className='rotate-button'><FaUndo /> Left</button>
                <button onClick={() => setRotation((rotation + 90) % 360)} className='rotate-button'><FaRedo /> Right</button>
              </div>
              <button onClick={handleDownload} className="download-button">
                <FaDownload />
                Download Rotated Image
              </button>
              <button onClick={removeImage} className="remove-file-button">
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

export default RotateImage;
