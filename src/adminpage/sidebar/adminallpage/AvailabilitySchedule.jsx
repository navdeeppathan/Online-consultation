import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Button, Table, Badge, Modal } from "react-bootstrap";
import { Form } from "react-bootstrap"; // ✅ Correct

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Config from "../../../config";
import Select from "react-select";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const AvailabilitySchedule = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const [highlightDates, setHighlightDates] = useState([]);
  console.log(userData);
  // const [value, onChange] = useState(new Date());

  const [value, setValue] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [consultationTypes, setConsultationTypes] = useState([]);
  const [startTime2, setStartTime2] = useState("");
  const [endTime2, setEndTime2] = useState("");
  const [error, setError] = useState("");
  const [applyType2, setApplyType2] = useState("1");
  const [loading2, setLoading2] = useState(false);
  const formatDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  // When date is clicked
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  // Toggle between virtual and in-person
  const toggleType = (type) => {
    setConsultationTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };
  const [availabilityByDate, setAvailabilityByDate] = useState([]);
  const AllDoctorAllavailabilityByDate = () => {
    setLoadingVirtual(true);
    axios
      .get(
        `${Config.BASE_URL}/api/availabilities_bydate?user_id=${
          userData.id
        }&date=${formatDate(selectedDate)}`
      )
      .then((response) => {
        const dates = response.data.data;
        setAvailabilityByDate(dates);
        console.log("availabiltyby date:-", response.data?.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingVirtual(false));
  };

  useEffect(() => {
    AllDoctorAllavailabilityByDate();
  }, [selectedDate]);

  const formatTime2 = (timeStr) => {
    if (!timeStr) return "-";
    const [hStr, mStr] = timeStr.split(":");
    const h = parseInt(hStr, 10);
    const m = mStr ? mStr.padStart(2, "0") : "00";
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${m} ${ampm}`;
  };
  // Handle form submit
  const handleSubmit2 = async () => {
    if (!startTime2 || !endTime2) {
      setError("Please select both start and end times.");
      return;
    }

    if (consultationTypes.length === 0) {
      setError("Please select at least one consultation type.");
      return;
    }

    if (consultationTypes.includes("in-person")) {
      if (!selectedClinic) {
        setError("Please select a Hospital.");
        return;
      }
    }

    // Compare times
    const start = new Date(`1970-01-01T${startTime2}:00`);
    const end = new Date(`1970-01-01T${endTime2}:00`);

    if (end <= start) {
      setError("End time must be after start time.");
      return;
    }

    const oneHourLater = new Date(start.getTime() + 60 * 60 * 1000);

    if (end < oneHourLater) {
      setError("End time must be at least 1 hour after start time.");
      return;
    }

    for (let slot of availabilityByDate) {
      const existingStart = new Date(`1970-01-01T${slot.start_time}`);
      const existingEnd = new Date(`1970-01-01T${slot.end_time}`);

      if (
        (start >= existingStart && start < existingEnd) ||
        (end > existingStart && end <= existingEnd) ||
        (start <= existingStart && end >= existingEnd)
      ) {
        setError(
          `Selected time overlaps with existing availability (${formatTime2(
            slot.start_time
          )} - ${formatTime2(slot.end_time)})`
        );
        return;
      }
    }

    const data = {
      user_id: userData.id,
      date: formatDate(selectedDate),
      start_time: formatTime(startTime2),
      end_time: formatTime(endTime2),
      consultation_modes: consultationTypes,
      apply_type: applyType2,
      preferred_languages: [],
    };
    if (consultationTypes.includes("in-person")) {
      data.clinic_name = selectedClinic;
      data.book_clinic = "yes";
    }
    console.log("Submitted Data:", data);
    setLoading2(true);
    try {
      const response = await axios.post(
        `${Config.BASE_URL}/api/doctor_availability2`,
        data
      );
      // console.log("postdata", postData);
      AllDoctorAll();
      AllDoctorAllavailability();
      AllDoctorAllavailabilityvirtul();

      setStartTime2("");
      setEndTime2("");
      setApplyType2("");
      setConsultationModes([]);
      setPreferredLanguages([]);
      setSelectedClinic("");
      toast.success("Data submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading2(false);
    }
    // Reset & close
    setError("");

    setIsModalOpen(false);
  };

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (startTime) {
      const [hours, minutes] = startTime.split(":");
      let endHour = parseInt(hours, 10) + 1;

      if (endHour >= 24) endHour -= 24;

      const formattedEndHour = endHour.toString().padStart(2, "0");
      setEndTime(`${formattedEndHour}:${minutes}`);
    } else {
      setEndTime("");
    }
  }, [startTime]);

  const [applyType, setApplyType] = useState("");
  const [consultationModes, setConsultationModes] = useState(["virtual"]);
  const [preferredLanguages, setPreferredLanguages] = useState([]);
  const [fees, setFees] = useState("");
  const [clinics, setClinics] = useState([]);
  const [selectedClinic, setSelectedClinic] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/doctor-fees/by-doctor/${userData.id}`)
      .then((response) => {
        const inPersonFees = response.data.fees.inPerson || [];
        // Extract clinic names and filter out duplicates using Set
        const clinicNames = Array.from(
          new Set(inPersonFees.map((fee) => fee.clinic_name))
        );
        setClinics(clinicNames);
      })
      .catch((error) => {
        console.error("Error fetching clinic data:", error);
      });
  }, [userData.id]);

  useEffect(() => {}, []);

  const toggleConsultationMode = (mode) => {
    setConsultationModes([mode]);
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}:00`;
  };

  const tileClassName = ({ date, view }) => {
    if (
      view === "month" &&
      highlightDates.some(
        (d) =>
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
      )
    ) {
      return "highlight";
    }
    return null;
  };
  const showInPersonFields = consultationModes.includes("in-person");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = {
      user_id: userData.id,
      date: date,
      start_time: formatTime(startTime),
      end_time: formatTime(endTime),
      apply_type: Number(applyType),
      consultation_modes: consultationModes,
      preferred_languages: preferredLanguages.map((lang) => lang.value),
      ...(showInPersonFields && {
        clinic_name: selectedClinic,
        book_clinic: "yes",
      }),
    };

    console.log("Post Data:", postData);
    setLoading(true);
    try {
      const response = await axios.post(
        `${Config.BASE_URL}/api/doctor_availability2`,
        postData
      );
      // console.log("postdata", postData);
      AllDoctorAll();
      AllDoctorAllavailability();
      AllDoctorAllavailabilityvirtul();
      setDate("");
      setStartTime("");
      setEndTime("");
      setApplyType("");
      setConsultationModes([]);
      setPreferredLanguages([]);
      setSelectedClinic("");
      toast.success("Data submitted successfully!");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(error.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const [availabilityshow, setAvailabilityShow] = useState("");
  const [availabilityshowinperson, setAvailabilityShowinperson] = useState([]);
  const [availabilityshowvirtul, setAvailabilityShowvitul] = useState([]);
  const [availableDay, setAvailableDay] = useState([]);
  useEffect(() => {
    AllDoctorAll();
    AllDoctorAllavailability();
    AllDoctorAllavailabilityvirtul();
    AllDoctorAllavailabilityinperson();
  }, []);

  const AllDoctorAll = () => {
    axios
      .get(`${Config.BASE_URL}/api/doctor/${userData.id}`)
      .then((resp) => {
        // setDoctor(resp.data);
        const doctorData = resp.data?.data?.doctor;
        console.log("docdata", resp.data?.data);
        setAvailabilityShow(resp.data?.data?.doctor);
        setAvailableDay(doctorData.doc_available || []);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [loadingVirtual, setLoadingVirtual] = useState(false);
  const [loadingInPerson, setLoadingInPerson] = useState(false);

  // const AllDoctorAllavailabilityvirtul = () => {
  //   setLoadingVirtual(true);
  //   axios
  //     .get(`${Config.BASE_URL}/api/availability-slots/${userData.id}/virtual`)
  //     .then((response) => {
  //       const dates = response.data.slots;

  //       setAvailabilityShowvitul(dates);
  //     })
  //     .catch((err) => console.error(err))
  //     .finally(() => setLoadingVirtual(false));
  // };

  const AllDoctorAllavailabilityvirtul = () => {
    setLoadingVirtual(true);
    axios
      .get(`${Config.BASE_URL}/api/availability/${userData.id}`)
      .then((response) => {
        const dates = response.data.availabilities;

        console.log("response:-", response.data);

        setAvailabilityShowvitul(dates);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingVirtual(false));
  };

  const AllDoctorAllavailabilityinperson = () => {
    setLoadingInPerson(true);
    axios
      .get(`${Config.BASE_URL}/api/availability-slots/${userData.id}/in-person`)
      .then((response) => {
        const dates = response.data.slots;

        setAvailabilityShowinperson(dates);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingInPerson(false));
  };

  const AllDoctorAllavailability = () => {
    axios
      .get(`${Config.BASE_URL}/api/availability/${userData.id}`)
      .then((response) => {
        const dates = response.data.availabilities
          .filter((item) => item.date) // filter non-empty date
          .map((item) => new Date(item.date));
        setHighlightDates(dates);
      });
  };

  const [showModalAvailability, setShowModalAvailability] = useState(false);
  const [availabilityid, setAvailabilityid] = useState(null);
  const [availabilityData, setAvailabilityData] = useState({
    date: "",
    start_time: "",
    end_time: "",
    consultation_modes: [],
    preferred_languages: [],
  });
  const formatTimeDate = (time) => {
    // take only HH:MM from HH:MM:SS if seconds exist
    return time ? time.slice(0, 5) : "";
  };
  // Fetch qualification by ID
  const AvailabilityhandleEdit = async (id) => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/availability-slots/get/${id}`
      );
      console.log("resresres", res.data?.data);
      const qualData = res.data.data;
      setAvailabilityid(qualData.id);
      setAvailabilityData({
        date: qualData.date.split(" ")[0], // remove time from date
        start_time: formatTimeDate(qualData.start_time),
        end_time: formatTimeDate(qualData.end_time),
        consultant_type: JSON.parse(qualData.consultant_type || "[]"), // parse here
        type: qualData.type || "available",
      });

      setShowModalAvailability(true);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching availability");
    }
  };

  // Handle Delete

  // Save the updated qualification
  const AvailabilityhandleSave = async () => {
    const payload = {
      user_id: userData?.id,
      date: availabilityData.date,
      start_time: availabilityData.start_time,
      end_time: availabilityData.end_time,
      consultant_type: [availabilityData.consultant_type],
      type: availabilityData.type,
      // preferred_languages: availabilityData.preferred_languages,
    };
    console.log("payload", payload);

    try {
      await axios.put(
        `${Config.BASE_URL}/api/availability-slots/update/${availabilityid}`,
        payload
      ); // or PUT endpoint
      setShowModalAvailability(false);
      AllDoctorAll();
      AllDoctorAllavailability(); // refresh availability list
      toast.success("Availability updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error updating availability");
    }
  };
  const consultationOptions = [
    { value: "virtual", label: "Virtual" },
    { value: "in-person", label: "In-Person" },
  ];

  const consultationOptionstype = [
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
  ];

  const navigate = useNavigate();

  // const selectedDay = date
  //   ? new Date(date).toLocaleDateString("en-US", { weekday: "long" })
  //   : null;

  // const dayAvailability = availableDay?.find((a) => a.day === selectedDay);
  // console.log("docda", date, selectedDay, dayAvailability);

  const consultationMode = consultationModes.includes("virtual")
    ? "virtual"
    : "inperson";

  const selectedDay = date
    ? new Date(date).toLocaleDateString("en-US", { weekday: "long" })
    : null;

  //  For VIRTUAL consultation — use doctor's availableDay array
  const virtualDayAvailability =
    consultationMode === "virtual"
      ? availableDay?.find((a) => a.day === selectedDay)
      : null;
  const [clinicHours, setClinicHours] = useState([]);
  useEffect(() => {
    if (!selectedClinic || consultationMode !== "inperson") return;

    const fetchClinicHours = async () => {
      try {
        const response = await axios.get(
          `${Config.BASE_URL}/api/clinics/by-name/${selectedClinic}`
        );

        console.log("Clinic response:", response.data);

        if (response.data.success) {
          setClinicHours(response.data.data || []);
        } else {
          setClinicHours([]);
        }
      } catch (err) {
        console.error("Error fetching clinic hours:", err);
      }
    };

    fetchClinicHours();
  }, [selectedClinic, consultationMode]);

  //  For IN-PERSON consultation — check clinic availability for selected day
  const clinicDayAvailability =
    consultationMode === "inperson"
      ? clinicHours?.find((c) => c.day === selectedDay)
      : null;

  //  Final dynamic availability (depends on consultation mode)
  const finalAvailability =
    consultationMode === "virtual"
      ? virtualDayAvailability
      : clinicDayAvailability;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Availability?"))
      return;

    try {
      const res = await axios.delete(
        `${Config.BASE_URL}/api/availability-delete/${id}`
      );
      if (res.data.success) {
        toast.success("Deleted successfully");
        // optionally refetch your list
        AllDoctorAll();
        AllDoctorAllavailability();
        AllDoctorAllavailabilityvirtul();
        AllDoctorAllavailabilityByDate();
        setError("");
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong while deleting."
      );
    }
  };

  return (
    <>
      <Toaster />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 content-area">
          <Navbar />
          <div className="container bgcolor mb-5">
            <div className="container mt-3">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <h3 className="p-2 m-0 text-center text-md-start">
                  Availability and Schedule
                </h3>
                {/* <button
                  className="btn btn-primary mt-2 mt-md-0"
                  onClick={() => navigate("/admin/dayschedule")}
                >
                  Add Virtual Days Availability
                </button> */}
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12 ">
                <Calendar
                  // onChange={onChange}
                  onChange={handleDateChange}
                  value={value}
                  className="calendarcss"
                  tileClassName={tileClassName}
                />
                <style>{`
                /* Add this to your CSS file or styled component */
                  .calendarcss .react-calendar__month-view__days {
                    gap: 8px; /* adjust spacing as you like */
                    display: grid !important;
                    grid-template-columns: repeat(7, 1fr); /* keep 7 days in a week */
                  }

                  .calendarcss .react-calendar__tile {
                    margin: 0; /* remove default margin */
                    padding: 10px; /* optional: add inner spacing */
                    border-radius: 30px;
                    text-align: center;
                  }

                  @media (max-width: 600px) {
                    .calendarcss .react-calendar__month-view__days {
                      gap: 4px;
                    }
                  }

                `}</style>

                {isModalOpen && (
                  <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                  >
                    <div className="modal-dialog">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">
                            All Availability and Schedule
                          </h5>
                          <button
                            type="button"
                            className="btn-close"
                            onClick={() => setIsModalOpen(false)}
                          ></button>
                        </div>

                        <div className="modal-body">
                          {/* Consultation Type */}
                          <div className="mb-3">
                            <label className="form-label d-block fw-bold">
                              Consultation Type
                            </label>
                            <div className="d-flex gap-3">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={consultationTypes.includes(
                                    "virtual"
                                  )}
                                  onChange={() => toggleType("virtual")}
                                  id="virtual"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="virtual"
                                >
                                  Virtual
                                </label>
                              </div>

                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={consultationTypes.includes(
                                    "in-person"
                                  )}
                                  onChange={() => toggleType("in-person")}
                                  id="inperson"
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="inperson"
                                >
                                  In-Person
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className=" mb-3">
                            {consultationTypes.includes("in-person") && (
                              <>
                                <div className="form-group mt-3">
                                  <label>Hospital Name</label>
                                  <select
                                    className="form-control"
                                    value={selectedClinic}
                                    onChange={(e) =>
                                      setSelectedClinic(e.target.value)
                                    }
                                  >
                                    <option value="" disabled>
                                      Select Hospital
                                    </option>
                                    {clinics.map((clinicName, index) => (
                                      <option key={index} value={clinicName}>
                                        {clinicName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </>
                            )}
                          </div>
                          {/* Date */}
                          <div className="mb-3">
                            <label className="form-label fw-bold">Date</label>
                            <input
                              type="text"
                              className="form-control"
                              value={selectedDate?.toLocaleDateString("en-GB")}
                              readOnly
                            />
                          </div>
                          <div className="row">
                            {/* Start Time */}
                            <div className="col-md-6 mb-3">
                              <label className="form-label fw-bold">
                                Start Time
                              </label>
                              <input
                                type="time"
                                className="form-control"
                                value={startTime2}
                                onChange={(e) => setStartTime2(e.target.value)}
                              />
                            </div>

                            <div className="col-md-6 mb-3">
                              <label className="form-label fw-bold">
                                End Time
                              </label>
                              <input
                                type="time"
                                className="form-control"
                                value={endTime2}
                                min={startTime2} // optional — ensures native picker blocks earlier times
                                onChange={(e) => setEndTime2(e.target.value)}
                              />
                            </div>
                          </div>
                          {/* Error Message */}
                          {error && (
                            <div
                              style={{ fontSize: "13px" }}
                              className="alert alert-danger py-2 mb-2"
                            >
                              {error}
                            </div>
                          )}
                          {/* Apply Type */}
                          <div className="mb-3">
                            <label className="form-label fw-bold">
                              Availability for
                            </label>
                            <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="applyType"
                                  id="apply1"
                                  value="1"
                                  checked={applyType2 === "1"}
                                  onChange={(e) =>
                                    setApplyType2(e.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="apply1"
                                >
                                  1 day
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="applyType"
                                  id="apply7"
                                  value="7"
                                  checked={applyType2 === "7"}
                                  onChange={(e) =>
                                    setApplyType2(e.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="apply7"
                                >
                                  next 7 days
                                </label>
                              </div>
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="applyType"
                                  id="apply30"
                                  value="30"
                                  checked={applyType2 === "30"}
                                  onChange={(e) =>
                                    setApplyType2(e.target.value)
                                  }
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="apply30"
                                >
                                  next 30 days
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="container my-3">
                          <h6 className="mb-3">Existing Availability</h6>

                          {loadingVirtual ? (
                            <div className="text-center py-4">Loading...</div>
                          ) : !availabilityByDate ||
                            availabilityByDate.length === 0 ? (
                            <div className="text-muted">
                              No availability for selected date.
                            </div>
                          ) : (
                            <div className="list-group">
                              {availabilityByDate.map((item) => (
                                <div
                                  key={
                                    item.id ||
                                    `${item.date}-${item.start_time}-${item.end_time}`
                                  }
                                  className="list-group-item d-flex justify-content-between align-items-center"
                                >
                                  <div>
                                    <div className="avail-time">
                                      {formatTime2(item.start_time)} —{" "}
                                      {formatTime2(item.end_time)}
                                    </div>
                                  </div>

                                  <div className="modes">
                                    {Array.isArray(item.consultation_modes) &&
                                    item.consultation_modes.length > 0 ? (
                                      item.consultation_modes.map((mode) => (
                                        <span
                                          key={mode}
                                          className={`badge mode-badge ${
                                            mode === "virtual"
                                              ? "bg-primary"
                                              : "bg-success"
                                          }`}
                                        >
                                          {mode.replace("-", " ")}
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-muted">—</span>
                                    )}
                                  </div>
                                  <div>
                                    <FaTrash
                                      onClick={() => handleDelete(item.id)}
                                      style={{
                                        color: "red",
                                        cursor: "pointer",
                                        fontSize: "18px",
                                      }}
                                      title="Delete"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <style>
                          {`
                          /* availability.css (or in a global CSS file) */
                          .avail-time {
                            font-weight: 600;
                            font-size: 1rem;
                          }

                          .mode-badge {
                            margin-left: 6px;
                            text-transform: capitalize;
                            font-weight: 600;
                            margin-right: 4px;
                            padding: 0.45rem 0.55rem;
                            border-radius: 0.45rem;
                          }

                          `}
                        </style>

                        <div className="modal-footer">
                          <button
                            className="btn btn-secondary"
                            onClick={() => setIsModalOpen(false)}
                          >
                            Cancel
                          </button>
                          <button
                            className="btn btn-primary"
                            onClick={handleSubmit2}
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* <div className="">
                  <h5 className="section-heading mt-4">Availability</h5>
                 

                  <>
                    <ul
                      className="nav nav-pills mb-4  p-2"
                      id="pills-tab"
                      role="tablist"
                    >
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          id="pills-new-tab"
                          data-toggle="pill"
                          href="#pills-new"
                          role="tab"
                        >
                          Virtual Consultation
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          id="pills-approved-tab"
                          data-toggle="pill"
                          href="#pills-approved"
                          role="tab"
                        >
                          In-Person Consultation
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content" id="pills-tabContent">
                     
                      <div
                        className="tab-pane fade show active"
                        id="pills-new"
                        role="tabpanel"
                      >
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th scope="col">No</th>
                                <th scope="col">Date</th>
                                <th scope="col">Start Time</th>
                                <th scope="col">End Time</th>
                                <th scope="col">Modes</th>
                                
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loadingVirtual ? (
                                <tr>
                                  <td colSpan={6} className="text-center">
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        py: 2,
                                      }}
                                    >
                                      <CircularProgress />
                                    </Box>
                                  </td>
                                </tr>
                              ) : (
                                availabilityshowvirtul.map((a, index) => {
                                  const createdAt = new Date(a.created_at);
                                  const now = new Date();
                                  const diffInHours =
                                    (now - createdAt) / (1000 * 60 * 60);
                                  const isEditable = diffInHours <= 24;

                                  return (
                                    <tr key={a.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {new Date(a.date).toLocaleDateString(
                                          "en-GB"
                                        )}
                                      </td>
                                      <td>{a.start_time.slice(0, 5)}</td>
                                      <td>{a.end_time.slice(0, 5)}</td>
                                      <td>
                                        {a.consultation_modes?.join(", ") ||
                                          a.consultant_type?.join(", ")}
                                      </td>
                                     
                                      <td>
                                        <button
                                          className="btn btn-primary btn-sm me-2"
                                          disabled={!isEditable}
                                          onClick={() =>
                                            AvailabilityhandleEdit(a.id)
                                          }
                                        >
                                          Update
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      
                      <div
                        className="tab-pane fade"
                        id="pills-approved"
                        role="tabpanel"
                      >
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th scope="col">No</th>
                                <th scope="col">Date</th>
                                <th scope="col">Start Time</th>
                                <th scope="col">End Time</th>
                                <th scope="col">Modes</th>
                                
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loadingInPerson ? (
                                <tr>
                                  <td colSpan={6} className="text-center">
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        py: 2,
                                      }}
                                    >
                                      <CircularProgress />
                                    </Box>
                                  </td>
                                </tr>
                              ) : (
                                availabilityshowinperson.map((a, index) => {
                                  const createdAt = new Date(a.created_at);
                                  const now = new Date();
                                  const diffInHours =
                                    (now - createdAt) / (1000 * 60 * 60);
                                  const isEditable = diffInHours <= 24;

                                  return (
                                    <tr key={a.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {new Date(a.date).toLocaleDateString(
                                          "en-GB"
                                        )}
                                      </td>
                                      <td>{a.start_time.slice(0, 5)}</td>
                                      <td>{a.end_time.slice(0, 5)}</td>
                                      <td>
                                        {a.consultation_modes?.join(", ") ||
                                          a.consultant_type?.join(", ")}
                                      </td>
                                      
                                      <td>
                                        {isEditable && (
                                          <button
                                            className="btn btn-primary btn-sm me-2"
                                            onClick={() =>
                                              AvailabilityhandleEdit(a.id)
                                            }
                                          >
                                            Update
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>

                  
                </div> */}

                <div className="">
                  <h5 className="section-heading mt-4">Availability</h5>
                  {/* <div className="card" style={{ background: "#f8f9fc", borderRadius: "12px", padding: "20px" }}> */}

                  <>
                    <div className="tab-content" id="pills-tabContent">
                      {/* New Tab */}
                      <div
                        className="tab-pane fade show active"
                        id="pills-new"
                        role="tabpanel"
                      >
                        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th scope="col">No</th>
                                <th scope="col">Date</th>
                                <th scope="col">Start Time</th>
                                <th scope="col">End Time</th>
                                <th scope="col">Modes</th>
                                {/* <th scope="col">Languages</th> */}
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {loadingVirtual ? (
                                <tr>
                                  <td colSpan={6} className="text-center">
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        py: 2,
                                      }}
                                    >
                                      <CircularProgress />
                                    </Box>
                                  </td>
                                </tr>
                              ) : (
                                availabilityshowvirtul.map((a, index) => {
                                  const createdAt = new Date(a.created_at);
                                  const now = new Date();
                                  const diffInHours =
                                    (now - createdAt) / (1000 * 60 * 60);
                                  const isEditable = diffInHours <= 24;

                                  return (
                                    <tr key={a.id}>
                                      <td>{index + 1}</td>
                                      <td>
                                        {new Date(a.date).toLocaleDateString(
                                          "en-GB"
                                        )}
                                      </td>
                                      <td>{a.start_time.slice(0, 5)}</td>
                                      <td>{a.end_time.slice(0, 5)}</td>
                                      <td>
                                        {a.consultation_modes?.join(", ") ||
                                          a.consultant_type?.join(", ")}
                                      </td>
                                      {/* <td>{a.preferred_languages?.join(", ") || "-"}</td> */}
                                      {/* <td>
                                        <button
                                          className="btn btn-primary btn-sm me-2"
                                          disabled={!isEditable}
                                          onClick={() =>
                                            AvailabilityhandleEdit(a.id)
                                          }
                                        >
                                          Update
                                        </button>
                                      </td> */}
                                      <td>
                                        <FaTrash
                                          onClick={() => handleDelete(a.id)}
                                          style={{
                                            color: "red",
                                            cursor: "pointer",
                                            fontSize: "18px",
                                          }}
                                          title="Delete"
                                        />
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </div>
              {/* <div className="col-lg-4">
                <div className="card spend-summary-card shadow-sm p-3 mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">All Availability and Schedule </h5>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      
                      <div className="col-lg-7">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="virtual"
                            checked={consultationModes.includes("virtual")}
                            onChange={() => toggleConsultationMode("virtual")}
                          />
                          <label className="form-check-label" htmlFor="virtual">
                            Virtual Consultation
                          </label>
                        </div>
                      </div>
                      <div className="col-lg-5">
                        <div className="form-check">
                          <input
                            type="radio"
                            className="form-check-input"
                            id="inPerson"
                            checked={consultationModes.includes("in-person")}
                            onChange={() => toggleConsultationMode("in-person")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inPerson"
                          >
                            In-Person
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-group mb-3 mt-3">
                      {showInPersonFields && (
                        <>
                          <div className="form-group mt-3">
                            <label>Clinic Name</label>
                            <select
                              className="form-control"
                              value={selectedClinic}
                              onChange={(e) =>
                                setSelectedClinic(e.target.value)
                              }
                            >
                              <option value="" disabled>
                                Select Clinic
                              </option>
                              {clinics.map((clinicName, index) => (
                                <option key={index} value={clinicName}>
                                  {clinicName}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="form-group  mt-3 mb-3">
                      <label>Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={(() => {
                          const tomorrow = new Date();
                          tomorrow.setDate(tomorrow.getDate() + 1);
                          return tomorrow.toISOString().split("T")[0];
                        })()}
                      />
                    </div>

                    <div className="row">
                      {finalAvailability && (
                        <div className="col-12">
                          <div className="alert alert-info py-2 mb-3 text-center">
                            You are available on <strong>{selectedDay}</strong>{" "}
                            from <br />
                            <strong>
                              {new Date(
                                `1970-01-01T${finalAvailability.start_time}`
                              ).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </strong>{" "}
                            to{" "}
                            <strong>
                              {new Date(
                                `1970-01-01T${finalAvailability.end_time}`
                              ).toLocaleTimeString([], {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </strong>
                          </div>
                        </div>
                      )}
                      <div className="form-group col-6">
                        <label>Start Time</label>
                        <input
                          type="time"
                          className="form-control"
                          value={startTime}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Prevent selecting times before start_time or after end_time
                            if (finalAvailability) {
                              const start = finalAvailability.start_time;
                              const end = finalAvailability.end_time;

                              if (value < start) {
                                setStartTime(start);
                                return;
                              }

                              if (value > end) {
                                setStartTime(end);
                                return;
                              }
                            }

                            setStartTime(value);
                          }}
                          min={
                            finalAvailability
                              ? finalAvailability.start_time
                              : ""
                          }
                          max={
                            finalAvailability ? finalAvailability.end_time : ""
                          }
                          disabled={!finalAvailability}
                        />
                        {!finalAvailability && date && (
                          <small className="text-danger">
                            You are not available on {selectedDay}.
                          </small>
                        )}
                      </div>

                     
                    </div>

                    <div className="mt-3">
                      <label>Apply Type</label>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          value={1}
                          name="applyType"
                          checked={applyType === "1"}
                          onChange={(e) => setApplyType(e.target.value)}
                        />
                        <label className="form-check-label">
                          Apply for 1 day
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          value={7}
                          name="applyType"
                          checked={applyType === "7"}
                          onChange={(e) => setApplyType(e.target.value)}
                        />
                        <label className="form-check-label">
                          Apply for next 7 days
                        </label>
                      </div>

                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          value={30}
                          name="applyType"
                          checked={applyType === "30"}
                          onChange={(e) => setApplyType(e.target.value)}
                        />
                        <label className="form-check-label">
                          Apply for next 30 days
                        </label>
                      </div>
                    </div>

                    <div className="save-btn-container mt-4">
                      <button
                        disabled={loading}
                        type="submit"
                        className="btn btn-primary"
                      >
                        {loading ? (
                          <>
                            <CircularProgress size={20} color="inherit" />
                            &nbsp; Saving...
                          </>
                        ) : (
                          "Create"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div> */}
            </div>
            <h6>Copyright © 2025 Yodoc UK All Rights Reserved.</h6>
          </div>
        </div>
      </div>

      {/* Inline CSS */}
      <style>
        {`
        .calendarcss {
        width: 100% !important;
        max-width: 100% !important;
        border: none !important;
        border-radius: 20px;

        }

        .spend-summary-card{
            background-color: #fff;
            border-radius: 20px;
            border: 1px solid #fff;
            }
        .calenderwidth{
        // width:80%;
        // margin-left:10%;
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
.highlight {
  background: #4EE4C1 !important;
  border-radius: 20rem;
  color: white;
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
  font-size: 16px;
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
        `}
      </style>

      <Modal
        show={showModalAvailability}
        onHide={() => setShowModalAvailability(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Availability</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={availabilityData.date}
                onChange={(e) =>
                  setAvailabilityData({
                    ...availabilityData,
                    date: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Control
                type="time"
                name="start_time"
                value={availabilityData.start_time}
                onChange={(e) =>
                  setAvailabilityData({
                    ...availabilityData,
                    start_time: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Control
                type="time"
                name="end_time"
                value={availabilityData.end_time}
                onChange={(e) =>
                  setAvailabilityData({
                    ...availabilityData,
                    end_time: e.target.value,
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Consultation Modes</Form.Label>
              <Select
                options={consultationOptions}
                value={consultationOptions.find(
                  (option) => option.value === availabilityData.consultant_type
                )}
                onChange={(selectedOption) =>
                  setAvailabilityData({
                    ...availabilityData,
                    consultant_type: selectedOption ? selectedOption.value : "",
                  })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Availability</Form.Label>
              <Select
                options={consultationOptionstype}
                value={consultationOptionstype.find(
                  (option) => option.value === availabilityData.type
                )}
                onChange={(selectedOption) =>
                  setAvailabilityData({
                    ...availabilityData,
                    type: selectedOption ? selectedOption.value : "",
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModalAvailability(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={AvailabilityhandleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AvailabilitySchedule;
