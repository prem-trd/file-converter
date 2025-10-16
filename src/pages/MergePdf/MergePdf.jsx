
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Button, IconButton } from 'rsuite';
import { FaFilePdf, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './MergePdf.css';

const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);

  const onDrop = useCallback(acceptedFiles => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    setFiles(prevFiles => [...prevFiles, ...pdfFiles]);
    setMergedPdfUrl(null); // Reset on new file drop
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

  const removeFile = index => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      alert('Please select at least two PDF files to merge.');
      return;
    }

    const mergedDoc = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedDoc.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedDoc.addPage(page));
    }

    const mergedPdfBytes = await mergedDoc.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setMergedPdfUrl(url);
  };

  return (
    <div className="merge-pdf-container">
      <div className="merge-pdf-header">
        <h1 className="merge-pdf-title">Merge PDF Files</h1>
        <p className="merge-pdf-description">
          Combine multiple PDF documents into a single file. Drag and drop your files into the upload area, reorder them as needed, and click "Merge" to create your new PDF.
        </p>
      </div>

      <div className="upload-card">
        <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
          <input {...getInputProps()} />
          <p className="dropzone-content">Drag 'n' drop PDF files here, or click to select</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="file-list-container">
          <ul className="file-list">
            {files.map((file, index) => (
              <li key={index} className="file-item">
                <FaFilePdf size={24} color="#e74c3c" />
                <span className="file-name" title={file.name}>{file.name}</span>
                <div className="file-item-actions">
                  <IconButton icon={<FaArrowUp />} onClick={() => moveFile(index, -1)} disabled={index === 0} size="sm" appearance="subtle" />
                  <IconButton icon={<FaArrowDown />} onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} size="sm" appearance="subtle" />
                  <IconButton icon={<FaTrash />} onClick={() => removeFile(index)} size="sm" color="red" appearance="subtle" />
                </div>
              </li>
            ))}
          </ul>
          <div className="merge-button-container">
            <Button onClick={mergePdfs} appearance="primary" color="blue" size="lg" block>
              Merge {files.length} PDFs
            </Button>
          </div>
        </div>
      )}

      {mergedPdfUrl && (
        <div style={{ marginTop: '20px' }}>
          <a href={mergedPdfUrl} download="merged.pdf">
            <Button appearance="primary" color="green" size="lg">Download Merged PDF</Button>
          </a>
        </div>
      )}
    </div>
  );
};

export default MergePdf;
