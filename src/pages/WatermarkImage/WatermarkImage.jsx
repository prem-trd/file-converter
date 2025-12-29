
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { FaFileImage, FaDownload, FaArrowLeft, FaFont, FaImage } from 'react-icons/fa';
import './WatermarkImage.css';

// Helper function to calculate watermark positions
const getWatermarkPositions = (canvasWidth, canvasHeight, itemWidth, itemHeight, mode, position, margin, tileGap, rows, cols) => {
    const positions = [];
    const effectiveWidth = canvasWidth - 2 * margin;
    const effectiveHeight = canvasHeight - 2 * margin;

    if (mode === 'single') {
        let x, y;
        switch (position) {
            case 'top-left': x = margin; y = margin; break;
            case 'top-center': x = (canvasWidth - itemWidth) / 2; y = margin; break;
            case 'top-right': x = canvasWidth - itemWidth - margin; y = margin; break;
            case 'center-left': x = margin; y = (canvasHeight - itemHeight) / 2; break;
            case 'center': x = (canvasWidth - itemWidth) / 2; y = (canvasHeight - itemHeight) / 2; break;
            case 'center-right': x = canvasWidth - itemWidth - margin; y = (canvasHeight - itemHeight) / 2; break;
            case 'bottom-left': x = margin; y = canvasHeight - itemHeight - margin; break;
            case 'bottom-center': x = (canvasWidth - itemWidth) / 2; y = canvasHeight - itemHeight - margin; break;
            case 'bottom-right': x = canvasWidth - itemWidth - margin; y = canvasHeight - itemHeight - margin; break;
            default: x = (canvasWidth - itemWidth) / 2; y = (canvasHeight - itemHeight) / 2; break;
        }
        positions.push({ x, y });
    } else if (mode === 'tile') {
        const totalWidth = cols * itemWidth + (cols - 1) * tileGap;
        const totalHeight = rows * itemHeight + (rows - 1) * tileGap;
        const startX = (canvasWidth - totalWidth) / 2;
        const startY = (canvasHeight - totalHeight) / 2;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                positions.push({
                    x: startX + j * (itemWidth + tileGap),
                    y: startY + i * (itemHeight + tileGap)
                });
            }
        }
    }
    return positions;
};


const WatermarkImage = () => {
    const [mainImage, setMainImage] = useState(null);
    const [watermarkType, setWatermarkType] = useState('text'); // 'text' or 'image'
    const [textOptions, setTextOptions] = useState({ text: 'Watermark', fontSize: 48, color: '#000000', opacity: 0.5, rotation: -45, mode: 'tile', position: 'center', tileGap: 50, rows: 5, cols: 5 });
    const [imageOptions, setImageOptions] = useState({ scale: 0.2, opacity: 0.5, rotation: 0, mode: 'single', position: 'center', tileGap: 50, rows: 3, cols: 3 });
    const [watermarkImage, setWatermarkImage] = useState(null);
    const canvasRef = useRef(null);

    const onDropMain = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setMainImage(e.target.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const onDropWatermark = useCallback(acceptedFiles => {
        const file = acceptedFiles[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setWatermarkImage(e.target.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const { getRootProps: getMainRootProps, getInputProps: getMainInputProps, isDragActive: isMainDragActive } = useDropzone({ onDrop: onDropMain, accept: 'image/*', multiple: false });
    const { getRootProps: getWatermarkRootProps, getInputProps: getWatermarkInputProps, isDragActive: isWatermarkDragActive } = useDropzone({ onDrop: onDropWatermark, accept: 'image/*', multiple: false });

    useEffect(() => {
        if (mainImage && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.src = mainImage;
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                ctx.globalAlpha = watermarkType === 'text' ? textOptions.opacity : imageOptions.opacity;
                ctx.save();

                if (watermarkType === 'text' && textOptions.text) {
                    ctx.font = `${textOptions.fontSize}px Arial`;
                    ctx.fillStyle = textOptions.color;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    const metrics = ctx.measureText(textOptions.text);
                    const itemWidth = metrics.width;
                    const itemHeight = textOptions.fontSize;

                    const positions = getWatermarkPositions(canvas.width, canvas.height, itemWidth, itemHeight, textOptions.mode, textOptions.position, 20, textOptions.tileGap, textOptions.rows, textOptions.cols);

                    positions.forEach(pos => {
                        ctx.save();
                        ctx.translate(pos.x + itemWidth / 2, pos.y + itemHeight / 2);
                        ctx.rotate(textOptions.rotation * Math.PI / 180);
                        ctx.fillText(textOptions.text, 0, 0);
                        ctx.restore();
                    });
                } else if (watermarkType === 'image' && watermarkImage) {
                    const wmImg = new Image();
                    wmImg.src = watermarkImage;
                    wmImg.onload = () => {
                        const itemWidth = wmImg.width * imageOptions.scale;
                        const itemHeight = wmImg.height * imageOptions.scale;

                        const positions = getWatermarkPositions(canvas.width, canvas.height, itemWidth, itemHeight, imageOptions.mode, imageOptions.position, 20, imageOptions.tileGap, imageOptions.rows, imageOptions.cols);

                        positions.forEach(pos => {
                            ctx.save();
                            ctx.translate(pos.x + itemWidth / 2, pos.y + itemHeight / 2);
                            ctx.rotate(imageOptions.rotation * Math.PI / 180);
                            ctx.drawImage(wmImg, -itemWidth / 2, -itemHeight / 2, itemWidth, itemHeight);
                            ctx.restore();
                        });
                    }
                }
                ctx.restore();
            }
        }
    }, [mainImage, watermarkType, textOptions, watermarkImage, imageOptions]);

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = 'watermark-image-smartconverter.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    };

    const handleBack = () => {
        setMainImage(null);
        setWatermarkImage(null);
    }

    return (
        <div className='watermark-image-container'>
            <Helmet>
                <title>Watermark Image - Free Online Image Watermarking Tool</title>
                <meta name="description" content="Easily add a text or image watermark to your images online for free. Customize opacity, rotation, position, and tiling to protect your images." />
                <link rel="canonical" href={`${window.location.origin}/watermark-image`} />
            </Helmet>
            <div className='watermark-image-header'>
                <h1 className='watermark-image-title'>Watermark Image</h1>
                <p className='watermark-image-description'>Add a text or image watermark to your images with customizable options.</p>
            </div>
            <div className='watermark-image-content'>
                {!mainImage ? (
                    <div {...getMainRootProps({ className: `dropzone` })}>
                        <input {...getMainInputProps()} />
                        <div className="dropzone-content">
                            <FaFileImage size={50} />
                            <p>Drag & drop your image here, or click to select</p>
                        </div>
                    </div>
                ) : (
                    <div className="watermark-image-main">
                        <div className="watermark-image-preview-container">
                            <canvas ref={canvasRef} className='watermark-image-preview' />
                        </div>

                        <div className="watermark-image-sidebar">
                            <div className="watermark-image-tabs">
                                <button className={watermarkType === 'text' ? 'active' : ''} onClick={() => setWatermarkType('text')}><FaFont /> Text</button>
                                <button className={watermarkType === 'image' ? 'active' : ''} onClick={() => setWatermarkType('image')}><FaImage /> Image</button>
                            </div>

                            {watermarkType === 'text' ? (
                                <div className='watermark-image-settings-group'>
                                    <label>Text</label>
                                    <input type="text" value={textOptions.text} onChange={(e) => setTextOptions({ ...textOptions, text: e.target.value })} />
                                    <label>Font Size</label>
                                    <input type="range" min="12" max="128" value={textOptions.fontSize} onChange={(e) => setTextOptions({ ...textOptions, fontSize: Number(e.target.value) })} />
                                    <label>Color</label>
                                    <input type="color" value={textOptions.color} onChange={(e) => setTextOptions({ ...textOptions, color: e.target.value })} />
                                    <label>Opacity</label>
                                    <input type="range" min="0" max="1" step="0.1" value={textOptions.opacity} onChange={(e) => setTextOptions({ ...textOptions, opacity: Number(e.target.value) })} />
                                    <label>Rotation</label>
                                    <input type="range" min="-180" max="180" value={textOptions.rotation} onChange={(e) => setTextOptions({ ...textOptions, rotation: Number(e.target.value) })} />
                                    <label>Mode</label>
                                    <select value={textOptions.mode} onChange={(e) => setTextOptions({ ...textOptions, mode: e.target.value })}>
                                        <option value="single">Single</option>
                                        <option value="tile">Tile</option>
                                    </select>
                                </div>
                            ) : (
                                <div className='watermark-image-settings-group'>
                                    <div {...getWatermarkRootProps({ className: `watermark-image-dropzone-small ${isWatermarkDragActive ? 'drag-over' : ''}` })}>
                                        <input {...getWatermarkInputProps()} />
                                        {watermarkImage ? <img src={watermarkImage} alt="watermark preview" /> : <p>Drop watermark image</p>}
                                    </div>
                                    <label>Scale</label>
                                    <input type="range" min="0.05" max="1" step="0.05" value={imageOptions.scale} onChange={(e) => setImageOptions({ ...imageOptions, scale: Number(e.target.value) })} />
                                    <label>Opacity</label>
                                    <input type="range" min="0" max="1" step="0.1" value={imageOptions.opacity} onChange={(e) => setImageOptions({ ...imageOptions, opacity: Number(e.target.value) })} />
                                </div>
                            )}

                            <div className="watermark-image-sidebar-buttons">
                                <button className='watermark-image-download-button' onClick={handleDownload}><FaDownload /> Download Image</button>
                                <button className='watermark-image-back-button' onClick={handleBack}><FaArrowLeft /> Back</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatermarkImage;
