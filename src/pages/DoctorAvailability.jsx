import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Config from "../config";

import male from "../assets/images/male.png";
import imageone from "../assets/admin/Group 1324.png";
import imagetwo from "../assets/admin/Rectangle 2388.png";
import imagetree from "../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import female from "../assets/images/Female2.png";
import "react-calendar/dist/Calendar.css";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Sidebar from "../adminpage/sidebar/Sidebar";
import Navbar from "../adminpage/sidebar/Navbar";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoctorAvailability2 = ({ doctorId }) => {
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await axios.get(
          `${Config.BASE_URL}/api/daysavailability/${doctorId}`
        );

        console.log("avail:-", res.data);
        const existing = res.data.availability || [];

        // Always show all days — if no data, keep inputs empty
        const mapped = daysOfWeek.map((day) => {
          const found = existing.find((a) => a.day === day);
          if (found) {
            return {
              day,
              start: found.start_time,
              end: found.end_time,
              unavailable: false,
            };
          } else {
            // If no record found → mark as unavailable
            return {
              day,
              start: "",
              end: "",
              unavailable: true,
            };
          }
        });

        setAvailability(mapped);
      } catch (err) {
        console.error("Error fetching availability:", err);
        // Still show default empty input fields
        setAvailability(
          daysOfWeek.map((day) => ({
            day,
            start: "",
            end: "",
            unavailable: false,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [doctorId]);

  // Handle input change
  const handleChange = (index, key, value) => {
    const newAvail = [...availability];
    newAvail[index][key] = value;
    setAvailability(newAvail);
  };

  const toggleUnavailable = (index) => {
    const newAvail = [...availability];
    newAvail[index].unavailable = !newAvail[index].unavailable;
    if (newAvail[index].unavailable) {
      newAvail[index].start = "";
      newAvail[index].end = "";
    }
    setAvailability(newAvail);
  };

  const [loading2, setLoading2] = useState(false);
  const handleSubmit = async () => {
    try {
      const payload = {
        doctor_id: doctorId,
        availability: availability.map((day) => ({
          day: day.day,
          slots: day.unavailable ? [] : [{ start: day.start, end: day.end }],
        })),
      };
      setLoading2(true);
      const response = await axios.post(
        `${Config.BASE_URL}/api/daysavailability`,
        payload
      );
      toast.success("Availability saved successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error saving availability:", error);
      toast.error(error.response.data.message || "Error saving availability!");
    } finally {
      setLoading2(false);
    }
  };

  if (loading)
    return (
      <div>
        <CircularProgress size={20} color="inherit" />
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <h5 className="mb-3 fw-bold text-center text-sm-start">
          Doctor Availability
        </h5>

        {availability.map((day, index) => (
          <div
            key={day.day}
            className="row align-items-center border-bottom py-2 mb-2"
          >
            <div className="col-12 col-sm-3 fw-bold text-center text-sm-start mb-2 mb-sm-0">
              {day.day.slice(0, 3)}.
            </div>

            <div className="col-12 col-sm-6 d-flex flex-wrap justify-content-center justify-content-sm-start align-items-center">
              <input
                type="time"
                className="form-control text-center me-2 mb-2 mb-sm-0"
                style={{ maxWidth: "150px" }}
                value={day.start}
                disabled={day.unavailable}
                onChange={(e) => handleChange(index, "start", e.target.value)}
              />
              <span className="me-2 d-none d-sm-inline">-</span>
              <input
                type="time"
                className="form-control text-center mb-2 mb-sm-0"
                style={{ maxWidth: "150px" }}
                value={day.end}
                disabled={day.unavailable}
                onChange={(e) => handleChange(index, "end", e.target.value)}
              />
            </div>

            <div className="col-12 col-sm-3 text-center text-sm-end">
              <div className="d-flex justify-content-center justify-content-sm-end align-items-center gap-2">
                <label
                  htmlFor={`unavailable-${index}`}
                  className="fw-medium m-0"
                >
                  Unavailable
                </label>
                <input
                  type="checkbox"
                  id={`unavailable-${index}`}
                  checked={day.unavailable}
                  onChange={() => toggleUnavailable(index)}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="text-center text-sm-end mt-3">
          <button
            className="btn btn-success px-4"
            onClick={handleSubmit}
            disabled={loading2}
          >
            {loading2 ? <CircularProgress size={20} color="inherit" /> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const DoctorAvailability = () => {
  // Convert string to object

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
      doc_id: DoctorID, // make sure DoctorID is defined
    };
    setLoading(true);
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/appointments/index`, {
        params: payload,
      });

      if (res.data.success) {
        setAppointments(res.data.appointments);
        console.log(res.data.appointments, "patientpage");
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 content-area">
          <Navbar />
          <div className=" bgcolor  p-3">
            <h3>Add Availability </h3>

            <div className="row">
              <div className="col-lg-8">
                <DoctorAvailability2 doctorId={DoctorID} />
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
            <h6>Copyright © 2025 Yodoc UK All Rights Reserved.</h6>
            <br />
          </div>
        </div>
      </div>

      <style>
        {`
            @media (min-width: 900px) and (max-width: 1370px) {

            }


            .save-btn-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
            }

            .save-btn {
            background-color: #4d6aff;
            color: white;
            padding: 8px 15px;
            border-radius: 24px;
            border: none;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: 0.3s;
            }
            .success-btn {
            background-color: #70EFCD;
            color: white;
            padding: 8px 15px;
            border-radius: 24px;
            border: none;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: 0.3s;
            }

            .bgpatientcard {
            background-color: #E0EAF3;
            border-radius: 10px;
            padding: 5px 10px;
            }

            .info-label {
            font-size: 10px;
            color: #888;
            font-weight: 500;
            }

            .info-value {
            font-size: 12px;
            font-weight: 600;
            color: #333;
            }

            .patient-card {
            background-color: white;
            border-radius: 20px;
            box-shadow: 0 4px 12px #fff;
            border:2px solid #fff;
            margin-bottom: 24px;
            transition: all 0.3s ease-in-out;
            }

            .patient-card:hover {
            transform: translateY(-2px);
            }

            .card-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
            }

                    .patient-img {
                        width: 48px;
                        height: 48px;
                        object-fit: cover;
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

export default DoctorAvailability;
