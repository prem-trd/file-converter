import React from 'react';
import { Helmet } from 'react-helmet-async';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <Helmet>
        <title>About SmartConverter – Our Mission & Story</title>
        <meta
          name="description"
          content="Learn about SmartConverter, a free and secure online platform designed to make PDF and image file conversions fast, simple, and accessible for everyone."
        />
        <link
          rel="canonical"
          href={`${window.location.origin}/about-us`}
        />
      </Helmet>

      <div className="about-us-content">
        <h1>About SmartConverter</h1>

        <p>
          Welcome to <strong>SmartConverter</strong>, your reliable destination for
          fast, simple, and secure file conversions. Our goal is to help users
          convert, manage, and optimize PDF and image files effortlessly—without
          complicated software or paid subscriptions.
        </p>

        <h2>Our Mission</h2>
        <p>
          Our mission is to provide high-quality online file conversion tools that
          are accessible to everyone. Whether you are a student, professional, or
          casual user, SmartConverter helps you get things done quickly and
          efficiently.
        </p>

        <h2>Why SmartConverter?</h2>
        <p>
          SmartConverter is designed with simplicity and performance in mind. We
          support a wide range of tools including PDF conversion, image processing,
          file compression, and document organization. All tools work directly in
          your browser with no installation required.
        </p>

        <h2>Who We Are</h2>
        <p>
          SmartConverter is independently developed and maintained by a small team
          of developers focused on building privacy-friendly, easy-to-use web tools
          for everyday needs. We continuously improve our platform based on user
          feedback and evolving technology standards.
        </p>

        <h2>Your Privacy Matters</h2>
        <p>
          We take user privacy seriously. Uploaded files are processed securely and
          are automatically removed from our servers after a short period. We do
          not sell, store, or misuse your data. You can learn more by visiting our{' '}
          <a href="/privacy-notice">Privacy Policy</a>.
        </p>

        <p>
          If you have any questions, suggestions, or feedback, feel free to reach
          out through our <a href="/contact-us">Contact Us</a> page. We’re always
          happy to help.
        </p>

        <p>
          Thank you for choosing SmartConverter. We hope our tools make your work
          easier and more productive.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
