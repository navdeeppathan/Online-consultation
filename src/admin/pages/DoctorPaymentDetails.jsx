import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Ensure you have react-bootstrap installed
import Config from "../../config";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";
import toast from "react-hot-toast";

const DoctorPaymentDetails = () => {
  const location = useLocation();
  const [doctor, setDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");
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
  useEffect(() => {
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
      <div className="flex-grow-1 content-area">
        <AdminNavbar />

        <div className="container  bgcolor p-3">
          <DoctorOrders doctor={doctor} fetchTotalOrders={fetchDoctor} />
        </div>
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

const DoctorOrders = ({ doctor, fetchTotalOrders }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // -----------------------------
  // LOAD ALL ORDERS ON FIRST LOAD
  // -----------------------------
  useEffect(() => {
    if (doctor?.doctor_orders) {
      setFilteredOrders(doctor.doctor_orders);
      calculateTotal(doctor.doctor_orders);
    }
  }, [doctor]);

  // -----------------------------
  // APPLY FILTER BUTTON CLICK
  // -----------------------------
  const applyFilters = () => {
    if (!doctor?.doctor_orders) return;

    let data = doctor.doctor_orders.filter((order) => {
      const orderDate = new Date(order.created_at);

      if (fromDate && orderDate < new Date(fromDate)) return false;
      if (toDate && orderDate > new Date(toDate)) return false;

      return true;
    });

    // Sort by latest
    data = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredOrders(data);
    calculateTotal(data);
    setCurrentPage(1);
  };

  // -----------------------------
  // RESET FILTERS
  // -----------------------------
  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setFilteredOrders(doctor.doctor_orders);
    calculateTotal(doctor.doctor_orders);
    setCurrentPage(1);
  };

  // -----------------------------
  // TOTAL AMOUNT CALCULATION
  // STATUS = 1 ONLY
  // -----------------------------
  const calculateTotal = (orders) => {
    const total = orders
      .filter((o) => o.status === 1)
      .reduce((sum, o) => sum + Number(o.amount), 0);

    setTotalAmount(total);
  };

  // -----------------------------
  // PAGINATION
  // -----------------------------
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginatedData = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [selectedIds, setSelectedIds] = useState([]);
  const toggleCheckbox = (id) => {
    setSelectedIds((prevSelected) => {
      let updated;

      // Add or remove id
      if (prevSelected.includes(id)) {
        updated = prevSelected.filter((x) => x !== id);
      } else {
        updated = [...prevSelected, id];
      }

      // If no checkbox selected → use original filter (status = 1)
      if (updated.length === 0) {
        const originalData = filteredOrders.filter((o) => o.status === 1);
        calculateTotal(originalData);
        return updated;
      }

      // Otherwise → use only selected IDs
      const selectedData = filteredOrders.filter(
        (o) => o.status === 1 && updated.includes(o.id)
      );

      calculateTotal(selectedData);

      return updated;
    });
  };

  const handlePay = async () => {
    let ids = [];

    if (selectedIds.length > 0) {
      // only selected + status=1
      ids = filteredOrders
        .filter((o) => o.status === 1 && selectedIds.includes(o.id))
        .map((o) => o.id);
    } else {
      // all due orders
      ids = filteredOrders.filter((o) => o.status === 1).map((o) => o.id);
    }

    try {
      const res = await axios.post(
        `${Config.BASE_URL}/api/orders/update-order-status`,
        {
          order_ids: ids,
          status: 3,
        }
      );
      if (res.data.status) {
        toast.success(res.data.message);
        fetchTotalOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(
        error.response.data?.message ||
          error.response.data?.error ||
          "Something went wrong"
      );
    }

    console.log("Pay these order IDs:", ids, "Total amount:", totalAmount);
  };

  return (
    <div className=" mt-4">
      <div className="card-body">
        <h5 className="mb-3">Appointment Transactions</h5>

        {/* ------------ FILTER SECTION ------------ */}
        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col-md-3 d-flex align-items-end mt-3 mt-md-0">
            <button className="btn btn-primary w-100" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>

          <div className="col-md-3 d-flex align-items-end mt-3 mt-md-0">
            <button className="btn btn-secondary w-100" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        </div>

        {/* ------------ TOTAL AMOUNT ------------ */}
        <h6 className="mb-3 d-flex justify-content-between align-items-center">
          <span>
            Total Amount (Due):{" "}
            <span className="text-success">£{totalAmount}</span>
          </span>

          {/* PAY BUTTON */}
          <button className="btn btn-primary" onClick={handlePay}>
            Pay & Update Status
          </button>
        </h6>

        {/* ------------ TABLE ------------ */}
        {paginatedData.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-striped custom-table approvedtable">
              <thead className="table-light ">
                <tr>
                  <th>#</th>
                  <th>Select</th>
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
                    <td>
                      {order.status === 1 ? (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(order.id)}
                          onChange={() => toggleCheckbox(order.id)}
                        />
                      ) : (
                        "-"
                      )}
                    </td>

                    <td>{order.order_id}</td>
                    <td>{order.transaction_id}</td>
                    <td>£{order.amount}</td>
                    <td className="text-capitalize">{order.payment_type}</td>

                    <td>
                      {order.status === 1 ? (
                        <span className="badge bg-success">Due</span>
                      ) : order.status === 0 ? (
                        <span className="badge bg-warning text-dark">
                          Cancel
                        </span>
                      ) : order.status === 3 ? (
                        <span className="badge bg-warning text-dark">
                          Settled
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

export default DoctorPaymentDetails;
