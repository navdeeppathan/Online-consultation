import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import bgImage from "../assets/images/Background.png";

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    localStorage.removeItem("appointmentPayload");

    navigate("/");
  };

  return (
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
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.iconContainer}>
            <div style={styles.cancelIcon}>✖</div>
          </div>
          <h2 style={styles.heading}>Payment Cancelled ❌</h2>
          <p style={styles.description}>
            Your payment was not completed.
            <br />
            Please return to the homepage and try again.
          </p>

          <button
            className="mt-4"
            style={styles.homeButton}
            onClick={() => handleHomeClick()}
          >
            Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    width: "100%",
    // backgroundColor: "#fff5f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  content: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    maxWidth: "400px",
    width: "100%",
    padding: "30px 20px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  iconContainer: {
    marginBottom: "20px",
  },
  cancelIcon: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#f44336",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "40px",
    color: "white",
    margin: "0 auto",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  heading: {
    fontSize: "22px",
    marginBottom: "10px",
    color: "#333",
  },
  description: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "20px",
    padding: "0 10px",
  },
  tryAgainButton: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
    maxWidth: "200px",
    margin: "0 auto 10px",
  },
  homeButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "12px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    width: "100%",
    maxWidth: "200px",
    margin: "0 auto",
  },
};

export default PaymentCancelPage;
