import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-left">
        <p>&copy; {new Date().getFullYear()} SmartConverter. All Rights Reserved.</p>
      </div>
      <div className="footer-right">
        <Link to="/about-us" className="footer-link">About Us</Link>
        <Link to="/privacy-notice" className="footer-link">Privacy Notice</Link>
        <Link to="/terms-and-conditions" className="footer-link">Terms & Conditions</Link>
        <Link to="/contact-us" className="footer-link">Contact Us</Link>
      </div>
    </footer>
  );
};

export default Footer;
