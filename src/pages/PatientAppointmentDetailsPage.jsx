import React, { use, useCallback, useEffect, useState } from "react";

import male from "../assets/images/male.png";
import female from "../assets/images/Female2.png";
import imageone from "../assets/admin/Group 1324.png";
import imagetwo from "../assets/admin/Rectangle 2388.png";
import imagetree from "../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import "react-calendar/dist/Calendar.css";

import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import toast, { Toaster } from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Sidebar from "../adminpage/sidebar/Sidebar";
import Navbar from "../adminpage/sidebar/Navbar";
import Config from "../config";
import Swal from "sweetalert2";

ChartJS.register(ArcElement, Tooltip, Legend);
export default function PatientAppointmentDetailsPage() {
  const { patient_id } = useParams();

  const [appointments, setAppointments] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const DoctorID = userData?.id;
  const [data, setData] = useState({
    monthly_data: {},
    users: [],
    doctors: [],
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patientDetails, setPatientDetails] = useState(null);

  // useEffect(() => {
  //   if (!userData?.id || userData.role !== "doctor") return;

  //   axios
  //     .get(`${Config.BASE_URL}/api/monthly-spent`, {
  //       params: { doctor_id: userData.id },
  //     })
  //     .then((response) => {
  //       const res = response.data || {};

  //       const monthlyArray = res.monthly_data || [];

  //       // Convert array to object with month as key
  //       const monthMap = {};
  //       monthlyArray.forEach((item) => {
  //         monthMap[item.month] = item;
  //       });

  //       const currentMonthKey = new Date().toISOString().slice(0, 7);

  //       // Get all months >= current month and sort them
  //       const sortedKeys = Object.keys(monthMap)
  //         .filter((m) => m >= currentMonthKey)
  //         .sort();

  //       // Set state
  //       setData({
  //         monthly_data: monthMap,
  //         users: res.users || [],
  //         doctors: res.doctors || [],
  //       });

  //       setPatients(res.users || []);
  //       setAvailableMonths(sortedKeys);

  //       // Set default selected month
  //       setSelectedMonth(sortedKeys[0] || currentMonthKey);
  //     });
  // }, []);

  // ✅ Reusable function
  const fetchMonthlyData = useCallback(async (doctorId) => {
    if (!doctorId) return;

    try {
      const response = await axios.get(`${Config.BASE_URL}/api/monthly-spent`, {
        params: { doctor_id: doctorId },
      });

      const res = response.data || {};
      const monthlyArray = res.monthly_data || [];

      // Convert array → object
      const monthMap = {};
      monthlyArray.forEach((item) => {
        monthMap[item.month] = item;
      });

      const currentMonthKey = new Date().toISOString().slice(0, 7);

      // Filter and sort months
      const sortedKeys = Object.keys(monthMap)
        .filter((m) => m >= currentMonthKey)
        .sort();

      // Update state
      setData({
        monthly_data: monthMap,
        users: res.users || [],
        doctors: res.doctors || [],
      });

      setPatients(res.users || []);
      setAvailableMonths(sortedKeys);
      setSelectedMonth(sortedKeys[0] || currentMonthKey);
    } catch (error) {
      console.error("Error fetching monthly data:", error);
    }
  }, []);

  // ✅ Call once when component loads
  useEffect(() => {
    if (userData?.id && userData.role === "doctor") {
      fetchMonthlyData(userData.id);
    }
  }, [userData, fetchMonthlyData]);

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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const [loading, setLoading] = useState(false);
  const fetchAppointments = async () => {
    const payload = {
      doc_id: DoctorID,
      user_id: patient_id, // make sure DoctorID is defined
    };

    try {
      setLoading(true);
      const res = await axios.get(`${Config.BASE_URL}/api/appointments/index`, {
        params: payload,
      });

      console.log("resof appp:-", res.data);
      console.log("user:-", res.data.appointments[0]?.user);

      if (res.data.success) {
        setAppointments(res.data.appointments);
        setPatientDetails(res.data.appointments[0].user || null);
        // console.log(res.data.appointments, "appo");
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [loadingApproved, setLoadingApproved] = useState(null); // store slot.id instead of true/false
  const [loadingCancel, setLoadingCancel] = useState(null);
  // const [loadingCancel, setLoadingCancel] = useState(false);

  const handleCancel = async (id, slot_id) => {
    const payload = {
      isBook: 2,
      slot_id: slot_id,
    };
    try {
      // setLoadingCancel(true);
      setLoadingCancel(slot_id);
      const res = await axios.patch(
        `${Config.BASE_URL}/api/appointments/${id}/status/new`,
        payload
      );
      if (res.data.success) {
        fetchAppointments();
        toast.success("Appointment canceled successfully!");
      }
    } catch (error) {
      toast.error("Failed to cancel appointment:", error);
    } finally {
      setLoadingCancel(null);
    }
  };

  // const [loadingApproved, setLoadingApproved] = useState(false);

  const handleApprove = async (id, slot_id, availability_slot_id) => {
    const payload = {
      isBook: 1,
      slot_id: slot_id,
    };
    try {
      // setLoadingApproved(true);
      setLoadingApproved(slot_id);
      const res = await axios.patch(
        `${Config.BASE_URL}/api/appointments/${id}/status/new`,
        payload
      );
      if (res.data.success) {
        handleputslotid(Number(availability_slot_id));
        fetchAppointments();
        toast.success("Appointment Approved successfully!");
      }
    } catch (error) {
      toast.error("Failed to Approved appointment:", error);
    } finally {
      setLoadingApproved(null);
    }
  };
  const handleputslotid = async (slot_id) => {
    const payload = {
      type: "booked",
    };
    try {
      const res = await axios.put(
        `${Config.BASE_URL}/api/availability-slots/${DoctorID}/${slot_id}`,
        payload
      );
      if (res.data.success) {
        fetchAppointments();
        toast.success("Appointment Deleted successfully!");
      }
    } catch (error) {
      toast.error("Failed to Deleted appointment:", error);
    }
  };

  const [loadingSlot, setLoadingSlot] = useState(null);
  const handleComplete = async (apptid, slotid) => {
    const result = await Swal.fire({
      title: "Mark as Completed?",
      text: "Are you sure you want to mark this consultation as completed?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, complete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#118a3b",
      cancelButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    setLoadingSlot(slotid); // show loader for this slot

    const payload = { isConsultCompleted: 1, slot_id: slotid };

    try {
      const res = await axios.patch(
        `${Config.BASE_URL}/api/appointments/${apptid}/status/new`,
        payload
      );

      if (res.data.success) {
        await Swal.fire({
          title: "Completed!",
          text: "The consultation has been marked as completed.",
          icon: "success",
          confirmButtonColor: "#118a3b",
        });

        fetchAppointments();
        fetchMonthlyData(userData.id);
        // refresh table
      }
    } catch (error) {
      console.error("Error updating status:", error);
      await Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoadingSlot(null); // remove loader
    }
  };

  return (
    <>
      <Toaster />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 content-area">
          <Navbar />
          <div className=" bgcolor  p-3">
            <h3>Patients</h3>

            <div className="row">
              <div className="col-lg-12">
                <>
                  <div>
                    {patientDetails && (
                      <div className="patient-wrapper">
                        {/* Left Card */}
                        <div className="profile-card">
                          <img
                            src={
                              patientDetails.profile_image
                                ? `${Config.BASE_URL}/${patientDetails.profile_image}`
                                : patientDetails.gender === "Female"
                                ? female
                                : male
                            }
                            className="profile-img2"
                          />
                          <h3 className="profile-name">
                            {" "}
                            {`${patientDetails.title || ""} ${
                              patientDetails.firstname || ""
                            } ${patientDetails.lastname || ""}`}
                          </h3>
                        </div>

                        {/* Right Card */}
                        <div className="details-card">
                          <div className="details-grid">
                            {/* <div className="info-item">
                              <p>Weight</p>
                              <h4>
                                {patientDetails.additional_info?.weight
                                  ? `${patientDetails.additional_info.weight} kg`
                                  : "-"}
                              </h4>
                            </div> */}
                            {/* <div className="info-item">
                              <p>Heart Rate</p>
                              <h4>
                                {patientDetails.additional_info?.heart_rate
                                  ? `${patientDetails.additional_info.heart_rate} BPM`
                                  : "-"}
                              </h4>
                            </div> */}
                            {/* <div className="info-item">
                              <p>Temperature</p>
                              <h4>
                                {" "}
                                {patientDetails.additional_info?.temperature ||
                                  "-"}
                              </h4>
                            </div> */}
                            {/* <div className="info-item">
                              <p>Age</p>
                              <h4>
                                {patientDetails.additional_info?.age || "-"}
                              </h4>
                            </div> */}
                            {/* <div className="info-item">
                              <p>Height</p>
                              <h4>
                                {patientDetails.additional_info?.height
                                  ? `${patientDetails.additional_info.height} cm`
                                  : "-"}
                              </h4>
                            </div> */}
                            {/* <div className="info-item">
                              <p>Glucose</p>
                              <h4>
                                {" "}
                                {patientDetails.additional_info?.glucose || "-"}
                              </h4>
                            </div> */}
                            <div className="info-item">
                              <p>Gender</p>
                              <h4>{patientDetails.gender || "-"}</h4>
                            </div>
                            {/* <div className="info-item">
                              <p>Blood type</p>
                              <h4>
                                {patientDetails.additional_info?.blood_type ||
                                  "-"}
                              </h4>
                            </div> */}
                            <div className="info-item">
                              <p>Nationality</p>
                              <h4>{patientDetails.nationality || "-"}</h4>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <style>
                    {`
                        .patient-wrapper {
                          display: flex;
                          align-items: stretch; /* 👈 makes both cards equal height */
                          gap: 20px;
                          justify-content: center;
                          font-family: "Inter", sans-serif;
                        
                          margin-bottom: 20px;

                        }

                        /* Profile Card (Left) */
                        .profile-card {
                          background: #ffffff;
                          border-radius: 20px;
                          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
                          text-align: center;
                          padding: 30px 20px;
                          width: 260px;
                        }

                        .profile-img2 {
                          width: 120px;
                          height: 120px;
                          border-radius: 50%;
                          object-fit: cover;
                          margin-bottom: 15px;
                        }

                        .profile-name {
                          font-size: 18px;
                          font-weight: 600;
                          color: #333;
                          margin: 0;
                        }

                        .profile-time {
                          font-size: 14px;
                          color: #777;
                          margin-top: 6px;
                        }

                        /* Details Card (Right) */
                        .details-card {
                          background: #ffffff;
                          border-radius: 20px;
                          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
                          padding: 25px;
                          width: 600px;
                        }

                        .details-grid {
                          display: grid;
                          grid-template-columns: repeat(4, 1fr);
                          gap: 15px;
                        }

                        .info-item {
                          background: rgba(224, 234, 243, 0.4);;
                          border-radius: 10px;
                          padding: 12px;
                        }

                        .info-item p {
                          font-size: 13px;
                          color: #8a8a8a;
                          margin-bottom: 4px;
                        }

                        .info-item h4 {
                          font-size: 15px;
                          font-weight: 600;
                          color: #333;
                        }

                        @media (max-width: 768px) {
                          .patient-wrapper {
                            flex-direction: column;
                            align-items: center;
                          }

                          .details-card {
                            width: 90%;
                          }

                          .details-grid {
                            grid-template-columns: repeat(2, 1fr);
                          }
                        }

                        `}
                  </style>
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-active"
                      role="tabpanel"
                    >
                      <div className="table-responsive">
                        <table className="table table-striped custom-table approvedtable">
                          <thead>
                            <tr>
                              <th>Date/Time</th>
                              <th>Status</th>
                              <th>Amount</th>
                              <th>Follow-up</th>
                              <th>Consultation</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan={7} className="text-center">
                                  <Box
                                    sx={{
                                      display: "flex",
                                      justifyContent: "center",
                                      py: 2,
                                    }}
                                  >
                                    <CircularProgress />
                                  </Box>
                                </td>
                              </tr>
                            ) : appointments.length > 0 ? (
                              appointments.map((appt) =>
                                appt.slots
                                  .filter(
                                    (slot) =>
                                      slot.isBook == 0 || slot.isBook == 1
                                  ) // ✅ merge new + approved
                                  .map((slot, index) => (
                                    <tr key={`${appt.temp_id}-${index}`}>
                                      <td>
                                        {new Date(slot.date).toLocaleDateString(
                                          "en-GB",
                                          {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                          }
                                        )}{" "}
                                        {formatTime(slot.time)}
                                      </td>
                                      <td>
                                        <span
                                          className={`status ${
                                            slot.isBook === 0
                                              ? "pending"
                                              : slot.isBook === 1 &&
                                                slot.isConsultCompleted === 0
                                              ? "confirmed"
                                              : slot.isBook === 1 &&
                                                slot.isConsultCompleted === 1
                                              ? "completed"
                                              : slot.isBook === 2
                                              ? "cancelled"
                                              : ""
                                          }`}
                                        >
                                          {slot.isBook === 0
                                            ? "Pending"
                                            : slot.isBook === 1 &&
                                              slot.isConsultCompleted === 0
                                            ? "Approved"
                                            : slot.isBook === 1 &&
                                              slot.isConsultCompleted === 1
                                            ? "Completed"
                                            : slot.isBook === 2
                                            ? "Cancelled"
                                            : ""}
                                        </span>
                                      </td>

                                      <td>£{slot.fees}</td>
                                      <td>
                                        {slot.isNextweek === 1 ? "Yes" : "No"}
                                      </td>
                                      <td>
                                        {appt.type === "virtual" &&
                                          slot.isBook == 1 &&
                                          slot.isConsultCompleted == 0 && (
                                            <>
                                              <a
                                                href={`/admin/videocalldoctor/${appt?.id}/${slot?.id}/${userData?.id}/${patient_id}/${userData.firstname}${userData.lastname}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                // href="/admin/patients"
                                                className="text-decoration-none text-dark"
                                              >
                                                <button className="btn btn-status btn-start">
                                                  <i className="fas fa-video" />
                                                  Start Now
                                                </button>
                                              </a>
                                              &nbsp;
                                            </>
                                          )}

                                        {appt.type === "in-person" &&
                                          slot.isBook == 1 &&
                                          slot.isConsultCompleted == 0 && (
                                            <>
                                              <button className="btn btn-status btn-visit">
                                                <i className="fas fa-hospital" />
                                                Visit Clinic
                                              </button>
                                              &nbsp;
                                            </>
                                          )}

                                        {/* {(appt.type === "virtual" ||
                                          appt.type === "in-person") &&
                                          slot.isBook == 1 &&
                                          slot.isConsultCompleted == 1 && (
                                            <>
                                              <button className="btn btn-status btn-completed">
                                                <i className="fas fa-video" />{" "}
                                                Completed
                                              </button>
                                            </>
                                          )} */}
                                        {appt.type === "virtual" &&
                                          slot.isBook == 1 &&
                                          slot.isConsultCompleted == 1 && (
                                            <button className="btn btn-status btn-completed">
                                              <i className="fas fa-video" />{" "}
                                              Completed
                                            </button>
                                          )}

                                        {appt.type === "in-person" &&
                                          slot.isBook == 1 &&
                                          slot.isConsultCompleted == 1 && (
                                            <button className="btn btn-status btn-completed">
                                              <i className="fas fa-hospital" />{" "}
                                              Completed
                                            </button>
                                          )}
                                      </td>
                                      {/* Action */}
                                      <td
                                        data-label="Action"
                                        className="action-buttons"
                                      >
                                        <button
                                          className="yes"
                                          onClick={() =>
                                            handleComplete(appt.id, slot.id)
                                          }
                                          disabled={
                                            loadingSlot === slot.id ||
                                            slot.isConsultCompleted === 1 ||
                                            slot.isBook === 0
                                          }
                                        >
                                          {loadingSlot === slot.id ? (
                                            <CircularProgress
                                              size={18}
                                              sx={{ color: "white" }}
                                            />
                                          ) : (
                                            "✔"
                                          )}
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                              )
                            ) : (
                              <tr>
                                {/* <td colSpan={7} className="text-center">
                No appointments available.
              </td> */}
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </>
              </div>
              {/* <div className="col-md-4">
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
                                <small>
                                 
                                  {user.mobile_number}
                                </small>
                              </div>

                            
                              <div className="col-lg-3 text-end ms-auto">
                                <p className="mb-0 fw-bold"></p>
                              </div>
                            </div>
                          </div>
                        ))
                    :
                      Array.from({ length: 5 }).map((_, index) => (
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
            <br />
            <br />
            <h6>Copyright © 2025 Yodoc UK All Rights Reserved.</h6>
            {/* <br/> */}
            {/* <br/> */}
          </div>
        </div>
      </div>

      <style>
        {`

       .status {
  font-weight: 500;
  padding: 5px 12px;
  border-radius: 20px;
  display: inline-block;
}
.status.pending {
  background: #ffeecb;
  color: #b47b00;
}
.status.confirmed {
  background: #dfe7ff;
  color: #0037b3;
}
.status.completed {
  background: #c8f3d8;
  color: #138f43;
}
.status.cancelled {
  background: #ffd7da;
  color: #d12d3a;
}

        button.yes {
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
button.yes {
  background: #e6f8ec;
  color: #118a3b;
}

button.yes:hover {
  background: #00ff66ff;
  color: white;
  transform: scale(1.05);
}
        .approvedtable tbody tr td:first-child {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.approvedtable tbody tr td:last-child {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
        
@media (min-width: 900px) and (max-width: 1370px) {
  .approvedtable,
  .approvedtable thead th,
  .approvedtable tbody td,
  .approvedtable button,
  .approvedtable .btn {
    font-size: 14px !important;
    padding: 8px 10px; /* reduce cell padding */x
  }

  .approvedtable .avatar {
    width: 25px;
    height: 25px;
  }

  .approvedtable .btn {
    font-size: 11px !important;
    padding: 5px 6px;
  }
}


    .nav-pills .nav-link {
      border-radius: 10px;
      padding: 10px 25px;
      font-weight: 600;
      color: #000;
      // background: #f1f1f1;
      margin-right: 10px;
    }

    .nav-pills .nav-link.active {
      background-color: #4c6be9;
      color: white;
    }

    .custom-table {
      background-color: white;
      border-radius: 12px;
      overflow: hidden;
      // box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
    }

    .custom-table thead {
      
      font-weight: 600;
    }

    .custom-table td,
    .custom-table th {
      vertical-align: middle;
      padding: 15px;
    }

    .btn-status {
      font-size: 14px;
      font-weight: 600;
      border-radius: 20px;
      padding: 5px 15px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .btn-pending {
      background-color: #9BB8D2;
      color: #333;
      cursor: not-allowed;
    }

    .btn-start {
      background-color: #4c6be9;
      color: white;
    }

    .btn-completed {
     background-color: rgba(229, 229, 229, 0.4);
    color: #9BB8D2;
    }

    

    .row-canceled {
      background-color: #ffeaea;
    }

    .history-available {
      color: white;
      font-weight: 600;
    }

    .history-new {
      color: red;
      font-weight: 600;
    }

    .action-icons i {
      font-size: 18px;
      margin: 0 5px;
      cursor: pointer;
    }

    .action-icons .fa-check-circle {
      color: #3ed16f;
    }

    .action-icons .fa-times-circle {
      color: #f25b5b;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 10px;
    }

    .d-flex.align-items-center {
      display: flex;
      align-items: center;
    }

.custom-table thead th {
  background-color: transparent !important;
  font-size: 16px;
  font-weight: 600;
  color: #3a3a3a;
  border-bottom: none;
}

.approved-row {
  background-color: #f1faf4 !important;
  border-radius: 20px;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
}

.approved-row td {
  vertical-align: middle;
  border: none;
  padding: 20px;
}

/* Circular doctor image */
.doctor-img {
  // width: 40px;
  // height: 40px;
  object-fit: cover;
}

/* Join Now Button */
.btn-join {
  background-color: #407bff;
  color: white;
  border-radius: 50px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  font-weight: 500;
  border: 2px solid #52f4c1;
  // box-shadow: 0px 0px 5px rgba(82, 244, 193, 0.4);
  transition: all 0.3s ease;
}

.btn-join i {
  font-size: 14px;
}

.btn-join:hover {
  background-color: #2f68e1;
}

/* Table general transparency */
table {
  background-color: transparent !important;
  border-collapse: separate;
  border-spacing: 0 2px;
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










.custom-card {
  border-radius: 15px;
  background-color: #ffffff;
  border: none;
  transition: all 0.3s ease-in-out;
}

.custom-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-card .card-title {
  // font-size: 16px;
  font-weight: 500;
  margin-bottom: 0;
}

.icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}





        .doctor-img{
         display: block;
  width: 100%;
        }
            .dashboard-first-bg{
            background-color: #9CF8FF;
            border-radius: 20px;
            }
            .bgcolor{
                background-color: #F7F9FC;
                // height: 100vh;
            }
.sidebar {
  min-height: 100vh;
  width: 289px;
  position: relative;
  z-index: 1000;
}

@media (max-width: 768px) {
  #sidebar {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 60%;
    z-index: 1050;
    background-color: #F7F9FC;
    transition: all 0.3s ease;
  }
}

.content-area {
  width: 100%;
}
`}
      </style>
    </>
  );
}
