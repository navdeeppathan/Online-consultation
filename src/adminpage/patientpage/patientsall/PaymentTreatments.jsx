import React, { useEffect, useState } from "react";

import { Form, Button, Table, Badge } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import doctorimage from "../../../assets/images/doctor.png";
import doctorimage1 from "../../../assets/images/doctor1.png";
import star from "../../../assets/admin/285661_star_icon 1.png";
import imageone from "../../../assets/admin/Group 1324.png";
import imagetwo from "../../../assets/admin/Rectangle 2388.png";
import imagetree from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import SidebarPatient from "../sidebarpatient/SidebarPatient";
import NavbarPatient from "../sidebarpatient/NavbarPatient";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import Config from "../../../config";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
ChartJS.register(ArcElement, Tooltip, Legend);
const PaymentTreatments = () => {
  const navigate = useNavigate();
  const [additionalInfo, setAdditionalInfo] = useState({});

  const userData = JSON.parse(localStorage.getItem("user"));

  const [data, setData] = useState({
    monthly_data: {},
    users: [],
    doctors: [],
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [availableMonths, setAvailableMonths] = useState([]);
  const [patients, setPatients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  // useEffect(() => {
  //   axios
  //     .get(`${Config.BASE_URL}/api/orders/user/${userData?.id}`)
  //     .then((res) => setOrders(res.data))
  //     .catch((err) => console.error(err));
  // }, []);

  // const [currentPage, setCurrentPage] = useState(1);
  // const itemsPerPage = 8;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${Config.BASE_URL}/api/orders/user/${userData?.id}`
        );
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userData?.id) {
      fetchOrders();
    }
  }, [userData?.id]);

  // 🔹 Pagination logic
  // const totalPages = Math.ceil(orders.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const currentOrders = orders.slice(startIndex, startIndex + itemsPerPage);

  // const handlePageChange = (page) => {
  //   if (page >= 1 && page <= totalPages) setCurrentPage(page);
  // };

  const [currentPage, setCurrentPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const itemsPerPage = 7;

  // Filter data based on created_at
  const filteredData = orders?.filter((item) => {
    if (!fromDate && !toDate) return true;

    const itemDate = new Date(item.created_at);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && to) return itemDate >= from && itemDate <= to;
    if (from) return itemDate >= from;
    if (to) return itemDate <= to;
    return true;
  });

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  const currentOrders = filteredData?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
  return (
    <>
      <div className="d-flex">
        <SidebarPatient />
        <div className="flex-grow-1 content-area">
          <NavbarPatient />
          <div className=" bgcolor  p-3">
            <h3>Payments/Invoices</h3>

            <div className="row">
              <div className="col-lg-12">
                <div className="card p-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5>Payments</h5>
                    <div className="d-flex flex-column flex-md-row align-items-center gap-2 ">
                      <input
                        type="date"
                        className="form-control"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                      />
                      to
                      <input
                        type="date"
                        className="form-control"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-borderless align-middle custom-table approvedtable">
                      <thead>
                        <tr>
                          <th>Doctor Name</th>
                          <th>Amount</th>
                          <th>Transaction No.</th>
                          <th>Order No.</th>
                          <th>Payment Type</th>
                          <th>Payment Date</th>
                          {/* <th>Payment Pay Date</th> */}
                          {/* <th>Invoice</th> */}
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
                        ) : currentOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center">
                              No orders found.
                            </td>
                          </tr>
                        ) : (
                          currentOrders.map((order) => (
                            <tr key={order.id}>
                              <td>
                                {order.doctor
                                  ? `${order.doctor.firstname || ""} ${
                                      order.doctor.lastname || ""
                                    }`
                                  : "N/A"}
                              </td>
                              <td>£{order.amount}</td>
                              <td>{order.transaction_id || "N/A"}</td>
                              <td>{order.order_id || "N/A"}</td>
                              <td>
                                {order.payment_type?.toUpperCase() || "N/A"}
                              </td>
                              <td>
                                {order.created_at
                                  ? new Date(
                                      order.created_at
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "N/A"}
                              </td>
                            </tr>
                          ))
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
    font-size: 10px !important;
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


.custom-table thead th {
  font-weight: 600;
  color: #888;
  background-color: #fff;
  padding: 12px;
}

.custom-table tbody td {
  padding: 14px 12px;
  vertical-align: middle;
  font-size: 14px;
  color: #333;
}

.custom-table tbody tr:not(:last-child) {
  border-bottom: 1px solid #fff;
}

.card {
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  background-color: white;
  border: none;
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
        `}
      </style>
    </>
  );
};

export default PaymentTreatments;
