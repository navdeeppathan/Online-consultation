import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Ensure you have react-bootstrap installed
import Config from "../../config";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";

const DoctorProfile = () => {
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `${Config.BASE_URL}/api/admin-doctor/${id}`
        );
        console.log("Doctor data:", response.data);
        setDoctor(response.data.data.doctor);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${Config.BASE_URL}/api/completed-count`, {
        params: { doc_id: id },
      })

      .then((res) => {
        if (res.data.success) {
          console.log("res of complete:-", res.data);
          setCompletedCount(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch completed count:", err);
      });
  }, []);

  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    if (id) {
      fetchTotalOrders();
    }
  });
  const fetchTotalOrders = async () => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/orders/doctor-total/${id}`
      );
      if (res.data.status) setTotalOrders(res.data?.total_amount);
      console.log("res of order:-", res.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const openDocument = (doc) => {
    setSelectedDoc(doc);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoc(null);
  };

  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const fetchDocuments = async (id) => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/documents/${id}`);
      const filePath = res.data.data.file_path;
      setSelectedFilePath(`${Config.BASE_URL}/storage/app/public/${filePath}`);
      setShowPreviewModal(true);
    } catch (error) {
      console.error(error);
      alert("Error fetching document");
    }
  };

  if (!doctor) {
    return (
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 ">
          <AdminNavbar />
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1">
        <AdminNavbar />

        <div className="container p-3">
          <div className="row">
            {/* Left Section */}
            <div className="col-lg-4 mb-4">
              <div className="card shadow-sm mb-4">
                <div className="card-body text-center">
                  {doctor.profile_image ? (
                    <img
                      src={`${Config.BASE_URL}/${doctor.profile_image}`}
                      alt="Profile"
                      className="img-fluid rounded-circle mb-3"
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="mx-auto rounded-circle d-flex align-items-center justify-content-center text-white fw-bold mb-3"
                      style={{
                        width: "150px",
                        height: "150px",
                        backgroundColor: "#6f42c1",
                        fontSize: "48px",
                      }}
                    >
                      {`${doctor.firstname.substring(0, 1)}${
                        doctor.lastname ? doctor.lastname.substring(0, 1) : ""
                      }`.toUpperCase()}
                    </div>
                  )}

                  <h5 className="mb-1">
                    {doctor.firstname} {doctor.lastname}
                  </h5>
                  <p className="text-muted">
                    {JSON.parse(
                      doctor.professional_registration?.specialization || "[]"
                    ).join(", ")}
                  </p>
                </div>
              </div>
              {/* Qualifications */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="mb-3">Qualifications</h5>
                  {doctor.qualifications && doctor.qualifications.length > 0 ? (
                    <ul>
                      {doctor.qualifications.map((qual, index) => (
                        <li key={index}>
                          {qual.degree} from {qual.institution} (
                          {qual.year_completed})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No qualifications available.</p>
                  )}
                </div>
              </div>
              {/* Documents */}
              {/* <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="mb-3">Documents</h5>
                  {doctor.documents?.map((doc, index) => {
                    const fullUrl = `${Config.BASE_URL}/storage/app/public/${doc.file_path}`;
                    return (
                      <div
                        className="d-flex justify-content-between align-items-center mb-2"
                        key={index}
                      >
                        <p className="mb-0 fw-bold">{doc.document_type}</p>
                        <a
                          href="#!"
                          className="text-primary text-decoration-underline"
                          onClick={() => fetchDocuments(doc.id)}
                        >
                          {"..." + fullUrl.slice(-20)}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div> */}
              <div className="card shadow-sm mt-3">
                <div className="card-body">
                  <h5 className="card-title mb-3">Total Consultations</h5>

                  <div className="row text-center">
                    {/* Completed */}
                    <div className="col-12 col-lg-6 mb-3 border-end border-lg-end">
                      <h6 className="text-secondary mb-1">Completed</h6>
                      <h3 className="fw-bold mb-0">{completedCount?.count}</h3>
                    </div>

                    <div className="col-12 col-lg-6 mb-3">
                      <h6 className="text-secondary mb-1">In Progress</h6>
                      <h3 className="fw-bold mb-0">
                        {completedCount?.inProgress}
                      </h3>
                    </div>

                    {/* Pending */}
                    <div className="col-12 col-lg-6 mb-3 border-end border-lg-end">
                      <h6 className="text-secondary mb-1">Pending</h6>
                      <h3 className="fw-bold mb-0">
                        {completedCount?.pending}
                      </h3>
                    </div>

                    {/* Cancelled */}
                    <div className="col-12 col-lg-6 mb-3 border-end border-lg-end">
                      <h6 className="text-secondary mb-1">Cancelled</h6>
                      <h3 className="fw-bold mb-0">{completedCount?.cancel}</h3>
                    </div>

                    {/* Total Orders */}
                    <div className="col-12 col-lg-12 mb-3 pt-3 border-top border-lg-top">
                      <h6 className="text-secondary mb-1">Total Amount</h6>
                      <h3 className="fw-bold mb-0">{totalOrders}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-lg-8">
              {/* Profile Info */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="mb-3">Profile Information</h5>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="text"
                        className="form-control"
                        value={doctor.email}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={doctor.mobile_number}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Gender</label>
                      <input
                        type="text"
                        className="form-control"
                        value={doctor.gender}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="text"
                        className="form-control"
                        value={doctor.date_of_birth}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* About the Doctor */}
              <div className="card shadow-sm mb-4">
                <div className="card-body">
                  <h5 className="mb-3">About the Doctor</h5>
                  <p>
                    <strong>Address:</strong>{" "}
                    {doctor.personal_information?.home_address || "N/A"}
                  </p>

                  <p>
                    <strong>Years of Experience:</strong>{" "}
                    {doctor.years_of_experience || "N/A"}
                  </p>
                  <p>
                    <strong>GMC Registration No.:</strong>{" "}
                    {doctor.professional_registration
                      ?.gmc_registration_number || "N/A"}
                  </p>
                  <p>
                    <strong>Revalidation Date:</strong>{" "}
                    {doctor.professional_registration?.revalidation_date ||
                      "N/A"}
                  </p>
                </div>
              </div>

              {/* Fees */}
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="mb-3">Fees</h5>

                  {doctor.fees ? (
                    <div>
                      {/* In-Person Fees */}
                      {doctor.fees.inPerson &&
                        doctor.fees.inPerson.length > 0 && (
                          <div className="mb-3">
                            <h6>In-Person</h6>
                            <ul>
                              {doctor.fees.inPerson.map((fee, index) => (
                                <li key={index}>
                                  {fee.description} — {fee.amount}
                                  {fee.currency}
                                  <br />
                                  <small className="text-muted">
                                    {fee.clinic_name} — {fee.address}
                                  </small>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Virtual Fees */}
                      {doctor.fees.virtual &&
                        doctor.fees.virtual.length > 0 && (
                          <div className="mb-3">
                            <h6>Virtual</h6>
                            <ul>
                              {doctor.fees.virtual.map((fee, index) => (
                                <li key={index}>
                                  {fee.description} — {fee.amount}
                                  {fee.currency}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  ) : (
                    <p>No fee information available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DoctorAppointments doctor={doctor} />
          <DoctorOrders doctor={doctor} />
        </div>

        {/* Modal for Document Preview */}
        {/* <Modal
          show={showPreviewModal}
          onHide={() => setShowPreviewModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Document Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ minHeight: "500px" }}>
            {selectedFilePath ? (
              selectedFilePath.match(/\.(jpg|jpeg|png|gif|svg)$/i) ? (
                <img
                  src={selectedFilePath}
                  alt="Preview"
                  style={{
                    width: "100%",
                    maxHeight: "500px",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <iframe
                  src={selectedFilePath}
                  title="Preview"
                  style={{ width: "100%", height: "500px", border: "none" }}
                ></iframe>
              )
            ) : (
              <p>Loading file...</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowPreviewModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal> */}
      </div>

      <style>{`
        .loader-container {
          display: flex;        
            justify-content: center;
            align-items: center;

            height: 200px;

        }
        .loader, .circle-loader {
          border: 4px solid #f3f3f3;
            border-top: 4px solid #7288f1;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
        }
        .circle-loader {

            width: 20px;
            height: 20px;
            border-width: 3px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        `}</style>
    </div>
  );
};

const DoctorAppointments = ({ doctor }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // --------------------------
  // FILTER APPOINTMENTS BY DATE
  // --------------------------
  const filteredAppointments = useMemo(() => {
    if (!doctor.as_doctor_appointments) return [];

    return doctor.as_doctor_appointments
      .filter((appt) => {
        const slot = appt.slots?.[0];
        if (!slot?.date) return false;

        const apptDate = new Date(slot.date);

        if (fromDate && apptDate < new Date(fromDate)) return false;
        if (toDate && apptDate > new Date(toDate)) return false;

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.slots?.[0]?.date);
        const dateB = new Date(b.slots?.[0]?.date);

        return dateB - dateA; // DESC → Latest date first
      });
  }, [doctor.as_doctor_appointments, fromDate, toDate]);

  // --------------------------
  // PAGINATION LOGIC
  // --------------------------
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const paginatedData = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h5 className="mb-3">Doctor Appointments</h5>

        {/* -------------------- FILTER SECTION -------------------- */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">From Date</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">To Date</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* -------------------- TABLE SECTION -------------------- */}
        {paginatedData.length > 0 ? (
          <div
            className="tab-pane fade show active"
            id="pills-active"
            role="tabpanel"
          >
            <div className="table-responsive">
              <table className="table table-striped custom-table approvedtable">
                <thead className="table-light ">
                  <tr>
                    <th>#</th>
                    <th>Appointment No.</th>
                    <th>Type</th>
                    {/* <th>Destination</th> */}
                    <th>Date</th>
                    <th>Time</th>
                    <th>Fees</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((appt, index) => {
                    const slot = appt.slots?.[0];

                    return (
                      <tr key={appt.id}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{appt.id}</td>
                        <td className="text-capitalize">{appt.type}</td>
                        {/* <td>{appt.destination}</td> */}
                        <td>{slot?.date || "-"}</td>
                        <td>{slot?.time || "-"}</td>
                        <td>£{slot?.fees || "-"}</td>
                        <td>
                          {(() => {
                            const slot = appt.slots?.[0];

                            if (!slot)
                              return (
                                <span className="badge bg-secondary">
                                  No Slot
                                </span>
                              );

                            // ---- 1️COMPLETED → highest priority ----
                            if (
                              slot.isBook === 1 &&
                              slot.isConsultCompleted === 1
                            ) {
                              return (
                                <span className="badge bg-primary">
                                  Completed{" "}
                                  {appt.type === "virtual" ? (
                                    <i className="bi bi-camera-video ms-1"></i>
                                  ) : (
                                    <i className="bi bi-geo-alt ms-1"></i>
                                  )}
                                </span>
                              );
                            }

                            // ---- 2CANCELLED ----
                            if (slot.isBook === 2) {
                              return (
                                <span className="badge bg-danger">
                                  Cancelled
                                </span>
                              );
                            }

                            // ---- 3 WAITING APPROVAL ----
                            if (slot.isBook === 0) {
                              return (
                                <span className="badge bg-warning text-dark">
                                  Waiting Approval
                                </span>
                              );
                            }

                            // ---- 4️ BOOKED (not completed) ----
                            if (slot.isBook === 1) {
                              return (
                                <span className="badge bg-success">Booked</span>
                              );
                            }

                            return null;
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>No appointments found.</p>
        )}

        {/* -------------------- PAGINATION -------------------- */}
        {totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {/* Previous */}
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button
                  className="page-link"
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                >
                  Previous
                </button>
              </li>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }).map((_, idx) => (
                <li
                  key={idx}
                  className={`page-item ${currentPage === idx + 1 && "active"}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(idx + 1)}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}

              {/* Next */}
              <li
                className={`page-item ${
                  currentPage === totalPages && "disabled"
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
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

/* Table general transparency */
table {
  background-color: transparent !important;
  border-collapse: separate;
  border-spacing: 0 2px;
}

.content-area {
  width: 100%;
}
`}
      </style>
    </div>
  );
};

const DoctorOrders = ({ doctor }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // -----------------------------
  // FILTER + SORT LATEST FIRST
  // -----------------------------
  const filteredOrders = useMemo(() => {
    if (!doctor.doctor_orders) return [];

    return doctor.doctor_orders
      .filter((order) => {
        const orderDate = new Date(order.created_at);

        if (fromDate && orderDate < new Date(fromDate)) return false;
        if (toDate && orderDate > new Date(toDate)) return false;

        return true;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // DESC
  }, [doctor.doctor_orders, fromDate, toDate]);

  // -----------------------------
  // PAGINATION CALCULATION
  // -----------------------------
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h5 className="mb-3">Doctor Transactions</h5>

        {/* ------------ FILTER SECTION ------------ */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col-md-4 d-flex align-items-end">
            <button
              className="btn btn-secondary w-100"
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* ------------ TABLE ------------ */}
        {paginatedData.length > 0 ? (
          <div
            className="tab-pane fade show active"
            id="pills-active"
            role="tabpanel"
          >
            <div className="table-responsive">
              <table className="table table-striped custom-table approvedtable">
                <thead className="table-light ">
                  <tr>
                    <th>#</th>
                    <th>Order No.</th>
                    <th>Transaction No.</th>
                    <th>Amount</th>
                    <th>Payment Type</th>
                    <th>Status</th>
                    <th>Appointment No.</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedData.map((order, index) => (
                    <tr key={order.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{order.order_id}</td>
                      <td>{order.transaction_id}</td>
                      <td>£{order.amount}</td>
                      <td className="text-capitalize">{order.payment_type}</td>

                      <td>
                        {order.status === 1 ? (
                          <span className="badge bg-success">Paid</span>
                        ) : order.status === 0 ? (
                          <span className="badge bg-warning text-dark">
                            Pending
                          </span>
                        ) : (
                          <span className="badge bg-danger">Failed</span>
                        )}
                      </td>

                      <td>{order.appointment_id}</td>
                      <td>{order.created_at.split("T")[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>No orders found.</p>
        )}

        {/* ------------ PAGINATION ------------ */}
        {totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                <button
                  className="page-link"
                  onClick={() =>
                    currentPage > 1 && setCurrentPage(currentPage - 1)
                  }
                >
                  Previous
                </button>
              </li>

              {Array.from({ length: totalPages }).map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 && "active"}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}

              <li
                className={`page-item ${
                  currentPage === totalPages && "disabled"
                }`}
              >
                <button
                  className="page-link"
                  onClick={() =>
                    currentPage < totalPages && setCurrentPage(currentPage + 1)
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
};

export default DoctorProfile;
