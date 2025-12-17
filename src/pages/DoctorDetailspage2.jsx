import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/Mask group (1).png";
import innerpage from "../assets/images/Inner page header.png";

import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import filter from "../assets/images/filterrestart.png";
import doctor from "../assets/images/doctor.png";
import doctor1 from "../assets/images/doctor1.png";
import video from "../assets/images/zoom.png";
import userImage from "../assets/images/21104.png";
import male from "../assets/images/male.png";
import female from "../assets/images/Female2.png";

import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Config from "../config";
import moment from "moment";
import toast, { Toaster } from "react-hot-toast";

function DoctorDetailspage2() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const feesdata = localStorage.getItem("fees");
  const address = localStorage.getItem("address");
  const clinicname = localStorage.getItem("clinicname");
  const patientID = userData?.id;
  const [availability, setAvailability] = useState([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    today.toLocaleDateString("en-CA")
  ); // Format: YYYY-MM-DD

  const [selectedSlots, setSelectedSlots] = useState([]);
  // const consultationFee = 20;

  const getFutureDates = () => {
    const startDate = new Date();
    startDate.setDate(today.getDate() + weekOffset * 4);

    return Array.from({ length: 4 }).map((_, index) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + index);
      date.setHours(0, 0, 0, 0);
      return {
        date,
        dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
        dayNumber: date.getDate(),
        isoDate: date.toLocaleDateString("en-CA"), // YYYY-MM-DD
      };
    });
  };

  const [drData, setUserData] = useState(null); // null is better than "" for object

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/doctor/${id}`)
      .then((res) => {
        console.log(res.data?.data, "11112222");
        setUserData(res.data?.data?.doctor);
        // setAvailability(res.data?.data?.doctor?.availability || []);
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/availability-slots/${id}/in-person`)
      .then((res) => {
        console.log(res.data?.slots, "API slots");
        setAvailability(res.data?.slots || []);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Keep this helper near the top of your component/file
  const dateOnly = (v) => {
    if (!v) return "";
    // if value already "YYYY-MM-DD"
    if (typeof v === "string" && v.length === 10) return v;
    // API gives "YYYY-MM-DD HH:mm:ss"
    if (typeof v === "string") return v.split(" ")[0];
    // if it's a Date object
    try {
      return new Date(v).toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  const groupByTimeOfDay = (slots) => {
    const groups = { morning: [], afternoon: [], evening: [] };

    // sort by start_time so they appear in order
    const sorted = [...slots].sort((a, b) =>
      a.start_time.localeCompare(b.start_time)
    );

    sorted.forEach((slot) => {
      const hour = parseInt(slot.start_time.slice(0, 2), 10);
      const label = `${slot.start_time.slice(0, 5)}`;
      // const label = `${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`;
      const withLabel = { ...slot, label };

      if (hour < 12) groups.morning.push(withLabel);
      else if (hour < 17) groups.afternoon.push(withLabel);
      else groups.evening.push(withLabel);
    });

    return groups;
  };

  const isSelected = (slot) =>
    selectedSlots.some(
      (s) =>
        s.date === slot.date &&
        s.start_time === slot.start_time &&
        s.end_time === slot.end_time
    );

  const handleSlotClick = (slot) => {
    console.log("slotslot", slot);
    const key = `${slot.date}-${slot.start_time}-${slot.end_time}`;
    const exists = selectedSlots.some(
      (s) => `${s.date}-${s.start_time}-${s.end_time}` === key
    );

    if (exists) {
      setSelectedSlots((prev) =>
        prev.filter((s) => `${s.date}-${s.start_time}-${s.end_time}` !== key)
      );
    } else {
      setSelectedSlots((prev) => [...prev, { ...slot, fees: feesdata }]);
    }
  };

  useEffect(() => {
    if (drData) {
      localStorage.setItem(
        "doctorInfo",
        JSON.stringify({
          id: drData.id,
          profile_image: drData.profile_image,
          firstname: drData.firstname,
          lastname: drData.lastname,
          specialization:
            drData.professional_registration?.specialization || "",
          degree: drData.qualifications?.[0]?.degree || "",
        })
      );
    }
  }, [drData]);

  // ✅ Disable the button until we have slots and doctorInfo saved
  // const isButtonDisabled =
  //   selectedSlots.length === 0 || !localStorage.getItem("doctorInfo");

  const handleSubmit = async () => {
    // ✅ Check if any slots are selected
    if (selectedSlots.length === 0) {
      toast.error(
        "Please select at least one slot before continuing.",
        "",
        "warning"
      );
      return; // 🛑 Stop execution here
    }

    // ✅ Gather doctorInfo from localStorage
    const doctorInfo = JSON.parse(localStorage.getItem("doctorInfo")) || {};

    // ✅ Prepare payload
    const payload = {
      doc_id: Number(id),
      type: "in-person",
      isConsultComplete: 0,
      destination: "New York",
      isBook: 0,
      slots: selectedSlots,
      doctorInfo: doctorInfo,
    };

    try {
      // ✅ Save full payload to localStorage
      localStorage.setItem("appointmentPayload", JSON.stringify(payload));

      // ✅ Show success
      toast.success("Appointment(s) selected successfully!");

      // ✅ Navigate to confirmation page
      navigate("/confirmbooking");
    } catch (error) {
      toast.error("Error saving appointment details. Please try again.");
      console.error(error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    email: "",
    review: "",
    message: "",
    rating: 0,
  });

  const handleFeedbackChange = (e) => {
    setFeedbackData({
      ...feedbackData,
      [e.target.name]: e.target.value,
    });
  };

  const handleStarClick = (star) => {
    setFeedbackData({
      ...feedbackData,
      rating: star,
    });
  };

  const handleFeedbackSubmit = async () => {
    const reviewPayload = {
      user_id: patientID,
      doctor_id: Number(id),
      ...feedbackData,
    };

    try {
      await axios.post(`${Config.BASE_URL}/api/feedbacks`, reviewPayload);
      toast.success("Thank you for your feedback!");
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback");
    }
  };

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/feedbacks/doctor/${id}`)
      .then((res) => {
        if (res.data.success) {
          setReviews(res.data.data);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const maskName = (firstname, lastname) => {
    if (!firstname || !lastname) return "Anonymous";
    return (
      firstname.charAt(0) +
      "*".repeat(firstname.length - 1) +
      " " +
      lastname.charAt(0) +
      "*".repeat(lastname.length - 1)
    );
  };

  console.log("reviews", reviews);

  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(`${Config.BASE_URL}/api/alldoctor`);
        if (res.data?.doctors) {
          setDoctors(res.data.doctors);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      }
    };
    fetchDoctors();
  }, []);

  // Handle search input
  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSuggestions([]);
      return;
    }

    const lower = value.toLowerCase();

    // Filter doctors
    const filtered = doctors.filter((doc) => {
      const fullName = `${doc.firstname || ""} ${
        doc.lastname || ""
      }`.toLowerCase();
      const specialization =
        doc.professional_registration?.specialization?.toLowerCase() || "";
      const subCategory =
        doc.professional_registration?.sub_category?.toLowerCase() || "";
      const availability = Array.isArray(doc.availability)
        ? doc.availability
            .map((a) =>
              `${a.day || ""} ${a.date || ""} ${a.start_time || ""}-${
                a.end_time || ""
              }`.toLowerCase()
            )
            .join(" ")
        : "";

      return (
        fullName.includes(lower) ||
        specialization.includes(lower) ||
        subCategory.includes(lower) ||
        availability.includes(lower)
      );
    });

    setSuggestions(filtered.slice(0, 5)); // show top 5 suggestions
  };

  const handleSuggestionClick = (doc) => {
    const fullName = `${doc.firstname || ""} ${doc.lastname || ""}`.trim();
    setQuery(fullName); // Set input value to the clicked name
    setSuggestions([]); // Close dropdown
  };

  const handleSearch = () => {
    if (!query.trim()) return;

    const lower = query.toLowerCase();

    const matchedDoctor = doctors.find((doc) => {
      const fullName = `${doc.firstname || ""} ${
        doc.lastname || ""
      }`.toLowerCase();
      const specialization =
        doc.professional_registration?.specialization?.toLowerCase() || "";
      const subCategory =
        doc.professional_registration?.sub_category?.toLowerCase() || "";
      const availability = Array.isArray(doc.availability)
        ? doc.availability
            .map((a) =>
              `${a.day || ""} ${a.date || ""} ${a.start_time || ""}-${
                a.end_time || ""
              }`.toLowerCase()
            )
            .join(" ")
        : "";

      return (
        fullName.includes(lower) ||
        specialization.includes(lower) ||
        subCategory.includes(lower) ||
        availability.includes(lower)
      );
    });

    if (matchedDoctor) {
      navigate(`/doctordetails/${matchedDoctor.id}`);
      // setQuery("");
    } else {
      console.log("No matching doctor found.");
      // Optionally, show a message or redirect to a search results page
    }
  };

  return (
    <>
      <Toaster />

      <div
        className="backgroundimage"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          minHeight: "100%",
        }}
      >
        {/* Your content below header and over background image */}
        <Header />
        <div className="container mt-2">
          <div
            className="section-container"
            style={{
              backgroundImage: `url(${innerpage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100%",
            }}
          >
            <h1 className="headingtext">
              Find Local Doctors and &nbsp;
              <br />
              Practitioners You Can Trust
            </h1>
            <p>
              <span className="highlight-number">10k+</span> Doctors
              <img scr={sectionbg} />
            </p>

            <div className="search-box">
              <div className="search-input-group">
                {/* <div className="location">
                                     <img src={locationicon} alt="Location" />
                                     <span>London</span>
                                   </div> */}

                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by Dr. Name ,Specialization & Services"
                  value={query}
                  onChange={handleChange}
                />

                <button className="search-button" onClick={handleSearch}>
                  <img src={searchicon} alt="Search" />
                </button>
              </div>

              <ul className="suggestions-list">
                {suggestions.map((doc) => (
                  <li
                    key={doc.id}
                    className="suggestion-item"
                    style={{ textAlign: "left", cursor: "pointer" }}
                    onClick={() => handleSuggestionClick(doc)}
                  >
                    <div>
                      <span style={{ color: "#464646" }}>
                        {doc.firstname} {doc.lastname} ({" "}
                        {JSON.parse(
                          doc.professional_registration?.specialization || "[]"
                        ).join(", ")}
                        (
                        {JSON.parse(
                          doc.professional_registration?.sub_category || "[]"
                        ).join(", ")}
                        ))
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="container mt-4">
          <div className="row">
            <div className="col-12 col-md-8">
              {drData ? (
                <div className=" mb-4">
                  <div className="doctor-card p-2 shadow-sm">
                    <div className="d-flex align-items-center">
                      <img
                        src={
                          drData.profile_image
                            ? `${Config.BASE_URL}/${drData.profile_image}`
                            : drData.gender === "Female"
                            ? female
                            : male
                        }
                        alt="Doctor"
                        className="doctor-img me-3"
                      />
                      <div>
                        <h5 className="mb-1">
                          {drData.firstname} {drData.lastname}
                        </h5>
                        <p className="text-muted mb-0 small">
                          {drData.qualifications?.[0]?.degree}
                          {/* ,{" "}
                          {drData.qualifications?.[0]?.institution} */}
                          <br />
                          {JSON.parse(
                            drData.professional_registration?.specialization ||
                              "[]"
                          ).join(", ")}
                          {/* {drData.professional_registration?.specialization} */}
                        </p>
                      </div>
                    </div>
                    <div className="startdatatext">
                      <div
                        className="row text-center mt-2  p-2 doctor-stats"
                        style={{ marginLeft: "0px", marginRight: "0px" }}
                      >
                        {/* <div className="col-3">
                          <strong className="text-primary">{drData.overall_feedback_percentage}%</strong>
                          <p className="small text-muted mb-0">
                            Satisfied <br />
                            Patients
                          </p>
                        </div> */}
                        <div className="col-3">
                          <strong
                            style={{
                              fontFamily: "Manrope, sans-serif",
                              fontWeight: 700,
                              fontSize: "clamp(14px, 1.5vw, 16px)", // responsive font size
                              lineHeight: "20px",
                              color: "#4C6BE9",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "18px",
                                color:
                                  doctor.overall_feedback_percentage > 0
                                    ? "#F1C40F"
                                    : "#D5D5D5", // yellow if >0 else grey
                              }}
                            >
                              ★
                            </span>
                            &nbsp;
                            {drData.overall_feedback_percentage}
                          </strong>

                          <p
                            className="mb-0"
                            style={{
                              fontFamily: "Manrope, sans-serif",
                              fontWeight: 400,
                              fontSize: "clamp(14px, 1.5vw, 16px)", // responsive font size
                              lineHeight: "22px",
                              color: "#464646",
                              margin: 0,
                            }}
                          >
                            Rating
                          </p>
                        </div>
                        {/* <div className="col-3">
                          <strong className="text-dark">
                            {drData.unique_user_id_count}
                          </strong>
                          <p className="small text-muted mb-0">Patient</p>
                        </div> */}
                        <div className="col-3">
                          <strong
                            style={{
                              fontFamily: "Manrope, sans-serif",
                              fontWeight: 700,
                              fontSize: "clamp(14px, 1.5vw, 16px)", // responsive font size
                              lineHeight: "20px",
                              color: "#4C6BE9",
                            }}
                          >
                            {drData.unique_user_id_count}
                          </strong>
                          <p
                            className="mb-0"
                            style={{
                              fontFamily: "Manrope, sans-serif",
                              fontWeight: 400,
                              fontSize: "clamp(14px, 1.5vw, 16px)", // responsive font size
                              lineHeight: "22px",
                              color: "#464646",
                              margin: 0,
                            }}
                          >
                            Patient
                          </p>
                        </div>
                        {/* <div className="col-3">
                          <strong className="text-dark">
                            {
                              drData.professional_registration
                                ?.years_of_experience
                            }{" "}
                            Years
                          </strong>
                          <p className="small text-muted mb-0">Experience</p>
                        </div> */}
                        <div className="col-3">
                          <strong
                            style={{
                              fontFamily: "Manrope, sans-serif",
                              fontWeight: 700,
                              fontSize: "clamp(14px, 1.5vw, 16px)", // responsive font size
                              lineHeight: "20px",
                              color: "#4C6BE9",
                            }}
                          >
                            {drData.professional_registration
                              ?.years_of_experience || 0}{" "}
                            Years
                          </strong>
                          <p
                            className="mb-0"
                            style={{
                              fontFamily: "Manrope, sans-serif",
                              fontWeight: 400,
                              fontSize: "clamp(14px, 1.5vw, 16px)", // responsive font size
                              lineHeight: "22px",
                              color: "#464646",
                              margin: 0,
                            }}
                          >
                            Experience
                          </p>
                        </div>
                        <div className="col-3">
                          <strong
                            style={{
                              fontFamily: "Manrope, sans-serif",
                              fontWeight: 700,
                              fontSize: "clamp(14px, 1.5vw, 16px)", // responsive font size
                              lineHeight: "20px",
                              color: "#4C6BE9",
                            }}
                          >
                            15 – 30 Min
                          </strong>
                          <p
                            className="mb-0"
                            style={{
                              fontFamily: "Manrope, sans-serif",
                              fontWeight: 400,
                              fontSize: "clamp(14px, 1.5vw, 16px)", // responsive font size
                              lineHeight: "22px",
                              color: "#464646",
                              margin: 0,
                            }}
                          >
                            Waiting Time
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="calendar-wrapper mt-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() =>
                          setWeekOffset((prev) => Math.max(prev - 1, 0))
                        }
                        disabled={weekOffset === 0}
                      >
                        ‹
                      </button>

                      <div className="d-flex justify-content-center flex-grow-1 week-calendar">
                        {getFutureDates().map((day, index) => {
                          const isActive = day.isoDate === selectedDate;
                          return (
                            <div
                              key={index}
                              className={`calendar-day text-center mx-2 px-2 py-1 rounded ${
                                isActive ? "active-day" : "clickable"
                              }`}
                              onClick={() => setSelectedDate(day.isoDate)}
                            >
                              <div>{day.dayName}</div>
                              <div className="small">{day.dayNumber}</div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => setWeekOffset((prev) => prev + 1)}
                      >
                        ›
                      </button>
                    </div>
                  </div>
                  {(() => {
                    // 1) Filter slots for the chosen calendar day
                    const selectedAvailability = availability.filter(
                      (item) => dateOnly(item.date) === dateOnly(selectedDate)
                    );

                    // 2) Empty-state if no slots at all for this day
                    if (selectedAvailability.length === 0) {
                      return (
                        <div className="text-muted text-center py-3">
                          No slots available for the selected date.
                        </div>
                      );
                    }

                    // 3) Group into morning/afternoon/evening (already sorted + labeled)
                    const grouped = groupByTimeOfDay(selectedAvailability);

                    const hasAnySlot =
                      grouped.morning.length ||
                      grouped.afternoon.length ||
                      grouped.evening.length;

                    if (!hasAnySlot) {
                      return (
                        <div className="text-muted text-center py-3">
                          No available time slots for this day.
                        </div>
                      );
                    }

                    // 4) Render sections
                    const sections = [
                      { key: "morning", title: "Morning" },
                      { key: "afternoon", title: "Afternoon" },
                      { key: "evening", title: "Evening" },
                    ];

                    return sections.map(({ key, title }) =>
                      grouped[key].length > 0 ? (
                        <div key={key} className="mb-4">
                          <p className="mt-2 font-weight-bold text-secondary">
                            {title}
                          </p>

                          {/* Flex wrap + gap for spacing */}
                          <div
                            className="d-flex flex-wrap"
                            style={{ gap: "8px" }}
                          >
                            {grouped[key].map((slot) => (
                              <span
                                key={slot.id}
                                className={`badge px-3 py-2 border ${
                                  isSelected(slot)
                                    ? "badge-primary text-white"
                                    : "badge-light text-dark"
                                }`}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleSlotClick(slot)}
                              >
                                {/* 👇 THIS was the main fix (use the label) */}
                                {slot.label}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null
                    );
                  })()}

                  {/* <div className="save-btn-container">
                    <button className="save-btn" onClick={handleSubmit}>
                      Book Appointment
                    </button>
                  </div> */}
                </div>
              ) : (
                <div className="col-12 text-center mt-4">
                  <h5 className="text-muted">Loading doctor details...</h5>
                </div>
              )}

              <div className="bgfeedback mb-5">
                {drData && (
                  <h5 className="mb-4">
                    Reviews about {drData.firstname} {drData.lastname}
                  </h5>
                )}

                {reviews && reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="mb-3">
                      <div className="boaderfeedback p-3 ">
                        <div className="d-flex align-items-center mb-2">
                          <i className="fa fa-thumbs-up mr-2"></i>
                          <strong>I recommend the doctor</strong>
                        </div>
                        <p className="mb-2">
                          <em>" {review.review} "</em>
                        </p>
                        <small className="text-muted d-block">
                          Verified Patient{" "}
                          {maskName(
                            review.user.firstname,
                            review.user.lastname
                          )}{" "}
                          · {moment(review.created_at).fromNow()}
                        </small>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No reviews found</p>
                )}
              </div>
            </div>

            <div className="col-12 col-md-4 mb-4 p-3 tabdatadoctordetails">
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
              >
                <div className="tabdatacontant">
                  <div className="clinic-card">
                    <h4 className="clinic-name">{clinicname}</h4>
                    <div className="clinic-fee">£{feesdata}</div>
                    <div className="clinic-info">
                      <i className="fas fa-map-marker-alt"></i> {address}
                    </div>
                    {/* <div className="clinic-info">
        <i className="fas fa-clock"></i> 05:00 pm – 07:00 pm
      </div> */}
                    <button
                      className="book-btn"
                      onClick={handleSubmit}
                      // disabled={isButtonDisabled}
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <style>
        {`
        .boaderfeedback{
        padding:20px;
  border-radius: 16px;
  border: 1px solid #CCCC;
        }
        .bgfeedback{
       background: #fff;
       padding: 30px;
  border-radius: 20px;

        }
        .clinic-card {
  background: #fff;
  border-radius: 12px;
  padding: 1.25rem;
  margin: 0.75rem;
  width: 100%;
  // box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  // justify-content: space-between;
  font-family: Arial, sans-serif;
  // transition: transform 0.2s ease;
}

// .clinic-card:hover {
//   transform: translateY(-4px);
// }

.clinic-name {
  font-weight: 600;
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
  cursor: pointer;
  line-height: 1.3;
}

.clinic-fee {
  color: #007bff;
  font-weight: bold;
  margin-bottom: 0.75rem;
}

.clinic-info {
  color: #555;
  font-size: 0.9rem;
  margin: 0.3rem 0;
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.clinic-info i {
  color: #28a745;
  min-width: 1rem;
  text-align: center;
}

.book-btn {
  background: #64ebcd;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: #222;
  font-weight: 600;
  width: 100%;
  text-align: center;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s ease;
  text-decoration: none;
}

.book-btn:hover {
  background: #4dd8b9;
}

   .clinic-link {
  text-decoration: none;
  color: inherit;
  display: inline-block;
}
   .clinic-link:hover {
  text-decoration: none;
  color: inherit;
  display: inline-block;
}

.clinic-card {
  background: #fff;
  border-radius: 10px;
  padding: 1rem;
  margin: 0.5rem;
  min-width: 150px;
  text-align: center;
  // box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  // transition: transform 0.2s ease;
}

// .clinic-card:hover {
//   transform: translateY(-2px);
//   background: #f5f5f5;
//   text-decoration: none;

// }






           .search-container {
  display: flex;
  justify-content: center;   /* Centers the box horizontally */
  padding: 20px;             /* Optional spacing around the box */
}

.serchBox {
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
}

.serchBox .form-control {
  border-radius: 0;
  box-shadow: none;
}

.serchBox .search-btn {
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
}

.serchBox img {
  width: 20px;
  height: 20px;
}
        /* Optional for spacing and alignment */
   .save-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.save-btn {
  background-color: #70EFCD;
  color: #000;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.3s;
}
        .doctor-img{
        width:165px;
        height:200px;
  border-radius: 10px;

        }
.week-calendar {
  gap: 5px;
}

.calendar-day {
  min-width: 50px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 4px 0;
  cursor: pointer;
  transition: background 0.3s ease;
}

.calendar-day.clickable:hover {
  background-color: #f0f0f0;
}

.calendar-day.active-day {
  background-color: #007bff;
  color: #fff;
  font-weight: bold;
  border: 1px solid #007bff;
}



        .hoverdata span:hover{
  background-color: #E0EAF3;

        }
        
.nav-link.active {
  color: #fff !important;
  background-color: #007bff !important; /* Optional: change background too */
}


.tabdatadoctordetails{
  background-color: white;
  border-radius: 16px;
  height: 100%;


}
  .tabdatacontant{
  border :1px solid #22C55E;
  border-radius: 16px;
  padding: 20px;
  }
.borderrounded{
border :1px solid #22C55E;
  border-radius: 16px;

}
        .doctor-card {
  background-color: #fff;
  border-radius: 16px;
}

.doctor-stats{
  background-color: #F7F9FC;
  border-radius: 8px;


}

.doctor-stats strong {
  font-size: 1rem;
}



.btn-success, .btn-primary {
  font-weight: 500;
  padding: 10px 0;
}

.doctordetails{
  background-color: #F7F9FC;
  border-radius: 20px;
  

}


/* Container */
/* Wrapper for center alignment */
.suggestions-list {
  position: absolute;
  top: 85%; /* exactly below search box */
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #ddd;
  border-top: none;
  border-radius: 10px;
  max-height: 250px;
  width: 100%;
  max-width: 700px;
  overflow-y: auto;
  z-index: 999;
  list-style: none;
  // margin-top: 4px;
  padding: 0;
}

.suggestion-item {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #f1f1f1;
  font-size: 14px;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}
  

 /* Wrapper for center alignment */
.search-box {
   display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
}
.search-box {
  display: flex;
  justify-content: center;
  padding: 20px;
}

/* Main container */
.search-input-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  max-width: 700px;
  width: 100%;
  gap: 8px;
  height:52px;
  overflow: hidden;
}
  .search-input-group .search-button{
  margin-right:3px;
  }

/* Location button */
.location {
  display: flex;
  align-items: center;
  // background-color: #e0eaf3;
  background-color: #F5FAFF;

  padding: 16px 16px;
  // border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.location img {
  height: 18px;
  margin-right: 6px;
}

/* Search input */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 15px;
  padding: 12px 16px;
  color: #333;
  background-color: white;
}

/* Search button */
.search-button {
  background-color: #70efcd;
  border: none;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button img {
  height: 20px;
}

/* Mobile view */
@media (max-width: 768px) {
.calendar-wrapper{
margin-left:-11px;
}
.doctor-img{
width:100px;
height:120px;
}
  .search-input-group {
    // flex-direction: column;
    align-items: stretch;
    // padding: 6px;
    // gap: 42px;
    width:100%;
    background-color: white;
    border-radius: 16px;
    height:46.5px;

  }


  .search-input
  {
    width: 100%;
    border-radius: 12px;
  }
    .location{
    width: 28%;
    font-size:12px;

    }
     .search-button{
    width: 15%;

     }

  .search-button {
    height: 40px;
    justify-content: center;
  }

  .search-input-group .search-button{

  margin-right:3px;
  margin-top:3px;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
 

  .headingtext {
    font-size: 22px;
    line-height: 32px;
    text-align: center;
  }
}


            /* Base styles */


.section-container {

  padding: 80px 20px;
  border-radius: 20px;
  margin-top: 20px;
  text-align: center;
}

.headingtext {
  font-size: 36px;
  font-weight: 600;
  color: #333;
  line-height: 48px;
  margin-bottom: 20px;
}

.highlight-number {
  color: blue;
  font-weight: 500;
}




/* Responsive styles */
@media (max-width: 768px) {
  .headingtext {
    font-size: 22px;
    line-height: 32px;
  }

  
}
                    `}
      </style>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Leave Feedback</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Name"
                  name="name"
                  value={feedbackData.name}
                  onChange={handleFeedbackChange}
                />
                <input
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  name="email"
                  value={feedbackData.email}
                  onChange={handleFeedbackChange}
                />

                {/* STAR RATING */}
                <label className="form-label">Rating:</label>
                <div className="mb-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <i
                      key={index}
                      className={`fa-star fa ${
                        index < feedbackData.rating ? "fas" : "far"
                      }`}
                      style={{
                        cursor: "pointer",
                        color: index < feedbackData.rating ? "gold" : "#ccc",
                        fontSize: "24px",
                        marginRight: "5px",
                      }}
                      onClick={() => handleStarClick(index + 1)}
                    ></i>
                  ))}
                  <div className="mt-1">
                    {feedbackData.rating > 0 &&
                      `You rated: ${feedbackData.rating} star${
                        feedbackData.rating > 1 ? "s" : ""
                      }`}
                  </div>
                </div>

                <textarea
                  className="form-control mb-2"
                  placeholder="Review"
                  name="review"
                  value={feedbackData.review}
                  onChange={handleFeedbackChange}
                ></textarea>
                <textarea
                  className="form-control mb-2"
                  placeholder="Message"
                  name="message"
                  value={feedbackData.message}
                  onChange={handleFeedbackChange}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={handleFeedbackSubmit}
                >
                  Submit Feedback
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DoctorDetailspage2;

const SlotGroup = ({ date, handleSlotClick, isSelected }) => {
  const slotData = [
    { label: "Morning", times: ["08:30", "09:00", "09:30", "10:00"] },
    {
      label: "Afternoon",
      times: ["12:30", "13:00", "13:30", "14:00", "14:30"],
    },
    {
      label: "Evening",
      times: [
        "16:00",
        "16:30",
        "17:00",
        "17:30",
        "18:00",
        "18:30",
        "19:00",
        "19:30",
      ],
    },
  ];

  return (
    <>
      {slotData.map((group, i) => (
        <div key={i}>
          <p className="mb-1 font-weight-bold">{group.label}</p>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {group.times.map((time, idx) => (
              <span
                key={idx}
                className={`badge border px-3 py-2 ${
                  isSelected(date, time)
                    ? "bg-primary text-white"
                    : "text-black badge-light"
                }`}
                onClick={() => handleSlotClick(date, time, group.label)}
                style={{ cursor: "pointer" }}
              >
                {convertTo12Hour(time)}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

const convertTo12Hour = (time) => {
  const [hour, minute] = time.split(":");
  const date = new Date();
  date.setHours(+hour);
  date.setMinutes(+minute);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};
