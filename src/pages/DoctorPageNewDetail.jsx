import React, { useState, useRef, useEffect } from "react";
import bgImage from "../assets/images/Background.png";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaMapMarkerAlt,
  FaUserMd,
  FaCheckCircle,
  FaPhone,
  FaCalendarCheck,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";

const DoctorPageNewDetail = () => {
  const { id } = useParams();
  const [drData, setUserData] = useState(null); // null is better than "" for object

  useEffect(() => {
    setLoading2(true);
    axios
      .get(`${Config.BASE_URL}/api/doctor/${id}`)
      .then((res) => {
        setUserData(res.data?.data?.doctor);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading2(false));
  }, [id]);

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

      <div>
        <DoctorPageNewDetail2 />
      </div>

      <Footer />
    </div>
  );
};

const DoctorPageNewDetail2 = () => {
  const expertise = [
    { name: "Back Pain", count: 184 },
    { name: "Lower Back Pain", count: 754 },
    { name: "Neck Pain", count: 377 },
  ];

  const [activeTab, setActiveTab] = useState("About");
  const [tabProgress, setTabProgress] = useState({});
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});
  const tabs = ["About", "Location", "Reviews", "Skills", "Media", "FAQ"];

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
      {/* Banner */}
      <div className="doctor-banner py-4">
        <div className="container">
          <div className="row align-items-center">
            {/* Doctor Image */}
            <div className="col-12 col-md-3 text-center mb-3 mb-md-0">
              <img
                src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop"
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
                Dr. Sameh Abolfotouh
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
                    MD ABMS
                  </span>
                </span>
              </h5>
              <p className="mb-2 fs-5">Orthopaedic Surgeon</p>
              <div className="doctor-info-details mt-3">
                <p className="mb-1 d-flex align-items-start">
                  <FaMapMarkerAlt className="me-2 text-primary-light" />
                  <span>
                    Dubai{" "}
                    <a
                      href="#"
                      className="fw-semibold text-decoration-underline text-primary"
                    >
                      (+1 more)
                    </a>
                  </span>
                </p>

                <p className="mb-1 d-flex align-items-start">
                  <FaUserMd className="me-2 text-primary-light" />
                  <span>2 connections in healthcare</span>
                </p>

                <p className="mb-0 d-flex align-items-start">
                  <i
                    className="bi bi-people-fill me-2 text-primary-light"
                    style={{ fontSize: "18px" }}
                  ></i>
                  <span>
                    <a
                      href="#"
                      className="fw-semibold text-decoration-underline text-primary"
                    >
                      Skill endorsed
                    </a>{" "}
                    by Dr. Ahmed Doheim, Dr. Usama Hassan Saleh
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container my-4 ">
        <div className="row">
          {/* Left (Tabs + Content Scrollable) */}
          <div className="col-lg-8 col-md-12 mb-4">
            <ul className="nav nav-tabs mt-3 border-0 position-relative">
              {tabs.map((tab) => (
                <li className="nav-item2 position-relative" key={tab}>
                  <button
                    className={`nav-link ${activeTab === tab ? "active" : ""}`}
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
                  backgroundColor: "#002D72",
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
                <h5 className="fw-bold mb-3">About Dr. Sameh Abolfotouh</h5>
                <p>
                  Dr. Sameh Abolfotouh is a highly accomplished and experienced
                  board-certified consultant Orthopaedics and Spine Surgeon at
                  Medcare Orthopaedics & Spine Hospital in Dubai, UAE. He
                  completed his Orthopaedics residency from Hamad Medical
                  Corporation (HMC) / Weill Cornell Medical College, Doha,
                  Qatar, and went on to complete two clinical spine surgery
                  fellowships from the Centre of Spine and Orthopaedics in
                  Denver, CO, and the University of Missouri, USA.
                </p>
                <p>
                  Dr. Abolfotouh has made significant contributions to the
                  surgical field through multiple peer-reviewed papers published
                  in prestigious journals. He holds many leadership positions,
                  including serving as the AO Spine MENA Educational officer and
                  board member, a member of the AO Spine Education Commission,
                  and a chair of the e-learning committee at International
                  Musculoskeletal Society (IMS).
                </p>
                <p>
                  With extensive experience in complex spine surgeries, Dr.
                  Abolfotouh specializes in minimally invasive techniques that
                  reduce recovery time and improve patient outcomes. His
                  dedication to advancing orthopedic care has made him a
                  respected figure in the medical community.
                </p>
              </div>

              {/* Location Section */}
              <div
                ref={(el) => (sectionRefs.current["Location"] = el)}
                className="content-section"
              >
                <h5 className="fw-bold mb-3">Location</h5>
                <p>
                  <FaMapMarkerAlt className="text-primary me-2" />
                  Medcare Orthopaedics & Spine Hospital, Dubai, UAE
                </p>
                <p>
                  <strong>Clinic Hours:</strong> Sunday - Thursday: 9:00 AM -
                  6:00 PM
                </p>
                <div
                  className="rounded shadow-sm border mt-3"
                  style={{ height: "250px", background: "#e9ecef" }}
                >
                  <p className="text-center pt-5 text-muted">
                    [Google Map Placeholder]
                  </p>
                </div>
                <p className="mt-3">
                  Our state-of-the-art facility is conveniently located in the
                  heart of Dubai, offering easy access to patients from across
                  the UAE. Free parking is available for all patients.
                </p>
              </div>

              {/* Reviews Section */}
              <div
                ref={(el) => (sectionRefs.current["Reviews"] = el)}
                className="content-section"
              >
                <h5 className="fw-bold mb-3">Reviews</h5>
                <p>
                  Our patients consistently rate Dr. Abolfotouh highly for his
                  expertise, bedside manner, and successful treatment outcomes.
                </p>
                <div className="border rounded p-3 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div className="text-warning">★★★★★</div>
                    <span className="ms-2 text-muted small">2 weeks ago</span>
                  </div>
                  <p className="mb-1">
                    "Excellent doctor! Very professional and caring."
                  </p>
                  <small className="text-muted">- Sarah M.</small>
                </div>
                <div className="border rounded p-3 mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <div className="text-warning">★★★★★</div>
                    <span className="ms-2 text-muted small">1 month ago</span>
                  </div>
                  <p className="mb-1">
                    "My back pain is gone after his treatment. Highly
                    recommend!"
                  </p>
                  <small className="text-muted">- Mohammed A.</small>
                </div>
              </div>

              {/* Skills Section */}
              <div
                ref={(el) => (sectionRefs.current["Skills"] = el)}
                className="content-section"
              >
                <h5 className="fw-bold mb-3">Skills & Expertise</h5>
                <p>
                  Dr. Abolfotouh specializes in a wide range of orthopedic and
                  spine procedures:
                </p>
                <ul>
                  <li>Complex Spine Surgery</li>
                  <li>Minimally Invasive Spine Procedures</li>
                  <li>Spinal Deformity Correction</li>
                  <li>Joint Replacement Surgery</li>
                  <li>Sports Medicine & Injury Treatment</li>
                  <li>Arthroscopic Surgery</li>
                </ul>
                <p>
                  His advanced training and years of experience ensure that
                  patients receive the highest quality care using the latest
                  surgical techniques.
                </p>
              </div>

              {/* Media Section */}
              <div
                ref={(el) => (sectionRefs.current["Media"] = el)}
                className="content-section"
              >
                <h5 className="fw-bold mb-3">Media & Publications</h5>
                <p>
                  Dr. Abolfotouh has been featured in various medical journals
                  and conferences, sharing his expertise with the global medical
                  community.
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
              </div>

              {/* FAQ Section */}
              <div
                ref={(el) => (sectionRefs.current["FAQ"] = el)}
                className="content-section"
              >
                <h5 className="fw-bold mb-3">Frequently Asked Questions</h5>
                <div className="mb-3">
                  <h6 className="fw-bold">What conditions do you treat?</h6>
                  <p>
                    I specialize in treating back pain, neck pain, spinal
                    disorders, joint problems, and sports injuries.
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="fw-bold">Do you accept insurance?</h6>
                  <p>
                    Yes, we accept most major insurance plans. Please contact
                    our office to verify your specific coverage.
                  </p>
                </div>
                <div className="mb-3">
                  <h6 className="fw-bold">
                    How long is a typical appointment?
                  </h6>
                  <p>
                    Initial consultations typically last 45-60 minutes, while
                    follow-up appointments are usually 20-30 minutes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-lg-4 col-md-12">
            <div className="sidebar p-4 rounded shadow-sm">
              <div className="d-flex align-items-center mb-2">
                <h3 className="fw-bold mb-0">4.94</h3>
                <span className="text-muted ms-1">/5</span>
              </div>
              <div className="text-warning fs-5 mb-1">★★★★★</div>
              <p className="text-muted small">(1185 reviews)</p>

              <hr />
              <h6 className="fw-bold mb-3">Areas of expertise</h6>

              {expertise.map((item, i) => (
                <div key={i} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>{item.name}</span>
                    <span className="text-muted">{item.count}</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className="progress-bar bg-info"
                      role="progressbar"
                      style={{ width: `${(item.count / 754) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              <a href="#" className="d-block text-primary small mt-2">
                Show 38 more →
              </a>

              <div className="d-flex gap-3 mt-4">
                <button className="btn btn-outline-primary w-50">
                  <FaPhone className="me-2" /> Contact
                </button>
                <button className="btn btn-primary w-50">
                  <FaCalendarCheck className="me-2" /> Book
                </button>
              </div>
            </div>
          </div>
        </div>
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
            object-fit: cover;
          }
            .text-primary-light {
            color: #001f54; /* match the navy-blue icon color */
            opacity: 0.7;
          }

          .doctor-info-details p {
            font-family: "Poppins", sans-serif;
            font-size: 15px;
            color: #001f54;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
          }

          .doctor-info-details a {
            color: #001f54;
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


        .nav-tabs .nav-link.active {
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
    </>
  );
};

export default DoctorPageNewDetail;
