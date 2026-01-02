
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { Button, Input, InputGroup, List, IconButton, Message, toaster } from 'rsuite';
import { VscFilePdf, VscLock, VscTrash } from "react-icons/vsc";
import { PDFDocument, Permissions } from 'pdf-lib';
import './ProtectPdf.css';

const ProtectPdf = () => {
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            if (selectedFile.type !== 'application/pdf') {
                toaster.push(<Message type="error" closable>Please upload a valid PDF file.</Message>);
                return;
            }
            setFile(selectedFile);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] }, maxFiles: 1 });

    const handleProtectPdf = async () => {
        if (!file || !password) {
            toaster.push(<Message type="error" closable>Please select a file and enter a password.</Message>);
            return;
        }
        setIsLoading(true);

        try {
            const pdfBytes = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(pdfBytes);

            await pdfDoc.encrypt({ // Correctly await the encryption
                userPassword: password,
                ownerPassword: password, // You can set a different owner password if needed
                permissions: [
                    Permissions.Printing,
                    Permissions.Copying,
                    Permissions.Modifying,
                ],
            });

            const protectedPdfBytes = await pdfDoc.save();
            const blob = new Blob([protectedPdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            
            const originalFilename = file.name.endsWith('.pdf') ? file.name.slice(0, -4) : file.name;
            link.download = `protect-pdf-smartconverter-${originalFilename}.pdf`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

            toaster.push(<Message type="success" closable>{`Successfully protected and downloaded ${file.name}`}</Message>);
            setFile(null);
            setPassword('');
        } catch (error) {
            console.error(error);
            toaster.push(<Message type="error" closable>Failed to protect the PDF. Please try again.</Message>);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    const truncateFilename = (name, maxLength = 30) => {
        if (name.length <= maxLength) {
          return name;
        }
        return name.substring(0, maxLength - 3) + '...';
      };

    return (
        <div className="protect-pdf-container">
             <Helmet>
                <title>Protect PDF - Add Password to Your PDF</title>
                <meta name="description" content="Secure your PDF files by adding a password. Our free online tool allows you to encrypt your PDF, preventing unauthorized access." />
                 <link rel="canonical" href={`${window.location.origin}/protect-pdf`} />
            </Helmet>
            <div className="protect-pdf-header">
                <h1 className="protect-pdf-title">Protect PDF File</h1>
                <p className="protect-pdf-description">
                    Encrypt and add a password to your PDF file to keep it secure.
                </p>
            </div>

            {!file && (
                 <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
                    <input {...getInputProps()} />
                    <p className="dropzone-content">Drag 'n' drop a PDF file here, or click to select</p>
                </div>
            )}

            {file && (
                <div className="protect-pdf-file-list-container">
                    <List bordered>
                        <List.Item>
                            <div className="protect-pdf-file-item">
                                <VscFilePdf size={24} style={{ color: '#e74c3c' }} />
                                <span className="file-name" title={file.name}>{truncateFilename(file.name)}</span>
                                <div className="protect-pdf-file-item-actions">
                                    <IconButton icon={<VscTrash />} size="xs" onClick={removeFile} />
                                </div>
                            </div>
                        </List.Item>
                    </List>

                    <div className="protect-pdf-options">
                         <InputGroup>
                            <InputGroup.Addon>
                                <VscLock />
                            </InputGroup.Addon>
                            <Input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={setPassword}
                                autoComplete="new-password"
                            />
                        </InputGroup>
                    </div>

                    <div className="protect-button-container">
                        <Button onClick={handleProtectPdf} appearance="primary" color="blue" size="lg" loading={isLoading} disabled={!password}>
                           {isLoading ? 'Protecting...' : 'Protect PDF'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProtectPdf;
