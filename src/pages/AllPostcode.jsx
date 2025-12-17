import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import bgImage from "../assets/images/Background.png";
import innerpage from "../assets/images/Inner page header.png";
import sectionbg from "../assets/images/Mask group (1).png";
import searchicon from "../assets/images/searchicon.png";
import locationicon from "../assets/images/locationicon.png";
import filter from "../assets/images/filterrestart.png";
import doctor from "../assets/images/doctor.png";
import doctor1 from "../assets/images/doctor1.png";
import userImage from "../assets/images/21104.png";
import male from "../assets/images/male.png";
import female from "../assets/images/Female.png";
import video from "../assets/images/zoom.png";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";
import Config from "../config";

const AllPostcode = () => {
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
              backgroundPosition: "top",
              minHeight: "100%",
            }}
          >
            <h1 className="headingtext">
              Find Local Hospitals &nbsp;
              <br />
              You Can Trust
            </h1>
            <p>
              <span className="highlight-number">10k+</span> Hospitals
              <img scr={sectionbg} />
            </p>

            <div className="search-box">
              <div className="search-input-group">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search by Dr. Name ,Specialization & Services"
                />

                <button className="search-button">
                  <img src={searchicon} alt="Search" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mt-4 mb-3">
          <h4 className="text-center"> No Data Available </h4>
        </div>

        <Footer />
      </div>

      <style>
        {`
  



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
        .doctor-card {
  background-color: #fff;
  border-radius: 16px;
}

.doctor-stats{
  background-color: #F7F9FC;
  border-radius: 16px;


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
 .doctor-img{
        width:100px;
        height:120px;

        }
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

export default AllPostcode;
