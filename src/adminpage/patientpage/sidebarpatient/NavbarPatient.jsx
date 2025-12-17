import React, { useEffect, useState } from "react";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import Config from "../../../config";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// import { FaBell, FaSearch } from "react-icons/fa";

const NavbarPatient = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user")); // Convert string to object
  console.log(userData);

  const [conversations, setConversations] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch notifications on mount and every 3 seconds instead of 5
  useEffect(() => {
    fetchUnreadMessages();
    const intervalId = setInterval(fetchUnreadMessages, 3000);
    return () => clearInterval(intervalId);
  }, []);

  const fetchUnreadMessages = async () => {
    try {
      const res = await axios.get(
        `${Config.BASE_URL}/api/notification/patient/${userData?.id}`
      );
      if (res.data.success) {
        setConversations(res.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch unread messages:", error);
    }
  };

  // Show popup and fetch latest notifications
  const handleNotificationClick = () => {
    setShowPopup(!showPopup);
    if (!showPopup) {
      fetchUnreadMessages();
    }
  };

  // Navigate based on alert type
  const handleNavigateByAlertType = (alertTypeId) => {
    switch (alertTypeId) {
      case "1":
        navigate("/patient/appointments");
        break;
      case "2":
        navigate("/patient/messages");
        break;
      case "3":
        navigate("/patient/appointments");
        break;
      case "4":
        navigate("/patient/my-doctors");
        break;
      case "5":
        navigate("/patient/prescriptions");
        break;
      case "6":
        navigate("/patient/payments");
        break;
      case "7":
        navigate("/patient/support");
        break;
      default:
        console.warn("Unknown alert type:", alertTypeId);
    }
  };

  // Mark a notification as read and remove it from state
  const ReadmoreAPI = async (id) => {
    try {
      await axios.post(
        `${Config.BASE_URL}/api/notification/mark-as-read/${id}`
      );
      setConversations((prev) => prev.filter((conv) => conv.id !== id));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  // Clear all notifications
  const clearAllNotifications = async () => {
    const ids = conversations.map((conv) => conv.id);

    try {
      await Promise.all(
        ids.map((id) =>
          axios.post(`${Config.BASE_URL}/api/notification/mark-as-read/${id}`)
        )
      );
      setConversations([]);
      setShowPopup(!showPopup);
      // Optimistically clear the UI
    } catch (error) {
      console.error("Error clearing all notifications:", error);
      // Optionally refetch or restore the state here
    }
  };

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    role: "",

    profile_image: "",
    // actual File object
  });
  useEffect(() => {
    fetchPersonalInfo();
  }, []);
  const fetchPersonalInfo = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/profile/${userData.id}`
      );
      const data = response.data;
      setFormData({
        firstname: data.firstname || "",
        lastname: data.lastname || "",
        role: data.role || "",

        profile_image: data.profile_image || "",
      });
    } catch (error) {
      console.error("Error fetching info", error);
    }
  };

  const LogoutAPI = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user && user.id) {
        // Post request to set is_online = 0
        await axios.post(`${Config.BASE_URL}/api/user/online-status`, {
          user_id: user.id,
          is_online: 0,
        });

        // Clear localStorage
        localStorage.removeItem("user");
        localStorage.clear();

        // Redirect to home page
        navigate("/");
      } else {
        console.warn("No user found in localStorage.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // const [appointments, setAppointments] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [query, setQuery] = useState("");
  // const [filteredUsers, setFilteredUsers] = useState([]);

  // useEffect(() => {
  //   fetchAppointments();
  // }, []);

  // const fetchAppointments = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.get(`${Config.BASE_URL}/api/appointments/index`, {
  //       params: { user_id: userData?.id }, // make sure DoctorID is passed correctly
  //     });

  //     if (res.data.success) {
  //       // ✅ filter appointments by slots
  //       const filtered = res.data.appointments.filter((apt) => {
  //         if (!apt.slots || apt.slots.length === 0) return false;

  //         // check if any slot inside matches condition
  //         return apt.slots.some(
  //           (slot) => slot.isBook === 1 && slot.isConsultCompleted === 1
  //         );
  //       });

  //       setAppointments(filtered);
  //       console.log(filtered, "filtered appointments");
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch appointments:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // 🔎 filter when typing
  // const handleSearch = (e) => {
  //   const value = e.target.value;
  //   setQuery(value);

  //   if (value.trim() === "") {
  //     setFilteredUsers([]);
  //     return;
  //   }

  //   const filtered = appointments.filter((apt) =>
  //     `${apt.doctor?.firstname} ${apt.doctor?.lastname}`
  //       .toLowerCase()
  //       .includes(value.toLowerCase())
  //   );

  //   setFilteredUsers(filtered);
  // };

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${Config.BASE_URL}/api/appointments/index`, {
        params: { user_id: userData?.id },
      });

      if (res.data.success) {
        const filtered = res.data.appointments.filter((apt) => {
          if (!apt.slots || apt.slots.length === 0) return false;
          return apt.slots.some(
            (slot) => slot.isBook === 1 && slot.isConsultCompleted === 1
          );
        });

        setAppointments(filtered);
        console.log(filtered, "filtered appointments");
      }
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ debounce search for smooth UX
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() === "") {
        setFilteredUsers([]);
        return;
      }

      // 🔍 search by doctor name (change to patient if needed)
      const filtered = appointments.filter((apt) =>
        `${apt.doctor?.firstname} ${apt.doctor?.lastname}`
          .toLowerCase()
          .includes(query.toLowerCase())
      );

      setFilteredUsers(filtered);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, appointments]);

  //  close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setQuery("");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSearch = (e) => setQuery(e.target.value);
  return (
    <>
      <nav className="navbar navbar-expand-md bgcolor justify-content-between px-4 py-3">
        {/* <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#sidebar"
          aria-controls="sidebar"
          aria-expanded="false"
          aria-label="Toggle sidebar"
        >
          <span className="navbar-toggler-icon"></span>
        </button> */}
        {/* Left Section: Profile and Welcome Text */}
        <div className="d-flex align-items-center">
          <img
            src={
              formData.profile_image
                ? `${Config.BASE_URL}/${formData.profile_image}`
                : formData.gender === "Female"
                ? female
                : male
            }
            alt="profile"
            className="profile-img mr-3"
          />

          <div>
            <div className="welcome-text font-weight-bold">Welcome</div>
            <div className="username">
              {formData.firstname.charAt(0).toUpperCase() +
                formData.firstname.slice(1)}{" "}
              ({formData.role.charAt(0).toUpperCase() + formData.role.slice(1)})
            </div>
          </div>
        </div>

        {/* Right Section: Search, Bell, Account */}
        <div className="d-flex align-items-center">
          {/* <div
            className="search-container mr-3"
            style={{ position: "relative" }}
          >
            <div className="input-group search-box mr-3">
              <input
                type="text"
                className="form-control custom-placeholder"
                placeholder="Search patient..."
                value={query}
                onChange={handleSearch}
              />
              <div className="input-group-append">
                <button className="btn search-btn" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

          
            {query && filteredUsers.length > 0 && (
              <ul
                className="list-group"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 10,
                }}
              >
                {filteredUsers.map((apt) => (
                  <li key={apt.id} className="list-group-item">
                    {apt.doctor?.firstname} {apt.doctor?.lastname}
                  </li>
                ))}
              </ul>
            )}

           
            {query && filteredUsers.length === 0 && (
              <div
                className="list-group-item text-muted"
                style={{ position: "absolute", top: "100%", left: 0, right: 0 }}
              >
                No doctor found
              </div>
            )}
          </div> */}

          {/* <div
            className="search-container mr-3"
            style={{ position: "relative" }}
          >
            <div className="input-group search-box mr-3">
              <input
                type="text"
                className="form-control custom-placeholder"
                placeholder="Search doctor..."
                value={query}
                onChange={handleSearch}
              />
              <div className="input-group-append">
                <button className="btn search-btn" type="button">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>

            
            {query && filteredUsers.length > 0 && (
              <ul
                className="list-group"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  cursor: "pointer",
                  background: "white",
                }}
              >
                {filteredUsers.map((apt) => (
                  <li
                    key={apt.id}
                    className="list-group-item"
                    onClick={() => {
                      navigate(`/doctordetails/${apt.doctor?.id}`);
                      console.log("Selected:", apt);
                    }}
                  >
                    {apt.doctor?.firstname} {apt.doctor?.lastname}
                  </li>
                ))}
              </ul>
            )}

            {query && !loading && filteredUsers.length === 0 && (
              <div
                className="list-group-item text-muted"
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 1000,
                  background: "white",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                No doctor found
              </div>
            )}
          </div> */}

          <div className="position-relative d-inline-block">
            <button
              className="btn btn-icon mr-3 position-relative"
              onClick={handleNotificationClick}
            >
              <i className="fas fa-bell text-white"></i>
              {conversations.length > 0 && (
                <span className="notification-dot"></span>
              )}
            </button>

            {showPopup && (
              <div className="notification-popup shadow">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="fw-bold mb-0">Notification</h6>
                  <button
                    className="btn btn-sm text-primary p-0"
                    onClick={clearAllNotifications}
                  >
                    Clear all
                  </button>
                </div>

                <div className="notification-scroll">
                  {conversations.length === 0 ? (
                    <p className="text-muted">No notifications</p>
                  ) : (
                    conversations.map((conv, idx) => (
                      <div
                        key={conv.id}
                        className="notification-card"
                        onClick={() => {
                          handleNavigateByAlertType(conv.alert_type_id);
                          ReadmoreAPI(conv.id);
                        }}
                      >
                        <div className="d-flex align-items-start">
                          <div className="notification-icon me-2"></div>
                          <div>
                            <div className="text-muted small p-2">
                              {conv.message || "Some description goes here."}
                            </div>
                            {conv?.buttonText && (
                              <button className="btn btn-sm btn-light mt-2">
                                {conv.buttonText}
                              </button>
                            )}
                          </div>
                        </div>
                        <button
                          className="btn btn-sm close-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            ReadmoreAPI(conv.id);
                          }}
                        >
                          <i className="fas fa-times text-muted"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Account Button */}
          <div className="dropdown">
            <button
              className="btn btn-primary rounded-pill px-4 dropdown-toggle"
              type="button"
              id="accountDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              My Account
            </button>
            <div
              className="dropdown-menu dropdown-menu-right"
              aria-labelledby="accountDropdown"
            >
              <Link className="dropdown-item" to="/patient/profile">
                <i className="fas fa-user-circle mr-2"></i> My Profile
              </Link>
              <a className="dropdown-item" onClick={LogoutAPI}>
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </a>
              <a
                className="dropdown-item"
                onClick={() => {
                  navigate("/");
                }}
              >
                <i className="fas fa-home mr-2"></i> Website
              </a>
            </div>
          </div>
        </div>
      </nav>

      <style>{`

      .notification-popup {
  position: absolute;
  top: 120%;
  right: 0;
  width: 320px;
  background-color: #fff;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #ddd;
  z-index: 999;
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.notification-scroll {
  overflow-y: auto;
  max-height: 300px;
  padding-right: 6px;
}

.notification-dot {
  position: absolute;
  top: 0;
  right: 0;
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  border: 2px solid white;
}

.notification-card {
  position: relative;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 12px;
  transition: background 0.2s;
}

.notification-card:hover {
  background-color: #f1f1f1;
}

.notification-icon i {
  font-size: 18px;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 5px;
  background: none;
  border: none;
  font-size: 14px;
}

        .bgcolor {
          background-color: #F7F9FC;
        }

        .profile-img {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          object-fit: cover;
        }

        .search-box input {
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          border-right: none;
        }

        .search-btn {
          background-color: #2ee0b1;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }

        .btn-icon {
          background-color: #4C6BE9;
          border-radius: 10px;
          padding: 0.4rem 0.8rem;
          border: none;
        }
.btn-icon:hover{
          background-color: #4C6BE9;
      }
        .welcome-text {
          font-size: 14px;
        }

        .username {
          font-size: 13px;
          color: #555;
        }
* Small devices (up to 576px) */
@media (max-width: 576px) {
  .notification-popup {
    width: 90vw;
    right: 5%;
    top: 100%;
    padding: 12px;
    max-height: 50vh;
  }

  .notification-scroll {
    max-height: 60vh;
    padding-right: 4px;
  }

  .notification-card {
    padding: 10px 12px;
    font-size: 14px;
  }

  .notification-icon i {
    font-size: 16px;
  }

  .close-btn {
    font-size: 25px;
    // margin-left:-10px;
  }
}
        @media (max-width: 768px) {
          .search-box {
            width: 100px;
          }

          .navbar {
            flex-direction: column;
            align-items: flex-start;
          }

          .navbar > .d-flex {
            margin-top: 10px;
          }
        }
      `}</style>
    </>
  );
};

export default NavbarPatient;
