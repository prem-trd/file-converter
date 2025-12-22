
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Button, IconButton, List } from 'rsuite';
import { VscFilePdf, VscChevronUp, VscChevronDown, VscTrash } from "react-icons/vsc";
import './MergePdf.css';
import { FaFilePdf } from 'react-icons/fa';

const MergePdf = () => {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles
      .filter(file => file.type === 'application/pdf')
      .map(file => ({
        file,
        id: `${file.name}-${file.lastModified}`,
      }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  const moveFile = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= files.length) {
      return;
    }
    const updatedFiles = [...files];
    const [movedFile] = updatedFiles.splice(fromIndex, 1);
    updatedFiles.splice(toIndex, 0, movedFile);
    setFiles(updatedFiles);
  };

  const removeFile = index => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      alert('Please select at least two PDF files to merge.');
      return;
    }

    setIsMerging(true);
    const mergedPdf = await PDFDocument.create();

    for (const { file } of files) {
      const pdfBytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'merged.pdf';
    link.click();
    setIsMerging(false);
  };

  const truncateFilename = (name, maxLength = 30) => {
    if (name.length <= maxLength) {
      return name;
    }
    return name.substring(0, maxLength - 3) + '...';
  };

  return (
    <div className="merge-pdf-container">
      <Helmet>
        <title>Merge PDF - Combine PDF Files Online for Free</title>
        <meta name="description" content="Easily merge multiple PDF files into one document. Drag, drop, reorder, and combine your PDFs online for free with our easy-to-use tool." />
        <link rel="canonical" href={`${window.location.origin}/merge-pdf`} />
      </Helmet>
      <div className="merge-pdf-header">
        <h1 className="merge-pdf-title">Merge PDF Files</h1>
        <p className="merge-pdf-description">
          Combine multiple PDF documents into a single file. Drag and drop your files into the upload area, reorder them as needed, and click "Merge" to create your new PDF.
        </p>
      </div>

      <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
        <input {...getInputProps()} />
        <div className="dropzone-content">
          <FaFilePdf size={48} />
          <p>Drag 'n' drop PDF files here, or click to select</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="merge-pdf-file-list-container">
          <List bordered>
            {files.map((file, index) => (
              <List.Item key={file.id} index={index}>
                <div className="merge-pdf-file-item">
                  <VscFilePdf size={24} style={{ color: '#e74c3c' }} />
                  <span className="file-name" title={file.file.name}>{truncateFilename(file.file.name)}</span>
                  <div className="merge-pdf-file-item-actions">
                    <IconButton icon={<VscChevronUp />} size="xs" onClick={() => moveFile(index, index - 1)} disabled={index === 0} />
                    <IconButton icon={<VscChevronDown />} size="xs" onClick={() => moveFile(index, index + 1)} disabled={index === files.length - 1} />
                    <IconButton icon={<VscTrash />} size="xs" onClick={() => removeFile(index)} />
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
          <div className="merge-button-container">
            <Button onClick={mergePdfs} appearance="primary" color="blue" size="lg" disabled={isMerging}>
              {isMerging ? 'Merging...' : `Merge ${files.length} PDFs`}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MergePdf;
