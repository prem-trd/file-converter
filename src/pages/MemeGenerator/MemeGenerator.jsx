
import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { Stage, Layer, Image, Text } from 'react-konva';
import useImage from 'use-image';
import { FiDownload, FiX } from 'react-icons/fi';
import { FaFileImage } from 'react-icons/fa';
import './MemeGenerator.css';

const MemeImage = ({ src, width, height }) => {
    const [img] = useImage(src);
    return <Image image={img} width={width} height={height} />;
};

const MemeGenerator = () => {
    const [image, setImage] = useState(null);
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [fontSize, setFontSize] = useState(40);
    const [fontColor, setFontColor] = useState('#ffffff');
    const [borderColor, setBorderColor] = useState('#000000');
    const [fontFamily, setFontFamily] = useState('Impact');
    const [strokeWidth, setStrokeWidth] = useState(2);
    const [aspectRatio, setAspectRatio] = useState(0);
    const stageRef = useRef(null);
    const containerRef = useRef(null);

    const calculateSize = () => {
        if (containerRef.current && aspectRatio) {
            const containerWidth = containerRef.current.offsetWidth;
            const newWidth = containerWidth;
            const newHeight = newWidth / aspectRatio;
            setImageSize({ width: newWidth, height: newHeight });
        }
    };

    useEffect(() => {
        if (image) {
            calculateSize();
        }
        window.addEventListener('resize', calculateSize);
        return () => window.removeEventListener('resize', calculateSize);
    }, [image, aspectRatio]);

    const onDrop = (acceptedFiles) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new window.Image();
            img.onload = () => {
                setAspectRatio(img.width / img.height);
                setImage(e.target.result);
            };
            img.src = e.target.result;
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

    const downloadMeme = () => {
        const dataURL = stageRef.current.toDataURL({ pixelRatio: 3 });
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const cancelMeme = () => {
        setImage(null);
        setTopText('');
        setBottomText('');
        setAspectRatio(0);
        setImageSize({ width: 0, height: 0 });
    };

    return (
        <div className="meme-generator-container">
            <Helmet>
                <title>Meme Generator - Create Your Own Memes Online for Free</title>
                <meta name="description" content="Easily create custom memes with our free online meme generator. Upload an image, add top and bottom text, customize the font, and download your creation." />
                <link rel="canonical" href={`${window.location.origin}/meme-generator`} />
            </Helmet>
            <div className="meme-generator-header">
              <h1 className="meme-generator-title">Meme Generator</h1>
              <p className="meme-generator-description">Create your own memes by adding text to images.</p>
            </div>
            <div className="meme-generator-content">
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
                        <div className="image-display" ref={containerRef}>
                          {imageSize.width > 0 && (
                            <Stage width={imageSize.width} height={imageSize.height} ref={stageRef}>
                                <Layer>
                                    <MemeImage src={image} width={imageSize.width} height={imageSize.height} />
                                    <Text
                                        text={topText}
                                        fontSize={fontSize}
                                        fontFamily={fontFamily}
                                        fill={fontColor}
                                        stroke={borderColor}
                                        strokeWidth={strokeWidth}
                                        x={20}
                                        y={30}
                                        width={imageSize.width - 40}
                                        align='center'
                                        draggable
                                    />
                                    <Text
                                        text={bottomText}
                                        fontSize={fontSize}
                                        fontFamily={fontFamily}
                                        fill={fontColor}
                                        stroke={borderColor}
                                        strokeWidth={strokeWidth}
                                        x={20}
                                        y={imageSize.height - 30 - fontSize}
                                        width={imageSize.width - 40}
                                        align='center'
                                        draggable
                                    />
                                </Layer>
                            </Stage>
                          )}
                        </div>

                        <div className="controls">
                            <div className="filter-group">
                                <label>Top Text</label>
                                <input
                                    type="text"
                                    placeholder="Top Text"
                                    value={topText}
                                    onChange={(e) => setTopText(e.target.value)}
                                    className="meme-input"
                                />
                            </div>
                            <div className="filter-group">
                                <label>Bottom Text</label>
                                <input
                                    type="text"
                                    placeholder="Bottom Text"
                                    value={bottomText}
                                    onChange={(e) => setBottomText(e.target.value)}
                                    className="meme-input"
                                />
                            </div>
                            <div className="filter-group">
                                <label htmlFor="font-family">Font</label>
                                <select
                                    id="font-family"
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}
                                    className="meme-input"
                                >
                                    <option value="Impact">Impact</option>
                                    <option value="Arial">Arial</option>
                                    <option value="Comic Sans MS">Comic Sans MS</option>
                                    <option value="Verdana">Verdana</option>
                                    <option value="Times New Roman">Times New Roman</option>
                                    <option value="Courier New">Courier New</option>
                                    <option value="Georgia">Georgia</option>
                                    <option value="Palatino">Palatino</option>
                                    <option value="Garamond">Garamond</option>
                                    <option value="Bookman">Bookman</option>
                                    <option value="Avant Garde">Avant Garde</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label htmlFor="font-size">Font Size</label>
                                <input
                                    type="number"
                                    id="font-size"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                                    className="meme-input"
                                />
                            </div>
                            <div className="filter-group">
                                <label htmlFor="font-color">Font Color</label>
                                <input
                                    type="color"
                                    id="font-color"
                                    value={fontColor}
                                    onChange={(e) => setFontColor(e.target.value)}
                                    className="meme-input"
                                />
                            </div>
                            <div className="filter-group">
                                <label htmlFor="border-color">Border Color</label>
                                <input
                                    type="color"
                                    id="border-color"
                                    value={borderColor}
                                    onChange={(e) => setBorderColor(e.target.value)}
                                    className="meme-input"
                                />
                            </div>
                            <div className="filter-group">
                                <label htmlFor="stroke-width">Border Width</label>
                                <input
                                    type="number"
                                    id="stroke-width"
                                    value={strokeWidth}
                                    onChange={(e) => setStrokeWidth(parseInt(e.target.value, 10))}
                                    className="meme-input"
                                />
                            </div>
                            <div className="button-group">
                                <button onClick={downloadMeme} className="btn btn-primary-tool">
                                    <FiDownload /> Download Meme
                                </button>
                                <button onClick={cancelMeme} className="btn btn-secondary-tool">
                                    <FiX /> Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemeGenerator;
