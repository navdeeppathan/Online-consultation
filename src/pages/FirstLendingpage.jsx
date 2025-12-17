import React, { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import demovideo from "../assets/images/yodocvideo.mp4";

import bgImage1 from "../assets/images/Mask group (1).png";
import rightimage from "../assets/images/rightbanner.png";
import plusicon from "../assets/images/plusicon.png";
import rightimage1 from "../assets/images/Rectangle 25.png";
import rightimage2 from "../assets/images/image 63.png";
import userImage from "../assets/images/21104.png";
import male from "../assets/images/male.png";
import female from "../assets/images/Female2.png";
import catimg from "../assets/images/catimg.jpg";
import trustpilot from "../assets/images/trustpilot.png";
import rightimage3 from "../assets/images/image-removebg-preview (3) 1.png";
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
import demoimage from "../assets/images/demoimage.png";
import image1 from "../assets/images/General-Practitioner-Transparent-Free-PNG.png";
import image2 from "../assets/images/Group 957.png";
import image3 from "../assets/images/Group 958.png";
import image4 from "../assets/images/image4.png";
import howitwhat from "../assets/images/howitworksbg.png";

import offer1 from "../assets/images/Offer 1.png";
import offer2 from "../assets/images/offer 2.png";
import start from "../assets/images/truspilot_img 1 (1).png";
import newimage from "../assets/images/In-Person (1).png";
// import headerfirst from "../assets/images/Header search.png";
import headerfirst from "../assets/images/sectionbg123.png";

import sectionbg from "../assets/images/Mask group (1).png";
import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Dropdown, Button } from "react-bootstrap";
import "../assets/SearchBox.css";
import Select from "react-select";
// import { Link } from "react-router-dom";
import axios from "axios";
import Config from "../config";
import Cookies from "js-cookie";
// Correct path
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

import { ChevronDown } from "lucide-react";

const FirstLendingpage = () => {
  const navigate = useNavigate();
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("user_cookie_consent");
    if (consent === "accepted") {
      setCookiesAccepted(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    Cookies.set("user_cookie_consent", "accepted", { expires: 30 });
    setCookiesAccepted(true);
  };

  const [allCategory, setCategory] = useState([]);
  const [allCategoryOne, setCategoryOne] = useState([]);
  const [allCategoryZero, setCategoryZero] = useState([]);

  const [alldoctor, setAlldoctor] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState("");
  // const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchDrDataCategory();
    fetchDrData();
    fetchDrDataCatOne();
    fetchDrDataCatZero();
  }, []);

  const fetchDrData = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/alldoctor`);
      // console.log("doctor Data:", response.data.doctors);
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

  const fetchDrDataCatOne = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/specialties`);
      const data = response.data.data; // only data array
      console.log("Active categories", data);
      setCategoryOne(data);

      // Set default selected category only if not set yet
      if (!selectedCategory && data?.length > 0) {
        setSelectedCategory(data[0].name);
      }
    } catch (error) {
      console.error(
        "Error fetching active categories:",
        error.response?.data || error.message
      );
    }
  };

  const fetchDrDataCatZero = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/specialties`);
      const data = response.data.data; // only data array
      console.log("Inactive categories", data);
      setCategoryZero(data);

      // Optional: set default selected category only if not already set
      if (!selectedCategory && data?.length > 0) {
        setSelectedCategory(data[0].name);
      }
    } catch (error) {
      console.error(
        "Error fetching inactive categories:",
        error.response?.data || error.message
      );
    }
  };

  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    // If allCategory is loaded from an API and initially empty, wait for it
    if (allCategory.length > 0) {
      setSelectedCategory("All");
    }
  }, [allCategory]);

  const filteredDoctors =
    selectedCategory === "All"
      ? alldoctor.slice(0, 18)
      : alldoctor
          .filter((doctor) => {
            let specialization =
              doctor.professional_registration?.specialization;

            try {
              specialization = JSON.parse(specialization);
            } catch (e) {}

            if (Array.isArray(specialization)) {
              return specialization.some(
                (spec) => spec.toLowerCase() === selectedCategory.toLowerCase()
              );
            }
            return (
              specialization?.toLowerCase() === selectedCategory.toLowerCase()
            );
          })
          .slice(0, 4);

  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch doctors once
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${Config.BASE_URL}/api/alldoctor`);
        if (res.data?.doctors) {
          setDoctors(res.data.doctors);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Handle search input
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();

    // Filter doctors
    const filtered = doctors.filter((doc) => {
      const fullName = `${doc.firstname || ""} ${
        doc.lastname || ""
      }`.toLowerCase();
      const specialization =
        doc.professional_registration?.specialization?.toLowerCase() || "";
      const subCategory =
        doc.professional_registration?.sub_category?.toLowerCase() || "";
      const availability = Array.isArray(doc.availability)
        ? doc.availability
            .map((a) =>
              `${a.day || ""} ${a.date || ""} ${a.start_time || ""}-${
                a.end_time || ""
              }`.toLowerCase()
            )
            .join(" ")
        : "";

      return (
        fullName.includes(lower) ||
        specialization.includes(lower) ||
        subCategory.includes(lower) ||
        availability.includes(lower)
      );
    });

    setSuggestions(filtered.slice(0, 5)); // show top 5 suggestions
  };

  const handleSuggestionClick = (doc) => {
    const fullName = `${doc.firstname || ""} ${doc.lastname || ""}`.trim();
    setQuery(fullName); // Set input value to the clicked name
    setSuggestions([]); // Close dropdown
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    const lower = query.toLowerCase();

    const matchedDoctor = doctors.find((doc) => {
      const fullName = `${doc.firstname || ""} ${
        doc.lastname || ""
      }`.toLowerCase();
      const specialization =
        doc.professional_registration?.specialization?.toLowerCase() || "";
      const subCategory =
        doc.professional_registration?.sub_category?.toLowerCase() || "";
      const availability = Array.isArray(doc.availability)
        ? doc.availability
            .map((a) =>
              `${a.day || ""} ${a.date || ""} ${a.start_time || ""}-${
                a.end_time || ""
              }`.toLowerCase()
            )
            .join(" ")
        : "";

      return (
        fullName.includes(lower) ||
        specialization.includes(lower) ||
        subCategory.includes(lower) ||
        availability.includes(lower)
      );
    });

    if (matchedDoctor) {
      navigate(`/doctordetails/${matchedDoctor.id}`);
      // setQuery("");
    } else {
      console.log("No matching doctor found.");
      // Optionally, show a message or redirect to a search results page
    }
  };

  const [allonlinedoctor, setAllonlinedoctor] = useState([]);
  const fetchOnlineDrData = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/all-onlinedoctor`
      );
      setAllonlinedoctor(response.data.doctors);
    } catch (error) {
      console.error(
        "Error fetching doctor data:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchOnlineDrData();
  }, []);

  const [isMuted, setIsMuted] = useState(true);

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
        <Header />
        <div>
          <TopHeader />
        </div>
        <div className="container mt-4">
          <div className="row">
            <div className="col-md-6 mt-2">
              <div className="row">
                <div className="col-12 col-lg-4 mb-4 position-relative">
                  <div
                    className="card-instant-doctor "
                    style={{
                      background: "#6F8DFF",
                    }}
                  >
                    <h4 className="card-instant-doctor__title">
                      <span className="desktop-title">
                        Instant
                        <br />
                        Consultations
                      </span>
                      <span className="mobile-title">
                        Instant Consultations
                      </span>
                    </h4>

                    <div className="card-instant-doctor__footer">
                      <p className="card-instant-doctor__status">
                        <span className="card-instant-doctor__plus">+</span>
                        {allonlinedoctor.length || 0} Doctor online
                      </p>
                      <div className="d-flex justify-content-center ">
                        <Link to="/allonlinedoctor">
                          <button className="card-instant-doctor__btn">
                            Consult Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-8 mb-4 position-relative margintop">
                  <Link
                    // to="/alldoctorinperson"
                    className="text-decoration-none text-dark"
                  >
                    <img
                      src={newimage}
                      alt="Video Consultation"
                      className="img-fluid rounded videoimage"
                    />
                    <div className="overlay-text text-dark p-1">
                      <h4 className="">
                        In-Person
                        <br />
                        Visit
                      </h4>
                      <p className="small mb-1">
                        Face-to-Face medical care at a
                        <br />
                        clinic for accurate diagnosis.
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6  position-relative mt-2">
              <Link
                // to="/alldoctorvideo"
                className="text-decoration-none text-dark"
              >
                <img
                  src={rightimage2}
                  alt="Video Consultation"
                  className="img-fluid rounded videoimage1"
                />
                <div className="overlay-text-video text-dark">
                  <h5 className=" textcss">
                    Virtual
                    <br />
                    Consultation
                  </h5>
                  <p className="small mb-1">
                    Speak to a doctor via a secure{" "}
                    <br className="d-block d-sm-none" /> and private
                    <br /> video consultation from your home.
                  </p>
                  {/* <Link
                    // to="/alldoctorvideo"
                    className="text-decoration-none text-dark"
                  >
                    <button className="bookbutton1 ">Video Consultation</button>
                  </Link> */}
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="container mt-5">
          <>
            <div className="row">
              <h4
                style={{
                  fontWeight: 500,
                  fontSize: "clamp(24px, 4vw, 36px)", // 👈 fully responsive font size
                  lineHeight: "1.2",
                  color: "#464646",
                  marginBottom: "24px",
                  textAlign: "start",
                }}
              >
                Our Consultants
              </h4>

              <div className="row justify-content-center">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor, index) => (
                    <div
                      className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4"
                      key={index}
                    >
                      <Link
                        to={`/doctordetails/${doctor.id}`}
                        className="text-decoration-none text-dark"
                      >
                        <div className="doctor-card-overlay position-relative">
                          <img
                            src={
                              doctor.profile_image
                                ? `${Config.BASE_URL}/${doctor.profile_image}`
                                : doctor.gender === "Female"
                                ? female
                                : male
                            }
                            alt="doctor"
                            className="doc-bg-img w-100 rounded"
                            style={{
                              objectFit: "cover",
                              aspectRatio: "1 / 1.1",
                              borderRadius: "12px",
                            }}
                          />

                          <div
                            className="white-box p-3 mt-2"
                            style={{
                              background: "#fff",
                              borderRadius: "12px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          >
                            <h5
                              style={{
                                fontWeight: 500,
                                fontSize: "clamp(14px, 2vw, 18px)",
                                color: "#464646",
                                marginBottom: "6px",
                              }}
                            >
                              {doctor.firstname} {doctor.lastname}
                            </h5>

                            <p
                              className="mb-2"
                              style={{
                                fontWeight: 400,
                                fontSize: "clamp(13px, 1.6vw, 15px)",
                                color: "#666",
                                lineHeight: "20px",
                                minHeight: "40px",
                              }}
                            >
                              {/* {JSON.parse(
                                doctor.professional_registration
                                  ?.specialization || "[]"
                              ).join(", ")} */}
                              {(() => {
                                const specializationArray = JSON.parse(
                                  doctor.professional_registration
                                    ?.specialization || "[]"
                                );

                                let spec = specializationArray[0] || "N/A";

                                // Convert "logy" → "logist"
                                if (
                                  spec !== "N/A" &&
                                  spec.toLowerCase().endsWith("logy")
                                ) {
                                  spec = spec.slice(0, -4) + "logist";
                                }

                                return spec;
                              })()}
                            </p>

                            <div
                              className="d-flex justify-content-between align-items-center text-center"
                              style={{
                                gap: "8px",
                                flexWrap: "nowrap",
                              }}
                            >
                              {/* Rating */}
                              <div style={{ flex: "1" }}>
                                <strong
                                  style={{
                                    fontWeight: 700,
                                    fontSize: "clamp(11px, 1vw, 13px)",
                                    color: "#4C6BE9",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "clamp(14px, 1.4vw, 16px)",
                                      color:
                                        doctor.overall_feedback_percentage > 0
                                          ? "#F1C40F"
                                          : "#D5D5D5",
                                    }}
                                  >
                                    ★
                                  </span>
                                  &nbsp;
                                  {doctor.overall_feedback_percentage}
                                </strong>
                                <p
                                  className="mb-0"
                                  style={{
                                    fontSize: "clamp(10px, 0.9vw, 12px)",
                                    color: "#464646",
                                    lineHeight: "1.2",
                                  }}
                                >
                                  Rating
                                </p>
                              </div>

                              {/* Experience */}
                              <div style={{ flex: "1" }}>
                                <strong
                                  style={{
                                    fontWeight: 700,
                                    fontSize: "clamp(11px, 1vw, 13px)",
                                    color: "#4C6BE9",
                                  }}
                                >
                                  {doctor.professional_registration
                                    ?.years_of_experience || 0}{" "}
                                  Years
                                </strong>
                                <p
                                  className="mb-0"
                                  style={{
                                    fontSize: "clamp(10px, 0.9vw, 12px)",
                                    color: "#464646",
                                    lineHeight: "1.2",
                                  }}
                                >
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
            </div>
          </>
        </div>

        <div className="container p-4">
          <div className="row py-4 text-center align-items-center custom-box">
            <div className="col-md happy">
              <h3
                style={{
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "40px",
                  lineHeight: "42px",
                  letterSpacing: "0",
                  color: "#464646",
                  marginBottom: "5px",
                }}
              >
                100
              </h3>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "20px",
                  lineHeight: "25px",
                  letterSpacing: "0",
                  color: "#464646",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Satisfied Users
              </p>
            </div>

            <div className="col-md happy">
              <h3
                style={{
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "40px",
                  lineHeight: "42px",
                  letterSpacing: "0",
                  color: "#464646",
                  marginBottom: "5px",
                }}
              >
                80
              </h3>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "20px",
                  lineHeight: "25px",
                  letterSpacing: "0",
                  color: "#464646",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Verified Consultations
              </p>
            </div>

            <div className="col-md happy">
              <h3
                style={{
                  fontWeight: 400,
                  fontStyle: "normal",
                  fontSize: "40px",
                  lineHeight: "42px",
                  letterSpacing: "0",
                  color: "#464646",
                  marginBottom: "5px",
                }}
              >
                10
              </h3>
              <p
                style={{
                  fontWeight: 400,
                  fontSize: "20px",
                  lineHeight: "25px",
                  letterSpacing: "0",
                  color: "#464646",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Reviews
              </p>
            </div>
          </div>
        </div>

        <div className="container mt-5 text-center">
          <h1 className="text-center mb-5 howit-title">How it works</h1>
          <div className="d-flex justify-content-center">
            <div className="video-wrapper">
              {/* <div className="video-card">
                <video
                  src={demovideo}
                  className="video-player"
                  autoPlay
                  loop
                  playsInline
                ></video>
              </div> */}
              <div className="video-card relative">
                <video
                  src={demovideo}
                  className="video-player"
                  autoPlay
                  loop
                  playsInline
                  muted={isMuted}
                ></video>

                {/* Mute / Unmute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="mute-btn"
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>

              <p className="video-caption">
                Watch our quick demo to see how YoDoc connects you with
                certified doctors for instant online consultations.
              </p>
            </div>
          </div>

          <style>
            {`
      .mute-btn {
          position: absolute;
           bottom: 15px;
          right: 15px;

          z-index: 20;
          background: transparent;
          color: black;
          padding: 10px;
          border-radius: 50%;
          border: none;
          outline: none;
        }


      .video-wrapper {
          width: 30%;
      }

      .video-card {
          position: relative;
         
          border-radius: 18px;
          overflow: hidden;
          border:none;
          
      }

      .video-player {
          width: 100%;
          height: 550px;
          object-fit: fill;
          border:none;
         
      }

      .video-caption {
          color: #333;
          margin-top: 15px;
          font-size: 17px;
      }

      @media (max-width: 992px) {
          .video-wrapper {
              width: 100%;
          }
      }
    `}
          </style>
        </div>

        <EmergencyNotice />

        {/* Cookie Consent Popup */}
        {!cookiesAccepted && (
          <div style={styles.overlay}>
            <div style={styles.container}>
              <h2 style={styles.title}>We Use Cookies</h2>
              <p style={styles.text}>
                We use cookies to enhance your experience. By clicking "Accept",
                you agree to our{" "}
                <Link to="/privacy-policy" style={styles.link}>
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link to="/terms-and-conditions" style={styles.link}>
                  Terms & Conditions
                </Link>
                .
              </p>
              <div style={styles.buttonWrapper}>
                <button onClick={handleAcceptCookies} style={styles.button}>
                  Accept Cookies
                </button>
              </div>
            </div>
          </div>
        )}

        <br />
        <br />

        <Footer />
      </div>

      <>
        {/* WhatsApp Button */}
        <a
          href="https://wa.me/447879175585?text=Hello%20there,%20I%20need%20help."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            backgroundColor: "#25D366", // WhatsApp green
            borderRadius: "50%",
            padding: "16px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.2s ease-in-out",
            zIndex: 1000,
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="white"
            style={{ width: "32px", height: "32px" }}
          >
            <path d="M16 .5C7.4.5.5 7.4.5 16c0 2.8.7 5.6 2.2 8.1L.5 31.5l7.7-2.1c2.4 1.3 5.1 2 7.8 2 8.6 0 15.5-6.9 15.5-15.5S24.6.5 16 .5zm0 28.1c-2.5 0-4.9-.7-7-2.1l-.5-.3-4.6 1.2 1.2-4.5-.3-.5c-1.4-2.2-2.1-4.6-2.1-7.1 0-7.3 6-13.3 13.3-13.3s13.3 6 13.3 13.3S23.3 28.6 16 28.6zm7.3-9.8c-.4-.2-2.5-1.2-2.9-1.4-.4-.2-.6-.2-.9.2s-1.1 1.4-1.3 1.7-.5.3-.9.1c-.5-.2-2.1-.8-4-2.6-1.5-1.4-2.6-3.1-2.9-3.6s0-.8.2-1c.2-.2.5-.6.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8-.1-.2-.9-2.1-1.2-2.9-.3-.7-.7-.6-1-.6h-.9c-.3 0-.8.1-1.2.6-.4.5-1.6 1.6-1.6 3.9s1.6 4.6 1.9 4.9c.2.3 3.2 4.8 7.7 6.7 1.1.5 2 1 2.7 1.3 1.1.4 2.1.3 2.9.2.9-.1 2.5-1 2.8-1.9.3-.9.3-1.7.2-1.9-.1-.2-.3-.3-.7-.5z" />
          </svg>
        </a>
      </>

      <style>
        .
        {`
@media (min-width: 900px) and (max-width: 1370px) {
.bookbutton1 {
    
    padding: 8px 15px;
   
}
}

  .card-instant-doctor {
  position: absolute;
  // border-radius: 20px;
  border-radius: 20px !important;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  color: white;
  display: flex;
  flex-direction: column;
  align-items: left;      /* horizontal center */
  justify-content: left; /* vertical center */
  border-radius: 0.375rem;
  text-align: left;
  padding: 20px;
  
}


.card-instant-doctor {
  position: relative; /* Changed from absolute */
  width: 100%;
  max-width: 350px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 20px;
 
  color: white;
}

@media (min-width: 769px) {
  .card-instant-doctor {
    max-width: none;
    margin: 0;
    width: 100%;
    height: 100%;
    border-radius: 20px;
  }
}


  
.card-instant-doctor__title {
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.3;
  margin-bottom: 6px;
 
  margin: 0;
  white-space: pre-line;
}
  .desktop-title {
  display: block;
}
.mobile-title {
  display: none;
}

.card-instant-doctor__footer {
  display: flex;
  flex-direction: column; /* default: stack for desktop */
  gap: 10px;
  margin-top: 10px;
}

.card-instant-doctor__status {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.card-instant-doctor__plus {
  color: #28d97b;
  font-size: 1.1rem;
  font-weight: bold;
  margin-right: 4px;
}

.card-instant-doctor__btn {
  background: white;
  color: #3a61f7;
  font-weight: 600;
  border: none;
  padding: 8px 30px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
margin-top: 15px;

}

.card-instant-doctor__btn:hover {
  background: #70efcd;
}

@media (max-width: 768px) {


 .card-instant-doctor {
    position: relative;       /* remove absolute to allow centering */
    margin: 20px auto;        /* center horizontally */
    width: 100%;               /* take most of the width */
    max-width: 350px;         /* not too wide */
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;             /* same as your screenshot */
  }


  .card-instant-doctor__btn {
    font-size: 0.85rem;
    padding: 6px 14px;
    align-self: flex-end; 
    margin-top: auto;  
    margin-left:30px;   
  }
     .card-instant-doctor__title {
    font-size: 1.2rem;
    //  white-space: nowrap;
  }
      .desktop-title {
    display: none;
  }
  .mobile-title {
    display: block;
  }
  .card-instant-doctor__footer {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

 
  
}      

.linksubcategory {
  color: #000;
  text-decoration: none;
}

.linksubcategory:hover {
  color: #2F79CF;
  text-decoration: none; /* keeps it off on hover too */
}
 


.highlight-number{
color:#2F79CF;
}
.highlight-numberplus{
color:#C40E0E;
}






@media (max-width: 768px) {
.happy{
margin-top:30px;
}
.offer-btn{
margin-top:0px;
        font-size: 10px;
}
 
}




.category-card-container {
  background-color: #ffffff;
  border-radius: 20px;
  // box-shadow: 0 5px 10px #ffffff;
}

.category-title {
  font-weight: 500;
  font-size:20px;
  color: #464646;
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

 .suggestions-list {
  position: absolute;
  top: 100%; /* exactly below search box */
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
  margin-top: 4px;
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
  // padding: 20px;
  margin-top:30px;
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

@media (max-width: 540px) {
.videoimage{
width:100%;

}
}


/* Mobile view */
@media (max-width: 768px) {
.videoimage1{
height:180px;
}
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
    // margin-top: -32px;


  }

.bookbutton{
display:none;
}
.bookbutton1{
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




.bookbutton {
  background-color: #4C6BE9;      /* Customize this color */
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top:20px;
}

.bookbutton1 {
  background-color: #fff;      /* Customize this color */
  color: #000;
  border: none;
  border-radius: 30px;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-top:20px;
}
  .bookbutton1:hover {
  background-color: #007BFF;   /* Change to your preferred hover color */
  color: #fff;                 /* Make text white on hover */
  transform: scale(1.05);      /* Slight zoom effect */
}

 /* Container wrapper */


/* Mobile responsiveness */
@media (max-width: 768px) {


  

 

  .headingtext {
    font-size: 22px;
    line-height: 32px;
    text-align: center;
  }
}

        .custom-box {
  background-color: #F7F9FC; 
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
  // height: 80px;
margin-top:-5px;
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
  // margin-top: 10px;
  transition: 0.3s;
}

.offer-btn:hover {
  background-color: #f2f2f2;
}

.bg-image-howit {
  background-size: cover;
  background-position: center;
 height: 690px;
 display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background-repeat: no-repeat;
}

.howit-title {
  
  font-weight: 500;
  font-size: 40px;
  line-height: 42px;
  letter-spacing: 0;
  color: #464646;
  text-align: center;
}


.howit-icon {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.howit-text {
 
  font-weight: 500;
  font-size: 22px;
  line-height: 30px;
  color: #464646;
  text-align: center;
  margin: 0 auto;
}


.bghow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
  width: 348px;
  height: 392px;
  border-radius: 12px;
  padding: 20px;
  // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.arrow-icon {
  font-size: 32px;
  color: #FFFFFF;
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
  padding: 10px 0px;
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
  color: #464646;
  border-radius: 30px;
  box-shadow: none;
}

.nav-pills .nav-link {
  background-color: #fff;
  color: #464646;
  border-radius: 30px;
  transition: box-shadow 0.3s;
}

.nav-pills .nav-link:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.active2{
  background-color: #FFFFFF;
  color: #464646;
  border-radius: 30px;
  // border:0.55px;
  // border-style: solid;
  // border-color: #D9D9D9;
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
  // box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
  .doctor-card-overlay:hover {

  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.doc-bg-img {
  width: 100%;
  height: 100%;
  
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.white-box {
     position: absolute;
    bottom: 8px;
    left: 8px;
    width: 94%;
    background: #FFFFFF;
    padding: 14px;
    z-index: 2;
    /* border-top-left-radius: 20px; */
    /* border-top-right-radius: 20px; */
    border-radius: 14px;
}


            .headingtext{
              font-size: 35px;
              font-weight: 600;
              line-height: 44px;
              
            }

/* Tablet & iPad Responsive Fix */
@media (min-width: 768px) and (max-width: 1024px) {
  .bg-image-howit {
    height: auto;               /* allow natural height */
    min-height: 500px;          /* ensure good visibility */
    // padding: 60px 30px;         /* balanced spacing */
    background-size: cover;
    background-position: center center;
  }
}


@media (max-width: 768px) {
            .bg-image-howit {
              height: auto;
            
            }
              
            .bghow {
              width:300px;
            }
            .headingtext {
                font-size: 24px; /* or another value suitable for smaller screens */
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
  height: auto;
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
                height: 442;

            }
                .overlay-text {
  position: absolute;
  top: 10%;
  left: 30px;
  z-index: 2;
  max-width: 100%;
  background-color: rgba(255, 255, 255, 0)
}
                  .overlay-text-video {
  position: absolute;
  top: 10%;
  left: 40px;
  z-index: 2;
  max-width: 100%;
  background-color: rgba(255, 255, 255, 0)
}
               .overlay-texttop {
  position: absolute;
  top: 10%;
  left: 10%;
  z-index: 2;
  width: 80%;
  background-color: rgba(255, 255, 255, 0)
}
   .col-12.col-md-4 {
  position: relative;
}

.image-container {
  background: linear-gradient(135deg, #4a6cf7, #3b5bdb); /* Blue gradient or solid blue */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden; /* Ensures rounded corners clip inner content */
  padding: 30px 10px; /* Add space around overlay text if no image */
  min-height: 230px;
}

.overlay-text1 {
  position: relative;
  text-align: center;
  color: white;
}

.overlay-text1 h6 {
  font-size: 1.2rem;
}

.overlay-text1 p {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.nowbutton {
  background: white;
  color: #4a6cf7;
  border: none;
  border-radius: 20px;
  padding: 6px 16px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .overlay-text1 h6 {
    font-size: 1rem;
  }

  .overlay-text1 p {
    font-size: 0.8rem;
  }

  .nowbutton {
    padding: 5px 12px;
    font-size: 0.85rem;
  }
}


@media (max-width: 768px) {
  .overlay-text {
    // top: 10%;
    left: 5%;
    font-size: 90%;
  }
            .overlay-texttop {
  position: absolute;
  top: 10%;
  left: 10%;
  z-index: 2;
  width: 80%;
  background-color: rgba(255, 255, 255, 0)
}
    .overlay-text1 {
    // top: 10%;
    // left: 5%;
    // width:100%;
    font-size: 90%;
  }

}

            `}
      </style>
    </>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,0.3)",
    padding: "10px",
    zIndex: 1000,
  },
  container: {
    backgroundColor: "#F4F8FB",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    padding: "20px",
    textAlign: "center",
    width: "100%", // full width on desktop/laptop
    maxWidth: "600px", // responsive limit on smaller screens
  },
  title: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "10px",
  },
  text: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
    lineHeight: "1.4",
  },
  link: {
    color: "#007BFF",
    textDecoration: "underline",
  },
  buttonWrapper: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#4C6BE9",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background 0.3s ease",
  },
};

// Add hover effect dynamically
styles.button[":hover"] = {
  backgroundColor: "#0056b3",
};

const EmergencyNotice = () => {
  return (
    <div className="">
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
          <strong>Yodoc</strong> does not provide access to emergency services.
          Call <strong>111</strong> or <strong>999</strong> in case of serious
          conditions or injuries that require immediate medical attention.
        </p>
      </div>
    </div>
  );
};

const OffersSection = () => {
  return (
    <>
      <div className="container mt-5">
        <h1
          style={{
            fontWeight: 500,
            fontSize: "clamp(28px, 4vw, 40px)", // 👈 fully responsive font size
            lineHeight: "1.2",
            color: "#464646",
            marginBottom: "24px",
            textAlign: "start",
          }}
        >
          Offers
        </h1>

        <div className="row mt-4">
          {/* Offer 1 */}
          <div className="col-12 col-md-6 position-relative mb-3">
            <img
              src={offer1}
              alt="Video Consultation"
              className="img-fluid rounded w-100"
            />
            <div className="offer-overlay">
              <h5>
                Get free <br />
                <span>
                  medical advice <br /> by asking a doctor
                </span>
              </h5>
              <Link
              // to="/category"
              >
                <button className="offer-btn ask-btn">Ask Question Now</button>
              </Link>
            </div>
          </div>

          {/* Offer 2 */}
          <div className="col-12 col-md-6 position-relative mb-3">
            <img
              src={offer2}
              alt="Video Consultation"
              className="img-fluid rounded w-100"
            />
            <div className="offer-overlay">
              <h5>
                Consult with <br />
                <span>
                  specialist <br /> at just
                </span>
              </h5>

              <div className="price-btn">
                <span className="price">£15</span>
                <a
                // href="/category"
                >
                  <button className="offer-btn">Consult Now</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
      .offer-overlay {
  position: absolute;
  top: 10%;
  left: 8%;
  color: #464646;
  
}

.offer-overlay h5 {
  font-weight: 500;
  font-size: 28px;
  line-height: 32px;
}

.offer-overlay h5 span {
  font-weight: 400;
  font-size: 20px;
  line-height: 26px;
}

.price-btn {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
}

.price {
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  font-size: 48px;
  line-height: 56px;
  color: #464646;
}

.offer-btn {
  
  font-weight: 500;
  font-size: 14px;
  background: #fff;
  border: none;
  border-radius: 999px;
  padding: 8px 20px;
  cursor: pointer;
}

.ask-btn {
  margin-top: 18px;
}

/*  Responsive for mobile */
@media (max-width: 768px) {
  .offer-overlay {
    top: 5%;
    left: 5%;
  }

  .offer-overlay h5 {
    font-size: 16px;
    line-height: 22px;
  }

  .offer-overlay h5 span {
    font-size: 16px;
    line-height: 22px;
  }

  .price {
    font-size: 24px;
    line-height: 40px;
  }

  .offer-btn {
    font-size: 13px;
    padding: 6px 16px;
  }
    .price-btn{
    margin-top: 8px;
    }

}

      `}
      </style>
    </>
  );
};

const SearchBar = () => {
  const navigate = useNavigate();

  const [condition, setCondition] = useState(null);
  const [location, setLocation] = useState(null);

  const [specialties, setSpecialties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Specialties
  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${Config.BASE_URL}/api/specialties`);
        const data = res.data?.data || [];
        setSpecialties(
          data.map((item) => ({
            value: item.name,
            label: item.name,
          }))
        );
      } catch (err) {
        console.error("Error fetching specialties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  // Fetch Locations
  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/cities`)
      .then((response) => {
        const data = response.data?.data || [];
        setLocations(
          data.map((city) => ({
            value: city.city_name,
            label: city.city_name,
          }))
        );
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Handle Search Click
  const handleSearch = () => {
    navigate(
      `/doctornewpage?name=${encodeURIComponent(
        condition?.value || ""
      )}&location=${encodeURIComponent(location?.value || "")}`
    );
  };

  return (
    <>
      <style>{`
        .search-card2 {
        
          background: #F6F8FD;
          border-radius: 50px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 900px;
          width: 100%;
          flex-wrap: wrap;
          position: relative;
          z-index: 10; /* ensure this layer is above page background */
        }

        .dropdown-wrapper2 {
          flex: 1;
          min-width: 220px;
        }


        .dropdown-wrapper2 {
          border-radius: 50px;
          transition: box-shadow 0.2s ease-in-out;
        }

        /* Shadow only when an item is selected */
        .dropdown-wrapper2.selected {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .search-button2 {
          background: linear-gradient(90deg, #4C6BE9 0%, #3046A2 100%);
          color: #FFFFFF; 
          border: none;
          border-radius: 50px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .search-button2:hover {
          background: #3258d6;
        }

        @media (max-width: 500px) {
          .search-card2 {
            flex-direction: column;
            border-radius: 20px;
            padding: 16px;
          }
          .search-button2 {
            width: 100%;
            border-radius: 12px;
          }
            .dropdown-wrapper2 {
            width: 100%;
            }
        }

        .dropdown-label2 {
          font-size: 13.33px;
          font-family: Poppins, sans-serif;
          font-weight: 400;
          
          color: #464646;
          margin-left: 15px;
          margin-top: 6px;
          margin-bottom: 0px;
          }

        .dropdown-label2.selected {
          color: #2B59E0;
        }
      `}</style>

      <div className="container">
        <div className="search-card2">
          {/* Condition Dropdown */}
          <div className={`dropdown-wrapper2 ${condition ? "selected" : ""}`}>
            <div className={`dropdown-label2 ${condition ? "selected" : ""}`}>
              What are you searching for ?
            </div>
            <Select
              options={specialties}
              isSearchable
              isLoading={loading}
              classNamePrefix="react-select"
              placeholder="Select Specialty"
              value={condition}
              onChange={setCondition}
              menuPortalTarget={document.body} // ✅ Dropdown rendered above all elements
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: 50,
                  padding: "0px 6px",
                  minHeight: "36px",
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: state.isFocused ? "none" : "none",
                  "&:hover": { border: "none" },
                  zIndex: 10,
                  fontFamily: "Poppins, sans-serif",
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                }),
                menuPortal: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                  zIndex: 9999, // ✅ ensures dropdown is on top
                }),
                menu: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif", // ✅ applies to dropdown list
                }),
                option: (base, state) => ({
                  ...base,
                  fontFamily: "Poppins, sans-serif", // ✅ applies to options
                  fontSize: "13px",
                  backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                  color: "#333",
                }),
              }}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
            />
          </div>

          {/* Location Dropdown */}
          <div className={`dropdown-wrapper2  ${location ? "selected" : ""}`}>
            <div className={`dropdown-label2 ${location ? "selected" : ""}`}>
              Where
            </div>
            <Select
              options={locations}
              isSearchable
              placeholder="Select Location"
              classNamePrefix="react-select"
              value={location}
              onChange={setLocation}
              menuPortalTarget={document.body} // ✅ same fix here
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: 50,
                  padding: "0px 6px",
                  minHeight: "36px",
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: state.isFocused ? "none" : "none",
                  "&:hover": { border: "none" },
                  zIndex: 10,
                  fontFamily: "Poppins, sans-serif",
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                }),
                menuPortal: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                  zIndex: 9999, // ✅ ensures dropdown is on top
                }),
                menu: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif", // ✅ applies to dropdown list
                }),
                option: (base, state) => ({
                  ...base,
                  fontFamily: "Poppins, sans-serif", // ✅ applies to options
                  fontSize: "13px",
                  backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                  color: "#333",
                }),
                input: (base) => ({
                  ...base,
                  fontSize: "13px", // ✅ fixes typing size
                  fontFamily: "Poppins, sans-serif", // ✅ applies Poppins to search
                  color: "#333",
                }),
              }}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
            />
            <style>{`/* --- React Select Dropdown Scrollbar --- */
.react-select__menu-list::-webkit-scrollbar {
  width: 6px;
}

.react-select__menu-list::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
}

.react-select__menu-list::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.6);
}

.react-select__menu-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.4) transparent;
}
`}</style>
          </div>

          {/* Search Button */}
          <button className="search-button2" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </>
  );
};

const TopHeader = () => {
  return (
    <>
      <div className=" position-relative mb-4">
        <img src={headerfirst} alt="background" className="imgright2" />
        <div className="overlay-texttop2">
          <h2>
            <span>
              Find and book Consultations with
              <br />
              Trusted Doctors and Specialists near you
            </span>
          </h2>

          <SearchBar />

          <p class="service-text">
            We make it easy for you to get access to over 80 doctors in the UK
            with only a few clicks.
          </p>
        </div>
      </div>

      <style>
        {`
      .imgright2 {
    width: 100%;
    height: 472px; /* Maintain aspect ratio */
    max-height: 564px; /* Optional max height */
    object-fit: cover; 
    
    /* Ensures the image covers the area */
  }

  .overlay-texttop2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%; /* Responsive width */
    max-width: 900px;
  }

  .overlay-texttop2 h2 {
   
    font-weight: 500;
    font-size: 42px;
    line-height: 45px;
    color: #41464C;
    text-align: center;
  }

  .overlay-texttop2 h2 span {
    font-weight: 400;
    font-size: 32px;
    line-height: 41px;
    text-align: center;
  }

  /* Base paragraph */
  .overlay-texttop2 p.doctors-text {
   
    font-size: 17.68px;
    line-height: 43.71px;
    text-align: center;
    margin-top: 15px;
    letter-spacing: 0; /* matches design */
  }

  /* "10k" */
  .overlay-texttop2 p.doctors-text .num {
    font-weight: 500;
    color: #2F79CF;
  }

  /* "+" */
  .overlay-texttop2 p.doctors-text .plus {
    font-weight: 600;
    color: red;
  }

  /* "Doctors" */
  .overlay-texttop2 p.doctors-text .label {
    font-weight: 400;
    color: #41464C; /* or inherit */
  }

  /* 📱 Responsive scaling */
  @media (max-width: 768px) {
    .overlay-texttop2 p.doctors-text {
      font-size: 15px;       /* slightly smaller */
      line-height: 28px;     /* tighter spacing */
    }
  }


  .overlay-texttop2 p.service-text {
    
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    color: #515151;
    text-align: center;
    margin-top: 15px;
    letter-spacing: 0; /* matches spec */
  }

  /* 📱 Responsive scaling */
  @media (max-width: 768px) {
    .overlay-texttop2 p.service-text {
      font-size: 14px;
      line-height: 20px;
    }
  }


  @media (max-width: 992px) {
    .overlay-texttop2 h2 {
      font-size: 36px;
      line-height: 42px;
    }

    .overlay-texttop2 h2 span {
      font-size: 28px;
      line-height: 38px;
    }
  }

  @media (max-width: 768px) {
    .overlay-texttop2 h2 {
      font-size: 28px;
      line-height: 36px;
    }

  .overlay-texttop2 h2 span {
    font-size: 22px;
    line-height: 32px;
  }


}

      `}
      </style>
    </>
  );
};

export default FirstLendingpage;
