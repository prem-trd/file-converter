import React from 'react';
import { Helmet } from 'react-helmet-async';
import './PrivacyNotice.css';

const PrivacyNotice = () => {
  return (
    <div className="privacy-container">
      <Helmet>
        <title>Privacy Policy - Image & PDF Tools</title>
        <meta name="description" content="Read the privacy policy for Image & PDF Tools. We are committed to protecting your privacy and handling your data responsibly." />
        <link rel="canonical" href={`${window.location.origin}/privacy-policy`} />
      </Helmet>
      <h1>Privacy Policy</h1>

      <p>
        <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
      </p>

      <p>
        This Privacy Policy explains how <strong>Image & PDF Tools</strong>
        (“we”, “our”, or “us”) handles information when you use our website.
        We are an independently developed service and respect your privacy.
      </p>

      <h2>1. Introduction</h2>
      <p>
        Image & PDF Tools provides online utilities for converting and managing
        image and PDF files. Your privacy is important to us, and this policy
        outlines what information we do and do not collect when you use our
        website.
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We do <strong>not</strong> collect personal information such as your
        name, email address, phone number, or payment details.
      </p>

      <p>
        Files uploaded for conversion are processed automatically. We do not
        permanently store, review, or share your files.
      </p>

      <h2>3. File Processing & Security</h2>
      <p>
        All file processing is performed either directly in your browser or
        temporarily on secure servers only for the purpose of completing the
        requested operation.
      </p>
      <p>
        Uploaded files are automatically deleted after processing or within a
        short time period. We do not retain copies of your files.
      </p>

      <h2>4. How We Use Information</h2>
      <p>
        Since we do not collect personal data, your information is not used for
        marketing, profiling, or resale. Limited non-personal information may
        be used to improve website performance and reliability.
      </p>

      <h2>5. Cookies & Analytics</h2>
      <p>
        We may use basic cookies or third-party tools (such as analytics or
        advertising services) to understand website usage and improve user
        experience.
      </p>
      <p>
        You can control or disable cookies through your browser settings.
      </p>

      <h2>6. Third-Party Services</h2>
      <p>
        Our website may use third-party services such as hosting providers,
        analytics tools, or advertising networks. These services may collect
        data according to their own privacy policies.
      </p>

      <h2>7. Children’s Privacy</h2>
      <p>
        This website is not intended for children under the age of 13. We do not
        knowingly collect personal information from children.
      </p>

      <h2>8. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with an updated effective date.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us through the website.
      </p>
    </div>
  );
};

export default PrivacyNotice;
