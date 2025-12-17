import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import icon4 from "../assets/images/Group 982.png";
import innerpage from "../assets/images/Inner page header.png";
import userImage from "../assets/images/21104.png";
import male from "../assets/images/male.png";
import female from "../assets/images/Female2.png";

import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import tab from "../assets/images/tab.png";
import tab1 from "../assets/images/tab1.png";
import tab2 from "../assets/images/tab2.png";
import tab3 from "../assets/images/tab3.png";
import tab4 from "../assets/images/tab4.png";
import tab5 from "../assets/images/tab5.png";
import tab6 from "../assets/images/tab6.png";
import image1 from "../assets/images/General-Practitioner-Transparent-Free-PNG.png";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../config";

const CategoryDoctor = () => {
  const navigate = useNavigate();
  const [allCategory, setCategory] = useState([]);
  const [alldoctor, setAlldoctor] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    fetchDrDataCategory();
    fetchDrData();
  }, []);

  const fetchDrData = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/alldoctor`);
      console.log("doctor Data:", response.data.doctors);
      setAlldoctor(response.data.doctors);
    } catch (error) {
      console.error(
        "Error fetching doctor data:",
        error.response?.data || error.message
      );
    }
  };

  const fetchDrDataCategory = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/specialties`);
      console.log("categories", response.data.data[0].name); // Access `.data.data`

      setCategory(response.data.data); // Correct nested access
      if (response.data.data?.length > 0) {
        setSelectedCategory(response.data.data[0].name); // Default selected
      }
    } catch (error) {
      console.error(
        "Error fetching category data:",
        error.response?.data || error.message
      );
    }
  };

  const filteredDoctors = alldoctor
    .filter((doctor) => {
      let specialization = doctor.professional_registration?.specialization;

      // Try to parse JSON array
      try {
        specialization = JSON.parse(specialization);
      } catch (e) {
        // leave as string if not JSON
      }

      if (Array.isArray(specialization)) {
        return specialization.some(
          (spec) => spec.toLowerCase() === selectedCategory.toLowerCase()
        );
      }

      return specialization?.toLowerCase() === selectedCategory.toLowerCase();
    })
    .slice(0, 4);

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
              {/* <img scr={sectionbg} /> */}
            </p>

            {/* <div className="search-box">
              <div className="search-input-group">
                <div className="location">
                  <img src={locationicon} alt="location" />
                  <span>London</span>
                </div>
                <input
                  className="search-input"
                  placeholder="Search by Specialties, Location, and Availability"
                />
                <button className="search-button">
                  <img src={searchicon} alt="search" className="searchicon" />
                </button>
              </div>
            </div> */}

            {/* <form> */}

            <div className="search-box">
              <div className="search-input-group">
                {/* <div className="location">
                          <img src={locationicon} alt="Location" />
                          <span>London</span>
                        </div> */}

                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by Dr. Name ,Specialization & Sub-Category"
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

            {/* </form> */}
          </div>
        </div>

        <div className="container mt-4">
          <h1 className="headingtext">
            Expert Assistance
            <Link to="/">
              <img src={icon4} className="ml-5" />
            </Link>
          </h1>

          {/* <>
            <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
              {allCategory.map((category, index) => (
                <li className="nav-item" key={index}>
                  <button
                    className={`nav-link ${
                      selectedCategory === category.name ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                    style={{ cursor: "pointer" }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            <div className="row">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor, index) => (
                  <div className="col-12 col-md-3 mb-4" key={index}>
                    <Link
                      to={`/doctordetails/${doctor.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="doctor-card-overlay position-relative">
                        <img
                          src={`${Config.BASE_URL}/${doctor.profile_image}`}
                          alt="doctor"
                          className="doc-bg-img"
                        />
                        <div className="white-box">
                          <h5 className="mb-1">
                            {doctor.firstname} {doctor.lastname}
                          </h5>

                          <p className="mb-2 text-muted">
                            {doctor.professional_registration?.specialization}
                          </p>
                          <div className="d-flex justify-content-between text-center">
                            <div>
                              <strong>92%</strong>
                              <p className="mb-0 small text-muted">Satisfied</p>
                            </div>
                            <div>
                              <strong>104</strong>
                              <p className="mb-0 small text-muted">Patient</p>
                            </div>
                            <div>
                              <strong>
                                {doctor.professional_registration
                                  ?.years_of_experience || 0}{" "}
                                Years
                              </strong>
                              <p className="mb-0 small text-muted">
                                Experience
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-4">
                  <h5 className="text-muted">No Doctor Available</h5>
                </div>
              )}
            </div>
          </> */}
          <>
            {/* Category Filter Pills */}
            <ul className="nav nav-pills mb-4" id="pills-tab" role="tablist">
              {allCategory.map((category) => (
                <li className="nav-item" key={category.id}>
                  <button
                    className={`nav-link ${
                      selectedCategory === category.name ? "active" : ""
                    }`}
                    onClick={() => setSelectedCategory(category.name)}
                    style={{
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "#333",
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>

            {/* Doctor Cards Grid */}
            <div className="row">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <div
                    className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
                    key={doctor.id}
                  >
                    <Link
                      to={`/doctordetails/${doctor.id}`}
                      className="text-decoration-none text-dark"
                    >
                      <div className="doctor-card-overlay position-relative shadow-sm  overflow-hidden">
                        <img
                          src={
                            doctor.profile_image
                              ? `${Config.BASE_URL}/${doctor.profile_image}`
                              : doctor.gender === "Female"
                              ? female
                              : male
                          }
                          alt="doctor"
                          className="doc-bg-img w-100"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="white-box p-3 bg-white">
                          <h5 className="mb-1">
                            {doctor.firstname} {doctor.lastname}
                          </h5>

                          <p className="mb-2 text-muted small">
                            {JSON.parse(
                              doctor.professional_registration
                                ?.specialization || "[]"
                            ).join(", ")}
                          </p>

                          <div className="d-flex justify-content-between text-center">
                            <div>
                              <strong>
                                {doctor.overall_feedback_percentage}%
                              </strong>
                              <p className="mb-0 small text-muted">Satisfied</p>
                            </div>
                            <div>
                              <strong>{doctor.unique_user_id_count}</strong>
                              <p className="mb-0 small text-muted">Patient</p>
                            </div>
                            <div>
                              <strong>
                                {doctor.professional_registration
                                  ?.years_of_experience || 0}{" "}
                                Years
                              </strong>
                              <p className="mb-0 small text-muted">
                                Experience
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-12 text-center py-4">
                  <h5 className="text-muted">No Doctor Available</h5>
                </div>
              )}
            </div>
          </>
        </div>
        <Footer />
      </div>

      <style>
        {`
        /* Entire nav-pills container */

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

        }
.nav-pills {
  // background-color: #fff;
  border-radius: 12px;
  padding: 10px;
  flex-wrap: wrap;
  // justify-content: center;
}

/* Default tab style */
.nav-pills .nav-link {
  color: #000;
  border-radius: 30px;
  padding: 8px 20px;
  margin: 5px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

/* Active tab style */
.nav-pills .nav-link.active {
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  color: #000;
  border-radius: 30px;
}

/* Tab images (optional) */
.nav-pills .nav-link img {
  width: 20px;
  height: 20px;
}

.doctor-card-overlay {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  height: 400px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.doc-bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.white-box {
     position: absolute;
    bottom: 8px;
    left: 8px;
    width: 94%;
    background: #FFFFFF;
    padding: 14px;
    z-index: 2;
    /* border-top-left-radius: 20px; */
    /* border-top-right-radius: 20px; */
    border-radius: 14px;
}


            .headingtext{
              font-size: 35px;
              font-weight: 600;
              line-height: 44px;
              
            }




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
   /* Container wrapper */
// .search-box {
//   display: flex;
//   justify-content: center;
//   padding: 0 20px;
//   margin-top: 30px;
// }

// /* Search group containing location + input + button */
// .search-input-group {
  // display: flex;
  // align-items: center;
  // background-color: white;
  // border-radius: 10px;
  // padding: 2px;
  // box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  // max-width: 700px;
  // width: 100%;
  // gap: 10px;
// }

// /* Location block */
// .location {
//   display: flex;
//   align-items: center;
//   background-color: #e0eaf3;
//   padding: 8px 12px;
//   border-radius: 8px;
//   font-size: 14px;
//   white-space: nowrap;
// }

// .location img {
//   height: 18px;
//   margin-right: 6px;
// }

// /* Input field */
// .search-input {
//   flex: 1;
//   border: none;
//   outline: none;
//   font-size: 16px;
//   padding: 10px;
//   min-width: 100px;
// }

// /* Search button */
// .search-button {
//   background-color: #22d3aa;
//   border: none;
//   padding: 8px 12px;
//   border-radius: 8px;
//   cursor: pointer;
//   height: 40px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .search-button img {
//   height: 16px;
// }

// /* Mobile responsiveness */
// @media (max-width: 768px) {
//   .search-box {
//     padding: 0 10px;
//   }

//   .search-input-group {
//     flex-direction: column;
//     align-items: stretch;
//     gap: 10px;
//   }

//   .location,
//   .search-input,
//   .search-button {
//     width: 100%;
//   }

//   .search-input {
//     font-size: 14px;
//   }

//   .search-button {
//     justify-content: center;
//   }

//   .headingtext {
//     font-size: 22px;
//     line-height: 32px;
//     text-align: center;
//   }
// }


            /* Base styles */


.section-container {

  padding: 80px 20px;
  border-radius: 20px;
  margin-top: 20px;
  text-align: center;
// background: linear-gradient(to right,rgb(210, 234, 247) , #badcf0 )
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

export default CategoryDoctor;
