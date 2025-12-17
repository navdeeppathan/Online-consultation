import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import innerpage2 from "../assets/images/Inner page header.png";
import innerpage from "../assets/images/innerpagebanner.png";

import sectionbg from "../assets/images/Mask group (1).png";
import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import male from "../assets/images/male.png";
import female from "../assets/images/Female2.png";
import filter from "../assets/images/filterrestart.png";
import doctor from "../assets/images/doctor.png";
import doctor1 from "../assets/images/doctor1.png";
import video from "../assets/images/zoom.png";
import Footer from "../components/Footer";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../config";
import CircularProgress from "@mui/material/CircularProgress";

const AllDoctorcatsubNew = () => {
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("All");

  // const {name} =useParams()
  const [loading, setLoading] = useState(true);

  const queryData = new URLSearchParams(useLocation().search);
  const name = queryData.get("name");
  console.log("namename", name);

  const [alldoctor, setAlldoctor] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCategory, setCategory] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    specialization: "",
    location: "",
    experience: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 4;
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  useEffect(() => {
    fetchDrData();
    fetchDrDataCategory(name);
  }, [name]);

  const fetchDrData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Config.BASE_URL}/api/alldoctor`);
      const AllData = response.data.doctors;
      setDoctors(AllData);

      let videotypedoctor = [];

      // ✅ If name is "All", keep all doctors

      // const videotypedoctor = AllData.filter((doctor) => {
      if (name?.toLowerCase().trim() === "all") {
        videotypedoctor = AllData;
      } else {
        videotypedoctor = AllData.filter((doctor) => {
          if (!doctor.professional_registration) return false;

          let specialization = doctor.professional_registration.specialization;
          let subCategory = doctor.professional_registration.sub_category;

          // Try parsing JSON fields
          try {
            specialization = JSON.parse(specialization);
          } catch (e) {}
          try {
            subCategory = JSON.parse(subCategory);
          } catch (e) {}

          // ✅ Always normalize into arrays
          const specializationArray = Array.isArray(specialization)
            ? specialization
            : specialization
            ? [specialization]
            : [];

          const subCategoryArray = Array.isArray(subCategory)
            ? subCategory
            : subCategory
            ? [subCategory]
            : [];

          // normalize search & filters
          const searchName = name?.toLowerCase().trim();
          const filterSpec =
            selectedFilters?.specialization?.toLowerCase().trim() || "";
          const filterLocation =
            selectedFilters?.location?.toLowerCase().trim() || "";
          const filterExp =
            selectedFilters?.experience?.toString().trim() || "";

          // ✅ specialization check
          const matchesSpecialization =
            !filterSpec ||
            specializationArray.some((spec) =>
              spec.toLowerCase().includes(filterSpec)
            ) ||
            subCategoryArray.some((sub) =>
              sub.toLowerCase().includes(filterSpec)
            );

          // ✅ location check
          const matchesLocation =
            !filterLocation ||
            doctor.personal_information.home_address
              ?.toLowerCase()
              .includes(filterLocation) ||
            doctor.nationality?.toLowerCase().includes(filterLocation);

          // ✅ experience check
          const matchesExperience =
            !filterExp ||
            doctor.professional_registration?.years_of_experience?.toString() ===
              filterExp;

          // ✅ Apply AND condition: all filters must match
          if (filterSpec || filterLocation || filterExp) {
            return (
              matchesSpecialization && matchesLocation && matchesExperience
            );
          }

          // ✅ fallback: search by name if no filters
          if (!filterSpec && searchName) {
            return (
              specializationArray.some((spec) =>
                spec.toLowerCase().includes(searchName)
              ) ||
              subCategoryArray.some((sub) =>
                sub.toLowerCase().includes(searchName)
              )
            );
          }

          return false;
        });
      }
      console.log("videotypedoctor", videotypedoctor);

      setAlldoctor(videotypedoctor);
      setFilteredDoctors(videotypedoctor);
    } catch (error) {
      console.error(
        "Error fetching doctor data:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    const decodedValue = decodeURIComponent(value);

    const newFilters = {
      ...selectedFilters,
      [name]: decodedValue,
    };

    setSelectedFilters(newFilters);

    console.log("newfilter:-", newFilters, alldoctor);

    const filtered = alldoctor.filter((doctor) => {
      // Parse specialization safely
      let doctorSpecializations = [];
      try {
        doctorSpecializations = doctor.professional_registration?.specialization
          ? JSON.parse(doctor.professional_registration.specialization)
          : [];
      } catch (err) {
        doctorSpecializations = [];
      }

      const matchesSpecialization =
        newFilters.specialization === "" ||
        doctorSpecializations.includes(newFilters.specialization);

      const matchesLocation =
        newFilters.location === "" ||
        doctor.personal_information.home_address
          ?.toLowerCase()
          .includes(newFilters.location.toLowerCase());

      const matchesExperience =
        newFilters.experience === "" ||
        doctor.professional_registration?.years_of_experience?.toString() ===
          newFilters.experience;

      return matchesSpecialization && matchesLocation && matchesExperience;
    });

    setFilteredDoctors(filtered);
  };

  useEffect(() => {
    // ✅ Run fetch only when at least one filter has value
    if (
      selectedFilters?.specialization ||
      selectedFilters?.location ||
      selectedFilters?.experience
    ) {
      fetchDrData();
    }
  }, [selectedFilters]);

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

  const fetchDrDataCategory = async (categoryName) => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/categories/${encodeURIComponent(
          categoryName
        )}/subcategories`
      );

      // Get subcategories directly
      const subcategories = response.data?.data || [];
      setCategory(subcategories);

      console.log("Fetched subcategories:", subcategories);
    } catch (error) {
      console.error(
        "Error fetching category subcategories:",
        error.response?.data || error.message
      );
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pageNumbers;
  };
  useEffect(() => {
    const filtered = alldoctor.filter((doctor) => {
      const fullName = `${doctor.firstname} ${doctor.lastname}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredDoctors(filtered);
  }, [searchTerm, alldoctor]);

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

  useEffect(() => {
    let filtered = alldoctor;

    // ✅ Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter((doctor) => {
        let specialization = doctor.professional_registration?.specialization;
        let subCategory = doctor.professional_registration?.sub_category;

        try {
          specialization = JSON.parse(specialization);
        } catch (e) {}
        try {
          subCategory = JSON.parse(subCategory);
        } catch (e) {}

        const specializationArray = Array.isArray(specialization)
          ? specialization
          : specialization
          ? [specialization]
          : [];

        const subCategoryArray = Array.isArray(subCategory)
          ? subCategory
          : subCategory
          ? [subCategory]
          : [];

        return (
          specializationArray.includes(selectedCategory) ||
          subCategoryArray.includes(selectedCategory)
        );
      });
    }

    // ✅ Keep existing search filter
    if (searchTerm) {
      filtered = filtered.filter((doctor) =>
        `${doctor.firstname} ${doctor.lastname}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDoctors(filtered);
  }, [selectedCategory, searchTerm, alldoctor]);

  return (
    <>
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
        <div className="">
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
                  placeholder="Search by Name ,Speciality"
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

        {/* <div className="container mt-4 mb-2">
          <div className="mainclass card p-4">
            <div className="row">
              <dic className="col-6 col-md-10 mb-4">
                <h4>Filter</h4>
              </dic>
              <dic className="col-6 col-md-2 mb-4">
                <h6>
                  <img src={filter} />
                  Reset filter
                </h6>
              </dic>
            </div>
            <div className="row">
              <div className="col-md-12">
                <div className="row">
                  <div className="form-group col-md-3">
                    <label
                      htmlFor="specialization"
                      className="font-weight-bold"
                    >
                      Specialty
                    </label>
                    <select
                      className="form-control custom-dropdown"
                      name="specialization"
                      value={selectedFilters.specialization}
                      onChange={handleFilterChange}
                    >
                      <option value="">Select Specialization</option>
                      {allCategory.map((category, index) => (
                        <option key={index} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  

                  <div className="form-group col-md-3">
                    <label
                      htmlFor="specialization"
                      className="font-weight-bold"
                    >
                      Location
                    </label>
                    <select
                      className="form-control custom-dropdown"
                      name="location"
                      value={selectedFilters.location}
                      onChange={handleFilterChange}
                    >
                      <option value="">Select Location</option>
                      <option value="England">England</option>
                      <option value="Northern Ireland">Northern Ireland</option>
                      <option value="Scotland">Scotland</option>
                      <option value="Wales">Wales</option>
                    </select>
                  </div>

                  <div className="form-group col-md-3">
                    <label
                      htmlFor="specialization"
                      className="font-weight-bold"
                    >
                      Experience
                    </label>
                    <select
                      className="form-control custom-dropdown"
                      name="experience"
                      value={selectedFilters.experience}
                      onChange={handleFilterChange}
                    >
                      <option value="">Select Experience</option>
                      {[
                        ...new Set(
                          alldoctor.map(
                            (doc) =>
                              doc.professional_registration?.years_of_experience
                          )
                        ),
                      ].map((exp, i) => (
                        <option key={i} value={exp}>
                          {exp} year
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group col-md-3">
                    <label
                      htmlFor="specialization"
                      className="font-weight-bold"
                    >
                      Ratings
                    </label>
                    <select
                      className="form-control custom-dropdown"
                      id="specialization"
                    >
                      <option value="">Select Ratings</option>
                      <option value="cardiology">80%</option>
                      <option value="dermatology">70%</option>
                      <option value="dermatology">60%</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="container mt-4 ">
          <div className="">
            {/* <div className="row">
              <div className="col-6 col-md-10 mb-4">
                <h4>Filter</h4>
              </div>
              <div className="col-6 col-md-2 mb-4">
                <h6
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedCategory("All")}
                >
                  <img src={filter} alt="reset" /> Reset filter
                </h6>
              </div>
            </div> */}
            <div className="col-6 col-md-10 mb-4">
              <h1
                style={{
                  fontFamily: "Manrope, sans-serif",
                  fontWeight: 600,
                  fontSize: "40px",
                  lineHeight: "42px",
                  letterSpacing: "0px",
                  color: "#464646",
                  margin: 0,
                }}
              >
                {name}
              </h1>
            </div>

            {/* 🔹 Category Pills */}
            {/* <ul
              className="d-flex flex-wrap gap-2 mb-3 mt-4"
              style={{ listStyle: "none", padding: 0, margin: 0 }}
            >
              <li>
                <button
                  onClick={() => setSelectedCategory("All")}
                  style={{
                    border:
                      selectedCategory === "All" ? "none" : "1px solid #D9D9D9",
                    borderRadius: "20px",
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: 400,
                    backgroundColor: "#FFFFFF",
                    color: "#464646",
                    boxShadow:
                      selectedCategory === "All"
                        ? "0px 2px 6px rgba(0,0,0,0.15)"
                        : "none", // ✅ shadow only when active
                    cursor: "pointer",
                  }}
                >
                  All
                </button>
              </li>

              {allCategory.slice(0, 12).map((category, index) => (
                <li key={index}>
                  <button
                    onClick={() => setSelectedCategory(category.name)}
                    style={{
                      border:
                        selectedCategory === category.name
                          ? "none"
                          : "1px solid #D9D9D9",
                      borderRadius: "20px",
                      padding: "8px 20px",

                      fontSize: "14px",
                      fontWeight: 400,
                      backgroundColor: "#FFFFFF",
                      color: "#464646",
                      boxShadow:
                        selectedCategory === category.name
                          ? "0px 2px 6px rgba(0,0,0,0.15)"
                          : "none", // ✅ shadow only when active
                      cursor: "pointer",
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul> */}
          </div>
        </div>

        <div className="container mt-4">
          <div className="row">
            {loading ? (
              <div className="col-12 text-center my-5">
                <CircularProgress color="primary" />
                <p className="mt-3 text-muted">Loading doctors...</p>
              </div>
            ) : currentDoctors?.length > 0 ? (
              currentDoctors.map((doctor, index) => (
                <div className="col-12 col-md-6 mb-4" key={index}>
                  <Link
                    to={`/doctordetails/${doctor.id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="doctor-card p-2 shadow-sm">
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            doctor.profile_image
                              ? `${Config.BASE_URL}/${doctor.profile_image}`
                              : doctor.gender === "Female"
                              ? female
                              : male
                          }
                          alt="Doctor"
                          className="doctor-img me-3"
                        />
                        <div>
                          <h5 className="mb-1">
                            {doctor.firstname} {doctor.lastname}
                          </h5>
                          <p className="text-muted mb-0 small">
                            {doctor.qualifications?.[0]?.degree}
                            {/* ,{" "}
                            {doctor.qualifications?.[0]?.institution} */}
                            <br />
                            <div
                              style={{ fontWeight: "bold", marginTop: "6px" }}
                            >
                              {JSON.parse(
                                doctor.professional_registration
                                  ?.specialization || "[]"
                              ).join(", ")}
                            </div>
                          </p>
                        </div>
                      </div>

                      <div className="startdatatext">
                        <div
                          className="row text-center mt-2 p-2 doctor-stats"
                          style={{ marginLeft: "0px", marginRight: "0px" }}
                        >
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
                              {doctor.overall_feedback_percentage}
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
                              {doctor.unique_user_id_count}
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
                              {doctor.professional_registration
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

                      <div className="row mt-4">
                        <div className="col-12 col-md-12 mb-4">
                          <div className="info-box borderrounded p-2 h-100">
                            <div className="small text-muted">
                              <img src={video} /> Video Consultation fees
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="badge bg-light text-dark">
                                Online
                              </span>
                              <span className="fw-bold text-primary">
                                £20.00
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* <div className="col-6 col-md-6 mb-4">
                          <div className="info-box border borderrounded2 p-2 h-100">
                            <div className="small text-muted">
                              Moorfields Eye Hospital
                            </div>
                            <div className="d-flex justify-content-between align-items-center mt-2">
                              <span className="badge bg-light text-dark">
                                Available
                              </span>
                              <span className="fw-bold text-primary">
                                £25.00
                              </span>
                            </div>
                          </div>
                        </div> */}
                      </div>

                      <div className="row">
                        <div className="col-md-4"></div>
                        <div className="col-md-8">
                          <div className="d-flex justify-content-end mt-2 mb-2 gap-2">
                            <button className="detailsbutton1">
                              Book Appointment
                            </button>
                            <button className="detailsbutton2">
                              Virtual Consultation
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-12 text-center mt-4">
                <h5 className="text-muted">
                  No doctors found matching your filters.
                </h5>
              </div>
            )}
            <div className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>
                {generatePageNumbers().map((num, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === num ? "active" : ""
                    }`}
                  >
                    {num === "..." ? (
                      <span className="page-link">...</span>
                    ) : (
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(num)}
                      >
                        {num}
                      </button>
                    )}
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <style>
        {`
  
.detailsbutton1{
  background-color: #70EFCD;
border :1px solid #70EFCD;
color:#000;
padding:7px 20px;

  border-radius: 30px;
  font-size:15px;

}

.detailsbutton2{
  background-color: #4C6BE9;
border :1px solid #4C6BE9;
color:#fff;
padding:7px 20px;

  border-radius: 30px;
  font-size:15px;

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
        .doctor-img{
        width:165px;
        height:200px;
  border-radius: 10px;

        }

.borderrounded{
border :1px solid #22C55E;
  border-radius: 16px;

}
  .borderrounded2{
border :1px;
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
  


.search-box {
   display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
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
 .suggestions-list {
    width: 85%;
    max-width: none;
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
    font-size: 24px;
    line-height: 32px;
    text-align: center;
  }
     .doctor-img{
        width:100px;
        height:120px;

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
    </>
  );
};

export default AllDoctorcatsubNew;
