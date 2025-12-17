import React, { useEffect, useRef, useState } from "react";
import bgImage from "../assets/images/Background.png";
import Header from "../components/Header";
import sectionbg from "../assets/images/innerpagebanner.png";
import userImage from "../assets/images/21104.png";
import Swal from "sweetalert2";
import male from "../assets/images/male.png";
import female from "../assets/images/Female2.png";
import "bootstrap-icons/font/bootstrap-icons.css";
import register from "../assets/images/registerimage.png";
import registerbg from "../assets/images/Registerasdoctorbg.png";
import personImg from "../assets/images/person.png";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";
import Config from "../config";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment/moment";
import { Button, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";
import CircularProgress from "@mui/material/CircularProgress";
import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import card from "../assets/images/2224471_atm card_credit card_debit card_master card_icon 1.png";
import YoDocTermsPage from "../components/YoDocTermsPage";

const steps = ["Fill Claim", "Attach Docs", "Review & Submit"];

const InsuranceProvider = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault(); // prevent default back navigation
      Swal.fire({
        title: "Are you sure?",
        text: "You will be redirected to home page.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, go to home",
        cancelButtonText: "Stay on this page",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/"); // go to home if confirmed
        } else {
          // Push the current state again to prevent leaving
          window.history.pushState(null, "", window.location.pathname);
        }
      });
    };

    // Push initial state to detect back
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  const userData = JSON.parse(localStorage.getItem("user"));

  const [appointmentPayload, setAppointmentPayload] = useState(null);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [patientID, setPatientID] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([0]);
  // Mark step 0 as completed for testing
  const [insuranceData, setInsuranceData] = useState(null);
  const inputRefs = useRef([]);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [show, setShow] = useState(false); // <-- Move these up
  const [lgShow, setLgShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [mobile_number, setMobile_number] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

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

    if (!agreeTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

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

  useEffect(() => {
    const payload = JSON.parse(localStorage.getItem("appointmentPayload"));
    const drInfo = payload?.doctorInfo || null;
    console.log("doctorInfo1", payload);
    console.log("doctorInfo2", drInfo);

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
          ` Date: ${slot.date}, Time: ${slot.time}, Slot: ${slot.time_slot}, Fee: ${slot.fees}`
        );
      });

      // If you need them in a state:
      setSelectedSlots(payload.slots);
    }
    const drInfo = payload?.doctorInfo || null;

    setAppointmentPayload(payload || null);
    setDoctorInfo(drInfo || null);
  }, []);

  useEffect(() => {
    if (!userData?.id) return;

    axios
      .get(`${Config.BASE_URL}/api/insurance?user_id=${userData.id}`)
      .then((response) => {
        if (response.data?.success && response.data.data?.length > 0) {
          setInsuranceData(response.data.data[0]); // get first item
          console.log("Insurance data:", response.data.data[0]);
        }
      })
      .catch((error) => {
        console.error("Error fetching insurance data:", error);
      });
  }, [userData?.id]);

  const [showModal, setShowModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    review: "",
    rating: 0,
    recommend: null,
    tags: [], // array for selected tags
  });

  const handleFeedbackChange = (e) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarClick = (star) => {
    setFeedbackData({
      ...feedbackData,
      rating: star,
    });
  };

  const handleFeedbackSubmit = async () => {
    const reviewPayload = {
      user_id: userData?.id,
      doctor_id: Number(doctorInfo.id),
      rating: feedbackData.rating,
      review: feedbackData.review,
      recommend: feedbackData.recommend,
      message: feedbackData.tags?.join(", "), // Convert tags array to string
    };

    try {
      await axios.post(`${Config.BASE_URL}/api/feedbacks`, reviewPayload);
      toast.success("Thank you for your feedback!");
      localStorage.removeItem("appointmentPayload");
      navigate("/");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback");
    }
  };

  const [insuranceData2, setInsuranceData2] = useState(null);

  // Receive insurance data from child
  const handleInsuranceChange = (data) => {
    setInsuranceData2(data);
  };

  console.log("insurance data:-", insuranceData2);

  // const ConformBookingSlot = async () => {
  //   if (
  //     !doctorInfo ||
  //     !patientID ||
  //     !appointmentPayload ||
  //     selectedSlots.length === 0
  //   ) {
  //     toast.error("Missing required information to book appointment.");
  //     return;
  //   }

  //   const payload = {
  //     user_id: patientID,
  //     doc_id: Number(doctorInfo.id),
  //     type: appointmentPayload.type,
  //     isConsultComplete: 0,
  //     destination: "New York",
  //     isBook: 0,
  //     slots: selectedSlots,
  //   };

  //   try {
  //     setLoading(true);
  //     const res = await axios.post(
  //       `${Config.BASE_URL}/api/appointments/store`,
  //       payload
  //     );
  //     const appointmentId = res.data?.appointment?.slots?.[0].appointment_id;

  //     // Create multiple orders, one per slot
  //     await ConformOrder(appointmentId, selectedSlots);

  //     Swal.fire({
  //       icon: "success",
  //       title: "Booked!",
  //       text: "Appointment(s) booked successfully!",
  //       showCancelButton: true,
  //       confirmButtonText: "Go to Dashboard",
  //       cancelButtonText: "Home",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         navigate("/dashboardpatient");
  //       } else if (result.dismiss === Swal.DismissReason.cancel) {
  //         navigate("/");
  //       }
  //     });

  //     localStorage.removeItem("appointmentPayload");
  //     navigate("/");
  //     // setShowModal(true);
  //   } catch (err) {
  //     console.error("Booking error:", err);
  //     toast.error(
  //       err.response?.data?.error || "Something went wrong while booking."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const stripe = useStripe();
  const elements = useElements();

  const stripePromise = loadStripe(
    "pk_test_51S7ptwHWgCuPKYcQXBb2QXKaGpqDs5LesQZTBlTepxGKXKxA8ln9H0bs37mo1durlZJyxL1jtvb5hOmPoKzJTtiy002WvEG6y9"
  );

  const [insuranceSaved, setInsuranceSaved] = useState(false);
  const [paymentOption, setPaymentOption] = useState("myself");

  const ConformBookingSlot = async () => {
    if (!patientID) {
      setLgShow(true);
      return;
    }
    if (paymentOption === "insurance") {
      if (!insuranceSaved) {
        toast.error("Please save your insurance details before proceeding.");
        return;
      } else {
        //Generate random session ID for insurance
        const sessionId = uuidv4();
        navigate(`/success?session_id=${sessionId}&type=insurance`);
        return;
      }
    }

    const totalAmount = selectedSlots.reduce((sum, slot) => sum + slot.fees, 0);

    try {
      setLoading2(true);

      //  Create checkout session on backend
      const res = await axios.post(
        `${Config.BASE_URL}/api/create-checkout-session`,
        { amount: totalAmount }
      );

      // Wait for stripe object
      const stripe = await stripePromise;

      // 3️⃣ Redirect to Stripe Checkout
      await stripe.redirectToCheckout({ sessionId: res.data.id });
    } catch (err) {
      console.error("Stripe Checkout Error:", err);
      toast.error(err.response?.data?.error || "Failed to initiate payment.");
    } finally {
      setLoading2(false);
    }
  };

  console.log("selectedSlots", selectedSlots);

  const ConformOrder = async (appointmentId, slots) => {
    try {
      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];

        const payload = {
          order_id: `ORD${Date.now()}${i}`, // unique order id
          transaction_id: `TXN${Date.now()}${i}`, // unique transaction id
          user_id: patientID,
          appointment_id: appointmentId,
          doctor_id: Number(doctorInfo.id),
          payment_type: "card",
          status: 1,
          amount: slot.fees, // take fees from slot
        };

        const res = await axios.post(`${Config.BASE_URL}/api/orders`, payload);
        console.log(`Order ${i + 1} created:`, res.data);
      }
    } catch (err) {
      console.error("Order creation error:", err);
    }
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

      localStorage.setItem("authToken", res.data.token);
      // localStorage.setItem("user", JSON.stringify(res.data.user));

      const expiryTime = Date.now() + 45 * 60 * 1000;
      const userDataWithExpiry = { ...userdata, expiryTime };
      localStorage.setItem("user", JSON.stringify(userDataWithExpiry));
      toast.success("OTP Verified Successfully!");

      //  Correct way to reload
      window.location.reload();
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
          backgroundPosition: "top",
          minHeight: "100%",
        }}
      >
        <Header />

        <div className="">
          <div
            className="section-container"
            style={{
              backgroundImage: `url(${sectionbg})`,
              backgroundSize: "cover",
              backgroundPosition: "top",
              minHeight: "100%",
            }}
          >
            <h1 className="headingtext">
              Find Local Doctors and
              <br />
              Practitioners You Can Trust
            </h1>
          </div>
        </div>

        <div className="container mt-4">
          <div className="row">
            <div className="col-lg-8">
              {/* <div className="stepFormContainer mt-4 mb-4 p-4">
                <div className="promo-box p-3 mb-4">
                  <div className="form-group mb-0">
                    <div className="row ">
                      <div className="form-group col-md-6">
                        <label className="font-weight-bold mb-2">
                          Have a coupon/promo code?
                        </label>
                      </div>
                      <div className="form-group col-md-6">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control custom-placeholder"
                            placeholder="Enter discount code here"
                          />
                          <div className="input-group-append">
                            <button
                              className="btn btn-primary apply-btn"
                              type="button"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <h5 className="p-3 mb-5">Insurance claim</h5>
                <div className="d-flex justify-content-center align-items-center  position-relative stepper-wrapper">
                  {steps.map((label, index) => {
                    const isActive = index === activeIndex;
                    const isCompleted = completedSteps.includes(index);

                    return (
                      <div key={index} className="stepper-item text-center">
                        <div
                          className={`step-circle ${
                            isCompleted ? "completed" : ""
                          } ${isActive ? "active" : ""}`}
                          onClick={() => {
                            if (isCompleted) setActiveIndex(index);
                          }}
                          style={{
                            cursor: isCompleted ? "pointer" : "default",
                          }}
                        >
                          {isCompleted && !isActive ? "✓" : index + 1}
                        </div>
                        <div className="step-label mt-2">{label}</div>
                        {index < steps.length - 1 && (
                          <div className="step-line"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="tab-content">
                  {activeIndex === 0 && (
                    <div className="tab-pane fade show active p-3">
                      <h3>Personal Information</h3>
                      <div className="row mt-4">
                        <div className="form-group col-md-6">
                          <label className="font-weight-bold">
                            Insurance Provider
                          </label>

                          {insuranceData?.insurance_provider ? (
                            <select className="form-control">
                              <option value="">Select Insurance</option>

                              {insuranceData.insurance_provider && (
                                <option
                                  value={insuranceData.insurance_provider}
                                >
                                  {insuranceData.insurance_provider}
                                </option>
                              )}
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="form-control custom-placeholder"
                              placeholder="Enter Insurance Provider"
                              name="insurance_provider"
                            />
                          )}
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="form-group col-md-6">
                          <label className="font-weight-bold">
                            Doctor Name
                          </label>
                          <input
                            type="text"
                            className="form-control custom-placeholder"
                            placeholder="Enter doctor name"
                            // value={
                            //   doctorInfo.firstname + "" + doctorInfo.lastname
                            // }
                          />
                        </div>

                        <div className="form-group col-md-6">
                          <label className="font-weight-bold">
                            Consultation type
                          </label>
                          <input
                            type="text"
                            className="form-control custom-placeholder"
                            placeholder="Enter Consultation type"
                            // value={appointmentPayload.type}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label className="font-weight-bold">fee</label>
                          <input
                            type="number"
                            className="form-control"
                            placeholder="Enter £ fee"
                            // value={parseFloat(
                            //   appointmentPayload.slots[0]?.fees
                            // ).toFixed(2)}
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label className="font-weight-bold">
                            Reason for claim
                          </label>
                          <input
                            type="text"
                            className="form-control custom-placeholder"
                            placeholder="Enter Reason for claim"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label className="font-weight-bold">
                            Diagnosis or symptoms
                          </label>
                          <input
                            type="text"
                            className="form-control custom-placeholder"
                            placeholder="Enter Diagnosis or symptoms"
                          />
                        </div>
                        <div className="form-group col-md-6">
                          <label className="font-weight-bold">
                            Upload additional docs (prescription, report)
                          </label>
                          <input type="file" className="form-control" />
                        </div>

                        <div className="d-flex justify-content-end mt-4 col-md-12">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              setCompletedSteps((prev) => [...prev, 1]);
                              setActiveIndex(1);
                            }}
                          >
                            Next »
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeIndex === 1 && (
                    <div className="tab-pane fade show active p-3">
                      <h4>{steps[1]}</h4>
                      //here content below comment th phle bhi
                      <div className="d-flex justify-content-between mt-4">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setActiveIndex(0)}
                        >
                          « Previous
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => {
                            setCompletedSteps((prev) => [...prev, 2]);
                            setActiveIndex(2);
                          }}
                        >
                          Next »
                        </button>
                      </div>
                    </div>
                  )}

                  {activeIndex === 2 && (
                    <div className="tab-pane fade show active p-3">
                      <h4>{steps[2]}</h4>
                    </div>
                  )}
                </div>
              </div> */}

              {/* <div className="row">
                <div className="form-group col-md-6">
                  <label className="font-weight-bold">
                    GMC Registration Number
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold">
                    Date of GMC Registration
                  </label>
                  <input type="date" className="form-control" />
                </div>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold">
                    License to Practice
                  </label>
                  <div className="form-check form-check-inline mx-2">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="license"
                    />
                    <label className="form-check-label">Yes</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="license"
                    />
                    <label className="form-check-label">No</label>
                  </div>
                </div>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold">Revalidation Date</label>
                  <input type="date" className="form-control" />
                </div>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold">Specialization</label>
                  <select className="form-control">
                    <option value="">Select specialization</option>
                  </select>
                </div>
                <div className="form-group col-md-6">
                  <label className="font-weight-bold">
                    Years of Experience
                  </label>
                  <input type="number" className="form-control" />
                </div>
              </div> */}
              <AppointmentSummary
                userData={userData}
                onInsuranceSelect={(selected) => {
                  console.log("Insurance selected:", selected);
                  setPaymentOption(selected ? "insurance" : "myself");
                }}
                onInsuranceSaved={(status) => {
                  setInsuranceSaved(status); // ✅ save status
                  // if (status) {
                  //   toast.success("Insurance saved successfully!");
                  // } else {
                  //   toast.error("Failed to save insurance details!");
                  // }
                }}
                setLgShow={setLgShow}
              />
              {/* <h1>Coming Soon...</h1> */}
            </div>

            {doctorInfo && appointmentPayload ? (
              <div className="col-lg-4 mt-4 mb-4">
                <div className="doctor-card text-center p-4 shadow-sm">
                  <img
                    src={
                      doctorInfo?.profile_image
                        ? `${Config.BASE_URL}/${doctorInfo?.profile_image}`
                        : doctorInfo.gender === "Female"
                        ? female
                        : male
                    }
                    alt={doctorInfo?.firstname}
                    className="doctor-img mb-3"
                  />
                  <h5>
                    {doctorInfo?.firstname} {doctorInfo?.lastname}
                  </h5>
                  <p className="text-muted mb-1">
                    {doctorInfo?.degree} (
                    {(Array.isArray(doctorInfo?.specialization)
                      ? doctorInfo.specialization
                      : JSON.parse(doctorInfo?.specialization || "[]")
                    ).join(", ")}
                    ){/* ({doctorInfo.specialization}) */}
                  </p>

                  <div
                    className=" p-1 d-flex align-items-center justify-content-center"
                    style={{ fontSize: "13px", fontWeight: "600" }}
                  >
                    <span
                      className={`status-dot me-2 ${
                        appointmentPayload.type === "in-person"
                          ? "in-person"
                          : "virtual"
                      }`}
                    ></span>
                    <span>
                      {appointmentPayload.type === "in-person"
                        ? "In-Person Consultation"
                        : "Virtual Consultation"}
                    </span>
                    <style>{`
                    .status-dot {
                      width: 12px;
                      height: 12px;
                      border-radius: 50%;
                      display: inline-block;
                    }

                    .status-dot.in-person {
                      background-color: #28a745; /* green */
                    }

                    .status-dot.virtual {
                      background-color: #007bff; /* blue */
                    }

                    `}</style>
                  </div>

                  <div className="mt-2">
                    {appointmentPayload.slots?.map((slot, index) => (
                      <div className="date-chip mb-2" key={index}>
                        {moment(slot.date).format("DD/MM/YYYY")}
                        <span className="time-slot">{slot.start_time}</span>
                      </div>
                    ))}
                  </div>

                  <div className="Doctorfees mt-4">
                    £{parseFloat(appointmentPayload.slots[0]?.fees).toFixed(2)}
                  </div>

                  {!(userData && userData.role === "doctor") && (
                    <button
                      className="confirm-btn mt-4"
                      onClick={ConformBookingSlot}
                      disabled={loading2}
                    >
                      {loading2 ? (
                        <>
                          <CircularProgress
                            size={20}
                            sx={{ color: "white", mr: 1 }}
                          />
                          Submitting...
                        </>
                      ) : (
                        // "Pay Online"
                        "Confirm Booking"
                      )}
                      {/* Pay Online */}
                    </button>
                  )}
                  {/* <button className="insurance-btn mt-3">
                    Pay via Insurance
                  </button> */}
                </div>
              </div>
            ) : (
              <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status" />
                <p className="mt-3">Loading doctor info...</p>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>

      {/* === Stepper Styles === */}
      <style>{`

.Doctorfees{

  color: #000;
  font-size: 40px;
  font-weight: 500;
}
      .doctor-card {
  border: 1px solid #fff;
  border-radius: 12px;
  background-color: #fff;
//   box-shadow: 0 0 0 1px #fff(0, 0, 0, 0.04);

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

.insurance-btn{
background-color: #000;
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

      .section-container {

  padding: 80px 20px;
  // border-radius: 20px;
  // margin-top: 20px;
  text-align: center;
// background: linear-gradient(to right,rgb(210, 234, 247) , #badcf0 )
}
.headingtext {
  font-size: 36px;
  font-weight: 500;
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

.promo-box {
  background-color: #fff;
  border: 2px solid #fff;
  border-radius: 12px;
  box-shadow: 0 0 0 1px #fff(0, 0, 0, 0.04);
}

.apply-btn {
  background-color: #4f46e5; /* Indigo-600 */
  color: white;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.apply-btn:hover {
  background-color: #4338ca; /* Indigo-700 */
}

      .stepFormContainer{
      border-radius: 16px;
          background-color: #fff;
      }
        .stepper-wrapper {
          margin-bottom: 20px;
        }

        .stepper-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }

        .step-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: #e5e7eb;
          color: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 16px;
          z-index: 1;
        }

        .step-circle.active {
          background-color: #5eead4;
          color: white;
        }

        .step-circle.completed {
          background-color: #5eead4;
          color: white;
        }

        .step-label {
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }

        .step-line {
          position: absolute;
          top: 18px;
          left: 10%;
          height: 2px;
          width: 90%;
          background-color: #e5e7eb;
          z-index: 0;
          transform: translateX(50%);
        }



        .custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.custom-modal {
  background: white;
  width: 500px;
  max-width: 90%;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 15px;
}

.rating-section label {
  font-weight: 500;
}

.stars {
  display: flex;
  margin: 10px 0;
}

.stars i {
  font-size: 24px;
  margin-right: 8px;
  color: #ffd700;
  cursor: pointer;
}

.recommend-section {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.recommend-btn {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
}

.recommend-btn.active {
  border-color: #4c6be9;
  background-color: #eaf0ff;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0 20px 0;
}

.tag {
  padding: 4px 10px;
  font-size: 13px;
  border-radius: 12px;
  background: #e9f0f5;
  color: #333;
  cursor: pointer;
}

.tag.selected {
  background-color: #4c6be9;
  color: #fff;
}

.review-box {
  width: 100%;
  min-height: 100px;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  background: #f5f5f5;
  color: #444;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
}

.post-btn {
  background: #4c6be9;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
}

      `}</style>

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
  // border-radius: 20px;
  // margin-top: 20px;
  text-align: center;
}

.headingtext {
  font-size: 36px;
  font-weight: 500;
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
  // border-radius: 20px;
  // margin-top: 20px;
  text-align: center;
}

.headingtext {
  font-size: 36px;
  font-weight: 500;
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

      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <h4 className="modal-title">Rate and review</h4>

            {/* Star Rating */}
            <div className="rating-section">
              <label>Rating ({feedbackData.rating}/5)</label>
              <div className="stars">
                {Array.from({ length: 5 }, (_, index) => (
                  <i
                    key={index}
                    className={`fa-star fa ${
                      index < feedbackData.rating ? "fas" : "far"
                    }`}
                    onClick={() => handleStarClick(index + 1)}
                  ></i>
                ))}
              </div>
            </div>

            {/* Recommend Section */}
            <div className="recommend-section">
              <button
                className={`recommend-btn ${
                  feedbackData.recommend === true ? "active" : ""
                }`}
                onClick={() =>
                  setFeedbackData({ ...feedbackData, recommend: true })
                }
              >
                <i className="fa fa-thumbs-up"></i> I recommend the doctor
              </button>
              <button
                className={`recommend-btn ${
                  feedbackData.recommend === false ? "active" : ""
                }`}
                onClick={() =>
                  setFeedbackData({ ...feedbackData, recommend: false })
                }
              >
                <i className="fa fa-thumbs-down"></i> I don't recommend the
                doctor
              </button>
            </div>

            {/* Tags */}
            <div className="tags-section">
              <label>Happy with:</label>
              <div className="tag-list">
                {[
                  "Doctor friendliness",
                  "Explanation of the health issue",
                  "Value for money",
                  "Satisfied",
                  "Wait time",
                  "Treatment satisfaction",
                ].map((tag) => (
                  <span
                    key={tag}
                    className={`tag ${
                      feedbackData.tags?.includes(tag) ? "selected" : ""
                    }`}
                    onClick={() => {
                      const currentTags = feedbackData.tags || [];
                      const newTags = currentTags.includes(tag)
                        ? currentTags.filter((t) => t !== tag)
                        : [...currentTags, tag];
                      setFeedbackData({ ...feedbackData, tags: newTags });
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Review Box */}
            <textarea
              className="form-control review-box custom-placeholder"
              name="review"
              placeholder="Write your review here..."
              value={feedbackData.review}
              onChange={handleFeedbackChange}
            ></textarea>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button
                className="btn cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn post-btn" onClick={handleFeedbackSubmit}>
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
    .custom-modal2 .modal-content {
      border-radius: 30px !important;
    }
  `}
      </style>

      <Modal
        size="lg"
        show={paShow}
        onHide={() => setPaShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
        centered
        className="custom-modal2"
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
                    doctorInfo?.profile_image
                      ? `${Config.BASE_URL}/${doctorInfo?.profile_image}`
                      : userImage
                  }
                  alt={doctorInfo?.firstname}
                  className="appointment-img"
                />
                <div className="appointment-info">
                  <h5 className="doctor-name">
                    {doctorInfo?.firstname} {doctorInfo?.lastname}
                  </h5>
                  <p className="doctor-specialization">
                    {doctorInfo?.degree} (
                    {JSON.parse(doctorInfo?.specialization || "[]").join(", ")})
                  </p>
                  <div className="date-chip mt-2">
                    {/* {appointmentPayload.slots[0]?.date},{" "}
                    {appointmentPayload.slots[0]?.time}{" "}
                    <span className="time-slot">
                      {appointmentPayload.slots[0]?.time_slot}
                    </span> */}
                    {appointmentPayload?.slots?.map((slot, index) => (
                      <div key={index}>
                        {moment(slot.date).format("DD/MM/YYYY")}
                        <span className="time-slot">{slot?.start_time}</span>
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
};

const AppointmentSummary = ({
  userData,
  onInsuranceSelect,
  onInsuranceSaved,
  setLgShow,
}) => {
  // const userData = JSON.parse(localStorage.getItem("user")) || {};
  const appointmentPayload = JSON.parse(
    localStorage.getItem("appointmentPayload") || "{}"
  );

  // Access fees from the first slot
  const fees =
    appointmentPayload.slots && appointmentPayload.slots.length > 0
      ? appointmentPayload.slots[0].fees
      : "0.00";
  const [appointmentFor, setAppointmentFor] = useState("myself");
  const [paymentOption, setPaymentOption] = useState("myself");

  const [patientName, setPatientName] = useState("");
  const [relation, setRelation] = useState("Mother");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [symptoms, setSymptoms] = useState("");
  useEffect(() => {
    if (appointmentFor === "myself" && userData) {
      setPatientName(
        `${userData.firstname || ""} ${userData.lastname || ""}`.trim()
      );
      setGender(userData.gender || "Male");
      setPhone(userData.mobile_number ? `${userData.mobile_number}` : "");
    } else if (appointmentFor !== "myself") {
      setPatientName("");
      setRelation("Mother");
      setGender("");
      setPhone("");
      setSymptoms("");
    }
  }, [appointmentFor, userData]);
  // 👈 added userData

  const [formData, setFormData] = useState({
    insurer: "",
    policyNumber: "",
    authCode: "",
  });

  const handlePaymentChange = (option) => {
    setPaymentOption(option);

    if (onInsuranceSelect) {
      onInsuranceSelect(option === "insurance"); // true if insurance, false if myself
    }
  };

  const [insuranceId, setInsuranceId] = useState(null);
  // to know if updating

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userData?.id) return;

    axios
      .get(`${Config.BASE_URL}/api/insurance?user_id=${userData.id}`)
      .then((response) => {
        if (response.data?.success && response.data.data?.length > 0) {
          const insurance = response.data.data[0];
          console.log("Insurance data:", insurance);

          setInsuranceId(insurance.id); // keep track of record id
          setFormData({
            insurer: insurance.insurance_provider || "",
            policyNumber: insurance.policy_number || "",
            authCode: insurance.verification_code || "",
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching insurance data:", error);
      });
  }, [userData?.id]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);

    // Send updated form data to parent
    // onInsuranceChange(updatedData);
  };

  const handleSubmit = async () => {
    if (paymentOption === "insurance") {
      if (!userData?.id) {
        // toast.error("Please login first.");
        if (setLgShow) setLgShow(true);
        return;
      }

      if (!formData.insurer || !formData.policyNumber || !formData.authCode)
        return toast.error("Please fill all fields.");

      try {
        setLoading(true);
        const payload = {
          insurance_provider: formData.insurer,
          policy_number: formData.policyNumber,
          verification_code: formData.authCode,
          user_id: userData?.id,
        };

        let response;
        if (insuranceId) {
          // update existing
          response = await axios.put(
            `${Config.BASE_URL}/api/insurance/${insuranceId}`,
            payload
          );
        } else {
          // create new
          response = await axios.post(
            `${Config.BASE_URL}/api/insurance`,
            payload
          );
        }

        if (response.data.success) {
          console.log("Insurance saved:", response.data.data);
          setInsuranceId(response.data.data.id);
          // ✅ notify parent with TRUE on success
          if (onInsuranceSaved) onInsuranceSaved(true);
          toast.success("Insurance details saved successfully!");
        } else {
          if (onInsuranceSaved) onInsuranceSaved(false);
          toast.error("Failed to save insurance details.");
        }
      } catch (error) {
        console.error("Error saving insurance:", error);
        if (onInsuranceSaved) onInsuranceSaved(false);
        toast.error("Failed to save insurance details.");
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Proceeding with self-pay booking");
    }
  };

  return (
    <div className="container my-4">
      <div
        className="card border-0 shadow-sm"
        style={{ borderRadius: "20px", backgroundColor: "#FFFFFF" }}
      >
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <div className=" me-2">
              <img
                src={personImg}
                alt=""
                style={{ width: "20.58px", height: "26.50px" }}
              />
            </div>
            <h5 className="mb-0" style={{ color: "#464646" }}>
              Appointment Summary
            </h5>
          </div>

          {/* Appointment For */}
          <div className="mb-4 mt-2">
            <label
              className="form-label mb-4 mt-2"
              style={{ color: "#464646" }}
            >
              Appointment For
            </label>
            <div className="d-flex gap-4 mt-2">
              <label className="custom-radio">
                <input
                  type="radio"
                  name="payment"
                  value="myself"
                  checked={paymentOption === "myself"}
                  onChange={() => handlePaymentChange("myself")}
                />
                <span className="radio-checkmark"></span>
                Pay For Myself
              </label>

              {/* Medical Insurance */}
              <label className="custom-radio">
                <input
                  type="radio"
                  name="payment"
                  value="insurance"
                  checked={paymentOption === "insurance"}
                  onChange={() => handlePaymentChange("insurance")}
                />
                <span className="radio-checkmark"></span>I have Medical
                Insurance
              </label>
            </div>
          </div>

          <style>
            {`
        .custom-radio {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #464646;
  position: relative;
  padding-left: 28px; /* space for circle */
}

.custom-radio input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.radio-checkmark {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 20px;
  width: 20px;
  border: 1px solid #ccc; /* outer border 1px */
  border-radius: 50%;
  background-color: #fff;
}

/* Inner dot (default grey) */
.radio-checkmark::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #ccc;
}

/* When selected → red border + red dot */
.custom-radio input:checked ~ .radio-checkmark {
  border-color: #EF7575;
}

.custom-radio input:checked ~ .radio-checkmark::after {
  background: #EF7575;
}


            `}
          </style>

          {/* Form Fields */}
          {paymentOption === "myself" && (
            <div className="border rounded-3 p-3">
              <div className="mb-4">
                <label
                  className="form-label text-muted"
                  style={{ color: "#464646" }}
                >
                  Patient Name
                </label>
                <input
                  type="text"
                  className="form-control custom-placeholder border-0 border-bottom rounded-0 shadow-none"
                  placeholder="Enter Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  style={{ color: "#464646" }}
                />
              </div>

              {/* Gender */}

              <div className="mb-4">
                <label
                  className="form-label text-muted"
                  style={{ color: "#464646" }}
                >
                  Gender
                </label>
                <div className="d-flex flex-column flex-md-row gap-2">
                  {["Male", "Female", "Prefer not to mention"].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`btn flex-fill rounded-3 text-nowrap `}
                      style={{
                        backgroundColor: gender === g ? "#F5F5F5" : "",
                        color: "#464646",
                      }}
                      // onClick={() => setGender(g)}
                      // disabled
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-3">
                <label
                  className="form-label text-muted"
                  style={{ color: "#464646" }}
                >
                  Phone Number
                </label>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                  {/* <div className="fs-6 fw-normal" style={{ color: "#464646" }}>
                    <input
                      type="text"
                      className="form-control custom-placeholder border-0  rounded-0 shadow-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ color: "#464646" }}
                      placeholder="03224033139"
                    />
                  </div> */}
                  <div className="fs-6 fw-normal" style={{ color: "#464646" }}>
                    <div className="input-group">
                      {/* Country code */}
                      <span className="input-group-text" id="basic-addon1">
                        +44
                      </span>

                      {/* Phone number input */}
                      <input
                        type="tel"
                        className="form-control border-0 rounded-0 shadow-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ color: "#464646" }}
                        placeholder="Your Phone Number"
                        aria-label="Phone number"
                        aria-describedby="basic-addon1"
                        maxLength={10}
                        pattern="\d{10}"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-text d-flex align-items-center mt-2 mt-md-0">
                    <i className="bi bi-info-circle me-1"></i>
                    <span style={{ color: "#464646" }}>
                      You will be contacted through this number
                    </span>
                  </div>
                </div>
                <hr />
              </div>

              {/* Symptoms */}
              <div className="mb-3">
                <label className="form-label" style={{ color: "#464646" }}>
                  Reason for Consultation / Symptoms{" "}
                  <span className="text-muted">
                    (optional short note for doctor)
                  </span>
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Write your note"
                  style={{ color: "#464646" }}
                ></textarea>
              </div>
            </div>
          )}
          {paymentOption === "insurance" && (
            <div className="border rounded-3  p-3 mb-4">
              <h6 style={{ color: "#464646" }}>Insurance Details</h6>
              <div className="mb-4 mt-4">
                <label
                  className="form-label text-muted"
                  style={{ color: "#464646" }}
                >
                  Patient Name
                </label>
                <input
                  type="text"
                  className="form-control custom-placeholder border-0 border-bottom rounded-0 shadow-none"
                  placeholder="Enter Patient Name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  style={{ color: "#464646" }}
                />
              </div>
              <div className="mb-3">
                <label
                  className="form-label text-muted"
                  style={{ color: "#464646" }}
                >
                  Phone Number
                </label>
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                  {/* <div className="fs-6 fw-normal" style={{ color: "#464646" }}>
                    <input
                      type="text"
                      className="form-control custom-placeholder border-0  rounded-0 shadow-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ color: "#464646" }}
                      placeholder="03224033139"
                    />
                  </div> */}
                  <div className="fs-6 fw-normal" style={{ color: "#464646" }}>
                    <div className="input-group">
                      {/* Country code */}
                      <span className="input-group-text" id="basic-addon1">
                        +44
                      </span>

                      {/* Phone number input */}
                      <input
                        type="tel"
                        className="form-control border-0 rounded-0 shadow-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ color: "#464646" }}
                        placeholder="Your Phone Number"
                        aria-label="Phone number"
                        aria-describedby="basic-addon1"
                        maxLength={10}
                        pattern="\d{10}"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-text d-flex align-items-center mt-2 mt-md-0">
                    <i className="bi bi-info-circle me-1"></i>
                    <span style={{ color: "#464646" }}>
                      You will be contacted through this number
                    </span>
                  </div>
                </div>
                <hr />
              </div>
              {/* Insurer */}
              <div className="mb-3 mt-4">
                <label className="form-label">
                  Insurer<span className="text-danger">*</span>
                </label>
                <select
                  name="insurer"
                  className="form-select"
                  value={formData.insurer}
                  onChange={handleChange}
                >
                  <option value="">Please select your insurer</option>
                  <option value="axa">AXA</option>
                  <option value="bupa">Bupa</option>
                  <option value="aviva">Aviva</option>
                  <option value="vitality">Vitality</option>
                </select>
              </div>
              {/* Policy Number */}
              <div className="mb-3">
                <label className="form-label">
                  Policy number<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="policyNumber"
                  className="form-control"
                  placeholder="Enter policy number"
                  value={formData.policyNumber}
                  onChange={handleChange}
                />
              </div>
              {/* Authorisation Code */}
              <div className="mb-3">
                <label className="form-label">Authorisation code</label>
                <input
                  type="text"
                  name="authCode"
                  className="form-control"
                  placeholder="Enter authorisation code"
                  value={formData.authCode}
                  onChange={handleChange}
                />
              </div>
              {/* Note */}
              <div className="small text-muted">
                Please note that without an authorisation code you are liable
                for the full self-pay cost of your initial appointment.
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-primary mt-2 d-flex align-items-center"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Footer Note */}
        {paymentOption === "myself" && (
          <>
            <div
              className="mt-1 mr-4 ml-4 text-muted small"
              style={{ color: "#464646" }}
            >
              Please review your appointment details before proceeding to
              payment. Once confirmed, you'll receive a booking confirmation via
              email.
            </div>

            <div className="mb-3 mr-3 ml-3 mt-2">
              <h5
                className="d-flex align-items-center"
                style={{ color: "#464646" }}
              >
                <img src={card} alt="card" className="me-2" />
                Check Payment Method
              </h5>

              {/* Online Payment Box */}
              <div
                className="pr-3 pl-3 pt-2 pb-2 mt-3  ml-1 mr-1"
                style={{
                  backgroundColor: "#E8F8F5", // same soft green background
                  borderRadius: "14px",
                  // smoother rounding
                }}
              >
                <div className="d-flex  align-items-start justify-content-between">
                  {/* Left Section */}
                  <div className="d-flex ml-3 align-items-center">
                    <input
                      className="form-check-input me-2"
                      type="radio"
                      checked
                      readOnly
                      style={{
                        borderColor: "#EF7575", // red outline
                        backgroundColor: "#EF7575",
                      }} // red highlight
                    />
                    <label
                      className="form-check-label "
                      style={{
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#464646",
                      }}
                    >
                      Online Payment
                    </label>
                  </div>

                  {/* Right Section */}
                  <div className="text-end">
                    <div className="text-muted small mb-1">
                      Pay online and get 10% off
                    </div>
                    <div className="mt-4">
                      <span className="text-muted text-decoration-line-through me-2">
                        £22.00
                      </span>
                      <span className="fw-bold fs-5">£{fees}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InsuranceProvider;

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
      <div className="d-flex align-items-center col-12 gap-2">
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
        // centered
        className="custom-modal2"
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
