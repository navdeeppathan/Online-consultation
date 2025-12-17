import React, { useEffect, useState } from "react";

import "react-calendar/dist/Calendar.css";
import SidebarPatient from "../sidebarpatient/SidebarPatient";
import NavbarPatient from "../sidebarpatient/NavbarPatient";
import imageone from "../../../assets/admin/Group 1324.png";
import imagetwo from "../../../assets/admin/Rectangle 2388.png";
import imagetree from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import Config from "../../../config";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

ChartJS.register(ArcElement, Tooltip, Legend);
const MyAppoinmentPatient = () => {
  const navigate = useNavigate();
  const [additionalInfo, setAdditionalInfo] = useState({});

  const [appointments, setAppointments] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const patientID = userData?.id;

  useEffect(() => {
    fetchAppointments();
  }, []);

  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    const payload = {
      user_id: patientID,
    };
    try {
      setLoading(true);

      const res = await axios.get(`${Config.BASE_URL}/api/appointments/index`, {
        params: payload,
      });
      if (res.data.success) {
        setAppointments(res.data.appointments);
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

  const [loadingCancel, setLoadingCancel] = useState(false);

  const handleCancel = async (id, slot_id) => {
    const payload = {
      isBook: 2,
      slot_id: slot_id,
    };
    try {
      setLoadingCancel(true);
      const res = await axios.patch(
        `${Config.BASE_URL}/api/appointments/${id}/status/new`,
        payload
      );
      if (res.data.success) {
        fetchAppointments();
        toast.success("slot canceled successfully!");
      }
    } catch (error) {
      toast.error("Failed to cancel appointment:", error);
    } finally {
      setLoadingCancel(false);
    }
  };

  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleDelete = async (apptid, slotid) => {
    const payload = {
      slot_id: slotid,
    };

    try {
      setLoadingDelete(true);
      const res = await axios.delete(
        `${Config.BASE_URL}/api/appointments/slot/${apptid}`,
        { data: payload } // 👈 send payload here
      );

      if (res.data.success) {
        fetchAppointments();
        toast.success("Slot deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete appointment");
    } finally {
      setLoadingDelete(false);
    }
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
  //   const fetchAdditionalInfo = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${Config.BASE_URL}/api/profile/${userData.id}`
  //       );

  //       const data = response.data;
  //       console.log(data, "responseresponse");

  //       // Set to state (optional if you want to display it)
  //       setAdditionalInfo(data);
  // // firstname: data.firstname || "",
  // //         lastname: data.lastname || "",
  // //         mobile_number: data.mobile_number || "",
  // //         email: data.email || "",
  // //         address: data.address || "",
  // //         profile_image: data.profile_image || "",
  // //         gender: data.gender || "",
  // //         country: data.country || "",
  // //         postcode: data.postcode || "",
  // //         nationality: data.nationality || "",
  // //         date_of_birth: data.date_of_birth || "",
  //       // Check if any required field is missing/null/empty
  //       if (
  //         !data ||
  //         !data.firstname ||
  //         !data.lastname ||
  //         !data.mobile_number ||
  //         !data.email ||
  //         !data.profile_image ||
  //         !data.gender ||
  //         !data.country ||
  //         !data.postcode ||
  //         !data.nationality ||
  //         !data.date_of_birth

  //       ) {
  //         // Redirect to profile page
  //         navigate("/patient/profile");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching additional info", error);
  //       // Redirect on error as fallback
  //       // navigate("/patient/profile");
  //     }
  //   };

  useEffect(() => {
    if (userData?.id) {
      // fetchAdditionalInfo();
    }
  }, [userData]);

  return (
    <>
      <Toaster />
      <div className="d-flex">
        <SidebarPatient />
        <div className="flex-grow-1 content-area">
          <NavbarPatient />
          <div className=" bgcolor  p-3">
            <h3>My Appointments</h3>
            <div className="row">
              <div className="col-lg-8">
                <>
                  {/* <ul
                    className="nav nav-pills mb-4"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        id="pills-new-tab"
                        data-toggle="pill"
                        href="#pills-new"
                        role="tab"
                      >
                        New
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="pills-approved-tab"
                        data-toggle="pill"
                        href="#pills-approved"
                        role="tab"
                      >
                        Approved
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="pills-canceled-tab"
                        data-toggle="pill"
                        href="#pills-canceled"
                        role="tab"
                      >
                        Canceled
                      </a>
                    </li>
                    <li className="nav-item ml-auto">
                      <Link to="/alldoctor">
                        <button className="btn btn-primary">
                          Create Appointment
                        </button>
                      </Link>
                    </li>
                  </ul> */}
                  <ul
                    className="nav nav-pills mb-4"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        id="pills-all-tab"
                        data-toggle="pill"
                        href="#pills-all"
                        role="tab"
                      >
                        All
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="pills-canceled-tab"
                        data-toggle="pill"
                        href="#pills-canceled"
                        role="tab"
                      >
                        Canceled
                      </a>
                    </li>
                    <li className="nav-item ml-auto">
                      <Link to="/doctornewpage">
                        <button className="btn btn-primary">
                          Create Appointment
                        </button>
                      </Link>
                    </li>
                  </ul>
                  <div className="tab-content" id="pills-tabContent">
                    {/* New Tab */}

                    <div
                      className="tab-pane fade show active"
                      id="pills-all"
                      role="tabpanel"
                    >
                      <div className="table-responsive">
                        <table className="table table-striped custom-table approvedtable">
                          <thead>
                            <tr>
                              <th>Doctor Name</th>
                              <th>Date/Time</th>
                              <th>Status</th>
                              <th>Amount</th>

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
                                  ) // ✅ merged filter
                                  .map((slot, index) => (
                                    <tr key={`${appt.temp_id}-${slot.id}`}>
                                      <td>
                                        <div
                                          className="d-flex align-items-center"
                                          key={index}
                                        >
                                          <img
                                            src={
                                              appt.doctor?.profile_image
                                                ? `${Config.BASE_URL}/${appt.doctor.profile_image}`
                                                : appt.doctor?.gender ===
                                                  "Female"
                                                ? female
                                                : male
                                            }
                                            className="avatar me-2"
                                            alt="doctor"
                                          />
                                          {appt.doctor?.firstname}{" "}
                                          {appt.doctor?.lastname}
                                        </div>
                                      </td>
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
                                        {slot.isBook == 0
                                          ? "Pending"
                                          : "Approved"}
                                      </td>
                                      <td>£{slot.fees}</td>

                                      <td>
                                        {appt.type === "virtual" &&
                                          slot.isBook == 1 &&
                                          slot.isConsultCompleted == 0 && (
                                            <a
                                              href={`/patient/videocallpatient/${
                                                appt?.id
                                              }/${slot?.id}/${userData?.id}/${
                                                userData.firstname +
                                                userData.lastname
                                              }`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-decoration-none"
                                            >
                                              <button className="btn btn-join btn-sm btn-success">
                                                <i className="fas fa-video me-1"></i>{" "}
                                                Join Now
                                              </button>
                                            </a>
                                          )}

                                        {slot.isBook == 1 &&
                                          slot.isConsultCompleted == 1 && (
                                            <button className="btn btn-status btn-completed">
                                              <i className="fas fa-video" />{" "}
                                              Completed
                                            </button>
                                          )}

                                        {slot.isBook == 0 && (
                                          <button className="btn btn-status btn-pending">
                                            <i className="fas fa-video" /> Join
                                            Now
                                          </button>
                                        )}

                                        {slot.isBook == 0 && (
                                          <i
                                            className="fas ml-2 fa-times-circle text-danger"
                                            onClick={() =>
                                              handleCancel(appt.id, slot.id)
                                            }
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  ))
                              )
                            ) : (
                              <tr></tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {/* Canceled Tab */}
                    <div
                      className="tab-pane fade"
                      id="pills-canceled"
                      role="tabpanel"
                    >
                      <div className="table-responsive">
                        <table className="table table-striped custom-table approvedtable">
                          <thead>
                            <tr>
                              <th>Doctor Name</th>
                              <th>Date/Time</th>
                              <th>Status</th>
                              <th>Amount</th>
                              <th>History</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody className="row-canceled">
                            {loading ? (
                              <tr>
                                <td colSpan={5} className="text-center">
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
                                  .filter((slot) => slot.isBook == 2) // ✅ filter first
                                  .map((slot, index) => (
                                    <tr key={`${appt.temp_id}`}>
                                      <td
                                        style={{ backgroundColor: "#EF7575" }}
                                      >
                                        <div className="d-flex align-items-center">
                                          <img
                                            src={
                                              appt.doctor?.profile_image
                                                ? `${Config.BASE_URL}/${appt.doctor.profile_image}`
                                                : appt.doctor?.gender ===
                                                  "Female"
                                                ? female
                                                : male
                                            }
                                            className="avatar"
                                          />{" "}
                                          {appt.doctor?.firstname}{" "}
                                          {appt.doctor?.lastname}
                                        </div>
                                      </td>
                                      <td
                                        style={{ backgroundColor: "#EF7575" }}
                                      >
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
                                      <td
                                        style={{ backgroundColor: "#EF7575" }}
                                      >
                                        Canceled
                                      </td>
                                      <td
                                        style={{ backgroundColor: "#EF7575" }}
                                      >
                                        £{slot.fees}
                                      </td>
                                      <td
                                        className="history-available"
                                        style={{
                                          color: "#22C55E",
                                          backgroundColor: "#EF7575",
                                        }}
                                      >
                                        Available
                                      </td>
                                      <td
                                        className="action-icons"
                                        style={{ backgroundColor: "#EF7575" }}
                                      >
                                        <i
                                          className="fas fa-times-circle text-danger"
                                          onClick={() =>
                                            handleDelete(appt.id, slot.id)
                                          }
                                        />
                                      </td>
                                    </tr>
                                  ))
                              )
                            ) : (
                              <tr>
                                {/* <td colSpan={5} className="text-center">
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
              <div className="col-lg-4">
                <div className="card spend-summary-card shadow-sm p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="mb-0">All Appointments</h6>
                  </div>

                  <div className="text-center">
                    {/* Doughnut Chart Container */}
                    <div
                      style={{
                        width: 280,
                        height: 280,
                        position: "relative",
                        margin: "0 auto",
                      }}
                    >
                      <Doughnut data={chartData} options={chartOptions} />

                      {/* Centered Text */}
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
                                  {/* {user.email} <br /> */}
                                  {user.mobile_number}
                                </small>
                              </div>

                              {/* Right aligned image */}
                              <div className="col-lg-3 text-end ms-auto">
                                <p className="mb-0 fw-bold">{/* +15 */}</p>
                              </div>
                            </div>
                          </div>
                        ))
                    : // Show 5 placeholders if no patients
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

                            {/* Right aligned image */}
                            <div className="col-lg-3 text-end ms-auto">
                              <p className="mb-0 fw-bold">
                                <img src={imagetwo} alt="two" />
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`

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
    padding: 4px 6px; /* reduce cell padding */
  }

  .approvedtable .avatar {
    width: 25px;
    height: 25px;
  }

  .approvedtable .btn {
    font-size: 11px !important;
    padding: 2px 6px;
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
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
    }

    .custom-table thead {
      background-color: #f8f9fa;
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
      background-color: #70EFCD;
      color: white;
    }

    .row-approved {
      background-color: #e8fbf1;
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
  box-shadow: 0px 0px 5px rgba(82, 244, 193, 0.4);
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
};

export default MyAppoinmentPatient;
