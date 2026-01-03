import React, { useState, useEffect } from 'react';
import './Home.css';

const Review = React.lazy(() => import('./Review'));
import bgImg from '../assets/homepageimage.png';
import { useNavigate } from 'react-router-dom';
import ContactUs from '../ContactUs';

const Home = () => {
  const [location, setLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [language, setLanguage] = useState(true);
  const [clickedNav, setClickedNav] = useState('');
  const [dropTime , setDropTime] = useState('');
  const isLoginedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();

  // ---------------------- HANDLE SUBMIT -----------------------


  useEffect(() => {
    document.title = "Home";
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create backend-compatible datetime format
    const startTime = `${pickupDate}T${pickupTime}:00`;
    const endTime = `${dropoffDate}T${dropTime}:00`;

    navigate(
      `/available?location=${location}&start=${startTime}&end=${endTime}`
    );
  };

  const locations = [
    "Indore",
    "Bhopal",
    "Ujjain",
    "Dewas",
    "Ratlam",
    "Mumbai",
    "Pune",
    "Bangalore",
    "Chennai",
    "Hyderabad",
    "Delhi",
    "Gurgaon",
    "Noida",
  ];
  const handleBookButton = () => {
    navigate('/cars');
    setClickedNav('Cars');
  };

  const handleTranslate = () => setLanguage(!language);


  return (
    <div>
      <div className="home-container" style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '100%',
      }}>
        <section
          className="car-hero"

        >
          {/* ---------------------- BOOKING FORM ---------------------- */}
          <div className="form-overlay">
            <form onSubmit={handleSubmit} className="booking-form">
              <h3 className="form-title">Book Your Dream Car</h3>

              <div className="form-group">
                <input
                  type="text"
                  list="locations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter location"

                  required
                />
                <datalist id="locations">
                  {locations.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pick-Up Date</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Pick-Up Time</label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            <div className='form-row'>
              <div className="form-group">
                <label>Drop-Off Date</label>
                <input
                  type="date"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                  <label>drop Time</label>
                  <input
                    type="time"
                    value={dropTime}
                    onChange={(e) => setDropTime(e.target.value)}
                    required
                  />
                </div>
              </div>
            
              <button type="submit" className="form-submit-btn"
                title={!isLoginedIn ? "Login required to check availability" : ""}
              >
                Check Availability
              </button>
            </form>
          </div>

          {/* ---------------------- HERO CONTENT ---------------------- */}
          <div className="car-hero-content">
            <h2 className="car-model">BMW M4 Competition</h2>
            <p className="car-price">From 1200 AED/day</p>
            <span className="car-tag">LUXURY PERFORMANCE</span>
          </div>
        </section>

        {/* ---------------------- DESCRIPTION ---------------------- */}
        <section className="car-description">
          <p className="description-text">
            Experience the thrill of premium performance. The BMW M4 Competition delivers
            track-inspired dynamics with everyday practicality.
          </p>
          <button
            className="book-button"
            onClick={() => {
              handleBookButton();
              setClickedNav('Cars');
            }}
          >
            Look More Cars
          </button>
        </section>
      </div>

      {/* ---------------------- WHY CHOOSE US ---------------------- */}
      <section className="why-choose-us" id="why-us">
        <h2>
          Why Choose <span style={{ color: 'red' }}>SAngRAj</span> Rental?
        </h2>
        <div className="why-choose-content">
          <p>
            At SAngRAj Rental, we redefine mobility with an unmatched blend of luxury,
            reliability, and affordability.
          </p>

          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">✔</div>
              <div className="benefit-text">Wide selection of late-model vehicles</div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✔</div>
              <div className="benefit-text">Competitive rates with no hidden fees</div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✔</div>
              <div className="benefit-text">Quick and easy booking process</div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✔</div>
              <div className="benefit-text">24/7 roadside assistance</div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✔</div>
              <div className="">Personalized services tailored to your needs</div>
            </div>
          </div>
        </div>
      </section>

      <Review />

      {/* ---------------------- ABOUT ---------------------- */}
      <section id="about">
        <h2>
          About <span style={{ color: 'red' }}>SAngRAj</span> Rental
        </h2>

        <button className="translate-button" onClick={handleTranslate}>
          Translate to {language ? 'Hindi' : 'English'}
        </button>

        {language ? (
          <p>SAngRAj Rentals was founded with a clear vision — to redefine the car rental experience.</p>
        ) : (
          <p>SAngRAj Rentals की शुरुआत एक स्पष्ट लक्ष्य के साथ हुई थी — कार रेंटल अनुभव को नया रूप देना।</p>
        )}
      </section>

      {/* ---------------------- CONTACT ---------------------- */}
      <section id="contact">
        <ContactUs />
      </section>
    </div>
  );
};

export default Home;
