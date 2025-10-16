import React from 'react';
import {
  Navbar,
  Nav,
  Button,
} from 'rsuite';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaFileMedical, FaFileExport, FaTrashAlt, FaFileSignature, FaSitemap, FaCompressArrowsAlt, FaTools, FaFileImage, FaFileWord, FaFilePowerpoint, FaFileExcel, FaHtml5, FaFileArchive, FaRedo, FaListOl, FaWater, FaCropAlt, FaEdit, FaUnlock, FaLock, FaSignature, FaExpand, FaMagic, FaSmile, FaPaintBrush, FaArrowsAltH, FaUserSecret
} from 'react-icons/fa';
import { IoScan, IoDocumentLockOutline, IoGitCompareOutline } from 'react-icons/io5';
import './Header.css';

const pdfToolCategories = [
    {
        title: 'ORGANIZE PDF',
        tools: [
          { key: 'merge', label: 'Merge PDF', icon: <FaFileMedical />, color: '#e53935' },
          { key: 'split', label: 'Split PDF', icon: <FaFileExport />, color: '#e53935' },
          { key: 'remove-pages', label: 'Remove pages', icon: <FaTrashAlt />, color: '#e53935' },
          { key: 'extract-pages', label: 'Extract pages', icon: <FaFileExport />, color: '#e53935' },
          { key: 'organize', label: 'Organize PDF', icon: <FaSitemap />, color: '#e53935' },
          { key: 'scan-to-pdf', label: 'Scan to PDF', icon: <IoScan />, color: '#e53935' },
        ]
      },
      {
        title: 'OPTIMIZE PDF',
        tools: [
          { key: 'compress-pdf', label: 'Compress PDF', icon: <FaCompressArrowsAlt />, color: '#43a047' },
          { key: 'repair-pdf', label: 'Repair PDF', icon: <FaTools />, color: '#43a047' },
          { key: 'ocr-pdf', label: 'OCR PDF', icon: <FaFileSignature />, color: '#43a047' },
        ]
      },
      {
        title: 'CONVERT TO PDF',
        tools: [
          { key: 'jpg-to-pdf', label: 'JPG to PDF', icon: <FaFileImage />, color: '#fdd835' },
          { key: 'word-to-pdf', label: 'WORD to PDF', icon: <FaFileWord />, color: '#1e88e5' },
          { key: 'powerpoint-to-pdf', label: 'POWERPOINT to PDF', icon: <FaFilePowerpoint />, color: '#fb8c00' },
          { key: 'excel-to-pdf', label: 'EXCEL to PDF', icon: <FaFileExcel />, color: '#43a047' },
          { key: 'html-to-pdf', label: 'HTML to PDF', icon: <FaHtml5 />, color: '#e53935' },
        ]
      },
      {
        title: 'CONVERT FROM PDF',
        tools: [
          { key: 'pdf-to-jpg', label: 'PDF to JPG', icon: <FaFileImage />, color: '#fdd835' },
          { key: 'pdf-to-word', label: 'PDF to WORD', icon: <FaFileWord />, color: '#1e88e5' },
          { key: 'pdf-to-powerpoint', label: 'PDF to POWERPOINT', icon: <FaFilePowerpoint />, color: '#fb8c00' },
          { key: 'pdf-to-excel', label: 'PDF to EXCEL', icon: <FaFileExcel />, color: '#43a047' },
          { key: 'pdf-to-pdfa', label: 'PDF to PDF/A', icon: <FaFileArchive />, color: '#757575' },
        ]
      },
      {
        title: 'EDIT PDF',
        tools: [
          { key: 'rotate-pdf', label: 'Rotate PDF', icon: <FaRedo />, color: '#5e35b1' },
          { key: 'add-page-numbers', label: 'Add page numbers', icon: <FaListOl />, color: '#5e35b1' },
          { key: 'add-watermark-pdf', label: 'Add watermark', icon: <FaWater />, color: '#5e35b1' },
          { key: 'crop-pdf', label: 'Crop PDF', icon: <FaCropAlt />, color: '#5e35b1' },
          { key: 'edit-pdf', label: 'Edit PDF', icon: <FaEdit />, color: '#5e35b1' },
        ]
      },
      {
        title: 'PDF SECURITY',
        tools: [
          { key: 'unlock-pdf', label: 'Unlock PDF', icon: <FaUnlock />, color: '#00897b' },
          { key: 'protect-pdf', label: 'Protect PDF', icon: <FaLock />, color: '#00897b' },
          { key: 'sign-pdf', label: 'Sign PDF', icon: <FaSignature />, color: '#00897b' },
          { key: 'redact-pdf', label: 'Redact PDF', icon: <IoDocumentLockOutline />, color: '#00897b' },
          { key: 'compare-pdf', label: 'Compare PDF', icon: <IoGitCompareOutline />, color: '#00897b' },
        ]
      }
];

const imageToolCategories = [
  {
      title: 'OPTIMIZE',
      tools: [
        { key: 'compress-image', label: 'Compress IMAGE', icon: <FaCompressArrowsAlt />, color: '#43a047' },
        { key: 'upscale-image', label: 'Upscale', icon: <FaExpand />, color: '#43a047' },
        { key: 'remove-background', label: 'Remove background', icon: <FaMagic />, color: '#43a047' },
      ]
    },
    {
      title: 'CREATE',
      tools: [
        { key: 'meme-generator', label: 'Meme generator', icon: <FaSmile />, color: '#5e35b1' },
        { key: 'photo-editor', label: 'Photo editor', icon: <FaPaintBrush />, color: '#5e35b1' },
      ]
    },
    {
      title: 'MODIFY',
      tools: [
        { key: 'resize-image', label: 'Resize IMAGE', icon: <FaArrowsAltH />, color: '#1e88e5' },
        { key: 'crop-image', label: 'Crop IMAGE', icon: <FaCropAlt />, color: '#1e88e5' },
        { key: 'rotate-image', label: 'Rotate IMAGE', icon: <FaRedo />, color: '#1e88e5' },
      ]
    },
    {
      title: 'CONVERT',
      tools: [
        { key: 'convert-to-jpg', label: 'Convert to JPG', icon: <FaFileImage />, color: '#fdd835' },
        { key: 'convert-from-jpg', label: 'Convert from JPG', icon: <FaFileImage />, color: '#fdd835' },
        { key: 'html-to-image', label: 'HTML to IMAGE', icon: <FaHtml5 />, color: '#fdd835' },
      ]
    },
    {
      title: 'SECURITY',
      tools: [
        { key: 'watermark-image', label: 'Watermark IMAGE', icon: <FaWater />, color: '#00897b' },
        { key: 'blur-face', label: 'Blur face', icon: <FaUserSecret />, color: '#00897b' },
      ]
    }
];

const ToolsDropdown = ({ title, toolCategories, activeKey }) => (
  <Nav.Menu title={title} trigger="hover">
    <div className="tools-dropdown-container">
      {toolCategories.map(category => (
        <div className="tool-category-column" key={category.title}>
          <h6 className="tool-category-title">{category.title}</h6>
          <Nav vertical>
              {category.tools.map(tool => (
                  <Nav.Item 
                      as={Link} 
                      to={`/${tool.key}`} 
                      key={tool.key} 
                      eventKey={`/${tool.key}`} 
                      className="tool-link-item"
                  >
                      <div className="tool-link-content">
                          <span className="tool-icon" style={{ color: tool.color }}>{tool.icon}</span>
                          <span className="tool-label">{tool.label}</span>
                      </div>
                  </Nav.Item>
              ))}
          </Nav>
        </div>
      ))}
    </div>
  </Nav.Menu>
);

const CustomNavbar = ({ activeKey, ...props }) => {
  return (
    <Navbar {...props} className="custom-navbar">
      <Navbar.Brand as={Link} to="/">
        <img src="/logo.svg" alt="logo" height="24" />
      </Navbar.Brand>
      <Nav activeKey={activeKey} style={{ flex: 1 }}>
        <ToolsDropdown title="ALL PDF TOOLS" toolCategories={pdfToolCategories} activeKey={activeKey} />
        <ToolsDropdown title="ALL IMAGE TOOLS" toolCategories={imageToolCategories} activeKey={activeKey} />
      </Nav>
      <div className="navbar-actions">
        <Button appearance="subtle" as={Link} to="/signin">Login</Button>
        <Button appearance="primary" color="red" as={Link} to="/signin">Sign up</Button>
      </div>
    </Navbar>
  );
};

export default function Header() {
  const location = useLocation();
  
  return (
      <CustomNavbar activeKey={location.pathname} />
  );
}
