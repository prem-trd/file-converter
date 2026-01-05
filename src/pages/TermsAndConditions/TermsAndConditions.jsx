import React from 'react';
import { Helmet } from 'react-helmet-async';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  const lastUpdated = "25 December 2025";

  return (
    <div className="terms-container">
      <Helmet>
        <title>Terms & Conditions | SmartConverter</title>
        <meta
          name="description"
          content="Read the terms and conditions for using SmartConverter’s free online PDF and image tools. Understand your rights and responsibilities."
        />
        <link
          rel="canonical"
          href={`${window.location.origin}/terms-and-conditions`}
        />
      </Helmet>

      <h1>Terms & Conditions</h1>

      <p>
        <strong>Last Updated:</strong> {lastUpdated}
      </p>

      <p>
        These Terms and Conditions (“Terms”) govern your access to and use of
        the <strong>SmartConverter</strong> website (“Website”, “Service”).
        By accessing or using this Website, you agree to be bound by these Terms.
        If you do not agree with any part of these Terms, please do not use the Website.
      </p>

      <h2>1. About the Service</h2>
      <p>
        SmartConverter is an independently developed web-based utility that
        allows users to convert and manage image and PDF files online. The
        Service is provided on an “as-is” and “as-available” basis.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        By using this Website, you confirm that you are at least 13 years old.
        If you are under 13, you may not use this Website.
      </p>

      <h2>3. Acceptable Use</h2>
      <p>
        You agree to use the Website only for lawful purposes and in a way that
        does not infringe the rights of others or restrict or inhibit anyone
        else’s use of the Website.
      </p>
      <ul>
        <li>Upload or process illegal, harmful, or copyrighted content without permission</li>
        <li>Attempt to disrupt or damage the Website or its infrastructure</li>
        <li>Use automated systems to overload or scrape the Website</li>
      </ul>

      <h2>4. File Responsibility</h2>
      <p>
        You are solely responsible for the files you upload and process using
        the Website. SmartConverter does not verify or monitor uploaded content.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content, design, logos, and software on this Website are the
        intellectual property of SmartConverter unless otherwise stated.
        You may not reproduce or redistribute any part without permission.
      </p>

      <h2>6. Disclaimer</h2>
      <p>
        The Website and its tools are provided for general use only. We do not
        guarantee uninterrupted or error-free service.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, SmartConverter shall not be
        liable for any damages arising from your use of the Website.
      </p>

      <h2>8. Third-Party Services</h2>
      <p>
        The Website may use third-party services such as analytics or advertising
        providers. SmartConverter is not responsible for their practices.
      </p>

      <h2>9. Governing Law</h2>
      <p>
        These Terms shall be governed and interpreted in accordance with the
        laws of India.
      </p>

      <h2>10. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the Website
        constitutes acceptance of the updated Terms.
      </p>

      <h2>11. Termination</h2>
      <p>
        We reserve the right to suspend or terminate access to the Website if
        these Terms are violated.
      </p>

      <h2>12. Contact</h2>
      <p>
        If you have any questions regarding these Terms & Conditions, please
        contact us through the <a href="/contact-us">Contact Us</a> page.
      </p>
    </div>
  );
};

export default TermsAndConditions;
