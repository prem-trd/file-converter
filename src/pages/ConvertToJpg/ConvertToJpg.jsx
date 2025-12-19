
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFileImage, FaDownload, FaArrowLeft } from 'react-icons/fa';
import './ConvertToJpg.css';

const ConvertToJpg = () => {
    const [file, setFile] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
    const [svgStrokeColor, setSvgStrokeColor] = useState('#000000');
    const [isSvg, setIsSvg] = useState(false);

    const onDrop = useCallback(acceptedFiles => {
        const uploadedFile = acceptedFiles[0];
        if (uploadedFile) {
            const preview = URL.createObjectURL(uploadedFile);
            const isSvgFile = uploadedFile.type === 'image/svg+xml';
            setIsSvg(isSvgFile);

            if (isSvgFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setFile({ preview, raw: e.target.result });
                };
                reader.readAsText(uploadedFile);
            } else {
                setFile({ preview });
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: false,
    });

    const handleDownload = () => {
        const image = new Image();
        image.crossOrigin = 'anonymous';

        if (isSvg) {
            const modifiedSvg = file.raw.replace(/stroke="[^"]*"/g, `stroke="${svgStrokeColor}"`);
            image.src = `data:image/svg+xml;base64,${btoa(modifiedSvg)}`;
        } else {
            image.src = file.preview;
        }

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0);
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/jpeg', 1.0);
            link.download = `converted-image.jpeg`;
            link.click();
        };
    };

    const getSvgPreview = () => {
        if (isSvg && file.raw) {
            const modifiedSvg = file.raw.replace(/stroke="[^"]*"/g, `stroke="${svgStrokeColor}"`);
            return `data:image/svg+xml;base64,${btoa(modifiedSvg)}`;
        }
        return file.preview;
    };

    return (
        <div className='file-page-container'>
            <div className='file-page-header'>
                <h1 className='file-page-title'>Convert to JPG</h1>
                <p className='file-page-description'>Easily convert your images to JPG format, with options for background color and SVG stroke color.</p>
            </div>

            {!file ? (
                <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
                    <input {...getInputProps()} />
                    <div className="dropzone-content">
                        <FaFileImage size={50} />
                        <p>Drag & drop an image here, or click to select a file</p>
                    </div>
                </div>
            ) : (
                <div className="file-page-main">
                    <div className="image-preview-container" style={{ backgroundColor }}>
                        <img
                            src={getSvgPreview()}
                            alt="Preview"
                            className='image-preview'
                        />
                    </div>

                    <div className="file-page-sidebar">

                        {isSvg && (<>
                            <div className='settings-group'>
                                <label>Background Color:</label>
                                <div className='color-picker-container'>
                                    <div className='color-picker-wrapper'>
                                        <div className='color-picker-swatch' style={{ backgroundColor }}></div>
                                        <input
                                            type='color'
                                            value={backgroundColor}
                                            onChange={(e) => setBackgroundColor(e.target.value)}
                                            className='color-picker-input'
                                        />
                                    </div>
                                    <span className='color-hex'>{backgroundColor}</span>
                                </div>
                            </div>
                            <div className='settings-group'>
                                <label>SVG Stroke Color:</label>
                                <div className='color-picker-container'>
                                    <div className='color-picker-wrapper'>
                                        <div className='color-picker-swatch' style={{ backgroundColor: svgStrokeColor }}></div>
                                        <input
                                            type='color'
                                            value={svgStrokeColor}
                                            onChange={(e) => setSvgStrokeColor(e.target.value)}
                                            className='color-picker-input'
                                        />
                                    </div>
                                    <span className='color-hex'>{svgStrokeColor}</span>
                                </div>
                            </div>
                        </>
                        )}

                        <div className="sidebar-buttons">
                            <button
                                className='download-button'
                                onClick={handleDownload}
                            >
                                <FaDownload /> Download as JPG
                            </button>
                            <button
                                className='back-button'
                                onClick={() => setFile(null)}
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

export default ConvertToJpg;
