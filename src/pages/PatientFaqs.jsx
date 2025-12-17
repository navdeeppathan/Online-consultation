import React, { use, useEffect, useState } from "react";

import searchicon from "../assets/images/searchicon.png";
import image from "../assets/admin/Group.png";
import bgImage from "../assets/images/Background.png";
import Header from "../components/Header";
import Footer from "../components/Footer";

import "react-calendar/dist/Calendar.css";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import Config from "../config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
ChartJS.register(ArcElement, Tooltip, Legend);
const PatientFaqs = () => {
  const [additionalInfo, setAdditionalInfo] = useState({});

  const [activeFaq, setActiveFaq] = useState("account");
  const userData = JSON.parse(localStorage.getItem("user") || "{}");

  const toggleFaq = (section) => {
    setActiveFaq(activeFaq === section ? "" : section);
  };
  // Convert string to object
  const [data, setData] = useState({
    monthly_data: {},
    users: [],
    doctors: [],
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    if (!userData?.id || userData.role !== "patient") return;

    axios
      .get(`${Config.BASE_URL}/api/monthly-spent`, {
        params: { user_id: userData.id },
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

        setPatients(res.doctors || []);
        setAvailableMonths(sortedKeys);

        // Set default selected month
        setSelectedMonth(sortedKeys[0] || currentMonthKey);
      });
  }, []);

  // Get data for selected month
  const monthly = data?.monthly_data?.[selectedMonth] || {
    video: 0,
    "In-Person": 0,
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

  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.id) {
      // fetchAdditionalInfo();
    }
  }, [userData]);

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
        <div className="container mt-2">
          <h3 className="my-4">Supports</h3>

          <div className="row mb-4">
            <div className="col-lg-12">
              <div className=" support-container">
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
                                Yodoc is a booking platform that helps you find
                                GMC verified doctors and specialists across the
                                UK for consultations either by video or
                                in-person at a hospital of your choice. We
                                facilitate the connection between a doctor and a
                                patient, but we do not provide medical
                                diagnosis, advice or treatment through our
                                platform.
                              </p>
                              <p>Q2: Is Yodoc a healthcare provider?</p>
                              <p>
                                No, Yodoc is not a healthcare provider. We are a
                                directory service to help you connect with
                                independent, qualified doctors across the UK.
                              </p>
                              <p>Q3: Can I get medical advice from Yodoc?</p>
                              <p>
                                No. Any medical advice, diagnosis, or treatment
                                comes directly from the doctor you choose to
                                book a consultation with, not from Yodoc.
                              </p>
                              <p>Q4: Is Yodoc for emergency medical help?</p>
                              <p>
                                No, Yodoc does not provide access to emergency
                                services. If you are experiencing a medical
                                emergency, please call 111 or 999.
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
                              Using the Platform
                            </button>
                          </h2>
                          <div
                            id="collapseTwo"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <p>Q1: How does booking work?</p>
                              <p>
                                You browse doctors by name, specialty, and
                                location. Choose the consultation type (virtual
                                or in-person), and book your appointment via
                                Yodoc. Once the appointment is booked, the
                                doctor receives your details and you will
                                receive a confirmation email from us.
                              </p>
                              <p>
                                Q2: How will I attend a virtual appointment?
                              </p>
                              <p>
                                If you choose a virtual consultation, you’ll
                                receive a secure video link through Yodoc to
                                join the appointment with the doctor at the
                                scheduled time. The appointment will take place
                                on our platform and your data is fully protected
                                under the GDPR.
                              </p>
                              <p>Q3: How will I attend an in-person visit?</p>
                              <p>
                                An in-person visit is like a routine visit to a
                                hospital of your choice. The booking will be
                                made via Yodoc and you will receive confirmation
                                via email.
                              </p>
                              <p>
                                Q4: Can I cancel or reschedule my appointment?
                              </p>
                              <p>
                                Yes, but cancellation and rescheduling policies
                                are set by an individual doctor.You should check
                                their specific policy at the time of booking.
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
                              data-bs-target="#collapseseven"
                              aria-expanded="false"
                              aria-controls="collapseTwo"
                            >
                              Reviews & Feedback
                            </button>
                          </h2>
                          <div
                            id="collapseseven"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingTwo"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <p>
                                Q1: Can I leave a review after my appointment?
                              </p>
                              <p>
                                Yes. After you attend your appointment, you’ll
                                be invited to leave a review via Yodoc. This
                                helps other patients make informed decisions.
                              </p>
                              <p>Q2: Are reviews verified?</p>
                              <p>
                                We verify appointments before reviews are
                                published, to maintain trust and credibility in
                                the feedback system.
                              </p>
                              <p>Q2: Why isn’t my doctor/specialist listed?</p>
                              <p>
                                We are growing our network. Not all doctors are
                                listed yet. If your doctor isn’t on Yodoc, you
                                can let us know and we’ll try to invite them to
                                join.
                              </p>
                              <p>
                                Q3: How can I contact Yodoc for help? If you
                                need
                              </p>
                              <p>
                                If you need help with booking, cancellations, or
                                other queries, you can email us at
                                help@yodoc.co.uk
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
                              Payments
                            </button>
                          </h2>
                          <div
                            id="collapseThree"
                            className="accordion-collapse collapse"
                            aria-labelledby="headingThree"
                            data-bs-parent="#accordionExample"
                          >
                            <div className="accordion-body">
                              <p>Q1: How do I pay for my appointment?</p>
                              <p>
                                When you book a consultation, you make a payment
                                through Yodoc using a Debit or Credit card.
                              </p>
                              <p>Q2: Are my payment details safe?</p>
                              <p>
                                Yes, your card data is processed by secure,
                                third-party payment providers. Yodoc does not
                                store your full card information.
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
                  {/* <div className="col-lg-6 mb-4">
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
                    </div> */}

                  {/* Phone Contact Card */}
                  {/* <div className="col-lg-6 mb-4">
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
                    </div> */}

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
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
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

export default PatientFaqs;
