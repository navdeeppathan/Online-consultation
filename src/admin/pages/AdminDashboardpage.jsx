import axios from "axios";
import React, { useEffect, useState } from "react";
import Config from "../../config"; // Ensure this exists
import { useNavigate } from "react-router-dom";
import AdminAllActivityLogs from "./AdminAllActivityLogs";

const AdminDashboardPage = () => {
  const [activeCard, setActiveCard] = useState(1);
  const navigate = useNavigate();
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${Config.BASE_URL}/api/orders/admin/dashboard`
        );
        console.log("ordercpontroller:-", response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${Config.BASE_URL}/api/users-by-status`
        );
        const data = response.data;

        // console.log("User Status Data:", data);

        // Map API response to the summary format
        const summaryData = [
          {
            id: 1,
            title: "Active Doctors",
            value: data.active_doctors,
            link: "/admin-doctors",
            icon: (
              <div className="icon-wrapper purple-bg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#7B3FF2">
                  <path d="M20 9V7h-1V5c0-1.1-.9-2-2-2H7C5.9 3 5 3.9 5 5v2H4v2h16zM7 5h10v2H7V5zm13 4H4v11h16V9zm-9 7H8v-2h3v2zm6 0h-3v-2h3v2z" />
                </svg>
              </div>
            ),
          },
          {
            id: 2,
            title: "Active Patients",
            value: data.active_patients,
            link: "/admin-patients",
            icon: (
              <div className="icon-wrapper blue-bg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#2196F3">
                  <path
                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 
          0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 
          0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 
          0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                  />
                </svg>
              </div>
            ),
          },
          {
            id: 3,
            title: "Inactive Users",
            value: data.inactive_users,
            link: "/admin-patients",
            icon: (
              <div className="icon-wrapper gray-bg">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#9E9E9E">
                  <path
                    d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 
          5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 
          5v3h20v-3c0-3.3-6.7-5-10-5z"
                  />
                </svg>
              </div>
            ),
          },
        ];

        setSummary(summaryData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
      </div>

      <div className="summary-cards">
        {summary.map((card) => (
          <div
            key={card.id}
            className={`card ${activeCard === card.id ? "active " : ""}`}
            onClick={() => {
              setActiveCard(card.id);
              navigate(card.link);
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <div className="icon-container">{card.icon}</div>

              <h4>{card.title}</h4>
            </div>
            <p>{card.value}</p>
            <span>→</span>
          </div>
        ))}
      </div>

      <style>{`
      .icon-container {
        display: flex;
        justify-content: flex-start;
        margin-bottom: 15px;
      }

      .icon-wrapper {
        width: 55px;
        height: 55px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .purple-bg {
        background: #f2e6ff; /* soft purple circle */
      }

      .blue-bg {
        background: #e6f4ff; /* soft blue circle */
      }

      .gray-bg {
        background: #f1f1f1; /* light gray circle */
      }

        .dashboard-container {
          max-width: 1200px;
          margin: auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .dashboard-header h2 {
          margin: 0;
        }

        .create-btn {
          padding: 10px 20px;
          background-color: #7288f1;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 10px;
        }

        .create-btn:hover {
          background-color: #5a6fd0;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 30px;
        }

        .card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .card h4 {
          font-size: 14px;
          
          margin-bottom: 10px;
        }

        .card p {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .card span {
          position: absolute;
          right: 20px;
          bottom: 20px;
          font-size: 20px;
          color: #7288f1;
        }

        .card.active {
          background-color: #7288f1;
          color: #FFFFFF;
        }
        .table-container {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background-color: #f8f8f8;
        }

        th, td {
          padding: 12px 15px;
          text-align: left;
        }

        tbody tr {
          border-bottom: 1px solid #eee;
        }

        .pending-text {
          color: #ff9900;
        }

        .complete-text {
          color: #33cc33;
        }

        .status {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status.pending {
          background-color: #ffe5e5;
          color: #ff4d4d;
        }

        .status.complete {
          background-color: #e5ffe5;
          color: #33cc33;
        }

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

        @media (max-width: 1024px) {
          .dashboard-container {
            padding: 15px;
          }
          .create-btn {
            padding: 8px 16px;
            font-size: 14px;
          }
          .card p {
            font-size: 24px;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 10px;
          }

          .summary-cards {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .summary-cards {
            grid-template-columns: 1fr;
          }

          th, td {
            padding: 8px 10px;
            font-size: 14px;
          }

          .view-btn {
            padding: 4px 8px;
            font-size: 12px;
          }

          .create-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboardPage;
