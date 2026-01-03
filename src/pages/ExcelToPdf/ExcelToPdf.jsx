
import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDropzone } from 'react-dropzone';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { FaFileExcel, FaTrashAlt } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '../../context/AuthContext';
import { checkConversionLimit, incrementConversionCount } from '../../utils/conversionLimiter.jsx';
import './ExcelToPdf.css';

const ExcelToPdf = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            const acceptedFile = acceptedFiles[0];
            if (acceptedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || acceptedFile.name.endsWith('.xlsx')) {
                setFile(acceptedFile);
                setError(null);
            } else {
                setError('Invalid file type. Please upload a .xlsx file.');
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
        multiple: false
    });

    const handleConvertToPdf = async () => {
        if (!file) return;

        if (!currentUser && checkConversionLimit()) {
            setError("You have reached your daily conversion limit. Please sign up for unlimited conversions.");
            return;
        }

        setIsLoading(true);
        setError(null);

        if (!currentUser) {
            incrementConversionCount();
        }

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const data = event.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const htmlTable = XLSX.utils.sheet_to_html(worksheet);

                    const tempDiv = document.createElement('div');
                    tempDiv.className = 'table-container';
                    tempDiv.innerHTML = htmlTable;
                    document.body.appendChild(tempDiv);

                    const canvas = await html2canvas(tempDiv, {
                        backgroundColor: '#ffffff',
                        scale: 2,
                        useCORS: true,
                    });
                    document.body.removeChild(tempDiv);

                    const imgData = canvas.toDataURL('image/png');
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;

                    const pdf = new jsPDF({
                        orientation: 'l',
                        unit: 'px',
                        format: 'a4'
                    });

                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = pdf.internal.pageSize.getHeight();

                    const ratio = pdfWidth / imgWidth;
                    const scaledImgHeight = imgHeight * ratio;

                    let heightLeft = scaledImgHeight;
                    let position = 0;

                    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
                    heightLeft -= pdfHeight;

                    while (heightLeft > 0) {
                        position = heightLeft - scaledImgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, scaledImgHeight);
                        heightLeft -= pdfHeight;
                    }

                    pdf.save(`excel-to-pdf-smartconverter-${file.name.replace(/\.xlsx$/i, '')}.pdf`);

                } catch (err) {
                    console.error('Error processing Excel file:', err);
                    setError('Could not process the Excel file. It might be corrupt or in an unsupported format.');
                } finally {
                    setIsLoading(false);
                }
            };

            reader.onerror = () => {
                setError('Failed to read the file.');
                setIsLoading(false);
            };

            reader.readAsBinaryString(file);

        } catch (err) {
            console.error('General error:', err);
            setError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setError(null);
    };

    return (
        <div className="excel-to-pdf-container">
            <Helmet>
                <title>Excel to PDF - Convert XLSX to PDF Online for Free</title>
                <meta name="description" content="Easily convert your Microsoft Excel (.xlsx) spreadsheets to high-quality PDF files. Our online converter is fast, free, and preserves your formatting." />
                <link rel="canonical" href={`${window.location.origin}/excel-to-pdf`} />
            </Helmet>
            <div className="excel-to-pdf-header">
                <h1 className="excel-to-pdf-title">Excel to PDF Converter</h1>
                <p className="excel-to-pdf-description">
                    Convert your .xlsx spreadsheets into PDF documents.
                </p>
            </div>

            <div className="excel-to-pdf-content">
                {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}

                {!file ? (
                    <div {...getRootProps({ className: `dropzone ${isDragActive ? 'drag-over' : ''}` })}>
                        <input {...getInputProps()} />
                        <div className="dropzone-content">
                            <FaFileExcel size={48} className="dropzone-icon" />
                            <p>Drag 'n' drop a .xlsx file here, or click to select a file</p>
                        </div>
                    </div>
                ) : (
                    <div className="excel-to-pdf-display">
                        <div>
                            <FaFileExcel size={40} className="file-icon" />
                            <span>{file.name}</span>
                        </div>
                        <Button variant="light" size="sm" onClick={handleRemoveFile}>
                            <FaTrashAlt style={{ cursor: 'pointer', marginLeft: 'auto', color: '#dc3545' }} />
                        </Button>
                    </div>
                )}

                {isLoading && <div className='spinner-container'><Spinner animation="border" /></div>}

                {file && !isLoading && (
                    <div className="excel-to-pdf-button-container">
                        <Button onClick={handleConvertToPdf} size="lg">
                            Convert to PDF
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExcelToPdf;
