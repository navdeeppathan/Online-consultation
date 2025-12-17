import React, { useEffect, useRef, useState } from "react";

import "react-calendar/dist/Calendar.css";
import SidebarPatient from "../sidebarpatient/SidebarPatient";
import NavbarPatient from "../sidebarpatient/NavbarPatient";
import imageone from "../../../assets/admin/Group 1324.png";
import imagetwo from "../../../assets/admin/Rectangle 2388.png";
import imagetree from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import axios from "axios";
import Config from "../../../config";
import vendor from "../../../assets/admin/Vector (2).png";
import logo from "../../../assets/images/Vector (3).png";
import html2pdf from "html2pdf.js";

import { FaDownload, FaEye, FaPrint, FaTrash } from "react-icons/fa";
import { Modal } from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
ChartJS.register(ArcElement, Tooltip, Legend);
const PrescriptionsPatient = () => {
  const navigate = useNavigate();
  const [additionalInfo, setAdditionalInfo] = useState({});

  const [drShow, setDrShow] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);

  const [appointments, setAppointments] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const DoctorID = userData?.id;
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Prescription",
    onAfterPrint: () => console.log("Print success"),
  });

  const handleDownloadPDF = () => {
    const element = printRef.current;
    if (!element) return console.error("Print element not found");

    const opt = {
      margin: 0.5,
      filename: "prescription.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const [loading, setLoading] = useState(false);
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/prescriptions/patient/${DoctorID}`
      );

      if (res.data.success) {
        setAppointments(res.data?.data);
        console.log("prescriptions fetched:", res.data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false); // stop loader
    }
  };
  //    const fetchAdditionalInfo = async () => {
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

  const handleDelete = async (patientId) => {
    try {
      const res = await axios.delete(
        `${Config.BASE_URL}/api/delete-prescriptions/${patientId}`
      );
      if (res.data.success) {
        fetchAppointments(); // Refresh data
      }
    } catch (error) {
      console.error("Failed to delete prescription:", error);
    }
  };

  const handleView = async (prescriptionId) => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/get-prescriptions/${prescriptionId}`
      );
      if (res.data.success) {
        setPrescriptionData(res.data.data);
        setDrShow(true);
      }
    } catch (error) {
      console.error("Failed to fetch prescription:", error);
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
  // Convert string to object

  return (
    <>
      <div className="d-flex">
        <SidebarPatient />
        <div className="flex-grow-1 content-area">
          <NavbarPatient />
          <div className=" bgcolor  p-3">
            <h3>Prescriptions</h3>
            <div className="row">
              <div className="col-lg-8">
                {/* <div className="mb-3 d-flex align-items-center gap-2 save-btn-container">
                              <select className="form-control w-auto">
                                <option>Day</option>
                              </select>
                              <select className="form-control w-auto">
                                <option>Month</option>
                              </select>
                              <select className="form-control w-auto">
                                <option>Year</option>
                              </select>
                            </div> */}

                <div className="table-responsive approvedtable">
                  <table className="table approvedtable">
                    <thead>
                      <tr>
                        <th>Doctor Name</th>
                        <th>Date of Birth</th>
                        <th>Prescription</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="text-center">
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
                      ) : appointments.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="text-center">
                            No appointments found.
                          </td>
                        </tr>
                      ) : (
                        appointments.map((appointment) => (
                          <tr
                            key={appointment.id}
                            style={{ background: "#fff" }}
                          >
                            <td className="align-middle">
                              <div className="d-flex align-items-center gap-2">
                                <img
                                  src={
                                    appointment.doctor?.profile_image
                                      ? `${Config.BASE_URL}/${appointment.doctor.profile_image}`
                                      : appointment.doctor?.gender === "Female"
                                      ? female
                                      : male
                                  }
                                  alt="Doctor"
                                  className="rounded-circle"
                                  width={40}
                                  height={40}
                                />
                                <span>
                                  {appointment.doctor?.firstname || "N/A"}{" "}
                                  {appointment.doctor?.lastname || ""}
                                </span>
                              </div>
                            </td>

                            <td className="align-middle">
                              {appointment?.date_of_birth || "N/A"}
                            </td>

                            <td className="align-middle">
                              {appointment.diagnose || "N/A"}
                            </td>

                            <td className="align-middle">
                              <div className="d-flex gap-3">
                                <FaEye
                                  style={{ cursor: "pointer" }}
                                  onClick={() => handleView(appointment.id)}
                                />
                                <FaTrash
                                  style={{ cursor: "pointer", color: "red" }}
                                  onClick={() => handleDelete(appointment.id)}
                                />
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
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
             .approvedtable tbody tr td:first-child {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
}
.approvedtable tbody tr td:last-child {
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
         .border-css {
  border: 2px solid #D9D9D9;
}
  .bordertop{
  border-top: 2px solid #D9D9D9;

  }
  .borderright{
  border-right: 2px solid #D9D9D9;

  }
  .borderb{
  border-bottom: 2px solid #D9D9D9;

  }
  .borderleft{
  border-left: 2px solid #D9D9D9;

  }

.prescription-box {
  background: white;
  border: 1px solid #e8e8e8;
}

.text-primary {
  color: #007bff;
  font-size: 14px;
}

.cardbox {
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

        .save-btn-container {
  display: flex;
  justify-content: flex-end;
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
  // border-collapse: separate;
  border-radius:  2px;
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

      <Modal size="lg" show={drShow} onHide={() => setDrShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prescriptionData && (
            <div className="prescription-box p-4 shadow-sm rounded ">
              <div className="row ">
                <div className="col-10 ">
                  <h5>Medicine Detail</h5>
                </div>
                <div className="col-2 ">
                  <div className="d-flex gap-3">
                    <FaDownload
                      style={{ cursor: "pointer" }}
                      onClick={handleDownloadPDF}
                    />
                  </div>
                </div>
              </div>
              {/* <div ref={printRef}>
                <div className="p-3">
                  <div className="row border-css  ">
                    <div className="col-6 text-primary ">
                      <div className="row   ">
                        <div className="col-12 mt-3">
                          Age: <br />
                          <br />
                          <span className="text-black">
                            {prescriptionData.full_name || "N/A"}
                          </span>
                          <br />
                          <br />
                          <br />
                          <br />
                          D.o.B: <br />
                          <br />
                          <span className="text-black">
                            {prescriptionData.date_of_birth || "N/A"}
                          </span>
                          <br />
                          <br />
                          <br />
                          <br />
                        </div>
                        <div className="col-10 bordertop borderright text-primary">
                          Number of days’ treatment <br />
                          NB: ensure dosage is stated
                          {prescriptionData.items.map((item, idx) => (
                            <div key={idx} className="row mb-2">
                              <div className="col-md-3">
                                <span className="text-black">
                                  {item.medicine_name || "N/A"}
                                </span>
                              </div>
                              <div className="col-md-3">
                                <span className="text-black">
                                  {item.strength || "N/A"}
                                </span>
                              </div>
                              <div className="col-md-3">
                                <span className="text-black">
                                  {item.dosage_instructions || "N/A"}
                                </span>
                              </div>
                              <div className="col-md-3">
                                <span className="text-black">
                                  {item.quantity || "N/A"}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="col-2 bordertop   text-primary"></div>
                      </div>
                    </div>
                    <div className="col-6 text-primary ">
                      <div className="row borderleft  ">
                        <div className="col-12 mt-3">
                          Full Name: <br />
                          <br />
                          <span className="text-black">
                            {prescriptionData.full_name || "N/A"}
                          </span>
                          <br />
                          <br />
                          <br />
                          <br />
                          Address:
                          <br />
                          <br />
                          <span className="text-black">
                            {prescriptionData.address || "N/A"}
                          </span>
                          <br />
                          <br />
                          <br />
                          <br />
                        </div>
                        <div className="col-6 text-primary">
                          NHS Number:
                          <br />
                          <span className="text-black">
                            {prescriptionData.nhs_number || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row ">
                    <div className="col-6 text-primary mt-3">
                      Endorsements
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <br />
                      <img src={vendor} />
                      <br />
                      <br />
                      <br />
                    </div>
                    <div className="col-6  borderright borderleft text-center text-primary">
                      <br />

                      <strong className="text-dark ">HOSPITAL PRESCRIBE</strong>
                    </div>
                  </div>

                  <div className="row  ">
                    <div className="col-6"></div>
                    <div className="col-6 border-css text-primary py-3">
                      Describer’s name and initials in black capitals:{" "}
                      {prescriptionData.created_by || "N/A"}
                    </div>
                  </div>

                  <div className="row  borderb ">
                    <div className="col-6 borderleft bordertop borderright text-primary">
                      <br />
                      Signature of Prescriber:
                      <br />
                      <br />
                      {prescriptionData.digital_signature ? (
                        <img
                          src={`${Config.BASE_URL}/${prescriptionData?.digital_signature}`}
                          alt="Signature"
                          style={{
                            maxWidth: "150px",
                            height: "auto",
                            marginTop: "10px",
                          }}
                        />
                      ) : (
                        "N/A"
                      )}
                      <br />
                      <br />
                    </div>
                    <div className="col-6 text-primary borderright">
                      <br />
                      Date: <br />
                      <br />
                      <br />
                      <span className="text-black">
                        {prescriptionData.created_at
                          ? new Date(
                              prescriptionData?.created_at
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="row  borderb ">
                    <div className="col-12 borderleft  borderright text-primary">
                      <br />
                      <br />

                      <br />
                      <br />
                    </div>
                  </div>
                </div>
              </div> */}
              <HospitalPrescriberForm
                prescription={prescriptionData}
                printRef={printRef}
              />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

const HospitalPrescriberForm = ({ prescription, age, printRef }) => {
  return (
    <div
      ref={printRef}
      style={{
        minHeight: "100vh",
        // backgroundColor: "#f8f9fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "800px",
          backgroundColor: "#eaf6f0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          border: "1px solid #ccc",
        }}
      >
        {/* Top header area */}
        <div style={{ backgroundColor: "#eaf6f0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    width: "30%",
                    verticalAlign: "top",
                    padding: "5px",
                    fontSize: "12px",
                    color: "#004080",
                    fontWeight: "bold",
                    backgroundColor: "#eaf6f0",
                    borderTop: "none",
                    borderRight: "none",
                    borderLeft: "none",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",

                      // alignItems: "",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span className="pb-2">Pharmacy Stamp</span>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <img
                        src={logo}
                        alt="Pharmacy Logo"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    borderTop: "none",
                    width: "15%",
                    verticalAlign: "top",
                    padding: "5px",
                    fontSize: "12px",
                    color: "#004080",
                    backgroundColor: "#eaf6f0",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "bold" }}>Age:</span>{" "}
                    <span style={{ color: "#004080" }}>{age || "N/A"}</span>
                  </div>
                  <br />
                  <br />
                  <div>
                    <span style={{ fontWeight: "bold" }}>D.o.B:</span>{" "}
                    <span style={{ color: "#004080" }}>
                      {prescription?.date_of_birth || "N/A"}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    borderTop: "none",
                    borderRight: "none",
                    borderLeft: "none",

                    width: "55%",
                    verticalAlign: "top",
                    padding: "5px",
                    fontSize: "12px",
                    color: "#004080",
                    backgroundColor: "#eaf6f0",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    Title, Forename, Surname & Address
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#004080",
                      lineHeight: "1.5",
                    }}
                  >
                    <div>{prescription?.full_name || "N/A"}</div>

                    <div>{prescription?.address || "N/A"}</div>
                  </div>

                  <br />
                  <br />
                  <br />
                  <td
                    style={{
                      padding: "5px",
                      fontSize: "12px",
                      color: "#004080",
                      backgroundColor: "#eaf6f0",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}> NHS Number:</span>{" "}
                      <span style={{ color: "#004080" }}>
                        {prescription?.nhs_number || "N/A"}
                      </span>
                    </div>
                  </td>
                </td>
              </tr>

              {/* <tr>
                <td
                  colSpan="2"
                  style={{
                    border: "1px solid #ccc",
                    borderLeft: "none",
                    padding: "5px",
                    fontSize: "11px",
                    color: "#004080",
                    backgroundColor: "#eaf6f0",
                  }}
                >
                  Number of days' treatment <br />
                  N.B. Ensure dose is stated
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>

        {/* Main Body */}
        <div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                flex: "1",
                minHeight: "350px",
                // display: "flex",
                // justifyContent: "center",
                textAlign: "center",
                backgroundColor: "#f3fbf7",
                padding: "10px",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                HOSPITAL PRESCRIBER
              </h2>
              {prescription?.items &&
                prescription.items.length > 0 &&
                prescription.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "15px",
                      padding: "8px",
                      marginBottom: "6px",
                      // border: "1px solid #ccc",
                      // borderRadius: "4px",
                      // backgroundColor: "#f9f9f9",
                      fontSize: "12px",
                      color: "#004080",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <strong>Medicine:</strong> {item.medicine_name}
                    </span>
                    <span>
                      <strong>Strength:</strong> {item.strength || "N/A"}
                    </span>
                    <span>
                      <strong>Dosage:</strong>{" "}
                      {item.dosage_instructions || "N/A"}
                    </span>
                    <span>
                      <strong>Quantity:</strong> {item.quantity || "N/A"}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Prescriber name */}
          {/* <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "bold" }}>
              Prescriber's name and initials in block capitals
            </div>
          </div> */}

          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ccc",
              borderBottom: "1px solid #ccc",
              marginTop: "30px",
            }}
          >
            {/* Signature of Prescriber */}
            <div
              style={{
                flex: 2,
                padding: "5px 10px",
                borderRight: "1px solid #ccc",
              }}
            >
              <div style={{ fontSize: "12px", color: "#004080" }}>
                <span style={{ fontWeight: "bold" }}>
                  Signature of Prescriber
                </span>
                <br />
                {prescription?.digital_signature ? (
                  <img
                    src={`${Config.BASE_URL}/${prescription?.digital_signature}`}
                    alt="Signature"
                    style={{
                      maxWidth: "150px",
                      height: "auto",
                      marginTop: "10px",
                    }}
                  />
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            {/* Date */}
            <div style={{ flex: 1, padding: "5px 10px" }}>
              <div style={{ fontSize: "12px", color: "#004080" }}>
                <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
                <span style={{ color: "#004080" }}>
                  {prescription?.created_at
                    ? new Date(prescription?.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div
          style={{
            padding: "10px",
            borderTop: "1px solid #ccc",
            fontSize: "10px",
            color: "#666",
          }}
        >
          Form template — designed to match the provided photograph.
        </div> */}
      </div>
    </div>
  );
};

export default PrescriptionsPatient;
