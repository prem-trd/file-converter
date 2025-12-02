
import React from 'react';
import {
  FaFileMedical, FaFileExport, FaTrashAlt, FaFileSignature, FaSitemap, FaCompressArrowsAlt, FaTools, FaFileImage, FaFileWord, FaFilePowerpoint, FaFileExcel, FaHtml5, FaFileArchive, FaRedo, FaListOl, FaWater, FaCropAlt, FaEdit, FaUnlock, FaLock, FaSignature, FaExpand, FaMagic, FaSmile, FaPaintBrush, FaArrowsAltH, FaUserSecret
} from 'react-icons/fa';
import { IoScan, IoDocumentLockOutline, IoGitCompareOutline } from 'react-icons/io5';

export const pdfToolCategories = [
  {
    title: 'ORGANIZE PDF',
    tools: [
      { key: 'merge-pdf', label: 'Merge PDF', description: 'Combine multiple PDFs into one.', icon: <FaFileMedical />, color: '#e53935' },
      { key: 'split-pdf', label: 'Split PDF', description: 'Extract pages from a PDF.', icon: <FaFileExport />, color: '#e53935' },
      { key: 'remove-pages', label: 'Remove pages', description: 'Delete specific pages from a PDF.', icon: <FaTrashAlt />, color: '#e53935' },
      { key: 'extract-pages', label: 'Extract pages', description: 'Select and create a new PDF from pages.', icon: <FaFileExport />, color: '#e53935' },
      { key: 'organize-pdf', label: 'Organize PDF', description: 'Sort, add, or delete PDF pages.', icon: <FaSitemap />, color: '#e53935' },
      // { key: 'scan-to-pdf', label: 'Scan to PDF', description: 'Scan documents directly to PDF.', icon: <IoScan />, color: '#e53935' },
    ]
  },
  {
    title: 'OPTIMIZE PDF',
    tools: [
      { key: 'compress-pdf', label: 'Compress PDF', description: 'Reduce the file size of your PDF.', icon: <FaCompressArrowsAlt />, color: '#43a047' },
      { key: 'repair-pdf', label: 'Repair PDF', description: 'Fix corrupted or damaged PDFs.', icon: <FaTools />, color: '#43a047' },
      // { key: 'ocr-pdf', label: 'OCR PDF', description: 'Convert scanned PDFs into searchable text.', icon: <FaFileSignature />, color: '#43a047' },
    ]
  },
  {
    title: 'CONVERT TO PDF',
    tools: [
      { key: 'jpg-to-pdf', label: 'JPG to PDF', description: 'Convert JPG images to PDF.', icon: <FaFileImage />, color: '#fdd835' },
      { key: 'word-to-pdf', label: 'WORD to PDF', description: 'Convert Word documents to PDF.', icon: <FaFileWord />, color: '#1e88e5' },
      // { key: 'powerpoint-to-pdf', label: 'POWERPOINT to PDF', description: 'Convert Powerpoint presentations to PDF.', icon: <FaFilePowerpoint />, color: '#fb8c00' },
      { key: 'excel-to-pdf', label: 'EXCEL to PDF', description: 'Convert Excel spreadsheets to PDF.', icon: <FaFileExcel />, color: '#43a047' },
      // { key: 'html-to-pdf', label: 'HTML to PDF', description: 'Convert webpages to PDF.', icon: <FaHtml5 />, color: '#e53935' },
    ]
  },
  // {
  //   title: 'CONVERT FROM PDF',
  //   tools: [
  //     { key: 'pdf-to-jpg', label: 'PDF to JPG', description: 'Convert PDF pages to JPG images.', icon: <FaFileImage />, color: '#fdd835' },
  //     { key: 'pdf-to-word', label: 'PDF to WORD', description: 'Convert PDF to editable Word documents.', icon: <FaFileWord />, color: '#1e88e5' },
  //     { key: 'pdf-to-powerpoint', label: 'PDF to POWERPOINT', description: 'Convert PDF to editable Powerpoint presentations.', icon: <FaFilePowerpoint />, color: '#fb8c00' },
  //     { key: 'pdf-to-excel', label: 'PDF to EXCEL', description: 'Convert PDF to editable Excel spreadsheets.', icon: <FaFileExcel />, color: '#43a047' },
  //     { key: 'pdf-to-pdfa', label: 'PDF to PDF/A', description: 'Convert PDF to the archival format.', icon: <FaFileArchive />, color: '#757575' },
  //   ]
  // },
  {
    title: 'EDIT PDF',
    tools: [
      { key: 'add-page-numbers', label: 'Add page numbers', description: 'Insert page numbers into your PDF.', icon: <FaListOl />, color: '#5e35b1' },
      { key: 'add-watermark-pdf', label: 'Add watermark', description: 'Add a text or image watermark to your PDF.', icon: <FaWater />, color: '#5e35b1' },
      { key: 'crop-pdf', label: 'Crop PDF', description: 'Trim the margins of your PDF pages.', icon: <FaCropAlt />, color: '#5e35b1' },
      // { key: 'edit-pdf', label: 'Edit PDF', description: 'Edit the text and images in your PDF.', icon: <FaEdit />, color: '#5e35b1' },
    ]
  },
  {
    title: 'PDF SECURITY',
    tools: [
      { key: 'unlock-pdf', label: 'Unlock PDF', description: 'Remove passwords and restrictions from PDFs.', icon: <FaUnlock />, color: '#00897b' },
      { key: 'protect-pdf', label: 'Protect PDF', description: 'Add a password to your PDF.', icon: <FaLock />, color: '#00897b' },
      { key: 'sign-pdf', label: 'Sign PDF', description: 'Create and add your signature to a PDF.', icon: <FaSignature />, color: '#00897b' },
      // { key: 'redact-pdf', label: 'Redact PDF', description: 'Permanently remove sensitive content from your PDF.', icon: <IoDocumentLockOutline />, color: '#00897b' },
      // { key: 'compare-pdf', label: 'Compare PDF', description: 'Compare two PDFs to see the differences.', icon: <IoGitCompareOutline />, color: '#00897b' },
    ]
  }
];

export const imageToolCategories = [
  {
    title: 'OPTIMIZE',
    tools: [
      { key: 'compress-image', label: 'Compress IMAGE', description: 'Reduce the file size of your images.', icon: <FaCompressArrowsAlt />, color: '#43a047' },
      // { key: 'upscale-image', label: 'Upscale', description: 'Increase the resolution of your images.', icon: <FaExpand />, color: '#43a047' },
      // { key: 'remove-background', label: 'Remove background', description: 'Automatically remove the background from an image.', icon: <FaMagic />, color: '#43a047' },
    ]
  },
  {
    title: 'CREATE',
    tools: [
      { key: 'meme-generator', label: 'Meme generator', description: 'Create your own memes.', icon: <FaSmile />, color: '#5e35b1' },
      { key: 'photo-editor', label: 'Photo editor', description: 'Edit and enhance your photos.', icon: <FaPaintBrush />, color: '#5e35b1' },
    ]
  },
  {
    title: 'MODIFY',
    tools: [
      { key: 'resize-image', label: 'Resize IMAGE', description: 'Change the dimensions of your images.', icon: <FaArrowsAltH />, color: '#1e88e5' },
      { key: 'crop-image', label: 'Crop IMAGE', description: 'Trim your images to the perfect size.', icon: <FaCropAlt />, color: '#1e88e5' },
      { key: 'rotate-image', label: 'Rotate IMAGE', description: 'Rotate your images.', icon: <FaRedo />, color: '#1e88e5' },
    ]
  },
  {
    title: 'CONVERT',
    tools: [
      { key: 'convert-to-jpg', label: 'Convert to JPG', description: 'Convert other image formats to JPG.', icon: <FaFileImage />, color: '#fdd835' },
      { key: 'convert-from-jpg', label: 'Convert from JPG', description: 'Convert JPG images to other formats.', icon: <FaFileImage />, color: '#fdd835' },
      { key: 'html-to-image', label: 'HTML to IMAGE', description: 'Convert webpages to images.', icon: <FaHtml5 />, color: '#fdd835' },
    ]
  },
  {
    title: 'SECURITY',
    tools: [
      { key: 'watermark-image', label: 'Watermark IMAGE', description: 'Add a text or image watermark to your images.', icon: <FaWater />, color: '#00897b' },
      { key: 'blur-face', label: 'Blur face', description: 'Blur faces in your images to protect privacy.', icon: <FaUserSecret />, color: '#00897b' },
    ]
  }
];
