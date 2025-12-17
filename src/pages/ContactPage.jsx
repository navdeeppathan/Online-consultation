import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/Mask group (1).png";
import innerpage2 from "../assets/images/Inner page header.png";
import innerpage from "../assets/images/innerpagebanner.png";

import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";

import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import Config from "../config";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
function ContactPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    subject: "",
    message: "",
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${Config.BASE_URL}/api/contact-us`,
        formData
      );
      toast.success(res.data.message);
      // alert(res.data.message);
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.respose.data.message || "Something went wrong!");

      // alert("Something went wrong!");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

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

        <div className="container mt-4">
          <div className="row">
            <h1>Contact Us</h1>
            <p className="mt-3">
              Please send us a note and we’ll get back to you as quickly as
              possible.
            </p>
            <div className="col-12 col-lg-6">
              <div className="card contactcard p-5 mt-4 mb-5">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      className="form-control custom-placeholder"
                      value={formData.full_name}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control custom-placeholder"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      maxLength={10}
                      name="phone_number"
                      className="form-control custom-placeholder"
                      value={formData.phone_number}
                      onChange={handleFormChange}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="form-control custom-placeholder"
                      value={formData.subject}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter subject"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea
                      className="form-control custom-placeholder"
                      rows="4"
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                      placeholder="Write your message here"
                    ></textarea>
                  </div>
                  <div className="contactbtn-wrapper">
                    <button
                      type="submit"
                      className="contactbtn"
                      disabled={loading}
                    >
                      {loading && (
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      )}
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-12 col-lg-6 mt-5 mt-lg-0">
              <h2 className="contact-office-title mt-4">Office</h2>
              <p className="mt-3">
                Address:
                <br />
                38f Chigwell Ln, Debden, Loughton IG10 3NY
                <br />
              </p>
              <p>
                Email
                <br /> info@yodoc.co.uk
              </p>
              <p>
                Phone:
                <br /> 01234 440530
              </p>

              {/* Map */}
              <div className="map-container mt-3">
                <iframe
                  title="map"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-0.13%2C51.50%2C-0.11%2C51.52&layer=mapnik"
                  width="100%"
                  height="370px"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>

      <style>
        {`

.contactbtn-wrapper {
  display: flex;
  justify-content: flex-end; /* Align to right */
}

.contactbtn {
  padding: 8px 15px;
  border-radius: 30px;
  background-color: #4C6BE9;
  border: 2px solid #4C6BE9;
  color: #fff;
  float: right;   /* Push to right */
}


.contactcard{
   border-radius: 20px;
   border:2px solid #fff;

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
  font-weight: 400;
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









                    `}
      </style>
    </>
  );
}

export default ContactPage;
