
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import Cropper from 'react-easy-crop';
import { FaFileImage, FaDownload, FaTrash, FaUndo, FaRedo } from 'react-icons/fa';
import getCroppedImg from './cropImage';
import './CropImage.css';

const CropImage = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [filename, setFilename] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setZoom(1);
      setRotation(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false,
  });

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDownload = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
        const link = document.createElement('a');
        link.href = croppedImage;
        const baseName = filename.split('.').slice(0, -1).join('.');
        link.download = `crop-image-smartconverter-${baseName}.jpeg`;
        link.click();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const removeImage = () => {
    setImageSrc(null);
    setFilename(null);
    setZoom(1);
    setRotation(0);
  };

  const onMediaLoaded = useCallback((mediaSize) => {
    const { width, height } = mediaSize;
    const container = document.querySelector('.cropper-wrapper');
    if (container) {
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        if (width > 0 && height > 0 && containerWidth > 0 && containerHeight > 0) {
            const widthRatio = containerWidth / width;
            const heightRatio = containerHeight / height;
            const newZoom = Math.min(widthRatio, heightRatio);
            setZoom(newZoom);
        } else {
            setZoom(1); // Fallback to a safe zoom level
        }
    }
}, []);

  return (
    <div className="crop-image-container">
      <Helmet>
        <title>Crop Image Online - Free Image Cropper</title>
        <meta name="description" content="Crop and resize your images online for free. Our easy-to-use image cropper lets you zoom, rotate, and select the perfect area to crop."
        />
        <link rel="canonical" href={`${window.location.origin}/crop-image`} />
      </Helmet>
      <div className="crop-image-header">
        <h1 className="crop-image-title">Crop Image</h1>
        <p className="crop-image-description">Upload an image, drag the borders to create your desired crop, and download the result.</p>
      </div>

      <div className="crop-image-content">
        {!imageSrc ? (
          <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <FaFileImage size={50} />
              <p>Drag & drop an image here, or click to select a file</p>
            </div>
          </div>
        ) : (
          <div className="crop-main">
            <div className="cropper-wrapper">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                onRotationChange={setRotation}
                onMediaLoaded={onMediaLoaded}
              />
            </div>
            <div className="controls">
              <div className="slider-group">
                <label>Zoom</label>
                <input
                  type="range"
                  value={zoom}
                  min={0.1}
                  max={3}
                  step={0.01}
                  onChange={(e) => setZoom(parseFloat(e.target.value) || 1)}
                />
              </div>
              <div className="slider-group">
                <label>Rotation</label>
                <input
                  type="range"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  onChange={(e) => setRotation(parseInt(e.target.value, 10) || 0)}
                />
              </div>
              <div className="button-group">
                <button onClick={() => setRotation(rotation - 90)} className='rotate-button'><FaUndo /> Left</button>
                <button onClick={() => setRotation(rotation + 90)} className='rotate-button'><FaRedo /> Right</button>
              </div>
              <button onClick={handleDownload} className="crop-button">
                <FaDownload />
                Crop & Download
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

export default CropImage;
