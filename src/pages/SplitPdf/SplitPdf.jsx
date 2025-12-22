
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { FaFilePdf, FaTrash, FaPlus } from 'react-icons/fa';
import JSZip from 'jszip';
import './SplitPdf.css';

const SplitPdf = () => {
  const [file, setFile] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [ranges, setRanges] = useState([{ from: '', to: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    const selectedFile = acceptedFiles[0];

    if (selectedFile.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      setFile(null);
      setTotalPages(0);
      return;
    }

    setError(null);
    setSuccess(null);
    setFile(selectedFile);
    setIsLoading(true);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pageCount = pdfDoc.getPageCount();
      setTotalPages(pageCount);
      setRanges([{ from: '1', to: String(pageCount) }]);
    } catch (e) {
      console.error(e);
      setError("Could not read the PDF file. It may be corrupted.");
      setFile(null);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

  const handleRangeChange = (index, field, value) => {
    const newRanges = [...ranges];
    // Ensure value doesn't exceed total pages
    const numValue = parseInt(value, 10);
    if (value === '' || (numValue >= 1 && numValue <= totalPages)) {
      newRanges[index][field] = value;
      setRanges(newRanges);
    } else if (numValue > totalPages) {
      newRanges[index][field] = String(totalPages);
      setRanges(newRanges);
    } else if (numValue < 1 && value !== '') {
      newRanges[index][field] = '1';
      setRanges(newRanges);
    }
  };

  const addRange = () => setRanges([...ranges, { from: '', to: '' }]);
  const removeRange = (index) => setRanges(ranges.filter((_, i) => i !== index));

  const handleSplit = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const zip = new JSZip();
      let validRanges = 0;

      for (const range of ranges) {
        const from = parseInt(range.from, 10);
        const to = parseInt(range.to, 10) || from;

        if (isNaN(from) || isNaN(to) || from < 1 || to > totalPages || from > to) {
          continue; // Skip invalid ranges
        }

        validRanges++;
        const newPdfDoc = await PDFDocument.create();
        const indices = Array.from({ length: to - from + 1 }, (_, i) => from - 1 + i);
        const copiedPages = await newPdfDoc.copyPages(pdfDoc, indices);
        copiedPages.forEach(page => newPdfDoc.addPage(page));
        const pdfBytes = await newPdfDoc.save();
        zip.file(`${file.name.replace('.pdf', '')}-p${from}-${to}.pdf`, pdfBytes);
      }

      if (validRanges === 0) {
        setError("No valid page ranges to split.");
        setIsLoading(false);
        return;
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `${file.name.replace('.pdf', '')}_split.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess('PDF split successfully! Check your downloads.');
      removeFile();

    } catch (e) {
      console.error(e);
      setError("An error occurred while splitting the PDF.");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setTotalPages(0);
    setRanges([{ from: '', to: '' }]);
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
    <div className="split-pdf-container">
      <Helmet>
        <title>Split PDF - Extract Pages from PDF Files Online</title>
        <meta name="description" content="Easily split a PDF into multiple documents by defining page ranges. Our online tool lets you extract specific pages from your PDF for free." />
        <link rel="canonical" href={`${window.location.origin}/split-pdf`} />
      </Helmet>
      <div className="split-pdf-header">
        <h1 className="split-pdf-title">Split PDF</h1>
        <p className="split-pdf-description">Define page ranges to split your PDF into multiple documents.</p>
      </div>
      <div className="split-pdf-content">
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
          <div className="split-pdf-file-processing-area">
            <div className="split-pdf-file-list-container">
              <div className="split-pdf-file-item">
                <FaFilePdf className="pdf-icon" size={24} />
                <span className="split-pdf-file-name" title={file.name}>{truncateFilename(file.name)} ({formatBytes(file.size)})</span>
                <div className="file-item-actions">
                  <Button variant="link" onClick={removeFile} className="delete-button"><FaTrash /></Button>
                </div>
              </div>
            </div>

            <div className="split-pdf-ranges-container">
              <h4 className="split-pdf-ranges-title">Define Split Ranges (Total pages: {totalPages})</h4>
              {ranges.map((range, index) => (
                <Form.Group key={index} className="split-pdf-range-item">
                  <Form.Control
                    type="number"
                    placeholder="From"
                    value={range.from}
                    onChange={e => handleRangeChange(index, 'from', e.target.value)}
                    min="1"
                    max={totalPages}
                  />
                  <span className="split-pdf-range-separator">-</span>
                  <Form.Control
                    type="number"
                    placeholder="To"
                    value={range.to}
                    onChange={e => handleRangeChange(index, 'to', e.target.value)}
                    min="1"
                    max={totalPages}
                  />
                  <Button variant="danger" onClick={() => removeRange(index)} className="split-pdf-remove-range-btn"><FaTrash /></Button>
                </Form.Group>
              ))}
              <Button variant="secondary" onClick={addRange} className="split-pdf-add-range-btn"><FaPlus /> Add Range</Button>
            </div>

            <div className="split-pdf-split-button-container">
              <Button onClick={handleSplit} disabled={isLoading} size="lg">
                {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Split PDF'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitPdf;
