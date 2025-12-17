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

import Footer from "../components/Footer";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../config";

const CategoryDoctorAll = () => {
  const navigate = useNavigate();
  // const { category } = useParams();
  // const queryData = new URLSearchParams(useLocation().search);
  //   const category = queryData.get("name");
  //   console.log("namename",category);
  // const decodedSubcategory = decodeURIComponent(category).toLowerCase();

  const queryData = new URLSearchParams(useLocation().search);
  const category = queryData.get("name");
  const decodedSubcategory = decodeURIComponent(category).toLowerCase();
  console.log("namename", decodedSubcategory);

  const [alldoctor, setAlldoctor] = useState([]);

  useEffect(() => {
    fetchDrData();
  }, []);

  const fetchDrData = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/alldoctor`);
      console.log("doctor Data:", response.data.doctors);

      setAlldoctor(response.data.doctors);
      // setDoctors(response.data.doctors);
    } catch (error) {
      console.error(
        "Error fetching doctor data:",
        error.response?.data || error.message
      );
    }
  };

  //   const filteredDoctors = alldoctor.filter((doctor) => {
  //   const subCategories = doctor.professional_registration?.sub_category
  //     ? JSON.parse(doctor.professional_registration.sub_category)
  //     : [];
  //   return subCategories.some(
  //     (sub) => sub.toLowerCase() === decodeURIComponent(category).toLowerCase()
  //   );
  // });

  const filteredDoctors = alldoctor.filter((doctor) => {
    let subCategories = [];
    let specialization = [];

    try {
      if (doctor.professional_registration?.sub_category) {
        subCategories = JSON.parse(
          doctor.professional_registration.sub_category
        );
      }
      if (doctor.professional_registration?.specialization) {
        specialization = JSON.parse(
          doctor.professional_registration.specialization
        );
      }
    } catch (e) {}

    return (
      subCategories.some((sub) => sub.toLowerCase() === decodedSubcategory) ||
      specialization.some((spec) => spec.toLowerCase() === decodedSubcategory)
    );
  });

  console.log("filteredDoctors", filteredDoctors);

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
          console.log("doctors:-", res.data.doctors);
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
    const filtered = alldoctor.filter((doc) => {
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

  // console.log(suggestions);

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
          <h1 className="headingtext">
            {category}
            <Link to="/">
              <img src={icon4} className="ml-5" />
            </Link>
          </h1>

          <>
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
                          src={
                            doctor.profile_image
                              ? `${Config.BASE_URL}/${doctor.profile_image}`
                              : doctor.gender === "Female"
                              ? female
                              : male
                          }
                          alt="doctor"
                          className="doc-bg-img"
                        />

                        <div className="white-box">
                          <h5 className="mb-1">
                            {doctor.firstname} {doctor.lastname}
                          </h5>

                          <p className="mb-2 text-muted">
                            {JSON.parse(
                              doctor.professional_registration
                                ?.specialization || "[]"
                            ).join(", ")}
                          </p>
                          <div className="d-flex justify-content-between text-center">
                            <div className="">
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
                            {/* <div>
                              <strong>{doctor.unique_user_id_count}</strong>
                              <p className="mb-0 small text-muted">Patient</p>
                            </div> */}
                            <div>
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
                            {/* <div>
                              <strong>
                                {doctor.professional_registration
                                  ?.years_of_experience || 0}{" "}
                                Years
                              </strong>
                              <p className="mb-0 small text-muted">
                                Experience
                              </p>
                            </div> */}
                            <div>
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

        }

.nav-pills {
  // background-color: #fff;
  border-radius: 12px;
  padding: 10px;
  flex-wrap: wrap;
  // justify-content: center;
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

export default CategoryDoctorAll;
