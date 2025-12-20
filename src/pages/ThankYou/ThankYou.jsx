import React from 'react';
import { Link } from 'react-router-dom';
import './ThankYou.css';

const ThankYou = () => {
  return (
    <div className="thank-you-container">
      <h1>Thank You!</h1>
      <p>Your message has been sent successfully.</p>
      <p>We will get back to you as soon as possible.</p>
      <Link to="/" className="back-to-home-button">Back to Home</Link>
    </div>
  );
};

export default ThankYou;
