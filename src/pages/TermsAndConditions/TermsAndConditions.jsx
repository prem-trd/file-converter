import React from 'react';
import './TermsAndConditions.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1>Terms & Conditions</h1>

      <p>
        <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
      </p>

      <p>
        These Terms and Conditions (“Terms”) govern your access to and use of
        the <strong>Image & PDF Tools</strong> website (“Website”, “Service”).
        By accessing or using this Website, you agree to be bound by these Terms.
        If you do not agree with any part of these Terms, please do not use the Website.
      </p>

      <h2>1. About the Service</h2>
      <p>
        Image & PDF Tools is an independently developed web-based utility that
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
      <p>
        You must not:
      </p>
      <ul>
        <li>Upload or process illegal, harmful, or copyrighted content without permission</li>
        <li>Attempt to disrupt or damage the Website or its infrastructure</li>
        <li>Use automated systems to overload or scrape the Website</li>
      </ul>

      <h2>4. File Responsibility</h2>
      <p>
        You are solely responsible for the files you upload and process using
        the Website. We do not verify, monitor, or take responsibility for the
        content of uploaded files.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        All content, design, logos, and software on this Website are the
        intellectual property of Image & PDF Tools unless otherwise stated.
        You may not reproduce, distribute, or modify any part of the Website
        without prior written permission.
      </p>

      <h2>6. Disclaimer</h2>
      <p>
        The Website and its tools are provided for general use only. We do not
        guarantee that the Service will be uninterrupted, error-free, or meet
        your specific requirements.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, we shall not be liable for any
        direct, indirect, incidental, or consequential damages arising out of
        your use or inability to use the Website or Service.
      </p>

      <h2>8. Third-Party Services</h2>
      <p>
        The Website may include links to or integrations with third-party
        services such as analytics or advertising providers. We are not
        responsible for the content or practices of these third-party services.
      </p>

      <h2>9. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Continued use of the
        Website after changes are posted constitutes your acceptance of the
        updated Terms.
      </p>

      <h2>10. Termination</h2>
      <p>
        We reserve the right to suspend or terminate access to the Website at
        any time, without prior notice, if these Terms are violated.
      </p>

      <h2>11. Contact</h2>
      <p>
        If you have any questions regarding these Terms & Conditions, please
        contact us through the Website.
      </p>
    </div>
  );
};

export default TermsAndConditions;
