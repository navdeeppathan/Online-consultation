import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/Mask group (1).png";
import innerpage from "../assets/images/Inner page header.png";
import banner1 from "../assets/images/doctor-consultation1.jpg";
import banner4 from "../assets/images/banner4.png";
import Footer from "../components/Footer";
import aboutimaage from "../assets/images/Group (2).png";
import { useState } from "react";
import { FaUserPlus, FaEnvelopeOpenText, FaUserMd } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { AiFillSchedule } from "react-icons/ai";
function YodocProfilePage() {
  return (
    <>
      <div
        className="backgroundimage"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          minHeight: "100%",
        }}
      >
        {/* Your content below header and over background image */}
        <Header />
        <YodocSignup />
        <YodocProfileSteps />
        <Footer />
      </div>

      <style>
        {`





 .suggestions-list {
  position: absolute;
  top: 85%; /* exactly below search box */
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 10px;
  max-height: 250px;
  width: 100%;
  max-width: 700px;
  overflow-y: auto;
  z-index: 999;
  list-style: none;
  // margin-top: 4px;
  padding: 0;
}

.suggestion-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #f1f1f1;
  font-size: 14px;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}
  


.search-box {
   display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
}

/* Main container */
.search-input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  max-width: 700px;
  width: 100%;
  gap: 8px;
  height:52px;
  overflow: hidden;
}
  .search-input-group .search-button{
  margin-right:3px;
  }

/* Location button */
.location {
  display: flex;
  align-items: center;
  // background-color: #e0eaf3;
  background-color: #F5FAFF;

  padding: 16px 16px;
  // border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.location img {
  height: 18px;
  margin-right: 6px;
}

/* Search input */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  padding: 12px 16px;
  color: #333;
  background-color: white;
}

/* Search button */
.search-button {
  background-color: #70efcd;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button img {
  height: 20px;
}

/* Mobile view */
@media (max-width: 768px) {
.suggestions-list {
    width: 85%;
    max-width: none;
  }
  .search-input-group {
    // flex-direction: column;
    align-items: stretch;
    // padding: 6px;
    // gap: 42px;
    width:100%;
    background-color: white;
    border-radius: 16px;
    height:46.5px;

  }


  .search-input
  {
    width: 100%;
    border-radius: 12px;
  }
    .location{
    width: 28%;
    font-size:12px;

    }
     .search-button{
    width: 15%;

     }

  .search-button {
    height: 40px;
    justify-content: center;
  }

  .search-input-group .search-button{

  margin-right:3px;
  margin-top:3px;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
 

  .headingtext {
    font-size: 22px;
    line-height: 32px;
    text-align: center;
  }
}


            /* Base styles */


.section-container {

  padding: 80px 20px;
  border-radius: 20px;
  margin-top: 20px;
  text-align: center;
}









                    `}
      </style>
    </>
  );
}

// replace with your Yodoc mockup

const YodocSignup = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row ">
          {/* Left Side */}
          <div className="col-md-6 mb-4 mb-md-0">
            <div className="text-center mb-4">
              <h2 className="">Yodoc</h2>
              <p className="text-muted">Online Doctor Consultation Platform</p>
            </div>

            <p className="lead text-center mb-4">
              Yodoc is designed to make healthcare accessible anytime, anywhere.
              Connect with certified doctors instantly for professional
              consultations, all from the comfort of your home. Book video or
              in-person consultations with well experienced GPs and specialist
              doctors.
            </p>

            {/* <div className="row text-center">
              <div className="col-md-4 mb-3">
                <div className="d-flex flex-column align-items-center">
                  <i
                    className="fas fa-clock mb-2"
                    style={{ fontSize: "100px", color: "#4A4A4A" }}
                  ></i>
                  <h5 className="">24/7 Access</h5>
                </div>
                <p className="text-muted">
                  Consult medical professionals anytime without visiting a
                  clinic.
                </p>
              </div>

              <div className="col-md-4 mb-3">
                <div className="d-flex flex-column align-items-center">
                  <i
                    className="fas fa-lock mb-2"
                    style={{ fontSize: "100px", color: "#4A4A4A" }}
                  ></i>
                  <h5 className="">Secure & Private</h5>
                </div>
                <p className="text-muted">
                  HIPAA-compliant platform keeping patient data confidential.
                </p>
              </div>

              <div className="col-md-4 mb-3">
                <div className="d-flex flex-column align-items-center">
                  <i
                    className="fas fa-user-md mb-2"
                    style={{ fontSize: "100px", color: "#4A4A4A" }}
                  ></i>
                  <h5 className="">Certified Doctors</h5>
                </div>
                <p className="text-muted">
                  Connect with licensed doctors across multiple specialties.
                </p>
              </div>
            </div> */}
          </div>

          {/* Right Side */}
          <div className="col-md-6 text-center">
            <div className="position-relative d-inline-block">
              <img
                src={banner1}
                alt="Yodoc Laptop"
                className="img-fluid rounded"
                style={{ height: "300px", width: "100%" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const YodocProfileSteps = () => {
  return (
    <section style={{ background: "#f8f9fa" }} className="py-5">
      <div className="container text-center">
        <h2 className=" mb-5">
          Create your free Yodoc profile in 4 simple steps
        </h2>

        <div className="row g-4 justify-content-center">
          {/* Step 1 */}
          <div className="col-md-3">
            <div className="p-3">
              <FaUserPlus size={40} color="#004AAD" className="mb-3" />
              <h5 className="">Register on Yodoc</h5>
              <p>
                Click ‘on’ the link to activate your account and then log in.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="col-md-3">
            <div className="p-3">
              <FaEnvelopeOpenText size={40} color="#004AAD" className="mb-3" />
              <h5 className="">Verify your Email</h5>
              <p>
                Check your registered email for a verification link. Click the
                link to activate your account and log in.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="col-md-3">
            <div className="p-3">
              <FaUserMd size={40} color="#004AAD" className="mb-3" />
              <h5 className="">Create Your Profile</h5>
              <p>Ensure that you complete your profile details</p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="col-md-3">
            <div className="p-3">
              <MdDashboard size={40} color="#004AAD" className="mb-3" />
              <h5 className="">Access your dashboard </h5>
              <p>
                Head to your dashboard to manage your appointments,
                consultations and payments
              </p>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="mt-3 text-muted mb-5">
          <b>Note:</b> Verifying your email and professional registration
          ensures that you get listed as a genuine practitioner on Yodoc.
        </p>
      </div>
      <div className="container d-flex align-items-center justify-content-center">
        <div className="row  text-center">
          <div className="col-md-4 mb-3">
            <div className="d-flex flex-column align-items-center">
              <i
                className="fas fa-user-md mb-2"
                style={{ fontSize: "100px", color: "#4A4A4A" }}
              ></i>
              <h5 className="">Certified Doctors</h5>
            </div>
            <p className="text-muted">
              Connect with licensed doctors across multiple specialties.
            </p>
          </div>
          <div className="col-md-4 mb-3 ">
            <div className="d-flex flex-column align-items-center">
              <i
                className="fas fa-clock mb-2"
                style={{ fontSize: "100px", color: "#4A4A4A" }}
              ></i>
              <h5 className="">24/7 Access</h5>
            </div>
            <p className="text-muted">
              Consult medical professionals anytime without visiting a clinic.
            </p>
          </div>

          <div className="col-md-4 mb-3">
            <div className="d-flex flex-column align-items-center">
              <i
                className="fas fa-lock mb-2"
                style={{ fontSize: "100px", color: "#4A4A4A" }}
              ></i>
              <h5 className="">Secure & Private</h5>
            </div>
            <p className="text-muted">
              HIPAA-compliant platform keeping patient data confidential.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YodocProfilePage;
