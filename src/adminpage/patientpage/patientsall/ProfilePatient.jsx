import React, { useEffect, useState } from "react";

import { Form, Button, Table, Badge } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import Config from "../../../config";
import SidebarPatient from "../sidebarpatient/SidebarPatient";
import NavbarPatient from "../sidebarpatient/NavbarPatient";
import imageone from "../../../assets/admin/Group 1324.png";
import imagetwo from "../../../assets/admin/Rectangle 2388.png";
import imagetree from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import toast, { Toaster } from "react-hot-toast";
ChartJS.register(ArcElement, Tooltip, Legend);
const ProfilePatient = () => {
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    country: "",
    postcode: "",
    address: "",
    profile_image: "",
    gender: "",
    nationality: "",
    date_of_birth: "",
    imageFile: null, // actual File object
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    weight: "",
    age: "",
    height: "",
    gender: formData.gender,
    blood_type: "",
    heart_rate: "",
    temperature: "",
    glucose: "",
  });
  //  'gender'
  //       'nationality'
  //       'date_of_birth'

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        profile_image: URL.createObjectURL(file), // preview
      }));
    }
  };

  useEffect(() => {
    fetchAdditionalInfo();
    fetchPersonalInfo();
  }, []);

  const fetchAdditionalInfo = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/additional-info/${userData.id}`
      );
      console.log(response.data?.data, "responseresponse");

      const data = response.data?.data; // access the first record if exists
      if (data) {
        setAdditionalInfo({
          weight: data.weight || "",
          age: data.age || "",
          height: data.height || "",
          gender: data.gender || "",
          blood_type: data.blood_type || "",
          heart_rate: data.heart_rate || "",
          temperature: data.temperature || "",
          glucose: data.glucose || "",
        });
      }
    } catch (error) {
      console.error("Error fetching additional info", error);
    } finally {
    }
  };

  const fetchPersonalInfo = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/profile/${userData.id}`
      );
      const data = response.data;
      setFormData({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        mobile_number: data.mobile_number || "",
        email: data.email || "",
        address: data.address || "",
        profile_image: data.profile_image || "",
        gender: data.gender || "",
        country: data.country || "",
        postcode: data.postcode || "",
        nationality: data.nationality || "",
        date_of_birth: data.date_of_birth || "",
      });
    } catch (error) {
      console.error("Error fetching info", error);
    }
  };

  const handleChangeinfo = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update handler
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("firstname", formData.firstname);
      payload.append("lastname", formData.lastname);
      payload.append("email", formData.email);
      payload.append("mobile_number", formData.mobile_number);
      payload.append("address", formData.address);
      payload.append("gender", formData.gender);
      payload.append("country", formData.country);
      payload.append("postcode", formData.postcode);
      payload.append("nationality", formData.nationality);
      payload.append("date_of_birth", formData.date_of_birth);
      if (formData.imageFile) {
        payload.append("profile_image", formData.imageFile); // file upload
      }

      await axios.post(
        `${Config.BASE_URL}/api/profile/update/${userData.id}`,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update error", error);
      toast.error("Failed to update profile.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdditionalInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault(); // <-- This line prevents the form from changing the URL

    try {
      const payload = {
        patient_id: userData.id,
        ...additionalInfo,
      };

      const response = await axios.post(
        `${Config.BASE_URL}/api/additional-info`,
        payload
      );

      if (response.data.success) {
        toast.success("✅ Additional Information saved successfully");
      }
    } catch (error) {
      console.error("Error saving additional info", error);
      toast.error("❌ Failed to save additional information");
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

  // const nationalities = [
  //   "Afghan",
  //   "Albanian",
  //   "Algerian",
  //   "American",
  //   "Andorran",
  //   "Angolan",
  //   "Argentine",
  //   "Armenian",
  //   "Australian",
  //   "Austrian",
  //   "Azerbaijani",
  //   "Bahamian",
  //   "Bahraini",
  //   "Bangladeshi",
  //   "Barbadian",
  //   "Belarusian",
  //   "Belgian",
  //   "Belizean",
  //   "Beninese",
  //   "Bhutanese",
  //   "Bolivian",
  //   "Bosnian",
  //   "Brazilian",
  //   "British",
  //   "Bruneian",
  //   "Bulgarian",
  //   "Burkinabé",
  //   "Burmese",
  //   "Burundian",
  //   "Cambodian",
  //   "Cameroonian",
  //   "Canadian",
  //   "Cape Verdean",
  //   "Central African",
  //   "Chadian",
  //   "Chilean",
  //   "Chinese",
  //   "Colombian",
  //   "Comorian",
  //   "Congolese",
  //   "Costa Rican",
  //   "Croatian",
  //   "Cuban",
  //   "Cypriot",
  //   "Czech",
  //   "Danish",
  //   "Djiboutian",
  //   "Dominican",
  //   "Dutch",
  //   "East Timorese",
  //   "Ecuadorean",
  //   "Egyptian",
  //   "Emirati",
  //   "Equatorial Guinean",
  //   "Eritrean",
  //   "Estonian",
  //   "Ethiopian",
  //   "Fijian",
  //   "Filipino",
  //   "Finnish",
  //   "French",
  //   "Gabonese",
  //   "Gambian",
  //   "Georgian",
  //   "German",
  //   "Ghanaian",
  //   "Greek",
  //   "Grenadian",
  //   "Guatemalan",
  //   "Guinean",
  //   "Guyanese",
  //   "Haitian",
  //   "Honduran",
  //   "Hungarian",
  //   "Icelandic",
  //   "Indian",
  //   "Indonesian",
  //   "Iranian",
  //   "Iraqi",
  //   "Irish",
  //   "Israeli",
  //   "Italian",
  //   "Ivorian",
  //   "Jamaican",
  //   "Japanese",
  //   "Jordanian",
  //   "Kazakh",
  //   "Kenyan",
  //   "Kuwaiti",
  //   "Kyrgyz",
  //   "Laotian",
  //   "Latvian",
  //   "Lebanese",
  //   "Liberian",
  //   "Libyan",
  //   "Lithuanian",
  //   "Luxembourger",
  //   "Macedonian",
  //   "Malagasy",
  //   "Malawian",
  //   "Malaysian",
  //   "Maldivian",
  //   "Malian",
  //   "Maltese",
  //   "Mauritanian",
  //   "Mauritian",
  //   "Mexican",
  //   "Moldovan",
  //   "Monégasque",
  //   "Mongolian",
  //   "Montenegrin",
  //   "Moroccan",
  //   "Mozambican",
  //   "Namibian",
  //   "Nepalese",
  //   "New Zealander",
  //   "Nicaraguan",
  //   "Nigerien",
  //   "Nigerian",
  //   "North Korean",
  //   "Norwegian",
  //   "Omani",
  //   "Pakistani",
  //   "Palestinian",
  //   "Panamanian",
  //   "Papua New Guinean",
  //   "Paraguayan",
  //   "Peruvian",
  //   "Polish",
  //   "Portuguese",
  //   "Qatari",
  //   "Romanian",
  //   "Russian",
  //   "Rwandan",
  //   "Saint Lucian",
  //   "Salvadoran",
  //   "Samoan",
  //   "Saudi",
  //   "Scottish",
  //   "Senegalese",
  //   "Serbian",
  //   "Seychellois",
  //   "Sierra Leonean",
  //   "Singaporean",
  //   "Slovak",
  //   "Slovenian",
  //   "Somali",
  //   "South African",
  //   "South Korean",
  //   "Spanish",
  //   "Sri Lankan",
  //   "Sudanese",
  //   "Surinamese",
  //   "Swazi",
  //   "Swedish",
  //   "Swiss",
  //   "Syrian",
  //   "Taiwanese",
  //   "Tajik",
  //   "Tanzanian",
  //   "Thai",
  //   "Togolese",
  //   "Tongan",
  //   "Trinidadian",
  //   "Tunisian",
  //   "Turkish",
  //   "Turkmen",
  //   "Ugandan",
  //   "Ukrainian",
  //   "Uruguayan",
  //   "Uzbek",
  //   "Venezuelan",
  //   "Vietnamese",
  //   "Welsh",
  //   "Yemeni",
  //   "Zambian",
  //   "Zimbabwean",
  // ];

  const [nationalities, setNationalities] = useState([]);

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const res = await axios.get(`${Config.BASE_URL}/api/countries`);
        if (res.data.status === true && Array.isArray(res.data.data)) {
          const fetchedNationalities = res.data.data.map((country) =>
            country.country_name.trim()
          );
          setNationalities(fetchedNationalities);
        }
      } catch (error) {
        console.error("Error fetching nationalities:", error);
      }
    };

    fetchNationalities();
  }, []);
  return (
    <>
      <Toaster />
      <div className="d-flex">
        <SidebarPatient />
        <div className="flex-grow-1 content-area">
          <NavbarPatient />
          <div className=" container bgcolor mb-5">
            <div className="row">
              <div className="col-lg-12">
                <div className="profile-card p-4 shadow-sm rounded bg-white">
                  <div className="text-center position-relative mb-4">
                    <div className="row align-items-center ">
                      {/* <div className="col-lg-2 text-center mb-2 position-relative">
                        <img
                          src={
                            formData.profile_image?.startsWith("blob:")
                              ? formData.profile_image
                              : formData.profile_image
                              ? `${Config.BASE_URL}/${formData.profile_image}`
                              : formData.gender === "Female"
                              ? female
                              : male
                          }
                          alt="Profile"
                          className="profile-img rounded-circle"
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            border: "4px solid #007bff",
                          }}
                        />
                        <label
                          htmlFor="profileImageInput"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            background: "#fff",
                            borderRadius: "50%",
                            padding: "4px",
                            cursor: "pointer",
                          }}
                        >
                          <i className="fa fa-pencil-alt"></i>
                        </label>
                        <input
                          id="profileImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                      </div> */}

                      <div className="col-lg-2 text-center mb-2">
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={
                              formData.profile_image?.startsWith("blob:")
                                ? formData.profile_image
                                : formData.profile_image
                                ? `${Config.BASE_URL}/${formData.profile_image}`
                                : formData.gender === "Female"
                                ? female
                                : male
                            }
                            alt="Profile"
                            className="profile-img rounded-circle"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              border: "4px solid #007bff",
                            }}
                          />
                          <label
                            htmlFor="profileImageInput"
                            style={{
                              position: "absolute",
                              bottom: "0",
                              right: "0",
                              background: "#fff",
                              borderRadius: "50%",
                              padding: "6px",
                              cursor: "pointer",
                              boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                            }}
                          >
                            <i className="fa fa-pencil-alt"></i>
                          </label>
                        </div>

                        <input
                          id="profileImageInput"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          style={{ display: "none" }}
                        />
                      </div>

                      <div className="col-lg-3">
                        <h3 className="mt-3">
                          {formData.firstname} {formData.lastname}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <h5 className="section-heading">Personal Information</h5>
                  <Form onSubmit={handleUpdate}>
                    <div className="row">
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleChangeinfo}
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleChangeinfo}
                        />
                      </Form.Group>

                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Mobile Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="mobile_number"
                          maxLength={10}
                          value={formData.mobile_number}
                          onChange={(e) => {
                            const input = e.target.value;
                            // Allow only numbers and max 10 digits
                            if (/^\d{0,10}$/.test(input)) {
                              setFormData({
                                ...formData,
                                mobile_number: input,
                              });
                            }
                          }}
                        />
                      </Form.Group>

                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChangeinfo}
                          disabled
                        />
                      </Form.Group>

                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Country</Form.Label>
                        {/* <Form.Control
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChangeinfo}
                        /> */}

                        <Form.Select
                          name="country"
                          value={formData.country}
                          onChange={handleChangeinfo}
                          className="dropdown-scroll"
                          required
                        >
                          <option value="">Select Nationality</option>
                          {nationalities.map((nation) => (
                            <option key={nation} value={nation}>
                              {nation}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Post Code</Form.Label>
                        <Form.Control
                          type="text"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChangeinfo}
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Home address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChangeinfo}
                        />
                      </Form.Group>

                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChangeinfo}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Nationality</Form.Label>
                        <Form.Select
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChangeinfo}
                          className="dropdown-scroll"
                          required
                        >
                          <option value="">Select Nationality</option>
                          {nationalities.map((nation) => (
                            <option key={nation} value={nation}>
                              {nation}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control
                          type="date"
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChangeinfo}
                        />
                      </Form.Group>
                    </div>

                    <div className="save-btn-container">
                      <button className="save-btn" type="submit">
                        Save
                      </button>
                    </div>
                  </Form>

                  {/* <h5 className="section-heading">additional Information</h5>

                  <Form onSubmit={handleSave}>
                    <div className="row">
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label className="form-label">Weight</Form.Label>
                        <Form.Control
                          type="text"
                          name="weight"
                          value={additionalInfo.weight || ""}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label className="form-label">Height</Form.Label>
                        <Form.Control
                          type="text"
                          name="height"
                          value={additionalInfo.height || ""}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label className="form-label">Age</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={additionalInfo.age || ""}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label className="form-label">
                          Blood Type
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="blood_type"
                          value={additionalInfo.blood_type || ""}
                          onChange={handleChange}
                          className="form-input"
                        />
                      </Form.Group>
                    </div>

                    <div className="save-btn-container mt-3 text-end">
                      <button
                        type="submit"
                        className="btn save-btn"
                        // onClick={handleSave}
                      >
                        Save
                      </button>
                    </div>
                  </Form> */}
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
                                <small>{user.mobile_number}</small>
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

      {/* Inline CSS */}
      <style>
        {`
.dropdown-scroll {
  height: auto; /* Let it auto-expand */
  max-height: 100px; /* Set max height */
  overflow-y: auto; /* Enable vertical scroll */
}

        .save-btn-container {
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  background-color: #4d6aff;
  color: white;
  padding: 10px 24px;
  border-radius: 24px;
  border: 2px solid #4d6aff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}
          .profile-card {
            background-color: #fff;
            border-radius: 16px;
          }

        

          .section-heading {
            border-bottom: 2px solid #eee;
            padding-bottom: 6px;
            margin-bottom: 20px;
            color: #333;
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

export default ProfilePatient;
