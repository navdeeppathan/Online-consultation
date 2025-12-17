import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import Config from "../../config";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EarningDashboardCharts = () => {
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [doctorEarnings, setDoctorEarnings] = useState([]);
  const [patientEarnings, setPatientEarnings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          `${Config.BASE_URL}/api/orders/admin/dashboard`
        );
        const response2 = await axios.get(
          `${Config.BASE_URL}/api/yodoc-charges`
        );
        const data = response.data;

        console.log("ordercpontroller:-", response2.data);

        setMonthlyEarnings(data.monthly_earnings || []);
        setDoctorEarnings(data.doctor_earnings || []);
        setPatientEarnings(data.patient_earnings || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  // Bar chart data for monthly earnings
  const barData = {
    labels: monthlyEarnings.map((m) => m.month),
    datasets: [
      {
        label: "Monthly Earnings",
        data: monthlyEarnings.map((m) => parseFloat(m.total_earning)),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  // Pie chart data for top 5 doctor earnings
  const pieData = {
    labels: doctorEarnings.map((d) =>
      d.doctor
        ? `${d.doctor.firstname} ${d.doctor.lastname}`
        : `Doctor ID ${d.doctor_id}`
    ),
    datasets: [
      {
        label: "Doctor Earnings",
        data: doctorEarnings.map((d) => parseFloat(d.total_earning)),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        hoverOffset: 10,
      },
    ],
  };

  return (
    <>
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 content-area">
          <AdminNavbar />

          <div className="bgcolor p-3">
            <div style={{ display: "flex", gap: "50px", flexWrap: "wrap" }}>
              <div style={{ width: "500px" }}>
                <h3>Monthly Earnings</h3>
                <Bar data={barData} />
              </div>
              <div style={{ width: "400px" }}>
                <h3>Top Doctor Earnings</h3>
                <Pie data={pieData} />
              </div>
            </div>

            {/* Table of all doctors with earnings */}
            <div className="mt-4">
              <h3>All Doctor Earnings</h3>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Doctor Name</th>

                    <th>Total Earning</th>
                  </tr>
                </thead>
                <tbody>
                  {doctorEarnings.map((d, index) => (
                    <tr key={d.doctor_id}>
                      <td>{index + 1}</td>
                      <td>
                        {d.doctor
                          ? `${d.doctor.firstname} ${d.doctor.lastname}`
                          : "N/A"}
                      </td>

                      <td>${parseFloat(d.total_earning).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EarningDashboardCharts;
