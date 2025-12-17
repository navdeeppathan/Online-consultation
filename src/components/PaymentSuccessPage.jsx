import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Config from "../config";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import bgImage from "../assets/images/Background.png";
import toast from "react-hot-toast";
import Footer from "./Footer";
import Header from "./Header";

const PaymentSuccessPage = () => {
  const [hoverButton1, setHoverButton1] = useState(false);
  const [hoverButton2, setHoverButton2] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    // ✅ First check: ensure patient completed step 7
    // if (!user || user.step !== "7") {
    //   toast.error(
    //     "Please complete your patient information before continuing."
    //   );
    //   navigate("/patient-information");
    //   return;
    // }
    const handleBackButton = (event) => {
      // Navigate to "/" when browser back is clicked
      navigate("/");
    };

    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  // Extract session_id from the query string
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");
  const type = params.get("type");
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log(sessionId, "sessionId");

  const [appointmentPayload, setAppointmentPayload] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [patientID, setPatientID] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  console.log(
    "appointmentPayload",
    appointmentPayload,
    "doctorInfo",
    doctorInfo,
    selectedSlots
  );
  useEffect(() => {
    if (!sessionId) {
      console.error("No session ID found");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const payload = JSON.parse(localStorage.getItem("appointmentPayload"));

    if (
      !user ||
      !user.id ||
      !payload ||
      !payload.doctorInfo ||
      !payload.slots?.length
    ) {
      toast.error("Required booking information is missing.");
      navigate("/");
      return;
    }

    setPatientID(user.id);
    setAppointmentPayload(payload);
    setDoctorInfo(payload.doctorInfo);
    setSelectedSlots(payload.slots);
  }, [sessionId]);

  const bookingAttempted = useRef(false);
  useEffect(() => {
    if (
      sessionId &&
      doctorInfo &&
      patientID &&
      appointmentPayload &&
      selectedSlots.length > 0 &&
      !bookingAttempted.current
    ) {
      // console.log("Data ready, booking...");
      bookingAttempted.current = true;
      ConformBookingSlot();
    }
  }, [sessionId, doctorInfo, patientID, appointmentPayload, selectedSlots]);

  const ConformBookingSlot = async () => {
    if (
      !doctorInfo ||
      !patientID ||
      !appointmentPayload ||
      selectedSlots.length === 0
    ) {
      toast.error("Missing required information to book appointment.");
      return;
    }

    const payload = {
      user_id: patientID,
      doc_id: Number(doctorInfo.id),
      type: appointmentPayload.type,
      isConsultComplete: 0,
      destination: "New York",
      isBook: 0,
      slots: selectedSlots,
    };

    try {
      console.log("start booking");

      const res = await axios.post(
        `${Config.BASE_URL}/api/appointments/store`,
        payload
      );
      const appointmentId = res.data?.appointment?.slots?.[0].appointment_id;

      // Create multiple orders, one per slot
      await ConformOrder(appointmentId, selectedSlots);

      Swal.fire({
        icon: "success",
        title: "Booked!",
        text: "Appointment(s) booked successfully!",
        showCancelButton: true,
        confirmButtonText: "Go to Dashboard",
        cancelButtonText: "Home",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("appointmentPayload");

          if (userData.step === "7") {
            navigate("/dashboardpatient");
          } else {
            navigate("/patient-information");
          }

          // navigate("/dashboardpatient");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          localStorage.removeItem("appointmentPayload");

          if (userData.step === "7") {
            navigate("/");
          } else {
            navigate("/patient-information");
          }
        }
      });

      localStorage.removeItem("appointmentPayload");
      bookingAttempted.current = true;
      // mark as done
      console.log("end booking");
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(
        err.response?.data?.error || "Something went wrong while booking."
      );
    }
  };

  const ConformOrder = async (appointmentId, slots) => {
    try {
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];

        const payload = {
          order_id: `ORD${Date.now()}${i}`,
          transaction_id: `TXN${Date.now()}${i}`,
          user_id: patientID,
          appointment_id: appointmentId,
          doctor_id: Number(doctorInfo.id),
          payment_type: type ? "insurance" : "card",
          status: 1,
          amount: slot.fees,
        };

        const res = await axios.post(`${Config.BASE_URL}/api/orders`, payload);
        console.log(`Order ${i + 1} created:`, res.data);
      }
    } catch (err) {
      console.error("Order creation error:", err);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      width: "100%",
      // backgroundColor: "#f0f9f4",
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
    checkIcon: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      backgroundColor: "#4CAF50",
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
    continueButton1: {
      backgroundColor: hoverButton1 ? "#3b55c4" : "#4C6BE9",
      color: "white",
      border: "none",
      padding: "12px 12px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",

      cursor: "pointer",
      transition: "background-color 0.3s ease",
      width: "100%",
      maxWidth: "200px",
      margin: "10px auto",
    },
    continueButton2: {
      backgroundColor: hoverButton2 ? "#57c5a5" : "#70EFCD",
      color: "#464646",
      border: "none",
      padding: "12px 12px",
      borderRadius: "8px",
      fontSize: "13px",
      fontWeight: "600",

      cursor: "pointer",

      transition: "background-color 0.3s ease",
      width: "100%",
      maxWidth: "200px",
      margin: "10px auto",
    },
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
            <div style={styles.checkIcon}>✔</div>
          </div>
          <h2 style={styles.heading}>Payment Successful 🎉</h2>
          <p style={styles.description}>
            Your payment has been successfully processed.
            <br /> Now you can go to the dashboard or home
          </p>
          <div className="d-flex justify-content-center gap-3">
            <button
              style={styles.continueButton1}
              onClick={() => navigate("/dashboardpatient")}
              onMouseEnter={() => setHoverButton1(true)}
              onMouseLeave={() => setHoverButton1(false)}
            >
              GO TO DASHBOARD
            </button>
            <button
              className=""
              style={styles.continueButton2}
              onMouseEnter={() => setHoverButton2(true)}
              onMouseLeave={() => setHoverButton2(false)}
              onClick={() => navigate("/")}
            >
              HOME
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccessPage;
