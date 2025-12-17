import React, { useEffect, useRef, useState } from "react";

import explorer from "../../../assets/admin/111115_attachment_icon 1.png";
import sender from "../../../assets/admin/Layer_1.png";
import messagesender from "../../../assets/admin/Ellipse 2391.png";
import messagercv from "../../../assets/admin/Ellipse 2392.png";
import searchImg from "../../../assets/admin/Vector.png";
import penicon from "../../../assets/admin/8530613_edit_icon 1.png";
import male from "../../../assets/images/male.png";
import female from "../../../assets/images/Female2.png";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarPatient from "../sidebarpatient/SidebarPatient";
import NavbarPatient from "../sidebarpatient/NavbarPatient";
import axios from "axios";
import Config from "../../../config";
import { useNavigate } from "react-router-dom";

const MessagesPatient = () => {
  const navigate = useNavigate();
  const [additionalInfo, setAdditionalInfo] = useState({});

  const userData = JSON.parse(localStorage.getItem("user"));
  const patientID = userData?.id;
  const [patientimage, setPatientImage] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  const intervalRef = useRef(null);

  // Run when DoctorID and selectedPatientId are set
  useEffect(() => {
    // Ensure both IDs are available
    if (patientID && selectedDoctor) {
      // Immediately fetch on load
      DoctorIDGet(selectedDoctor, selectedPatientId);

      // Clear any previous interval
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Setup 5 second polling
      intervalRef.current = setInterval(() => {
        DoctorIDGet(selectedDoctor, selectedPatientId);
      }, 5000);
    }

    // Clear interval on unmount or when IDs change
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [patientID, selectedDoctor]);
  useEffect(() => {
    fetchAppointments();
    fetchPersonalInfo();
    fetchUnreadMessages();
  }, []);

  const fetchPersonalInfo = async () => {
    try {
      const response = await axios.get(
        `${Config.BASE_URL}/api/profile/${userData.id}`
      );
      const data = response.data;
      setPatientImage(data);
    } catch (error) {
      console.error("Error fetching info", error);
    }
  };

  const fetchAppointments = async () => {
    const payload = { user_id: patientID };
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/appointments`, {
        params: payload,
      });
      const filteredAppointments = res.data.appointments;
      console.log("alldoctormessage", filteredAppointments);
      setDoctors(filteredAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const res = await axios.post(
        `${Config.BASE_URL}/api/chat/conversations`,
        {
          user_id: patientID,
        }
      );

      if (res.data.success) {
        const counts = {};
        res.data.conversations.forEach((c) => {
          counts[c.user.id] = c.unread_count;
        });
        setUnreadCounts(counts);
      }
    } catch (error) {
      console.error("Failed to fetch unread messages:", error);
    }
  };
  //   const fetchAdditionalInfo = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${Config.BASE_URL}/api/profile/${userData.id}`
  //       );

  //       const data = response.data;
  //       console.log(data, "responseresponse");

  //       // Set to state (optional if you want to display it)
  //       setAdditionalInfo(data);
  // // firstname: data.firstname || "",
  // //         lastname: data.lastname || "",
  // //         mobile_number: data.mobile_number || "",
  // //         email: data.email || "",
  // //         address: data.address || "",
  // //         profile_image: data.profile_image || "",
  // //         gender: data.gender || "",
  // //         country: data.country || "",
  // //         postcode: data.postcode || "",
  // //         nationality: data.nationality || "",
  // //         date_of_birth: data.date_of_birth || "",
  //       // Check if any required field is missing/null/empty
  //       if (
  //         !data ||
  //         !data.firstname ||
  //         !data.lastname ||
  //         !data.mobile_number ||
  //         !data.email ||
  //         !data.profile_image ||
  //         !data.gender ||
  //         !data.country ||
  //         !data.postcode ||
  //         !data.nationality ||
  //         !data.date_of_birth

  //       ) {
  //         // Redirect to profile page
  //         navigate("/patient/profile");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching additional info", error);
  //       // Redirect on error as fallback
  //       // navigate("/patient/profile");
  //     }
  //   };

  useEffect(() => {
    if (userData?.id) {
      // fetchAdditionalInfo();
    }
  }, [userData]);
  console.error("unreadCounts:", unreadCounts);

  // ✅ Filter only one enunreadCountstry per doctor (unique doc_id)
  const getUniqueDoctors = (appointments) => {
    const seen = new Set();
    return appointments.filter((appt) => {
      if (!seen.has(appt.doc_id)) {
        seen.add(appt.doc_id);
        return true;
      }
      return false;
    });
  };

  const uniqueDoctors = getUniqueDoctors(doctors);

  const filteredDoctors = uniqueDoctors.filter((item) => {
    const fullName =
      `${item.doctor?.firstname} ${item.doctor?.lastname}`.toLowerCase();
    return fullName.includes(searchText.toLowerCase());
  });

  const DoctorIDGet = async (doc_id, doctorInfo) => {
    ReadmessageDr(doc_id);
    try {
      const payload = {
        user_1: doc_id,
        user_2: patientID,
      };
      const res = await axios.post(
        `${Config.BASE_URL}/api/chat/fetch`,
        payload
      );
      if (res.data.success) {
        setMessages(res.data.messages);
        setSelectedDoctor(doctorInfo);
        setSelectedPatientId(doc_id);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const ReadmessageDr = async (doc_id) => {
    try {
      const payload = {
        sender_id: doc_id,
        receiver_id: patientID,
      };
      const res = await axios.post(
        `${Config.BASE_URL}/api/chat/mark-as-read`,
        payload
      );
      if (res.data.success) {
        fetchUnreadMessages();

        console.error("res.data.success", res.data.success);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  const DoctorMessageSend = async () => {
    if (!messageInput.trim() || !selectedDoctor) return;

    try {
      const payload = {
        sender_id: patientID,
        receiver_id: selectedDoctor.id,
        message: messageInput,
      };

      const res = await axios.post(`${Config.BASE_URL}/api/chat/send`, payload);

      if (res.data.success) {
        // Add new message with patientID to match display condition
        const newMessage = {
          ...payload,
          sender_id: String(patientID), // ensure string match for comparison
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessageInput(""); // clear input
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <div className="d-flex">
        <SidebarPatient />

        <div className="flex-grow-1 content-area">
          <NavbarPatient />

          <div
            className="container-fluid roundend p-3 pt-0"
            style={{ backgroundColor: "#F7F9FC", minHeight: "100vh" }}
          >
            <h5
              className="mb-1  pb-2 fw-bold"
              style={{
                fontSize: "24px",
                fontWeight: "400",
                lineHeight: "42px",
                color: "#4A4A4A",
              }}
            >
              Messages
            </h5>

            <div className="row g-3">
              {/* Chat Section */}
              <div className="col-lg-8  mb-3">
                <div
                  className="bg-white rounded p-2 d-flex flex-column"
                  style={{ height: "600px" }}
                >
                  {/* Header */}
                  <div
                    className="d-flex align-items-center border rounded mb-3 p-3"
                    style={{ backgroundColor: "rgba(224, 234, 243, 1)" }}
                  >
                    <h6 className="mb-0">
                      {selectedDoctor
                        ? ` ${selectedDoctor.firstname} ${selectedDoctor.lastname}`
                        : "Select a Doctor"}
                    </h6>
                  </div>

                  {/* Messages */}
                  <div className="flex-grow-1 mb-3 overflow-auto px-2">
                    {messages.length === 0 ? (
                      <p className="text-muted text-center mt-5">
                        No messages yet
                      </p>
                    ) : (
                      messages.map((msg, idx) => (
                        <div key={idx}>
                          {msg.sender_id === String(patientID) ? (
                            // Right side - Patient (sender)
                            <div className="d-flex align-items-start justify-content-end mb-3">
                              <div className="bg-light text-dark p-2 rounded">
                                <p className="mb-0">{msg.message}</p>
                              </div>
                              <img
                                src={`${Config.BASE_URL}/${patientimage.profile_image}`}
                                alt="Sender"
                                className="rounded-circle ms-2"
                                style={{ width: "40px", height: "40px" }}
                              />
                            </div>
                          ) : (
                            // Left side - Doctor (receiver)
                            <div className="d-flex align-items-start mb-3">
                              <img
                                src={`${Config.BASE_URL}/${selectedDoctor.profile_image}`}
                                alt="Receiver"
                                className="rounded-circle me-2"
                                style={{ width: "40px", height: "40px" }}
                              />
                              <div className="bg-light p-2 rounded">
                                <p className="mb-0">{msg.message}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  {/* <div className="d-flex align-items-center border rounded p-2 bg-white">
                    <img
                      src={explorer}
                      alt="Attachment"
                      className="me-2"
                      style={{ width: "22px", height: "22px" }}
                    />
                    <input
                      type="text"
                      className="form-control border-0 flex-grow-1"
                      placeholder="Your Message"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && DoctorMessageSend()
                      }
                      disabled={!selectedDoctor}
                    />
                    <img
                      src={sender}
                      alt="Send"
                      className="ms-2"
                      onClick={DoctorMessageSend}
                      style={{ width: "20px", cursor: "pointer" }}
                    />
                  </div> */}
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-12 col-lg-4 mb-3">
                <div
                  className="bg-white rounded p-3"
                  style={{ height: "600px", overflowY: "auto" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Chats</span>
                    <img
                      src={penicon}
                      alt="Search"
                      style={{
                        width: "16px",
                        height: "14px",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  <div className="position-relative w-100 mt-4 mb-4">
                    <input
                      type="text"
                      placeholder="Search"
                      className="form-control  text-black pe-5 rounded"
                      style={{ backgroundColor: "rgb(224, 234, 243)" }}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                    <img
                      src={searchImg}
                      alt="icon"
                      className="position-absolute"
                      style={{
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "11px",
                        height: "11px",
                        cursor: "pointer",
                      }}
                    />
                  </div>

                  {filteredDoctors.map((item, index) => (
                    <div
                      key={index}
                      className="d-flex flex-row align-items-start rounded p-2 mt-2 cursor-pointer"
                      style={{
                        backgroundColor:
                          selectedDoctorId === item.doc_id
                            ? "rgba(224, 234, 243, 1)" // Active
                            : "#ffffff", // Inactive
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        DoctorIDGet(item.doc_id, item.doctor);
                        setSelectedDoctorId(item.doc_id);
                      }}
                    >
                      {/* ✅ Add position-relative to allow dot positioning */}
                      <div className="me-3 position-relative">
                        <img
                          src={
                            item.doctor?.profile_image
                              ? `${Config.BASE_URL}/${item.doctor.profile_image}`
                              : // : messagercv
                              item.doctor?.gender === "Female"
                              ? female
                              : male
                          }
                          alt="profile"
                          className="img-fluid rounded-circle"
                          style={{ width: "40px", height: "40px" }}
                        />
                        {/* ✅ Only show if doctor has unread messages */}
                        {item.doctor?.is_online === "1" && (
                          <span
                            className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-white rounded-circle"
                            style={{ width: "10px", height: "10px" }}
                          ></span>
                        )}
                      </div>

                      <div className="d-flex flex-column">
                        <span className="fw-bold small">
                          {item.doctor?.firstname} {item.doctor?.lastname}
                        </span>
                        <span className="text-muted small">Active now</span>
                      </div>
                      <div className="ms-auto text-end text-muted">
                        {unreadCounts[item.doc_id] > 0 ? (
                          <span className="small text-danger">
                            {unreadCounts[item.user_id]} Message
                            {unreadCounts[item.doc_id] > 1 ? "s" : ""}
                          </span>
                        ) : (
                          <span className="small">No Messages</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inline CSS */}
      <style>
        {`
          .profile-card {
            background-color: #fff;
            border-radius: 16px;
          }

          .section-heading {
            border-bottom: 2px solid #eee;
            padding-bottom: 6px;
            margin-bottom: 20px;
            color: #333;
          }
        `}
      </style>
    </>
  );
};

export default MessagesPatient;
