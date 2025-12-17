import React, { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { useNavigate } from "react-router-dom";
import Config from "../../config"; // Ensure this exists

import bgImage from "../../assets/images/image 79.png";
import login from "../../assets/images/Frame.png";
import "react-phone-input-2/lib/bootstrap.css";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [mobile_number, setMobile_number] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const mobile = { mobile_number };
    try {
      const res = await axios.post(`${Config.BASE_URL}/api/send-otp`, mobile);
      handleShow();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeotp = (e, i) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    let newOtp = [...otp];
    newOtp[i] = value ? value[0] : "";
    setOtp(newOtp);
    if (value && i < 5) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      let newOtp = [...otp];
      if (otp[i]) {
        newOtp[i] = "";
        setOtp(newOtp);
      } else if (i > 0) {
        inputRefs.current[i - 1].focus();
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
    const lastIndex = Math.min(paste.length - 1, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      toast.error("Please enter a valid 6-digit OTP");
      setLoading(false);
      return;
    }
    try {
      const res = await axios.post(`${Config.BASE_URL}/api/verify-otp`, {
        mobile_number,
        otp: enteredOtp,
      });
      const userdata = res.data.user;

      const role = userdata?.role;
      navigate(role === "admin" ? "/admin-dashboard" : "/");

      handleClose();
      toast.success("OTP Verified Successfully!");
      localStorage.setItem("authToken", res.data.token);
      const expiryTime = Date.now() + 45 * 60 * 1000;
      const userDataWithExpiry = { ...userdata, expiryTime };
      localStorage.setItem("user", JSON.stringify(userDataWithExpiry));
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <div className="login-wrapper">
          <div className="image-section">
            <img src={login} alt="Login Visual" />
          </div>
          <div
            className="form-section"
            style={{ backgroundImage: `url(${bgImage})` }}
          >
            <h3 className="login-title">Enter Your Email</h3>
            <p className="login-description">
              Please provide your email to login
            </p>
            <input
              type="email"
              className="form-control"
              placeholder="Enter Your Email"
              value={mobile_number}
              onChange={(e) => setMobile_number(e.target.value)}
            />
            <button
              className="continue-button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                "Please wait..."
              ) : (
                <>
                  Continue <span>→</span>
                </>
              )}
            </button>
          </div>
        </div>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header
            closeButton
            style={{ border: "none", background: "transparent" }}
          />
          <Modal.Body>
            <div
              className="otp-modal-body"
              style={{ backgroundImage: `url(${bgImage})` }}
            >
              <h4>Verify OTP code</h4>
              <p>
                A message has been sent to <strong>{mobile_number}</strong>{" "}
                {/* <span className="linkHover">(Edit)</span> */}
              </p>
              <form onSubmit={handleVerify}>
                <div className="otp-inputs">
                  {[...Array(6)].map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-input"
                      value={otp[i]}
                      onChange={(e) => handleChangeotp(e, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      onPaste={handlePaste}
                      ref={(el) => (inputRefs.current[i] = el)}
                    />
                  ))}
                </div>
                <p className="text-muted">Resend verification code in 0:27</p>
                <button type="submit" className="btnVerify" disabled={loading}>
                  {loading ? "Please wait..." : "OTP Verify"}
                </button>
              </form>
            </div>
          </Modal.Body>
        </Modal>
      </div>

      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: #f8f9fa;
        }
        .login-wrapper {
          display: flex;
          flex-wrap: wrap;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 0 15px rgba(0,0,0,0.1);
          border-radius: 15px;
          overflow: hidden;
          background: #fff;
        }
        .image-section, .form-section {
          flex: 1 1 300px;
          min-width: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .image-section img {
          width: 100%;
          max-width: 300px;
          object-fit: contain;
        }
        .form-section {
          background-size: cover;
          background-position: center;
          text-align: center;
        }
        .login-title {
          font-weight: bold;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .login-description {
          font-size: 14px;
          margin-bottom: 20px;
          color: #6c757d;
        }
        .form-control {
          width: 100%;
          padding: 10px;
          border-radius: 30px;
          border: 1px solid #ccc;
          margin-bottom: 20px;
        }
        .continue-button {
          background-color: #4C6BE9;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 10px 30px;
          font-weight: 500;
          font-size: 16px;
          transition: background 0.3s;
        }
        .continue-button:hover {
          background-color: #3a56c6;
        }
        .otp-modal-body {
          padding: 20px;
          background-size: cover;
          background-position: center;
          text-align: center;
        }
        .otp-inputs {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin: 20px 0;
        }
        .otp-input {
          width: 40px;
          height: 40px;
          text-align: center;
          font-size: 18px;
          border: 1px solid #ccc;
          border-radius: 8px;
          outline: none;
        }
        .otp-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 4px rgba(0,123,255,0.5);
        }
        .btnVerify {
          background-color: #4C6BE9;
          color: white;
          border: none;
          border-radius: 30px;
          padding: 10px 50px;
          font-weight: 500;
          font-size: 16px;
          transition: background 0.3s;
        }
        .btnVerify:hover {
          background-color: #3a56c6;
        }
        .text-muted {
          color: #6c757d;
          font-size: 14px;
        }
        .linkHover {
          cursor: pointer;
          color: #007bff;
        }
        .linkHover:hover {
          text-decoration: underline;
          color: #0056b3;
        }

        @media (max-width: 768px) {
          .login-wrapper {
            flex-direction: column;
          }
          .image-section, .form-section {
            min-width: 100%;
          }
          .image-section img {
            max-width: 200px;
          }
        }
      `}</style>
    </>
  );
};

export default AdminLogin;
