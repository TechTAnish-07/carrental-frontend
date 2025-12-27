import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-section">
          <h2 className="footer-logo">SAngRaj Rentals</h2>
          <p>
            Affordable, reliable, and hassle-free car rentals.
            Book your ride anytime, anywhere.
          </p>
        </div>

        {/* Address */}
        <div className="footer-section">
          <h3>Our Address</h3>
          <p>
            📍 Indore, Madhya Pradesh, India
          </p>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Indore,Madhya%20Pradesh,India"
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
          >
            🧭 Get Directions
          </a>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} SAngRaj Rentals. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
