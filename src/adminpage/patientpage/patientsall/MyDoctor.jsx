import React, { useEffect, useState } from "react";

import { Form, Button, Table, Badge } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import star from "../../../assets/admin/285661_star_icon 1.png";
import bluedot from "../../../assets/admin/Ellipse 2365.png";
import graydot from "../../../assets/admin/Ellipse 2366.png";
import imageone from "../../../assets/admin/Group 1324.png";
import imagetwo from "../../../assets/admin/Rectangle 2388.png";
import imagetree from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import zoom from "../../../assets/admin/zoom (1).png";
import plusicon from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import SidebarPatient from "../sidebarpatient/SidebarPatient";
import NavbarPatient from "../sidebarpatient/NavbarPatient";
import axios from "axios";
import Config from "../../../config";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
ChartJS.register(ArcElement, Tooltip, Legend);

const MyDoctors = () => {
  const navigate = useNavigate();
  const [additionalInfo, setAdditionalInfo] = useState({});

  const [doctors, setDoctors] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const patientID = userData?.id;
  const [doctorLength, setDoctorLength] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    const payload = {
      user_id: patientID,
    };
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/appointments`, {
        params: payload,
      });

      const filteredAppointments = res.data.appointments;
      console.log("mydoctor", filteredAppointments);
      setDoctorLength(filteredAppointments.length);

      // Extract unique doctor IDs from the appointments
      const doctorIds = [
        ...new Set(filteredAppointments.map((appt) => appt.doctor?.id)),
      ];

      fetchDrData(doctorIds);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const fetchDrData = async (doctorIds) => {
    try {
      setLoading(true);
      const response = await axios.get(`${Config.BASE_URL}/api/alldoctor`);
      const allDoctors = response.data.doctors;

      // Filter doctors by the list of IDs
      const matchedDoctors = allDoctors.filter((doctor) =>
        doctorIds.includes(doctor.id)
      );

      console.log("Matched Doctors:", matchedDoctors);
      setDoctors(matchedDoctors);
    } catch (error) {
      console.error(
        "Error fetching doctor data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
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
  //  const fetchAdditionalInfo = async () => {
  //      try {
  //        const response = await axios.get(
  //          `${Config.BASE_URL}/api/profile/${userData.id}`
  //        );

  //        const data = response.data;
  //        console.log(data, "responseresponse");

  //        // Set to state (optional if you want to display it)
  //        setAdditionalInfo(data);
  //  // firstname: data.firstname || "",
  //  //         lastname: data.lastname || "",
  //  //         mobile_number: data.mobile_number || "",
  //  //         email: data.email || "",
  //  //         address: data.address || "",
  //  //         profile_image: data.profile_image || "",
  //  //         gender: data.gender || "",
  //  //         country: data.country || "",
  //  //         postcode: data.postcode || "",
  //  //         nationality: data.nationality || "",
  //  //         date_of_birth: data.date_of_birth || "",
  //        // Check if any required field is missing/null/empty
  //        if (
  //          !data ||
  //          !data.firstname ||
  //          !data.lastname ||
  //          !data.mobile_number ||
  //          !data.email ||
  //          !data.profile_image ||
  //          !data.gender ||
  //          !data.country ||
  //          !data.postcode ||
  //          !data.nationality ||
  //          !data.date_of_birth

  //        ) {
  //          // Redirect to profile page
  //          navigate("/patient/profile");
  //        }
  //      } catch (error) {
  //        console.error("Error fetching additional info", error);
  //        // Redirect on error as fallback
  //        // navigate("/patient/profile");
  //      }
  //    };

  useEffect(() => {
    if (userData?.id) {
      // fetchAdditionalInfo();
    }
  }, [userData]);

  console.log("doctors", doctors);

  const [showModal, setShowModal] = useState(false);
  const [doctorid, setDoctorId] = useState("");
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    review: "",
    rating: 0,
    recommend: null,
    tags: [], // array for selected tags
  });

  const feedbackdoctor = (doctorid) => {
    setDoctorId(doctorid);
    setShowModal(true);
  };
  console.log("doctorid", doctorid);

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
      user_id: patientID,
      doctor_id: Number(doctorid),
      rating: feedbackData.rating,
      review: feedbackData.review,
      recommend: feedbackData.recommend,
      message: feedbackData.tags?.join(", "), // Convert tags array to string
    };

    try {
      await axios.post(`${Config.BASE_URL}/api/feedbacks`, reviewPayload);
      toast.success("Thank you for your feedback!");
      // localStorage.removeItem("appointmentPayload");
      setShowModal(false);
      navigate("/dashboardpatient");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback");
    }
  };

  return (
    <>
      <Toaster />

      <div className="d-flex">
        <SidebarPatient />
        <div className="flex-grow-1 content-area">
          <NavbarPatient />
          <div className=" bgcolor  p-3">
            <h3>My Doctors</h3>

            <div className="row">
              <div className="col-lg-12">
                <div className="row">
                  {loading ? (
                    <div className="col-12 text-center mt-4">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          py: 4,
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    </div>
                  ) : doctors?.length > 0 ? (
                    doctors.map((doctor, index) => {
                      // ✅ Check if doctor has any completed consultation
                      const hasCompletedConsult =
                        doctor.as_doctor_appointments?.some(
                          (appt) => appt.isConsultComplete === "1"
                        );

                      return (
                        <div key={index} className="col-lg-12">
                          <div
                            onClick={() =>
                              navigate(`/doctordetails/${doctor.id}`)
                            }
                            className="doctor-card p-2 shadow-sm mt-3"
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  doctor.profile_image
                                    ? `${Config.BASE_URL}/${doctor.profile_image}`
                                    : doctor.gender === "Female"
                                    ? female
                                    : male
                                }
                                alt="Doctor"
                                className="doctor-img me-3"
                              />
                              <div>
                                <h5 className="mb-1">
                                  {doctor.firstname} {doctor.lastname}
                                </h5>
                                <p className="text-muted mb-0 small">
                                  {doctor.qualifications?.[0]?.degree}
                                  {/* ,{" "}
                                  {doctor.qualifications?.[0]?.institution} */}
                                  <br />
                                  {JSON.parse(
                                    doctor.professional_registration
                                      ?.specialization || "[]"
                                  ).join(", ")}
                                </p>
                              </div>
                            </div>

                            <div className="startdatatext">
                              <div className="row  mt-2 mr-1 ml-1 p-4 doctor-stats">
                                <div className="col-3">
                                  <strong className="text-primary">
                                    {doctor.overall_feedback_percentage}%
                                  </strong>
                                  <p className="small text-muted mb-0">
                                    Satisfied
                                  </p>
                                </div>
                                <div className="col-3">
                                  <strong className="text-primary">
                                    {doctor.unique_user_id_count}
                                  </strong>
                                  <p className="small text-muted mb-0">
                                    Patient
                                  </p>
                                </div>
                                <div className="col-3">
                                  <strong className="text-primary">
                                    {doctor.professional_registration
                                      ?.years_of_experience || 0}{" "}
                                    Years
                                  </strong>
                                  <p className="small text-muted mb-0">
                                    Experience
                                  </p>
                                </div>
                                <div className="col-3">
                                  <strong className="text-primary">
                                    15-30 Min
                                  </strong>
                                  <p className="small text-muted mb-0">
                                    Wait Time
                                  </p>
                                </div>
                              </div>
                              <div className="col-12 mt-1 text-end">
                                {/* {hasCompletedConsult && ( */}
                                <div className="">
                                  <button
                                    className="btnbtnprimary"
                                    onClick={() => feedbackdoctor(doctor.id)}
                                  >
                                    Feedback
                                  </button>
                                </div>
                                {/* )} */}
                              </div>
                            </div>

                            {/* ✅ Show Review button only if doctor has completed consultation */}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-12 text-center mt-4">
                      <h5 className="text-muted">
                        No doctors found matching your filters.
                      </h5>
                    </div>
                  )}
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
                        width: 280,
                        height: 280,
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
                  {patients && patients.length > 0
                    ? patients
                        .slice(0, 5)
                        .reverse()
                        .map((user) => (
                          <div
                            key={user.id}
                            className="completed-appointment mt-2 d-flex align-items-center"
                          >
                            <div className="row w-100 align-items-center">
                              <div className="col-lg-2">
                                <div className="icon blue-bg me-3">
                                  <img src={imagetree} alt="tree" />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <p className="mb-0 fw-bold">
                                  {user.firstname} {user.lastname || ""}
                                </p>
                                <small>{user.mobile_number}</small>
                              </div>

                              <div className="col-lg-3 text-end ms-auto">
                                <p className="mb-0 fw-bold"></p>
                              </div>
                            </div>
                          </div>
                        ))
                    : Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={index}
                          className="completed-appointment mt-2 d-flex align-items-center"
                        >
                          <div className="row w-100 align-items-center">
                            <div className="col-lg-2">
                              <div className="icon blue-bg me-3">
                                <img src={imagetree} alt="tree" />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <p className="mb-0 fw-bold">
                                <img src={imageone} alt="one" />
                              </p>
                            </div>

                            <div className="col-lg-3 text-end ms-auto">
                              <p className="mb-0 fw-bold">
                                <img src={imagetwo} alt="two" />
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
         .btnbtnprimary{
  background-color: #407bff;
  color:#fff;
  padding:8px 15px;
  border-radius: 20px;
  border:2px solid #407bff;


        }
        .doctor-img{
          width: 130px;
  height: 130px;
  border-radius: 10px;

        }
            .doctor-card {
  background-color: #F7F9FC;
  border-radius: 16px;
}

.doctor-stats{
  background-color: #fff;
  border-radius: 16px;


}

.doctor-stats strong {
  font-size: 1rem;
}



.btn-success, .btn-primary {
  font-weight: 500;
  padding: 10px 0;
}

.doctordetails{
  background-color: #F7F9FC;
  border-radius: 20px;
  

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
              className="form-control review-box"
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
    </>
  );
};

export default MyDoctors;
