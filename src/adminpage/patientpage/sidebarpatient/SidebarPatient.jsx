import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/Logo.png";
import icon1 from "../../../assets/admin/d1.png";
import icon2 from "../../../assets/admin/d2.png";
import icon3 from "../../../assets/admin/pat1.png";
import icon4 from "../../../assets/admin/d4.png";
import icon5 from "../../../assets/admin/d5.png";
import icon6 from "../../../assets/admin/d6.png";
import icon7 from "../../../assets/admin/d7.png";
import icon8 from "../../../assets/admin/d8.png";
import icon9 from "../../../assets/admin/pl.png";
import icon10 from "../../../assets/admin/d10.png";
import icon11 from "../../../assets/admin/d11.png";
import hovericon from "../../../assets/admin/dh.png";
import hovericon1 from "../../../assets/admin/dh1.png";
import hovericon2 from "../../../assets/admin/pat.png";
import hovericon3 from "../../../assets/admin/Layer_1 (1).png";
import hovericon4 from "../../../assets/admin/dh4.png";
import hovericon5 from "../../../assets/admin/dh5.png";
import hovericon6 from "../../../assets/admin/dh6.png";
import hovericon7 from "../../../assets/admin/dh7.png";
import hovericon8 from "../../../assets/admin/dh8.png";
import hovericon9 from "../../../assets/admin/dh9.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Config from "../../../config";
import toast, { Toaster } from "react-hot-toast";
import icon12 from "../../../assets/images/tab4.png";
import icon13 from "../../../assets/images/tab5.png";
const SidebarPatient = () => {
  const menuItems = [
    {
      label: "Dashboard",
      to: "/dashboardpatient",
      icon: icon1,
      hoverIcon: hovericon,
    },
    // {
    //   label: "My Appointments",
    //   to: "/patient/appointments",
    //   icon: icon2,
    //   hoverIcon: hovericon1,
    // },
    {
      label: "My Doctors",
      to: "/patient/my-doctors",
      icon: icon3,
      hoverIcon: hovericon2,
    },
    {
      label: "Messages",
      to: "/patient/messages",
      icon: icon5,
      hoverIcon: hovericon4,
    },
    // {
    //   label: "Prescriptions",
    //   to: "/patient/prescriptions",
    //   icon: icon6,
    //   hoverIcon: hovericon5,
    // },
    {
      label: "Insurance Records",
      to: "/patient/insurance-records",
      icon: icon7,
      hoverIcon: hovericon6,
    },
    {
      label: "Payments/Invoices",
      to: "/patient/payments",
      icon: icon8,
      hoverIcon: hovericon3,
    },
    {
      label: "My Profile",
      to: "/patient/profile",
      icon: icon9,
      hoverIcon: hovericon7,
    },
    {
      label: "FAQs",
      to: "/patient/support",
      icon: icon10,
      hoverIcon: hovericon8,
    },
    {
      label: "T&C",
      to: "/patient/terms-and-conditions",
      icon: icon12,
      hoverIcon: icon12,
    },
    {
      label: "Privacy Policy",
      to: "/patient/privacy-policy",
      icon: icon13,
      hoverIcon: icon13,
    },
    { label: "Logout", action: true, icon: icon11, hoverIcon: hovericon9 }, // reuse any icon for logout
  ];

  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showToggle, setShowToggle] = useState(true);

  const toggleSidebar = () => setIsOpen(true);
  const closeSidebar = () => setIsOpen(false);

  // Lock scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  // Hide toggle on scroll down, show on scroll up
  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const current = window.scrollY;
      setShowToggle(current < lastScrollTop || current < 10);
      lastScrollTop = current <= 0 ? 0 : current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const LogoutAPI = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user.id) {
        // Post request to set is_online = 0
        await axios.post(`${Config.BASE_URL}/api/user/online-status`, {
          user_id: user.id,
          is_online: 0,
        });
        toast.success("Logout Success");

        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.clear();

        // Redirect to home page
        navigate("/");
      } else {
        console.warn("No user found in localStorage.");
      }
    } catch (error) {
      toast.error("Error logging out:", error);

      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <Toaster />

      {/* ☰ Toggle Button (visible on mobile only, hides on scroll down) */}
      {!isOpen && (
        <button
          className={`sidebar-toggle d-lg-none ${
            showToggle ? "visible" : "hidden"
          }`}
          onClick={toggleSidebar}
        >
          ☰
        </button>
      )}

      {/* Sidebar Container */}
      <div className={`sidebar-wrapper ${isOpen ? "open" : ""} d-lg-block`}>
        <div className="sidebar p-4">
          {/* ✕ Close Button (mobile only) */}
          <button className="close-btn d-lg-none" onClick={closeSidebar}>
            ✕
          </button>

          {/* Logo */}
          <div className="sidebar-logo mb-4 text-center">
            <img src={"/Logo.svg"} alt="Logo" className="img-fluid" />
          </div>

          {/* Navigation Links */}
          <ul className="nav flex-column p-4">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className="nav-item"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={item.action ? LogoutAPI : undefined}
              >
                {item.action ? (
                  <NavLink className="nav-link sidebar-link">
                    <img
                      src={hoveredIndex === index ? item.hoverIcon : item.icon}
                      alt="icon"
                      className="sidebar-icon"
                    />
                    {item.label}
                  </NavLink>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link sidebar-link ${isActive ? "active-link" : ""}`
                    }
                  >
                    <img
                      src={hoveredIndex === index ? item.hoverIcon : item.icon}
                      alt="icon"
                      className="sidebar-icon"
                    />
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Styles */}
      <style>{`
   
         .sidebar-toggle {
     position: fixed;
     top: 15px;        /* thoda niche */
     right: 15px;      /* right corner */
     z-index: 1050;    /* sidebar se upar dikhne ke liye */
     background: #4C6BE9;
     color: #fff;
     border: none;
     padding: 8px 12px;
     border-radius: 6px;
     font-size: 20px;
     cursor: pointer;
     transition: opacity 0.3s ease-in-out;
   }
     
   
   .sidebar-toggle.hidden {
     opacity: 0;
     pointer-events: none;
   }
   
   .sidebar-toggle.visible {
     opacity: 1;
   }
   
                   .sidebar {
     // min-height: 100vh;
     height:100%;
     background-color: #F7F9FC;
   }
   
   .sidebar-link {
     display: flex;
     align-items: center;
     padding: 10px 15px;
     border-radius: 30px;
     color: #333;
     font-weight: 500;
     margin-bottom: 5px;
     transition: background 0.2s ease-in-out;
   }
   
   .sidebar-link:hover {
     background-color: #4C6BE9;
     text-decoration: none;
     color: #fff;
     border-radius: 30px;
   }
   
   .sidebar-icon {
     width: 20px;
     height: 20px;
     margin-right: 20px;
   }
   
   /* Active link */
   .active-link {
     background-color: #4C6BE9 !important;
     color: #fff !important;
     border-radius: 30px;
   }
   
   .active-link img {
     filter: brightness(0) invert(1); /* white icon effect */
   }
   
   
           @media (max-width: 991px) {
           
           .close-btn {
     font-size:30px;
     }
             .sidebar-wrapper {
               position: fixed;
               top: 0;
               left: 0;
               width: 83%;
               max-width: 330px;
               height: 100vh;
               transform: translateX(-100%);
               z-index: 1040;
               overflow-y: auto;
             }
   
             .sidebar-wrapper.open {
               transform: translateX(0);
             }
           }
         `}</style>
    </>
  );
};

export default SidebarPatient;
