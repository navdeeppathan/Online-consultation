import React, { useEffect, useState, useRef } from "react";

import explorer from "../../../assets/admin/111115_attachment_icon 1.png";
import sender from "../../../assets/admin/Layer_1.png";
import messagesender from "../../../assets/admin/Ellipse 2391.png";
import messagercv from "../../../assets/admin/Ellipse 2392.png";
import searchImg from "../../../assets/admin/Vector.png";
import penicon from "../../../assets/admin/8530613_edit_icon 1.png";

import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import Config from "../../../config";
import axios from "axios";

const Messges = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const DoctorID = userData?.id;

  const [patientImage, setPatientImage] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  const intervalRef = useRef(null);

  // Run when DoctorID and selectedPatientId are set
  useEffect(() => {
    // Ensure both IDs are available
    if (DoctorID && selectedPatientId) {
      // Immediately fetch on load
      fetchMessages(selectedPatientId, selectedPatient);

      // Clear any previous interval
      if (intervalRef.current) clearInterval(intervalRef.current);

      // Setup 5 second polling
      intervalRef.current = setInterval(() => {
        fetchMessages(selectedPatientId, selectedPatient);
      }, 5000);
    }

    // Clear interval on unmount or when IDs change
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [DoctorID, selectedPatientId]); // dependencies

  useEffect(() => {
    fetchAppointments();
    fetchDoctorInfo();
    fetchUnreadMessages();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/profile/${DoctorID}`);
      setPatientImage(res.data); // doctor image
    } catch (err) {
      console.error("Doctor profile fetch failed:", err);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const res = await axios.post(
        `${Config.BASE_URL}/api/chat/conversations`,
        {
          user_id: DoctorID,
        }
      );

      console.log(res.data, "doctor conversations");

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

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/appointments`, {
        params: { doc_id: DoctorID },
      });
      setAppointments(res.data.appointments);
      console.error("res.data.appointments", res.data.appointments);
    } catch (err) {
      console.error("Appointments fetch failed:", err);
    }
  };

  // ✅ Filter only one entry per doctor (unique doc_id)
  const getUniquePatients = (appointments) => {
    const seen = new Set();
    return appointments.filter((appt) => {
      if (!seen.has(appt.user_id)) {
        seen.add(appt.user_id);
        return true;
      }
      return false;
    });
  };

  const uniquePatients = getUniquePatients(appointments);
  const filteredPatients = uniquePatients.filter((item) => {
    const name = `${item.user?.firstname || ""} ${
      item.user?.lastname || ""
    }`.toLowerCase();
    return name.includes(searchText.toLowerCase());
  });

  console.log("filteredPatients", uniquePatients);

  const fetchMessages = async (user_id, patientInfo) => {
    ReadmessageP(user_id);
    try {
      const payload = { user_1: DoctorID, user_2: user_id };
      const res = await axios.post(
        `${Config.BASE_URL}/api/chat/fetch`,
        payload
      );

      if (res.data.success) {
        setMessages(res.data.messages);
        setSelectedPatient(patientInfo);
        setSelectedPatientId(user_id);
      }
    } catch (err) {
      console.error("Chat fetch failed:", err);
    }
  };

  const ReadmessageP = async (user_id) => {
    try {
      const payload = {
        sender_id: user_id,
        receiver_id: DoctorID,
      };
      const res = await axios.post(
        `${Config.BASE_URL}/api/chat/mark-as-read`,
        payload
      );
      fetchUnreadMessages();
      if (res.data.success) {
        console.error("res.data.success", res.data.success);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedPatient) return;

    const payload = {
      sender_id: DoctorID,
      receiver_id: selectedPatient.id,
      message: messageInput,
    };

    try {
      const res = await axios.post(`${Config.BASE_URL}/api/chat/send`, payload);
      if (res.data.success) {
        const newMessage = {
          ...payload,
          sender_id: String(DoctorID),
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setMessageInput("");
      }
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  console.log("unreadCounts", unreadCounts);

  return (
    <>
      <div className="d-flex">
        <Sidebar />

        <div className="flex-grow-1 content-area">
          <Navbar />

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
              <div className="col-lg-8 mb-3">
                <div
                  className="bg-white rounded p-2 d-flex flex-column"
                  style={{ height: "600px" }}
                >
                  <div
                    className="d-flex align-items-center border rounded mb-3 p-3"
                    style={{ backgroundColor: "rgba(224, 234, 243, 1)" }}
                  >
                    <h6 className="mb-0">
                      {selectedPatient
                        ? `${selectedPatient.firstname} ${selectedPatient.lastname}`
                        : "Select a Patient"}
                    </h6>
                  </div>

                  <div className="flex-grow-1 mb-3 overflow-auto px-2">
                    {messages.length === 0 ? (
                      <p className="text-muted text-center mt-5">
                        No messages yet
                      </p>
                    ) : (
                      messages.map((msg, idx) => (
                        <div key={idx}>
                          {msg.sender_id === String(DoctorID) ? (
                            <div className="d-flex align-items-start justify-content-end mb-3">
                              <div className="bg-light text-dark p-2 rounded">
                                <p className="mb-0">{msg.message}</p>
                              </div>
                              <img
                                src={`${Config.BASE_URL}/${patientImage.profile_image}`}
                                alt="Sender"
                                className="rounded-circle ms-2"
                                style={{ width: "40px", height: "40px" }}
                              />
                            </div>
                          ) : (
                            <div className="d-flex align-items-start mb-3">
                              <img
                                src={`${Config.BASE_URL}/${selectedPatient.profile_image}`}
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

                  <div className="d-flex align-items-center border rounded p-2 bg-white">
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
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      disabled={!selectedPatient}
                    />
                    <img
                      src={sender}
                      alt="Send"
                      className="ms-2"
                      onClick={sendMessage}
                      style={{ width: "20px", cursor: "pointer" }}
                    />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-12 col-lg-4 mb-3">
                <div
                  className="bg-white rounded p-3"
                  style={{ height: "600px", overflowY: "auto" }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Messages</span>
                  </div>

                  <div className="position-relative w-100 mt-4 mb-4">
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="form-control text-black pe-5 rounded"
                      style={{ backgroundColor: "rgb(224, 234, 243)" }}
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

                  {filteredPatients.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => fetchMessages(item.user_id, item.user)}
                      className="d-flex align-items-start rounded p-2 mt-2"
                      style={{
                        backgroundColor:
                          selectedPatientId === item.user_id
                            ? "rgba(224, 234, 243, 1)"
                            : "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <div className="me-3 position-relative">
                        <img
                          src={
                            item.doctor?.profile_image
                              ? `${Config.BASE_URL}/${item.doctor.profile_image}`
                              : messagercv
                          }
                          alt="profile"
                          className="img-fluid rounded-circle"
                          style={{ width: "40px", height: "40px" }}
                        />
                        {/*  Only show if doctor has unread messages */}
                        {item.user?.is_online === "1" && (
                          <span
                            className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-white rounded-circle"
                            style={{ width: "10px", height: "10px" }}
                          ></span>
                        )}
                      </div>
                      <div className="d-flex flex-column">
                        <span className="fw-bold small">
                          {item.user?.firstname} {item.user?.lastname}
                        </span>
                        <span className="text-muted small">Active now</span>
                      </div>
                      <div className="ms-auto text-end text-muted">
                        {unreadCounts[item.user_id] > 0 ? (
                          <span className="small text-danger">
                            {unreadCounts[item.user_id]} Message
                            {unreadCounts[item.user_id] > 1 ? "s" : ""}
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
            <h6>Copyright © 2025 Yodoc UK All Rights Reserved.</h6>
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

export default Messges;
