import React, { useEffect, useState } from "react";

import doctor from "../../../assets/admin/Frame (1).png";
import cardicon from "../../../assets/admin/cardicon.png";
import icon from "../../../assets/admin/elements.png";
import icon1 from "../../../assets/admin/Livello_5.png";
import imageone from "../../../assets/admin/Group 1324.png";
import imagetwo from "../../../assets/admin/Rectangle 2388.png";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import imagetree from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import SidebarPatient from "../sidebarpatient/SidebarPatient";
import NavbarPatient from "../sidebarpatient/NavbarPatient";
import Config from "../../../config";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment/moment";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
ChartJS.register(ArcElement, Tooltip, Legend);
const DashboardPatient = () => {
  const navigate = useNavigate();

  const [value, onChange] = useState(new Date());
  const userData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await axios.get(
          `${Config.BASE_URL}/api/profile/${userData?.id}`
        );
        const profile = res.data;
        // console.log("profile:-", profile);

        if (profile?.role !== "patient") {
          localStorage.clear();
          navigate("/", { replace: true }); // replace prevents back navigation
        } else if (profile?.step !== "5" && profile?.isResidence === 1) {
          navigate("/patient-information", { replace: true });
        } else if (profile?.step !== "3" && profile?.isResidence === 0) {
          navigate("/patient-information", { replace: true });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        localStorage.clear();
        navigate("/", { replace: true });
      }
    };

    checkProfile();
  }, [userData, navigate]);

  const patientID = userData?.id;
  const [additionalInfo, setAdditionalInfo] = useState({});
  console.log(userData);

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

  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [upcomingcount, setUpComingCount] = useState(0);

  useEffect(() => {
    fetchAppointments();
    fetchReports();
  }, []);

  const fetchAdditionalInfo = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/profile/${userData.id}`
      );

      const data = response.data;
      console.log(data, "responseresponse");

      // Set to state (optional if you want to display it)
      setAdditionalInfo(data);
      // firstname: data.firstname || "",
      //         lastname: data.lastname || "",
      //         mobile_number: data.mobile_number || "",
      //         email: data.email || "",
      //         address: data.address || "",
      //         profile_image: data.profile_image || "",
      //         gender: data.gender || "",
      //         country: data.country || "",
      //         postcode: data.postcode || "",
      //         nationality: data.nationality || "",
      //         date_of_birth: data.date_of_birth || "",
      // Check if any required field is missing/null/empty
      if (
        !data ||
        !data.firstname ||
        !data.lastname ||
        !data.mobile_number ||
        !data.email ||
        !data.profile_image ||
        !data.gender ||
        !data.country ||
        !data.postcode ||
        !data.nationality ||
        !data.date_of_birth
      ) {
        // Redirect to profile page
        // navigate("/patient/profile");
      }
    } catch (error) {
      console.error("Error fetching additional info", error);
      // Redirect on error as fallback
      // navigate("/patient/profile");
    }
  };

  // useEffect(() => {
  //   if (userData?.id) {
  //     fetchAdditionalInfo();
  //   }
  // }, [userData]);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${Config.BASE_URL}/api/appointments`, {
        params: { user_id: patientID },
      });
      if (res.data.success) setAppointments(res.data.appointments);

      const today = new Date();

      const upcom = res.data.appointments;

      // Extract all slots with valid date + time
      // const validDates = upcom
      //   .flatMap((item) => item.slots) // get all slots
      //   .filter((slot) => slot.date && slot.time) // keep only slots with date + time
      //   .map((slot) => new Date(`${slot.date}T${slot.time}`)); // combine date+time

      // // Filter upcoming slots (>= today)
      // const upcomingDates = validDates.filter((date) => date >= today);

      // console.log(upcomingDates, "upcomingDates.length");

      // setUpComingCount(upcomingDates.length);

      const validDates = upcom
        .flatMap((item) => item.slots) // get all slots
        .filter(
          (slot) =>
            slot.date &&
            slot.time &&
            slot.isBook === 1 && // only approved slots
            slot.isConsultCompleted !== 1 // not completed
        )
        .map((slot) => new Date(`${slot.date}T${slot.time}`)); // combine date+time

      // Filter upcoming slots (>= today)
      const upcomingDates = validDates.filter((date) => date >= today);

      console.log(upcomingDates, "upcomingDates.length");

      setUpComingCount(upcomingDates.length);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(appointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAppointments = appointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };
  useEffect(() => {
    if (!userData?.id || userData.role !== "patient") return;

    axios
      .get(`${Config.BASE_URL}/api/completed-count`, {
        params: { user_id: userData.id },
      })

      .then((res) => {
        if (res.data.success) {
          setCompletedCount(res.data.count);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch completed count:", err);
      });
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/reports`);
      if (res.data.success) setReports(res.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    if (userData?.id) {
      fetchTotalOrders();
    }
  });
  const fetchTotalOrders = async () => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/orders/total/${userData?.id}`
      );
      if (res.data.status) setTotalOrders(res.data?.total_amount);
      console.log("res of order:-", res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <>
      <div className="d-flex">
        <SidebarPatient />
        <div className="flex-grow-1 content-area">
          <NavbarPatient />
          <div className=" bgcolor  p-3">
            <h3>Dashboard </h3>
            <div className="row">
              <div className="col-lg-8">
                <div className="row d-flex align-items-stretch">
                  <div className="col-lg-7 mb-4 d-flex">
                    <div className="dashboard-first-bg">
                      <div className="row">
                        <div className="col-md-7 p-4">
                          {/* <h6 className="fs-12">Welcome to your Dashboard</h6> */}
                          <p className="fs-12">
                            {/*Welcome to your health dashboard!Easily manage your
                            appointments, consult with doctors, access
                            prescriptions, and stay in control of your
                            health—all in one place.*/}
                            Welcome to Yodoc. We are here to make it easy for
                            you to manage your appointments and gain quicker
                            access to doctors of your preference
                          </p>
                          {/* <button className="btnbtnprimary">
                            Update Medical History
                          </button> */}
                        </div>

                        <div className="col-md-5 mt-5 ">
                          <img src={doctor} className="mt-5 doctorimg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 d-flex">
                    {/* <div className="bg-white  p-3 shadow-sm calenderHeight">
                      <h6 className="mb-3 text-muted">Your Available slots</h6>
                      <Calendar
                        onChange={onChange}
                        value={value}
                        className="w-100 border-0"
                      />
                    </div> */}
                    <div className=" mb-4 d-flex">
                      <div className="bgprimary text-white p-3 shadow-sm w-100 h-100">
                        <div className="row">
                          {/* <div className="col-md-6">
                            <h6 className="mb-3 text-white">
                              Upcoming Appointment
                            </h6>
                          </div> */}
                          <div className="col-md-6">
                            <h1 className="display-4 mx-3">{upcomingcount}</h1>
                          </div>
                        </div>

                        {appointments
                          .flatMap((appt, index) =>
                            appt.slots
                              .filter(
                                (slot) =>
                                  slot.isBook === 1 &&
                                  slot.isConsultCompleted === 0 &&
                                  moment(slot.date).isSameOrAfter(
                                    moment(),
                                    "day"
                                  )
                              )
                              .slice(0, 1)
                              .map((slot, slotIndex) => {
                                const isToday =
                                  moment(slot.date).format("YYYY-MM-DD") ===
                                  moment().format("YYYY-MM-DD");
                                const formattedTime = moment(
                                  slot.time,
                                  "HH:mm:ss"
                                ).format("hh:mm A");

                                return (
                                  <div
                                    className="bg-white text-black p-3 rounded"
                                    key={`${index}-${slotIndex}`}
                                  >
                                    <h6 className="fs-12">
                                      {appt.doctor?.firstname}{" "}
                                      {appt.doctor?.lastname}
                                    </h6>
                                    <small className="fs-13">
                                      <img
                                        src={icon1}
                                        className="img-fluid mx-1"
                                        alt="icon"
                                      />
                                      {isToday
                                        ? `Today ${formattedTime}`
                                        : `${moment(slot.date).format(
                                            "MMM DD"
                                          )} ${formattedTime}`}
                                    </small>
                                  </div>
                                );
                              })
                          )
                          .slice(0, 1)}

                        {appointments
                          .flatMap((appt) => appt.slots)
                          .filter(
                            (slot) =>
                              slot.isBook === 1 &&
                              slot.isConsultCompleted === 0 &&
                              moment(slot.date).isSameOrAfter(moment(), "day")
                          ).length === 0 && (
                          <h6 style={{ color: "#fff", fontSize: "20px" }}>
                            There are no upcoming appointments
                          </h6>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row col-lg-4">
                <div className="mb-4 d-flex">
                  <div className="card custom-card shadow-sm w-100 border-0 rounded-4">
                    <div className="card-body py-4 px-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title text-secondary mb-0">
                          Total Consultations Completed
                        </h5>
                        <img
                          src={cardicon}
                          alt="Consult Icon"
                          className="img-fluid icon-img"
                          style={{ width: "50px", height: "50px" }}
                        />
                      </div>

                      <div className="mt-4">
                        <h4 className="fw-semibold text-primary mb-2">
                          Total:{" "}
                          <span className="text-dark">{completedCount}</span>
                        </h4>
                        <h4 className="fw-semibold text-success">
                          Total Amount:{" "}
                          <span className="text-dark">£{totalOrders}</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12 mb-4 mt-4">
              <div className="appointments-table ">
                <div className="d-flex align-item-center justify-content-between">
                  <h3 className="mb-4 ">Current Appointments</h3>
                  <Link to="/doctornewpage">
                    <button className="btn btn-primary">
                      Create Appointment
                    </button>
                  </Link>
                </div>

                <div className="table-responsive p-3">
                  <table className="table align-middle custom-table approvedtable">
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Date/Time</th>
                        <th>Status</th>
                        <th>Amount</th>
                        {/* <th>Medical Reports</th> */}
                        <th>Modes</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center">
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
                      ) : currentAppointments.length > 0 ? (
                        currentAppointments.map((appt) =>
                          appt.slots
                            // only unbooked slots
                            .map((slot, index) => {
                              // Parse reports for this doctor
                              const reportList = reports.filter((rep) => {
                                try {
                                  if (rep.doctor_id) {
                                    const ids = JSON.parse(rep.doctor_id);
                                    return (
                                      Array.isArray(ids) &&
                                      ids.includes(Number(appt.doc_id))
                                    );
                                  }
                                } catch (e) {
                                  return false;
                                }
                                return false;
                              });

                              const isBooked = slot?.isBook === 1;
                              const isConsultCompleted =
                                slot?.isConsultCompleted === 1;
                              const isCancelled = slot?.isBook === 2;

                              return (
                                <tr
                                  key={`${appt.temp_id}`}
                                  className={
                                    isBooked ? "approved-row" : "pending-row"
                                  }
                                >
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <img
                                        // src={`${Config.BASE_URL}/${appt.doctor?.profile_image}`}
                                        src={
                                          appt.doctor?.profile_image
                                            ? `${Config.BASE_URL}/${appt.doctor.profile_image}`
                                            : appt.doctor?.gender === "Female"
                                            ? female
                                            : male
                                        }
                                        className="rounded-circle me-2 doctor-img"
                                        alt="doc"
                                        style={{
                                          width: "40px",
                                          height: "40px",
                                        }}
                                      />
                                      {appt.doctor?.firstname}{" "}
                                      {appt.doctor?.lastname}
                                    </div>
                                  </td>
                                  <td>
                                    {slot.date} {slot.time}
                                  </td>
                                  <td>
                                    {isBooked
                                      ? "Approved"
                                      : isCancelled
                                      ? "Cancelled"
                                      : isConsultCompleted
                                      ? "Completed"
                                      : "Pending"}
                                  </td>
                                  <td>£{slot.fees}</td>
                                  <td>
                                    {appt.type
                                      ? appt.type.charAt(0).toUpperCase() +
                                        appt.type.slice(1)
                                      : ""}
                                  </td>

                                  {/* <td>
                                    <i className="fas fa-upload me-2"></i>
                                    <i className="fas fa-trash me-2"></i>
                                    <i className="fas fa-download"></i>
                                  </td> */}
                                  <td>
                                    {isBooked && !isConsultCompleted && (
                                      // <button className="btn btn-join btn-sm btn-success">
                                      //   <i className="fas fa-video me-1"></i>{" "}
                                      //   Join Now
                                      // </button>
                                      <a
                                        href={`/patient/videocallpatient/${
                                          appt?.id
                                        }/${slot?.id}/${userData?.id}/${
                                          userData.firstname + userData.lastname
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
                                      // <button
                                      //   className="btn btn-join btn-sm btn-success"
                                      //   onClick={() =>
                                      //     navigate("/patient/appointments")
                                      //   }
                                      // >
                                      //   <i className="fas fa-eye me-1"></i>
                                      //   View
                                      // </button>
                                    )}

                                    {isConsultCompleted && (
                                      <button
                                        className="btn btn-sm"
                                        style={{
                                          backgroundColor: "#70EFCD",
                                          borderColor: "#70EFCD",
                                          color: "#000",
                                          fontSize: "14px",
                                          fontWeight: 600,
                                          borderRadius: "30px",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          padding: "8px 10px",
                                          gap: "5px",
                                        }}
                                        disabled
                                      >
                                        <i className="fas fa-video"></i>{" "}
                                        Completed
                                      </button>
                                    )}
                                    {isCancelled && (
                                      <button
                                        className="btn btn-sm"
                                        style={{
                                          backgroundColor: "#f86161ff",
                                          borderColor: "#f86161ff",
                                          color: "#000",
                                          fontSize: "14px",
                                          fontWeight: 600,
                                          borderRadius: "30px",
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: "5px",
                                          padding: "8px 10px",
                                        }}
                                        disabled
                                      >
                                        <i className="fas fa-video"></i>{" "}
                                        Cancelled
                                      </button>
                                    )}

                                    {!isBooked &&
                                      !isConsultCompleted &&
                                      !isCancelled && (
                                        <button
                                          className="btn btn-secondary rounded-pill btn-sm"
                                          disabled
                                          style={{
                                            padding: "8px 10px",
                                          }}
                                        >
                                          Waiting Approval
                                        </button>
                                      )}
                                  </td>
                                </tr>
                              );
                            })
                        )
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">
                            No appointments available.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* 🔹 Pagination controls */}
                {!loading && totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center mt-3">
                    <button
                      className="btn btn-outline-secondary btn-sm me-2"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="fw-bold">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="btn btn-outline-secondary btn-sm ms-2"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`

 .btnbtnprimary{
  background-color: #6F8DFF;
  color:#fff;
  padding:8px 15px;
  border-radius: 20px;
  border:2px solid #6F8DFF;
}

.btnbtnprimary:hover{
  background-color: #5879feff;
  
}

/* 15 inch screens (1366px - 1440px) */
@media (min-width: 1366px) and (max-width: 1440px) {
  .dashboardimage {
    position: absolute;
    bottom: 0;           /* hamesha bottom pe chipka */
    left: 50%;
    transform: translateX(-50%);
    max-width: 100%;
    height: auto;
  }
        .fs-12 {
  font-size: 13px !important;  
}
}

/* 16 inch screens (1536px - 1600px) */
@media (min-width: 1536px) and (max-width: 1600px) {
  // .col-md-4 {
  //   position: relative;  /* parent ko relative banaya */
  // }

  .dashboardimage {
    position: absolute;
    bottom: 0;           /* hamesha bottom pe chipka */
    left: 50%;
    transform: translateX(-50%);
    max-width: 100%;
    height: auto;
  }
       .fs-12 {
  font-size: 14px !important;  
}
}

.doctorimg {
  max-width: 100%;
  height: auto;      /* default responsive image */
  display: block;
}

@media (min-width: 900px) and (max-width: 1370px) {
  .doctorimg {
    width: 100%;
    height: 71%;       /* stretch to column height */
    object-fit: cover;  /* keep proportion & crop if needed */
    margin: 0;  
    margin-left: -10px;        /* remove extra space */
  }
}


@media (min-width: 900px) and (max-width: 1370px) {
 

      .fs-12 {
  font-size: 12px !important;  
}
.fs-13{
  font-size: 9px !important;  

}
  .btnbtnprimary {
    background-color: #6F8DFF;
    color: #fff;
    padding: 6px 10px;
    border-radius: 20px;
    border: 2px solid #6F8DFF;
  font-size: 12px !important;  

}
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

        .calenderHeight{
  height: 450px;
  border-radius: 20px;


}
  
    .bgprimary{
  background-color: #4C6BE9;
  border-radius: 20px;
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
  border-spacing: 0 15px;
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
  border-radius: 20px;
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
            background-color: #7bffdd;
            border-radius: 20px;
            }
            .btnbtn-primary{
            background-color: #6F8DFF;
            border-radius: 20px;
            border:2px solid #6F8DFF;
            color: white;
            padding: 5px 10px;
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

export default DashboardPatient;
