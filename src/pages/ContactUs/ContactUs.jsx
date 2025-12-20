import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We will get back to you shortly.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <p>
        If you have any questions, feedback, or issues related to Image & PDF Tools,
        feel free to reach out. We’ll do our best to respond as soon as possible.
      </p>

      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:your.email@example.com">
          your.email@example.com
        </a>
      </p>

      <form
        className="contact-form"
        onSubmit={handleSubmit}
      >
        <h2>Send Us a Message</h2>

        <p className="form-note">
          Note: Information submitted through this form is used only to respond
          to your inquiry and is not stored or shared.
        </p>

        <div className="form-group">
          <label htmlFor="name">Name (optional)</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Your name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email (required)</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            placeholder="Write your message here..."
            required
            value={formData.message}
            onChange={handleChange}
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
