
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
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
                    setFile({ preview, raw: e.target.result, name: uploadedFile.name });
                };
                reader.readAsText(uploadedFile);
            } else {
                setFile({ preview, name: uploadedFile.name });
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
            const originalName = file.name.split('.').slice(0, -1).join('.');
            link.download = `convert-to-jpg-smartconverter-${originalName}.jpeg`;
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
        <div className='convert-to-jpg-container'>
            <Helmet>
                <title>Convert to JPG - Free Online Image to JPG Converter</title>
                <meta name="description" content="Easily convert your images to JPG format online for free. Our tool supports various image formats and provides options for background color and SVG stroke customization."
                />
                <link rel="canonical" href={`${window.location.origin}/convert-to-jpg`} />
            </Helmet>
            <div className='convert-to-jpg-header'>
                <h1 className='convert-to-jpg-title'>Convert to JPG</h1>
                <p className='convert-to-jpg-description'>Easily convert your images to JPG format, with options for background color and SVG stroke color.</p>
            </div>
            <div className='convert-to-jpg-content'>
                {!file ? (
                    <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFileImage size={50} />
                            <p>Drag & drop an image here, or click to select a file</p>
                        </div>
                    </div>
                ) : (
                    <div className="convert-to-jpg-main">
                        <div className="convert-to-jpg-image-preview-container" style={{ backgroundColor }}>
                            <img
                                src={getSvgPreview()}
                                alt="Preview"
                                className='convert-to-jpg-image-preview'
                            />
                        </div>

                        <div className="convert-to-jpg-sidebar">

                            {isSvg && (<>
                                <div className='convert-to-jpg-settings-group'>
                                    <label>Background Color:</label>
                                    <div className='convert-to-jpg-color-picker-container'>
                                        <div className='convert-to-jpg-color-picker-wrapper'>
                                            <div className='convert-to-jpg-color-picker-swatch' style={{ backgroundColor }}></div>
                                            <input
                                                type='color'
                                                value={backgroundColor}
                                                onChange={(e) => setBackgroundColor(e.target.value)}
                                                className='convert-to-jpg-color-picker-input'
                                            />
                                        </div>
                                        <span className='convert-to-jpg-color-hex'>{backgroundColor}</span>
                                    </div>
                                </div>
                                <div className='convert-to-jpg-settings-group'>
                                    <label>SVG Stroke Color:</label>
                                    <div className='convert-to-jpg-color-picker-container'>
                                        <div className='convert-to-jpg-color-picker-wrapper'>
                                            <div className='convert-to-jpg-color-picker-swatch' style={{ backgroundColor: svgStrokeColor }}></div>
                                            <input
                                                type='color'
                                                value={svgStrokeColor}
                                                onChange={(e) => setSvgStrokeColor(e.target.value)}
                                                className='convert-to-jpg-color-picker-input'
                                            />
                                        </div>
                                        <span className='convert-to-jpg-color-hex'>{svgStrokeColor}</span>
                                    </div>
                                </div>
                            </>
                            )}

                            <div className="convert-to-jpg-sidebar-buttons">
                                <button
                                    className='convert-to-jpg-download-button'
                                    onClick={handleDownload}
                                >
                                    <FaDownload /> Download as JPG
                                </button>
                                <button
                                    className='convert-to-jpg-back-button'
                                    onClick={() => setFile(null)}
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

export default ConvertToJpg;
