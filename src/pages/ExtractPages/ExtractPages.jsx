
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { Button, Alert, Spinner, Form } from 'react-bootstrap';
import { FaFilePdf, FaTrash } from 'react-icons/fa';
import { PDFDocument } from 'pdf-lib';
import { useAuth } from '../../context/AuthContext';
import { checkConversionLimit, incrementConversionCount } from '../../utils/conversionLimiter';
import './ExtractPages.css';

const ExtractPages = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pagesToExtract, setPagesToExtract] = useState(new Set());
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (!currentUser && checkConversionLimit()) {
        setError("You have reached your daily conversion limit. Please sign up for unlimited conversions.");
        return;
    }
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];

    if (selectedFile.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      setFile(null);
      setNumPages(null);
      setPagesToExtract(new Set());
      return;
    }

    setError(null);
    setSuccess(null);
    setFile(selectedFile);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setNumPages(pdfDoc.getPageCount());
      setPagesToExtract(new Set());
    } catch (e) {
      console.error(e);
      setError("Could not read the PDF file. It may be corrupted or protected.");
      setFile(null);
      setNumPages(null);
    }
  }, [currentUser]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

  const handleCheckboxChange = (pageNumber, checked) => {
    const newPagesToExtract = new Set(pagesToExtract);
    if (checked) {
      newPagesToExtract.add(pageNumber);
    } else {
      newPagesToExtract.delete(pageNumber);
    }
    setPagesToExtract(newPagesToExtract);
  };

  const handleExtract = async () => {
    if (!file || pagesToExtract.size === 0) {
      setError("Please select at least one page to extract.");
      return;
    }

    if (!currentUser) {
        incrementConversionCount();
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdfDoc = await PDFDocument.create();

      const pageIndices = Array.from(pagesToExtract).sort((a, b) => a - b).map(p => p - 1);
      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
      copiedPages.forEach(page => newPdfDoc.addPage(page));

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `extract-pages-smartconverter-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setSuccess("Pages extracted successfully! Your download should start automatically.");
      removeFile();

    } catch (e) {
      console.error(e);
      setError("An error occurred during page extraction.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setNumPages(null);
    setPagesToExtract(new Set());
    setError(null);
    setSuccess(null);
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
    <div className="extract-pages-container">
        <Helmet>
            <title>Extract PDF Pages - Select and Save Pages from your PDF</title>
            <meta name="description" content="Easily extract specific pages from your PDF documents online for free. Select the pages you want to keep and create a new PDF with just those pages." />
            <link rel="canonical" href={`${window.location.origin}/extract-pages`} />
      </Helmet>
      <div className="extract-pages-header">
        <h1 className="extract-pages-title">Extract PDF Pages</h1>
        <p className="extract-pages-description">Select and extract specific pages from your PDF file.</p>
      </div>

      <div className="extract-pages-content">
        {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
        {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

        {!file ? (
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <FaFilePdf size={48} />
              <p>Drag 'n' drop a PDF file here, or click to select a file</p>
            </div>
          </div>
        ) : (
          <div className="file-processing-area">
            <div className="extract-pages-file-list-container">
              <div className="extract-pages-file-item">
                <FaFilePdf className="pdf-icon" size={24} />
                <span className="extract-pages-file-name" title={file.name}>{truncateFilename(file.name)} ({formatBytes(file.size)})</span>
                <div className="extract-pages-file-item-actions">
                  <Button variant="link" onClick={removeFile} className="delete-button">
                    <FaTrash />
                  </Button>
                </div>
              </div>
            </div>

            {numPages !== null && (
              <div className="pages-selection-container">
                <h4 className="pages-selection-title">Select pages to extract</h4>
                <div className="pages-grid">
                  {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNumber => (
                    <Form.Check
                      key={pageNumber}
                      type="checkbox"
                      id={`page-checkbox-${pageNumber}`}
                      label={pageNumber}
                      onChange={(e) => handleCheckboxChange(pageNumber, e.target.checked)}
                      checked={pagesToExtract.has(pageNumber)}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="extract-button-container">
              <Button
                variant="primary"
                onClick={handleExtract}
                disabled={isLoading || pagesToExtract.size === 0}
                className="extract-button"
                size="lg"
              >
                {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : `Extract ${pagesToExtract.size} Pages`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtractPages;
