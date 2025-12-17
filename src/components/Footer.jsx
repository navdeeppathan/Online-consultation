import React from "react";
import image from "../assets/images/Logofooter.png";
import image1 from "../assets/images/Untitled-23 1.png";
import image2 from "../assets/images/10750656_customer service_customer-support_support_customer-care_service_icon 1.png";
import image3 from "../assets/images/15243469 1.png";
import footerbg from "../assets/images/footerbg.png";

import { Link } from "react-router-dom";
function Footer() {
  return (
    <>
      <footer className="footer-section text-white pt-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <img src={"/Logo (1).png"} alt="Yodoc" className="mb-4 w-50" />
              <p className="para">
                {/* Welcome to YoDoc, your go-to platform for easy virtual doctor
                consultations across the UK. Book appointments with trusted,
                GMC-registered doctors at your convenience anytime, anywhere. */}
                Welcome to Yodoc, your go-to platform for easy and quick
                consultations with GMC Certified doctors across the UK.
              </p>
            </div>

            <div className="col-md-3 mb-3">
              {/* <h6 className="footer-heading">YODOC</h6> */}
              <ul className="list-unstyled">
                <Link to="/about-us">
                  <li>About</li>
                </Link>
                {/* <Link to="/blogs">
                  <li>Blog</li>
                </Link> */}
                <Link to="/contact">
                  <li>Contact</li>
                </Link>
                <Link to="/patient-faqs">
                  <li>Patient FAQs</li>
                </Link>

                {/* <Link to="/privacy-policy">
                  <li>Privacy Policy</li>
                </Link> */}

                {/* <Link to="/terms-and-conditions">
                  <li>Terms and Conditions</li>
                </Link> */}
              </ul>
            </div>
            <div className="col-md-3 mb-3">
              {/* <h6 className="footer-heading">FOR PATIENTS</h6> */}
              <ul className="list-unstyled">
                {/* <Link to="/doctornewpage">
                  <li>Search for doctors</li>
                </Link> */}
                {/* <Link to="/clinics">
                  <li>Search for clinics</li>
                </Link> */}
                {/* <Link to="/hospital">
                  <li>Search for hospitals</li>
                </Link> */}

                {/* <li>Yodoc Plus</li> */}
                {/* <li>Covid Hospital listing</li> */}
                {/* <li>Yodoc Care Clinics</li> */}
                {/* <Link to="/read-health-article"> */}

                <Link to="/yodo-profile">
                  <li>Yodoc Profile</li>
                </Link>
                <li>
                  <a
                    href="https://www.england.nhs.uk/news/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    NHS News Feed
                  </a>
                </li>

                <Link to="/doctor-faqs">
                  <li>Doctor FAQs</li>
                </Link>
                {/* </Link> */}

                {/* <Link to="/about-us">
                  <li>Read about medicines</li>
                </Link> */}
                {/* <li>Yodoc drive</li> */}
              </ul>
            </div>
            <div className="col-md-2 mb-3">
              {/* <h6 className="footer-heading">FOR DOCTORS</h6> */}
              <ul className="list-unstyled">
                {/* <Link to="/yodo-profile">
                  <li>Yodoc Profile</li>
                </Link> */}
                <Link to="/privacy-policy">
                  <li>Privacy Policy</li>
                </Link>
                <Link to="/terms-and-conditions">
                  <li>T&Cs</li>
                </Link>
                {/* <Link to="/for-clinic">
                  <li>For clinics</li>
                </Link> */}

                {/* <li>Ray by Yodoc</li> */}
                {/* <Link to="/yodoc-reach">
                  <li>Yodoc Reach</li>
                </Link> */}

                {/* <li>Ray Tab</li> */}
                {/* <li>Yodoc Pro</li> */}
              </ul>
            </div>
          </div>

          <hr className="footer-divider" />

          {/* <div className="row  text-md-left  mt-4">
            <div className="col-md-4 mb-3 d-flex align-items-start">
              <img src={image1} alt="Verified" className="mr-2 footerimage" />
              <div>
                <h2 className="gmc-heading">GMC Verified Doctors</h2>

                <div className="small2">
                  The main regulatory body for
                  <br />
                  doctors in the UK
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-start">
              <img src={image2} alt="Verified" className="mr-2 footerimage" />

              <div>
                <h2 className="gmc-heading">Reliable Customer Support</h2>
                <div className="small2">6 days a week</div>
              </div>
            </div>
            <div className="col-md-4 mb-3 d-flex align-items-start">
              <img src={image3} alt="Verified" className="mr-2 footerimage" />

              <div>
                <h2 className="gmc-heading">Secure Online Payment</h2>
                <div className="small2">
                  Secure checkout using SSL
                  <br />
                  Certificate
                </div>
              </div>
            </div>
          </div> */}
          <div className="row text-md-left mt-4">
            <div className="col-md-4 mb-3 d-flex align-items-start">
              <img src={image1} alt="Verified" className="mr-2 footerimage" />
              <div>
                <h2 className="gmc-heading">GMC Verified Doctors</h2>
                <div className="small2">
                  The main regulatory body for
                  <br />
                  doctors in the UK
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3 d-flex align-items-start">
              <img src={image2} alt="Verified" className="mr-2 footerimage" />
              <div>
                <h2 className="gmc-heading">Reliable Customer Support</h2>
                <div className="small2">6 days a week</div>
              </div>
            </div>

            <div className="col-md-4 mb-3 d-flex align-items-start">
              <img src={image3} alt="Verified" className="mr-2 footerimage" />
              <div>
                <h2 className="gmc-heading">Secure Online Payment</h2>
                <div className="small2">
                  Secure checkout using SSL
                  <br />
                  Certificate
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="text-black container py-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="social-icons mb-3 mb-md-0">
            <i className="fab fa-facebook-f mx-2"></i>
            <i className="fab fa-youtube mx-2"></i>
            <i className="fab fa-linkedin-in mx-2"></i>
            <i className="fab fa-instagram mx-2"></i>
          </div>
          <div className="text-md-right text-center small">
            Copyright © 2025 Yodoc. All Rights Reserved Design and developed by
            The Nexteck.
          </div>
        </div>
      </div>

      <style>
        {`
    .footer-section {
      background-image: url(${footerbg});
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }

    .footerimage {
      height: 70px;
      width: 70px;
    }

    .para {
      
      font-weight: 400;
      font-size: 13px;
      line-height: 18px;
      color: #FFFFFF;
    }

    .footer-heading {
   
      font-weight: 500;
      font-size: 24px;
      line-height: 42px;
      text-transform: uppercase;
      color: #FFFFFF;
      margin-bottom: 1rem;
    }

    .footer-divider {
      border-color: #fff;
    }

    .footer-section ul {
      padding-left: 0;
    }

    .footer-section ul li {
      
      font-weight: 400;
      font-size: 16px;
      line-height: 30px;
      list-style: none;
      margin-bottom: 0.5rem;
      cursor: pointer;
      color: #FFFFFF;
    }

    .footer-section ul li:hover {
      text-decoration: underline;
    }

    .social-icons i {
      font-size: 1.2rem;
      color: #000;
      cursor: pointer;
      transition: color 0.3s;
    }

    .social-icons i:hover {
      color: #4764e6;
    }

    .gmc-heading {
     
      font-weight: 500;
      font-size: 18px;
      margin-bottom: 0;
      color: #FFFFFF;
    }

    .small2 {
    
      font-weight: 400;
      font-size: clamp(10px, 1rem, 13px);
      color: #ffffff;
    }
  `}
      </style>
    </>
  );
}

export default Footer;
