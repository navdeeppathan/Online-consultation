import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import sectionbg from "../assets/images/Mask group (1).png";
import innerpage from "../assets/images/Inner page header.png";

import Footer from "../components/Footer";
import aboutimaage from "../assets/images/Group (2).png";
import comingsoon from "../assets/images/comingsoon.jpg";
import banner1 from "../assets/images/banner1.png";
import banner2 from "../assets/images/banner2.png";
import banner3 from "../assets/images/banner3.png";
import { useState } from "react";
import toast from "react-hot-toast";

function Blog() {
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

        {/* <div className="container mt-4">
          <h1 className="col-12">Blogs</h1>
          <div className="row">
            <div className="col-12 col-lg-6 mt-5 mb-5  p-5 mt-lg-0">
              <p className="mt-3">
                Explore YoDoc’s wide range of medical categories, designed to
                make healthcare simple and accessible. Whether you need general
                health check-ups, support for chronic conditions, or specialist
                advice in women’s, men’s, or children’s health, our qualified
                doctors are here to help. We also cover mental health,
                dermatology, sexual health, cardiology, respiratory care,
                orthopaedics, and more. With online consultations, you can get
                expert advice, prescriptions, and follow-ups from the comfort of
                your home. YoDoc brings trusted healthcare to your fingertips,
                ensuring timely, convenient, and professional care for you and
                your family—anytime, anywhere
              </p>
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

        <NewsSection />

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

// replace with your actual image

const NewsSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    // Replace this with your API call if needed
    console.log("Subscribed with:", email);

    toast.success("Thank you for subscribing!");
    setEmail(""); // clear input
  };
  return (
    <>
      <div className="container my-5">
        <div className="row">
          {/* Left Blog Section */}
          <div className="col-lg-8">
            <div className="row">
              {/* First News Card */}
              <div className="col-md-6 mb-4">
                <div className="news-card">
                  <img src={banner1} alt="news1" className="img-fluid" />
                  <h4 className="mt-3 news-title">
                    Yodoc’s Doctor’s Day Campaign Asks – Who is a doctor?
                  </h4>
                  <p className="news-text">
                    This Doctor’s Day, Yodoc celebrates the dedication and
                    compassion of doctors by asking a simple but powerful
                    question – “Who is a doctor?” Through this campaign, Yodoc
                    highlights not only the medical expertise of doctors, but
                    also their role as guides, listeners, and everyday heroes
                    who bring comfort and care to patients in moments of need.
                    The initiative aims to remind communities that doctors are
                    more than their profession – they are mentors, healers, and
                    trusted partners in health, committed to improving lives
                    both inside and outside the clinic.
                  </p>
                </div>
              </div>

              {/* Second News Card */}
              <div className="col-md-6 mb-4">
                <div className="news-card">
                  <img src={banner2} alt="news2" className="img-fluid" />
                  <h4 className="mt-3 news-title">
                    Yodoc.com Launches in UK; on track to 20% of UK using the
                    platform on an annual basis
                  </h4>
                  <p className="news-text">
                    Yodoc.com, the leading online doctor consultation platform,
                    has officially launched in the UK. Since its rollout, the
                    platform has seen rapid adoption and is already on track to
                    reach 20% of the UK population on an annual basis. Offering
                    secure video and chat consultations with certified doctors,
                    Yodoc provides a faster, more convenient alternative to
                    traditional GP visits. The service aims to reduce wait
                    times, improve access to healthcare, and deliver
                    professional medical advice, prescriptions, and follow-ups
                    directly to patients’ homes across the country.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="col-lg-4">
            <div className="sidebar-box mb-4">
              <h6 className="fw-bold">FOR MEDIA QUERIES PLEASE CONTACT</h6>
              <a href="yodoc@gmail.com">yodoc@gmail.com</a>
            </div>

            <div className="sidebar-box mb-4">
              <h6 className="fw-bold">SUBSCRIBE TO YODOC BLOG</h6>
              <p>
                Want to know how Yodoc, through digital healthcare is changing
                millions of lives? Subscribe here:
              </p>
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="abc@xyz.com"
                  className="form-control mb-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-dark w-100">
                  SUBSCRIBE NOW
                </button>
              </form>
            </div>

            {/* <div className="sidebar-box">
              <a href="#" className="text-muted">
                FOLLOW US ON FB
              </a>
            </div> */}
          </div>
        </div>
      </div>
      <style>
        {`
        .news-card img {
  border-radius: 5px;
}

.news-title {
  font-family: "Georgia", serif;
  font-weight: 600;
  font-size: 20px;
  line-height: 1.3;
  color: #111;
}

.news-text {
  font-size: 15px;
  color: #444;
}

.share-btns button {
  border-radius: 20px;
  font-size: 13px;
}

.sidebar-box {
  background: #f7f9f9;
  padding: 20px;
  border-radius: 5px;
}

.sidebar-box h6 {
  margin-bottom: 10px;
  color: #333;
  font-size: 14px;
}

.sidebar-box a {
  color: #2c8dd6;
  text-decoration: none;
  font-weight: 500;
}
`}
      </style>
    </>
  );
};
export default Blog;
