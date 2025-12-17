import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";
import Logo from "../assets/images/whiteLogo.png";
import doctorregisterimage from "../assets/images/largedocimg.jpeg";
import toast from "react-hot-toast";
import Config from "../config";
import axios from "axios";

export default function YoDocRegistration() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    speciality: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // const specialities = [
  //   "Select Speciality",
  //   "Cardiologist",
  //   "Dermatologist",
  //   "Pediatrician",
  //   "Orthopedic",
  //   "Neurologist",
  //   "Psychiatrist",
  //   "General Physician",
  //   "Gynecologist",
  //   "Ophthalmologist",
  //   "ENT Specialist",
  // ];

  const [specialities, setSpecialities] = useState([]);
  const fetchDrDataCategory = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/specialties`);
      console.log("Raw API response:", response.data);

      // Assuming your API returns something like:
      // { data: [{ name: "Cardiologist" }, { name: "Dermatologist" }, ...] }

      const formattedSpecialties = [
        "Select Speciality",
        ...(response.data?.data?.map((item) => item.name) || []),
      ];

      console.log("Formatted Specialties:", formattedSpecialties);
      setSpecialities(formattedSpecialties);
    } catch (error) {
      console.error(
        "Error fetching category data:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchDrDataCategory();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setSubmitted(true);
  //   setTimeout(() => {
  //     setSubmitted(false);
  //     setFormData({
  //       firstName: "",
  //       lastName: "",
  //       email: "",
  //       phone: "",
  //       speciality: "",
  //     });
  //   }, 3000);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // if (!agreeTerms) {
    //   toast.error("You must agree to the terms and conditions");
    //   return;
    // }
    setSubmitted(true);
    const form = new FormData();

    form.append("firstname", formData.firstName);
    form.append("lastname", formData.lastName);
    form.append("email", formData.email);
    form.append("mobile_number", formData.phone);
    form.append("speciality", formData.speciality);
    form.append("role", "doctor");

    try {
      const res = await axios.post(`${Config.BASE_URL}/api/register`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // toast.success("Registered successfully!");
      toast.success(
        "Registered successfully! Please check your email for login details."
      );
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        speciality: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setSubmitted(false); // stop loading always
    }
  };

  return (
    <div className="yodoc-landing">
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

          * {
            font-family: "Poppins", sans-serif;
          }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .yodoc-landing {
          font-family: 'Poppins', sans-serif;
          overflow-x: hidden;
          background: #f8f9fa;
        }

        /* Header */
        .header {
          background: #6c5ce7;
          padding: 15px 0;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .logo {
          font-size: 1.8rem;
          font-weight: 500;
          color: white;
        }

        .logo span {
          color: #ffd700;
        }

        .nav-menu {
          display: flex;
          gap: 30px;
          list-style: none;
          align-items: center;
        }

        .nav-menu a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s;
        }

        .nav-menu a:hover {
          color: #ffd700;
        }

        .btn-login {
          background: white;
          color: #6c5ce7;
          padding: 8px 25px;
          border-radius: 25px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-login:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
          padding: 120px 20px 80px;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: white;
          clip-path: ellipse(80% 100% at 50% 100%);
        }

        .hero-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }

        .hero-content h1 {
          font-size: 3rem;
          font-weight: 500;
          color: white;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .hero-content p {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 30px;
        }

        .hero-buttons {
          display: flex;
          gap: 20px;
        }

        .btn-primary {
          background: #ffd700;
          color: #6c5ce7;
          padding: 15px 35px;
          border-radius: 30px;
          border: none;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          padding: 15px 35px;
          border-radius: 30px;
          border: 2px solid white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: white;
          color: #6c5ce7;
        }

        .hero-image {
          position: relative;
        }

        .doctor-illustration {
          width: 100%;
          max-width: 500px;
          height: 400px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 3px solid rgba(255, 255, 255, 0.3);
          overflow: hidden; /* ensures image doesn't spill out of circle */
        }

        /*  Makes image fit neatly inside the circle */
        .doctor-illustration img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* fills circle perfectly */
          border-radius: 50%; /* keeps image circular */
        }


        /* Feature Cards */
        .features {
          padding: 80px 20px;
          background: white;
        }

        .features-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 500;
          color: #2d3436;
          margin-bottom: 50px;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .feature-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          border: 2px solid #6c5ce7;
          text-align: center;
          transition: all 0.3s;
          
        }

        .feature-card:hover {
          transform: translateY(-10px);
          border-color: #6c5ce7;
          box-shadow: 0 15px 40px rgba(108,92,231,0.2);
        }

        .feature-icon {
          font-size: 3.5rem;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #2d3436;
          margin-bottom: 15px;
        }

        .feature-card p {
          color: #636e72;
          line-height: 1.6;
        }

        /* Specialties Section */
        .specialties {
          padding: 80px 20px;
          background: #f8f9fa;
        }

        .specialties-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .specialties-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
        }

        .specialty-card {
          background: white;
          padding: 40px 30px;
          border-radius: 15px;
          box-shadow: 0 3px 15px rgba(0,0,0,0.08);
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .specialty-card:hover {
          transform: scale(1.05);
          box-shadow: 0 10px 30px rgba(108,92,231,0.15);
        }

        .specialty-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 2.5rem;
        }

        .specialty-card h4 {
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3436;
          margin-bottom: 10px;
        }

        .specialty-card p {
          color: #636e72;
          font-size: 0.9rem;
        }

        /* Benefits Section */
        .benefits {
          padding: 80px 20px;
          background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
          position: relative;
        }

        .benefits-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }

        .benefits-content h2 {
          font-size: 2.5rem;
          font-weight: 500;
          color: white;
          margin-bottom: 30px;
        }

        .benefit-item {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
          align-items: start;
        }

        .benefit-icon {
          width: 50px;
          height: 50px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .benefit-text h4 {
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .benefit-text p {
          color: rgba(255,255,255,0.9);
          line-height: 1.6;
        }

       .benefits-visual {
          position: relative;
        }

        .circle-avatar {
          width: 100%;
          max-width: 500px;
          height: 500px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 3px solid rgba(255, 255, 255, 0.3);
          overflow: hidden; /* keeps the image inside the circle */
        }

        /* ✅ Makes image fill circle neatly */
        .circle-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* fills the circle properly */
          border-radius: 50%; /* keeps image circular */
        }


        /* Registration Section */
        .registration {
          background: white;
        }

        .registration-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 50px;
          
        }

        .registration-container h2 {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 500;
          color: #2d3436;
          margin-bottom: 15px;
        }

        .registration-container p {
          text-align: center;
          color: #636e72;
          margin-bottom: 40px;
        }

        .form-group {
          margin-bottom: 25px;
        }

        .form-label {
        font-Family: "Poppins", sans-serif;
          font-weight: 600;
          color: #2d3436;
          margin-bottom: 8px;
          display: block;
        }

        .form-control, .form-select {
          border: 2px solid #dfe6e9;
          border-radius: 12px;
          padding: 10px 10px;
          font-size: 1rem;
          transition: all 0.3s;
          width: 100%;
        }

        .form-control:focus, .form-select:focus {
          border-color: #6c5ce7;
          box-shadow: 0 0 0 0.2rem rgba(108, 92, 231, 0.15);
          outline: none;
        }

        .submit-btn {
          width: 40%;
          padding: 10px;
          background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
          border: none;
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(108, 92, 231, 0.3);
        }

        .success-message {
          background: linear-gradient(135deg, #00b894 0%, #55efc4 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          text-align: center;
          margin-top: 20px;
          font-weight: 600;
        }

        /* Testimonials */
        .testimonials {
          padding: 80px 20px;
          background: #f8f9fa;
        }

        .testimonials-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-top: 50px;
        }

        .testimonial-card {
          background: white;
          padding: 30px;
          border-radius: 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.08);
          transition: all 0.3s;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }

        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 20px;
        }

        .testimonial-avatar {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #6c5ce7, #a29bfe);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
        }

        .testimonial-info h5 {
          font-weight: 600;
          color: #2d3436;
          margin-bottom: 5px;
        }

        .testimonial-info p {
          color: #6c5ce7;
          font-size: 0.9rem;
        }

        .testimonial-text {
          color: #636e72;
          line-height: 1.7;
          font-style: italic;
        }

        .stars {
          color: #ffd700;
          margin-bottom: 15px;
        }

        /* CTA Section */
        .cta {
          padding: 80px 20px;
          background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
          text-align: center;
        }

        .cta-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .cta h2 {
          font-size: 2.5rem;
          font-weight: 500;
          color: white;
          margin-bottom: 20px;
        }

        .cta p {
          font-size: 1.2rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 40px;
        }

        /* Footer */
        .footer {
          background: #2d3436;
          color: white;
          padding: 60px 20px 30px;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-section h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 20px;
          color: #ffd700;
        }

        .footer-section p {
          color: rgba(255,255,255,0.8);
          line-height: 1.7;
          margin-bottom: 15px;
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: rgba(255,255,255,0.8);
          text-decoration: none;
          transition: color 0.3s;
        }

        .footer-links a:hover {
          color: #ffd700;
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 20px;
        }

        .social-icon {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.3s;
        }

        .social-icon:hover {
          background: #ffd700;
          color: #2d3436;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
        }

        @media (max-width: 968px) {
          .nav-menu {
            display: none;
          }

          .hero-container,
          .benefits-container {
            grid-template-columns: 1fr;
          }

          .hero-content h1 {
            font-size: 2.2rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .registration-container {
            padding: 30px 25px;
          }

          .testimonial-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .hero {
            padding: 100px 20px 60px;
          }

          .hero-content h1 {
            font-size: 1.8rem;
          }

          .hero-buttons {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }
        }


      `}</style>

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <img src={Logo} alt="Logo" className="logocss" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>A revolutionary way to connect with patients</h1>
            <p>
              Join thousands of healthcare professionals already using YoDoc to
              grow their practice and provide better care.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">Get Started</button>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
          <div className="hero-image">
            <div className="doctor-illustration">
              <img src={doctorregisterimage} alt="Logo" className="logocss" />
            </div>
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="registration" id="register">
        <div className="registration-container">
          <h2>Become an Instructor</h2>
          <p>
            Join our network of healthcare professionals and start your journey
            today
          </p>

          <div>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">First Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label className="form-label">Last Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="doctor@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Medical Speciality *</label>
              <select
                className="form-select"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                required
              >
                {specialities.map((spec, index) => (
                  <option key={index} value={spec} disabled={index === 0}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                onClick={handleSubmit}
                className="submit-btn"
              >
                Register Now
              </button>
            </div>

            {submitted && (
              <div className="success-message">
                🎉 Registration Successful! Welcome to YoDoc family.
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2 className="section-title">Why Choose YoDoc?</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Online Consultations</h3>
              <p>
                Connect with patients through secure video calls and messaging
                from anywhere, anytime.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3>Smart Scheduling</h3>
              <p>
                Automated appointment management system that syncs with your
                calendar seamlessly.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Secure Payments</h3>
              <p>
                Integrated payment processing with instant settlements and
                detailed financial reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="specialties" id="specialties">
        <div className="specialties-container">
          <h2 className="section-title">Our Popular Specialties</h2>
          <div className="specialties-grid">
            <div className="specialty-card">
              <div className="specialty-icon">❤️</div>
              <h4>Cardiology</h4>
              <p>Heart & cardiovascular care</p>
            </div>
            <div className="specialty-card">
              <div className="specialty-icon">🧠</div>
              <h4>Neurology</h4>
              <p>Brain & nervous system</p>
            </div>
            <div className="specialty-card">
              <div className="specialty-icon">👶</div>
              <h4>Pediatrics</h4>
              <p>Children's healthcare</p>
            </div>
            <div className="specialty-card">
              <div className="specialty-icon">🦴</div>
              <h4>Orthopedics</h4>
              <p>Bone & joint treatment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="benefits-container">
          <div className="benefits-content">
            <h2>Benefits from our platform</h2>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-text">
                <h4>Expand Your Reach</h4>
                <p>
                  Connect with patients beyond geographical boundaries and grow
                  your practice exponentially.
                </p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-text">
                <h4>Save Time</h4>
                <p>
                  Streamline administrative tasks with our automated systems and
                  focus more on patient care.
                </p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-text">
                <h4>Increase Revenue</h4>
                <p>
                  Flexible pricing options and multiple payment methods to
                  maximize your earnings.
                </p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-text">
                <h4>24/7 Support</h4>
                <p>
                  Round-the-clock technical and professional support to ensure
                  smooth operations.
                </p>
              </div>
            </div>
          </div>
          {/* <div className="benefits-visual">
            <div className="circle-avatar">👨‍⚕️</div>
          </div> */}
          <div className="benefits-visual">
            <div className="circle-avatar">
              <img src={doctorregisterimage} alt="Doctor" />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="testimonials-container">
          <h2 className="section-title">What Doctors Say About Us</h2>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "YoDoc has completely transformed how I manage my practice. The
                platform is intuitive and my patient base has grown
                significantly!"
              </p>
              <div className="testimonial-header">
                <div className="testimonial-avatar">👨‍⚕️</div>
                <div className="testimonial-info">
                  <h5>Dr. Rajesh Kumar</h5>
                  <p>Cardiologist</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "The scheduling system is a game-changer. I can now see more
                patients while maintaining work-life balance. Highly recommend!"
              </p>
              <div className="testimonial-header">
                <div className="testimonial-avatar">👩‍⚕️</div>
                <div className="testimonial-info">
                  <h5>Dr. Priya Sharma</h5>
                  <p>Pediatrician</p>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">
                "Outstanding platform! The support team is incredibly helpful
                and the features are exactly what modern healthcare needs."
              </p>
              <div className="testimonial-header">
                <div className="testimonial-avatar">👨‍⚕️</div>
                <div className="testimonial-info">
                  <h5>Dr. Amit Patel</h5>
                  <p>Orthopedic Surgeon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-container">
          <h2>Ready to Get Started?</h2>
          <p>
            Join thousands of doctors already using YoDoc to transform their
            practice
          </p>
          <button className="btn-primary">Start Your Free Trial</button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
