//new------------------------------------------------------------------------
import React, { useEffect, useRef, useState, useCallback } from "react";
import Logo2 from "../assets/images/Logo.png";
import Logo from "../assets/images/whiteLogo2.png";

import Location from "../assets/images/elements.png";
import register from "../assets/images/registerimage.png";
import register1 from "../assets/images/doctorregisterimage.png";
import registerbg from "../assets/images/Registerasdoctorbg.png";
import registerbg1 from "../assets/images/Registeraspatientbg.png";
import loginicon2 from "../assets/images/loginicon.svg";
import loginicon from "../assets/images/whitelock.png";

import facebook from "../assets/images/facebook.png";
import google from "../assets/images/google.png";
import bgImage from "../assets/images/image 79.png";
import iphone from "../assets/images/iphone.png";
import login from "../assets/images/Frame.png";
import userimage from "../assets/images/userimage.jpg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { MdArrowDropDown } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import Config from "../config";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css"; // or 'style.css' for minimal
import YoDocTermsPage from "./YoDocTermsPage";
import TermsAndConditions from "../admin/pages/TermsAndConditions";
import PatientRegTAndC from "../admin/pages/PatientRegTAndC";
import DoctorRegTAndC from "../admin/pages/DoctorRegTAndC";
import Loader from "../Loader";
import { CircularProgress } from "@mui/material";

function Header() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);

  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const [lgShow, setLgShow] = useState(false);
  const [drShow, setDrShow] = useState(false);
  const [paShow, setPaShow] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);
  const [loginDropdownd, setLoginDropdownd] = useState(false);
  const [registerDropdown, setRegisterDropdown] = useState(false);
  const [profileData, setProfileData] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const checkUserId = setInterval(() => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        clearInterval(checkUserId); // stop checking
      }
    }, 500); // check every second

    return () => clearInterval(checkUserId); // cleanup on unmount
  }, []);

  const [registerData, setRegisterData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    address: "",
    role: "doctor",
    profile_image: null,
  });

  useEffect(() => {
    if (userData && userData.id) {
      fetchPersonalInfo();
      // fetchDrDataCategory();
    }
  }, []);
  const fetchPersonalInfo = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/profile/${userData.id}`
      );
      const data = response.data;
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching info", error);
    }
  };
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "mobile_number") {
      const digitsOnly = value.replace(/\D/g, ""); // Remove non-digits
      if (digitsOnly.length <= 10) {
        setRegisterData({ ...registerData, [name]: digitsOnly });
      }
    } else {
      setRegisterData({ ...registerData, [name]: value });
    }
  };

  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }
    setLoading(true);
    const formData = new FormData();

    formData.append("firstname", registerData.firstname);
    formData.append("lastname", registerData.lastname);
    formData.append("email", registerData.email);
    formData.append("mobile_number", registerData.mobile_number);
    formData.append("address", registerData.address);
    formData.append("role", registerData.role);

    try {
      const res = await axios.post(
        `${Config.BASE_URL}/api/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setRegisterData([]);
      // toast.success("Registered successfully!");
      toast.success(
        "Registered successfully! Please log in. Please check your email for login details."
      );

      setDrShow(false);
      setAgreeTerms(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false); // stop loading always
    }
  };

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

      setPaShow(false);
      setAgreeTerms(false);
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false); // stop loading always
    }
  };

  const [mobile_number, setMobile_number] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!mobile_number) {
      toast.error("Please enter email");
      return;
    }
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
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // re-enable button
    }
  };

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

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

  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${Config.BASE_URL}/api/verify-otp`, {
        mobile_number,
        otp: enteredOtp,
      });

      const userdata = res.data.user;
      const step = Number(userdata?.step);
      const role = userdata?.role; // Keep as string if role is a string like 'doctor'

      console.log(step, "??");

      if (role === "patient") {
        setTimeout(() => {
          if (step === 7 || step === 6) {
            navigate("/dashboardpatient");
          } else {
            navigate("/patient-information");
          }
          // navigate("/dashboardpatient");
        }, 1000);
      }

      if (role === "doctor") {
        setTimeout(() => {
          if (step === 6) {
            navigate("/dashboard");
          } else {
            navigate("/information");
          }
        }, 1000);
      }

      handleClose();
      // handleShow1();
      toast.success("OTP Verified Successfully!");

      localStorage.setItem("authToken", res.data.token);

      // localStorage.setItem("user", JSON.stringify(res.data.user));
      const expiryTime = Date.now() + 45 * 60 * 1000;
      const userDataWithExpiry = { ...userdata, expiryTime };
      localStorage.setItem("user", JSON.stringify(userDataWithExpiry));
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP Verification failed");
    } finally {
      setLoading(false); // stop loading always
    }
  };

  const [allCategory, setCategory] = useState([]);
  const [alldoctor, setAlldoctor] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchDrDataCategory = useCallback(async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/specialties`);
      console.log("categories", response.data.data); // not response.data

      setCategory(response.data.data);
      if (response.data.data?.length > 0) {
        setSelectedCategory(response.data.data[0].name);
      }
    } catch (error) {
      console.error(
        "Error fetching category data:",
        error.response?.data || error.message
      );
    }
  }, []);

  useEffect(() => {
    fetchDrDataCategory();
  }, [fetchDrDataCategory]);

  const [loading2, setLoading2] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleLoad = () => setLoading2(false);

    // If everything is already loaded (like cached images)
    if (document.readyState === "complete") {
      setLoading2(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);
  // Optionally, show loading on route change
  useEffect(() => {
    setLoading2(true);

    const handleLoad = () => setLoading2(false);

    if (document.readyState === "complete") {
      setLoading2(false);
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, [location]);

  if (loading2) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          zIndex: 9999,
        }}
      >
        <span class="loader2"></span>
        <style>
          {`
              .loader2 {
        width: 36px;
        height: 36px;
        border: 3px solid #C4C4C4;
        border-bottom-color: #464646;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        animation: rotation 1s linear infinite;
        }
    
        @keyframes rotation {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
        } `}
        </style>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <nav
        className="navbar navbar-expand-lg py-2 logotoggele"
        style={{
          background: "linear-gradient(90deg, #4C6BE9  0%, #3046A2 100%)",
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <a className="navbar-brand">
            <Link to="/">
              <img src={"/Logo (1).png"} alt="Logo" className="logocss" />
            </Link>
          </a>

          {/* <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
           
          >
            <span className="navbar-toggler-icon"></span>
          </button> */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{
              borderColor: "white",
            }}
          >
            <span
              className="navbar-toggler-icon"
              style={{
                filter: "invert(1)", // makes it white
              }}
            ></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Center Menu */}
            {/* <ul className="navbar-nav mx-auto gap-3 d-flex align-items-center">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Doctors
                </a>
                <ul className="dropdown-menu">
                  <li className="dropdown-menu-custom1">
                    <Link
                      to={`/alldoctor`}
                      style={{
                        color: "#464646",
                        textDecoration: "none",
                        // backgroundColor: "#E4F7F2",
                      }}
                      onMouseEnter={(e) => (e.target.style.color = "#2F79CF")}
                      onMouseLeave={(e) => (e.target.style.color = "#464646")}
                    >
                      <h6 className=" mb-2 mt-2"> View All</h6>
                    </Link>
                    {allCategory.map((category) => (
                      <div key={category.id}>
                        <Link
                          to={`/alldoctorcatsub?name=${category.name}`}
                          style={{ color: "#464646", textDecoration: "none" }}
                          onMouseEnter={(e) =>
                            (e.target.style.color = "#2F79CF")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.color = "#464646")
                          }
                        >
                          <h6 className=" mb-2 mt-2">{category.name}</h6>
                        </Link>
                      </div>
                    ))}
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  Hospitals
                </a>
                <ul className="dropdown-menu">
                  <li className="dropdown-menu-custom">
                    <Link
                      to="/hospital"
                      style={{ color: "#464646", textDecoration: "none" }}
                      onMouseEnter={(e) => (e.target.style.color = "#2F79CF")}
                      onMouseLeave={(e) => (e.target.style.color = "#464646")}
                    >
                      Top Hospitals
                    </Link>
                  </li>
                </ul>
              </li>
              <div className="align-items-center"></div>
            </ul> */}

            {/* Right Side Buttons */}
            <div className="d-flex align-items-center gap-3 ml-auto">
              {/* <button className="postcodebutton">
                <img src={Location} /> Post Code
              </button> */}

              <ul className="navbar-nav mx-auto gap-3 d-flex align-items-center">
                <li className="nav-item dropdown">
                  {/* <a
                    className="nav-link dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    style={{ color: "#FFFFFF" }}
                  >
                    Doctors
                  </a> */}
                  <ul className="dropdown-menu">
                    <li className="dropdown-menu-custom1">
                      <Link
                        to={`/doctornewpage`}
                        style={{
                          color: "#464646",
                          textDecoration: "none",
                          // backgroundColor: "#E4F7F2",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = "#2F79CF")}
                        onMouseLeave={(e) => (e.target.style.color = "#464646")}
                      >
                        <h6 className=" mb-2 mt-2"> View All</h6>
                      </Link>
                      {allCategory.map((category) => (
                        <div key={category.id}>
                          {/* <Link
                            to={`/doctornewpage?name=${category.name}`}
                            style={{ color: "#464646", textDecoration: "none" }}
                            onMouseEnter={(e) =>
                              (e.target.style.color = "#2F79CF")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.color = "#464646")
                            }
                          >
                            <h6 className=" mb-2 mt-2">{category.name}</h6>
                          </Link> */}
                          <h6
                            className="mb-2 mt-2"
                            style={{ color: "#464646", cursor: "pointer" }}
                            onClick={() =>
                              (window.location.href = `/doctornewpage?name=${category.name}`)
                            }
                            onMouseEnter={(e) =>
                              (e.target.style.color = "#2F79CF")
                            }
                            onMouseLeave={(e) =>
                              (e.target.style.color = "#464646")
                            }
                          >
                            {category.name}
                          </h6>
                        </div>
                      ))}
                    </li>
                  </ul>
                </li>

                <div className="align-items-center"></div>
              </ul>

              <div className="d-flex align-items-center gap-3 position-relative ">
                {profileData ? (
                  <>
                    <div
                      className="d-flex align-items-center gap-2 profile-dropdown-toggle"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowDropdown(!showDropdown)}
                    >
                      <img
                        src={
                          profileData.profile_image
                            ? `${Config.BASE_URL}/${profileData.profile_image}`
                            : "/default-user-icon.png"
                        }
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = userimage;
                        }}
                        alt="Profile"
                        style={{
                          width: "35px",
                          height: "35px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <span className="text-white">
                        {profileData.firstname.charAt(0).toUpperCase() +
                          profileData.firstname.slice(1)}{" "}
                        (
                        {profileData.role.charAt(0).toUpperCase() +
                          profileData.role.slice(1)}
                        )
                      </span>
                    </div>

                    {/* Dropdown for both roles */}
                    {showDropdown && (
                      <div
                        className="dropdown-menu show"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          minWidth: "150px",
                          padding: "0.5rem 0",
                          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                        }}
                      >
                        {/* If patient, show dashboard */}
                        {profileData.role === "patient" && (
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              navigate("/dashboardpatient");
                              setShowDropdown(false);
                            }}
                          >
                            Dashboard
                          </button>
                        )}
                        {profileData.role === "doctor" && (
                          <button
                            className="dropdown-item"
                            onClick={() => {
                              navigate("/dashboard");
                              setShowDropdown(false);
                            }}
                          >
                            Dashboard
                          </button>
                        )}

                        {/* Logout for both roles */}
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => {
                            localStorage.removeItem("user");
                            navigate("/");
                            setShowDropdown(false);
                            window.location.reload();
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="d-flex align-items-center gap-3 position-relative">
                      <ul className="navbar-nav mx-auto gap-3">
                        <li className="nav-item dropdown">
                          <a
                            className="nav-link as-patient2"
                            style={{ padding: "8px 15px" }}
                            role="button"
                            // data-bs-toggle="dropdown"
                            onClick={() => {
                              setLgShow(true);
                              // setLoginDropdown(false);
                            }}
                          >
                            <div
                              className="d-flex align-items-center gap-1"
                              style={{ color: "#FFFFFF" }}
                            >
                              <img
                                src={loginicon}
                                alt=""
                                style={{
                                  width: "11px",
                                  height: "15px",
                                }}
                              />
                              Login
                            </div>
                          </a>
                        </li>

                        <li className="nav-item dropdown">
                          <a
                            className="nav-link dropdown-toggle joinbutton"
                            role="button"
                            data-bs-toggle="dropdown"
                            style={{
                              backgroundColor: "#FFFFFF",
                              color: "#464646",
                            }}
                          >
                            Register
                          </a>
                          <ul className="dropdown-menu">
                            <li className="dropdown-menu-custom">
                              <button
                                className="as-doctor"
                                onClick={() => {
                                  setDrShow(true);
                                  setRegisterDropdown(false);
                                }}
                              >
                                As Doctor
                              </button>
                              <button
                                className="as-patient mt-2"
                                onClick={() => {
                                  setPaShow(true);
                                  setRegisterDropdown(false);
                                }}
                              >
                                As Patient
                              </button>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <style>{`
         .joinbutton{
            display: inline-block; 
            border-radius: 30px;
            border: 2px solid #4C6BE9;
            background-color: #4C6BE9;
            
            padding: 6px 25px !important;  /* Force override Bootstrap */
          }

       .dropdown-menu {
        --bs-dropdown-min-width: 0rem; 
        --bs-dropdown-padding-y: 0rem;
          }

      .logotoggele{
      padding:10px;
      }
      .navbar-toggler{
      border:none;
      }
      .Dropdowncategory{
        width:300px;
        height:300px;
        padding:10px;
        overflow:auto;
        background-color: #fff;
        border-radius: 30px;
        border:2px solid #fff;
      }

      .category-title{
          font-size
        }
      .as-doctor{
              background-color: #4C6BE9;
              color: #fff !important;
              border: none;
              padding:8px 15px;
              border-radius: 30px;
              font-size:14px;
      }

      .as-patient{
        background-color: #70EFCD;
        color: #000 !important;
        border: none;
        padding:8px 15px;
              border-radius: 30px;
      font-size:14px;
      width: 100%;
        border: none;
        
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
      }
        .as-patient2{
        
        color: #000 !important;
        border: none;
        padding:8px 15px;
              border-radius: 30px;
      font-size:14px;
      width: 100%;
        border: none;
        
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
      }
      .linkHover {
        cursor: pointer;
        color: #007bff; /* or your desired color */
        transition: color 0.2s ease;
      }

      .linkHover:hover {
        text-decoration: underline;
        color: #0056b3; /* darker on hover */
      }

            /* Login Button */
      .login-btn {
        cursor: pointer;
        color: black;
        font-size: 16px;
        border: none;
        background: none;
        display: flex;
        align-items: center;
      }
        .login-btn1 {
        cursor: pointer;
        color: black;
        font-size: 16px;
        border: none;
        background: none;
        // display: flex;
        align-items: center;
        margin-top:3px;
      }



      /* Dropdown Menu */
      .dropdown-menu-custom {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 170px;
        margin-top: 5px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        display: flex;
        flex-direction: column;
        padding: 20px;
        z-index: 1000;
      }

      .dropdown-menu-custom1 {
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 220px;
        margin-top: 5px;
        background: #fff;
        border-radius: 20px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        padding: 10px 15px;
        z-index: 1000;
        height: 300px;
        overflow-y: auto;
        overflow-x: hidden;
            text-align: left;


      }

      /* Scrollbar Styling */
      .dropdown-menu-custom1::-webkit-scrollbar {
        width: 5px; /* slim scrollbar */
      }

      .dropdown-menu-custom1::-webkit-scrollbar-track {
        background: transparent; /* background transparent */
      }

      .dropdown-menu-custom1::-webkit-scrollbar-thumb {
        background-color: #DEDEDE; /* grey scroll */
        border-radius: 15px;
      }

      .dropdown-menu-custom1::-webkit-scrollbar-thumb:hover {
        background-color: #DEDEDE; /* darker on hover */
      }


      /* Dropdown Items */
      .dropdown-item-custom {
        width: 100%;
        border: none;
        padding: 8px 12px;
        margin: 4px 0;
        border-radius: 10px;
        background: #f5f5f5;
        cursor: pointer;
        text-align: center;
        transition: all 0.2s;
      }

      // .dropdown-item-custom:hover {
      //   background: #4C6BE9;
      //   color: #fff;
      // }
      .postcodebutton{
          margin-top: 5px;

        background-color: #cccccc2e;
        border: none;
        border-radius: 30px;
        width: 135.3018798828125px;
        padding: 5px 10px;}
        .logocss {
          height: 40px;
          width: auto;
        }

        @media (max-width: 991.98px) {
          .navbar-collapse {
            text-align: center;
          }

          .navbar-nav {
            flex-direction: row;
            margin-bottom: 10px;
          }

          .d-flex.gap-3 {
            flex-direction: column;
            // margin-top: 10px;
          }
        }

      .register-modal {
        border-radius: 30px;
        border: none;
        overflow: hidden;
      }

      .register-image {
        object-fit: cover;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        height: 100%;
        width: 100%;
      }

      .registerbutton {
        border-radius: 30px;
        background-color: #4C6BE9;
        padding: 6px 20px;
        border: 2px solid #4C6BE9;
        color: white;
        font-weight: 500;
        font-size: 14px;
        transition: 0.3s ease;
        align-self: flex-end;
        margin-top: 10px;
      }

      .modal-description {
        font-size: 14px;
        color: #6c757d;
        margin-bottom: 20px;
      }

      .modal-title {
        font-weight: 600;
      }

      .close-modal-button {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 1.5rem;
        color: #000;
        z-index: 1000;
        background: none;
        border: none;
      }

      .login-modal-content {
        border-radius: 20px;
        border: none;
      }

      .login-image {
        width: 100%;
        height: 280px;
        object-fit: contain; /* Ensures full image is visible */
        margin: 20px; /* Space on all sides */
        display: block;
        margin-left: auto;
        margin-right: auto;
      }


      .login-title {
        font-weight: 600;
        font-size: 24px;
        color: #333;
      }

      .login-description {
        font-size: 14px;
        color: #6c757d;
        margin-bottom: 20px;
      }

      .input-group-text {
        background-color: #f0f0f0;
        border-right: 0;
        font-weight: 500;
      }

      .input-group .form-control {
        border-left: 0;
      }

      .continue-button {
        background-color: #4C6BE9;
        color: white;
        border: none;
        border-radius: 30px;
        padding: 10px 30px;
        font-weight: 500;
        font-size: 16px;
        transition: 0.3s;
      }

  

      .continue-button:hover {
        background-color: #3a56c6;
      }

      .close-modal-button {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 1.5rem;
        background: none;
        border: none;
        color: #000;
        z-index: 999;
      }

      .otp-modal {
        border-radius: 20px;
        background-color: #fff;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        max-width: 450px;
        width: 100%;
        padding: 2rem;
      }

      .otp-input {
        width: 45px;
        height: 50px;
        border: 1px solid #ccc;
        border-radius: 10px;
        font-size: 24px;
        font-weight: 500;
        outline: none;
        transition: border 0.2s;
      }

      .otp-input:focus {
        border-color: #007bff;
        box-shadow: 0 0 4px rgba(0, 123, 255, 0.5);
      }


        .btnVerify{
        background-color: #4C6BE9;
        color: white;
        border: none;
        border-radius: 30px;
        padding: 10px 50px;
        font-weight: 500;
        font-size: 16px;
        transition: 0.3s;
        }


            .custom-modal .modal-content {
        border-radius: 30px !important;
      }
  

      `}</style>

      <Modal
        size="lg"
        show={drShow}
        onHide={() => setDrShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        className="custom-modal"
        centered
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
          <div className="row ">
            {/* Left Image */}
            <div className="col-lg-4 d-none  d-lg-block">
              <img
                src={register1}
                className="img-fluid h-100 w-100 register-image"
                alt="Register"
              />
            </div>

            {/* Right Form */}
            {/* <div
              className="col-md-8 p-4 d-flex  flex-column justify-content-center"
              style={{
                backgroundImage: `url(${registerbg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100%",
              }}
            > */}
            <div
              className="col-lg-8 p-4 d-flex flex-column justify-content-center"
              style={{
                backgroundImage: `url(${registerbg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100%",
                borderTopRightRadius: "30px", // adjust px as needed
                borderBottomRightRadius: "30px", // adjust px as needed
                overflow: "hidden", // ensures bg respects radius
              }}
            >
              <h3 className="modal-title mb-3">Join as a doctor</h3>
              <p className="modal-description">
                Register to join as a practitioner on our UK online platform.
                After submitting the form, you'll receive an email with a link
                to complete your profile and finish registration.
              </p>
              <form onSubmit={handleRegisterSubmit}>
                <div className="form-group">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstname"
                        value={registerData.firstname}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="form-control custom-placeholder"
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastname"
                        value={registerData.lastname}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="form-control custom-placeholder"
                        required
                      />
                    </div>

                    <div className="col-md-12 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="form-control custom-placeholder"
                        required
                      />
                    </div>
                    {/* <div className="col-md-6 mb-3">
                      <label className="form-label">Profile</label>
                      <input
                        type="file"
                        name="profile_image"
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div> */}

                    <div className="col-md-12">
                      <label className="form-label">Phone Number</label>

                      <div className="input-group mb-4">
                        <div className="input-group-prepend">
                          <span className="input-group-text">+44</span>
                        </div>
                        <input
                          type="tel"
                          name="mobile_number"
                          value={registerData.mobile_number}
                          onChange={handleChange}
                          placeholder="Your Phone Number"
                          className="form-control custom-placeholder"
                          required
                          maxLength={10}
                          pattern="\d{10}"
                          title="Enter a 10-digit phone number"
                        />
                      </div>
                    </div>

                    {/* <div className="col-md-12 mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={registerData.address}
                        onChange={handleChange}
                        placeholder="Your Address"
                        className="form-control"
                        required
                      />
                    </div> */}
                  </div>
                </div>

                <TermsAgreement
                  agreeTerms={agreeTerms}
                  setAgreeTerms={setAgreeTerms}
                  type="doctor"
                />

                <div className="d-flex justify-content-end">
                  <button
                    type="submit"
                    className="registerbutton"
                    data-dismiss="modal"
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
            <div className="col-lg-5 d-none d-lg-block">
              <img
                src={register}
                className="img-fluid register-image"
                alt="Register"
              />
            </div>

            {/* Right Form Section */}
            <div
              className="col-lg-7 p-5 d-flex flex-column justify-content-center "
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
              <h3 className="modal-title mb-3">Join as a Patient</h3>
              <p className="modal-description">
                Create your account to book online consultations with trusted
                doctors.
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
                  type="patient"
                />

                {/* <p className="or-register mt-3">Or register using</p>
                <div className="social-icons mb-3">
                  <img
                    src={facebook}
                    alt="Facebook"
                    className="social-icon mx-2"
                  />
                  <img src={google} alt="Google" className="social-icon mx-2" />
                  <img src={iphone} alt="iPhone" className="social-icon mx-2" />
                </div> */}

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

      <Modal
        size="lg"
        show={lgShow}
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
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
        <Modal.Body>
          <div className="row no-gutters">
            <div className="col-md-6 d-none d-lg-block">
              <img
                src={login}
                className="img-fluid login-image"
                alt="Login Visual"
              />
            </div>

            {/* Right Form Section */}
            <div
              className="col-lg-6 p-5 d-flex flex-column justify-content-center"
              style={{
                backgroundImage: `url(${bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "100%",
              }}
            >
              <h3 className="login-title mb-3">Enter Your Email</h3>
              <p className="login-description">
                Please provide your email to login
              </p>

              <div className="input-group mb-4">
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
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  "Please wait..."
                ) : (
                  <>
                    Continue <span className="ml-2">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {/* </div> */}
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
            className="px-4 py-5 position-relative"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100%",
            }}
          >
            {/* Modal Body */}
            <div className="text-center">
              <h4 className="mb-2 ">Verify OTP code</h4>
              <p>
                A message has been sent to {mobile_number}
                {/* <span style={{ color: "#007bff", cursor: "pointer" }}>
                  (Edit)
                </span> */}
              </p>

              {/* OTP Boxes */}
              <form onSubmit={handleVerify}>
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
                  disabled={loading}
                >
                  {loading ? "Please wait..." : " OTP Verify"}
                </button>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Header;

const TermsAgreement = ({ agreeTerms, setAgreeTerms, type }) => {
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
      <div className="d-flex col-12 align-items-center gap-2">
        {/* Checkbox instead of "!" button */}
        <input
          type="checkbox"
          className="form-check-input"
          checked={agreeTerms}
          onChange={() => handleOpen()}
          id="termsCheckbox"
        />
        <label
          className="form-check-label"
          htmlFor="termsCheckbox"
          style={{ cursor: "pointer" }}
        >
          {agreeTerms
            ? "You have agreed to Terms & Privacy Policy"
            : "I agree to Terms & Privacy Policy"}
        </label>
      </div>

      {/* Modal with Terms page */}
      <Modal
        show={showModal}
        onHide={handleClose}
        size="xl"
        className="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Terms & Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          {type === "patient" && <PatientRegTAndC />}
          {type === "doctor" && <DoctorRegTAndC />}

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
