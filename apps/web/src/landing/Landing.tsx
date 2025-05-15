
import "../styles/LandingPage.css"; // Import your CSS file for styling
import ConnectoLogo from "../assets/logo.png"; // Import your logo image
function LandingPage() {
  return (
    <div className="connecto-landing">
      {/* Header */}
      <header className="header">
        <div className="container header-container">
          <div className="logo">
          <img style={{ width: "80px", height: "80px" }} src={ConnectoLogo} alt="Connecto Logo" />

            <span>Connecto</span>
          </div>
          <nav className="nav">
            <a href="#features">Features</a>
            <a href="#about">About Us</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="auth-buttons">
            <a href="/login" className="btn btn-ghost">
              Login
            </a>
            <a href="/signup" className="btn btn-primary">
              Sign up
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-content">
                <h1 className="hero-title">Connect in real-time with anyone, anywhere</h1>
                <p className="hero-description">
                  Our secure, lightning-fast chat platform brings people together. Experience communication without
                  limits.
                </p>
                <div className="hero-buttons">
                  <a href="/signup" className="btn btn-primary">
                    Get Started
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginLeft: "0.25rem" }}
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </a>
                  <a href="/login" className="btn btn-outline">
                    Log in to your account
                  </a>
                </div>
              </div>
              <div className="hero-image">
                <div className="image-container">
                  <img src={ConnectoLogo} alt="Connecto" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Features that make us different</h2>
              <p className="section-description">
                Our chat platform is designed with you in mind, offering powerful features to enhance your
                communication experience.
              </p>
            </div>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Lightning Fast</h3>
                <p className="feature-description">
                  Experience real-time messaging with zero lag, ensuring your conversations flow naturally.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="feature-title">End-to-End Encryption</h3>
                <p className="feature-description">
                  Your privacy matters. All messages are encrypted, ensuring only you and your recipient can read them.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Group Chats</h3>
                <p className="feature-description">
                  Create group conversations with friends, family, or colleagues to stay connected with everyone at
                  once.
                </p>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <img src={ConnectoLogo} alt="Connecto Icon" />
                </div>
                <h3 className="feature-title">Rich Media Sharing</h3>
                <p className="feature-description">
                  Share photos, videos, documents, and more with a simple drag and drop interface.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="about">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-image">
                <div className="image-container">
                  <img src={ConnectoLogo} alt="Connecto" />
                </div>
              </div>
              <div className="hero-content">
                <h2 className="section-title">About Us</h2>
                <p className="hero-description">
                  We're a team of passionate developers and designers who believe in the power of communication to
                  bring people together.
                </p>
                <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <p className="feature-description">
                    Founded in 2023, our mission is to create a chat platform that's not only fast and secure but also
                    intuitive and enjoyable to use. We understand the importance of staying connected in today's
                    fast-paced world, which is why we've built a solution that works seamlessly across all devices.
                  </p>
                  <p className="feature-description">
                    Our team is dedicated to continuous improvement, regularly updating our platform with new features
                    and enhancements based on user feedback. We believe in building technology that serves people, not
                    the other way around.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section id="contact" className="contact">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Contact Us</h2>
              <p className="section-description">
                Have questions or feedback? We'd love to hear from you. Reach out to our team using any of the methods
                below.
              </p>
            </div>
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Email</h3>
                <p className="feature-description">support@connecto.com</p>
              </div>
              <div className="contact-method">
                <div className="contact-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Phone</h3>
                <p className="feature-description">+1 (555) 123-4567</p>
              </div>
              <div className="contact-method">
                <div className="contact-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <h3 className="feature-title">Office</h3>
                <p className="feature-description">123 Tech Street, San Francisco, CA 94107</p>
              </div>
            </div>
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <div className="form-field">
                    <label htmlFor="name">Name</label>
                    <input id="name" placeholder="Your name" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" placeholder="Your email" />
                  </div>
                </div>
                <div className="form-field" style={{ marginBottom: "1rem" }}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" placeholder="Your message"></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-logo">
            <img src={ConnectoLogo} alt="Connecto Logo" />
            <span>Connecto</span>
          </div>
          <p className="footer-copyright">© 2023 Connecto. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;