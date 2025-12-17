import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import logo from "../../../assets/images/Vector (3).png";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import vendor from "../../../assets/admin/Vector (2).png";
import { Button, Modal } from "react-bootstrap";

import "react-calendar/dist/Calendar.css";
import axios from "axios";
import Config from "../../../config";
import { Link, useParams } from "react-router-dom";

import SignatureCanvas from "react-signature-canvas";
import toast, { Toaster } from "react-hot-toast";
import { FaDownload, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";
import CircularProgress from "@mui/material/CircularProgress";

const PatientsDetails = () => {
  const { apptid, slotid } = useParams();
  const [drShow, setDrShow] = useState(false);

  const sigCanvas = useRef(null);
  const [signatureData, setSignatureData] = useState("");
  const [patientid, setPatientsID] = useState("");

  const [appointments, setAppointments] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const DoctorID = userData?.id;
  const DoctorName = userData?.firstname;

  const [medications, setMedications] = useState([
    { name: "", strength: "", dosage: "", quantity: "" },
  ]);

  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionIds, setPrescriptionIds] = useState([]);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [nhsNumber, setNhsNumber] = useState("");
  const [address, setAddress] = useState("");
  const [advise, setAdvise] = useState("");
  const [diagnose, setDiagnose] = useState("");
  const [types, setTypes] = useState("");
  const [patientFullName, setPatientFullName] = useState("");
  const [loading2, setLoading2] = useState(false);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Prescription",
    onAfterPrint: () => console.log("Print success"),
  });

  const handleDownloadPDF = () => {
    const element = printRef.current;
    const opt = {
      margin: 0.5,
      filename: "prescription.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true, // Allows cross-origin images
      },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };

  const addMoreMedicine = () => {
    setMedications([
      ...medications,
      { name: "", strength: "", dosage: "", quantity: "" },
    ]);
  };

  const handleDeleteMoreMedicine = (index) => {
    const updated = medications.filter((_, i) => i !== index);
    setMedications(updated);
  };

  const handleChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleCaptureSignature = () => {
    const canvas = sigCanvas.current;

    if (!canvas || canvas.isEmpty()) {
      toast.error("Please provide a signature.");
      return;
    }

    // Use getCanvas() instead of getTrimmedCanvas() to avoid errors
    const dataUrl = canvas.getCanvas().toDataURL("image/png");

    setSignatureData(dataUrl);
    console.log("signatureData", dataUrl);
    toast.success("Signature captured!");
  };

  const [loading, setLoading] = useState(false);
  const handleSavePrescription = async (type) => {
    if (!fullName || !dob || !nhsNumber || !address || !advise || !diagnose) {
      toast.error("Please fill all fields.");
      return;
    }

    // Convert base64 to Blob
    const base64ToBlob = (base64) => {
      const byteString = atob(base64.split(",")[1]);
      const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    };

    const signatureBlob = signatureData ? base64ToBlob(signatureData) : null;

    if (!signatureBlob) {
      toast.error("Please provide a signature.");
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append("patient_id", patientid);

    formData.append("appointment_id", apptid);
    formData.append("appt_slot_id", slotid);
    formData.append("full_name", fullName);
    formData.append("date_of_birth", dob);
    formData.append("nhs_number", nhsNumber);
    formData.append("address", address);
    formData.append("advise", advise);
    formData.append("diagnose", diagnose);
    formData.append("created_by", DoctorID);

    if (type === "end") {
      formData.append("isComplete", 1);
    } else {
      formData.append("isComplete", 0);
    }

    if (signatureBlob) {
      formData.append("digital_signature", signatureBlob, "signature.png");
    }

    // Append each medication as an item[] object (assuming backend accepts multiple)
    medications.forEach((med, index) => {
      formData.append(`items[${index}][medicine_name]`, med.name);
      formData.append(`items[${index}][strength]`, med.strength);
      formData.append(`items[${index}][dosage_instructions]`, med.dosage);
      formData.append(`items[${index}][quantity]`, med.quantity);
    });

    try {
      if (type === "end") {
        setLoading(true);
      } else {
        setLoading2(true);
      }

      const res = await axios.post(
        `${Config.BASE_URL}/api/prescriptions`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (type === "end" && prescriptionIds.length > 0) {
        await axios.patch(`${Config.BASE_URL}/api/prescriptions/status/bulk`, {
          ids: prescriptionIds, // state contains only IDs [1,2,3]
          isComplete: true,
        });
        toast.success("All prescriptions marked as complete!");
      }

      if (res.data.success) {
        handleApprove(apptid);
        fetchAppointmentsShowid();
        toast.success("Prescription saved successfully!");
        setDrShow(false);
      } else {
        toast.error("Failed to save prescription.");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error(error.response.data.message || "Something went wrong!");
    } finally {
      setLoading(false);
      setLoading2(false); // stop loading
    }
  };

  const handleApprove = async (apptid) => {
    const payload = {
      isConsultCompleted: 1,
      slot_id: slotid,
    };
    try {
      const res = await axios.patch(
        `${Config.BASE_URL}/api/appointments/${apptid}/status/new`,
        payload
      );
      if (res.data.success) {
        fetchAppointments();
      }
    } catch (error) {}
  };
  const [prescription, setPrescription] = useState(null);
  useEffect(() => {
    if (!slotid) return;

    axios
      .get(`${Config.BASE_URL}/api/prescriptions/slot/${slotid}`)
      .then((res) => {
        setPrescription(res.data?.data || null);
        // setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching prescription:", err);
        // setLoading(false);
      });
  }, [slotid]);

  useEffect(() => {
    fetchAppointments();
    fetchAppointmentsShowid();
    // fetchPrescriptions();
  }, []);
  const [reports, setReports] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const fetchAppointmentsShowid = async () => {
    const payload = {
      doc_id: DoctorID,
      slot_id: slotid,
      // make sure DoctorID is defined
    };

    try {
      const res = await axios.get(`${Config.BASE_URL}/api/appointments/index`, {
        params: payload,
      });
      if (res.data.success) {
        setPatientsID(res.data?.appointment?.user_id);
        setFullName(
          res.data?.appointment?.user?.firstname +
            " " +
            res.data?.appointment?.user?.lastname
        );
        setNhsNumber(res.data?.appointment?.user?.medical_information?.nhs_num);
        setAddress(res.data?.appointment?.user?.address);
        setDob(res.data?.appointment?.user?.date_of_birth);
        console.log(res.data?.appointment?.user, "fetchAppointmentsShowid");
        console.log(res.data?.appointment, "patientdetailpage");
        setTypes(res.data?.appointment);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };
  const fetchAppointments = async () => {
    const payload = {
      doc_id: DoctorID,
      slot_id: slotid,
    };

    try {
      const res = await axios.get(`${Config.BASE_URL}/api/appointments/index`, {
        params: payload,
      });

      if (res.data.success && res.data.appointment) {
        const appointment = res.data.appointment;

        setAppointments(appointment);
        console.log("appointments---::", appointment);

        // Fetch reports using user.id
        if (appointment.user?.id) {
          fetchReports(appointment.user.id);
          fetchPrescriptions(DoctorID, appointment.user.id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const fetchPrescriptions = async (doc_id, pat_id) => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/prescriptions/${doc_id}/${pat_id}`
      );

      if (res.data.success && res.data) {
        const pres = res.data?.data;
        const prescriptionIds = pres.map((p) => p.id);

        setPrescriptionIds(prescriptionIds);
        setPrescriptions(pres);
        console.log("prescription:-:", pres);
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  // console.log("sadgdn:-", prescriptions);

  const fetchReports = async (user_id) => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/reports/by_doctor?user_id=${user_id}&doctor_id=${DoctorID}`
      );
      setReports(res.data?.data || []);
      console.log("reportpatientdetails", res.data?.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };
  console.log("signatureData", signatureData);

  const handleDelete = async (id) => {
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

  return (
    <>
      <Toaster />

      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 content-area">
          <Navbar />
          <div className="container bgcolor  p-3">
            <h3>Patients Details </h3>

            <div className="row">
              <div className="col-lg-8">
                <div className="save-btn-container">
                  {types?.type === "virtual" && (
                    <a
                      href={`/admin/videocalldoctor/${apptid}/${slotid}/${
                        userData?.id
                      }/${userData.firstname + "" + userData.lastname}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="save-btn mx-3">
                        <i className="fa fa-video mx-2"></i>
                        Start Now
                      </button>
                    </a>
                  )}

                  <button className="save-btn1" onClick={() => setDrShow(true)}>
                    Create Prescription
                  </button>
                </div>

                <div className="row">
                  {/* ✅ Render only if appointment exists */}
                  {appointments && appointments.user && (
                    <>
                      {/* Patient Card */}
                      <div className="col-lg-4">
                        <div className="d-flex justify-content-center mb-3 mt-3">
                          <div className="patient-card bg-white text-center p-4 shadow-sm rounded w-100">
                            <img
                              src={
                                appointments.user?.profile_image
                                  ? `${Config.BASE_URL}/${appointments.user.profile_image}`
                                  : appointments.user?.gender === "Female"
                                  ? female
                                  : male
                              }
                              alt="Patient"
                              className="rounded-circle mb-3 mx-auto d-block"
                              width="100"
                              height="100"
                            />
                            <div>
                              <h6 className="mb-1 fw-bold">
                                {appointments.user.firstname}{" "}
                                {appointments.user.lastname || ""}
                              </h6>
                              <small className="text-muted">
                                {appointments.slots?.[0]
                                  ? new Date(
                                      `${appointments.slots[0].date}T${appointments.slots[0].time}`
                                    ).toLocaleString("en-GB", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "No slot"}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Patient Info */}
                      <div className="col-lg-8">
                        <div className="summary-grid shadow-sm rounded p-3 mb-4 mt-3">
                          <div className="info-box">
                            <strong>Patient ID</strong>
                            <br />
                            {appointments?.user?.id}
                          </div>
                          <div className="info-box">
                            <strong>Weight</strong>
                            <br />
                            {appointments.user?.additional_info?.weight ||
                              "N/A"}
                          </div>
                          {/* <div className="info-box">
                <strong>Heart Rate</strong>
                <br />
                {appointments.user?.additional_info?.heart_rate || "N/A"}
              </div> */}
                          {/* <div className="info-box">
                <strong>Temperature</strong>
                <br />
                {appointments.user?.additional_info?.temperature || "N/A"}
              </div> */}
                          {/* <div className="info-box">
                <strong>Age</strong>
                <br />
                {appointments.user?.additional_info?.age || "N/A"}
              </div> */}
                          <div className="info-box">
                            <strong>Height</strong>
                            <br />
                            {appointments.user?.additional_info?.height ||
                              "N/A"}
                          </div>
                          {/* <div className="info-box">
                <strong>Glucose</strong>
                <br />
                {appointments.user?.additional_info?.glucose || "N/A"}
              </div> */}
                          {/* <div className="info-box">
                <strong>Gender</strong>
                <br />
                {appointments.user?.gender || "N/A"}
              </div> */}
                          <div className="info-box">
                            <strong>Blood Type</strong>
                            <br />
                            {appointments.user?.additional_info?.blood_type ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="prescription-box p-4 shadow-sm rounded ">
                  <div className="row ">
                    <div className="col-10 ">
                      <h5>Medicine Detail</h5>
                    </div>
                    <div className="col-2 ">
                      <div className="d-flex gap-3">
                        <FaPrint
                          style={{ cursor: "pointer" }}
                          onClick={handlePrint}
                        />
                        <FaDownload
                          style={{ cursor: "pointer" }}
                          onClick={handleDownloadPDF}
                        />
                      </div>
                    </div>
                  </div>
                  {/* <div ref={printRef}>
                    <div className="p-3">
                      <div className="row border-css  ">
                        <div className="col-6 text-primary ">
                          <div className="row   ">
                            <div className="col-12 mt-3">
                              Age: <br />
                              <br />
                              <span className="text-black">
                                {types.user?.additional_info?.age || "N/A"}
                              </span>
                              <br />
                              <br />
                              <br />
                              <br />
                              D.o.B: <br />
                              <br />
                              <span className="text-black">
                                {prescription?.date_of_birth || "N/A"}
                              </span>
                              <br />
                              <br />
                              <br />
                              <br />
                            </div>
                            <div className="col-10 bordertop borderright text-primary">
                              Number of days’ treatment <br />
                              NB: ensure dosage is stated
                              {prescription?.items &&
                              prescription.items.length > 0 ? (
                                prescription.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="border p-2 mb-2"
                                  >
                                    <strong>{item.medicine_name}</strong> <br />
                                    Strength: {item.strength} <br />
                                    Dosage: {item.dosage_instructions} <br />
                                    Quantity: {item.quantity}
                                  </div>
                                ))
                              ) : (
                                <p>No medicines prescribed</p>
                              )}
                            </div>
                            <div className="col-2 bordertop   text-primary"></div>
                          </div>
                        </div>
                        <div className="col-6 text-primary ">
                          <div className="row borderleft  ">
                            <div className="col-12 mt-3">
                              Full Name: <br />
                              <br />
                              <span className="text-black">
                                {prescription?.full_name || "N/A"}
                              </span>
                              <br />
                              <br />
                              <br />
                              <br />
                              Address:
                              <br />
                              <br />
                              <span className="text-black">
                                {prescription?.address || "N/A"}
                              </span>
                              <br />
                              <br />
                              <br />
                              <br />
                            </div>
                            <div className="col-6 text-primary">
                              NHS Number:
                              <br />
                              <span className="text-black">
                                {prescription?.nhs_number || "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row ">
                        <div className="col-6 text-primary mt-3">
                          Endorsements
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <img src={vendor} />
                          <br />
                          <br />
                          <br />
                        </div>
                        <div className="col-6  borderright borderleft text-center text-primary">
                          <br />

                          <strong className="text-dark ">
                            HOSPITAL PRESCRIBE
                          </strong>
                        </div>
                      </div>

                      <div className="row  ">
                        <div className="col-6"></div>
                        <div className="col-6 border-css text-primary py-3">
                          Describer’s name and initials in black capitals:{" "}
                          {prescription?.created_by || "N/A"}
                        </div>
                      </div>

                      <div className="row  borderb ">
                        <div className="col-6 borderleft bordertop borderright text-primary">
                          <br />
                          Signature of Prescriber:
                          <br />
                          <br />
                          {prescription?.digital_signature ? (
                            <img
                              src={`${Config.BASE_URL}/${prescription?.digital_signature}`}
                              alt="Signature"
                              style={{
                                maxWidth: "150px",
                                height: "auto",
                                marginTop: "10px",
                              }}
                            />
                          ) : (
                            "N/A"
                          )}
                          <br />
                          <br />
                        </div>
                        <div className="col-6 text-primary borderright">
                          <br />
                          Date: <br />
                          <br />
                          <br />
                          <span className="text-black">
                            {prescription?.created_at
                              ? new Date(
                                  prescription?.created_at
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="row  borderb ">
                        <div className="col-12 borderleft  borderright text-primary">
                          <br />
                          <br />

                          <br />
                          <br />
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <HospitalPrescriberForm
                    printRef={printRef}
                    prescription={prescription}
                    age={types.user?.additional_info?.age}
                  />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="cardbox">
                  <div className="d-flex justify-content-between mb-2">
                    <h6>Test Reports</h6>
                  </div>

                  <ul className="list-group mb-3">
                    {reports.length > 0 ? (
                      reports.map((report) => (
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
                            {report.file_name.slice(0, 40).split("/").pop()}
                          </span>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(report.id)}
                          >
                            Delete
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="list-group-item">No reports found.</li>
                    )}
                  </ul>
                </div>
                <PrescriptionList prescriptions={prescriptions} />
              </div>
            </div>
            <h6>Copyright © 2025 Yodoc UK All Rights Reserved.</h6>
          </div>
        </div>
      </div>

      <style>
        {`
         
  table thead th {
  background: #f8f9fc;
  border: none;
  font-weight: 600;
}

table tbody tr {
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.03);
  margin-bottom: 10px;
}

table td {
  vertical-align: middle;
  border: none;
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
  border: 2px solid #70EFCD;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}

.save-btn1 {
  background-color: #70EFCD;
  color: black;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
  background: #fff;
}

.info-box {
  background: #E0EAF3;
  padding: 10px;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  border: 1px solid #e0e0e0;
}
  .border-css {
  border: 2px solid #D9D9D9;
}
  .bordertop{
  border-top: 2px solid #D9D9D9;

  }
  .borderright{
  border-right: 2px solid #D9D9D9;

  }
  .borderb{
  border-bottom: 2px solid #D9D9D9;

  }
  .borderleft{
  border-left: 2px solid #D9D9D9;

  }

.prescription-box {
  background: white;
  border: 1px solid #e8e8e8;
}

.text-primary {
  color: #007bff;
  font-size: 14px;
}

.cardbox {
  background: #fff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}



.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
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
  



.register-modal {
  background: #f9fafc;
  border-radius: 16px;
}

.left-pane {
  background: #eaf2fb;
  border-radius: 16px;
}

.right-pane {
  background: #ffffff;
  border-radius: 0 16px 16px 0;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #444;
}

.form-control {
  border-radius: 10px;
  font-size: 14px;
}

.add-more-btn {
  border: 1px solid #ccc;
  background: white;
  border-radius: 20px;
  padding: 5px 20px;
  font-weight: 500;
  color: #333;
  cursor: pointer;
}

.profile-box {
  background: #4d6aff;
  color: white;
  padding: 20px;
  border-radius: 16px;
  // width: 160px;
}

.signature-box {
  // width: 100px;
  height: 80px;
  background: #eafff3;
  border: 2px dashed #ccc;
  border-radius: 10px;
}




.medication-box {
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
  position: relative;
}

.delete-btn {
  // position: absolute;
  
  // top: 10px;
  // right: 10px;
}



`}
      </style>

      <Modal size="lg" show={drShow} onHide={() => setDrShow(false)}>
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
        />
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <h4 className="mb-4 fw-bold ml-4">Create Prescription</h4>
            </div>
            <div className="col-md-8">
              <div className="section left-pane p-4">
                <h6 className="section-title">Patient Information</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control custom-placeholder"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="date"
                      className="form-control custom-placeholder"
                      placeholder="Date of Birth"
                      value={dob}
                      disabled
                      onChange={(e) => setDob(e.target.value)}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <input
                      type="text"
                      className="form-control custom-placeholder"
                      placeholder="NHS Number"
                      value={nhsNumber}
                      disabled
                      onChange={(e) => setNhsNumber(e.target.value)}
                    />
                  </div>
                  <div className="col-md-12 mb-3">
                    <input
                      type="text"
                      className="form-control custom-placeholder"
                      placeholder="Address"
                      value={address}
                      disabled
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="section left-pane mt-4 p-4">
                <h6 className="section-title">Medication Details</h6>
                {/* {medications.map((med, index) => (
                  <div className="row" key={index}>
                    <div className="col-md-12 mb-2">
                      <input
                        type="text"
                        className="form-control custom-placeholder"
                        placeholder="Medicine Name"
                        value={med.name}
                        onChange={(e) =>
                          handleChange(index, "name", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-12 mb-2">
                      <input
                        type="text"
                        className="form-control custom-placeholder"
                        placeholder="Strength"
                        value={med.strength}
                        onChange={(e) =>
                          handleChange(index, "strength", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <input
                        type="text"
                        className="form-control custom-placeholder"
                        placeholder="Dosage Instructions"
                        value={med.dosage}
                        onChange={(e) =>
                          handleChange(index, "dosage", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <input
                        type="number"
                        className="form-control custom-placeholder"
                        placeholder="Quantity"
                        value={med.quantity}
                        onChange={(e) =>
                          handleChange(index, "quantity", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}

                <div className="text-center my-3">
                  <button className="add-more-btn" onClick={addMoreMedicine}>
                    + Add More
                  </button>
                </div> */}

                {medications.map((med, index) => (
                  <div
                    className="medication-box position-relative p-3 mb-3"
                    key={index}
                  >
                    {/* Delete button at top right */}
                    {index > 0 && (
                      <div className="d-flex justify-content-end mb-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-danger delete-btn "
                          onClick={() => handleDeleteMoreMedicine(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-trash"
                            viewBox="0 0 16 16"
                          >
                            <path d="M5.5 5.5A.5.5 0 0 1 6 5h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5v-7z" />
                            <path
                              fillRule="evenodd"
                              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1 0-2H6.118A1.5 1.5 0 0 1 7.5 0h1a1.5 1.5 0 0 1 1.382 1H13.5a1 1 0 0 1 1 1zm-3 1H4v9a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4z"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="row">
                      <div className="col-md-12 mb-2">
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Medicine Name"
                          value={med.name}
                          onChange={(e) =>
                            handleChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-12 mb-2">
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Strength"
                          value={med.strength}
                          onChange={(e) =>
                            handleChange(index, "strength", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <input
                          type="text"
                          className="form-control custom-placeholder"
                          placeholder="Dosage Instructions"
                          value={med.dosage}
                          onChange={(e) =>
                            handleChange(index, "dosage", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <input
                          type="number"
                          className="form-control custom-placeholder"
                          placeholder="Quantity"
                          value={med.quantity}
                          onChange={(e) =>
                            handleChange(index, "quantity", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center my-3">
                  <button
                    className="btn btn-outline-primary"
                    onClick={addMoreMedicine}
                  >
                    + Add More
                  </button>
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control custom-placeholder"
                    placeholder="Advise"
                    value={advise}
                    onChange={(e) => setAdvise(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control custom-placeholder"
                    placeholder="Diagnose"
                    value={diagnose}
                    onChange={(e) => setDiagnose(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {appointments && appointments.user && (
              <>
                <div
                  className="col-md-4 text-center flex-column align-items-center justify-content-center"
                  // key={index}
                >
                  <div className="profile-box mb-4">
                    <img
                      src={
                        appointments?.user?.profile_image
                          ? `${Config.BASE_URL}/${appointments?.user?.profile_image}`
                          : appointments?.user?.gender === "Female"
                          ? female
                          : male
                      }
                      style={{ width: "80px", height: "80px" }}
                      alt="Faiza"
                      className="rounded-circle mb-2"
                    />
                    <div className="fw-bold">
                      {appointments?.user?.firstname}{" "}
                      {appointments?.user?.lastname}
                    </div>

                    {appointments?.slots?.length > 0 && (
                      <small>
                        {new Date(
                          appointments.slots[0].date
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        |{" "}
                        {new Date(
                          `1970-01-01T${appointments.slots[0].time}`
                        ).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                    )}
                  </div>
                  <div>
                    <h6 className="mb-2">Digital Signature</h6>

                    <div
                      className="mb-2 border rounded"
                      style={{ width: "100%", height: 150 }}
                    >
                      <SignatureCanvas
                        ref={sigCanvas}
                        penColor="black"
                        canvasProps={{
                          width: 500,
                          height: 150,
                          className: "sigCanvas",
                        }}
                      />
                    </div>

                    <div className="d-flex justify-content-center gap-3">
                      <button
                        className="btn btn-light rounded-circle me-2"
                        onClick={() => sigCanvas.current.clear()}
                      >
                        🔄
                      </button>
                      <button
                        className="btn btn-light rounded-circle"
                        onClick={handleCaptureSignature}
                      >
                        ✅
                      </button>
                    </div>

                    {signatureData && (
                      <div className="mt-3 text-center">
                        <p>Signature Preview:</p>
                        <img
                          src={signatureData}
                          alt="Signature Preview"
                          width={200}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="text-end d-flex gap-2 justify-content-end mt-4">
            <button
              className="btn px-4 py-2 rounded-pill"
              style={{ backgroundColor: "#70EFCD" }}
              onClick={() => handleSavePrescription("continue")}
              disabled={loading2}
            >
              {loading2 ? (
                <>
                  <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                  Saving...
                </>
              ) : (
                "Continue Observation"
              )}
            </button>
            <button
              className="btn btn-primary px-4 py-2 rounded-pill"
              onClick={() => handleSavePrescription("end")}
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ color: "white", mr: 1 }} />
                  Saving...
                </>
              ) : (
                "End Observation"
              )}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={viewModal} onHide={() => setViewModal(false)} size="lg">
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
    </>
  );
};

const HospitalPrescriberForm = ({ prescription, age, printRef }) => {
  return (
    <div
      ref={printRef}
      style={{
        minHeight: "100vh",
        // backgroundColor: "#f8f9fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "800px",
          backgroundColor: "#eaf6f0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          border: "1px solid #ccc",
        }}
      >
        {/* Top header area */}
        <div style={{ backgroundColor: "#eaf6f0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    width: "30%",
                    verticalAlign: "top",
                    padding: "5px",
                    fontSize: "12px",
                    color: "#004080",
                    fontWeight: "bold",
                    backgroundColor: "#eaf6f0",
                    borderTop: "none",
                    borderRight: "none",
                    borderLeft: "none",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",

                      // alignItems: "",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span className="pb-2">Pharmacy Stamp</span>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <img
                        src={logo}
                        alt="Pharmacy Logo"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    borderTop: "none",
                    width: "15%",
                    verticalAlign: "top",
                    padding: "5px",
                    fontSize: "12px",
                    color: "#004080",
                    backgroundColor: "#eaf6f0",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "bold" }}>Age:</span>{" "}
                    <span style={{ color: "#000" }}>{age || "N/A"}</span>
                  </div>
                  <br />
                  <br />
                  <div>
                    <span style={{ fontWeight: "bold" }}>D.o.B:</span>{" "}
                    <span style={{ color: "#000" }}>
                      {prescription?.date_of_birth || "N/A"}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    borderTop: "none",
                    borderRight: "none",
                    borderLeft: "none",

                    width: "55%",
                    verticalAlign: "top",
                    padding: "5px",
                    fontSize: "12px",
                    color: "#004080",
                    backgroundColor: "#eaf6f0",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    Title, Forename, Surname & Address
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#004080",
                      lineHeight: "1.5",
                    }}
                  >
                    <div>{prescription?.full_name || "N/A"}</div>

                    <div>{prescription?.address || "N/A"}</div>
                  </div>

                  <br />
                  <br />
                  <br />
                  <td
                    style={{
                      padding: "5px",
                      fontSize: "12px",
                      color: "#004080",
                      backgroundColor: "#eaf6f0",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}> NHS Number:</span>{" "}
                      <span style={{ color: "#000" }}>
                        {prescription?.nhs_number || "N/A"}
                      </span>
                    </div>
                  </td>
                </td>
              </tr>

              {/* <tr>
                <td
                  colSpan="2"
                  style={{
                    border: "1px solid #ccc",
                    borderLeft: "none",
                    padding: "5px",
                    fontSize: "11px",
                    color: "#004080",
                    backgroundColor: "#eaf6f0",
                  }}
                >
                  Number of days' treatment <br />
                  N.B. Ensure dose is stated
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>

        {/* Main Body */}
        <div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                flex: "1",
                minHeight: "350px",
                // display: "flex",
                // justifyContent: "center",
                textAlign: "center",
                backgroundColor: "#f3fbf7",
                paddingTop: "10px",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                HOSPITAL PRESCRIBER
              </h2>
              {prescription?.items &&
                prescription.items.length > 0 &&
                prescription.items.map((item) => (
                  <div key={item.id} className="border p-2 mb-2">
                    <strong>{item.medicine_name}</strong> <br />
                    Strength: {item.strength} <br />
                    Dosage: {item.dosage_instructions} <br />
                    Quantity: {item.quantity}
                  </div>
                ))}
            </div>
          </div>

          {/* Prescriber name */}
          {/* <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "bold" }}>
              Prescriber's name and initials in block capitals
            </div>
          </div> */}

          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ccc",
              borderBottom: "1px solid #ccc",
              marginTop: "30px",
            }}
          >
            {/* Signature of Prescriber */}
            <div
              style={{
                flex: 2,
                padding: "5px 10px",
                borderRight: "1px solid #ccc",
              }}
            >
              <div style={{ fontSize: "12px", color: "#004080" }}>
                <span style={{ fontWeight: "bold" }}>
                  Signature of Prescriber
                </span>
                <br />
                {prescription?.digital_signature ? (
                  <img
                    src={`${Config.BASE_URL}/${prescription?.digital_signature}`}
                    alt="Signature"
                    style={{
                      maxWidth: "150px",
                      height: "auto",
                      marginTop: "10px",
                    }}
                  />
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            {/* Date */}
            <div style={{ flex: 1, padding: "5px 10px" }}>
              <div style={{ fontSize: "12px", color: "#004080" }}>
                <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
                <span style={{ color: "#000" }}>
                  {prescription?.created_at
                    ? new Date(prescription?.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div
          style={{
            padding: "10px",
            borderTop: "1px solid #ccc",
            fontSize: "10px",
            color: "#666",
          }}
        >
          Form template — designed to match the provided photograph.
        </div> */}
      </div>
    </div>
  );
};

const PrescriptionList = ({ prescriptions }) => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [drShow, setDrShow] = useState(false);
  console.log("prescriptionskna:-", prescriptions);

  const handleView = async (prescriptionId) => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/get-prescriptions/${prescriptionId}`
      );
      if (res.data.success) {
        setPrescriptionData(res.data.data);
        setDrShow(true);
      }
    } catch (error) {
      console.error("Failed to fetch prescription:", error);
    }
  };
  const printRef = useRef();

  const handleDownloadPDF = () => {
    const element = printRef.current;
    if (!element) return console.error("Print element not found");

    const opt = {
      margin: 0.5,
      filename: "prescription.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };
  return (
    <>
      <div className="container card shadow mt-4" style={{ border: "none" }}>
        <h2 className="my-2 mb-2" style={{ fontSize: "24px" }}>
          Prescriptions
        </h2>

        {/* Prescription Table */}
        <table className="table table-bordered">
          <thead className="table-light">
            <tr>
              <th>Patient Name</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {(prescriptions || []).map((prescription) => (
              <tr key={prescription.id}>
                <td>{prescription.full_name}</td>
                <td>
                  {new Date(prescription.created_at).toLocaleDateString()}
                </td>

                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    data-bs-toggle="modal"
                    data-bs-target="#prescriptionModal"
                    onClick={() => handleView(prescription?.id)}
                  >
                    <i className="fas fa-eye me-1"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal size="lg" show={drShow} onHide={() => setDrShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {prescriptionData && (
            <>
              <div className="prescription-box p-4 rounded ">
                <div className="row ">
                  <div className="col-10 ">
                    <h5>Medicine Detail</h5>
                  </div>
                  <div className="col-2 ">
                    <div className="d-flex gap-3">
                      <FaDownload
                        style={{ cursor: "pointer" }}
                        onClick={handleDownloadPDF}
                      />
                    </div>
                  </div>
                </div>

                <HospitalPrescriberForm2
                  prescription={prescriptionData}
                  printRef={printRef}
                />
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

const HospitalPrescriberForm2 = ({ prescription, age, printRef }) => {
  return (
    <div
      ref={printRef}
      style={{
        minHeight: "100vh",
        // backgroundColor: "#f8f9fa",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "10px",
      }}
    >
      <div
        style={{
          width: "800px",
          backgroundColor: "#eaf6f0",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          border: "1px solid #ccc",
        }}
      >
        {/* Top header area */}
        <div style={{ backgroundColor: "#eaf6f0" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td
                  style={{
                    width: "30%",
                    verticalAlign: "top",
                    padding: "5px",
                    fontSize: "12px",
                    color: "#004080",
                    fontWeight: "bold",
                    backgroundColor: "#eaf6f0",
                    borderTop: "none",
                    borderRight: "none",
                    borderLeft: "none",
                    borderBottom: "1px solid #ccc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",

                      // alignItems: "",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <span className="pb-2">Pharmacy Stamp</span>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <img
                        src={logo}
                        alt="Pharmacy Logo"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  </div>
                </td>

                <td
                  style={{
                    border: "1px solid #ccc",
                    borderTop: "none",
                    width: "15%",
                    verticalAlign: "top",
                    padding: "5px",
                    fontSize: "12px",
                    color: "#004080",
                    backgroundColor: "#eaf6f0",
                  }}
                >
                  <div>
                    <span style={{ fontWeight: "bold" }}>Age:</span>{" "}
                    <span style={{ color: "#004080" }}>{age || "N/A"}</span>
                  </div>
                  <br />
                  <br />
                  <div>
                    <span style={{ fontWeight: "bold" }}>D.o.B:</span>{" "}
                    <span style={{ color: "#004080" }}>
                      {prescription?.date_of_birth || "N/A"}
                    </span>
                  </div>
                </td>
                <td
                  style={{
                    border: "1px solid #ccc",
                    borderTop: "none",
                    borderRight: "none",
                    borderLeft: "none",

                    width: "55%",
                    verticalAlign: "top",
                    padding: "5px",
                    fontSize: "12px",
                    color: "#004080",
                    backgroundColor: "#eaf6f0",
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>
                    Title, Forename, Surname & Address
                  </div>

                  <div
                    style={{
                      fontSize: "14px",
                      color: "#004080",
                      lineHeight: "1.5",
                    }}
                  >
                    <div>{prescription?.full_name || "N/A"}</div>

                    <div>{prescription?.address || "N/A"}</div>
                  </div>

                  <br />
                  <br />
                  <br />
                  <td
                    style={{
                      padding: "5px",
                      fontSize: "12px",
                      color: "#004080",
                      backgroundColor: "#eaf6f0",
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: "bold" }}> NHS Number:</span>{" "}
                      <span style={{ color: "#004080" }}>
                        {prescription?.nhs_number || "N/A"}
                      </span>
                    </div>
                  </td>
                </td>
              </tr>

              {/* <tr>
                <td
                  colSpan="2"
                  style={{
                    border: "1px solid #ccc",
                    borderLeft: "none",
                    padding: "5px",
                    fontSize: "11px",
                    color: "#004080",
                    backgroundColor: "#eaf6f0",
                  }}
                >
                  Number of days' treatment <br />
                  N.B. Ensure dose is stated
                </td>
              </tr> */}
            </tbody>
          </table>
        </div>

        {/* Main Body */}
        <div>
          <div style={{ display: "flex" }}>
            <div
              style={{
                flex: "1",
                minHeight: "350px",
                // display: "flex",
                // justifyContent: "center",
                textAlign: "center",
                backgroundColor: "#f3fbf7",
                padding: "10px",
              }}
            >
              <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>
                HOSPITAL PRESCRIBER
              </h2>
              {prescription?.items &&
                prescription.items.length > 0 &&
                prescription.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "15px",
                      padding: "8px",
                      marginBottom: "6px",
                      // border: "1px solid #ccc",
                      // borderRadius: "4px",
                      // backgroundColor: "#f9f9f9",
                      fontSize: "12px",
                      color: "#004080",
                      alignItems: "center",
                    }}
                  >
                    <span>
                      <strong>Medicine:</strong> {item.medicine_name}
                    </span>
                    <span>
                      <strong>Strength:</strong> {item.strength || "N/A"}
                    </span>
                    <span>
                      <strong>Dosage:</strong>{" "}
                      {item.dosage_instructions || "N/A"}
                    </span>
                    <span>
                      <strong>Quantity:</strong> {item.quantity || "N/A"}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Prescriber name */}
          {/* <div
            style={{
              marginTop: "20px",
              borderTop: "1px solid #ccc",
              padding: "10px",
            }}
          >
            <div style={{ fontSize: "13px", fontWeight: "bold" }}>
              Prescriber's name and initials in block capitals
            </div>
          </div> */}

          <div
            style={{
              display: "flex",
              borderTop: "1px solid #ccc",
              borderBottom: "1px solid #ccc",
              marginTop: "30px",
            }}
          >
            {/* Signature of Prescriber */}
            <div
              style={{
                flex: 2,
                padding: "5px 10px",
                borderRight: "1px solid #ccc",
              }}
            >
              <div style={{ fontSize: "12px", color: "#004080" }}>
                <span style={{ fontWeight: "bold" }}>
                  Signature of Prescriber
                </span>
                <br />
                {prescription?.digital_signature ? (
                  <img
                    src={`${Config.BASE_URL}/${prescription?.digital_signature}`}
                    alt="Signature"
                    style={{
                      maxWidth: "150px",
                      height: "auto",
                      marginTop: "10px",
                    }}
                  />
                ) : (
                  "N/A"
                )}
              </div>
            </div>

            {/* Date */}
            <div style={{ flex: 1, padding: "5px 10px" }}>
              <div style={{ fontSize: "12px", color: "#004080" }}>
                <span style={{ fontWeight: "bold" }}>Date:</span>{" "}
                <span style={{ color: "#004080" }}>
                  {prescription?.created_at
                    ? new Date(prescription?.created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {/* <div
          style={{
            padding: "10px",
            borderTop: "1px solid #ccc",
            fontSize: "10px",
            color: "#666",
          }}
        >
          Form template — designed to match the provided photograph.
        </div> */}
      </div>
    </div>
  );
};

export default PatientsDetails;
