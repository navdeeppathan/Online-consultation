import axios from "axios";
import React, { useEffect, useState } from "react";
import Config from "../../config";
import AdminSidebar from "../utils/AdminSidebar";
import AdminNavbar from "../utils/AdminNavbar";
import toast, { Toaster } from "react-hot-toast";

const AdminContactusPage = () => {
  const [messages, setMessages] = useState([]);
  const [replyModal, setReplyModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactMessages = async () => {
      try {
        const response = await axios.get(`${Config.BASE_URL}/api/contact-us`);
        setMessages(response.data);
      } catch (err) {
        toast.error("Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchContactMessages();
  }, []);

  // Open reply modal
  const handleReplyClick = (user) => {
    setSelectedUser(user);
    setReplyModal(true);
  };

  // Send reply
  const [sending, setSending] = useState(false);

  // Send reply
  const handleSendReply = async () => {
    setSending(true);
    try {
      await axios.post(`${Config.BASE_URL}/api/send-reply`, {
        email: selectedUser.email,
        subject: `Reply to: ${selectedUser.subject}`,
        message: replyMessage,
      });

      toast.success("Reply sent successfully");

      setReplyModal(false);
      setReplyMessage("");
    } catch (err) {
      console.error("Error sending reply:", err);
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="d-flex">
      <AdminSidebar />
      <div className="flex-grow-1 content-area">
        <AdminNavbar />

        <div className="container py-4">
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="row g-4">
              {messages.map((msg) => (
                <div className="col-12 col-md-6 col-lg-4" key={msg.id}>
                  <div className="card shadow-sm h-100 text-center p-3">
                    {/* Avatar */}
                    <div
                      className="mx-auto rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                      style={{
                        width: "60px",
                        height: "60px",
                        backgroundColor: "#6f42c1",
                        fontSize: "18px",
                      }}
                    >
                      {msg.full_name.substring(0, 2).toUpperCase()}
                    </div>

                    {/* User Info */}
                    <h5 className="mt-3 mb-1">{msg.full_name}</h5>
                    <p className="mb-0">✉️ {msg.email}</p>
                    <p className="mb-1">📞 {msg.phone_number}</p>

                    {/* Contact Info */}
                    <div className="text-start small mt-2">
                      {/* Subject */}
                      <div className="mt-3 p-2 border rounded bg-light text-start">
                        <strong>Subject:</strong>
                        <p className="text-muted mb-0">{msg.subject}</p>
                      </div>

                      {/* Message */}
                      <div className="mt-2 p-2 border rounded bg-light text-start">
                        <strong>Message:</strong>
                        <p className="mb-0">{msg.message}</p>
                      </div>
                    </div>

                    {/* Reply Button */}
                    <button
                      className="btn btn-primary btn-sm mt-3"
                      onClick={() => handleReplyClick(msg)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {replyModal && (
          <div
            className="modal show fade d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Reply to {selectedUser?.full_name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setReplyModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <textarea
                    className="form-control"
                    rows="5"
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your reply..."
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setReplyModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={!replyMessage.trim() || sending}
                    onClick={handleSendReply}
                  >
                    {sending ? (
                      <div className="btn-loader"></div>
                    ) : (
                      "Send Reply"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
         .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
          }

          .loader, .circle-loader {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #7288f1;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
          }

          .circle-loader {
            width: 20px;
            height: 20px;
            border-width: 3px;
          }

          
  .btn-loader {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #fff;
    border-right: 3px solid #fff;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    animation: spin 0.6s linear infinite;
    display: inline-block;
  }

  @keyframes spin {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}
      </style>
    </div>
  );
};

export default AdminContactusPage;
