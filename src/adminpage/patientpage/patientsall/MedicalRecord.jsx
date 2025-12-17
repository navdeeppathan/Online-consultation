import React, { useEffect, useState } from "react";
import SidebarPatient from "../sidebarpatient/SidebarPatient";
import NavbarPatient from "../sidebarpatient/NavbarPatient";
import bgImage from "../../../assets/images/image 79.png";
import { Button, Form, Image, ListGroup, Modal } from "react-bootstrap";
import Config from "../../../config";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MedicalRecord = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  // console.log(userData);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [insuranceData, setInsuranceData] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState({});

  const [formData, setFormData] = useState({
    insurance_provider: "",
    policy_number: "",
    group_id: "",
    expiry_date: "",
    policy_verification: 0,
  });

  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);

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

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/insurance?user_id=${userData.id}`)
      .then((response) => {
        if (response.data?.success) {
          setInsuranceData(response.data.data[0]); // assuming first entry
          console.log("Error fetching insurance data:", response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching insurance data:", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("user_id", userData.id);
      data.append("insurance_provider", formData.insurance_provider);
      data.append("policy_number", formData.policy_number);
      data.append("group_id", formData.group_id);
      data.append("expiry_date", formData.expiry_date);
      data.append("policy_verification", formData.policy_verification);
      data.append("insurance_card_file_1", file1);
      data.append("insurance_card_file_2", file2);

      const response = await axios.post(
        `${Config.BASE_URL}/api/insurance`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("Success:", response.data);
      toast.success("Insurance added successfully!");
      handleClose();
    } catch (error) {
      console.error(
        "Error uploading insurance:",
        error.response?.data || error.message
      );
      toast.error("Failed to upload insurance.");
    }
  };

  const [reports, setReports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedReportIds, setSelectedReportIds] = useState([]);
  const [selectedDoctorIds, setSelectedDoctorIds] = useState([]);

  useEffect(() => {
    fetchReports();
    fetchAppointments();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/reports`);
      setReports(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/appointments`, {
        params: { user_id: userData?.id },
      });
      setAppointments(res.data?.appointments || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const uniqueDoctors = Array.from(
    new Map(
      appointments
        .filter((appt) => appt.doctor) // ensure doctor exists
        .map((appt) => [appt.doctor.id, appt.doctor])
    ).values()
  );

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userData?.id);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append("reports[]", selectedFiles[i]);
    }

    try {
      await axios.post(`${Config.BASE_URL}/api/reports`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setShowModal(false);
      setSelectedFiles([]);
      fetchReports();
    } catch (err) {
      console.error("Error uploading report:", err);
      toast.error("Upload failed.");
    }
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(`${Config.BASE_URL}/api/reports/${id}`);
      fetchReports();
    } catch (err) {
      console.error("Error deleting report:", err);
      toast.error("Delete failed.");
    }
  };

  const handleView = async (id) => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/reports/${id}`);
      const filePath = res.data?.data?.file_name;
      setPdfUrl(`${Config.BASE_URL}/${filePath}`);
      setViewModal(true);
    } catch (err) {
      console.error("Error fetching report:", err);
      toast.error("Failed to load report.");
    }
  };

  const toggleReport = (id) => {
    setSelectedReportIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleDoctor = (id) => {
    setSelectedDoctorIds((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (selectedReportIds.length === 0 || selectedDoctorIds.length === 0) {
      toast.error("Select at least one report and one doctor.");
      return;
    }

    try {
      const payload = {
        report_id: selectedReportIds,
        doctor_id: selectedDoctorIds,
      };
      await axios.post(
        `${Config.BASE_URL}/api/reports/update-doctors`,
        payload
      );
      toast.success("Reports shared successfully!");
      setShowShareModal(false);
      setSelectedReportIds([]);
      setSelectedDoctorIds([]);
    } catch (err) {
      console.error("Error sharing reports:", err);
      toast.error("Failed to share reports.");
    }
  };
  return (
    <>
      <Toaster />
      <div className="d-flex">
        <SidebarPatient />
        <div className="flex-grow-1 content-area">
          <NavbarPatient />
          <div className=" bgcolor p-3">
            <h3 className="mb-4">Insurance Records</h3>

            <div className="row g-3">
              {/* Left Section */}
              <div className="col-lg-12 ">
                <div className="row g-3 d-flex align-items-stretch">
                  <div className="col-lg-6 d-flex">
                    <div className="cardbox flex-fill h-100">
                      <div className="d-flex justify-content-between">
                        <h6>Insurance Detail</h6>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={handleShow}
                        >
                          Add Insurance
                        </button>
                      </div>
                      <p>
                        <strong>Insurance Provider:</strong>{" "}
                        {insuranceData?.insurance_provider || "N/A"}
                      </p>
                      <p>
                        <strong>Policy Number:</strong>{" "}
                        {insuranceData?.policy_number || "N/A"}
                      </p>
                      <p>
                        <strong>Claim ID:</strong>{" "}
                        {insuranceData?.group_id || "N/A"}
                      </p>
                      {/* <p>
                        <strong>Insurance Card:</strong>
                        <br />
                        {insuranceData?.insurance_card_file_1 && (
                          <img
                            src={`${Config.BASE_URL}/${
                              insuranceData?.insurance_card_file_1 || ""
                            }`}
                            alt="card 1"
                            style={{
                              maxWidth: "100px",
                              width: "100%",
                              marginRight: "10px",
                            }}
                          />
                        )}
                        {insuranceData?.insurance_card_file_2 && (
                          <img
                            src={`${Config.BASE_URL}/${
                              insuranceData?.insurance_card_file_2 || ""
                            }`}
                            alt="card 2"
                            style={{ maxWidth: "100px", width: "100%" }}
                          />
                        )}
                      </p> */}
                    </div>
                  </div>

                  <div className="col-lg-6 d-flex">
                    <div className="cardbox flex-fill h-100">
                      <div className="d-flex justify-content-between">
                        <h6>General Information</h6>
                        <span className="edit-link">✎</span>
                      </div>
                      <p>
                        <strong>Date of Birth:</strong> 13. 11. 1987
                      </p>
                      <p>
                        <strong>Address:</strong> 42 High St, Watford,
                        Hertfordshire, WD17 1AZ
                      </p>
                      <p>
                        <strong>Registration Date:</strong> Thursday, May 2025
                      </p>
                    </div>
                  </div>

                  {/* <div className="col-md-6">
                    <div className="cardbox">
                      <div className="d-flex justify-content-between">
                        <h6>Amnesics</h6>
                        <span className="edit-link">✎</span>
                      </div>
                      <p>
                        <strong>Allergies:</strong> 13. 11. 1987
                      </p>
                      <p>
                        <strong>Chronic diseases:</strong> 42 High St, Watford
                      </p>
                      <p>
                        <strong>Blood Type:</strong> AB+
                      </p>
                      <p>
                        <strong>Past illness or injuries:</strong> Chicken pox
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Right Section */}
              {/* <div className="col-lg-4">
                <div className="cardbox p-3 shadow-sm rounded">
                  <div className="d-flex justify-content-between mb-2">
                    <h6>Test Reports</h6>
                  </div>

                  <ul className="list-group mb-3">
                    {reports.length > 0 ? (
                      reports.map(
                        (report) =>
                          String(report.user_id) === String(userData.id) && (
                            <li
                              key={report.id}
                              className="list-group-item d-flex justify-content-between align-items-center"
                            >
                              <span
                                style={{
                                  color: "blue",
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                                onClick={() => handleView(report.id)}
                              >
                                {report.file_name.split("/").pop()}
                              </span>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDelete(report.id)}
                              >
                                Delete
                              </button>
                            </li>
                          )
                      )
                    ) : (
                      <li className="list-group-item">No reports found.</li>
                    )}
                  </ul>

                  <div className="save-btn-container">
                    <button
                      className="save-btn1 btn-light mx-3"
                      onClick={() => setShowModal(true)}
                    >
                      Upload
                    </button>
                    <button
                      className="save-btn btn-primary"
                      onClick={() => setShowShareModal(true)}
                    >
                      Share
                    </button>
                  </div>
                </div>

                
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Upload Report</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group>
                        <Form.Label>Select files</Form.Label>
                        <Form.Control
                          type="file"
                          multiple
                          onChange={(e) => setSelectedFiles(e.target.files)}
                        />
                      </Form.Group>
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleUpload}>
                      Upload
                    </Button>
                  </Modal.Footer>
                </Modal>

                
                <Modal
                  show={viewModal}
                  onHide={() => setViewModal(false)}
                  size="lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>View Report</Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ height: "80vh" }}>
                    {pdfUrl ? (
                      <iframe
                        id="pdfViewer"
                        src={pdfUrl}
                        title="PDF Report"
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                      ></iframe>
                    ) : (
                      <p>Loading PDF...</p>
                    )}
                  </Modal.Body>
                </Modal>

              
                <Modal
                  show={showShareModal}
                  onHide={() => setShowShareModal(false)}
                  size="lg"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Share Reports</Modal.Title>
                  </Modal.Header>
                  <Modal.Body style={{ maxHeight: "500px", overflow: "auto" }}>
                    <h6>Reports</h6>
                    <ListGroup className="mb-3">
                      {reports.map((report) => (
                        <ListGroup.Item key={report.id}>
                          <Form.Check
                            type="checkbox"
                            label={report.file_name.split("/").pop()}
                            checked={selectedReportIds.includes(report.id)}
                            onChange={() => toggleReport(report.id)}
                          />
                        </ListGroup.Item>
                      ))}
                      {reports.length === 0 && <div>No reports found.</div>}
                    </ListGroup>

                    <h6>Doctors</h6>
                    <ListGroup>
                      {uniqueDoctors.map((doctor) => (
                        <ListGroup.Item
                          key={doctor.id}
                          className="d-flex align-items-center"
                        >
                          <Form.Check
                            type="checkbox"
                            className="me-2"
                            checked={selectedDoctorIds.includes(doctor.id)}
                            onChange={() => toggleDoctor(doctor.id)}
                          />
                          <img
                            src={`${Config.BASE_URL}/${doctor.profile_image}`}
                            className="rounded-circle me-2"
                            width="40"
                            height="40"
                            alt="Doctor"
                          />
                          <span>
                            {doctor.firstname} {doctor.lastname}
                          </span>
                        </ListGroup.Item>
                      ))}
                      {uniqueDoctors.length === 0 && (
                        <div>No doctors found.</div>
                      )}
                    </ListGroup>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowShareModal(false)}
                    >
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSend}>
                      Send
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
            .file-list li{
               display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
            }
            .cardbox p {
            display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
  }
 
.save-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.save-btn {
  background-color: #4d6aff;
  color: white;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}
  .save-btn1 {
  color: balck;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}
.cardbox {
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.edit-link {
  cursor: pointer;
  font-size: 14px;
  color: #888;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.file-list li a {
  color: #007bff;
  text-decoration: none;
  margin-right: auto;
}

.report-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
}

.report-list li {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #eee;
}

.report-list .value.green {
  color: green;
}

.report-list .value.red {
  color: red;
}

.report-list .value.orange {
  color: #ffa500;
}
  

.insurance-form label {
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
}

.insurance-form .form-control {
  border-radius: 10px;
  border: 1px solid #ddd;
  padding: 10px 14px;
  font-size: 14px;
  box-shadow: none;
}

.insurance-form .btn-upload {
  background-color: #e8f0fe;
  border: none;
  color: #4c6ef5;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
}

.insurance-form .btn-upload:hover {
  background-color: #dce9ff;
}

.insurance-form .form-check-input {
  margin-right: 10px;
}

.insurance-form .btn-primary {
  background-color: #3b82f6;
  border: none;
  font-weight: 600;
  font-size: 15px;
  padding: 10px;
}

.insurance-form .btn-primary:hover {
  background-color: #2563eb;
}


            `}
      </style>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header
          closeButton
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 10,
            border: "none",
            background: "transparent",
          }}
        ></Modal.Header>
        <Modal.Body>
          <div
            className="px-4 py-5"
            style={{
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundImage: `url(${bgImage})`,
            }}
          >
            <div className="text-center">
              <h4 className="mb-2 font-weight-bold">Insurance Details</h4>

              {/* <form className="insurance-form" onSubmit={handleSubmit}> */}
              <div className="form-group mb-3 text-start">
                <label>Insurance Provider</label>
                <select
                  name="insurance_provider"
                  className="form-control"
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Provider</option>
                  <option>Aviva Health</option>
                  <option>AXA</option>
                  <option>Bupa</option>
                </select>
              </div>

              <div className="form-group mb-3 text-start">
                <label>Policy Number</label>
                <input
                  type="text"
                  className="form-control"
                  name="policy_number"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-3 text-start">
                <label>Claim ID</label>
                <input
                  type="text"
                  className="form-control"
                  name="group_id"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-3 text-start">
                <label>Expiry Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="expiry_date"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-3 text-start">
                <label>Insurance Card</label>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <label>Font Image</label>

                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile1(e.target.files[0])}
                    required
                  />
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label>Back Image</label>

                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setFile2(e.target.files[0])}
                    required
                  />
                </div>
              </div>

              <div className="form-check mb-4 text-start">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="verifyCheck"
                  name="policy_verification"
                  onChange={handleChange}
                  checked={formData.policy_verification === 1}
                />
                <label className="form-check-label" htmlFor="verifyCheck">
                  Policy Verification
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill"
                onClick={handleSubmit}
              >
                Add Insurance
              </button>
              {/* </form> */}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default MedicalRecord;
