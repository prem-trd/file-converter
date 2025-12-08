
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { FaFilePdf, FaTrash } from 'react-icons/fa';
import { PDFDocument } from 'pdf-lib';
import './CompressPdf.css';

const CompressPdf = () => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 1) {
      setError("Please upload only one PDF file at a time.");
      setFiles([]);
      return;
    }
    const file = acceptedFiles[0];
    if (file.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      setFiles([]);
      return;
    }
    setError(null);
    setSuccess(null);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

  const handleCompress = async () => {
    if (files.length === 0) {
      setError("Please select a file to compress.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const compressedPdfBytes = await pdfDoc.save();

      const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `compressed-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setSuccess("PDF compressed successfully! Your download should start automatically.");
      setFiles([]);

    } catch (e) {
      console.error(e);
      setError("An error occurred during compression. The file might be corrupted or protected.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFiles([]);
    setSuccess(null);
    setError(null);
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const truncateFilename = (name, maxLength = 30) => {
    if (name.length <= maxLength) {
      return name;
    }
    return name.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="compress-pdf-container">
      <div className="compress-pdf-header">
        <h1 className="compress-pdf-title">Compress PDF</h1>
        <p className="compress-pdf-description">Reduce the file size of your PDF files.</p>
      </div>

      <div className="compress-pdf-content">
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

        {files.length === 0 ? (
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <FaFilePdf size={48} />
              <p>Drag 'n' drop a PDF file here, or click to select a file</p>
            </div>
          </div>
        ) : (
          <div className="compress-pdf-file-list-container">
            <div className="compress-pdf-file-item">
              <FaFilePdf className="pdf-icon" size={24} />
              <span className="file-name" title={files[0].name}>{truncateFilename(files[0].name)} ({formatBytes(files[0].size)})</span>
              <div className="file-item-actions">
                <Button variant="link" onClick={removeFile} className="delete-button">
                  <FaTrash />
                </Button>
              </div>
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="compress-button-container">
            <Button
              variant="primary"
              onClick={handleCompress}
              disabled={isLoading}
              className="compress-button"
              size="lg"
            >
              {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Compress PDF'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompressPdf;
