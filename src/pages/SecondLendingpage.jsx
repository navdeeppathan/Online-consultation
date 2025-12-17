import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import bgImage1 from "../assets/images/Mask group (1).png";
import newimage from "../assets/images/In-Person (1).png";
import howitwhat from "../assets/images/How it works bg.png";
import userImage from "../assets/images/21104.png";
import offer1 from "../assets/images/Offer 1.png";
import offer2 from "../assets/images/offer 2.png";

import rightimage1 from "../assets/images/Rectangle 25.png";
import rightimage2 from "../assets/images/image 63.png";
import sectionbg from "../assets/images/Mask group (1).png";
import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import icon from "../assets/images/doctor-01.png";
import icon1 from "../assets/images/Group 926.png";
import icon2 from "../assets/images/Group 927.png";
import icon3 from "../assets/images/Group 928.png";
import icon4 from "../assets/images/Group 982.png";
import icon5 from "../assets/images/Group 931.png";
import tab from "../assets/images/tab.png";
import tab1 from "../assets/images/tab1.png";
import tab2 from "../assets/images/tab2.png";
import tab3 from "../assets/images/tab3.png";
import tab4 from "../assets/images/tab4.png";
import tab5 from "../assets/images/tab5.png";
import tab6 from "../assets/images/tab6.png";
import image1 from "../assets/images/General-Practitioner-Transparent-Free-PNG.png";
import image2 from "../assets/images/Group 957.png";
import image3 from "../assets/images/Group 958.png";
import image4 from "../assets/images/Group 959.png";
import left from "../assets/images/left.png";
import center from "../assets/images/center.png";
import right from "../assets/images/right.png";

import start from "../assets/images/truspilot_img 1.png";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import Config from "../config";
import axios from "axios";

// Correct path

const SecondLendingpage = () => {
  const [allCategory, setCategory] = useState([]);
  const [alldoctor, setAlldoctor] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchDrDataCategory();
    fetchDrData();
  }, []);

  const fetchDrData = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/alldoctor`);
      console.log("doctor Data:", response.data.doctors);
      setAlldoctor(response.data.doctors);
    } catch (error) {
      console.error(
        "Error fetching doctor data:",
        error.response?.data || error.message
      );
    }
  };

  const fetchDrDataCategory = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/specialties`);
      console.log("categories", response.data.data); // not response.data
      setCategory(response.data.data);
      if (response.data.data?.length > 0) {
        setSelectedCategory(response.data.data[0].name); // Default selected
      } // store only the data array
    } catch (error) {
      console.error(
        "Error fetching category data:",
        error.response?.data || error.message
      );
    }
  };

  const filteredDoctors = alldoctor
    .filter(
      (doctor) =>
        doctor.professional_registration?.specialization === selectedCategory
    )
    .slice(0, 4);
  return (
    <>
      {/* Header stays on top */}

      {/* Background image section BELOW the header */}
      <div
        className="backgroundimage"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          minHeight: "100%",
        }}
      >
        <Header />

        <div className="container mt-4">
          <div className="section-container">
            <h1 className="headingtext">
              Find Local Doctors and &nbsp;
              <br />
              Practitioners You Can Trust
            </h1>
            <p>
              <span className="highlight-number">10k</span>{" "}
              <span className="textred">+</span> Doctors
              <img scr={sectionbg} />
            </p>

            <div className="image-stack">
              <img src={left} alt="left" className="img img-left" />
              <img src={center} alt="center" className="img img-center" />
              <img src={right} alt="right" className="img1 img-right" />
            </div>

            <div className="search-box">
              <div className="search-input-group">
                <div className="location">
                  <img src={locationicon} alt="Location" />
                  {/* <span>London</span> */}
                </div>

                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by Specialties, Location, and Availability"
                />

                <button className="search-button">
                  <img src={searchicon} alt="Search" />
                </button>
              </div>
            </div>

            <button className="booknowbutton mt-5">Book Now</button>
          </div>
        </div>

        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6 mt-4">
              <div className="row">
                {/* Image with overlay: rightimage1 */}
                <div className="col-6 col-md-4 mb-4 position-relative mb-3">
                  <img
                    src={rightimage1}
                    alt="Instant Doctor"
                    className="img-fluid rounded"
                  />
                  <div className="overlay-text1 text-white  text-center">
                    <h6 className="fw-bold textcss text-center">
                      INSTANT
                      <br />
                      DOCTOR
                    </h6>
                    <p className="small mb-1 text-center">
                      {" "}
                      <span className="plusicon">+</span>1Doctor online
                    </p>
                    <button className="nowbutton btn-sm text-center">
                      Consult Now
                    </button>
                  </div>
                </div>

                {/* Image with overlay: rightimage2 */}
                {/* <div className="col-6 col-md-8 mb-4 position-relative mt-4"> */}
                {/* <img src={rightimage2} alt="Video Consultation" className='img-fluid rounded' />
  <div className="overlay-text text-dark p-3">
    <h5 className="fw-bold">VIDEO<br />CONSULTATION</h5>
    <p className="small mb-1">Speak to a doctor online from home via secure video.</p>
  </div> */}

                <div className="col-6 col-md-8 mb-4 position-relative ">
                  <img
                    src={newimage}
                    alt="Video Consultation"
                    className="img-fluid rounded"
                  />
                  <div className="overlay-text text-dark p-3">
                    <h4 className="fw-bold">
                      In-Person <br />
                      Visit
                    </h4>
                    <p className="small mb-1">
                      Face-to-face medical care
                      <br />
                      at the clinic for accurate diagnosis.
                    </p>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
            <div className="col-md-6 position-relative mt-4">
              <img
                src={rightimage2}
                alt="Video Consultation"
                className="img-fluid rounded"
              />
              <div className="overlay-text text-dark">
                <h5 className="fw-bold textcss">
                  VIDEO
                  <br />
                  CONSULTATION
                </h5>
                <p className="small mb-1">
                  Speak to a doctor
                  <br /> online from home via <br /> secure video.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="container my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="headingtext  align-items-center justify-content-between">
              Primary Care Services
              <Link to="/category">
                <img src={icon4} className="ml-5" alt="link-icon" />
              </Link>
            </h3>
          </div>

          <div className="p-4  category-card-container bg-white">
            <div className="row">
              {allCategory.slice(0, 6).map((category) => (
                <div
                  className="col-12 col-md-6 col-lg-4 mb-4"
                  key={category.id}
                >
                  <h6 className="category-title mb-3">{category.name}</h6>
                  <ul className="list-unstyled text-muted small mb-0">
                    {category.subCat?.map((sub) => (
                      <li key={sub.id}>{sub.name}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <h1 className="headingtext">
            Expert Assistance
            <Link to="/categorydoctor">
              <img src={icon4} className="ml-5" />
            </Link>
          </h1>

          <>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              {allCategory.slice(0, 6).map((category, index) => (
                <li className="nav-item" key={index}>
                  <button
                    className={`nav-link ${
                      selectedCategory === category.name ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                    style={{
                      cursor: "pointer",
                      fontWeight: 400,
                      fontSize: "15px",
                      color: "#333",
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="row">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => (
                  <div className="col-12 col-md-3 mb-4" key={index}>
                    <Link
                      to={`/doctordetails/${doctor.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="doctor-card-overlay position-relative">
                        <img
                          src={
                            doctor.profile_image
                              ? `${Config.BASE_URL}/${doctor.profile_image}`
                              : userImage
                          }
                          alt="doctor"
                          className="doc-bg-img"
                        />
                        <div className="white-box">
                          <h5 className="mb-1">
                            {doctor.firstname} {doctor.lastname}
                          </h5>
                          <p className="mb-2 text-muted">
                            {JSON.parse(
                              doctor.professional_registration
                                ?.specialization || "[]"
                            ).join(", ")}
                          </p>
                          <div className="d-flex justify-content-between text-center">
                            <div>
                              <strong>92%</strong>
                              <p className="mb-0 small text-muted">Satisfied</p>
                            </div>
                            <div>
                              <strong>0</strong>
                              <p className="mb-0 small text-muted">Patient</p>
                            </div>
                            <div>
                              <strong>
                                {doctor.professional_registration
                                  ?.years_of_experience || 0}{" "}
                                Years
                              </strong>
                              <p className="mb-0 small text-muted">
                                Experience
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-4">
                  <h5 className="text-muted">No Doctor Available</h5>
                </div>
              )}
            </div>
          </>
        </div>

        <div className="container mt-5">
          <div
            className="bg-image-howit py-5"
            style={{
              backgroundImage: `url(${howitwhat})`,
            }}
          >
            <h1 className="text-center mb-5 howit-title">How it works</h1>

            <div className="d-flex flex-column flex-md-row justify-content-center align-items-center gap-4 howit-row">
              {/* Step 1 */}
              <div className="bghow text-center">
                <img
                  src={image2}
                  className="howit-icon mb-3"
                  alt="Select Doctor"
                />
                <h6 className="howit-text">
                  Select Doctor / Health Care Professional
                </h6>
              </div>

              {/* Arrow */}
              <div className="arrow-icon d-none d-md-block">→</div>

              {/* Step 2 */}
              <div className="bghow text-center">
                <img
                  src={image3}
                  className="howit-icon mb-3"
                  alt="Call Doctor"
                />
                <h6 className="howit-text">
                  Audio video / In-Person <br />
                  call with a verified doctor
                </h6>
              </div>

              {/* Arrow */}
              <div className="arrow-icon d-none d-md-block">→</div>

              {/* Step 3 */}
              <div className="bghow text-center">
                <img
                  src={image4}
                  className="howit-icon mb-3"
                  alt="Get Prescription"
                />
                <h6 className="howit-text">
                  Get a digital Prescription <br />& a free follow-up
                </h6>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <h4 className="fw-bold">Offers</h4>
          <div className="row mt-4">
            {/* <div className="offer-box offerfirst d-flex align-items-center justify-content-between px-4">
           
               <h5 className="text-white mb-3">Get free medical advice<br />by asking a doctor</h5>
               <button className="offer-btn">Ask Question Now</button>
            
             <img src={offer1} alt="Doctor 1" className="offer-img mt-5" />
           </div> */}

            <div className="col-12 col-md-6 mb-4 position-relative mb-3">
              <img
                src={offer1}
                alt="Video Consultation"
                className="img-fluid rounded"
              />
              <div className="overlay-text text-dark p-3">
                <h5 className="text-white mb-3 fw-bold">
                  Get free medical advice
                  <br />
                  by asking a doctor
                </h5>
                <button className="offer-btn">Ask Question Now</button>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-4 position-relative mb-3">
              <img
                src={offer2}
                alt="Video Consultation"
                className="img-fluid rounded"
              />
              <div className="overlay-text text-dark p-3">
                <h5 className="text-dark mb-2 fw-bold">
                  Consult with
                  <br />
                  specialist at just
                </h5>
                <span className="text-dark fw-bold currencydata">£15</span>
                <button className="offer-btn ml-5">Consult Now</button>
              </div>
            </div>
          </div>
        </div>

        <div class="container p-4">
          <div class="row  py-4 text-center align-items-center custom-box">
            <div class="col-md">
              <h3 class="font-weight-bold">4000</h3>
              <p class="mb-0">Happy Customers</p>
            </div>
            <div class="col-md">
              <h3 class="font-weight-bold">2000</h3>
              <p class="mb-0">Verified Doctors</p>
            </div>
            <div class="col-md">
              <h3 class=" font-weight-bold">1200</h3>
              <p class="mb-0">Specialists</p>
            </div>
            <div class="col-md">
              <h3 class=" font-weight-bold">750</h3>
              <p class="mb-0">surgeons</p>
            </div>
            <div class="col-md d-flex align-items-center justify-content-center trustpilot">
              <img src={start} alt="Trustpilot" class="mr-2 startcss" />
              <div></div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <Footer />
      </div>

      <style>
        {`

        .category-card-container {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 5px 10px #ffffff;
}

.category-title {
  font-weight: 600;
  font-size:20px;
  color: #333;
}

.headingtext {
  font-size: 24px;
  font-weight: bold;
  color: #1c1c1c;
}

.list-unstyled li {
  margin-bottom: 6px;
}

@media (max-width: 768px) {
  .category-card-container {
    padding: 1.5rem;
  }

  .headingtext {
    font-size: 20px;
  }
}

        .custom-box {
  background-color: #f8f9fa; /* Matches light gray background */
  border-radius: 16px;
  margin-top:-20px;

}

.custom-box h3 {
  color: #333;
  // font-style: italic;
}

.custom-box p {
  color: #555;
  margin-bottom: 0;
}

.trustpilot img {
  // height: 24px;
}

.startcss {
width: 191.99952697753906px;
height: 100px;
}

        .currencydata {
          font-size: 32px;
          font-weight: 600;
        }
.offer-box {
  height: 200px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px;
}

.offerfirst {
  background: linear-gradient(to right, #6ED8BC, #327DC8E5);
  color: white;
}

.offersecond {
  background: linear-gradient(to right, #CBE688, #32A8A8E5);
  color: #000;
}

.offer-img {
  height: 100%;
  object-fit: contain;
  width:200px;
}

.offer-btn {
  background: white;
  color: #000;
  padding: 10px 20px;
  border: none;
  border-radius: 30px;
  font-weight: 600;
  margin-top: 10px;
  transition: 0.3s;
}

.offer-btn:hover {
  background-color: #f2f2f2;
}


.bg-image-howit {
  background-size: cover;
  background-position: center;
  border-radius: 16px;
  padding: 40px 20px;
  background-repeat: no-repeat;
}

.howit-title {
  font-weight: 600;
  color: #333;
  font-size: 32px;
}

.howit-icon {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.howit-text {
  color: #333;
  font-weight: 500;
  padding: 0 10px;
  font-size: 16px;
  line-height: 1.5;
}

.bghow {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: aliceblue;
  width: 232px;
  height: 260px;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.arrow-icon {
  font-size: 32px;
  color: #333;
  // margin: 0 10px;
  font-weight: 600;
}

.howit-row {
  flex-wrap: wrap;
}

/* Entire nav-pills container */
.nav-pills {
  // background-color: #fff;
  border-radius: 12px;
  padding: 10px;
  flex-wrap: wrap;
  // justify-content: center;
}

/* Default tab style */
.nav-pills .nav-link {
  color: #000;
  border-radius: 30px;
  padding: 8px 20px;
  margin: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

/* Active tab style */
.nav-pills .nav-link.active {
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #000;
  border-radius: 30px;
}

/* Tab images (optional) */
.nav-pills .nav-link img {
  width: 20px;
  height: 20px;
}

.doctor-card-overlay {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 400px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.doc-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.white-box {
     position: absolute;
    bottom: 7px;
    left: 8px;
    width: 94%;
    background: #FFFFFF;
    padding: 14px;
    z-index: 2;
    /* border-top-left-radius: 20px; */
    /* border-top-right-radius: 20px; */
    border-radius: 20px;
}


            .headingtext{
              font-size: 35px;
              font-weight: 600;
              line-height: 44px;
              
            }
              @media (max-width: 768px) {
    .headingtext {
        font-size: 25px; /* or another value suitable for smaller screens */
        line-height: 30px; /* adjust as needed */
    }
}

          .iconcss {
  width: 108px;
  height: 108px;
  margin: 20px auto 10px auto;
  display: block;
}

.crdcss {
  height: 243px;
  padding: 10px 5px;
  width: 170px;
  border-radius: 20px;
  border: 2px solid #F7F9FC;
  background-color: #F7F9FC;
  transition: all 0.3s ease-in-out;
  box-shadow: none;
}

.crdcss:hover {
  background-color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.crdcss h6 {
  font-size: 14px;
  margin-bottom: 5px;
}

.crdcss p {
  font-size: 12px;
  margin-bottom: 0;
}
  .booknowbutton{
  border-radius: 30px;
  color: #fff;
  background-color: #4C6BE9;
  border: 2px solid #4C6BE9;
  font-weight: 600;
  padding: 6px 16px;
  transition: all 0.3s ease-in-out;
  }

            .nowbutton{
             border-radius: 30px;
  color: #4C6BE9;
  background-color: #fff;
  border: 2px solid #4C6BE9;
  font-weight: 600;
  padding: 6px 16px;
  transition: all 0.3s ease-in-out;
            }
            .plusicon{
            color: #70EFCD;
            font-size: 20px;
            }
            .textcss{
                font-size: 25px;
                line-height: 30px;
                font-weight: 500;
            }
            .imgright{
                width: 100%;
                height: auto;

            }
                .overlay-text {
  position: absolute;
  top: 10%;
  left: 10%;
  z-index: 2;
  max-width: 100%;
  background-color: rgba(255, 255, 255, 0)
}
             .overlay-text1 {
  position: absolute;
  top: 10%;
  left: 20%;
  z-index: 2;
  max-width: 100%;
}

@media (max-width: 768px) {
  .overlay-text {
    top: 10%;
    left: 5%;
    font-size: 90%;
  }
}





.search-box {
  display: flex;
  justify-content: center;
  margin-top: 10px;
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
  .search-input-group {
    // flex-direction: column;
    align-items: stretch;
    // padding: 6px;
    // gap: 42px;
    width:325px;
    background-color: white;
    border-radius: 16px;
    height:46.5px;
    // margin-top: -32px;


  }

.bookbutton{
display:none;
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
@media (max-width: 768px) {
 

  .headingtext {
    font-size: 22px;
    line-height: 32px;
    text-align: center;
  }
}


            /* Base styles */

.section-container {
  text-align: center;
  margin-top: 40px;
  font-weight: 500;
}

.headingtext {
  font-size: 36px;
  font-weight: 600;
  color: #333;
  line-height: 48px;
  margin-bottom: 20px;
}

.textred {
  color: red;
  font-weight: 500;
}

.highlight-number {
  color: blue;
  font-weight: 500;
}

.image-stack {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
  margin-top: 30px;
  gap: 0;
}

.img {
  width: 200px;
  height: auto;
  border-radius: 10px;
  transition: 0.3s ease;
  position: relative;
}
  .img1 {
  width: 270px;
  height: auto;
  border-radius: 10px;
  transition: 0.3s ease;
  position: relative;
}

.img-left {
  z-index: 1;
  transform: scale(1.1);
 margin-left:50px;

  }
  .img-right {
  z-index: 1;
  transform: scale(1.1);
  }

.img-center {
  z-index: 2;
  transform: scale(1.1);
  margin: 0 -50px; /* negative margin to overlap */
}

@media (max-width: 768px) {
  .image-stack {
    flex-direction: column;
    align-items: center;
  }

  .img {
    width: 80%; /* Adjust width for smaller screens */
    margin: 10px 0;
    transform: none !important; /* Reset scale on small screen */
  }

  .img-left,
  .img-right {
    opacity: 1;
    filter: none;
    margin-top: 10px;
  }

  .img-center {
    margin: 0;
  }
}

@media (max-width: 480px) {
  .img {
    width: 90%;
  }
}






/* Responsive styles */
@media (max-width: 768px) {
  .headingtext {
    font-size: 22px;
    line-height: 32px;
  }

  
}




            `}
      </style>
    </>
  );
};

export default SecondLendingpage;
