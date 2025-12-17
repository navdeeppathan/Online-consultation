import React, { useEffect, useState } from "react";
import bgImage from "../assets/images/Background.png";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import headerfirst from "../assets/images/sectionbg123.png";
import male from "../assets/images/male.png";
import female from "../assets/images/Female2.png";

import {
  FaMapMarkerAlt,
  FaUserMd,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "../components/Header";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import axios from "axios";
import Config from "../config";
import Footer from "../components/Footer";

const DoctorPage = () => {
  const location = useLocation();

  // Get query params
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("name");
  const searchLocation = queryParams.get("location");

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    specialistType: "All",
    appointmentType: "All",
    gender: "All",
    language: "All",
    location: "All",
  });

  const [filterOptions, setFilterOptions] = useState({
    specialistTypes: ["All"],

    // appointmentTypes: ["All", "Online", "In-person"],
    genders: ["All", "Male", "Female"],
    languages: [
      "All",
      "Arabic",
      "Bengali",
      "English",
      "French",
      "Hindi",
      "Mandarin Chinese",
      "Portuguese",
      "Russian",
      "Spanish",
      "Urdu",
    ],
    locations: ["All"],
  });
  //   distances: ["All", "5 Kilometers", "10 Kilometers", "25 Kilometers"],

  const [allDoctors, setAllDoctors] = useState([]);
  const isFiltersEmpty = () => {
    return Object.values(filters).every((v) => v === "All");
  };

  const [category, setCategory] = useState([]);
  const fetchDrData = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/alldoctor`
        //   , {
        //   params: {
        //     name,
        //     location: searchLocation,
        //   },
        // }
      );
      console.log("doctor Data:", response.data);
      setAllDoctors(response.data.doctors);
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
      const data = response.data?.data || [];

      // Store categories if you need them elsewhere
      setCategory(data);

      // Extract names
      const categoryNames = ["All", ...data.map((item) => item.name)];

      // Update filter options
      setFilterOptions((prev) => ({
        ...prev,
        specialistTypes: categoryNames,
      }));

      console.log("Specialties loaded:", categoryNames);
    } catch (error) {
      console.error(
        "Error fetching category data:",
        error.response?.data || error.message
      );
    }
  };

  const [locations2, setLocations] = useState(null);

  const fetchDrDataLocation = async () => {
    try {
      const response = await axios.get(`${Config.BASE_URL}/api/cities`);
      const data = response.data?.data || [];

      // Store categories if you need them elsewhere
      setLocations(data);

      // Extract names
      const LocationNames = ["All", ...data.map((item) => item.city_name)];

      // Update filter options
      setFilterOptions((prev) => ({
        ...prev,
        locations: LocationNames,
      }));

      console.log("Specialties loaded location:", LocationNames);
    } catch (error) {
      console.error(
        "Error fetching category data:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchDrData();
    fetchDrDataCategory();
    fetchDrDataLocation();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  console.log("filter data:-", filters);

  // const filteredDoctors = allDoctors.filter((doc) => {
  //   if (
  //     filters.specialistType !== "All" &&
  //     !JSON.parse(
  //       doc?.professional_registration?.specialization || "[]"
  //     ).includes(filters.specialistType)
  //   ) {
  //     return false;
  //   }

  //   if (
  //     filters.gender !== "All" &&
  //     doc?.personal_information?.gender !== filters.gender
  //   )
  //     return false;
  //   if (filters.language && filters.language !== "All") {
  //     let docLanguages = [];

  //     try {
  //       if (typeof doc?.personal_information?.languages === "string") {
  //         docLanguages = JSON.parse(doc?.personal_information?.languages);
  //       } else if (Array.isArray(doc?.personal_information?.languages)) {
  //         docLanguages = doc?.personal_information?.languages;
  //       } else {
  //         docLanguages = [];
  //       }
  //     } catch (error) {
  //       console.error("Error parsing languages:", error);
  //       docLanguages = [];
  //     }

  //     // Extract string value if filter is an object (e.g. from react-select)
  //     const selectedLanguage =
  //       typeof filters.language === "object"
  //         ? filters.language.value || filters.language.label
  //         : filters.language;

  //     // Normalize both sides for case & space safety
  //     const match = docLanguages.some(
  //       (lang) =>
  //         lang?.toLowerCase().trim() === selectedLanguage?.toLowerCase().trim()
  //     );

  //     console.log(
  //       "Doctor Languages:",
  //       docLanguages,
  //       "Filter:",
  //       selectedLanguage,
  //       "Match:",
  //       match
  //     );

  //     if (!match) return false;
  //   }

  //   if (filters.insurance !== "All" && doc.insurance !== filters.insurance)
  //     return false;
  //   if (
  //     filters.appointmentType !== "All" &&
  //     !doc.fees?.some((f) => f.fee_type === filters.appointmentType)
  //   )
  //     return false;

  //   // if (filters.distance !== "All") {
  //   //   const maxDist = parseInt(filters.distance.split(" ")[0]);
  //   //   if (doc.distance > maxDist) return false;
  //   // }
  //   return true;
  // });

  const filteredDoctors = allDoctors.filter((doc) => {
    if (isFiltersEmpty()) {
      let matches = true;

      // Match specialist from ?name=Cardiology
      if (name) {
        const specs = JSON.parse(
          doc?.professional_registration?.specialization || "[]"
        );
        if (!specs.includes(name)) matches = false;
      }

      // Match location from ?location=Delhi
      if (searchLocation) {
        const docLocation = doc?.personal_information?.city || "";
        if (!docLocation.toLowerCase().includes(searchLocation.toLowerCase())) {
          matches = false;
        }
      }

      return matches;
    }

    if (
      filters.specialistType !== "All" &&
      !JSON.parse(
        doc?.professional_registration?.specialization || "[]"
      ).includes(filters.specialistType)
    )
      return false;

    if (
      filters.location !== "All" &&
      doc?.personal_information?.city?.toLowerCase() !==
        filters.location.toLowerCase()
    ) {
      return false;
    }

    if (
      filters.gender !== "All" &&
      doc?.personal_information?.gender !== filters.gender
    )
      return false;

    if (filters.language !== "All") {
      let docLanguages = [];

      try {
        if (typeof doc?.personal_information?.languages === "string") {
          docLanguages = JSON.parse(doc?.personal_information?.languages);
        } else if (Array.isArray(doc?.personal_information?.languages)) {
          docLanguages = doc?.personal_information?.languages;
        }
      } catch {
        docLanguages = [];
      }

      const selectedLang = filters.language.toLowerCase().trim();

      if (!docLanguages.some((l) => l.toLowerCase().trim() === selectedLang))
        return false;
    }

    if (
      filters.appointmentType !== "All" &&
      !doc.fees?.some((f) => f.fee_type === filters.appointmentType)
    )
      return false;

    return true;
  });

  const customStyles = {
    control: (base, state) => ({
      ...base,
      borderRadius: "9999px", // pill shape
      borderColor: state.isFocused ? "#cbd5e1" : "#e2e8f0", // subtle border
      boxShadow: state.isFocused ? "0 0 0 1px #93c5fd" : "none",
      "&:hover": { borderColor: "#cbd5e1" },
      minHeight: "36px",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 12px",
    }),
    indicatorsSeparator: () => ({
      display: "none", // removes the vertical divider
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: "#64748b", // subtle arrow color
      paddingRight: "10px",
    }),
    singleValue: (base) => ({
      ...base,
      color: "#111827",
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "10px",
      zIndex: 5,
    }),
  };

  const handleDoctorClick = (doctor) => {
    navigate(`/doctordetails/${doctor.id}`);
  };
  return (
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
      {/* <div>
        <TopHeader />
      </div> */}
      <div className="container-fluid py-4 doctor-page bg-white">
        <div className="row d-flex justify-content-center">
          {/* LEFT FILTERS */}
          <div className="col-lg-2 col-lg-4 mb-4">
            <div className="filters p-3  rounded bg-white ">
              <h6 className="fw-bold mb-3">Filters</h6>

              {Object.entries(filterOptions).map(([key, options]) => (
                <div className="mb-3" key={key}>
                  <label className="form-label filter-label">
                    {key.charAt(0).toUpperCase() +
                      key.slice(1).replace(/([A-Z])/g, " $1")}
                    :
                  </label>

                  <Select
                    styles={customStyles}
                    options={options.map((opt) => ({ value: opt, label: opt }))}
                    value={{
                      value: filters[key.slice(0, -1)] || "All",
                      label: filters[key.slice(0, -1)] || "All",
                    }}
                    onChange={(selected) =>
                      handleFilterChange(key.slice(0, -1), selected.value)
                    }
                    components={{ IndicatorSeparator: () => null }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT DOCTOR LIST */}
          <div className=" col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
              {/* <h5
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#001F54",
                  letterSpacing: "0.2px",
                }}
                className="mb-2 mb-md-0"
              >
                {name || "All"} Specialists ({filteredDoctors.length} results)
              </h5> */}

              {/* <select className="form-select w-auto">
                <option>Relevance</option>
                <option>Highest Rated</option>
                <option>Most Reviewed</option>
              </select> */}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="alert alert-info">No doctors found.</div>
            )}
            {filteredDoctors.map((doc) => {
              // --- Calculate Rating and Review Data ---
              const feedbacks = doc.feedbacks_received || [];
              const totalReviews = feedbacks.length;
              const totalRating = feedbacks.reduce(
                (sum, item) => sum + item.rating,
                0
              );
              const averageRating =
                totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

              console.log("filteroption:-", doc);

              return (
                <div
                  key={doc.id}
                  onClick={() => handleDoctorClick(doc)}
                  style={{ border: "1px solid #D5DEF9" }}
                  className="doctor-card rounded-4 bg-white mb-4 d-flex flex-column flex-md-row justify-content-between align-items-center"
                >
                  {/* ---------- Doctor Info ---------- */}
                  <div className="d-flex flex-column p-3 flex-sm-row align-items-center align-items-sm-start gap-3 w-100">
                    <img
                      src={
                        doc.profile_image
                          ? `${Config.BASE_URL}/${doc.profile_image}`
                          : doc.gender === "Female"
                          ? female
                          : male
                      }
                      alt={`${doc.firstname} ${doc.lastname}`}
                      className="rounded-3 doctor-img"
                    />

                    <div className="text-center text-sm-start w-100">
                      <h5
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600,
                          color: "#001F54",
                        }}
                        className="mb-1"
                      >
                        {doc.personal_information?.full_name ||
                          `${doc.firstname} ${doc.lastname}`}
                        <span>
                          <i
                            className="bi bi-patch-check-fill"
                            style={{
                              color: "#001F54",
                              fontSize: "17px",
                              marginRight: "6px",
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
                            {doc.qualifications
                              ?.map((q) => q.degree)
                              .join(", ")}
                          </span>
                        </span>
                      </h5>

                      <p className="doctor-specialty mb-1">
                        {/* {JSON.parse(
                          doc.professional_registration?.specialization || "[]"
                        )[0] || "N/A"} */}
                        <p className="doctor-specialty mb-1">
                          {(() => {
                            const specializationArray = JSON.parse(
                              doc.professional_registration?.specialization ||
                                "[]"
                            );

                            let spec = specializationArray[0] || "N/A";

                            // Convert "logy" → "logist"
                            if (
                              spec !== "N/A" &&
                              spec.toLowerCase().endsWith("logy")
                            ) {
                              spec = spec.slice(0, -4) + "logist";
                            }

                            return spec;
                          })()}
                        </p>
                      </p>

                      <p
                        style={{
                          color: "#11245A",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                        className="d-flex align-items-center justify-content-center justify-content-sm-start"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="#11245A"
                          strokeWidth="1.8"
                          style={{
                            marginRight: "4px",
                            verticalAlign: "middle",
                          }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z"
                          />
                          <circle
                            cx="12"
                            cy="11"
                            r="2.5"
                            fill="white"
                            stroke="#0A1D66"
                            strokeWidth="1.4"
                          />
                        </svg>
                        {doc.personal_information?.home_address ||
                          "Location not provided"}
                      </p>
                      {/* <p className="doctor-specialty mb-1">
                        Gender:{" "}
                        <span
                          style={{
                            color: "#11245A",
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          {doc.gender || "N/A"}
                        </span>
                      </p> */}
                    </div>
                  </div>

                  {/* ---------- Rating Section ---------- */}
                  <div className="text-center p-3 border-start ps-md-4 mt-3 mt-md-0 w-50 w-md-auto">
                    <div className="mb-2">
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "24px",
                          color: "#051851",
                        }}
                        className="fs-4"
                      >
                        {averageRating}
                      </span>
                      <span
                        style={{
                          fontWeight: "700",
                          fontSize: "16px",
                          color: "#051851",
                        }}
                      >
                        /5
                      </span>

                      <div>
                        {Array(5)
                          .fill()
                          .map((_, i) => (
                            <FaStar
                              key={i}
                              style={{
                                color:
                                  i < Math.round(averageRating)
                                    ? "#00D4C6" // ✅ teal stars
                                    : "#E0E0E0",
                                marginRight: "2px",
                              }}
                            />
                          ))}
                      </div>

                      <small style={{ color: "#051851" }}>
                        ({totalReviews}{" "}
                        {totalReviews === 1 ? "review" : "reviews"})
                      </small>
                    </div>

                    {/* <small style={{ color: "#051851" }}>
                      {Math.floor(averageRating * 4000)} Skill endorsements
                    </small> */}

                    <hr
                      style={{
                        borderTop: "1px solid #11245A",
                        width: "90%",
                        margin: "10px auto",
                      }}
                    />

                    <button
                      style={{ backgroundColor: "#2b59E0" }}
                      className="btn btn-primary px-4 py-2 rounded-pill fw-semibold w-100 w-md-auto"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <style>{`
        .doctor-page {
          background: #f9fafc;
          min-height: 100vh;
        }
          .doctor-card:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              cursor: pointer;
          }
        .doctor-card img {
          object-fit: cover;
        }
        .doctor-img {
          width: 180px;
          height: 180px;
          border: 2px solid #D5DEF9;
          
        }
        .doctor-specialty {
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: 14px;
        color: #11245A; /* Deep navy */
        margin-bottom: 4px;
        }

        .filter-label {
        font-family: 'Poppins', sans-serif;
        color: #11245A;
        font-size: 14px;
        font-weight: 500;
        margin-bottom: 6px;
        }

        @media (max-width: 768px) {
          .doctor-card {
            text-align: center;
          }
          .doctor-card .border-start {
            border-left: none !important;
            border-top: 1px solid #D5DEF9 !important;
            margin-top: 10px;
            padding-top: 10px;
          }
          .doctor-card .btn {
            width: 100%;
          }
        }

                .custom-badge {
        background-color: #d9f9f6; /* light mint color */
        color: #11245A; /* deep navy text */
        border-radius: 50px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        font-size: 14px;
        padding: 6px 12px;
        display: flex;
        align-items: center;
        }

        .custom-badge i {
        color: #009688; /* teal check color */
        font-size: 14px;
        }

        .extra-badge {
        background-color: #eef0ff;
        color: #001f54;
        border-radius: 25px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        font-size: 14px;
        padding: 6px 10px;
        }

        .bg-success-subtle {
          background: #d9f9f6 !important;
        }
        .btn-primary {
          background-color: #2f54eb !important;
          border: none !important;
        }
        .btn-primary:hover {
          background-color: #1d3fc4 !important;
        }
      `}</style>
      </div>
      <Footer />
    </div>
  );
};

// const SearchBar = () => {
//   const navigate = useNavigate();

//   const [specialty, setSpecialty] = useState("");
//   const [condition, setCondition] = useState("");
//   const [location, setLocation] = useState(""); // ✅ new state
//   const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
//   const [isConditionOpen, setIsConditionOpen] = useState(false);
//   const [isLocationOpen, setIsLocationOpen] = useState(false); // ✅ new state

//   const [groupedSpecialties, setGroupedSpecialties] = useState({});
//   const [loading, setLoading] = useState(false);

//   const [locations, setLocations] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`${Config.BASE_URL}/api/cities`)
//       .then((response) => {
//         const data = response.data?.data || [];

//         setLocations(data.map((c) => c.city_name)); // plain array
//       })
//       .catch((error) => console.error("Error fetching countries:", error));
//   }, []);

//   useEffect(() => {
//     const fetchSpecialties = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(`${Config.BASE_URL}/api/specialties`);
//         if (res.data?.data) {
//           setGroupedSpecialties(res.data.data);
//         }
//       } catch (err) {
//         console.error("Error fetching specialties:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchSpecialties();
//   }, []);

//   return (
//     <>
//       <style>{`
//         .search-card2 {
//           background: #FFFFFF;
//           border-radius: 50px;
//           border: #D5DEF9 1px solid;
//           padding: 8px 12px;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           max-width: 900px;
//           width: 100%;
//           flex-wrap: wrap;
//         }

//         .dropdown-wrapper2 {
//           position: relative;
//           flex: 1;
//           width: 100%;
//           min-width: 220px;
//           border: #D5DEF9 1px solid;
//         }

//         .dropdown-button2 {
//           background: white;
//           border:none;
//           border-radius: 50px;
//           padding: 14px 22px;
//           width: 100%;
//           text-align: left;
//           cursor: pointer;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           font-size: 15px;
//         }

//         .dropdown-wrapper2 {
//           border-radius: 50px;
//           transition: box-shadow 0.2s ease-in-out;
//         }

//         /* Shadow only when an item is selected */
//         .dropdown-wrapper2.selected {
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//         }

//         /* Shadow on button hover */
//         .dropdown-button2:hover {
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//         }

//         .dropdown-menu1 {
//           position: absolute;
//           top: calc(100% + 8px);
//           left: 0;
//           right: 0;
//           background: white;
//           border-radius: 17px;
//           box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
//           z-index: 1000;
//           overflow: hidden;
//           padding: 8px;
//           height: 200px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//         }

//          .dropdown-menu2 {
//           position: absolute;
//           top: calc(100% + 8px);
//           left: 0;
//           right: 0;
//           background: white;
//           border-radius: 17px;
//           box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
//           z-index: 1000;
//           overflow: hidden;
//           height: 400px;
//           display: grid;
//           grid-template-columns: 1fr;
//         }

//          .dropdown-menu3 {
//           position: absolute;
//           top: calc(100% + 8px);
//           left: 0;
//           right: 0;
//           background: white;
//           border-radius: 17px;
//           box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
//           z-index: 1000;
//           overflow: hidden;
//           width: 600px;
//           height: 400px;
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//         }

//         .dropdown-menu-location {
//             position: absolute;
//             top: calc(100% + 8px);
//             left: 0;
//             right: 0;
//             background: white;
//             border-radius: 17px;
//             box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
//             z-index: 1000;
//             overflow-y: auto;
//             max-height: 350px;
//             padding: 8px ;
//             display: flex;
//             flex-direction: column;
//           }

//         .dropdown-menu1,
//         .dropdown-menu2 {
//           position: absolute;
//           z-index: 9999 !important;
//         }

//         .overlay-texttop2 {
//           position: relative;
//           z-index: 5;
//         }

//         .search-card2 {
//           position: relative;
//           z-index: 10;
//         }

//         /* responsive: stack columns */
//         @media (max-width: 768px) {
//           .dropdown-menu1 {
//             width: 100%;
//             height: auto;
//             max-height: 40vh;
//             grid-template-columns: 1fr;
//           }
//              .dropdown-menu2 {
//               width: 300px;
//              height: 300px;
//             grid-template-columns: 1fr ;

//           }
//             .dropdown-menu3 {
//               width: 350px;
//              height: 300px;
//             grid-template-columns: 1fr 1fr;
//           }

//           .dropdown-column + .dropdown-column {
//             border-left: none;
//             border-top: 1px solid #f0f0f0;
//           }
//         }

//         .dropdown-column {
//           padding: 12px 18px;
//           overflow-y: auto;
//         }

//         .dropdown-column + .dropdown-column {
//           border-left: 1px solid #f0f0f0;
//         }

//         .group-heading {
//           font-weight: 600;
//           font-size: 13px;
//           color: #999;
//           margin: 8px 0 4px;
//         }

//         .dropdown-item2 {
//           padding: 8px 6px;
//           cursor: pointer;
//           font-size: 14px;
//           color: #464646;
//           border-radius: 6px;
//         }

//         .dropdown-item2:hover {
//           background: #f5f5f5;
//         }

//         .dropdown-item2.selected2 {
//           color: #2563eb;
//           font-weight: 600;
//         }

//         /* Scrollbar styling */
//         .dropdown-column::-webkit-scrollbar {
//           width: 6px;
//         }
//         .dropdown-column::-webkit-scrollbar-thumb {
//           background-color: #ccc;
//           border-radius: 4px;
//         }
//         .dropdown-column::-webkit-scrollbar-track {
//           background: #f1f1f1;
//         }

//          /* Scrollbar styling */
//         .dropdown-menu-location::-webkit-scrollbar {
//           width: 6px;
//         }
//         .dropdown-menu-location::-webkit-scrollbar-thumb {
//           background-color: #ccc;
//           border-radius: 4px;
//         }
//         .dropdown-menu-location::-webkit-scrollbar-track {
//           background: #f1f1f1;
//         }

//         .search-button2 {
//           background: #436cff;
//          color: #FFFFFF;
//           border: none;
//           border-radius: 50px;
//           padding: 14px 32px;
//           font-size: 15px;
//           font-weight: 600;
//           cursor: pointer;
//           white-space: nowrap;
//         }

//         .search-button2:hover {
//           background: #3258d6;
//         }

//         @media (max-width: 500px) {
//           .search-card2 {
//             flex-direction: column;
//             border-radius: 20px;
//             padding: 16px;
//           }
//           .dropdown-button2 {
//             border-radius: 12px;
//           }
//           .search-button2 {
//             width: 100%;
//             border-radius: 12px;
//           }
//         }
//         .dropdown-label2 {
//           font-family: 'Manrope', sans-serif;
//           font-weight: 400;
//           font-style: normal;
//           font-size: 12.03px;
//           line-height: 100%;
//           letter-spacing: 0;
//           color: #464646;

//         }

//       `}</style>

//       <div className="container">
//         <div className="search-card2 mt-4">
//           {/* FIRST DROPDOWN - SPECIALTY */}
//           {/* <div className={`dropdown-wrapper2 ${specialty ? "selected" : ""}`}>
//             <button
//               className="dropdown-button2"
//               onClick={() => {
//                 setIsSpecialtyOpen(!isSpecialtyOpen);
//                 setIsConditionOpen(false);
//                 setIsLocationOpen(false); // close others
//               }}
//             >
//               <div className="d-flex flex-column">
//                 <div className="dropdown-label2">I'm looking for a...</div>
//                 {specialty || "Select Specialty"}
//               </div>
//               <ChevronDown size={24} color="#858BA3" />
//             </button>

//             {isSpecialtyOpen && (
//               <div
//                 className="dropdown-menu1"
//                 style={{ height: "auto", gridTemplateColumns: "1fr" }}
//               >
//                 {["Doctor/Specialist"].map((item) => (
//                   <div
//                     key={item}
//                     className={`dropdown-item2 ${
//                       specialty === item ? "selected2" : ""
//                     }`}
//                     onClick={() => {
//                       setSpecialty(item);
//                       setIsSpecialtyOpen(false);
//                       setCondition("");
//                     }}
//                   >
//                     {item}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div> */}

//           {/* Second Dropdown - Dynamic Conditions + Specialties */}
//           <div className={`dropdown-wrapper2 ${condition ? "selected" : ""}`}>
//             <button
//               className="dropdown-button2"
//               onClick={() => {
//                 setIsConditionOpen(!isConditionOpen);
//                 setIsSpecialtyOpen(false);
//               }}
//             >
//               <div className="d-flex flex-column">
//                 <div className="dropdown-label2">
//                   What are you searching for
//                 </div>
//                 {condition || "Select the Specialty"}
//               </div>
//               <ChevronDown size={24} color="#858BA3" />
//             </button>

//             {isConditionOpen && (
//               <div className={`dropdown-menu2`}>
//                 {
//                   <>
//                     {/* <div className="dropdown-column">
//                       {loading ? (
//                         <div className="p-3 text-sm text-gray-500">
//                           Loading...
//                         </div>
//                       ) : (
//                         Object.entries(groupedSpecialties).map(
//                           ([letter, items]) => (
//                             <div key={letter}>
//                               <div className="group-heading">{letter}</div>
//                               {items.map((item) => (
//                                 <div
//                                   key={item.id}
//                                   className={`dropdown-item2 ${
//                                     condition === item.name ? "selected2" : ""
//                                   }`}
//                                   onClick={() => {
//                                     setCondition(item.name);
//                                     setIsConditionOpen(false);
//                                   }}
//                                 >
//                                   {item.name}
//                                 </div>
//                               ))}
//                             </div>
//                           )
//                         )
//                       )}
//                     </div> */}
//                     <div className="dropdown-column">
//                       {loading ? (
//                         <div className="p-3 text-sm text-gray-500">
//                           Loading...
//                         </div>
//                       ) : (
//                         groupedSpecialties.map((item) => (
//                           <div
//                             key={item.id}
//                             className={`dropdown-item2 ${
//                               condition === item.name ? "selected2" : ""
//                             }`}
//                             onClick={() => {
//                               setCondition(item.name);
//                               setIsConditionOpen(false);
//                             }}
//                           >
//                             {item.name}
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </>
//                 }
//               </div>
//             )}
//           </div>

//           {/*  NEW DROPDOWN - LOCATION */}
//           <div className={`dropdown-wrapper2  ${location ? "selected" : ""}`}>
//             <button
//               className="dropdown-button2"
//               onClick={() => {
//                 setIsLocationOpen(!isLocationOpen);
//                 setIsSpecialtyOpen(false);
//                 setIsConditionOpen(false);
//               }}
//             >
//               <div className="d-flex flex-column">
//                 <div className="dropdown-label2">Where</div>
//                 {location || "Select Location"}
//               </div>
//               <ChevronDown size={24} color="#858BA3" />
//             </button>

//             {isLocationOpen && (
//               <div className="dropdown-menu-location">
//                 {locations.map((loc) => (
//                   <div
//                     key={loc}
//                     className={`dropdown-item2 ${
//                       location === loc ? "selected2" : ""
//                     }`}
//                     onClick={() => {
//                       setLocation(loc);
//                       setIsLocationOpen(false);
//                     }}
//                   >
//                     {loc}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* SEARCH BUTTON */}
//           <button
//             className="search-button2"
//             style={{
//               background: "linear-gradient(90deg, #4C6BE9 0%, #3046A2 100%)",
//             }}
//             onClick={() =>
//               (window.location.href = `/doctornewpage?name=${encodeURIComponent(
//                 condition
//               )}&location=${encodeURIComponent(location)}`)
//             }
//           >
//             Search
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

const SearchBar = () => {
  const navigate = useNavigate();

  const [condition, setCondition] = useState(null);
  const [location, setLocation] = useState(null);

  const [specialties, setSpecialties] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Specialties
  useEffect(() => {
    const fetchSpecialties = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${Config.BASE_URL}/api/specialties`);
        const data = res.data?.data || [];
        setSpecialties(
          data.map((item) => ({
            value: item.name,
            label: item.name,
          }))
        );
      } catch (err) {
        console.error("Error fetching specialties:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  // Fetch Locations
  useEffect(() => {
    axios
      .get(`${Config.BASE_URL}/api/cities`)
      .then((response) => {
        const data = response.data?.data || [];
        setLocations(
          data.map((city) => ({
            value: city.city_name,
            label: city.city_name,
          }))
        );
      })
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  // Handle Search Click
  const handleSearch = () => {
    window.location.href = `/doctornewpage?name=${encodeURIComponent(
      condition?.value || ""
    )}&location=${encodeURIComponent(location?.value || "")}`;
  };

  return (
    <>
      <style>{`
        .search-card2 {
        border: #D5DEF9 1px solid;
         background: #FFFFFF;
          border-radius: 50px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 900px;
          width: 100%;
          flex-wrap: wrap;
          position: relative;
          z-index: 10; /* ensure this layer is above page background */
        }

        .dropdown-wrapper2 {
          flex: 1;
          min-width: 220px;
          border: #D5DEF9 1px solid;
        }


        .dropdown-wrapper2 {
          border-radius: 50px;
          transition: box-shadow 0.2s ease-in-out;
        }

        /* Shadow only when an item is selected */
        .dropdown-wrapper2.selected {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .search-button2 {
          background: linear-gradient(90deg, #4C6BE9 0%, #3046A2 100%);
          color: #FFFFFF; 
          border: none;
          border-radius: 50px;
          padding: 14px 32px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .search-button2:hover {
          background: #3258d6;
        }

        @media (max-width: 500px) {
          .search-card2 {
            flex-direction: column;
            border-radius: 20px;
            padding: 16px;
          }
          .search-button2 {
            width: 100%;
            border-radius: 12px;
          }
            .dropdown-wrapper2 {
            width: 100%;
            }
        }

        .dropdown-label2 {
    font-size: 13.33px;
    font-family: Poppins, sans-serif;
          font-weight: 400;
          
          color: #464646;
        margin-left: 15px;
        margin-top: 6px;
        margin-bottom: 0px;
        }

        .dropdown-label2.selected {
          color: #2B59E0;
        }
      `}</style>

      <div className="container">
        <div className="search-card2">
          {/* Condition Dropdown */}
          <div className={`dropdown-wrapper2 ${condition ? "selected" : ""}`}>
            <div className={`dropdown-label2 ${condition ? "selected" : ""}`}>
              What are you searching for ?
            </div>
            <Select
              options={specialties}
              isSearchable
              isLoading={loading}
              classNamePrefix="react-select"
              placeholder="Select Specialty"
              value={condition}
              onChange={setCondition}
              menuPortalTarget={document.body} // ✅ Dropdown rendered above all elements
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: 50,
                  padding: "0px 6px",
                  minHeight: "36px",
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: state.isFocused ? "none" : "none",
                  "&:hover": { border: "none" },
                  zIndex: 10,
                  fontFamily: "Poppins, sans-serif",
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                }),
                menuPortal: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                  zIndex: 9999, // ✅ ensures dropdown is on top
                }),
                menu: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif", // ✅ applies to dropdown list
                }),
                option: (base, state) => ({
                  ...base,
                  fontFamily: "Poppins, sans-serif", // ✅ applies to options
                  fontSize: "13px",
                  backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                  color: "#333",
                }),
              }}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
            />
          </div>

          {/* Location Dropdown */}
          <div className={`dropdown-wrapper2  ${location ? "selected" : ""}`}>
            <div className={`dropdown-label2 ${location ? "selected" : ""}`}>
              Where
            </div>
            <Select
              options={locations}
              isSearchable
              placeholder="Select Location"
              classNamePrefix="react-select"
              value={location}
              onChange={setLocation}
              menuPortalTarget={document.body} // ✅ same fix here
              styles={{
                control: (base, state) => ({
                  ...base,
                  borderRadius: 50,
                  padding: "0px 6px",
                  minHeight: "36px",
                  border: "none",
                  backgroundColor: "transparent",
                  boxShadow: state.isFocused ? "none" : "none",
                  "&:hover": { border: "none" },
                  zIndex: 10,
                  fontFamily: "Poppins, sans-serif",
                }),
                singleValue: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                }),
                menuPortal: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif",
                  zIndex: 9999, // ✅ ensures dropdown is on top
                }),
                menu: (base) => ({
                  ...base,
                  fontSize: "13px",
                  fontFamily: "Poppins, sans-serif", // ✅ applies to dropdown list
                }),
                option: (base, state) => ({
                  ...base,
                  fontFamily: "Poppins, sans-serif", // ✅ applies to options
                  fontSize: "13px",
                  backgroundColor: state.isFocused ? "#f0f0f0" : "white",
                  color: "#333",
                }),
                input: (base) => ({
                  ...base,
                  fontSize: "13px", // ✅ fixes typing size
                  fontFamily: "Poppins, sans-serif", // ✅ applies Poppins to search
                  color: "#333",
                }),
              }}
              components={{
                DropdownIndicator: () => null,
                IndicatorSeparator: () => null,
              }}
            />
            <style>{`/* --- React Select Dropdown Scrollbar --- */
                        .react-select__menu-list::-webkit-scrollbar {
                          width: 6px;
                        }

                        .react-select__menu-list::-webkit-scrollbar-thumb {
                          background-color: rgba(0, 0, 0, 0.4);
                          border-radius: 10px;
                        }

                        .react-select__menu-list::-webkit-scrollbar-thumb:hover {
                          background-color: rgba(0, 0, 0, 0.6);
                        }

                        .react-select__menu-list {
                          scrollbar-width: thin;
                          scrollbar-color: rgba(0, 0, 0, 0.4) transparent;
                        }
            `}</style>
          </div>

          {/* Search Button */}
          <button className="search-button2" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </>
  );
};
const TopHeader = () => {
  return (
    <>
      <div className=" position-relative ">
        <p className="imgright2" />
        <div className="overlay-texttop2">
          {/* <h2>
            Find and Book a <br />
            <span>Trusted Doctor/Specialist Near You</span>
          </h2>

          <p class="doctors-text">
            <span class="num">10k</span>
            <span class="plus">+</span>
            <span class="label">Doctors</span>
          </p> */}

          <SearchBar />

          {/* <p class="service-text">
            
            We make it easy for you to get access to over 10,000 doctors in the
            UK with only a few clicks.
          </p> */}
        </div>
      </div>

      <style>
        {`
      .imgright2 {
    width: 100%;
    background:#F4F7FD;
    height: 150px; /* Maintain aspect ratio */
    max-height: 564px; /* Optional max height */
    object-fit: cover; 
    
    /* Ensures the image covers the area */
  }

  .overlay-texttop2 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%; /* Responsive width */
    max-width: 900px;
  }

  .overlay-texttop2 h2 {
    
    font-weight: 800;
    font-size: 42px;
    line-height: 45px;
    color: #41464C;
    text-align: center;
  }

  .overlay-texttop2 h2 span {
    font-weight: 500;
    font-size: 32px;
    line-height: 41px;
    text-align: center;
  }

  /* Base paragraph */
  .overlay-texttop2 p.doctors-text {
    
    font-size: 17.68px;
    line-height: 43.71px;
    text-align: center;
    margin-top: 15px;
    letter-spacing: 0; /* matches design */
  }

  /* "10k" */
  .overlay-texttop2 p.doctors-text .num {
    font-weight: 500;
    color: #2F79CF;
  }

  /* "+" */
  .overlay-texttop2 p.doctors-text .plus {
    font-weight: 600;
    color: red;
  }

  /* "Doctors" */
  .overlay-texttop2 p.doctors-text .label {
    font-weight: 400;
    color: #41464C; /* or inherit */
  }

  /* 📱 Responsive scaling */
  @media (max-width: 768px) {
    .overlay-texttop2 p.doctors-text {
      font-size: 15px;       /* slightly smaller */
      line-height: 28px;     /* tighter spacing */
    }

    .imgright2 {
    width: 100%;
    background:#F4F7FD;
    height: 300px; /* Maintain aspect ratio */
    max-height: 564px; /* Optional max height */
    object-fit: cover; 
    
    /* Ensures the image covers the area */
  }
  }


  .overlay-texttop2 p.service-text {
    
    font-weight: 400;
    font-size: 16px;
    line-height: 23px;
    color: #515151;
    text-align: center;
    margin-top: 15px;
    letter-spacing: 0; /* matches spec */
  }

  /* 📱 Responsive scaling */
  @media (max-width: 768px) {
    .overlay-texttop2 p.service-text {
      font-size: 14px;
      line-height: 20px;
    }
  }


  @media (max-width: 992px) {
    .overlay-texttop2 h2 {
      font-size: 36px;
      line-height: 42px;
    }

    .overlay-texttop2 h2 span {
      font-size: 28px;
      line-height: 38px;
    }
  }

  @media (max-width: 768px) {
    .overlay-texttop2 h2 {
      font-size: 28px;
      line-height: 36px;
    }

  .overlay-texttop2 h2 span {
    font-size: 22px;
    line-height: 32px;
  }


}

      `}
      </style>
    </>
  );
};
export default DoctorPage;
