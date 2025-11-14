
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Button, Input, Form } from 'rsuite';
import { VscFilePdf } from "react-icons/vsc";
import './SplitPdf.css';

const SplitPdf = () => {
  const [file, setFile] = useState(null);
  const [isSplitting, setIsSplitting] = useState(false);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [totalPages, setTotalPages] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);

      const pdfBytes = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);
      setTotalPages(pdfDoc.getPageCount());
      setStartPage('1');
      setEndPage(String(pdfDoc.getPageCount()));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: false,
  });

  const handleSplit = async () => {
    if (!file || !startPage || !endPage) {
      alert('Please select a file and specify the page range.');
      return;
    }

    const start = parseInt(startPage, 10);
    const end = parseInt(endPage, 10);

    if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
      alert(`Invalid page range. Please enter a range between 1 and ${totalPages}.`);
      return;
    }

    setIsSplitting(true);

    const pdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const newPdfDoc = await PDFDocument.create();

    const pageIndices = Array.from({ length: end - start + 1 }, (_, i) => start + i - 1);
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdfDoc.addPage(page));

    const newPdfBytes = await newPdfDoc.save();
    const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `split_${file.name}`;
    link.click();

    setIsSplitting(false);
  };

  return (
    <div className="split-pdf-container">
      <div className="split-pdf-header">
        <h1 className="split-pdf-title">Split PDF</h1>
        <p className="split-pdf-description">
          Extract a range of pages from a PDF file.
        </p>
      </div>

      <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
        <input {...getInputProps()} />
        {file ? (
          <div className="file-info">
            <VscFilePdf size={40} style={{ color: '#e74c3c' }} />
            <p>{file.name}</p>
            <p>{totalPages} pages</p>
          </div>
        ) : (
          <p className="dropzone-content">Drag 'n' drop a PDF file here, or click to select a file</p>
        )}
      </div>

      {file && (
        <div className="split-options">
            <Form layout="inline">
                <Form.Group controlId="start-page">
                <Form.ControlLabel>Start Page</Form.ControlLabel>
                <Input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={startPage}
                    onChange={(value) => setStartPage(value)}
                    style={{ width: 100 }}
                />
                </Form.Group>
                <Form.Group controlId="end-page">
                <Form.ControlLabel>End Page</Form.ControlLabel>
                <Input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={endPage}
                    onChange={(value) => setEndPage(value)}
                    style={{ width: 100 }}
                />
                </Form.Group>
            </Form>
          <Button onClick={handleSplit} appearance="primary" color="blue" size="lg" disabled={isSplitting} style={{ marginTop: 20 }}>
            {isSplitting ? 'Splitting...' : 'Split PDF'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SplitPdf;
