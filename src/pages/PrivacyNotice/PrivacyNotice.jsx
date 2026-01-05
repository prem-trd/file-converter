import React from 'react';
import { Helmet } from 'react-helmet-async';
import './PrivacyNotice.css';

const PrivacyNotice = () => {
  const effectiveDate = "25 December 2025";

  return (
    <div className="privacy-container">
      <Helmet>
        <title>Privacy Policy | SmartConverter</title>
        <meta
          name="description"
          content="Read SmartConverter’s privacy policy to understand how we handle data, files, cookies, analytics, and user privacy."
        />
        <link
          rel="canonical"
          href={`${window.location.origin}/privacy-policy`}
        />
      </Helmet>

      <h1>Privacy Policy</h1>

      <p>
        <strong>Effective Date:</strong> {effectiveDate}
      </p>

      <p>
        This Privacy Policy explains how <strong>SmartConverter</strong>
        (“we”, “our”, or “us”) handles information when you use our website.
        We are an independently developed service and are committed to
        protecting your privacy.
      </p>

      <h2>1. Introduction</h2>
      <p>
        SmartConverter provides online utilities for converting and managing
        PDF and image files. Your privacy is important to us, and this policy
        outlines what information we do and do not collect.
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
        File processing is performed either directly in your browser or
        temporarily on secure servers solely for completing the requested
        operation.
      </p>
      <p>
        Uploaded files are automatically deleted after processing or within a
        short period. We do not retain copies of your files.
      </p>

      <h2>4. How We Use Information</h2>
      <p>
        Since we do not collect personal data, your information is not used for
        marketing, profiling, or resale. Limited non-personal information may
        be used to improve website performance and reliability.
      </p>

      <h2>5. Cookies & Analytics</h2>
      <p>
        SmartConverter uses cookies and third-party tools such as Google
        Analytics to understand website usage and improve user experience.
        These cookies may collect non-personal information such as browser
        type, device, and pages visited.
      </p>
      <p>
        You can control or disable cookies through your browser settings.
      </p>

      <h2>6. Advertising</h2>
      <p>
        We may display advertisements through third-party advertising partners
        such as Google AdSense. These partners may use cookies or similar
        technologies to show relevant ads based on user activity.
      </p>

      <h2>7. Third-Party Services</h2>
      <p>
        Our website may use third-party services such as hosting providers,
        analytics tools, or advertising networks. These services operate under
        their own privacy policies, and SmartConverter is not responsible for
        their practices.
      </p>

      <h2>8. Children’s Privacy</h2>
      <p>
        This website is not intended for children under the age of 13. We do
        not knowingly collect personal information from children.
      </p>

      <h2>9. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Any changes will
        be posted on this page with an updated effective date.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy, please
        contact us through the <a href="/contact-us">Contact Us</a> page.
      </p>
    </div>
  );
};

export default PrivacyNotice;
