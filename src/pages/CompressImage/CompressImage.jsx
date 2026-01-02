
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { Form, Row, Col, Spinner } from 'react-bootstrap';
import imageCompression from 'browser-image-compression';
import { saveAs } from 'file-saver';
import { Uploader, Button as RsuiteButton, Message, toaster, Progress } from 'rsuite';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import TrashIcon from '@rsuite/icons/Trash';
import './CompressImage.css';
import { FaFileImage } from 'react-icons/fa';

const CompressImage = () => {
    const [originalFile, setOriginalFile] = useState(null);
    const [originalPreview, setOriginalPreview] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);
    const [compressedPreview, setCompressedPreview] = useState(null);
    const [quality, setQuality] = useState(80);
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        toaster.clear();
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (!file.type.startsWith('image/')) {
                toaster.push(<Message type="error" closable>Please upload a valid image file.</Message>);
                return;
            }
            setOriginalFile(file);
            setOriginalPreview(URL.createObjectURL(file));
            setCompressedFile(null);
            setCompressedPreview(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1 });

    const handleCompress = async () => {
        if (!originalFile) {
            toaster.push(<Message type="error" closable>Please upload an image first.</Message>);
            return;
        }

        setIsLoading(true);
        toaster.clear();

        const options = {
            maxSizeMB: 2,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            quality: quality / 100
        }

        try {
            const compressed = await imageCompression(originalFile, options);
            setCompressedFile(compressed);
            setCompressedPreview(URL.createObjectURL(compressed));
            toaster.push(<Message type="success" closable>Image compressed successfully!</Message>);
        } catch (error) {
            console.error(error);
            toaster.push(<Message type="error" closable>Failed to compress image.</Message>);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = () => {
        if (!compressedFile) {
            toaster.push(<Message type="error" closable>No compressed image to download.</Message>);
            return;
        }
        saveAs(compressedFile, `compress-image-smartconverter-${originalFile.name}`);
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    const clearState = () => {
        setOriginalFile(null);
        setOriginalPreview(null);
        setCompressedFile(null);
        setCompressedPreview(null);
        toaster.clear();
    }

    return (
        <div className="compress-image-container">
            <Helmet>
                <title>Compress Image - Online Image Compressor to Reduce File Size</title>
                <meta name="description" content="Easily compress your images online to reduce their file size without losing quality. Our free image compressor works with JPG, PNG, and other formats." />
                <link rel="canonical" href={`${window.location.origin}/compress-image`} />
            </Helmet>
            <div className="compress-image-header">
                <h1 className="compress-image-title">Image Compressor</h1>
                <p className="compress-image-description">Reduce the file size of your images with our easy-to-use compression tool.</p>
            </div>
            <div className="compress-content">
                {!originalFile ? (
                    <div {...getRootProps({ className: `dropzone` })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFileImage size={48} />
                            <p>Drag & drop an image here, or click to select a file</p>
                        </div>
                    </div>
                ) : (
                    <div className="file-processing-area">
                        <div className="compress-image-file-list-container">
                            <div className="compress-image-file-item">
                                <span className="file-name">{originalFile.name}</span>
                                <RsuiteButton appearance="subtle" icon={<TrashIcon />} onClick={clearState} />
                            </div>
                        </div>
                        <Row className="g-5 preview-section">
                            <Col md={12} lg={6} className="image-preview-container">
                                <h3>Original Image</h3>
                                <img src={originalPreview} alt="Original" className="preview-image" />
                                {originalFile && <p>Size: {formatBytes(originalFile.size)}</p>}
                            </Col>
                            <Col md={12} lg={6} className="image-preview-container">
                                <h3>Compressed Image</h3>
                                {isLoading ? (
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <Progress.Circle percent={30} strokeColor="#ffc107" />
                                    </div>
                                ) : (
                                    compressedPreview ? (
                                        <img src={compressedPreview} alt="Compressed" className="preview-image" />
                                    ) : (
                                        <div className="empty-preview d-flex justify-content-center align-items-center"><p>Your compressed image will appear here.</p></div>
                                    )
                                )}
                                {compressedFile && <p>Size: {formatBytes(compressedFile.size)}</p>}
                            </Col>
                        </Row>
                    </div>
                )}

                {originalFile && (
                    <div className="controls-section">
                        <Form.Group as={Row} className="mb-3 align-items-center">
                            <Col xs="auto">
                                <Form.Label>Compression Quality: {quality}</Form.Label>
                            </Col>
                            <Col>
                                <Form.Range value={quality} onChange={e => setQuality(parseInt(e.target.value))} min={1} max={100} />
                            </Col>
                        </Form.Group>
                        <div className="d-flex gap-2 justify-content-center">
                            <RsuiteButton appearance="primary" onClick={handleCompress} loading={isLoading}>
                                Compress Image
                            </RsuiteButton>
                            {compressedFile && <RsuiteButton appearance="ghost" icon={<FileDownloadIcon />} onClick={handleDownload}>Download Compressed Image</RsuiteButton>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompressImage;
