import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/Inner page header.png";
import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import icon1 from "../assets/images/Group 926.png";
import icon2 from "../assets/images/Group 927.png";
import icon3 from "../assets/images/Group 928.png";
import icon4 from "../assets/images/Group 982.png";
import icon5 from "../assets/images/Group 931.png";
import Footer from "../components/Footer";
import Config from "../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Categorypage() {
  const navigate = useNavigate();
  const [allCategory, setCategory] = useState([]);

  useEffect(() => {
    fetchDrDataCategory();
  }, []);
  const fetchDrDataCategory = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/specialties`);
      console.log("categories", response.data);
      // setCategory(response.data);
      setCategory(response.data?.data);
    } catch (error) {
      console.error(
        "Error fetching category data:",
        error.response?.data || error.message
      );
    }
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

        <div className="container mt-4">
          <div
            className="section-container"
            style={{
              backgroundImage: `url(${sectionbg})`,
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
        <div className="container my-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="headingtext  align-items-center justify-content-between">
              Primary Care Services
              <Link to="/category">
                <img src={icon4} className="ml-5" alt="link-icon" />
              </Link>
            </h3>
          </div>

          <div className="p-4  category-card-container bg-white">
            <div className="row">
              {allCategory.map((category) => (
                <div
                  className="col-12 col-md-6 col-lg-4 mb-4"
                  key={category.id}
                >
                  <Link
                    // to={`/categorydoctorall/${sub.name}`}
                    to={`/categorydoctorall?name=${category.name}`}
                    style={{ color: "#464646", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.target.style.color = "#2F79CF")}
                    onMouseLeave={(e) => (e.target.style.color = "#464646")}
                  >
                    <h6 className="category-title mb-3">{category.name}</h6>
                  </Link>
                  <ul className="list-unstyled text-muted small mb-0">
                    {category.subCat?.map((sub) => (
                      <Link
                        //  to={`/categorydoctorall/${sub.name}`}
                        to={`/categorydoctorall?name=${sub.name}`}
                        style={{ color: "#464646", textDecoration: "none" }}
                        onMouseEnter={(e) => (e.target.style.color = "#2F79CF")}
                        onMouseLeave={(e) => (e.target.style.color = "#464646")}
                      >
                        <li key={sub.id}>{sub.name}</li>
                      </Link>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
      <style>
        {`
        .category-card-container {
  background-color: #ffffff;
  border-radius: 20px;
  // box-shadow: 0 5px 10px #ffffff;
}

.category-title {
  font-weight: 500;
  font-size:20px;
  color: #464646;
}

.headingtext {
  font-size: 24px;
  font-weight: bold;
  color: #1c1c1c;
}

.list-unstyled li {
  margin-bottom: 6px;
}

@media (max-width: 768px) {
  .category-card-container {
    padding: 1.5rem;
  }

  .headingtext {
    font-size: 20px;
  }
}
            

.bookbutton {
  background-color: #4C6BE9;      /* Customize this color */
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
                  .headingtext{
              font-size: 35px;
              font-weight: 600;
              line-height: 44px;
              
            }
          .iconcss {
  width: 108px;
  height: 108px;
  margin: 20px auto 10px auto;
  display: block;
}

.crdcss {
  height: 83px;
  padding: 10px 5px;
  width: 170px;
  border-radius: 20px;
  border: 2px solid #F7F9FC;
  background-color: #F7F9FC;
  transition: all 0.3s ease-in-out;
  box-shadow: none;
}

.crdcss:hover {
  background-color: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
}

.crdcss h6 {
  font-size: 14px;
  margin-bottom: 5px;
}

.crdcss p {
  font-size: 12px;
  margin-bottom: 0;
}
  @media (max-width: 768px) {
    .headingtext {
        font-size: 25px; /* or another value suitable for smaller screens */
        line-height: 30px; /* adjust as needed */
    }
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




            /* Base styles */


.section-container {

  padding: 80px 20px;
  border-radius: 20px;
  margin-top: 20px;
  text-align: center;
background: linear-gradient(to right,rgb(210, 234, 247) , #badcf0 )
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
    font-size: 24px;
    line-height: 32px;
  }

  
}
                `}
      </style>
    </>
  );
}

export default Categorypage;
