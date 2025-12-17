import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/Mask group (1).png";
import innerpage from "../assets/images/Inner page header.png";
import banner3 from "../assets/images/banner3.png";
import banner4 from "../assets/images/banner4.png";
import Footer from "../components/Footer";
import aboutimaage from "../assets/images/Group (2).png";
import { useState } from "react";
import toast from "react-hot-toast";

function CarriersPage() {
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
        {/* <div className="container mt-2">
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
          </div>
        </div> */}

        {/* <div className="container mt-4">
          <div className="row">
            <div className="col-12 col-lg-6">
              <h1>Carrier</h1>
              <h2
                style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  textAlign: "center",
                  justifyContent: "center",
                  marginTop: "5rem",
                }}
              >
                Coming Soon...
              </h2>
            </div>
            <div className="col-12 col-lg-6 mt-5 mb-5  p-5 mt-lg-0">
              <img
                src={aboutimaage}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  borderRadius: "10px",
                  display: "block",
                }}
              />
            </div>
          </div>
        </div> */}

        <WhyChooseYoDoc />
        <Careers />
        <ApplySection />
        <Footer />
      </div>

      <style>
        {`





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









                    `}
      </style>
    </>
  );
}

const WhyChooseYoDoc = () => {
  return (
    <section className="why-choose-yodoc py-5">
      <div className="container">
        {/* Title */}
        <div className="text-center mb-5">
          <h2 className="fw-bold">Why Choose Yodoc?</h2>
        </div>

        {/* Row with 4 columns */}
        <div className="row g-4">
          {/* Card 1 */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-4 h-100" style={{ backgroundColor: "#e6f2ff" }}>
              <h5 className="fw-bold mb-3">1. Convenient & Accessible:</h5>
              <p className="mb-0">
                Access qualified doctors anytime, anywhere. YoDoc allows you to
                consult with healthcare professionals from the comfort of your
                home, saving travel time and making healthcare more convenient.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-4 h-100" style={{ backgroundColor: "#e6f2ff" }}>
              <h5 className="fw-bold mb-3">2. Quick Appointments:</h5>
              <p className="mb-0">
                Avoid long waiting times at clinics. YoDoc provides fast
                scheduling, including same-day consultations, so you can get
                timely medical advice and treatment when you need it most.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-4 h-100" style={{ backgroundColor: "#e6f2ff" }}>
              <h5 className="fw-bold mb-3">3. Confidential & Secure:</h5>
              <p className="mb-0">
                Your privacy matters. All consultations on YoDoc are secure and
                confidential, ensuring you can discuss sensitive health issues
                comfortably with professional doctors.
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="p-4 h-100" style={{ backgroundColor: "#e6f2ff" }}>
              <h5 className="fw-bold mb-3">4. Comprehensive Care:</h5>
              <p className="mb-0">
                From general health to specialist care, chronic conditions, and
                mental health support, YoDoc connects you with experts across
                multiple medical categories, ensuring holistic care for you and
                your family.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const jobs = [
  {
    title: "Technical Lead",
    location: "London",
    experience: "3-4 Years",
    qualification: "B.Tech",
  },
  {
    title: "Java Developer",
    location: "London",
    experience: "0-2 Years",
    qualification: "B.Tech/MCA",
  },
  {
    title: ".NET Developer",
    location: "London",
    experience: "2-4 Years",
    qualification: "B.Tech/MCA",
  },
  {
    title: "Digital Marketing",
    location: "India",
    experience: "1-2 Years",
    qualification: "Any Graduate",
  },
  {
    title: "Web Developer",
    location: "London",
    experience: "2-4 Years",
    qualification: "B.Tech/MCA",
  },
  {
    title: "Data Analyst",
    location: "London",
    experience: "5-6 Years",
    qualification: "Any Graduate",
  },
  {
    title: "Software Testing",
    location: "London",
    experience: "1-3 Years",
    qualification: "Any Graduate",
  },
  {
    title: "Business Analyst",
    location: "London",
    experience: "6 Years",
    qualification: "Any Degree",
  },
];

const Careers = () => {
  return (
    <section className="py-5 bg-white">
      <div className="container">
        {/* Section Title */}
        <h2 className="text-center fw-bold mb-5">Current Openings</h2>

        {/* Jobs Grid */}
        <div className="row g-4">
          {jobs.map((job, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3">
              <div className="card h-100 border shadow-sm">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{job.title}</h5>
                  <p className="mb-1">
                    <strong>Location:</strong> {job.location}
                  </p>
                  <p className="mb-1">
                    <strong>Experience:</strong> {job.experience}
                  </p>
                  <p className="mb-3">
                    <strong>Qualification:</strong> {job.qualification}
                  </p>
                  <button className="btn btn-dark mt-auto">Apply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ApplySection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    file: null,
    message: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value, // store file object
    });
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object for sending to API
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("file", formData.file);
    formDataToSend.append("message", formData.message);

    // 👉 You can replace this console.log with an axios/fetch POST
    console.log("Form submitted:", formData);

    toast.success("Thank you for applying! We will get back to you soon.");
  };
  return (
    <section className="py-5">
      <div className="container">
        {/* Title & Description */}
        <h2 className="text-center fw-bold mb-3">How to Apply</h2>
        <p className="text-center text-muted mb-5">
          Ready to embark on an exciting career journey with Nexteck? Follow our
          straightforward application process to submit your resume and showcase
          your talents.
          <br />
          Join us at Nexteck and be part of a team that's shaping the future of
          technology. Your journey towards innovation starts here!
        </p>

        {/* Layout */}
        <div className="row ">
          {/* Left Side - Images */}
          <div className="col-md-6 mb-4 mb-md-0 position-relative">
            {/* First Image */}
            <img
              src={banner3}
              alt="career"
              className="img-fluid rounded shadow"
            />
          </div>

          {/* Right Side - Form */}
          <div className="col-md-6">
            <div className="p-4 rounded" style={{ background: "#f5f9f8" }}>
              <h4 className="fw-bold mb-4">Share Your Resume</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="file"
                    name="file"
                    className="form-control"
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    name="message"
                    className="form-control"
                    rows="4"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-dark w-100">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarriersPage;
