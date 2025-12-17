import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import doctor from "../../../assets/admin/Isolation_Mode (1).png";
import imageone from "../../../assets/admin/Group 1324.png";
import imagetwo from "../../../assets/admin/Rectangle 2388.png";
import imagetree from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import cardicon from "../../../assets/admin/cardicon.png";
import icon from "../../../assets/admin/elements.png";
import icon1 from "../../../assets/admin/Livello_5.png";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Config from "../../../config";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { connect } from "twilio-video";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment/moment";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";

// Register the elements for the Doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);
const Dashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  console.log(userData);
  const [value, onChange] = useState(new Date());
  const [highlightDates, setHighlightDates] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [upcomingcount, setUpComingCount] = useState(0);

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

        console.log("month:-", res);

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
    "In-Person": 0,
    total: 0,
    percentages: {
      video: "0%",
      "In-Person": "0%",
    },
  };

  // const chartData = {
  //   labels: ["Video", "In-Person"],
  //   datasets: [
  //     {
  //       data: [monthly.video, , monthly["In-Person"]],
  //       backgroundColor: ["#407bff", "#70EFCD "],
  //       hoverOffset: 10,
  //     },
  //   ],
  // };

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

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const seenWelcome = localStorage.getItem("seenWelcome");

    if (!seenWelcome) {
      setShowWelcomeModal(true);
      localStorage.setItem("seenWelcome", "true");
    }
  }, []);

  useEffect(() => {
    if (!userData?.id || userData.role !== "doctor") return;

    axios
      .get(`${Config.BASE_URL}/api/completed-count`, {
        params: { doc_id: userData.id },
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

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/availability/${userData.id}`)
      .then((response) => {
        const today = new Date();
        const availabilities = response.data.availabilities;

        const validDates = availabilities
          .filter((item) => item.date)
          .map((item) => new Date(item.date));

        const upcomingDates = validDates.filter((date) => date >= today);

        // setUpComingCount(upcomingDates.length); // ✅ Save count of upcoming dates
        setHighlightDates(validDates);
      })
      .catch((error) => {
        console.error("Error fetching availability:", error);
      });
  }, []);

  const tileClassName = ({ date, view }) => {
    if (
      view === "month" &&
      highlightDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      )
    ) {
      return "highlight";
    }
    return null;
  };

  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchAppointments();
    fetchReports();
  }, []);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const fetchAppointments = async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${Config.BASE_URL}/api/appointments`, {
        params: { doc_id: userData?.id },
      });

      const resupcoming = await axios.get(
        `${Config.BASE_URL}/api/appointments/upcoming/${userData?.id}`
      );

      console.log("resof upcomingappp:-", resupcoming.data);

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

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/reports`);
      if (res.data.success) setReports(res.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Delete this report?")) return;
    try {
      await axios.delete(`${Config.BASE_URL}/api/reports/${reportId}`);
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch (error) {
      console.error("Error deleting report:", error);
    }
  };

  const handleDownloadReport = (report) => {
    const fileUrl = `${Config.BASE_URL}/storage/${report.file_name}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = report.file_name.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Convert string to object

  const [loadingApproved, setLoadingApproved] = useState(null); // store slot.id instead of true/false
  const [loadingCancel, setLoadingCancel] = useState(null);

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
        // handleputslotid(Number(availability_slot_id));
        fetchAppointments();
        toast.success("Appointment Approved successfully!");
      }
    } catch (error) {
      toast.error(
        error.response.data.message ||
          error.response.data.error ||
          "Failed to Approved appointment:"
      );
    } finally {
      setLoadingApproved(null);
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
        `${Config.BASE_URL}/api/orders/doctor-total/${userData?.id}`
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
        <Sidebar />
        <div className="flex-grow-1 content-area">
          <Navbar />
          <div className="bgcolor  p-3">
            <h3>Dashboard </h3>
            <div className="row">
              <div className="col-lg-8">
                <div className="row d-flex align-items-stretch">
                  <div className="col-lg-7 mb-4 d-flex">
                    <div className="dashboard-first-bg">
                      <div className="row">
                        <div className="col-md-8 p-4">
                          {/* <h6 className="fs-12">Welcome to your Dashboard</h6> */}
                          <p className="fs-13">
                            Welcome to your Dashboard! Easily manage
                            appointments, patient interactions, and take control
                            of your schedule, all in one place.
                          </p>
                          <Link
                            to="/admin/profilesetting"
                            className="text-decoration-none text-dark"
                          >
                            <button className="btnbtnprimary">
                              Update your profile
                            </button>
                          </Link>
                        </div>

                        <div className="col-md-4 mt-3">
                          <img
                            src={doctor}
                            className="img-fluid mt-4 dashboardimage"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row"></div>
                  </div>
                  <div className="col-lg-5 d-flex ">
                    <div className="mb-4  d-flex">
                      <div className="bgprimary text-white p-3 shadow-sm w-100 h-100">
                        <div className="row">
                          {/* <div className="col-md-6">
                            <h6 className="mb-3 text-white">
                              Upcoming Appointment
                            </h6>
                          </div> */}
                          <div className="col-md-6">
                            <p className="display-6 mx-3">{upcomingcount}</p>
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
                                    key={`${index}-${slotIndex}`}
                                    className="d-flex align-items-center bg-white text-dark p-2 mb-2 rounded-3 shadow-sm"
                                  >
                                    <img
                                      src={
                                        appt.user?.profile_image
                                          ? `${Config.BASE_URL}/${appt.user.profile_image}`
                                          : appt.user?.gender === "Female"
                                          ? female
                                          : male
                                      }
                                      className="rounded-circle me-3"
                                      style={{
                                        width: "28px",
                                        height: "28px",
                                        objectFit: "cover",
                                      }}
                                      alt="user"
                                    />

                                    <div>
                                      <h6 className="mb-0 fs-12">
                                        {appt.user?.firstname}{" "}
                                        {appt.user?.lastname}
                                      </h6>
                                      <small className="fs-13">
                                        {isToday
                                          ? `Today ${formattedTime}`
                                          : `${moment(slot.date).format(
                                              "MMM DD"
                                            )} ${formattedTime}`}
                                      </small>
                                    </div>
                                  </div>
                                );
                              })
                          )
                          .slice(0, 2)}

                        {appointments
                          .flatMap((appt) => appt.slots)
                          .filter(
                            (slot) =>
                              slot.isBook === 1 &&
                              moment(slot.date).isSameOrAfter(moment(), "day")
                          ).length === 0 && (
                          <h6 style={{ color: "#fff", fontSize: "20px" }}>
                            There are no upcoming appointment
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
            <div className="col-md-12 mb-4 mt-2">
              <div className="appointments-table ">
                <h3 className="mb-1 ">Current Appointments</h3>

                <div className="table-responsive">
                  <table className="table  custom-table approvedtable">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Date/Time</th>
                        <th>Status</th>
                        <th>Amount</th>
                        {/* <th>MedicalReports</th> */}
                        <th>Modes</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
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
                      ) : currentAppointments.length > 0 ? (
                        currentAppointments.map((appt) =>
                          appt.slots.map((slot, index) => {
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
                                // className={apt.isBook === "1"? "approved-row" : "pending-row"}
                                className={
                                  isBooked ? "approved-row" : "pending-row"
                                }
                              >
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img
                                      src={
                                        appt.user?.profile_image
                                          ? `${Config.BASE_URL}/${appt.user.profile_image}`
                                          : appt.user?.gender === "Female"
                                          ? female
                                          : male
                                      }
                                      className="rounded-circle me-2"
                                      alt="doc"
                                      style={{
                                        width: "40px",
                                        height: "40px",
                                      }}
                                    />
                                    {appt.user?.firstname} {appt.user?.lastname}
                                  </div>
                                </td>
                                <td>
                                  {appt.slots[0]?.date} {appt.slots[0]?.time}
                                </td>
                                <td>
                                  {/* <span>
                                      {apt.isBook === "1" ? "Approved" : "Pending"}                                    
                                    </span> */}
                                  <span>
                                    {isBooked
                                      ? "Approved"
                                      : isCancelled
                                      ? "Cancelled"
                                      : "Pending"}
                                  </span>
                                </td>
                                <td>£{appt.slots[0]?.fees}</td>
                                {/* <td>
                                  <i className="fas fa-upload me-2"></i>
                                  <i className="fas fa-trash me-2"></i>
                                  <i className="fas fa-download"></i>
                                </td> */}
                                <td>
                                  {appt.type
                                    ? appt.type.charAt(0).toUpperCase() +
                                      appt.type.slice(1)
                                    : ""}
                                </td>

                                <td>
                                  {/* {apt.isBook === "1" ? (
                                      <button className="btn btn-join btn-sm btn-success">
                                        <i className="fas fa-video me-1"></i>{" "}
                                        Join Now
                                      </button>
                                    ) : (
                                      <button
                                        className="btn btn-secondary btn-sm"
                                        disabled
                                      >
                                        Waiting Approval
                                      </button>
                                    )} */}

                                  {appt.type === "virtual" &&
                                    slot.isBook == 1 &&
                                    slot.isConsultCompleted == 0 && (
                                      <>
                                        <a
                                          href={`/admin/videocalldoctor/${appt?.id}/${slot?.id}/${userData?.id}/${appt?.user_id}/${userData.firstname}${userData.lastname}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          // href="/admin/patients"
                                          className="text-decoration-none text-dark"
                                        >
                                          <button className="btn btn-status btn-start">
                                            <i className="fas fa-video" />
                                            {/* <i className="fas fa-eye me-1"></i> */}
                                            Start Now
                                          </button>
                                        </a>
                                        &nbsp;
                                        <a
                                          // href={`/admin/videocalldoctor/${appt?.id}/${slot?.id}/${userData?.id}/${userData.firstname}${userData.lastname}`}
                                          // target="_blank"
                                          // rel="noopener noreferrer"
                                          href={`/admin/patients-details/${appt?.user?.id}`}
                                          className="text-decoration-none text-dark"
                                        >
                                          <button className="btn btn-status btn-start">
                                            {/* <i className="fas fa-video" />{" "} */}
                                            <i className="fas fa-eye me-1"></i>
                                          </button>
                                        </a>
                                      </>
                                    )}

                                  {(appt.type === "virtual" ||
                                    appt.type === "in-person") &&
                                    slot.isBook == 1 &&
                                    slot.isConsultCompleted == 1 && (
                                      <>
                                        <button className="btn btn-status btn-completed">
                                          <i className="fas fa-video" />{" "}
                                          Completed
                                        </button>

                                        <a
                                          // href={`/admin/videocalldoctor/${appt?.id}/${slot?.id}/${userData?.id}/${userData.firstname}${userData.lastname}`}
                                          // target="_blank"
                                          // rel="noopener noreferrer"
                                          href={`/admin/patients-details/${appt?.user?.id}`}
                                          className="text-decoration-none text-dark"
                                        >
                                          <button className="btn btn-status btn-start">
                                            {/* <i className="fas fa-video" />{" "} */}
                                            <i className="fas fa-eye me-1"></i>
                                          </button>
                                        </a>
                                      </>
                                    )}

                                  {slot.isBook == 0 && (
                                    <div className="d-flex align-items-center gap-2">
                                      <button
                                        onClick={() =>
                                          handleApprove(
                                            appt.id,
                                            slot.id,
                                            slot.availability_slot_id
                                          )
                                        }
                                        disabled={loadingApproved}
                                        className="btn btn-success"
                                      >
                                        {loadingApproved === slot.id ? (
                                          <CircularProgress
                                            size={20}
                                            sx={{ color: "white" }}
                                          />
                                        ) : (
                                          "Accept"
                                        )}
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleCancel(appt.id, slot.id)
                                        }
                                        disabled={loadingCancel}
                                        className=" btn btn-danger"
                                      >
                                        {/* {loadingCancel ? (
                                                                                    <CircularProgress
                                                                                      size={20}
                                                                                      sx={{ color: "white" }}
                                                                                    />
                                                                                  ) : (
                                                                                    "Decline"
                                                                                  )} */}
                                        {loadingCancel === slot.id ? (
                                          <CircularProgress
                                            size={20}
                                            sx={{ color: "white" }}
                                          />
                                        ) : (
                                          "Decline"
                                        )}
                                      </button>
                                    </div>
                                  )}
                                  {/* {isBooked && !isConsultCompleted && (
                                    // <button className="btn btn-join btn-sm btn-success">
                                    //   <i className="fas fa-video me-1"></i>{" "}
                                    //   Start Now
                                    // </button>

                                    // <a
                                    //   href={`/admin/videocalldoctor/${
                                    //     appt?.id
                                    //   }/${slot?.id}/${userData?.id}/${
                                    //     userData.firstname +
                                    //     userData.lastname
                                    //   }`}
                                    //   target="_blank"
                                    //   rel="noopener noreferrer"
                                    //   className="text-decoration-none"
                                    // >
                                    <button
                                      className="btn btn-join btn-sm btn-success"
                                      onClick={() =>
                                        navigate("/admin/patients")
                                      }
                                    >
                                     
                                      <i className="fas fa-eye me-1"></i>
                                      View
                                    </button>
                                    // </a>
                                  )} */}

                                  {/* {isConsultCompleted && (
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
                                      <i className="fas fa-video"></i> Completed
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
                                      <i className="fas fa-video"></i> Cancelled
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
                                    )} */}

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
                                      <i className="fas fa-video"></i> Cancelled
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center">
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
            <h6>Copyright © 2025 Yodoc UK All Rights Reserved.</h6>
          </div>
        </div>
      </div>

      {showWelcomeModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content rounded">
              <div className="modal-header">
                <h5 className="modal-title">Welcome to Yodoc! </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowWelcomeModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Please complete your profile and payment information to begin
                  receiving appointments.
                </p>
              </div>
              <div className="modal-footer d-flex justify-content-between">
                {/* <Link
                  to="/admin/profilesetting"
                  className="btn btn-outline-primary"
                >
                  Complete Profile
                </Link> */}
                <Link to="/admin/payments" className="btn btn-outline-primary">
                  Add Earnings Info
                </Link>
                <Link to="/admin/schedule" className="btn btn-outline-primary">
                  Add Availability
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
  
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
    padding: 8px 10px; 
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



        .upcomimgimage{
        width:28px;
        height:28px;
          border-radius: 50%;

        }
        .btnbtnprimary{
          background-color: #6F8DFF;
          color:#fff;
          padding:8px 15px;
          border-radius: 20px;
          border:2px solid #6F8DFF;
        }

        .btnbtnprimary:hover{
          background-color: #5375ffff;
          
        }

        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }

.modal-content {
  border-radius: 20px;
  padding: 20px;
}

.calenderHeight{
  height: 450px;
  border-radius: 20px;

}

.highlight {
  background: #70EFCD !important;
  border-radius: 50%;
  color: white;
}
.custom-table thead th {
  background-color: transparent !important;
  font-size: 16px;
  font-weight: 600;
  color: #3a3a3a;
  border-bottom: none;
}
 .approvedtable tbody tr td:first-child {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.approvedtable tbody tr td:last-child {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
.approved-row {
  background-color: #f1faf4 !important;
  border-radius: 20px;
  // box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
}

.approved-row td {
  vertical-align: middle;
  border: none;
  padding: 10px;
}

/* Circular doctor image */
.doctor-img {
  // width: 100%;
  // height: auto;
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
.bgprimary{
  background-color: #6F8DFF;
  border-radius: 20px;
}
  .bgprimary:hover{
  background-color: #5778faff;
  
}




        .doctor-img{
         display: block;
  width: 100%;
        }
            .dashboard-first-bg{
            background-color: #7bffdd;
            border-radius: 20px;
  width: 100%;

            }
            .bgcolor{
                background-color: #F7F9FC;
                // height: 100vh;
  width: 100%;
                
            }
.sidebar {
  min-height: 100vh;
  width: 289px;
  position: relative;
  z-index: 1000;
}

@media (max-width: 768px) {
.doctor-img{
         display: block;
  width: 60%;
        }
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

export default Dashboard;
