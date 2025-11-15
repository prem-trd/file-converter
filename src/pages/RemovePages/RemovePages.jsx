
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button, Alert, Spinner, Form } from 'react-bootstrap';
import { FaFilePdf, FaTrash } from 'react-icons/fa';
import { PDFDocument } from 'pdf-lib';
import './RemovePages.css';

const RemovePages = () => {
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pagesToRemove, setPagesToRemove] = useState(new Set());
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];

    if (selectedFile.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      setFile(null);
      setNumPages(null);
      setPagesToRemove(new Set());
      return;
    }

    setError(null);
    setSuccess(null);
    setFile(selectedFile);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setNumPages(pdfDoc.getPageCount());
      setPagesToRemove(new Set());
    } catch (e) {
        console.error(e);
        setError("Could not read the PDF file. It may be corrupted or protected.");
        setFile(null);
        setNumPages(null);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

  const handleCheckboxChange = (pageNumber, checked) => {
    const newPagesToRemove = new Set(pagesToRemove);
    if (checked) {
      newPagesToRemove.add(pageNumber);
    } else {
      newPagesToRemove.delete(pageNumber);
    }
    setPagesToRemove(newPagesToRemove);
  };

  const handleRemove = async () => {
    if (!file || pagesToRemove.size === 0) {
      setError("Please select at least one page to remove.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Create a new document and copy over the pages we want to keep
      const newPdfDoc = await PDFDocument.create();
      const totalPages = pdfDoc.getPageCount();
      const pagesToKeepIndices = Array.from({ length: totalPages }, (_, i) => i)
        .filter(i => !pagesToRemove.has(i + 1));

      if (pagesToKeepIndices.length === totalPages) {
        setError("No pages were selected for removal.");
        setIsLoading(false);
        return;
      }

      if (pagesToKeepIndices.length === 0) {
        setError("You cannot remove all pages from the document.");
        setIsLoading(false);
        return;
      }

      const copiedPages = await newPdfDoc.copyPages(pdfDoc, pagesToKeepIndices);
      copiedPages.forEach(page => newPdfDoc.addPage(page));

      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `removed-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      setSuccess(`Successfully removed ${pagesToRemove.size} page(s)! Your download should start automatically.`);
      removeFile();

    } catch (e) {
      console.error(e);
      setError("An error occurred during page removal.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setNumPages(null);
    setPagesToRemove(new Set());
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

  return (
    <div className="remove-pages-container">
        <div className="remove-pages-header">
            <h1 className="remove-pages-title">Remove PDF Pages</h1>
            <p className="remove-pages-description">Select and remove specific pages from your PDF file.</p>
        </div>

        <div className="remove-pages-content">
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
                    <div className="file-list-container">
                        <div className="file-item">
                            <FaFilePdf className="pdf-icon" size={24}/>
                            <span className="file-name" title={file.name}>{file.name} ({formatBytes(file.size)})</span>
                            <div className="file-item-actions">
                                <Button variant="link" onClick={removeFile} className="delete-button">
                                    <FaTrash />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {numPages !== null && (
                      <div className="pages-selection-container">
                        <h4 className="pages-selection-title">Select pages to remove</h4>
                        <div className="pages-grid">
                          {Array.from({ length: numPages }, (_, i) => i + 1).map(pageNumber => (
                            <Form.Check 
                              key={pageNumber}
                              type="checkbox"
                              id={`page-checkbox-${pageNumber}`}
                              label={pageNumber}
                              onChange={(e) => handleCheckboxChange(pageNumber, e.target.checked)}
                              checked={pagesToRemove.has(pageNumber)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="remove-button-container">
                        <Button
                            variant="primary"
                            onClick={handleRemove}
                            disabled={isLoading || pagesToRemove.size === 0}
                            className="remove-button"
                            size="lg"
                        >
                            {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : `Remove ${pagesToRemove.size} Pages`}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default RemovePages;
