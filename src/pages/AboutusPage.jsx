import Header from "../components/Header";
import doctorVideoImg from "../assets/images/abouttop.png";
import doctorVideoImg2 from "../assets/images/abouttop2.png";

import target from "../assets/images/target.png";
import flag from "../assets/images/flag.png";
import doctoricon from "../assets/images/cardimg.png";
import patienticon from "../assets/images/cardimg2.png";
import valuesImage from "../assets/images/valuesimg.png";
import gmcLogo from "../assets/images/gmclogo.png"; // replace with your General Medical Council image
import dbsLogo from "../assets/images/dbslogo.png"; // replace with your DBS image
import insuranceLogo from "../assets/images/insurancelogo.png";
import plusicon from "../assets/images/plusicon.png";
import Footer from "../components/Footer";

function AboutusPage() {
  return (
    <>
      <div>
        {/* Your content below header and over background image */}
        <Header />
        <div>
          <AboutYodoc />
          <MissionVision />
          {/* <DoctorPlatform /> */}
          <OurValues />
          <ComplianceSection2 />
          <EmergencyNotice />
        </div>
        <Footer />
      </div>
    </>
  );
}

const AboutYodoc = () => {
  return (
    <div
      className="about-yodoc"
      style={{
        backgroundImage: `url(${doctorVideoImg})`,
      }}
    >
      <div className="about-content">
        {/* <h2>About Yodoc</h2> */}
        <p>
          At Yodoc, we’re redefining how patients access healthcare
          <br className="hide-mobile" />
          by making trusted medical advice available anytime,
          <br className="hide-mobile" />
          anywhere, all from the comfort of your home.
        </p>
        <p>
          We connect patients with GMC-certified UK doctors for
          <br className="hide-mobile" />
          secure, online consultations. Every doctor on our platform{" "}
          <br className="hide-mobile" />
          is DBS verified and covered by Medical Indemnity Insurance,
          <br className="hide-mobile" />
          ensuring the highest standards of safety, professionalism,
          <br className="hide-mobile" />
          and patient trust.
        </p>
      </div>

      <style>{`
        .about-yodoc {
          position: relative;
          width: 100%;
          min-height: 350px;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: top center;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 60px 13%;
          box-sizing: border-box;
        }

        .about-content {
          width: 50%;
          z-index: 2;
        }

        .about-content h2 {
          
          font-weight: 600;
          font-size: 40px;
          line-height: 42px;
          color: #0b2a4a;
          margin-bottom: 24px;
        }

        .about-content p {
          
          font-weight: 400;
          font-size: 19px;
          line-height: 27px;
          color: #141B34;
          margin-bottom: 18px;
        }

        /* Hide <br> tags for mobile */
        @media (max-width: 768px) {
          .hide-mobile {
            display: none;
          }
        }

        /* Responsive layout adjustments */
        @media (max-width: 992px) {
          .about-yodoc {
            flex-direction: column;
            justify-content: center;
            text-align: center;
            padding: 40px 20px;
            background-position: center;
          }

          .about-content {
            width: 100%;
          }

          .about-content h2 {
            font-size: 28px;
            line-height: 34px;
          }

          .about-content p {
            font-size: 15px;
            line-height: 22px;
          }
        }

        @media (max-width: 480px) {
          .about-content h2 {
            font-size: 24px;
          }

          .about-content p {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

const MissionVision = () => {
  return (
    <div className="mv-section">
      {/* Mission */}
      <div className="mv-row">
        <div className="mv-text mv-p">
          <h2>Our Mission</h2>
          <p>
            At Yodoc, our mission is to become the most trusted and preferred
            healthcare platform for direct and convenient access to healthcare
            providers in the UK.
          </p>
        </div>

        <div className="mv-image-wrapper">
          <img src="/about1.jpeg" alt="Mission" className="mv-image" />
        </div>
      </div>

      {/* Vision */}
      <div className="mv-row reverse">
        <div className="mv-text ">
          <h2>Our Purpose</h2>
          <p>
            We aim to help people live healthier, longer, and more productive
            lives by receiving timely and quality medical services. Healthcare
            access is not just about consulting a doctor — it is about giving
            patients a voice and empowering them to take control of their
            healthcare needs.
          </p>
        </div>

        <div className="mv-image-wrapper">
          <img src="/about2.jpeg" alt="Vision" className="mv-image" />
        </div>
      </div>

      <style>{`
        .mv-section {
          padding: 70px 0;
          max-width: 1200px;
          
          margin: auto;
        }

        .mv-p{
          padding: 0 6%;
        }
        
        .mv-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 90px;
          gap: 40px;
        }

        .mv-row.reverse {
          flex-direction: row-reverse;
        }

        .mv-text {
          flex: 1;
        }

        .mv-text h2 {
          font-size: 36px;
          font-weight: 500;
          margin-bottom: 16px;
          color: #0d1a3a;
        }

        .mv-text p {
          font-size: 17px;
          line-height: 28px;
          color: #333;
          max-width: 480px;
        }

        /* IMAGE WRAPPER WITH BLOB SHAPE */
        .mv-image-wrapper {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .mv-image {
          width: 100%;
          max-width: 430px;
          height: auto;
          object-fit: cover;
          border-radius: 30px;
          
        }

        /* Responsive */
        @media (max-width: 900px) {
          .mv-row,
          .mv-row.reverse {
            flex-direction: column !important;
            text-align: center;
          }

          .mv-text p {
            margin: 0 auto;
          }

          .mv-image {
            max-width: 300px;
          }
        }
      `}</style>
    </div>
  );
};

const DoctorPlatform = () => {
  return (
    <div className="doctor-platform">
      <div className="platform-container">
        <img src={doctoricon} alt="Doctor Platform" className="platform-card" />
        <img
          src={patienticon}
          alt="Patient Platform"
          className="platform-card"
        />
      </div>

      <style>{`
        .doctor-platform {
          background: linear-gradient(180deg, #F6FAFD 0%, #FFFFFF 100%);
          padding: 60px 20px;
          display: flex;
          justify-content: center;
        }

        .platform-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: stretch;
          gap: 20px;
          max-width: 1100px;
          width: 100%;
        }

        .platform-card {
          flex: 1 1 ;
          max-width: 540px;
          border-radius: 16px;
          width: 100%;
          height: auto;
          object-fit: contain;

          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .platform-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
        }

        /* Responsive for smaller screens */
        @media (max-width: 768px) {
          .platform-container {
            flex-direction: column;
            gap: 24px;
          }
          .platform-card {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

const OurValues = () => {
  return (
    <div className="our-values-section">
      <div className="values-container">
        {/* Title */}
        <div className="values-header">
          <h3 className="values-title">Our Values</h3>
          <p className="values-subtext">
            The principles that guide every decision we make and every service
            we offer.
          </p>
        </div>

        {/* Animated Cards Grid */}
        <div className="values-grid">
          <div className="value-card">
            <h5 className="bullet-heading">
              Trust
              <br /> & Compassion
            </h5>
            <p>
              Every consultation is handled with complete confidentiality and
              ethical care.
            </p>
          </div>

          <div className="value-card">
            <h5 className="bullet-heading">
              Respect <br /> & Equity
            </h5>
            <p>
              We ensure equal treatment for every patient by working only with
              qualified doctors.
            </p>
          </div>

          <div className="value-card">
            <h5 className="bullet-heading">
              Transparency <br /> & Safety
            </h5>
            <p>
              Clear processes and secure consultations help patients receive
              trusted medical care.
            </p>
          </div>

          <div className="value-card">
            <h5 className="bullet-heading">
              Excellence <br /> & Accountability
            </h5>
            <p>
              We focus on quality care and fair compensation, maintaining high
              professional standards.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .our-values-section {
          background-color: #E4EFF7;
          padding: 80px 20px;
          display: flex;
          justify-content: center;
        }

        .values-container {
          max-width: 1100px;
          width: 100%;
          text-align: center;
        }

        .values-header {
          margin-bottom: 40px;
        }

        .values-title {
          font-weight: 500;
          font-size: 36px;
          color: #464646;
          margin-bottom: 10px;
        }

        .values-subtext {
          color: #636363;
          font-size: 17px;
        }

        /* GRID */
        .values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 10px;
        }

        /* CARDS */
        .value-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 22px 24px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.05);
          text-align: left;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        /* HOVER EFFECT */
        .value-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0,0,0,0.12);
          background: #ffffff;
        }

        /* Bullet */
        .bullet-heading {
          position: relative;
          font-size: 17px;
          font-weight: 500;
          color: #515151;
          margin-bottom: 6px;
          padding-left: 20px;
          text-align: center;
        }

        

        /* Text */
        .value-card p {
          font-size: 15px;
          color: #515151;
          line-height: 24px;
          text-align: center;
        }

        @media (max-width: 900px) {
          .values-title {
            font-size: 26px;
          }
          .value-card {
            text-align: center;
          }
          .bullet-heading {
            padding-left: 0;
          }
          .bullet-heading::before {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

const ComplianceSection = () => {
  return (
    <div className="compliance-section">
      <div className="compliance-container">
        <h2 className="compliance-title">
          Professional Standards & Compliance
        </h2>

        <div className="compliance-items">
          <div className="compliance-card">
            {/* <img src={gmcLogo} alt="GMC" className="compliance-icon" /> */}
            <h4 className="compliance-heading">
              <span>GDPR</span>(General Data Protection)
            </h4>
            <p className="compliance-text">
              Guarantee protection of personally identifiable information
            </p>
          </div>

          <div className="compliance-card">
            {/* <img src={gmcLogo} alt="GMC" className="compliance-icon" /> */}
            <h4 className="compliance-heading">
              <span>GMC</span>
              (General Medical Council) registered Healthcare professionals
            </h4>
            <p className="compliance-text">
              Confirming doctor’s eligibility to practice their profession in
              the UK
            </p>
          </div>

          <div className="compliance-card">
            {/* <img src={dbsLogo} alt="DBS" className="compliance-icon" /> */}
            <h4 className="compliance-heading">
              <span>DBS</span>(Disclosure and Barring Service) Certification
            </h4>
            <p className="compliance-text">
              Ensuring patient safety and integrity of professionals
            </p>
          </div>

          <div className="compliance-card">
            {/* <img
              src={insuranceLogo}
              alt="Medical Indemnity Insurance"
              className="compliance-icon"
            /> */}
            <h4 className="compliance-heading">
              <span>Medical Indemnity Insurance</span>
            </h4>
            <p className="compliance-text">
              Covering professional practice as required by Healthcare
              practitioners
            </p>
          </div>
        </div>

        <p className="compliance-note">
          These credentials are mandatory to ensure our platform remains a
          trusted <br /> environment for both patients and practitioners.
        </p>
      </div>

      <style>{`
        .compliance-section {
          background: linear-gradient(180deg, #F7FAFD 0%, #FFFFFF 100%);
          padding: 80px 20px;
          display: flex;
          justify-content: center;
          text-align: center;
        }

        .compliance-container {
          max-width: 1100px;
          width: 100%;
        }

        .compliance-title {
          
          font-weight: 600; /* SemiBold */
          font-size: 40px;
          line-height: 42px;
          letter-spacing: 0;
          color: #464646;
          margin-bottom: 80px;
        }


        .compliance-items {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 50px;
        }

        .compliance-card {
          flex: 1 1 280px;
          max-width: 320px;
        }

        .compliance-icon {
          width: 145px;
          height: 123px;
          margin-bottom: 18px;
          object-fit: contain;
        }

      .compliance-heading {
          
          font-size: 24px;
          font-weight: 400;
          color: #515151;
          margin-bottom: 8px;
          line-height: 35px;
        }

        .compliance-heading span {
          
          font-weight: 500; /* Bold */
          font-size: 31px;
          line-height: 35px;
          letter-spacing: 0;
          color: #515151;
          margin-right: 4px;
        }


        .compliance-text {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
          margin: 0;
        }

       .compliance-note {
          
          font-weight: 600; /* SemiBold */
          font-size: 16px;
          line-height: 25px;
          letter-spacing: 0;
          color: #4C6BE9; /* Matches design color */
          text-align: center;
          margin-top: 60px;
        }


        /* Responsive */
        @media (max-width: 768px) {
          .compliance-items {
            flex-direction: column;
            align-items: center;
            gap: 40px;
          }

          .compliance-card {
            max-width: 100%;
          }

          .compliance-icon {
            width: 110px;
          }
        }
      `}</style>
    </div>
  );
};

const ComplianceSection2 = () => {
  return (
    <div className="compliance-section">
      <div className="compliance-container">
        {/* Title */}
        <h2 className="compliance-title">
          Professional Standards & Compliance
        </h2>

        {/* Cards */}
        <div className="compliance-grid">
          <div className="compliance-card fade-in">
            <img src={"/gdpr3.jpg"} alt="GMC" className="compliance-icon" />

            <h4 className="compliance-heading">
              <span>GDPR</span>
              <br /> (General Data Protection)
            </h4>
            <p className="compliance-text">
              Guarantee protection of personally identifiable information.
            </p>
          </div>

          <div
            className="compliance-card fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <img src={"/gmc.jpg"} alt="GMC" className="compliance-icon" />

            <h4 className="compliance-heading">
              <span>GMC</span>
              <br /> (General Medical Council)
            </h4>
            <p className="compliance-text">
              Confirms doctor’s eligibility to practice their profession in the
              UK.
            </p>
          </div>

          <div
            className="compliance-card fade-in"
            style={{ animationDelay: "0.4s" }}
          >
            <img src={dbsLogo} alt="DBS" className="compliance-icon" />

            <h4 className="compliance-heading">
              <span>DBS</span>
              <br /> (Disclosure & Barring Service)
            </h4>
            <p className="compliance-text">
              Ensures patient safety and integrity of practitioners.
            </p>
          </div>

          <div
            className="compliance-card fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <img
              src={insuranceLogo}
              alt="Medical Indemnity Insurance"
              className="compliance-icon"
            />
            <h4 className="compliance-heading">
              <span>Medical</span>
              <br /> Indemnity Insurance
            </h4>
            <p className="compliance-text">
              Provides essential coverage required by all Healthcare
              practitioners.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="compliance-note">
          These credentials are mandatory to ensure our platform remains a
          trusted environment for both patients and practitioners.
        </p>
      </div>

      <style>{`

      .compliance-icon {
          width: 145px;
          height: 123px;
          margin-bottom: 18px;
          object-fit: contain;
          
        }
        /* SECTION */
        .compliance-section {
          background: linear-gradient(180deg, #F7FAFD 0%, #FFFFFF 100%);
          padding: 90px 20px;
          display: flex;
          justify-content: center;
          text-align: center;
        }

        .compliance-container {
          max-width: 1100px;
          width: 100%;
        }

        .compliance-title {
          font-size: 36px;
          font-weight: 500;
          color: #3C3C3C;
          margin-bottom: 60px;
        }

        /* GRID */
        .compliance-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 10px;
          justify-content: center;
        }

        /* CARD */
        .compliance-card {
          background: #ffffff;
          padding: 28px 24px;
          border-radius: 16px;
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          cursor: pointer;
          transform: translateY(0);
          opacity: 0;
        }

        /* HOVER EFFECT */
        .compliance-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px rgba(76, 107, 233, 0.25);
          
        }

        .compliance-heading {
          font-size: 16px;
          font-weight: 400;
          color: #4A4A4A;
          margin-bottom: 10px;
          line-height: 30px;
        }

        .compliance-heading span {
          font-size: 24px;
          font-weight: 400;
          color: #4A4A4A;
        }

        .compliance-text {
          font-size: 15px;
          color: #636363;
          line-height: 26px;
          margin: 0;
        }

        /* FOOTER TEXT */
        .compliance-note {
          margin-top: 60px;
          font-size: 16px;
          font-weight: 600;
          color: #4C6BE9;
        }

        /* FADE IN ANIMATION */
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeInUp 0.8s ease forwards;
        }

        /* RESPONSIVE */
        @media (max-width: 768px) {
          .compliance-title {
            font-size: 32px;
          }
          .compliance-card {
            padding: 24px;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

const EmergencyNotice = () => {
  return (
    <div className="container d-flex justify-content-center">
      <div className="card border-0 text-center p-4">
        {/* Icon */}
        <div className="mb-3">
          <img src={plusicon} alt="Emergency Icon" />
        </div>

        {/* Disclaimer Text */}
        <p
          className="text-center"
          style={{
            color: "#464646",

            fontWeight: 400,
            fontSize: "14px", // smaller font for disclaimer
            lineHeight: "22px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <strong>Yodoc</strong> do not provide access to emergency services.
          Call <strong>111</strong> or <strong>999</strong> in case of serious
          conditions or injuries that require immediate medical attention.
        </p>
      </div>
    </div>
  );
};

export default AboutusPage;
