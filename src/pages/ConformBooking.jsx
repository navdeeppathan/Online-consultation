import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/Mask group (1).png";
import innerpage from "../assets/images/Inner page header.png";
import card from "../assets/images/2224471_atm card_credit card_debit card_master card_icon 1.png";
import userImage from "../assets/images/21104.png";
import register from "../assets/images/registerimage.png";
import registerbg from "../assets/images/Registerasdoctorbg.png";

import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import Footer from "../components/Footer";
import { useEffect, useRef, useState } from "react";
import Config from "../config";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import male from "../assets/images/male.png";
import female from "../assets/images/Female.png";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment/moment";
import YoDocTermsPage from "../components/YoDocTermsPage";

function ConformBooking() {
  const navigate = useNavigate();
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

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [paShow, setPaShow] = useState(false);
  const [registerpatientData, setRegisterPatientData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    address: "",
    role: "patient",
  });

  const handleChangepatient = (e) => {
    const { name, value } = e.target;

    // Allow only digits and limit to 10

    setRegisterPatientData({
      ...registerpatientData,
      [name]: value,
    });
  };

  const handleRegisterPatientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${Config.BASE_URL}/api/register`,
        registerpatientData
      );
      toast.success(
        "Registered successfully! Please log in. Please check your email for login details."
      );
      setLgShow(true);

      setPaShow(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false); // stop loading always
    }
  };

  const inputRefs = useRef([]);
  const [appointmentPayload, setAppointmentPayload] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [patientID, setPatientID] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]); // or whatever state holds your slots
  const id = doctorInfo?.id;
  const userData = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false); // <-- Move these up
  const [lgShow, setLgShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [mobile_number, setMobile_number] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  useEffect(() => {
    const payload = JSON.parse(localStorage.getItem("appointmentPayload"));
    const drInfo = payload?.doctorInfo || null;

    setAppointmentPayload(payload || null);
    setDoctorInfo(drInfo || null);
  }, []);

  useEffect(() => {
    const checkUserId = setInterval(() => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData?.id) {
        setPatientID(userData.id); // set state
        clearInterval(checkUserId); // stop the interval once ID is found
      }
    }, 500); // checks every 500 ms (adjust as needed)

    return () => clearInterval(checkUserId); // cleanup on component unmount
  }, []);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setPatientID(userData?.id || null);

    const payload = JSON.parse(localStorage.getItem("appointmentPayload"));
    if (payload && payload.slots) {
      payload.slots.forEach((slot) => {
        console.log(
          `Date: ${slot.date}, Time: ${slot.time}, Slot: ${slot.time_slot}, Fee: ${slot.fees}`
        );
      });

      // If you need them in a state:
      setSelectedSlots(payload.slots);
    }
    const drInfo = payload?.doctorInfo || null;

    setAppointmentPayload(payload || null);
    setDoctorInfo(drInfo || null);
  }, []);
  if (!appointmentPayload || !doctorInfo) {
    return (
      <div className="text-center mt-5">Loading appointment details...</div>
    );
  }

  const ConformBookingSlot = async () => {
    if (!patientID) {
      // toast.error(
      //   "Patient information is missing. Please log in or try again."
      // );
      setLgShow(true);
      return;
    }

    // toast.success("Appointment(s)  successfully!");
    // localStorage.removeItem("appointmentPayload");
    // localStorage.removeItem("doctorInfo");
    navigate("/insurance");
  };

  const handleLoginP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const mobile = {
      mobile_number,
    };
    try {
      const res = await axios.post(`${Config.BASE_URL}/api/send-otp`, mobile);

      handleShow();
      setLgShow(false);
      // Open OTP modal after short delay

      // Close modal after short delay
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false); // stop loading always
    }
  };

  const handleChangeotp = (e, i) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // only numbers

    let newOtp = [...otp];
    newOtp[i] = value ? value[0] : ""; // only 1 digit
    setOtp(newOtp);

    // Auto move to next if value entered
    if (value && i < 5) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      let newOtp = [...otp];

      if (otp[i]) {
        // if current has value → clear it
        newOtp[i] = "";
        setOtp(newOtp);
      } else if (i > 0) {
        // if empty → move focus back
        inputRefs.current[i - 1].focus();

        // also clear previous value
        newOtp[i - 1] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/[^0-9]/g, "");

    if (!paste) return;

    let newOtp = [...otp];
    for (let j = 0; j < 6; j++) {
      newOtp[j] = paste[j] || "";
    }
    setOtp(newOtp);

    // Focus last filled box
    const lastIndex = Math.min(paste.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerifyP = async () => {
    setLoading(true);
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await axios.post(`${Config.BASE_URL}/api/verify-otp`, {
        mobile_number,
        otp: enteredOtp,
      });

      const userdata = res.data.user;
      const step = Number(userdata?.step);
      const role = userdata?.role; // Keep as string if role is a string like 'doctor'

      console.log(step, "??");
      handleClose();
      // window.location.reload()
      // handleShow1();
      toast.success("OTP Verified Successfully!");
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP Verification failed");
    } finally {
      setLoading(false); // stop loading always
    }
  };

  return (
    <>
      <Toaster />

      <div
        className="backgroundimage"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100%",
        }}
      >
        {/* Your content below header and over background image */}
        <Header />
        <div className="container mt-2">
          <div
            className="section-container"
            style={{
              backgroundImage: `url(${innerpage})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
              minHeight: "100%",
            }}
          >
            <h1 className="headingtext">
              Find Local Doctors and &nbsp;
              <br />
              Practitioners You Can Trust
            </h1>
            <p>
              <span className="highlight-number">10k+</span> Doctors
              <img scr={sectionbg} />
            </p>

            <div className="search-box">
              <div className="search-input-group">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by Dr. Name ,Specialization & Services"
                  value={query}
                  onChange={handleChange}
                />

                <button className="search-button" onClick={handleSearch}>
                  <img src={searchicon} alt="Search" />
                </button>
              </div>

              <ul className="suggestions-list">
                {suggestions.map((doc) => (
                  <li
                    key={doc.id}
                    className="suggestion-item"
                    style={{ textAlign: "left", cursor: "pointer" }}
                    onClick={() => handleSuggestionClick(doc)}
                  >
                    <div>
                      <span style={{ color: "#464646" }}>
                        {doc.firstname} {doc.lastname} ({" "}
                        {JSON.parse(
                          doc.professional_registration?.specialization || "[]"
                        ).join(", ")}
                        (
                        {JSON.parse(
                          doc.professional_registration?.sub_category || "[]"
                        ).join(", ")}
                        ))
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-lg-8 mb-4 mt-4">
              <div className="card p-4 shadow-sm cardData p-4">
                <h5 className="mb-3">
                  <i className="fas fa-user me-4"></i>Appointment Summary
                </h5>
                <div className=" p-3 mb-3">
                  <p className="mb-1 mt-2">
                    <strong>Patient Name:</strong>{" "}
                    {userData?.firstname || "Your Name"}
                  </p>
                  <p className="mb-1 mt-2">
                    <strong>Phone Number:</strong>{" "}
                    {userData?.mobile_number || "+44 0000000000"}
                  </p>
                </div>

                <p className="text-muted small mb-2">
                  You will be contacted through this number. Please review your
                  appointment details before proceeding to payment. Once
                  confirmed, you'll receive a booking confirmation via email.
                </p>

                <div className="bg-light p-3 rounded mb-3">
                  <h5>
                    {" "}
                    <img src={card} className="me-3" /> Check Payment Method
                  </h5>
                  <div className="onlinesection">
                    <div className="d-flex align-items-center justify-content-between mt-3 mx-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          checked
                          readOnly
                        />
                        <label className="form-check-label ms-2 font-weight-bold">
                          Online Payment{" "}
                        </label>
                      </div>
                      <div>
                        <span className="font-weight-bold">
                          Pay online and get 10% off
                        </span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-end mt-3 mx-3 mb-4">
                      <div>
                        <span className="text-muted text-decoration-line-through me-2">
                          £
                          {parseFloat(
                            appointmentPayload.slots[0]?.fees
                          ).toFixed(2)}
                        </span>
                        <span className="font-weight-bold">
                          £
                          {parseFloat(
                            appointmentPayload.slots[0]?.fees
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mb-4 mt-4">
              <div className="doctor-card text-center p-4 shadow-sm">
                <img
                  src={
                    doctorInfo.profile_image
                      ? `${Config.BASE_URL}/${doctorInfo.profile_image}`
                      : doctorInfo.gender === "Female"
                      ? female
                      : male
                  }
                  alt={doctorInfo.firstname}
                  className="doctor-img mb-3"
                />
                <h5>
                  {doctorInfo.firstname} {doctorInfo.lastname}
                </h5>
                <p className="text-muted mb-1">
                  {doctorInfo.degree} (
                  {JSON.parse(doctorInfo?.specialization || "[]").join(", ")})
                </p>
                <div className="consult-fee mb-3">
                  {appointmentPayload.type === "virtual" ? (
                    <>
                      <i className="fas fa-video me-2"></i>
                      Virtual Consultation Fees
                    </>
                  ) : appointmentPayload.type === "in-person" ? (
                    <>
                      <i className="fas fa-plus me-2"></i>
                      In-Person Fees
                    </>
                  ) : (
                    <>
                      <i className="fas fa-question-circle me-2"></i>
                      Unknown Type
                    </>
                  )}
                  <strong>
                    &nbsp;£
                    {parseFloat(appointmentPayload.slots[0]?.fees).toFixed(2)}
                  </strong>
                </div>
                <div className="mt-2">
                  {appointmentPayload.slots?.map((slot, index) => (
                    <div className="date-chip mb-2" key={index}>
                      {moment(slot.date).format("DD/MM/YYYY")}
                      <span className="time-slot">{slot.start_time}</span>
                    </div>
                  ))}
                </div>

                {!(userData && userData.role === "doctor") && (
                  <button
                    className="confirm-btn mt-3"
                    onClick={ConformBookingSlot}
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <style>
        {`

          .register-link {
      color: #007bff; /* Bootstrap’s blue or your desired blue */
      text-decoration: underline;
      cursor: pointer;
      font-weight: 500;
    }

    .register-link:hover {
      color: #0056b3; /* Darker blue on hover */
    }

/* Container */
/* Wrapper for center alignment */
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
  

 /* Wrapper for center alignment */
.search-box {
   display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
}
.search-box {
  display: flex;
  justify-content: center;
  padding: 20px;
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
.calendar-wrapper{
margin-left:-11px;
}
.doctor-img{
width:100px;
height:120px;
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

.headingtext {
  font-size: 36px;
  font-weight: 600;
  color: #333;
  line-height: 48px;
  margin-bottom: 20px;
}

.highlight-number {
  color: blue;
  font-weight: 500;
}




/* Responsive styles */
@media (max-width: 768px) {
  .headingtext {
    font-size: 22px;
    line-height: 32px;
  }

  
}
.appointment-card-wrapper {
  width: 100%;
}

.appointment-box {
  background: #fff;
  border-radius: 12px;
  max-width: 420px; /* control the card's width */
}

.appointment-img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #4d6aff;
}

.appointment-info {
  flex: 1;
  text-align: left;
}

.doctor-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}

.doctor-specialization {
  font-size: 0.9rem;
  color: #777;
  margin: 0.2rem 0;
}

.date-chip {
  background: #f0f3ff;
  padding: 0.35rem 0.8rem;
  border-radius: 50px;
  font-size: 0.85rem;
  color: #333;
  display: inline-flex;
  align-items: center;
}

.date-chip .time-slot {
  color: #4d6aff;
  margin-left: 0.3rem;
  font-weight: 500;
}


.cardData{
background-color:#fff;
border:2px solid #fff;

}
.onlinesection{
background-color:#E4F7F2;
border:2px solid #E4F7F2;
  border-radius: 16px;

}
.doctor-card {
  border: 1px solid #ddd;
  border-radius: 12px;
  background-color: #fff;
  padding: 1.5rem;
  text-align: center;
}

.doctor-img {
  width: 100px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto;
}

.consult-fee {
  font-size: 0.95rem;
  color: #333;
}

.date-chip {
  border: 1px solid #ccc;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  display: inline-block;
  font-size: 0.9rem;
  color: #555;
}

.date-chip .time-slot {
  color: #4d6aff;
  margin-left: 0.3rem;
  font-weight: 500;
}

.confirm-btn {
  background-color: #4d6aff;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  max-width: 220px;
  transition: background 0.3s;
}

.confirm-btn:hover {
  background-color: #3c53cc;
}


           .search-container {
  display: flex;
  justify-content: center;   /* Centers the box horizontally */
  padding: 20px;             /* Optional spacing around the box */
}

.serchBox {
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
}

.serchBox .form-control {
  border-radius: 0;
  box-shadow: none;
}

.serchBox .search-btn {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}

.serchBox img {
  width: 20px;
  height: 20px;
}
        /* Optional for spacing and alignment */
   .save-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.save-btn {
  background-color: #4d6aff;
  color: white;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}
        .doctor-img{
        width:165px;
        height:200px;
        }
.week-calendar {
  gap: 5px;
}



  

            /* Base styles */


.section-container {

  padding: 80px 20px;
  border-radius: 20px;
  margin-top: 20px;
  text-align: center;
}

.headingtext {
  font-size: 36px;
  font-weight: 600;
  color: #333;
  line-height: 48px;
  margin-bottom: 20px;
}

.highlight-number {
  color: blue;
  font-weight: 500;
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

      <Modal
        size="lg"
        show={paShow}
        onHide={() => setPaShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        className="custom-modal"
      >
        <Modal.Header
          closeButton
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
            border: "none",
            background: "transparent",
          }}
        ></Modal.Header>
        <Modal.Body className="p-0 register-modal">
          <div className="row no-gutters">
            {/* Left Image Section */}
            <div className="col-md-5 d-none d-md-block">
              <img
                src={register}
                className="img-fluid register-image"
                alt="Register"
              />
            </div>

            {/* Right Form Section */}
            <div
              className="col-md-7 p-5 d-flex flex-column justify-content-center "
              style={{
                backgroundImage: `url(${registerbg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100%",
                borderTopRightRadius: "30px", // adjust px as needed
                borderBottomRightRadius: "30px", // adjust px as needed
                overflow: "hidden",
              }}
            >
              <h3 className="modal-title mb-3">Register</h3>
              <p className="modal-description">
                Create your account to book online or in-person consultations
                with trusted doctors.
              </p>

              <form onSubmit={handleRegisterPatientSubmit}>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstname"
                        value={registerpatientData.firstname}
                        placeholder="First Name"
                        className="form-control custom-placeholder"
                        onChange={handleChangepatient}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        value={registerpatientData.lastname}
                        onChange={handleChangepatient}
                        placeholder="Last Name"
                        className="form-control custom-placeholder"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={registerpatientData.email}
                    onChange={handleChangepatient}
                    placeholder="Email"
                    className="form-control custom-placeholder"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>

                  <div className="input-group mb-4">
                    <div className="input-group-prepend">
                      <span className="input-group-text">+44</span>
                    </div>
                    <input
                      type="tel"
                      name="mobile_number"
                      value={registerpatientData.mobile_number}
                      onChange={handleChangepatient}
                      placeholder="Your Phone Number"
                      className="form-control custom-placeholder"
                      maxLength="10"
                      pattern="\d{10}"
                      required
                    />
                  </div>
                </div>

                {/* <div className=" mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="agreeTerms">
                      By registering, you agree to our{" "}
                      <Link
                        to="/privacy-policy"
                        style={{
                          textDecoration: "underline",
                          color: "#207EB1",
                        }}
                      >
                        Privacy Policy
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/terms-and-conditions"
                        style={{
                          textDecoration: "underline",
                          color: "#207EB1",
                        }}
                      >
                        Terms & Conditions
                      </Link>
                      .
                    </label>
                  </div>
                </div> */}

                <TermsAgreement
                  agreeTerms={agreeTerms}
                  setAgreeTerms={setAgreeTerms}
                />
                <div className="d-flex justify-content-end mt-4">
                  <button
                    type="submit"
                    className="registerbutton"
                    disabled={loading}
                  >
                    {loading ? "Please wait..." : "Register"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={lgShow} onHide={() => setLgShow(false)}>
        <Modal.Header
          closeButton
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
            border: "none",
            background: "transparent",
          }}
        ></Modal.Header>
        <Modal.Body>
          <div className="row no-gutters">
            <div className="col-md-12 p-5 d-flex flex-column justify-content-center">
              <h3 className="login-title mb-3">Sign In to Continue</h3>
              <p className="login-description">
                Please provide your Email to login
              </p>

              <div className=" mb-3">
                {/* <div className="input-group-prepend">
                  <span className="input-group-text">+44</span>
                </div> */}
                <input
                  type="email"
                  className="form-control custom-placeholder"
                  placeholder="Enter Your Email"
                  // maxLength={10}
                  value={mobile_number}
                  // onChange={(e) => {
                  //   const val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                  //   if (val.length <= 10) {
                  //     setMobile_number(val);
                  //   }
                  // }}
                  onChange={(e) => setMobile_number(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="continue-button mt-2"
                onClick={handleLoginP}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Continue"}
                <span className="ml-2">→</span>
              </button>

              <div
                onClick={() => {
                  setPaShow(true);
                  setLgShow(false);
                }}
                className="d-flex justify-content-end align-items-center mt-3 mb-4"
              >
                <p className="register-link">New User Register</p>
              </div>
            </div>

            <h6 className="text-center"> Your Appointment</h6>
            <div className="appointment-card-wrapper d-flex justify-content-center my-4">
              <div className="appointment-box p-4 border rounded shadow-sm d-flex align-items-center gap-3">
                <img
                  src={
                    doctorInfo.profile_image
                      ? `${Config.BASE_URL}/${doctorInfo.profile_image}`
                      : userImage
                  }
                  alt={doctorInfo.firstname}
                  className="appointment-img"
                />
                <div className="appointment-info">
                  <h5 className="doctor-name">
                    {doctorInfo.firstname} {doctorInfo.lastname}
                  </h5>
                  <p className="doctor-specialization">
                    {doctorInfo.degree} (
                    {JSON.parse(doctorInfo?.specialization || "[]").join(", ")})
                  </p>
                  <div className="date-chip mt-2">
                    {/* {appointmentPayload.slots[0]?.date},{" "}
                    {appointmentPayload.slots[0]?.time}{" "}
                    <span className="time-slot">
                      {appointmentPayload.slots[0]?.time_slot}
                    </span> */}
                    {appointmentPayload.slots?.map((slot, index) => (
                      <div key={index}>
                        {moment(slot.date).format("DD/MM/YYYY")}
                        <span className="time-slot">{slot.start_time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
            border: "none",
            background: "transparent",
          }}
        ></Modal.Header>
        <Modal.Body>
          <div
            className=" px-4 py-5 position-relative"
            style={{
              // backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100%",
            }}
          >
            <div className="text-center">
              <h4 className="mb-2 font-weight-bold">Verify OTP code</h4>
              <p>
                A message has been sent to <strong>{mobile_number}</strong>{" "}
                {/* <span style={{ color: "#007bff", cursor: "pointer" }}>
                  (Edit)
                </span> */}
              </p>

              <div className="d-flex justify-content-center my-4 gap-2">
                {[...Array(6)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="otp-input mx-1 text-center"
                    value={otp[i] || ""}
                    onChange={(e) => handleChangeotp(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    onPaste={(e) => handlePaste(e, i)}
                    ref={(el) => (inputRefs.current[i] = el)}
                    style={{
                      width: "40px",
                      height: "40px",
                      fontSize: "20px",
                      textAlign: "center",
                    }}
                  />
                ))}
              </div>

              <p className="text-muted mb-3">
                Resend verification code in 0:27
              </p>
              {/* <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="exampleCheck1"
                />
                <label class="form-check-label" for="exampleCheck1">
                  Remember me
                </label>
              </div> */}
              <button
                type="submit"
                className="btnVerify mt-3"
                onClick={handleVerifyP}
                disabled={loading}
              >
                {loading ? "Please wait..." : "OTP Verify"}
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

const TermsAgreement = ({ agreeTerms, setAgreeTerms }) => {
  const [showModal, setShowModal] = useState(false);
  const [localAgree, setLocalAgree] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleAgree = () => {
    if (localAgree) {
      setAgreeTerms(true);
      handleClose();
    }
  };

  return (
    <div className="mb-3">
      <div className="d-flex align-items-center gap-2">
        {/* Circle "!" button */}
        <button
          type="button"
          className="btn btn-outline-primary rounded-circle"
          style={{ width: "35px", height: "35px", fontWeight: "bold" }}
          onClick={handleOpen}
        >
          !
        </button>

        <label className="form-check-label" style={{ cursor: "pointer" }}>
          {agreeTerms
            ? "You have agreed to Terms & Privacy Policy"
            : "Click ! to read and accept Terms"}
        </label>
      </div>

      {/* Modal with Terms page */}
      <Modal
        show={showModal}
        onHide={handleClose}
        size="xl"
        // centered
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "70vh", // control height of modal body
            overflowY: "auto",
            // enable vertical scroll
          }}
        >
          {/* Render your full Terms Page */}
          <YoDocTermsPage />

          {/* Checkbox inside modal */}
          <div className="form-check mt-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="modalAgree"
              checked={localAgree}
              onChange={(e) => setLocalAgree(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="modalAgree">
              I have read and agree to the Terms & Conditions.
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAgree}
            disabled={!localAgree}
          >
            Accept & Continue
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConformBooking;
