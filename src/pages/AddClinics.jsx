import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Config from "../config";
import toast from "react-hot-toast";
import Select from "react-select";
import male from "../assets/images/male.png";
import imageone from "../assets/admin/Group 1324.png";
import imagetwo from "../assets/admin/Rectangle 2388.png";
import imagetree from "../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import female from "../assets/images/Female2.png";
import "react-calendar/dist/Calendar.css";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Sidebar from "../adminpage/sidebar/Sidebar";
import Navbar from "../adminpage/sidebar/Navbar";
import ClinicCards from "./ClinicCards";
import { useNavigate } from "react-router-dom";
ChartJS.register(ArcElement, Tooltip, Legend);

const AddClinics = () => {
  // Convert string to object

  const [appointments, setAppointments] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const DoctorID = userData?.id;

  console.log("docid:-", DoctorID);

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

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const [showClinic, setShowClinic] = useState(false);
  const navigate = useNavigate();
  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 content-area">
          <Navbar />
          <div className=" bgcolor  p-3">
            <h3>Add Clinics </h3>

            <div className="row">
              <div className="col-lg-12">
                <div className="text-end d-flex justify-content-end gap-2 mb-3">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/admin/payments")}
                  >
                    Back
                  </button>

                  <button
                    className="btn btn-primary"
                    onClick={() => setShowClinic(!showClinic)}
                  >
                    {showClinic ? "Hide Clinic" : "Add Clinic"}
                  </button>
                </div>

                {showClinic ? <AddClinics2 /> : <ClinicCards />}
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

export default AddClinics;

// const AddClinics2 = () => {
//   const userdata = JSON.parse(localStorage.getItem("user"));
//   const [clinics, setClinics] = useState([
//     {
//       doctor_id: userdata.id,
//       name: "",
//       address: "",
//       city: "",
//       state: "",
//       country: "",
//       postal_code: "",
//       phone: "",
//       email: "",
//       latitude: "",
//       longitude: "",
//       rating: "",
//       total_reviews: "",
//       monday_hours: "",
//       tuesday_hours: "",
//       wednesday_hours: "",
//       thursday_hours: "",
//       friday_hours: "",
//       saturday_hours: "",
//       sunday_hours: "",
//       enquire_link: "",
//       clinic_logo: null,
//     },
//   ]);

//   const handleChange = (index, e) => {
//     const { name, value, files } = e.target;
//     const updatedClinics = [...clinics];
//     updatedClinics[index][name] = files ? files[0] : value;
//     setClinics(updatedClinics);
//   };

//   const addClinic = () => {
//     setClinics([
//       ...clinics,
//       {
//         doctor_id: userdata.id,
//         name: "",
//         address: "",
//         city: "",
//         state: "",
//         country: "",
//         postal_code: "",
//         phone: "",
//         email: "",
//         latitude: "",
//         longitude: "",
//         rating: "",
//         total_reviews: "",
//         monday_hours: "",
//         tuesday_hours: "",
//         wednesday_hours: "",
//         thursday_hours: "",
//         friday_hours: "",
//         saturday_hours: "",
//         sunday_hours: "",
//         enquire_link: "",
//         clinic_logo: null,
//       },
//     ]);
//   };

//   const removeClinic = (index) => {
//     const updatedClinics = clinics.filter((_, i) => i !== index);
//     setClinics(updatedClinics);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       for (let clinic of clinics) {
//         const formData = new FormData();
//         for (const key in clinic) {
//           formData.append(key, clinic[key]);
//         }

//         await axios.post(`${Config.BASE_URL}/api/clinics`, formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//       }

//       toast.success("Clinics added successfully!");
//       setClinics([
//         {
//           name: "",
//           address: "",
//           city: "",
//           state: "",
//           country: "",
//           postal_code: "",
//           phone: "",
//           email: "",
//           latitude: "",
//           longitude: "",
//           rating: "",
//           total_reviews: "",
//           monday_hours: "",
//           tuesday_hours: "",
//           wednesday_hours: "",
//           thursday_hours: "",
//           friday_hours: "",
//           saturday_hours: "",
//           sunday_hours: "",
//           enquire_link: "",
//           clinic_logo: null,
//         },
//       ]);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response.data.message || "Error adding clinics");
//     }
//   };

//   return (
//     <div className="container ">
//       {/* <h3 className="mb-4 text-primary text-center">Add Clinic Details</h3> */}

//       <form onSubmit={handleSubmit}>
//         {clinics.map((clinic, index) => (
//           <div key={index} className="card mb-4 ">
//             <div className="card-header d-flex justify-content-between align-items-center">
//               <h5 className="mb-0">Clinic #{index + 1}</h5>
//               {clinics.length > 1 && (
//                 <button
//                   type="button"
//                   className="btn btn-danger btn-sm"
//                   onClick={() => removeClinic(index)}
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>

//             <div className="card-body">
//               <div className="row">
//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Clinic Name</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="name"
//                     value={clinic.name}
//                     onChange={(e) => handleChange(index, e)}
//                     required
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Email</label>
//                   <input
//                     type="email"
//                     className="form-control"
//                     name="email"
//                     value={clinic.email}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Phone</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="phone"
//                     value={clinic.phone}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Clinic Logo</label>
//                   <input
//                     type="file"
//                     className="form-control"
//                     name="clinic_logo"
//                     accept="image/*"
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>

//                 <div className="col-md-12 mb-3">
//                   <label className="form-label">Address</label>
//                   <textarea
//                     className="form-control"
//                     name="address"
//                     rows="2"
//                     value={clinic.address}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">City</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="city"
//                     value={clinic.city}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">State</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="state"
//                     value={clinic.state}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>

//                 <div className="col-md-4 mb-3">
//                   <label className="form-label">Country</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="country"
//                     value={clinic.country}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Latitude</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="latitude"
//                     value={clinic.latitude}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Longitude</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="longitude"
//                     value={clinic.longitude}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>

//                 <h6 className="mt-4 mb-3">Working Hours</h6>
//                 {[
//                   "monday_hours",
//                   "tuesday_hours",
//                   "wednesday_hours",
//                   "thursday_hours",
//                   "friday_hours",
//                   "saturday_hours",
//                   "sunday_hours",
//                 ].map((day) => (
//                   <div className="col-md-6 mb-3" key={day}>
//                     <label className="form-label">
//                       {day.replace("_hours", "").charAt(0).toUpperCase() +
//                         day.replace("_hours", "").slice(1)}
//                     </label>
//                     <input
//                       type="text"
//                       className="form-control"
//                       name={day}
//                       placeholder="e.g. 09:00 - 13:00 or Enquire"
//                       value={clinic[day]}
//                       onChange={(e) => handleChange(index, e)}
//                     />
//                   </div>
//                 ))}

//                 <div className="col-md-6 mb-3">
//                   <label className="form-label">Enquire Link</label>
//                   <input
//                     type="text"
//                     className="form-control"
//                     name="enquire_link"
//                     value={clinic.enquire_link}
//                     onChange={(e) => handleChange(index, e)}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className="d-flex justify-content-between">
//           <button
//             type="button"
//             className="btn btn-outline-primary"
//             onClick={addClinic}
//           >
//             + Add Another Clinic
//           </button>
//           <button type="submit" className="btn btn-success">
//             Save Clinics
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

const AddClinics2 = () => {
  const userdata = JSON.parse(localStorage.getItem("user"));
  const [clinic, setClinic] = useState({
    doctor_id: userdata.id,
    name: "",
    address: "",
    city: "",
    // state: "",
    map_link: "",
    country: "",
    postal_code: "",
    phone: "",
    email: "",
    latitude: "",
    longitude: "",
    // enquire_link: "",
    clinic_logo: null,
    monday_hours: "",
    tuesday_hours: "",
    wednesday_hours: "",
    thursday_hours: "",
    friday_hours: "",
    saturday_hours: "",
    sunday_hours: "",
  });

  const [hours, setHours] = useState({
    monday: { start: "", end: "", enquire: false },
    tuesday: { start: "", end: "", enquire: false },
    wednesday: { start: "", end: "", enquire: false },
    thursday: { start: "", end: "", enquire: false },
    friday: { start: "", end: "", enquire: false },
    saturday: { start: "", end: "", enquire: false },
    sunday: { start: "", end: "", enquire: false },
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setClinic({
      ...clinic,
      [name]: files ? files[0] : value,
    });
  };

  const handleHourChange = (day, type, value) => {
    const updated = { ...hours, [day]: { ...hours[day], [type]: value } };
    setHours(updated);
  };

  const handleEnquireToggle = (day) => {
    const updated = {
      ...hours,
      [day]: {
        ...hours[day],
        enquire: !hours[day].enquire,
        start: "",
        end: "",
      },
    };
    setHours(updated);
  };

  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Fetch cities from API
    axios
      .get(`${Config.BASE_URL}/api/cities`)
      .then((response) => {
        const cityOptions = response.data?.data.map((item) => ({
          value: item.city_name,
          label: item.city_name,
        }));
        setCities(cityOptions);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });
  }, []);

  const handleCityChange = (selectedOption) => {
    setClinic({
      ...clinic,
      city: selectedOption ? selectedOption.value : "",
    });
  };

  const [countries, setCountries] = useState([]);

  // Fetch countries from API
  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const res = await axios.get(`${Config.BASE_URL}/api/countries`);
        if (res.data.status === true && Array.isArray(res.data.data)) {
          const fetchedCountries = res.data.data.map((country) =>
            country.country_name.trim()
          );
          setCountries(fetchedCountries);
        }
      } catch (error) {
        console.error("Error fetching nationalities:", error);
      }
    };

    fetchNationalities();
  }, []);
  // Handle React Select change
  const handleCountryChange = (selectedOption) => {
    setClinic((prev) => ({
      ...prev,
      country: selectedOption ? selectedOption.value : "",
    }));
  };
  const countryOptions = countries.map((country) => ({
    value: country,
    label: country,
  }));

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let day of Object.keys(hours)) {
      const h = hours[day];
      if (!h.enquire && (!h.start || !h.end)) {
        toast.error(`Please enter start and end time for ${day}`);
        return;
      }
    }

    const finalClinic = { ...clinic };

    // Combine hours into string format "09:00-17:00" or "Enquire"
    Object.keys(hours).forEach((day) => {
      const key = `${day}_hours`;
      if (hours[day].enquire) {
        finalClinic[key] = "unavailable";
      } else if (hours[day].start && hours[day].end) {
        finalClinic[key] = `${hours[day].start}-${hours[day].end}`;
      } else {
        finalClinic[key] = "";
      }
    });

    console.log("Final clinic data:", finalClinic);

    try {
      const formData = new FormData();
      for (const key in finalClinic) {
        formData.append(key, finalClinic[key]);
      }

      setLoading(true);
      await axios.post(`${Config.BASE_URL}/api/clinics`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Clinic added successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding clinic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Clinic Details</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Basic Info */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Clinic Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={clinic.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={clinic.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  maxLength={12}
                  value={clinic.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Clinic Logo</label>
                <input
                  type="file"
                  className="form-control"
                  name="clinic_logo"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  rows="2"
                  value={clinic.address}
                  onChange={handleChange}
                />
              </div>

              {/* <div className="col-md-4 mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={clinic.city}
                  onChange={handleChange}
                />
              </div> */}
              <div className="col-md-6 mb-3">
                <label className="form-label">City</label>
                <Select
                  options={cities}
                  value={cities.find((c) => c.value === clinic.city) || null}
                  onChange={handleCityChange}
                  placeholder="Select City"
                  isClearable
                  required
                  isSearchable
                  components={{ IndicatorSeparator: () => null }}
                />
              </div>

              {/* <div className="col-md-4 mb-3">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-control"
                  name="state"
                  value={clinic.state}
                  onChange={handleChange}
                />
              </div> */}

              <div className="col-md-6 mb-3">
                {/* <label className="form-label">Country</label>
                <input
                  type="text"
                  className="form-control"
                  name="country"
                  value={clinic.country}
                  onChange={handleChange}
                /> */}
                <label className="form-label">Country</label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.value === clinic.country
                  )}
                  onChange={handleCountryChange}
                  isClearable
                  isSearchable
                  components={{ IndicatorSeparator: () => null }}
                  placeholder="Select country"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Map Address Link</label>
                <input
                  type="text"
                  className="form-control"
                  name="map_link"
                  value={clinic.map_link}
                  onChange={handleChange}
                />
              </div>

              {/* Working Hours Section */}
              <h6 className="mt-4 mb-3">Working Hours (24-hour format)</h6>
              {Object.keys(hours).map((day) => (
                <div className="col-md-6 mb-3" key={day}>
                  <label className="form-label text-capitalize">
                    {day}{" "}
                    <input
                      type="checkbox"
                      checked={hours[day].enquire}
                      onChange={() => handleEnquireToggle(day)}
                      className="ms-2 me-1"
                    />
                    Unavailable
                  </label>

                  {!hours[day].enquire && (
                    <div className="d-flex gap-2">
                      <input
                        type="time"
                        className="form-control"
                        value={hours[day].start}
                        onChange={(e) =>
                          handleHourChange(day, "start", e.target.value)
                        }
                      />
                      <span className="align-self-center">to</span>
                      <input
                        type="time"
                        className="form-control"
                        value={hours[day].end}
                        onChange={(e) =>
                          handleHourChange(day, "end", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              ))}

              {/* <div className="col-md-6 mb-3">
                <label className="form-label">Enquire Link</label>
                <input
                  type="text"
                  className="form-control"
                  name="enquire_link"
                  value={clinic.enquire_link}
                  onChange={handleChange}
                />
              </div> */}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};
