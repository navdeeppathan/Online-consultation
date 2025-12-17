import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/Mask group (1).png";
import innerpage2 from "../assets/images/Inner page header.png";
import innerpage from "../assets/images/innerpagebanner.png";

import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import filter from "../assets/images/filterrestart.png";
import doctor from "../assets/images/doctor.png";
import doctor1 from "../assets/images/doctor1.png";
import userImage from "../assets/images/21104.png";
import male from "../assets/images/male.png";
import female from "../assets/images/Female2.png";
import inperson from "../assets/images/inperson.png";

import video from "../assets/images/zoom.png";
import Footer from "../components/Footer";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import axios from "axios";
import Config from "../config";
import toast, { Toaster } from "react-hot-toast";
import moment from "moment";
import {
  FaCheckCircle,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaStar,
  FaUserMd,
} from "react-icons/fa";

function DoctorDetailspage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Doctor ID
  const userData = JSON.parse(localStorage.getItem("user"));
  const patientID = userData?.id;

  const [availability, setAvailability] = useState([]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    today.toLocaleDateString("en-CA")
  ); // Format: YYYY-MM-DD

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [consultationFee, setConsultationFee] = useState(0);
  const [consultationMode, setConsultationMode] = useState("virtual");

  const handleTabClick = (type) => {
    setConsultationMode(type);
  };

  const fetchInpersonFee = () => {
    axios
      .get(`${Config.BASE_URL}/api/doctor-fees/by-doctor/${id}`)
      .then((response) => {
        const fees = response.data?.fees;
        setConsultationFee(
          consultationMode === "virtual"
            ? fees?.virtual?.[0]?.amount || 0
            : fees?.inPerson?.[0]?.amount || 0
        );
      });
  };
  useEffect(() => {
    if (id) fetchInpersonFee();
  }, [id, consultationMode]);

  // useEffect(() => {
  //   axios
  //     .get(`${Config.BASE_URL}/api/doctor-fees/by-doctor/${id}`)
  //     .then((response) => {
  //       console.log("consultion fees:-", response.data?.fees, "777");
  //       setConsultationFee(response.data?.fees?.virtual[0]?.amount);
  //     });
  // }, []);
  // const consultationFee = 20;

  // const getFutureDates = () => {
  //   const today = new Date();
  //   const startDate = new Date(today);
  //   startDate.setDate(today.getDate() + 1 + weekOffset * 4);

  //   return Array.from({ length: 4 }).map((_, index) => {
  //     const date = new Date(startDate);
  //     date.setDate(startDate.getDate() + index);
  //     date.setHours(0, 0, 0, 0);
  //     return {
  //       date,
  //       dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
  //       dayNumber: date.getDate(),
  //       isoDate: date.toLocaleDateString("en-CA"), // YYYY-MM-DD
  //     };
  //   });
  // };

  const getFutureDates = () => {
    if (!availability || availability.length === 0) return [];

    const startDate = getEarliestSlotDate(availability); // start from earliest slot

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

  // useEffect(() => {
  //   axios
  //     .get(`${Config.BASE_URL}/api/doctor/${id}`)
  //     .then((res) => {
  //       // console.log(res.data?.data, "11112222");
  //       setUserData(res.data?.data?.doctor);
  //       // setAvailability(res.data?.data?.doctor?.availability || []);
  //     })
  //     .catch((err) => console.error(err));
  // }, [id]);

  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    setLoading2(true);
    axios
      .get(`${Config.BASE_URL}/api/doctor/${id}`)
      .then((res) => {
        setUserData(res.data?.data?.doctor);
        console.log("doctordata:-", res.data?.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading2(false));
  }, [id]);

  // useEffect(() => {
  //   axios
  //     .get(`${Config.BASE_URL}/api/availability-slots/${id}/virtual`)
  //     .then((res) => {
  //       const slots = res.data?.slots || [];
  //       console.log("virtual:-", slots);
  //       setAvailability(slots);

  //       const bestDate = pickDefaultDate(slots);
  //       console.log("selected date:-", bestDate);

  //       setSelectedDate(bestDate);
  //     })
  //     .catch((err) => console.error(err));
  // }, [id]);

  const getEarliestSlotDate = (slots) => {
    if (!slots || slots.length === 0) return today;
    const dates = slots.map((s) => new Date(dateOnly(s.date)));
    dates.sort((a, b) => a - b);
    return dates[0];
  };

  useEffect(() => {
    fetchSlots(consultationMode);
  }, [id, consultationMode]);

  const fetchSlots = (type) => {
    axios
      .get(`${Config.BASE_URL}/api/availability-slots/${id}/${type}`)
      .then((res) => {
        const slots = res.data?.slots || [];
        setAvailability(slots);
        const earliest = getEarliestSlotDate(slots);
        setSelectedDate(earliest.toISOString().slice(0, 10));
      })
      .catch((err) => console.error(err));
  };

  // useEffect(() => {
  //   axios
  //     .get(`${Config.BASE_URL}/api/availability-slots/${id}/virtual`)
  //     .then((res) => {
  //       const slots = res.data?.slots || [];
  //       setAvailability(slots);

  //       // Pick earliest available date
  //       const earliest = getEarliestSlotDate(slots);
  //       setSelectedDate(earliest.toISOString().slice(0, 10)); // YYYY-MM-DD
  //     })
  //     .catch((err) => console.error(err));
  // }, [id]);

  const [loadinginperson, setLoadingInPerson] = useState(false);

  // useEffect(() => {
  //   axios
  //     .get(`${Config.BASE_URL}/api/availability-slots/${id}/in-person`)
  //     .then((res) => {
  //       const slots = res.data?.slots || [];
  //       //  setAvailability(slots);

  //       console.log("slots:-", slots);
  //       //  const bestDate = pickDefaultDate(slots);
  //       //  setSelectedDate(bestDate);
  //     })
  //     .catch((err) => console.error(err));
  // }, [id]);

  // Keep this helper near the top of your component/file
  // const dateOnly = (v) => {
  //   if (!v) return "";
  //   // if value already "YYYY-MM-DD"
  //   if (typeof v === "string" && v.length === 10) return v;
  //   // API gives "YYYY-MM-DD HH:mm:ss"
  //   if (typeof v === "string") return v.split(" ")[0];
  //   // if it's a Date object
  //   try {
  //     return new Date(v).toISOString().slice(0, 10);
  //   } catch {
  //     return "";
  //   }
  // };

  const dateOnly = (v) => {
    if (!v) return "";
    if (typeof v === "string" && v.length === 10) return v;
    if (typeof v === "string") return v.split(" ")[0];
    try {
      return new Date(v).toISOString().slice(0, 10);
    } catch {
      return "";
    }
  };

  // choose best default date based on availability
  const pickDefaultDate = (slots) => {
    if (!slots || slots.length === 0) return today.toLocaleDateString("en-CA");

    const todayIso = today.toLocaleDateString("en-CA");

    // 1) Check if there are slots today
    if (slots.some((s) => dateOnly(s.date) === todayIso)) {
      return todayIso;
    }

    // 2) Check next available future date (next 30 days max for safety)
    for (let i = 1; i <= 30; i++) {
      const next = new Date(today);
      next.setDate(today.getDate() + i);
      const nextIso = next.toLocaleDateString("en-CA");
      if (slots.some((s) => dateOnly(s.date) === nextIso)) {
        return nextIso;
      }
    }

    // 3) Fallback to today if no future slots found
    return todayIso;
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
    // console.log("slotslot", slot);
    const key = `${slot.date}-${slot.start_time}-${slot.end_time}`;
    const exists = selectedSlots.some(
      (s) => `${s.date}-${s.start_time}-${s.end_time}` === key
    );

    if (exists) {
      setSelectedSlots((prev) =>
        prev.filter((s) => `${s.date}-${s.start_time}-${s.end_time}` !== key)
      );
    } else {
      setSelectedSlots((prev) => [...prev, { ...slot, fees: consultationFee }]);
    }
  };

  // console.log("availabilityavailability", availability);

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

  // Disable the button until we have slots and doctorInfo saved
  // const isButtonDisabled =
  //   selectedSlots.length === 0 || !localStorage.getItem("doctorInfo");
  const [loading, setLoading] = useState(false);
  // const handleSubmit = async () => {
  //   //  Check if any slots are selected
  //   if (selectedSlots.length === 0) {
  //     toast.error("Please select at least one slot before continuing.");
  //     return; //  Stop execution here
  //   }
  //   setLoading(true);

  //   //  Gather doctorInfo from localStorage
  //   const doctorInfo = JSON.parse(localStorage.getItem("doctorInfo")) || {};

  //   //  Prepare payload
  //   const payload = {
  //     doc_id: Number(id),
  //     type: "virtual",
  //     isConsultComplete: 0,
  //     destination: "New York",
  //     isBook: 0,
  //     slots: selectedSlots,
  //     doctorInfo: doctorInfo,
  //   };

  //   try {
  //     //  Save full payload to localStorage
  //     localStorage.setItem("appointmentPayload", JSON.stringify(payload));

  //     //  Show success
  //     // toast.success("Appointment(s) selected successfully!");

  //     //  Navigate to confirmation page
  //     // navigate("/confirmbooking");
  //     navigate("/insurance");
  //   } catch (error) {
  //     toast.error("Error saving appointment details. Please try again.");
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (appointmentType, clinic = null) => {
    if (selectedSlots.length === 0) {
      toast.error("Please select at least one slot before continuing.");
      return;
    }

    if (appointmentType === "in-person") {
      setLoadingInPerson(true);
    } else {
      setLoading(true);
    }

    const doctorInfo = JSON.parse(localStorage.getItem("doctorInfo")) || {};

    const payload = {
      doc_id: Number(id),
      type: appointmentType, // "virtual" or "inperson"
      isConsultComplete: 0,
      destination: appointmentType === "virtual" ? "New York" : clinic?.address,
      isBook: 0,
      slots: selectedSlots,
      doctorInfo,
      clinic: appointmentType === "in-person" ? clinic : null,
    };

    try {
      localStorage.setItem("appointmentPayload", JSON.stringify(payload));
      navigate("/insurance");
    } catch (error) {
      toast.error("Error saving appointment details. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingInPerson(false);
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

  const [inPersonFees, setInPersonFees] = useState([]);
  useEffect(() => {
    Allclinic();
  }, []);

  const Allclinic = () => {
    axios
      .get(`${Config.BASE_URL}/api/doctor-fees/by-doctor/${id}`)
      .then((res) => {
        setInPersonFees(res.data.fees.inPerson || []);
      })
      .catch((error) => console.error(error));
  };

  const handleClinicClick = (clinicname, fees, address) => {
    localStorage.setItem("clinicname", clinicname);
    localStorage.setItem("fees", fees);
    localStorage.setItem("address", address);
    // localStorage.setItem("DoctorID", id);
    navigate(`/doctorinpersonpage/${id}`);
  };
  // console.log("availability", availability);

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

  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch doctors once
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
  // const handleSearch = () => {
  //   if (!query.trim()) return;

  //   const lower = query.toLowerCase();

  //   const filtered = doctors.filter((doc) => {
  //     const fullName = `${doc.firstname || ""} ${
  //       doc.lastname || ""
  //     }`.toLowerCase();
  //     const specialization =
  //       doc.professional_registration?.specialization?.toLowerCase() || "";
  //     const subCategory =
  //       doc.professional_registration?.sub_category?.toLowerCase() || "";
  //     const availability = Array.isArray(doc.availability)
  //       ? doc.availability
  //           .map((a) =>
  //             `${a.day || ""} ${a.date || ""} ${a.start_time || ""}-${
  //               a.end_time || ""
  //             }`.toLowerCase()
  //           )
  //           .join(" ")
  //       : "";

  //     return (
  //       fullName.includes(lower) ||
  //       specialization.includes(lower) ||
  //       subCategory.includes(lower) ||
  //       availability.includes(lower)
  //     );
  //   });

  //   setSuggestions(filtered.slice(0, 5)); // Or handle differently depending on what you want to do with search
  // };

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
      // console.log("No matching doctor found.");
      // Optionally, show a message or redirect to a search results page
    }
  };

  const expertise = [
    { name: "Back Pain", count: 184 },
    { name: "Lower Back Pain", count: 754 },
    { name: "Neck Pain", count: 377 },
  ];

  const [activeTab, setActiveTab] = useState("About");
  const [tabProgress, setTabProgress] = useState({});
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const tabs = ["About", "Location", "Reviews", "Skills"];

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;

    const containerTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const totalHeight = container.scrollHeight;
    const newTabProgress = {};
    let newActiveTab = "About";

    tabs.forEach((tab) => {
      const section = sectionRefs.current[tab];
      if (!section) return;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionBottom = sectionTop + sectionHeight;

      // Check which section is currently active (most visible)
      if (containerTop + containerHeight / 2 >= sectionTop) {
        newActiveTab = tab;
      }

      // Calculate scroll progress for each section

      if (containerTop + containerHeight >= sectionBottom) {
        // fully viewed
        newTabProgress[tab] = 100;
      } else if (
        containerTop + containerHeight > sectionTop &&
        containerTop < sectionBottom
      ) {
        // partially visible
        const visibleHeight =
          Math.min(containerTop + containerHeight, sectionBottom) - sectionTop;
        const progress = (visibleHeight / sectionHeight) * 100;
        newTabProgress[tab] = Math.min(progress, 100);
      } else {
        // not reached yet
        newTabProgress[tab] = 0;
      }
    });

    setTabProgress(newTabProgress);
    setActiveTab(newActiveTab);
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      handleScroll(); // Initial calculation
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const scrollToSection = (tab) => {
    const section = sectionRefs.current[tab];
    if (section && scrollRef.current) {
      const offsetTop = section.offsetTop - scrollRef.current.offsetTop;
      scrollRef.current.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const calculateOverallProgress = () => {
    if (!scrollRef.current) return 0;
    const container = scrollRef.current;
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    return (scrollTop / scrollHeight) * 100;
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

        <div className="doctor-banner py-4">
          <div className="container">
            {drData ? (
              <div className="row align-items-start">
                {/* Doctor Image */}
                <div className="col-12 col-md-3 text-center mb-3 mb-md-0">
                  <img
                    src={
                      drData.profile_image
                        ? `${Config.BASE_URL}/${drData.profile_image}`
                        : drData.gender === "Female"
                        ? female
                        : male
                    }
                    alt="Doctor"
                    className="doctor-photo rounded shadow-sm"
                  />
                </div>

                {/* Doctor Info */}
                <div className="col-12 col-md-9">
                  <h5
                    style={{
                      fontFamily: "ES Klarheit Kurrent Bold , sans-serif",
                      fontWeight: 600,
                      color: "#001F54",
                    }}
                    className="mb-1"
                  >
                    {drData.firstname} {drData.lastname}
                    <span>
                      <i
                        className="bi bi-patch-check-fill"
                        style={{
                          color: "#001F54",
                          fontSize: "17px",
                          marginLeft: "6px",
                        }}
                      ></i>
                      <span
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 500,
                          color: "#001F54",
                          fontSize: "14px",
                          letterSpacing: "0.3px",
                        }}
                      >
                        {drData.qualifications?.[0]?.degree}
                      </span>
                    </span>
                  </h5>
                  <p className="mb-2 fs-5">
                    {JSON.parse(
                      drData.professional_registration?.specialization || "[]"
                    ).join(", ")}
                  </p>
                  <div className="doctor-info-details mt-3">
                    <p className="mb-1 d-flex align-items-start">
                      <FaMapMarkerAlt className="me-2 text-primary-light" />
                      <span>
                        {drData.personal_information.home_address || "N/A"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="col-12 text-center mt-4">
                <CircularProgress color="primary" />
              </div>
            )}
          </div>

          <style>{`
        
          .doctor-banner {
            background: #f4f7fd;
            color: #051851;
            border-radius: 12px;
          }

          .doctor-photo {
            width: 100%;
            height: 215px;
            object-fit: contain;
            border: 1px solid #5555dfa1;
           
          }
            .text-primary-light {
            color: #11245A; /* match the navy-blue icon color */
            opacity: 0.7;
          }

          .doctor-info-details p {
            font-family: "Poppins", sans-serif;
            font-size: 15px;
            color: #11245A;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
          }

          .doctor-info-details a {
            color: #11245A;
            text-decoration: underline;
            font-weight: 500;
          }

          .doctor-info-details a:hover {
            text-decoration: none;
          }

          @media (max-width: 767px) {
            .doctor-info-details {
              text-align: left;
              padding: 0 10px;
            }
          }


          /* Mobile responsiveness */
          @media (max-width: 767px) {
            .doctor-photo {
              width: 100%;
              height: auto;
              max-height: 300px;
            }

            .doctor-banner {
              text-align: center;
            }
          }
        `}</style>
        </div>

        <div className="container mt-4">
          <div className="row">
            <div className="col-12 col-lg-8 mb-4">
              <ul className="nav nav-tabs mt-3 border-0 position-relative">
                {tabs.map((tab) => (
                  <li className="nav-item2 position-relative" key={tab}>
                    <button
                      className={`nav-link ${
                        activeTab === tab ? "active3" : ""
                      }`}
                      onClick={() => scrollToSection(tab)}
                    >
                      {tab}
                    </button>
                  </li>
                ))}

                {/* Single shared progress bar */}
                <div
                  className="scroll-progress-bar position-absolute bottom-0 start-0"
                  style={{
                    height: "3px",
                    backgroundColor: "#11245A",
                    width: `${calculateOverallProgress()}%`,
                    transition: "width 0.2s linear",
                    borderRadius: "2px",
                  }}
                ></div>
              </ul>

              <div
                ref={scrollRef}
                className="about-section p-4 border rounded-bottom bg-white scrollable-section"
              >
                {/* About Section */}
                <div
                  ref={(el) => (sectionRefs.current["About"] = el)}
                  className="content-section"
                >
                  {drData ? (
                    <div>
                      <h5 className=" mb-3">About</h5>
                      <p>
                        {drData.aboutus && drData.aboutus.trim() !== "" ? (
                          <div
                            dangerouslySetInnerHTML={{ __html: drData.aboutus }}
                          />
                        ) : (
                          "No description available."
                        )}
                      </p>
                    </div>
                  ) : (
                    <div className="col-12 text-center mt-4">
                      <h5 className="text-muted">Loading...</h5>
                    </div>
                  )}

                  {/* <SkillsExpertise skills={drData?.skills} /> */}
                </div>

                {/* Location Section */}
                <div
                  ref={(el) => (sectionRefs.current["Location"] = el)}
                  className="content-section"
                >
                  <DoctorLocation clinics={drData?.clinics} drData={drData} />
                </div>

                {/* Reviews Section */}
                <div
                  ref={(el) => (sectionRefs.current["Reviews"] = el)}
                  className="content-section"
                >
                  <ReviewsSection feedbacks={drData?.feedbacks_received} />
                </div>

                {/* Skills Section */}
                <div
                  ref={(el) => (sectionRefs.current["Skills"] = el)}
                  className="content-section"
                >
                  <SkillsSection doctor={drData} />
                  <div className="mt-4">
                    <div className="d-flex align-items-center mb-2">
                      <FaGraduationCap className="me-2 " color={"#11245A"} />
                      <h6
                        style={{ color: "#11245A" }}
                        className=" text-uppercase mb-0"
                      >
                        Qualifications
                      </h6>
                    </div>

                    <ul className="list-unstyled m-0">
                      {drData?.qualifications.map((q, index) => (
                        <li key={index} className="text-secondary mb-1">
                          {q.degree && (
                            <>
                              {q.degree}
                              {q.institution && `, ${q.institution}`}
                              {q.country && `, ${q.country}`}
                              {q.year_completed && ` (${q.year_completed})`}
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h6
                      style={{ color: "#11245A" }}
                      className=" text-uppercase mb-2"
                    >
                      Languages Spoken
                    </h6>
                    <ul className="list-unstyled m-0">
                      {drData?.personal_information?.languages &&
                        JSON.parse(drData.personal_information.languages).map(
                          (lang, index) => (
                            <li key={index} className="text-secondary">
                              {lang}
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                </div>

                {/* Media Section */}
                {/* <div
                  ref={(el) => (sectionRefs.current["Media"] = el)}
                  className="content-section"
                >
                  <h5 className=" mb-3">Media & Publications</h5>
                  <p>
                    Dr. Abolfotouh has been featured in various medical journals
                    and conferences, sharing his expertise with the global
                    medical community.
                  </p>
                  <div className="row g-3">
                    <div className="col-6">
                      <div
                        className="border rounded p-2"
                        style={{ height: "150px", background: "#e9ecef" }}
                      >
                        <p className="text-center pt-5 small text-muted">
                          [Publication Cover]
                        </p>
                      </div>
                    </div>
                    <div className="col-6">
                      <div
                        className="border rounded p-2"
                        style={{ height: "150px", background: "#e9ecef" }}
                      >
                        <p className="text-center pt-5 small text-muted">
                          [Conference Photo]
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* FAQ Section */}
                {/* <div
                  ref={(el) => (sectionRefs.current["FAQ"] = el)}
                  className="content-section"
                >
                  <h5 className=" mb-3">Frequently Asked Questions</h5>
                  <div className="mb-3">
                    <h6 className="">What conditions do you treat?</h6>
                    <p>
                      I specialize in treating back pain, neck pain, spinal
                      disorders, joint problems, and sports injuries.
                    </p>
                  </div>
                  <div className="mb-3">
                    <h6 className="">Do you accept insurance?</h6>
                    <p>
                      Yes, we accept most major insurance plans. Please contact
                      our office to verify your specific coverage.
                    </p>
                  </div>
                  <div className="mb-3">
                    <h6 className="">
                      How long is a typical appointment?
                    </h6>
                    <p>
                      Initial consultations typically last 45-60 minutes, while
                      follow-up appointments are usually 20-30 minutes.
                    </p>
                  </div>
                </div> */}
              </div>
              <style>{`
              .scrollable-section {
                  max-height: 80vh;
                  overflow-y: auto;
                }

                .scrollable-section::-webkit-scrollbar {
                  width: 6px;
                }

                .scrollable-section::-webkit-scrollbar-thumb {
                  background-color: #0d6efd;
                  border-radius: 10px;
                }

                .content-section {
                  min-height: 400px;
                  padding-bottom: 40px;
                }

                .nav-tabs .nav-link {
                  color: #002D72;
                  font-weight: 500;
                  border: none;
                  background: transparent;
                  position: relative;
                  cursor: pointer;
                }

                .nav-tabs {
                  position: relative;
                  border-bottom: none;
                }

                .scroll-progress-bar {
                  left: 0;
                  right: 0;
                  bottom: 0;
                  height: 3px;
                  background-color: #002d72;
                  width: 0%;
                  transition: width 0.25s ease-out;
                  border-radius: 2px;
                }


                .nav-tabs .nav-link.active3 {
                  color: #002D72;
                  font-weight: 500;
                }

                .nav-item2 {
                  border-bottom: 1px solid #dee2e6;
                }

                .tab-progress {
                  z-index: 10;
                  
                }

                .sidebar {
                  background: #fff;
                  border: 1px solid #e6e6e6;
                }

                .btn-primary {
                  background-color: #0d6efd;
                  border: none;
                }

                .btn-outline-primary {
                  border: 1px solid #0d6efd;
                  color: #0d6efd;
                }

                .btn-outline-primary:hover {
                  background-color: #0d6efd;
                  color: #fff;
                }
              
              `}</style>
            </div>

            <div className="col-12 col-lg-4 mb-4 p-3 tabdatadoctordetails">
              <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active border rounded text-black"
                    id="pills-home-tab"
                    data-toggle="pill"
                    href="#pills-home"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                    onClick={() => handleTabClick("virtual")}
                  >
                    Virtual Consultation
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link ml-3 border rounded text-black"
                    id="pills-profile-tab"
                    data-toggle="pill"
                    href="#pills-profile"
                    role="tab"
                    aria-controls="pills-profile"
                    aria-selected="false"
                    onClick={() => handleTabClick("in-person")}
                  >
                    In-Person
                  </a>
                </li>
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="tabdatacontant">
                    <h6 className=" mt-2">
                      <img src={video} alt="video" /> Virtual Consultation Fees
                    </h6>
                    <h6 className=" mt-2">
                      Fees:{" "}
                      <span className="text-primary">£{consultationFee}</span>
                    </h6>
                    <p className="small text-muted mb-2">
                      Destination: Use phone/laptop for Video/Audio call
                    </p>
                    {availability && availability.length > 0 ? (
                      <>
                        <div className="calendar-wrapper">
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
                                console.log(
                                  "activedate:-",
                                  isActive,
                                  day.isoDate
                                );
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
                            (item) =>
                              dateOnly(item.date) === dateOnly(selectedDate)
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
                          const grouped =
                            groupByTimeOfDay(selectedAvailability);

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
                                <p className="mt-2  text-secondary">{title}</p>

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
                      </>
                    ) : (
                      // If availability is empty or null
                      <div className="text-muted text-center py-3">
                        No slots available.
                      </div>
                    )}

                    <div className="save-btn-container">
                      {userData?.role !== "doctor" && (
                        <button
                          className="save-btn"
                          // onClick={handleSubmit}
                          onClick={() => handleSubmit("virtual")}
                          // disabled={isButtonDisabled}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <svg
                                className="animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                width="20"
                                height="20"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <circle
                                  className="opacity-75"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeDasharray="60"
                                  strokeDashoffset="0"
                                />
                              </svg>
                              Booking...
                            </>
                          ) : (
                            "Book Appointment"
                          )}
                          {/* Book Appointment */}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                >
                  <div className="tabdatacontant">
                    {/* <h6 className="  mt-2">
                      
                      <img
                        src={inperson}
                        alt="In-Person"
                        style={{ width: "23px", height: "19px" }}
                        className="me-2"
                      />
                      In-Person
                    </h6> */}
                    <h6 className=" mt-2 d-flex align-items-center">
                      <img
                        src={inperson}
                        alt="In-Person"
                        style={{ width: "23px", height: "19px" }}
                        className="me-2"
                      />
                      In-Person
                    </h6>

                    <div className="d-flex flex-wrap mt-3">
                      {inPersonFees.map((fee) => (
                        <div className="clinic-card" key={fee.clinic_name}>
                          <h4 className="clinic-name">{fee.clinic_name}</h4>
                          <div className="clinic-fee">£{fee.amount}</div>
                          <div className="clinic-info">
                            <i className="fas fa-map-marker-alt"></i>{" "}
                            {fee.address}
                          </div>
                          {availability && availability.length > 0 ? (
                            <>
                              <div className="calendar-wrapper">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() =>
                                      setWeekOffset((prev) =>
                                        Math.max(prev - 1, 0)
                                      )
                                    }
                                    disabled={weekOffset === 0}
                                  >
                                    ‹
                                  </button>

                                  <div className="d-flex justify-content-center flex-grow-1 week-calendar">
                                    {getFutureDates().map((day, index) => {
                                      const isActive =
                                        day.isoDate === selectedDate;
                                      return (
                                        <div
                                          key={index}
                                          className={`calendar-day text-center mx-2 px-2 py-1 rounded ${
                                            isActive
                                              ? "active-day"
                                              : "clickable"
                                          }`}
                                          onClick={() =>
                                            setSelectedDate(day.isoDate)
                                          }
                                        >
                                          <div>{day.dayName}</div>
                                          <div className="small">
                                            {day.dayNumber}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() =>
                                      setWeekOffset((prev) => prev + 1)
                                    }
                                  >
                                    ›
                                  </button>
                                </div>
                              </div>
                              {(() => {
                                // 1) Filter slots for the chosen calendar day
                                const selectedAvailability =
                                  availability.filter(
                                    (item) =>
                                      dateOnly(item.date) ===
                                      dateOnly(selectedDate)
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
                                const grouped =
                                  groupByTimeOfDay(selectedAvailability);

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
                                      <p className="mt-2  text-secondary">
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
                                            onClick={() =>
                                              handleSlotClick(slot)
                                            }
                                          >
                                            {slot.label}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  ) : null
                                );
                              })()}
                            </>
                          ) : (
                            // If availability is empty or null
                            <div className="text-muted text-center py-3">
                              No slots available.
                            </div>
                          )}
                          {/* <div className="clinic-info">
                          <i className="fas fa-clock"></i> 05:00 pm – 07:00 pm
                        </div> */}{" "}
                          {userData?.role !== "doctor" && (
                            <button
                              className="book-btn"
                              // onClick={() =>
                              //   handleClinicClick(
                              //     fee.clinic_name,
                              //     fee.amount,
                              //     fee.address
                              //   )
                              // }
                              // onClick={handleSubmit}
                              onClick={() => handleSubmit("in-person", fee)}
                              disabled={loadinginperson}
                            >
                              {loadinginperson ? (
                                <>
                                  <svg
                                    className="animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    height="20"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    />
                                    <circle
                                      className="opacity-75"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      strokeLinecap="round"
                                      strokeDasharray="60"
                                      strokeDashoffset="0"
                                    />
                                  </svg>
                                  Booking...
                                </>
                              ) : (
                                "Book Appointment"
                              )}
                              {/* Book Appointment */}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
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
  border-radius: 10px;
  border: 1px solid #CCCC;
        }
        .bgfeedback{
       background: #FFFFFF;
       padding: 15px;
  border-radius: 20px;
        } 
   .bgabout{
       background: #FFFFFF;
       padding: 15px;
  border-radius: 20px;
        }

.clinic-card {
  // background: #F7F9FC;
  border-radius: 12px;
  padding: 1.25rem;
  margin: 0.75rem;
  width: 100%;
  // box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: Arial, sans-serif;
  transition: transform 0.2s ease;
}

.clinic-card:hover {
  transform: translateY(-4px);
}

.clinic-name {
  font-weight: 400;
  
  font-size: 1.3rem;
  color: #464646;
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
  font-weight: 400;
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
  background-color: #ffffff;
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
  // border-radius: 20px;
  // margin-top: 20px;
  text-align: center;
}

.headingtext {
  font-size: 36px;
  font-weight: 400;
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

export default DoctorDetailspage;

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
          <p className="mb-1 ">{group.label}</p>
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

const DoctorLocation = ({ clinics, drData }) => {
  return (
    <div className="location-wrapper my-5">
      {/* Header */}
      <h4 className="fw-semibold text-white mb-3">Location</h4>

      {/* Main content box */}
      <div className="bg-white rounded shadow-sm overflow-hidden">
        <p className="fw-semibold text-primary ps-4 pt-3 mb-3 border-bottom pb-2">
          All locations for {drData?.firstname} {drData?.lastname}
        </p>

        {clinics?.map((clinic, index) => (
          <div
            key={index}
            className="d-flex flex-column flex-md-row align-items-start border-bottom p-3"
          >
            {/* Left side */}
            <div className="d-flex align-items-start flex-grow-1 border-md-end pe-md-4 mb-3 mb-md-0">
              <img
                // src={`https://maps.googleapis.com/maps/api/staticmap?center=${clinic.latitude},${clinic.longitude}&zoom=13&size=120x120&markers=color:blue%7C${clinic.latitude},${clinic.longitude}`}
                src={`${Config.BASE_URL}/${clinic?.clinic_logo}`}
                alt="Map"
                className="rounded me-3 border"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
              <div>
                <h6 className="fw-semibold text-dark mb-1">{clinic.name}</h6>
                <div className="text-warning small mb-2">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <FaStar key={i} />
                    ))}{" "}
                  <span className="text-dark small">(0)</span>
                </div>
                <p className="text-muted small mb-0">{clinic.address}</p>
              </div>
            </div>

            {/* Right side */}
            <div className="flex-grow-1 border-start ps-md-4 w-100">
              {[
                "monday",
                "tuesday",
                "wednesday",
                "thursday",
                "friday",
                "saturday",
                "sunday",
              ].map((day) => {
                const hours = clinic[`${day}_hours`];
                return (
                  <div
                    key={day}
                    className="d-flex justify-content-between align-items-center py-1 border-0"
                  >
                    <span className="text-capitalize">{day}</span>
                    {hours === "Enquire" ? (
                      <a
                        href={clinic.enquire_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary text-decoration-none"
                      >
                        Enquire
                      </a>
                    ) : (
                      <span className="text-dark">{hours}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .location-wrapper {
          background-color: #324b97;
          border-radius: 15px;
          padding: 40px 20px;
        }
 @media (max-width: 768px) {
         .location-wrapper .border-start {
            border-left: none !important;
            border-top: 1px solid #D5DEF9 !important;
            margin-top: 10px;
            padding-top: 10px;
          }
      }
        .location-wrapper h4 {
          font-size: 1.8rem;
        }

        .location-wrapper .bg-white {
          border-radius: 15px;
        }

        .location-wrapper a {
          color: #324b97 !important;
        }

        .location-wrapper a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .location-wrapper {
            padding: 25px 15px;
          }
          .location-wrapper h4 {
            font-size: 1.4rem;
          }
        }
      `}</style>
    </div>
  );
};

const ReviewsSection = ({ feedbacks }) => {
  const ratings = feedbacks?.map((f) => f.rating);
  const total = ratings?.length || 1;
  const avgRating = (ratings?.reduce((sum, r) => sum + r, 0) / total).toFixed(
    1
  );

  const conditions = [
    { name: "Lower Back Pain", count: 754 },
    { name: "Neck Pain", count: 377 },
    { name: "Back Pain", count: 184 },
    { name: "Upper Back Pain", count: 71 },
    { name: "Degenerative Disc Disease", count: 26 },
  ];

  return (
    <div className="review-section-container p-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-semibold mb-0">Reviews</h5>
        <span className="text-muted small">
          ⭐ {avgRating} stars based on {feedbacks?.length}{" "}
          {feedbacks?.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      {/* Tabs */}
      <div className="mb-3 d-flex flex-wrap align-items-center">
        <button className="btn btn-primary btn-pill px-3 me-2 mb-2">
          All reviews ({feedbacks?.length})
        </button>
        {/* <button className="btn btn-outline-primary btn-pill me-2 mb-2">
          Replies
        </button>
        <button className="btn btn-outline-primary btn-pill me-2 mb-2">
          Last 7 days
        </button>
        <button className="btn btn-outline-primary btn-pill me-2 mb-2">
          Last 30 days
        </button>
        <button className="btn btn-outline-primary btn-pill mb-2">
          Last 6 months
        </button> */}
      </div>

      {/* Filter by condition */}
      {/* <div className="mb-4">
        <div className="text-muted small mb-2 fw-semibold">
          Filter by condition:
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          {conditions?.map((c, idx) => (
            <span key={idx} className="condition-pill">
              {c.name} ({c.count})
            </span>
          ))}
          <span className="condition-pill condition-more">+ 17 more</span>
        </div>
      </div> */}

      {/* Rating bars (only existing ratings) */}
      <div className="rating-bars mb-3">
        {[5, 4, 3, 2, 1]
          .filter((stars) => ratings?.includes(stars))
          .map((stars) => {
            const count = ratings?.filter((r) => r === stars).length;
            const percent = ((stars / 5) * 100).toFixed(0);

            // console.log("parcent:-", percent);

            return (
              <div
                key={stars}
                className="d-flex align-items-center mb-2 rating-row"
              >
                <input type="checkbox" className="form-check-input me-2" />
                <div className="me-2 star-icons">
                  {"★".repeat(stars)}
                  {"☆".repeat(5 - stars)}
                </div>
                <div className="flex-grow-1 progress bg-gray rating-progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="ms-2 text-muted small">{percent}%</div>
              </div>
            );
          })}
        <div className="text-muted small mt-2">
          *Star rating based on patient reviews
        </div>
      </div>

      {/* Reviews list */}
      {feedbacks?.map((f, idx) => (
        <div key={idx} className="border rounded p-3 mb-3 bg-white">
          <div className="d-flex align-items-center mb-2">
            <div className="me-2 star-icons">
              {"★".repeat(f.rating)}
              {"☆".repeat(5 - f.rating)}
            </div>
            <span className="ms-2 text-muted small">
              {new Date(f.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="mb-1">{f.message}</p>
          <small className="text-muted">- {f.name}</small>
        </div>
      ))}

      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap");

          * {
            font-family: "Poppins", sans-serif;
          }

          .review-section-container {
            background-color: #f8faff;
            border: 1px solid #e0e7ff;
            border-radius: 12px;
            box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.05);
            color: #333;
          }

          .bg-gray {
            background-color: #e0e0e0 !important;
          }

          .btn-pill {
            border-radius: 30px;
            font-size: 14px;
            padding: 6px 16px;
            font-weight: 500;
          }

          .btn-outline-primary {
            color: #0047ff;
            border-color: #d0dcff;
            background-color: #fff;
          }

          .btn-outline-primary:hover {
            background-color: #eaf0ff;
            color: #0047ff;
            border-color: #d0dcff;
          }

          .btn-primary {
            background-color: #0047ff;
            border-color: #0047ff;
          }

          .condition-pill {
            background-color: #edf2ff;
            color: #0047ff;
            border-radius: 20px;
            padding: 5px 12px;
            font-size: 13px;
            font-weight: 500;
          }

          .condition-more {
            background-color: #f0f3ff;
            color: #0047ff;
          }

          .star-icons {
            color: #00d2cc;
            font-size: 18px;
            letter-spacing: 1px;
          }

          .rating-progress {
            height: 8px;
            border-radius: 4px;
          }

          .progress-bar {
            background-color: #00d2cc !important;
            border-radius: 4px;
          }

          .rating-row input[type="checkbox"] {
            transform: scale(1.1);
            cursor: pointer;
          }

          @media (max-width: 576px) {
            .btn-pill {
              font-size: 13px;
              padding: 5px 10px;
            }

            .star-icons {
              font-size: 16px;
            }
          }
        `}
      </style>
    </div>
  );
};

const SkillsSection = ({ doctor }) => {
  const professional = doctor?.professional_registration || {};
  const personal = doctor?.personal_information || {};

  // Parse arrays safely
  const specializations = professional?.specialization
    ? JSON.parse(professional.specialization)
    : [];
  const subCategories = professional?.sub_category
    ? JSON.parse(professional.sub_category)
    : [];

  return (
    <div className="content-section2 p-3">
      <h5 className=" mb-3">Skills & Expertise</h5>
      <p>
        {personal?.full_name || "This doctor"} specializes in{" "}
        {specializations.length > 0 ? (
          <>
            {specializations.join(", ")}{" "}
            {subCategories.length > 0 && (
              <>and is also experienced in {subCategories.join(", ")}.</>
            )}
          </>
        ) : (
          "various areas of medicine."
        )}
      </p>

      <ul>
        {subCategories.length > 0 ? (
          subCategories.map((skill, index) => <li key={index}>{skill}</li>)
        ) : (
          <>
            <li>Patient Care Excellence</li>
            <li>Medical Diagnosis and Treatment</li>
            <li>Health Education and Awareness</li>
          </>
        )}
      </ul>

      <p>
        With {professional?.years_of_experience || 0} years of experience,{" "}
        {personal?.full_name?.split(" ")[0] || "the doctor"} ensures patients
        receive high-quality care using the latest medical techniques.
      </p>

      <div className="text-muted small mt-2">
        Nationality: {personal?.nationality || "N/A"} <br />
        Based at: {personal?.home_address || "Not specified"}
      </div>

      <style>
        {`

          .content-section2 {
            background-color: #f8faff;
            border: 1px solid #e0e7ff;
            border-radius: 12px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.05);
            color: #333;
            font-family: 'Poppins', sans-serif;
          }

          .content-section2 h5 {
            color: #0047ff;
          }

          .content-section2 ul {
            list-style: disc;
            margin-left: 20px;
          }

          .content-section2 li {
            margin-bottom: 5px;
            color: #444;
          }

          .content-section2 p {
            color: #555;
            line-height: 1.6;
          }
        `}
      </style>
    </div>
  );
};

// const SkillsExpertise = ({ skills }) => {
//   const [activeTab, setActiveTab] = useState("All");

//   return (
//     <div className="mt-5">
//       <div className="d-flex align-items-center ">
//         <FaShieldAlt className="me-2 " color={"#11245A"} />
//         <h5 className="mb-0 " style={{ color: "#11245A" }}>
//           Areas of Expertise
//         </h5>
//       </div>
//       <div className="skills-container card mt-2 p-4">
//         {/* Skills List */}
//         <div className="skills-list">
//           {skills?.map((skill, index) => (
//             <>
//               <div key={skill.id}>
//                 <div className="skill-item mb-4">
//                   <div className="d-flex align-items-center gap-2 mb-1">
//                     <FaCheckCircle color={"#11245A"} />
//                     <strong style={{ color: "#11245A" }}>
//                       {skill.skill_name}
//
//                   </div>
//                   <div className="p-2">
//                     <h6 className="small text-muted">
//                       Years of Experience: {skill.years_of_experience}
//                     </h6>
//                     <h6 className="small text-muted">
//                       Proficiency Level: {skill.proficiency_level}
//                     </h6>
//                     <h6 className="small text-muted">
//                       Description: {skill.description}
//                     </h6>
//                   </div>
//                   <div className="skill-bar">
//                     <div
//                       className="bar reviews-bar"
//                       style={{
//                         width: `${
//                           skill.proficiency_level === "Beginner"
//                             ? 25
//                             : skill.proficiency_level === "Intermediate"
//                             ? 50
//                             : skill.proficiency_level === "Advanced"
//                             ? 75
//                             : skill.proficiency_level === "Expert"
//                             ? 100
//                             : 0
//                         }%`,
//                       }}
//                     >
//                       <span className="bar-label">
//                         {skill.proficiency_level}
//                       </span>
//                     </div>
//                     <div className="bar endorsements-bar">
//                       <span className="bar-label">
//                         {skill.years_of_experience}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ))}
//         </div>

//         <style>{`
//       .skills-container {
//   border-radius: 15px;
//   background-color: #fff;
// }

// .tabs-wrapper {
//   display: flex;
//   justify-content: start;
// }

// .tabs {
//   background-color: #f1f3f6;
//   border-radius: 25px;
//   display: inline-flex;
//   overflow: hidden;
// }

// .tab {
//   border: none;
//   background: transparent;
//   padding: 8px 20px;
//   border-radius: 25px;
//   font-weight: 500;
//   color: #555;
//   transition: 0.3s;
// }

// .tab.active {
//   background-color: #e0f9f9;
//   color: #00bcd4;
// }

// .tab .count {
//   color: #777;
//   margin-left: 4px;
// }

// .skill-item {
//   cursor: pointer;
// }

// .skill-bar {
//   display: flex;
//   align-items: center;
//   width: 100%;
//   height: 18px;
//   border-radius: 20px;
//   overflow: hidden;
//   background-color: transparent;
// }

// /* Cyan left section (reviews) */
// .reviews-bar {
//   background-color: #57f0f0;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: #004080;
//   font-weight: 400;
//   font-size: 12px;
//   border-top-left-radius: 20px;
//   border-bottom-left-radius: 20px;
//   transition: width 0.4s ease;
// }

// /* Dark blue right section (endorsements) */
// .endorsements-bar {
//   background-color: #0b2e7e;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   color: #fff;
//   font-weight: 400;
//   font-size: 12px;
//   min-width: 28px;
//   border-top-right-radius: 20px;
//   border-bottom-right-radius: 20px;
// }

// .bar-label {
//   z-index: 2;
// }

//       `}</style>
//       </div>
//     </div>
//   );
// };
