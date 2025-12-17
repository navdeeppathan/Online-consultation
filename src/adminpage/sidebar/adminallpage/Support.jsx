import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import searchicon from "../../../assets/images/searchicon.png";
import image from "../../../assets/admin/Group.png";
import image1 from "../../../assets/admin/Group (1).png";
import image2 from "../../../assets/admin/Group 1214.png";
import image3 from "../../../assets/admin/Isolation_Mode.png";
import image4 from "../../../assets/admin/9044371_group_security_icon 1.png";
import image5 from "../../../assets/admin/Arrow 1 (Stroke).png";
import "react-calendar/dist/Calendar.css";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import Config from "../../../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
ChartJS.register(ArcElement, Tooltip, Legend);
const Support = () => {
  const [activeFaq, setActiveFaq] = useState("account");
  const userData = JSON.parse(localStorage.getItem("user"));
  const toggleFaq = (section) => {
    setActiveFaq(activeFaq === section ? "" : section);
  };

  const [data, setData] = useState({
    monthly_data: {},
    users: [],
    doctors: [],
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (!userData?.id || userData.role !== "doctor") return;

    axios
      .get(`${Config.BASE_URL}/api/monthly-spent`, {
        params: { doctor_id: userData.id },
      })
      .then((response) => {
        const res = response.data || {};
        const monthlyArray = res.monthly_data || [];

        // Convert array to object with month as key
        const monthMap = {};
        monthlyArray.forEach((item) => {
          monthMap[item.month] = item;
        });

        const currentMonthKey = new Date().toISOString().slice(0, 7);

        // Get all months >= current month and sort them
        const sortedKeys = Object.keys(monthMap)
          .filter((m) => m >= currentMonthKey)
          .sort();

        // Set state
        setData({
          monthly_data: monthMap,
          users: res.users || [],
          doctors: res.doctors || [],
        });

        setPatients(res.users || []);
        setAvailableMonths(sortedKeys);

        // Set default selected month
        setSelectedMonth(sortedKeys[0] || currentMonthKey);
      });
  }, []);

  // Get data for selected month
  const monthly = data?.monthly_data?.[selectedMonth] || {
    video: 0,
    // "In-Person": 0,
    total: 0,
    percentages: {
      video: "0%",
      "In-Person": "0%",
    },
  };

  const chartData = {
    labels: ["Video", "In-Person"],
    datasets: [
      {
        data: [monthly.video, monthly["In-Person"]],
        backgroundColor: ["#407bff", "#70EFCD"],
        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label;
            const value = tooltipItem.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
    cutout: "70%",
  };
  // Convert string to object
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({ title: "", content: "" });

  const supportItems = [
    {
      title: "How to Use the Yodoc Dashboard",
      image: image1,
      content: "Here’s how you can use the Yodoc dashboard effectively...",
    },
    {
      title: "Account & Profile",
      image: image2,
      content: "", // content not needed — we will navigate
      route: "/admin/profilesetting", // add route here
    },
    {
      title: "Terms & Conditions",
      image: image3,
      content: "These are the terms and conditions you should know...",
    },
    {
      title: "Privacy & Security",
      image: image4,
      content: "Your data privacy and security are our top priority...",
    },
  ];

  const handleCardClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else {
      setModalData(item);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message before sending.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${Config.BASE_URL}/api/contact-message`,
        {
          name: `${userData?.firstname} ${userData?.lastname}` || "N/A", // optional
          email: userData?.email || "N/A", // optional
          message: message,
        }
      );

      if (response.data.status) {
        toast.success("Your message has been sent successfully!");
        setMessage("");
        setShowPopup(false);
      } else {
        toast.error(
          response.data.message || "Something went wrong while sending message."
        );
      }
    } catch (error) {
      console.error("Error sending message: " + error);
      toast.error(
        error.response.data.message ||
          error.response.data.error ||
          "Something went wrong while sending message."
      );
    } finally {
      setLoading(false);
    }
  };
  const [showCallPopup, setShowCallPopup] = useState(false);

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 content-area">
          <Navbar />
          <div className=" bgcolor  p-3">
            <h3>Supports</h3>

            <div className="row">
              <div className="col-lg-12">
                <div className=" support-container">
                  <div className="card p-5 help-banner mb-4">
                    <div className="row align-items-center">
                      <div className="col-md-8">
                        <h2 className="mb-3">How can we help?</h2>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Search for answer"
                          />
                          <div className="input-group-append">
                            <button className="btn">
                              <img src={searchicon} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 text-center mt-3 mt-md-0">
                        <img src={image} alt="Support" className="img-fluid" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Access Buttons */}
                  {/* <div className="row mb-4">
                    {supportItems.map((item, index) => (
                      <div className="col-6 col-md-6 mb-3" key={index}>
                        <div
                          className="card py-3 px-2 h-100 support-card"
                          onClick={() => handleCardClick(item)}
                        >
                          <h6>
                            <img src={item.image} className="mx-3" alt="" />
                            {item.title}
                            <img
                              src={image5}
                              className="mx-4 float-right"
                              alt=""
                            />
                          </h6>
                        </div>
                      </div>
                    ))}
                  </div>

                  {showModal && (
                    <div className="react-modal-overlay" onClick={closeModal}>
                      <div
                        className="react-modal-content"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="modal-header d-flex justify-content-between align-items-center">
                          <h5 className="modal-title">{modalData.title}</h5>
                          <button className="close-button" onClick={closeModal}>
                            &times;
                          </button>
                        </div>
                        <div className="modal-body">
                          <p>{modalData.content}</p>
                        </div>
                      </div>
                    </div>
                  )} */}

                  {/* FAQ Accordion */}
                  <div className="card p-4 fAQcard">
                    <h5>FAQ’s</h5>
                    <div className="row mt-3">
                      <div className="col-lg-6">
                        <div className="accordion" id="accordionExample">
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingOne">
                              <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseOne"
                                aria-expanded="true"
                                aria-controls="collapseOne"
                              >
                                About Yodoc
                              </button>
                            </h2>
                            <div
                              id="collapseOne"
                              className="accordion-collapse collapse show"
                              aria-labelledby="headingOne"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <p>Q1: What is Yodoc?</p>
                                <p>
                                  Yodoc is a UK-based booking platform that
                                  helps patients find verified doctors and
                                  specialists to book in-person or virtual
                                  consultations with. We provide booking
                                  infrastructure, but we do not allow any
                                  medical diagnosis, advise on treatment through
                                  our platform.
                                </p>
                                <p>Q2: Is Yodoc a healthcare provider?</p>
                                <p>
                                  No. Yodoc is not a healthcare provider. All
                                  medical advice, diagnosis, and treatment will
                                  be provided solely by the doctor virtually or
                                  in their clinic.
                                </p>
                                <p>Q3: Who can join Yodoc?</p>
                                <p>
                                  We work with UK-registered doctors and
                                  specialists who hold a valid GMC licence to
                                  practise. Additional checks may apply.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseTwo"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                              >
                                Joining the Platform
                              </button>
                            </h2>
                            <div
                              id="collapseTwo"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingTwo"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <p>Q1: What do I need to sign up?</p>
                                <p>
                                  <div>
                                    <p>You’ll need:</p>
                                    <ul>
                                      <li>GMC Certificate</li>
                                      <li>
                                        Professional profile details (specialty,
                                        experience, clinic information)
                                      </li>
                                      <li>Valid medical indemnity cover</li>
                                    </ul>
                                  </div>
                                </p>
                                <p>Q2: Do I need my own CQC registration?</p>
                                <p>
                                  If you are offering medical consultations
                                  under your own clinical practice, then your
                                  practice must comply with CQC requirements.
                                  Yodoc does not hold CQC registration and does
                                  not provide clinical services on behalf of
                                  doctors.
                                </p>
                                <p>
                                  Q3: Can I offer both virtual and in-person
                                  appointments?
                                </p>
                                <p>
                                  Yes, you can enable either or both. Virtual
                                  consultations can be conducted securely
                                  through Yodoc’s built-in video system.
                                  In-person consultations will take place at the
                                  chosen doctor’s clinic or hospital.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingThree">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseThree"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                Bookings & Appointments
                              </button>
                            </h2>
                            <div
                              id="collapseThree"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingThree"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <p>Q1: How are appointments managed?</p>
                                <p>
                                  Patients book via Yodoc, and you receive a
                                  confirmation with all necessary details. You
                                  can manage availability, cancellations, and
                                  scheduling on your Yodoc dashboard.
                                </p>
                                <p>Q2: Who sets the consultation fees?</p>
                                <p>
                                  You do. Fees for virtual and in-person
                                  appointments are fully controlled by the
                                  doctor.
                                </p>
                                <p>Q3: Can patients cancel appointments?</p>
                                <p>
                                  Yes, but your cancellation policy applies.
                                  This can be set by yourself through your Yodoc
                                  account.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapseseven"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                              >
                                Payments
                              </button>
                            </h2>
                            <div
                              id="collapseseven"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingTwo"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <p>Q1: How does payment work?</p>
                                <p>
                                  Yodoc collects payment from the patient at the
                                  time of booking. After the appointment is
                                  completed, we transfer the consultation fee to
                                  you (after deducting our commission).
                                </p>
                                <p>Q2: How do payouts work?</p>
                                <p>
                                  Payouts are made to your UK business or
                                  Personal bank account that you provide. You’ll
                                  also receive clear statements for every
                                  booking.
                                </p>
                                <p>Q3: Does Yodoc handle insurance payments?</p>
                                <p>
                                  No. Yodoc currently supports self-pay
                                  appointments only. We do not process insurance
                                  claims, accept insurance details, or invoice
                                  insurers on behalf of patients or doctors. But
                                  we plan to progress to this stage soon.
                                  <br /> For now, if a patient wishes to use
                                  private medical insurance, they must contact
                                  their insurer directly and proceed.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="accordion" id="accordionExample">
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapsefive"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                              >
                                Reviews & Reputation
                              </button>
                            </h2>
                            <div
                              id="collapsefive"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingTwo"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <p>Q1: How do reviews work?</p>
                                <p>
                                  After a verified appointment, patients can
                                  leave a review. All reviews are checked before
                                  being published. Doctors may also respond to
                                  reviews through their dashboard.
                                </p>
                                <p>
                                  Q2: Can I request removal of unfair or
                                  inaccurate reviews?
                                </p>
                                <p>
                                  You can report any review that you believe
                                  violates our guidelines. We will assess it and
                                  remove it if appropriate.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingTwo">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapsefive"
                                aria-expanded="false"
                                aria-controls="collapseTwo"
                              >
                                Compliance & Responsibilities
                              </button>
                            </h2>
                            <div
                              id="collapsefive"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingTwo"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <p>
                                  Q1: Who is responsible for clinical care and
                                  compliance?
                                </p>
                                <p>
                                  <div>
                                    <p>Doctors are fully responsible for:</p>
                                    <ul>
                                      <li>The clinical care they provide</li>
                                      <li>
                                        Compliance with GMC, CQC, data
                                        protection, and professional standards
                                      </li>
                                      <li>Insurance and indemnity</li>
                                    </ul>

                                    <p>
                                      Yodoc does not provide medical diagnosis,
                                      prescribe treatment or manage patient
                                      records beyond the booking details.
                                    </p>
                                  </div>
                                </p>
                                <p>
                                  Q2: Do I need separate indemnity for online
                                  consultations?
                                </p>
                                <p>
                                  Yes, doctors must confirm that their indemnity
                                  covers both virtual and in-person
                                  consultations offered through Yodoc.This will
                                  be shown during the registration process.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="accordion-item">
                            <h2 className="accordion-header" id="headingThree">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#collapsesix"
                                aria-expanded="false"
                                aria-controls="collapseThree"
                              >
                                Technical & Support
                              </button>
                            </h2>
                            <div
                              id="collapsesix"
                              className="accordion-collapse collapse"
                              aria-labelledby="headingThree"
                              data-bs-parent="#accordionExample"
                            >
                              <div className="accordion-body">
                                <p>
                                  Q1: Does Yodoc provide video consultation
                                  tools?
                                </p>
                                <p>
                                  Yes. Doctors and patients can join a secure
                                  video call directly through Yodoc for virtual
                                  appointments.
                                </p>
                                <p>
                                  Q2: What support is available if I have
                                  questions?
                                </p>
                                <p>
                                  Our support team can help with onboarding,
                                  profile updates, technical issues, or payment
                                  questions. Contact us at help@yodoc.co.uk
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    {/* Email Contact Card */}
                    <div className="col-lg-6 mb-4">
                      <div className="contact-card text-center p-4 border rounded-4 shadow-sm">
                        <div className="contact-icon mb-3">
                          <i className="fa fa-envelope fa-2x "></i>
                        </div>
                        <h5 className="contact-title">Contact us by Email</h5>
                        <p className="contact-desc">
                          Send us your query through email, and we’ll get back
                          to you soon.
                        </p>
                        <button
                          className="btn btn-primary rounded-pill px-4 py-2"
                          onClick={() => setShowPopup(true)}
                        >
                          Message
                        </button>
                      </div>
                    </div>

                    {/* Phone Contact Card */}
                    <div className="col-lg-6 mb-4">
                      <div className="contact-card text-center p-4 border rounded-4 shadow-sm">
                        <div className="contact-icon mb-3">
                          <i className="fas fa-phone-alt fa-2x "></i>
                        </div>
                        <h5 className="contact-title">Give us a Call</h5>
                        <p className="contact-desc">
                          Talk to us directly if you need immediate help.
                        </p>
                        <button
                          onClick={() => setShowCallPopup(true)}
                          className="btn btn-primary rounded-pill px-4 py-2"
                        >
                          Call Now
                        </button>
                      </div>
                    </div>

                    {/* Popup (Modal) */}
                    {showPopup && (
                      <div
                        className="modal fade show"
                        style={{
                          display: "block",
                          backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content p-3 rounded-4">
                            <div className="modal-header border-0">
                              <h5 className="modal-title">Send us a message</h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowPopup(false)}
                              ></button>
                            </div>
                            <div className="modal-body">
                              <textarea
                                className="form-control"
                                rows="5"
                                placeholder="Type your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                              ></textarea>
                            </div>
                            <div className="modal-footer border-0">
                              <button
                                className="btn btn-secondary"
                                onClick={() => setShowPopup(false)}
                              >
                                Cancel
                              </button>
                              <button
                                className="btn btn-primary"
                                onClick={handleSend}
                                disabled={!message || loading}
                              >
                                {loading ? "Sending..." : "Send"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Call Popup */}
                    {showCallPopup && (
                      <div
                        className="modal fade show"
                        style={{
                          display: "block",
                          backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content p-3 rounded-4 text-center">
                            <div className="modal-header border-0">
                              <h5 className="modal-title w-100">Call Us</h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowCallPopup(false)}
                              ></button>
                            </div>
                            <div className="modal-body">
                              <p className="mb-3">
                                You can reach us directly at:
                              </p>
                              <h4 className="text-primary fw-bold">
                                +44 7879 175585
                              </h4>
                            </div>
                            <div className="modal-footer border-0 justify-content-center">
                              <button
                                className="btn btn-secondary"
                                onClick={() => setShowCallPopup(false)}
                              >
                                Close
                              </button>
                              {/* <a
                                href="tel:+447879175585"
                                className="btn btn-primary"
                                onClick={() => setShowCallPopup(false)}
                              >
                                Call
                              </a> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* <div className="col-lg-4">
                <div className="card spend-summary-card shadow-sm p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">All Appointments</h6>
                  </div>

                  <div className="text-center">
                    
                    <div
                      style={{
                        width: 300,
                        height: 300,
                        position: "relative",
                        margin: "0 auto",
                      }}
                    >
                      <Doughnut data={chartData} options={chartOptions} />

                    
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          textAlign: "center",
                          lineHeight: "1.4",
                        }}
                      >
                        Total
                        <br />£{monthly.total}
                      </div>
                    </div>
                  </div>

                  <h6 className="mt-4">Completed Appointments</h6>
                  {patients
                    .slice(0, 5)
                    .reverse()
                    .map((user) => (
                      <div
                        key={user.id}
                        className="completed-appointment mt-2 d-flex align-items-center"
                      >
                        <div className="icon blue-bg me-3">
                          <i className="fas fa-user"></i>
                        </div>
                        <div>
                          <p className="mb-0 fw-bold">
                            {user.firstname} {user.lastname || ""}
                          </p>
                          <small>
                            {user.email} <br />
                            {user.mobile_number}
                          </small>
                        </div>
                      </div>
                    ))}
                </div>
              </div> */}
            </div>
            <br />
            <h6>Copyright © 2025 Yodoc UK All Rights Reserved.</h6>
          </div>
        </div>
      </div>

      <style>
        {`

.contact-card {
  background-color: #fff;
  border-radius: 16px;
  padding: 30px 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
  transition: all 0.3s ease;
}

.contact-icon i {
  color: #3b5998; /* Facebook blue */
}

.contact-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
}

.contact-desc {
  color: #555;
  font-size: 14px;
  margin-bottom: 20px;
}

.support-card {
  transition: box-shadow 0.3s ease;
  border: 1px solid #eee;
  border-radius: 10px;
  cursor: pointer;
}

.support-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #f9f9f9;
}

/* Modal Styles */
.react-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.react-modal-content {
  background: white;
  width: 90%;
  max-width: 600px;
  padding: 20px;
  border-radius: 10px;
  position: relative;
}

.modal-header .modal-title {
  margin: 0;
  font-size: 1.25rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}


.spend-summary-card {
  border-radius: 20px;
  background-color: #fff;
  border: none;
}

.donut-chart {
  position: relative;
  width: 130px;
  height: 130px;
  margin: 0 auto;
  border-radius: 50%;
  background: conic-gradient(
    #4a6cf7 65%,
    #2c2c2c 0 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.total-amount {
  font-weight: bold;
  font-size: 20px;
  position: absolute;
  color: #000;
}

.donut-label {
  position: absolute;
  right: -10px;
  top: 40%;
  background: #2c2c2c;
  color: #fff;
  font-size: 10px;
  padding: 3px 7px;
  border-radius: 5px;
}

.dot {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
}

.blue-dot {
  background-color: #4a6cf7;
}

.black-dot {
  background-color: #2c2c2c;
}

.completed-appointment {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.completed-appointment:last-child {
  border-bottom: none;
}

.icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 18px;
}

.blue-bg {
  background-color: #4a6cf7;
}

.gray-bg {
  background-color: #3d3d3d;
}



.support-container {
  background-color: #f8f9fc;
  border-radius: 10px;
}

.help-banner {
  background-color: #70EFCD;
  border: none;
  border-radius: 15px;
}

.support-card {
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #fff;
  transition: all 0.3s ease;
}
.support-card:hover {
  background-color: #fff;
  cursor: pointer;
}

.fAQcard{
 background-color: #fff;
  border-radius: 12px;
  border: 1px solid #fff;
  transition: all 0.3s ease;
}
  .fAQcard{
   background-color: #fff;
  cursor: pointer;
  }
.icon-placeholder {
  font-size: 24px;
}

.faq-section-title {
  cursor: pointer;
  padding: 10px 15px;
  margin-bottom: 8px;
  border-radius: 6px;
  font-weight: 500;
  background-color: #f5f5f5;
  transition: 0.3s ease;
}
.faq-section-title:hover,
.faq-section-title.active {
  background-color: #e0ebff;
  color: #3265e4;
}



`}
      </style>
    </>
  );
};

export default Support;
