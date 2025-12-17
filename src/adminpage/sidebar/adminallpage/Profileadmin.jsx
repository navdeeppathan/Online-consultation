import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Select from "react-select";
import { Form, Button, Table, Badge, Modal } from "react-bootstrap";
import "react-calendar/dist/Calendar.css";
import Config from "../../../config";
import userimage from "../../../assets/images/userimage.jpg";
import imageone from "../../../assets/admin/Group 1324.png";
import imagetwo from "../../../assets/admin/Rectangle 2388.png";
import imagetree from "../../../assets/admin/9112769_clinic_medical_solid_icon 1.png";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import axios from "axios";
import Attachments from "../../../assets/admin/8684777_pdf_file_format_extension_document_icon 1.png";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import addClinic from "../../../assets/images/addclinic.png";

import toast, { Toaster } from "react-hot-toast";
import AddClinics from "../../../pages/AddClinics";
import DoctorSkills from "../../../pages/DoctorSkills";
import { Editor } from "primereact/editor";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { FaEdit, FaTrash, FaTrashAlt } from "react-icons/fa";
import { Box, CircularProgress } from "@mui/material";

ChartJS.register(ArcElement, Tooltip, Legend);
const ProfileAdmin = () => {
  // const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [userData, setUserData] = useState(user);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    mobile_number: "",
    address: "",
    profile_image: "",
    gender: "",
    nationality: "",
    date_of_birth: "",
    aboutus: "",
    imageFile: null, // actual File object
  });

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

  const [qualifications, setQualifications] = useState([]);
  useEffect(() => {
    fetchPersonalInfo();
  }, []);
  const fetchPersonalInfo = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/profile/${user.id}`
      );
      const data = response.data;
      console.log("personal Info:-", data);
      setFormData({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        mobile_number: data.mobile_number || "",
        email: data.email || "",
        address: data.personal_information?.home_address || "",
        profile_image: data.profile_image || "",
        gender: data.gender || "",
        nationality: data.nationality || "",
        date_of_birth: data.date_of_birth || "",
        aboutus: data.aboutus || "",
      });
      setQualifications(data?.qualifications || []);
    } catch (error) {
      console.error("Error fetching info", error);
    }
  };

  const handleChangeinfo = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [isEditing, setIsEditing] = useState(false);

  const handleEditorChange = useCallback(
    (e) => {
      setFormData((prev) => ({ ...prev, aboutus: e.htmlValue }));
    },
    [] // no dependencies, keeps function stable
  );
  const handleEditorSave = () => {
    setIsEditing(false);
    //  Optionally call API here to save formData.aboutus
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
      payload.append("nationality", formData.nationality);
      payload.append("date_of_birth", formData.date_of_birth);
      payload.append("aboutus", formData.aboutus);
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
    AllDoctorAll();
  }, []);

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

  const AllDoctorAll = () => {
    axios
      .get(`${Config.BASE_URL}/api/doctor/${user.id}`)
      .then((resp) => {
        // setDoctor(resp.data);
        console.log("resp.data of doctor:-", resp.data?.data);
        setUserData(resp.data?.data?.doctor);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedQualid, setSelectedQualid] = useState(null);
  const [selectedQual, setSelectedQual] = useState({
    degree: "",
    institution: "",
    country: "",
    year_completed: "",
  });

  // Fetch qualification by ID
  const handleEdit = async (id) => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/qualifications/${id}`
      );
      console.log("resresres", res.data?.data);
      const qualData = res.data.data;
      setSelectedQualid(qualData.id);
      setSelectedQual({
        degree: qualData.degree,
        institution: qualData.institution,
        country: qualData.country,
        year_completed: qualData.year_completed,
      });

      setShowModal(true);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching qualification");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this qualification?"))
      return;
    try {
      await axios.delete(`${Config.BASE_URL}/api/qualifications/${id}`);
      toast.success("Qualification deleted successfully");
      fetchPersonalInfo();
      // trigger a state update or refetch userData
    } catch (error) {
      console.error(error);
      alert("Error deleting qualification");
    }
  };

  // Save the updated qualification
  const handleSave = async () => {
    const payload = {
      user_id: user.id,
      id: selectedQualid,
      qualifications: [selectedQual],
    };
    try {
      await axios.post(`${Config.BASE_URL}/api/user-qualification`, payload); // update endpoint
      setShowModal(false);
      AllDoctorAll();
      toast.success("Qualification updated successfully");
      // trigger a state update or refetch userData
    } catch (error) {
      console.error(error);
      toast.error("Error updating qualification");
    }
  };

  const labels = [
    "Medical Degree",
    "GMC Certificate",
    "Proof of Identity",
    "DBS Certificate",
    "Medical Indemnity Insurance",
  ];

  const [showModaldoc, setShowModaldoc] = useState(false);
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const fetchDocuments = async (id) => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/documents/${id}`);
      // Assuming the API returns { data: { file_path: "storage/..." } }
      const filePath = res.data.data.file_path;
      setSelectedFilePath(`${Config.BASE_URL}/storage/app/public/${filePath}`);
      setShowPreviewModal(true);
    } catch (error) {
      console.error(error);
      alert("Error fetching document");
    }
  };

  const handleAdd = async () => {
    if (!docType || !file) {
      return alert("Please select a document type and file");
    }

    const formData = new FormData();
    formData.append("user_id", user?.id);
    formData.append("document_type", docType);
    formData.append("file", file);

    try {
      await axios.post(`${Config.BASE_URL}/api/user-document`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Document uploaded successfully");
      setShowModaldoc(false);
      setDocType("");
      setFile(null);
      AllDoctorAll();
    } catch (error) {
      console.error(error);
      toast.error("Error uploading document");
    }
  };

  const handleDeleteDoc = async (id) => {
    try {
      await axios.delete(`${Config.BASE_URL}/api/documents/${id}`);
      toast.success("Deleted successfully");
      AllDoctorAll();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting document");
    }
  };

  {
    /* <td>{a.date}</td>
          <td>{a.start_time}</td>
          <td>{a.end_time}</td>
          <td>{a.consultation_modes?.join(", ")}</td>
          <td>{a.preferred_languages?.join(", ")}</td> */
  }

  const [showClinic, setShowClinic] = useState(false);
  return (
    <>
      <Toaster />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 content-area">
          <Navbar />
          <div className="bgcolor p-3 mb-5 ">
            <div className="row">
              <div className="col-lg-12">
                <div className="profile-card p-4 shadow-sm rounded bg-white">
                  {/* Profile Image & Info */}
                  <div className=" position-relative mb-4">
                    <div className="row align-items-center">
                      {/* <div className="col-lg-2 text-center mb-2 position-relative">
                        <img
                          src={
                            formData.profile_image
                              ? formData.profile_image.startsWith("blob:")
                                ? formData.profile_image
                                : `${Config.BASE_URL}/${formData.profile_image}`
                              : formData.gender === "Female"
                              ? female
                              : male
                          }
                          alt="Profile"
                          className="profile-img rounded-circle"
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            border: "4px solid #007bff",
                          }}
                        />
                        <label
                          htmlFor="profileImageInput"
                          className="editicon"
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
                      <div
                        className="col-lg-2 text-center mb-2 position-relative"
                        style={{ display: "inline-block" }}
                      >
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={
                              formData.profile_image
                                ? formData.profile_image.startsWith("blob:")
                                  ? formData.profile_image
                                  : `${Config.BASE_URL}/${formData.profile_image}`
                                : formData.gender === "Female"
                                ? female
                                : male
                            }
                            alt="Profile"
                            className="profile-img rounded-circle"
                            style={{
                              width: "90px",
                              height: "90px",
                              objectFit: "cover",
                              border: "4px solid #007bff",
                            }}
                          />

                          <label
                            htmlFor="profileImageInput"
                            className="editicon"
                            style={{
                              position: "absolute",
                              bottom: "0", // place near bottom-right of image
                              right: "0",
                              background: "#fff",
                              borderRadius: "50%",
                              padding: "4px",
                              cursor: "pointer",
                              boxShadow: "0 0 4px rgba(0,0,0,0.2)",
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
                        </div>
                      </div>

                      <div className="col-lg-3 doctorname">
                        <h3 className="mt-3 doctorname">
                          {formData.firstname} {formData.lastname}
                        </h3>
                        {/* {userData.professional_registration?.specialization ||
                          ""} */}
                        {JSON.parse(
                          userData.professional_registration?.specialization ||
                            "[]"
                        ).join(", ")}
                      </div>
                      <div className="col-lg-2"></div>
                      {/* <div className="col-lg-5">
                        <div className="documentsurl">
                          <h6 className="fw-bold">
                            <img
                              src={Attachments}
                              alt="Attachments"
                              className="mx-2"
                            />
                            My Attachments
                          </h6>
                          {userData.documents?.map((doc, index) => {
                            const fullUrl = `${Config.BASE_URL}/storage/app/public/${doc.file_path}`;
                            return (
                              <div className="col-md-12" key={index}>
                                <div className="">
                                  <p className="mb-0 fw-bold">
                                    {doc.document_type}
                                  </p>

                                  <a
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary text-decoration-underline"
                                    onClick={() => fetchDocuments(doc.id)}
                                  >
                                    {"..." + fullUrl.slice(-20)}
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div> */}
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
                          readOnly
                        />
                      </Form.Group>

                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          disabled
                          value={formData.email}
                          onChange={handleChangeinfo}
                        />
                      </Form.Group>

                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Address</Form.Label>
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
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Nationality</Form.Label>
                        {/* <Form.Control
                          type="text"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChangeinfo}
                        /> */}
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

                      <Form.Group className="mb-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Form.Label>
                            <strong>My Profile</strong>
                          </Form.Label>
                          {/* Toggle Buttons */}
                          {!isEditing ? (
                            <div className="d-flex justify-content-end ">
                              <Button
                                variant="primary"
                                onClick={() => setIsEditing(true)}
                                className="d-flex align-items-center gap-2"
                              >
                                <FaEdit />
                                Edit
                              </Button>
                            </div>
                          ) : (
                            <div className="d-flex justify-content-end gap-2 ">
                              <Button
                                variant="success"
                                onClick={handleEditorSave}
                              >
                                Save
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={() => setIsEditing(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </div>

                        {/*  When NOT editing: show rendered HTML */}
                        {!isEditing ? (
                          <div
                            className="p-3 border rounded bg-light"
                            style={{
                              minHeight: "150px",
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: formData.aboutus,
                              }}
                            />
                          </div>
                        ) : (
                          //  When editing: show rich text editor
                          <Editor
                            value={formData.aboutus}
                            onTextChange={handleEditorChange}
                            style={{
                              height: "300px",
                              backgroundColor: "white",
                            }}
                            placeholder="Enter description about yourself"
                          />
                        )}
                      </Form.Group>
                    </div>

                    <div className="save-btn-container">
                      <button className="save-btn" type="submit">
                        Save
                      </button>
                    </div>
                  </Form>
                  {/* Section: Professional Registration */}
                  <h5 className="section-heading mt-4">
                    Professional Registration
                  </h5>
                  <Form>
                    <div className="row">
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>GMC Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            userData.professional_registration
                              ?.gmc_registration_number || ""
                          }
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>GMC Registration Date</Form.Label>
                        <Form.Control
                          type="date"
                          value={
                            userData.professional_registration
                              ?.gmc_registration_date || ""
                          }
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Specialization</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            userData.professional_registration?.specialization
                              ? JSON.parse(
                                  userData.professional_registration
                                    .specialization
                                ).join(", ")
                              : ""
                          }
                          readOnly
                        />
                      </Form.Group>
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Experience (years)</Form.Label>
                        <Form.Control
                          type="number"
                          value={
                            userData.professional_registration
                              ?.years_of_experience || ""
                          }
                          readOnly
                        />
                      </Form.Group>
                    </div>
                  </Form>
                  {/* Section: Qualifications */}
                  {/* <h5 className="section-heading mt-4">Qualifications</h5> */}
                  <Qualifications userId={userData.id} />
                  <div className="table-responsive">
                    <table className="table table-striped custom-table approvedtable">
                      <thead>
                        <tr>
                          <th>Degree</th>
                          <th>Institution</th>
                          <th>Country</th>
                          <th>Year</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qualifications?.map((q, index) => (
                          <tr key={index}>
                            <td>{q.degree}</td>
                            <td>{q.institution}</td>
                            <td>{q.country}</td>
                            <td>{q.year_completed}</td>
                            <td>
                              <i
                                className="fas fa-edit me-1"
                                onClick={() => handleEdit(q.id)}
                              ></i>

                              <i
                                className="fas fa-trash-alt mx-4"
                                onClick={() => handleDelete(q.id)}
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Section: Documents */}
                  <h5 className="section-heading mt-4"> Required Documents</h5>
                  <div className="row">
                    {userData.documents?.map((doc, index) => (
                      <div className="col-md-4 mb-3" key={index}>
                        <div className="border p-2 rounded text-center">
                          <p className="mb-1 fw-bold">{doc.document_type}</p>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-decoration-underline"
                            onClick={() => fetchDocuments(doc.id)}
                          >
                            {doc.file_path.slice(-20)}
                          </a>
                          <button
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 mt-1 me-1"
                            onClick={() => handleDeleteDoc(doc.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                    <div className="d-flex justify-content-end align-items-center mb-3">
                      <button
                        className="btn btn-primary"
                        onClick={() => setShowModaldoc(true)}
                      >
                        + Add Document
                      </button>
                    </div>
                  </div>
                  {/* Section: Employment Status */}
                  <h5 className="section-heading mt-4">Employment Status</h5>
                  <Form>
                    <div className="row">
                      {/* <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Previous Roles</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            userData.employment_status?.previous_roles || ""
                          }
                          readOnly
                        />
                      </Form.Group> */}
                      {/* <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Insurance Number</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            userData.employment_status
                              ?.national_insurance_number || ""
                          }
                          readOnly
                        />
                      </Form.Group> */}
                      <Form.Group className="col-md-6 mb-3">
                        <Form.Label>Work Status in UK</Form.Label>
                        <Form.Control
                          type="text"
                          value={
                            userData.employment_status?.work_status_uk || ""
                          }
                          readOnly
                        />
                      </Form.Group>
                    </div>
                  </Form>
                  {/* Section: Availability */}
                  <div className="d-flex flex-wrap align-items-center justify-content-between mt-4 gap-2">
                    <h5 className="section-heading mb-0">Hospital Details</h5>
                    <button
                      className="btn btn-primary"
                      onClick={() => setShowClinic(!showClinic)}
                      style={{
                        // background:
                        //   "linear-gradient(90deg, #4C6BE9 0%, #3046A2 100%)",
                        border: "none",
                        padding: "8px 20px",
                        borderRadius: "8px",
                        fontSize: "15px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {showClinic ? "Hide Hospital" : "Add Hospital"}
                    </button>
                  </div>
                  {showClinic && <AddClinics2 setShowClinic={setShowClinic} />}
                  <ClinicList
                    clinics={userData?.clinics}
                    fetchClinics={AllDoctorAll}
                  />
                  {/* <h5 className="section-heading mt-4">Skills</h5>
                  <DoctorSkills /> */}
                  {/* Section: Declaration */}
                  <h5 className="section-heading mt-4">Declaration</h5>
                  <ul className="list-group">
                    {[
                      {
                        key: "confirm_truth",
                        label:
                          "I confirm that all information provided is true and accurate to the best of my knowledge.",
                      },
                      {
                        key: "consent_verify",
                        label:
                          "I give consent for Yodoc to verify my credentials and Where are we asking for referees?",
                      },
                      {
                        key: "consent_gdpr",
                        label:
                          "I consent to my data being processed in accordance with the UK GDPR and the Data Protection Act 2018.",
                      },
                      {
                        key: "insurance_valid",
                        label:
                          "I have valid medical indemnity insurance covering online consultations.",
                      },
                      {
                        key: "agree_gmc",
                        label:
                          "I agree to abide by the General Medical Council (GMC) Good Medical Practice guidelines.",
                      },
                    ].map((item) => (
                      <li key={item.key} className="list-group-item">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={item.key}
                            checked={userData?.declaration?.[item.key] || false}
                            disabled
                            style={{ transform: "scale(1.2)" }}
                          />
                          <label
                            htmlFor={item.key}
                            style={{
                              display: "inline-block",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              fontSize: "0.95rem",
                            }}
                          >
                            {item.label}
                          </label>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
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
          </div>
        </div>
      </div>

      {/* Inline CSS */}
      <style>
        {`

          @media (min-width: 900px) and (max-width: 1370px) {
          .doctorname{
          font-size:15px;
          // margin-left:10px;
          }
          .editicon{
          margin-right:-10px;
          }
          }

          @media (min-width: 1536px) and (max-width: 1600px) {
          .editicon{
          margin-right:10px;
          }
          }

          @media (min-width: 1366px) and (max-width: 1440px) {

          }



      .documentimg{
      width:200px;
      height:200px;

              }

              
      .documentsurl{
      background-color: #E0EAF3;
      border-radius: 15px;
      padding: 10px;
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
.bgcolor{
                background-color: #F7F9FC;
                // height: 100vh;
  width: 100%;
                
            }
  
.content-area {
  width: 100%;
}
          
        `}
      </style>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Qualification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Degree</Form.Label>
              <Form.Control
                type="text"
                value={selectedQual.degree}
                onChange={(e) =>
                  setSelectedQual({ ...selectedQual, degree: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Institution</Form.Label>
              <Form.Control
                type="text"
                value={selectedQual.institution}
                onChange={(e) =>
                  setSelectedQual({
                    ...selectedQual,
                    institution: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={selectedQual.country}
                onChange={(e) =>
                  setSelectedQual({ ...selectedQual, country: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year Completed</Form.Label>
              <Form.Control
                type="number"
                value={selectedQual.year_completed}
                onChange={(e) =>
                  setSelectedQual({
                    ...selectedQual,
                    year_completed: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showModaldoc} onHide={() => setShowModaldoc(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Document Type</Form.Label>
            <Form.Select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              <option value="" disabled>
                -- Select a document --
              </option>
              {labels.map((label, index) => (
                <option key={index} value={label}>
                  {label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload File</Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModaldoc(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            Upload
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPreviewModal}
        onHide={() => setShowPreviewModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Document Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ minHeight: "500px" }}>
          {/* {selectedFilePath ? (
            <iframe
              src={selectedFilePath}
              title="Preview"
              style={{ width: "100%", height: "500px", border: "none" }}
            ></iframe>
          ) : (
            <p>Loading file...</p>
          )} */}

          {selectedFilePath ? (
            selectedFilePath.match(/\.(jpg|jpeg|png|gif)$/i) ? (
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
      </Modal>
    </>
  );
};

export default ProfileAdmin;

const AddClinics2 = ({ setShowClinic }) => {
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

      toast.success("Hospital added successfully!");
      setShowClinic(false);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error adding clinic");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <form onSubmit={handleSubmit}>
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Add Hospital</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Basic Info */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Hospital Name</label>
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
                <label className="form-label">Hospital Logo</label>
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
                    <div className="d-flex flex-column flex-sm-row gap-2">
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

const Qualifications = ({ userId }) => {
  const [qualifications, setQualifications] = useState([]);
  const [loading2, setLoading2] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newQualification, setNewQualification] = useState({
    degree: "",
    institution: "",
    country: "",
    year_completed: "",
  });

  // Open/close modal
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewQualification({
      degree: "",
      institution: "",
      country: "",
      year_completed: "",
    });
  };

  // Add qualification from modal
  const handleAddQualification = () => {
    if (!newQualification.degree || !newQualification.country) {
      toast.error("Please fill all required fields.");
      return;
    }
    setQualifications([...qualifications, newQualification]);
    handleCloseModal();
  };

  // Handle input changes inside modal
  const handleChangeModal = (e) => {
    setNewQualification({
      ...newQualification,
      [e.target.name]: e.target.value,
    });
  };

  // Delete qualification
  const handleDelete = (index) => {
    const updated = [...qualifications];
    updated.splice(index, 1);
    setQualifications(updated);
  };

  // Submit all qualifications
  const handleSubmit3 = async () => {
    try {
      setLoading2(true);

      if (qualifications.some((q) => !q.degree || !q.country)) {
        toast.error("Please fill all required fields.");
        setLoading2(false);
        return;
      }

      const res = await axios.post(
        `${Config.BASE_URL}/api/user-qualification`,
        {
          user_id: userId,
          qualifications,
        }
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading2(false);
    }
  };

  const handleSaveQualification = async () => {
    if (!newQualification.degree || !newQualification.country) {
      toast.error("Please fill all required fields (Degree & Country).");
      return;
    }

    try {
      setLoading2(true);

      console.log("newqualification:-", newQualification);

      // Send this single qualification to backend
      const res = await axios.post(
        `${Config.BASE_URL}/api/user-qualification`,
        {
          user_id: userId,
          qualifications: [newQualification], // wrap in array
        }
      );

      toast.success(res.data.message || "Qualification saved successfully.");

      // Add to local state so UI updates
      setQualifications([...qualifications, newQualification]);

      handleCloseModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading2(false);
    }
  };

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchNationalities = async () => {
      try {
        const res = await axios.get(`${Config.BASE_URL}/api/countries`);
        if (res.data.status === true && Array.isArray(res.data.data)) {
          const options = res.data.data.map((country) => ({
            value: country.country_name.trim(),
            label: country.country_name.trim(),
          }));
          setCountries(options);
        }
      } catch (error) {
        console.error("Error fetching nationalities:", error);
      }
    };

    fetchNationalities();
  }, []);

  const handleChange = (selectedOption) => {
    setNewQualification({
      ...newQualification,
      country: selectedOption ? selectedOption.value : "",
    });
  };

  // Set the selected option based on current value
  const selectedCountry =
    countries.find((c) => c.value === newQualification.country) || null;

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
        <h5 className="section-heading mb-2 mb-md-0">Qualifications</h5>
        <Button variant="secondary" onClick={handleOpenModal}>
          Add Qualification
        </Button>
      </div>

      {/* List of existing qualifications */}
      {qualifications.map((q, index) => (
        <div key={index} className="qualification-box p-3 mb-4 border">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0">
              {q.degree} - {q.country}
            </h6>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(index)}
            >
              Delete
            </Button>
          </div>
          {q.institution && <p className="mb-0">{q.institution}</p>}
        </div>
      ))}

      {/* Submit button */}
      {/* <div className="mb-3">
        <Button variant="primary" onClick={handleSubmit3} disabled={loading2}>
          {loading2 ? (
            <>
              <CircularProgress size={20} color="inherit" className="me-2" />
              Submitting...
            </>
          ) : (
            "Save Qualifications"
          )}
        </Button>
      </div> */}

      {/* Modal for adding qualification */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Qualification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label>
              Degree/Qualification <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              name="degree"
              className="form-control"
              required
              value={newQualification.degree}
              onChange={handleChangeModal}
            />
          </div>
          <div className="mb-3">
            <label>Institution</label>
            <input
              type="text"
              name="institution"
              required
              className="form-control"
              value={newQualification.institution}
              onChange={handleChangeModal}
            />
          </div>
          <div className="mb-3">
            <label>
              Country <span className="text-danger">*</span>
            </label>
            {/* <input
              type="text"
              name="country"
              required
              className="form-control"
              value={newQualification.country}
              onChange={handleChangeModal}
            /> */}
            <Select
              value={selectedCountry}
              required
              onChange={handleChange}
              options={countries}
              isClearable
              isSearchable
              components={{ IndicatorSeparator: () => null }}
              placeholder="Select country"
            />
          </div>
          <div className="mb-3">
            <label>Year Completed</label>
            <input
              type="number"
              name="year_completed"
              className="form-control"
              value={newQualification.year_completed}
              onChange={handleChangeModal}
              placeholder="e.g., 2023"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveQualification}
            disabled={loading2}
          >
            {loading2 ? (
              <>
                <CircularProgress size={20} color="inherit" className="me-2" />
                Saving...
              </>
            ) : (
              "Save"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

// const ClinicList = ({ clinics }) => {
//   const columnClass =
//     clinics?.length === 1
//       ? "col-12" // Full width if only one clinic
//       : clinics?.length === 2
//       ? "col-md-6 col-12" // Half width if two clinics
//       : "col-md-4 col-12"; // Default 3 per row

//   return (
//     <div className="container mt-4">
//       <div className="row">
//         {clinics?.map((clinic, index) => (
//           <div className={`${columnClass} mb-4`} key={index}>
//             <div className="card clinic-card shadow-sm border-0 h-100">
//               <div className="card-body text-center">
//                 <img
//                   src={
//                     clinic.clinic_logo
//                       ? `${Config.BASE_URL}/${clinic.clinic_logo}`
//                       : addClinic
//                   }
//                   alt={clinic.name}
//                   className="clinic-logo rounded-circle mb-3"
//                 />
//                 <h5 className="fw-bold">{clinic.name}</h5>
//                 <p className="text-muted mb-1">
//                   <i className="bi bi-geo-alt"></i> {clinic.address}
//                 </p>
//                 <p className="mb-1">
//                   <i className="bi bi-telephone"></i> {clinic.phone}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <style>{`
//         .clinic-card {
//           border-radius: 15px;
//           transition: all 0.3s ease;
//         }
//         .clinic-card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//         }
//         .clinic-logo {
//           width: 80px;
//           height: 80px;
//           object-fit: cover;
//           border: 3px solid #eee;
//         }
//       `}</style>
//     </div>
//   );
// };

const ClinicList = ({ clinics, fetchClinics }) => {
  const handleDeleteClinic = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Hospital?"))
      return;

    try {
      const res = await axios.delete(`${Config.BASE_URL}/api/clinics/${id}`);

      toast.success("Hospital deleted successfully");
      fetchClinics();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong while deleting."
      );
    }
  };
  return (
    <div className="container mt-4">
      <div>
        <div
          className="tab-pane fade show active"
          id="pills-active"
          role="tabpanel"
        >
          <div className="table-responsive">
            <table className="table table-striped custom-table approvedtable">
              <thead className="">
                <tr>
                  <th>Image</th>
                  <th>Hospital Name</th>
                  {/* <th>Address</th> */}
                  <th>Contact</th>
                  <th>Action</th>
                  {/* 
                  <th>Follow-up</th>
                  <th>Consultation</th>
                  <th>Action</th> */}
                </tr>
              </thead>
              <tbody>
                {clinics && clinics.length > 0 ? (
                  clinics.map((clinic, index) => (
                    <tr key={`clinic-${index}`}>
                      <td>
                        <img
                          src={
                            clinic.clinic_logo
                              ? `${Config.BASE_URL}/${clinic.clinic_logo}`
                              : addClinic
                          }
                          alt={clinic.name}
                          className="clinic-logo rounded-circle mb-3"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                        />
                      </td>
                      <td>{clinic.name}</td>
                      {/* <td>
                        <i className="bi bi-geo-alt"></i> {clinic.address}
                      </td> */}
                      <td>
                        <i className="bi bi-telephone"></i> {clinic.phone}
                      </td>
                      <td>
                        <FaTrashAlt
                          className="text-danger"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleDeleteClinic(clinic.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center text-muted py-3">
                      No clinics found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
