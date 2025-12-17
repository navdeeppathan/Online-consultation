import React, { useEffect, useState, useRef } from "react";

import explorer from "../../assets/admin/111115_attachment_icon 1.png";
import sender from "../../assets/admin/Layer_1.png";
import messagesender from "../../assets/admin/Ellipse 2391.png";
import messagercv from "../../assets/admin/Ellipse 2392.png";
import searchImg from "../../assets/admin/Vector.png";
import penicon from "../../assets/admin/8530613_edit_icon 1.png";

import "bootstrap/dist/css/bootstrap.min.css";

import Config from "../../config";
import axios from "axios";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";

const AdminMessges = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const AdminID = userData?.id; // Assuming admin's ID is stored here

  const [patientImage, setPatientImage] = useState({});
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [searchText, setSearchText] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});

  const intervalRef = useRef(null);

  // Polling messages when a contact is selected
  useEffect(() => {
    if (AdminID && selectedContactId) {
      fetchMessages(selectedContactId, selectedContact);

      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        fetchMessages(selectedContactId, selectedContact);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [AdminID, selectedContactId]);

  useEffect(() => {
    fetchDoctors();
    fetchPatients();
    fetchUnreadMessages();
  }, []);

  // Fetch Admin's profile picture or info
  const fetchAdminInfo = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/profile/${AdminID}`);
      setPatientImage(res.data); // admin image or info
    } catch (err) {
      console.error("Admin profile fetch failed:", err);
    }
  };

  // Fetch unread messages
  const fetchUnreadMessages = async () => {
    try {
      const res = await axios.post(
        `${Config.BASE_URL}/api/chat/conversations`,
        {
          user_id: AdminID,
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

  // Fetch all doctors
  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/admingetAllDoctors`);
      setDoctors(res.data.doctors);
    } catch (err) {
      console.error("Doctors fetch failed:", err);
    }
  };

  // Fetch all patients
  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${Config.BASE_URL}/api/admingetAllPatients`);
      setPatients(res.data.patients);
    } catch (err) {
      console.error("Patients fetch failed:", err);
    }
  };

  // Combine doctors and patients into one list
  const allContacts = [
    ...doctors.map((doc) => ({ ...doc, type: "doctor" })),
    ...patients.map((pat) => ({ ...pat, type: "patient" })),
  ];

  // Filter contacts based on search
  const filteredContacts = allContacts.filter((item) => {
    const name = `${item.firstname || ""} ${item.lastname || ""}`.toLowerCase();
    return name.includes(searchText.toLowerCase());
  });

  // Fetch messages for a contact
  const fetchMessages = async (contactId, contactInfo) => {
    markAsRead(contactId);
    try {
      const payload = { user_1: AdminID, user_2: contactId };
      const res = await axios.post(
        `${Config.BASE_URL}/api/chat/fetch`,
        payload
      );
      if (res.data.success) {
        setMessages(res.data.messages);
        setSelectedContact(contactInfo);
        setSelectedContactId(contactId);
      }
    } catch (err) {
      console.error("Chat fetch failed:", err);
    }
  };

  // Mark messages as read
  const markAsRead = async (contactId) => {
    try {
      const payload = {
        sender_id: contactId,
        receiver_id: AdminID,
      };
      const res = await axios.post(
        `${Config.BASE_URL}/api/chat/mark-as-read`,
        payload
      );
      fetchUnreadMessages();
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedContact) return;

    const payload = {
      sender_id: AdminID,
      receiver_id: selectedContact.id,
      message: messageInput,
    };

    try {
      const res = await axios.post(`${Config.BASE_URL}/api/chat/send`, payload);
      if (res.data.success) {
        const newMessage = {
          ...payload,
          sender_id: String(AdminID),
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, newMessage]);
        setMessageInput("");
      }
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  return (
    <>
      <div className="d-flex">
        <AdminSidebar />
        <div className="flex-grow-1 content-area">
          <AdminNavbar />
          <div
            className="container-fluid roundend p-3 pt-0"
            style={{ backgroundColor: "#F7F9FC", minHeight: "100vh" }}
          >
            <h5
              className="mb-1 pb-2 fw-bold"
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
              <div className="col-lg-8 col-md-7 mb-3">
                <div
                  className="bg-white rounded p-2 d-flex flex-column"
                  style={{ height: "600px" }}
                >
                  <div
                    className="d-flex align-items-center border rounded mb-3 p-3"
                    style={{ backgroundColor: "rgba(224, 234, 243, 1)" }}
                  >
                    <h6 className="mb-0">
                      {selectedContact
                        ? `${selectedContact.firstname} ${selectedContact.lastname}`
                        : "Select a Contact"}
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
                          {msg.sender_id === String(AdminID) ? (
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
                                src={`${Config.BASE_URL}/${selectedContact.profile_image}`}
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
                      disabled={!selectedContact}
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

                  {filteredContacts.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() =>
                        fetchMessages(item.id || item.user_id, item)
                      }
                      className="d-flex align-items-start rounded p-2 mt-2"
                      style={{
                        backgroundColor:
                          selectedContactId === (item.id || item.user_id)
                            ? "rgba(224, 234, 243, 1)"
                            : "#ffffff",
                        cursor: "pointer",
                      }}
                    >
                      <div className="me-3 position-relative">
                        <img
                          src={
                            item.profile_image
                              ? `${Config.BASE_URL}/${item.profile_image}`
                              : messagercv
                          }
                          alt="profile"
                          className="img-fluid rounded-circle"
                          style={{ width: "40px", height: "40px" }}
                        />
                        {item.is_online === "1" && (
                          <span
                            className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-white rounded-circle"
                            style={{ width: "10px", height: "10px" }}
                          ></span>
                        )}
                      </div>
                      <div className="d-flex flex-column">
                        <span className="fw-bold small">
                          {item.firstname} {item.lastname}
                        </span>
                        <span className="text-muted small">
                          {item.type === "doctor" ? "Doctor" : "Patient"}
                        </span>
                      </div>
                      <div className="ms-auto text-end text-muted">
                        {unreadCounts[item.id || item.user_id] > 0 ? (
                          <span className="small text-danger">
                            {unreadCounts[item.id || item.user_id]} Message
                            {unreadCounts[item.id || item.user_id] > 1
                              ? "s"
                              : ""}
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

export default AdminMessges;
