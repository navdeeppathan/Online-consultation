import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";
import axios from "axios";
import Config from "../../config";
import toast, { Toaster } from "react-hot-toast";

const AdminAllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${Config.BASE_URL}/api/admingetAllDoctors`
        );
        if (response.data.success) {
          setDoctors(response.data.doctors);
        } else {
          toast.error("Failed to fetch doctors");
        }
      } catch (error) {
        console.error("API call failed:", error);
        toast.error("Something went wrong while fetching doctors");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const toggleStatus = async (doctor) => {
    setStatusLoading((prev) => [...prev, doctor.id]);
    const newStatus = doctor.status === 0 ? 1 : 0;
    try {
      await axios.post(`${Config.BASE_URL}/api/update-status`, {
        user_id: doctor.id,
        status: newStatus,
      });
      setDoctors((prev) =>
        prev.map((d) => (d.id === doctor.id ? { ...d, status: newStatus } : d))
      );
      toast.success(
        `Doctor ${doctor.firstname} is now ${
          newStatus === 0 ? "Active" : "Inactive"
        }`
      );
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update status");
    } finally {
      setStatusLoading((prev) => prev.filter((id) => id !== doctor.id));
    }
  };

  // Pagination Logic
  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = doctors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(doctors.length / doctorsPerPage);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="d-flex">
      <Toaster position="top-right" />
      <AdminSidebar />
      <div className="flex-grow-1 content-area">
        <AdminNavbar />

        <div className=" bgcolor p-3">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <>
              <h3>All Doctors</h3>

              <div
                className="tab-pane fade show active"
                id="pills-active"
                role="tabpanel"
              >
                <div className="table-responsive">
                  <table className="table table-striped custom-table approvedtable">
                    <thead className="table-light ">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Mobile Number</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentDoctors.map((doctor) => (
                        <tr key={doctor.id}>
                          <td>
                            {doctor.firstname} {doctor.lastname}
                          </td>
                          <td>{doctor.email}</td>
                          <td>{doctor.mobile_number}</td>
                          <td>
                            <label className="switch">
                              <input
                                type="checkbox"
                                checked={doctor.status === 0}
                                onChange={() => toggleStatus(doctor)}
                                disabled={statusLoading.includes(doctor.id)}
                              />
                              <span className="slider">
                                {statusLoading.includes(doctor.id) ? (
                                  <div className="circle-loader"></div>
                                ) : (
                                  <>
                                    <span className="on">ON</span>
                                    <span className="off">OFF</span>
                                  </>
                                )}
                              </span>
                            </label>
                          </td>
                          <td>
                            <button
                              className="view-btn"
                              onClick={() =>
                                navigate(
                                  `/admin-doctor-profile?id=${doctor.id}`
                                )
                              }
                            >
                              View Details →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="pagination-container">
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    className={`page-btn ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="page-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        <style>{`
        

          .view-btn {
            background-color: #7288f1;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 6px 12px;
            cursor: pointer;
            font-size: 14px;
          }

          .view-btn:hover {
            background-color: #5a6fd0;
          }

          .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 28px;
          }

          .switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }

          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            border-radius: 34px;
            transition: 0.4s;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 5px;
          }

          .slider .on, .slider .off {
            font-size: 10px;
            font-weight: bold;
            color: white;
            width: 40%;
            text-align: center;
          }

          .switch input:checked + .slider { background-color: #33cc33; }
          .switch input:checked + .slider .off { color: #fff; }

          .switch input:not(:checked) + .slider { background-color: #ff4d4d; }
          .switch input:not(:checked) + .slider .on { color: #fff; }

          .slider:before {
            position: absolute;
            content: "";
            height: 22px;
            width: 22px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: 0.4s;
            border-radius: 50%;
          }

          .switch input:checked + .slider:before { transform: translateX(32px); }

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

          .pagination-container {
            margin-top: 15px;
            text-align: center;
          }

          .page-btn {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 6px 12px;
            margin: 0 3px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }

          .page-btn.active {
            background-color: #7288f1;
            color: white;
            border-color: #7288f1;
          }

          .page-btn:hover:not(:disabled) {
            background-color: #ddd;
          }

          .page-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          @media (max-width: 768px) {
            
            .page-btn {
              padding: 4px 8px;
              font-size: 12px;
            }
          }

        
        `}</style>

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
    </div>
  );
};

export default AdminAllDoctors;
