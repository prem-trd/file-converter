import React from 'react';
import { Helmet } from 'react-helmet-async';
import './ContactUs.css';

const ContactUs = () => {
  return (
    <div className="contact-container">
      <Helmet>
        <title>Contact Us - Image & PDF Tools</title>
        <meta name="description" content="Contact us for support, feedback, or any questions about our free online image and PDF tools. We're here to help!" />
        <link rel="canonical" href={`${window.location.origin}/contact-us`} />
      </Helmet>
      <h1>Contact Us</h1>

      <p>
        If you have any questions, feedback, or issues related to Image & PDF Tools,
        feel free to reach out. We’ll do our best to respond as soon as possible.
      </p>

      <form
        className="contact-form"
        name="contact"
        method="POST"
        action="/"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
      >
        {/* Netlify required hidden fields */}
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="bot-field" />
        <input type="hidden" name="redirect" value="/thank-you" />

        <h2>Send Us a Message</h2>

        <p className="form-note">
          Note: Information submitted through this form is used only to respond
          to your inquiry and is not stored or shared.
        </p>

        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message *</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Write your message here..."
            required
          ></textarea>
        </div>

        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
