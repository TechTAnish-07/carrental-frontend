import React, { lazy, useState } from 'react';
import './ContactUs.css'; // Import the CSS
import api from './components/Axios.jsx';
import { useAuth } from './components/AuthProvider.jsx';
const ContactUs = () => {
  const { user } = useAuth();
  
  const currentUser = user;
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    message: ""
  });



  const [status, setStatus] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setStatus('Please fill out all fields.');
      return;
    }

    if (!validateEmail(email)) {
      setStatus('Please enter a valid email address.');
      return;
    }
    const payload = {
      name,
      email,
      subject: "Contact Form",
      message,
    };
  
  try {
    await api.post("/api/contact", payload);

    setSubmitted(true);
    setStatus('Your message has been "sent"!');
    setFormData({ name: "", email: "", message: "" });

    setTimeout(() => {
      setSubmitted(false);
      setStatus("");
    }, 4000);

  } catch (error) {
    console.error(error);
    setStatus("Something went wrong. Please try again later.");
  }
};

  return (

    
    <div className="contact-container"
 >
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          readOnly
          className="contact-input"
        />
        <input
          type="email"
          name="email"

          value={formData.email}
          readOnly
          className="contact-input"
        />
        <textarea
          name="message"
          rows="5"
          placeholder="Your Message"
          value={formData.message}
          onChange={handleChange}
          className="contact-textarea"
        />
        <button
          type="submit"
          className={`contact-button ${submitted ? 'submitted' : ''}`}
        >
          {submitted ? 'Sent!' : 'Send Message'}
        </button>

        {status && <p className="status-message">{status}</p>}
      </form>
      {(!isLoggedIn &&
      <p>Login to send message</p>)}
    </div>
   
  );
};

export default ContactUs;
